let btn = document.querySelectorAll("#menu-btn"),
	menu = document.querySelector("#menu-content");

btn.forEach((item) => {
	item.addEventListener("click", () => {
		btn.forEach((item) => item.classList.remove("menu__button--active"));

		item.classList.add("menu__button--active");
		menu.className = "menu__content";

		attr = item.getAttribute("data-food");
		menu.classList.add(attr);
	});
});
