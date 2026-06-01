(function () {
    const SHOW_AFTER = 320;

    function init() {
        const button = document.createElement("button");
        button.className = "top-link";
        button.type = "button";
        button.setAttribute("aria-label", "返回顶部");
        button.title = "返回顶部 (Alt+G)";
        button.innerHTML =
            '<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5"></path><path d="m5 12 7-7 7 7"></path></svg>';

        button.addEventListener("click", function () {
            window.scrollTo({ top: 0, behavior: "smooth" });
        });

        document.addEventListener("keydown", function (event) {
            if (event.altKey && event.key.toLowerCase() === "g") {
                event.preventDefault();
                window.scrollTo({ top: 0, behavior: "smooth" });
            }
        });

        document.body.appendChild(button);

        function updateVisibility() {
            button.classList.toggle("is-visible", window.scrollY > SHOW_AFTER);
        }

        updateVisibility();
        window.addEventListener("scroll", updateVisibility, { passive: true });
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();
