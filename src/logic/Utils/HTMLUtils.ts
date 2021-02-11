import FORMATTERS from "../formatter";
import ObjectUtils from "./ObjectUtils";
import DOMPurify from "dompurify";

declare global {
	interface HTMLElement {
		$<T extends HTMLElement>(query: string): T;
		remove(): void;
	}
}

export const $ = <T extends HTMLElement>(query: string) => document.querySelector<T>(query);
export const $$ = <T extends HTMLElement>(query: string) => document.querySelectorAll<T>(query);

HTMLElement.prototype.$ = function <T extends HTMLElement>(query: string) {
	return (this as HTMLElement).querySelector<T>(query);
};

HTMLElement.prototype.remove = function () {
	(this as HTMLElement).parentNode.removeChild(this);
};

export const removeAllElements = (selector: string) => {
	$$<HTMLDivElement>(selector).forEach((element) => {
		element.parentNode.removeChild(element);
	});
};
export const removeAllEventListeners = (selector: string) => {
	const el = $(selector);
	const elClone = el.cloneNode(true);
	el.parentNode.replaceChild(elClone, el);
};
export const getDirectNodeText = (node: any) => {
	let child = node.firstChild;
	const texts = [];

	while (child) {
		if (child.nodeType == 3) {
			texts.push(child.data);
		}
		child = child.nextSibling;
	}

	return texts.join("");
};

export const fillNodes = (nodes: any, data: any) => {
	const toDelete: (HTMLElement | Node)[][] = [];

	nodes.forEach((node: HTMLElement) => {
		const dataset: DOMStringMap | undefined = node.dataset;
		if (dataset) {
			const { formatter, valueFormatter, onclick, hide, hideTooLong } = dataset;
			const regex = /{{(.*?)}}/g;

			const getNodeValue = (path: string) => {
				let value = ObjectUtils.get(path, data);

				if (valueFormatter) {
					const f: any = FORMATTERS;

					if (/\((.*?)\)/.test(valueFormatter)) {
						const p = valueFormatter.match(/\((.*?)\)/);
						const params = p[1].split(",");
						const valueFormatterName = valueFormatter.split("(")[0];
						if (!f[valueFormatterName]) {
							// eslint-disable-next-line no-console
							console.error(`Value formatter ${valueFormatterName} cannot be found.`);
							return;
						}

						value = f[valueFormatterName](value, ...params);
						// Has parameter
					} else {
						if (!f[valueFormatter]) {
							// eslint-disable-next-line no-console
							console.error(`Value formatter ${valueFormatter} cannot be found.`);
							return;
						}
						// No parameter
						value = f[valueFormatter](value);
					}
				}
				return value;
			};

			// Check inner text
			const text = getDirectNodeText(node);

			if (regex.test(text)) {
				let t;
				if (formatter) {
					const f: any = FORMATTERS;
					const object: any = {};
					text.replace(regex, (_, p1) => (object[p1] = getNodeValue(p1)));
					if (!f[formatter]) {
						// eslint-disable-next-line no-console
						console.error(`Formatter ${formatter} cannot be found.`);
						return;
					}
					t = f[formatter](text, object);
				} else {
					t = text.replace(regex, (_, p1) => getNodeValue(p1));
				}

				const clean = DOMPurify.sanitize(t, { USE_PROFILES: { html: true } });
				if (!clean || clean.indexOf("undefined") !== -1 || clean.indexOf("null") !== -1) {
					toDelete.push([node.parentNode, node]);
				}
				node.innerHTML = clean;
			}

			// Check properties
			if (node.hasAttributes()) {
				const attrs = node.attributes;
				for (let i = attrs.length - 1; i >= 0; i--) {
					const val: string = attrs[i].value;
					if (regex.test(val)) {
						const v = val.replace(regex, (_, p1) => getNodeValue(p1));
						const clean = DOMPurify.sanitize(v, { USE_PROFILES: { html: true } });
						attrs[i].value = clean;
					}
				}
			}

			// If onclick
			if (onclick) {
				const fn = ObjectUtils.get(onclick, data);
				if (!fn) {
					// eslint-disable-next-line no-console
					console.error(`OnClick function with the name ${onclick} cannot be found!`);
				}
				node.addEventListener("click", fn);
			}

			//If hide
			if (hide) {
				const hideVal = String(ObjectUtils.get(hide, data));

				if (!hideVal || hideVal.indexOf("undefined") !== -1 || hideVal.indexOf("null") !== -1 || hideVal === "false") {
					toDelete.push([node.parentNode, node]);
				}
			}
		}

		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		fillNodes(node.childNodes, data);
	});

	toDelete.forEach((item) => {
		item[0].removeChild(item[1]);
	});
};

export const lockScrolling = () => {
	$<HTMLBodyElement>("body").classList.add("lock-scroll");
	$<HTMLHtmlElement>("html").classList.add("lock-scroll");
};
export const unlockScrolling = () => {
	$<HTMLBodyElement>("body").classList.remove("lock-scroll");
	$<HTMLHtmlElement>("html").classList.remove("lock-scroll");
};
