(function () {
    function isPlainImageFigure(figure) {
        return (
            figure &&
            figure.matches(".entry-content > figure:not(.fullwidth):not(.wide):not(.gallery)") &&
            figure.querySelector(":scope > img") &&
            !figure.querySelector(":scope > figcaption")
        );
    }

    function collectRun(start) {
        const run = [];
        let current = start;

        while (isPlainImageFigure(current)) {
            run.push(current);
            current = current.nextElementSibling;
        }

        return run;
    }

    function initAutoGallery() {
        const figures = document.querySelectorAll(".entry-content > figure");
        const visited = new Set();

        figures.forEach((figure) => {
            if (visited.has(figure) || !isPlainImageFigure(figure)) return;

            const run = collectRun(figure);
            run.forEach((item) => visited.add(item));

            if (run.length < 2) return;

            run.forEach((item) => {
                item.classList.add("auto-gallery");
            });
        });
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initAutoGallery);
    } else {
        initAutoGallery();
    }
})();
