(function () {
    const SELECTOR = ".entry-content figure img:not(.no-zoom)";

    function captionFor(image) {
        const caption = image.closest("figure")?.querySelector("figcaption");
        const text = caption?.textContent || image.getAttribute("alt") || "";
        return text.replace(/\s+/g, " ").trim();
    }

    function init() {
        const images = Array.from(document.querySelectorAll(SELECTOR)).filter((image) => {
            if (image.closest("a")) return false;
            return image.currentSrc || image.src;
        });
        if (!images.length) return;

        let currentIndex = 0;
        const overlay = document.createElement("div");
        overlay.className = "image-lightbox";
        overlay.setAttribute("role", "dialog");
        overlay.setAttribute("aria-modal", "true");
        overlay.setAttribute("aria-label", "图片预览");
        overlay.hidden = true;
        overlay.innerHTML = [
            '<button class="image-lightbox-close" type="button" aria-label="关闭图片预览" title="关闭 (Esc)">',
            '<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>',
            "</button>",
            '<button class="image-lightbox-nav image-lightbox-prev" type="button" aria-label="上一张图片" title="上一张">',
            '<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"></path></svg>',
            "</button>",
            '<figure class="image-lightbox-figure">',
            '<img class="image-lightbox-image" alt="">',
            '<figcaption class="image-lightbox-caption"></figcaption>',
            "</figure>",
            '<button class="image-lightbox-nav image-lightbox-next" type="button" aria-label="下一张图片" title="下一张">',
            '<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"></path></svg>',
            "</button>",
        ].join("");
        document.body.appendChild(overlay);

        const preview = overlay.querySelector(".image-lightbox-image");
        const caption = overlay.querySelector(".image-lightbox-caption");
        const closeButton = overlay.querySelector(".image-lightbox-close");
        const previousButton = overlay.querySelector(".image-lightbox-prev");
        const nextButton = overlay.querySelector(".image-lightbox-next");
        const navButtons = [previousButton, nextButton];

        function update() {
            const image = images[currentIndex];
            const src = image.currentSrc || image.src;
            const text = captionFor(image);

            preview.src = src;
            preview.alt = image.getAttribute("alt") || text || "图片预览";
            caption.textContent = text;
            caption.hidden = !text;
            navButtons.forEach((button) => {
                button.hidden = images.length < 2;
            });
        }

        function open(index) {
            currentIndex = index;
            update();
            overlay.hidden = false;
            document.documentElement.classList.add("has-image-lightbox");
            closeButton.focus({ preventScroll: true });
        }

        function close() {
            overlay.hidden = true;
            preview.removeAttribute("src");
            document.documentElement.classList.remove("has-image-lightbox");
            images[currentIndex]?.focus({ preventScroll: true });
        }

        function move(direction) {
            if (images.length < 2) return;
            currentIndex = (currentIndex + direction + images.length) % images.length;
            update();
        }

        images.forEach((image, index) => {
            image.classList.add("is-zoomable");
            image.tabIndex = 0;
            image.setAttribute("role", "button");
            image.setAttribute("aria-label", "打开图片预览");

            image.addEventListener("click", function () {
                open(index);
            });

            image.addEventListener("keydown", function (event) {
                if (event.key !== "Enter" && event.key !== " ") return;
                event.preventDefault();
                open(index);
            });
        });

        closeButton.addEventListener("click", close);
        previousButton.addEventListener("click", function () {
            move(-1);
        });
        nextButton.addEventListener("click", function () {
            move(1);
        });

        overlay.addEventListener("click", function (event) {
            if (event.target === overlay) close();
        });

        document.addEventListener("keydown", function (event) {
            if (overlay.hidden) return;

            if (event.key === "Escape") {
                close();
                return;
            }

            if (event.key === "ArrowLeft") {
                event.preventDefault();
                move(-1);
                return;
            }

            if (event.key === "ArrowRight") {
                event.preventDefault();
                move(1);
            }
        });
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();
