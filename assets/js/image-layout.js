(function () {
    function getFigure(container) {
        if (!container) return null;
        if (container.matches("figure")) return container;
        if (container.matches("p") && container.children.length === 1) {
            const figure = container.firstElementChild;
            return figure?.matches("figure") ? figure : null;
        }
        return null;
    }

    function isFigureContainer(container) {
        const figure = getFigure(container);
        return (
            figure &&
            figure.matches("figure:not(.fullwidth):not(.wide):not(.gallery)") &&
            figure.querySelector(":scope > img") &&
            !figure.classList.contains("no-auto-gallery")
        );
    }

    function collectRun(start) {
        const run = [];
        let current = start;

        while (isFigureContainer(current)) {
            run.push(current);
            current = current.nextElementSibling;
        }

        return run;
    }

    function isCaptionParagraph(element) {
        if (!element?.matches("p")) return false;
        if (element.children.length > 0) return false;

        const text = element.textContent.trim();
        return text.length > 0 && text.length <= 80;
    }

    function isShortCaptionText(text) {
        const clean = text.replace(/\s+/g, " ").trim();
        return clean.length > 0 && clean.length <= 80;
    }

    function appendCaption(figure, text) {
        if (!figure || figure.querySelector(":scope > figcaption")) return;

        const clean = text.replace(/\s+/g, " ").trim();
        if (!isShortCaptionText(clean)) return;

        const caption = document.createElement("figcaption");
        caption.className = "figure-caption inline-caption";
        caption.textContent = clean;
        figure.appendChild(caption);
    }

    function setupMixedFigureParagraphs() {
        const paragraphs = document.querySelectorAll(".entry-content > p");

        paragraphs.forEach((paragraph) => {
            const figures = Array.from(paragraph.children).filter((child) =>
                child.matches("figure:not(.fullwidth):not(.wide):not(.gallery)")
            );
            if (figures.length < 2) return;

            let activeFigure = null;
            let captionNodes = [];

            function flushCaption() {
                if (!activeFigure || captionNodes.length === 0) return;

                const text = captionNodes.map((node) => node.textContent || "").join("");
                appendCaption(activeFigure, text);
                captionNodes.forEach((node) => node.remove());
                captionNodes = [];
            }

            Array.from(paragraph.childNodes).forEach((node) => {
                if (node.nodeType === 1 && node.matches("figure")) {
                    flushCaption();
                    activeFigure = node;
                    return;
                }

                if (activeFigure && node.nodeType === 3 && isShortCaptionText(node.textContent || "")) {
                    captionNodes.push(node);
                }
            });

            flushCaption();

            figures.forEach((figure) => {
                figure.classList.add("auto-gallery");
            });
            paragraph.classList.add("auto-gallery-item");
        });
    }

    function setupTopLevelFigureTextCaptions() {
        const content = document.querySelector(".entry-content");
        if (!content) return;

        let activeFigure = null;
        let captionNodes = [];

        function flushCaption() {
            if (!activeFigure || captionNodes.length === 0) return;

            const text = captionNodes.map((node) => node.textContent || "").join("");
            const belongsToFigureRun =
                activeFigure.previousElementSibling?.matches("figure:not(.fullwidth):not(.wide):not(.gallery)") ||
                activeFigure.nextElementSibling?.matches("figure:not(.fullwidth):not(.wide):not(.gallery)");

            if (belongsToFigureRun) {
                appendCaption(activeFigure, text);
                captionNodes.forEach((node) => node.remove());
            }
            captionNodes = [];
        }

        Array.from(content.childNodes).forEach((node) => {
            if (node.nodeType === 1 && node.matches("figure:not(.fullwidth):not(.wide):not(.gallery)")) {
                flushCaption();
                activeFigure = node;
                return;
            }

            if (activeFigure && node.nodeType === 3 && isShortCaptionText(node.textContent || "")) {
                captionNodes.push(node);
                return;
            }

            if (node.nodeType === 1 && node.matches("p") && !node.textContent.trim() && node.children.length === 0) {
                node.remove();
                return;
            }

            flushCaption();
            activeFigure = null;
        });

        flushCaption();
    }

    function hasFigureNeighbor(imageContainer, captionParagraph) {
        return (
            isFigureContainer(imageContainer.previousElementSibling) ||
            isFigureContainer(captionParagraph.nextElementSibling)
        );
    }

    function setupLooseCaptions() {
        const children = Array.from(document.querySelector(".entry-content")?.children || []);

        children.forEach((container) => {
            if (!isFigureContainer(container)) return;

            const figure = getFigure(container);
            if (!figure || figure.querySelector(":scope > figcaption")) return;

            const next = container.nextElementSibling;
            if (!isCaptionParagraph(next) || !hasFigureNeighbor(container, next)) return;

            const caption = document.createElement("figcaption");
            caption.className = "figure-caption inline-caption";
            caption.textContent = next.textContent.trim();
            figure.appendChild(caption);
            next.remove();
        });
    }

    function initAutoGallery() {
        setupMixedFigureParagraphs();
        setupTopLevelFigureTextCaptions();

        const figures = document.querySelectorAll(".entry-content > figure, .entry-content > p");
        const visited = new Set();

        figures.forEach((container) => {
            if (visited.has(container) || !isFigureContainer(container)) return;

            const run = collectRun(container);
            run.forEach((item) => visited.add(item));

            if (run.length < 2) return;

            const group = document.createElement("div");
            group.className = "auto-gallery-group";
            run[0].before(group);

            run.forEach((item) => {
                const figure = getFigure(item);
                figure?.classList.add("auto-gallery");
                item.classList.add("auto-gallery-item");
                group.appendChild(item);
            });
        });
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initAutoGallery);
    } else {
        initAutoGallery();
    }
})();
