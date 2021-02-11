export default class ObjectUtils {
	public static get = (path: string, obj: any) => {
		if (!obj) return;
		let value: any;
		const subPaths = path.split(".");
		let current = obj;
		subPaths.forEach((item, i) => {
			if (i === subPaths.length - 1) {
				return (value = current[item]);
			}
			if (current !== undefined) current = current[item];
		});
		return value;
	};

	public static set = (path: string, obj: any, value: any) => {
		const subPaths = path.split(".");
		let currentObject = obj;
		subPaths.forEach((item, i) => {
			if (i === subPaths.length - 1) {
				currentObject[item] = value;
				return;
			}
			const regex = /\[(.*?)\]/;

			if (regex.test(item)) {
				const index = item.match(regex)?.[1];
				if (String(index).length === 0) return;
				const arrName = item.slice(0, item.length - (String(index).length + 2));

				if (!currentObject[arrName]) currentObject[arrName] = [];
				if (!currentObject[arrName][Number(index)]) currentObject[arrName][Number(index)] = {};
				currentObject = currentObject[arrName][Number(index)];
			} else {
				if (!currentObject[item]) currentObject[item] = {};
				currentObject = currentObject[item];
			}
		});
	};
}
