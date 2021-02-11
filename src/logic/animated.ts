export const addAnchorNavigation = () => {
	// eslint-disable-next-line @typescript-eslint/quotes
	document.querySelectorAll('.content a[href^="#"]').forEach((anchor) => {
		anchor.addEventListener("click", function (e) {
			e.preventDefault();

			document.querySelector(this.getAttribute("href")).scrollIntoView({
				behavior: "smooth",
			});
		});
	});
};
