(function () {
    const mobileQuery = window.matchMedia("(max-width: 760px)");

    function init() {
        const registry = new Map();

        function closeAll(exceptId) {
            registry.forEach(({ note, toggle }, id) => {
                if (id === exceptId) return;
                note.classList.remove("is-expanded");
                toggle.classList.remove("is-expanded");
                toggle.setAttribute("aria-expanded", "false");
            });
        }

        function expandNote(note, toggle) {
            note.classList.add("is-expanded");
            toggle.classList.add("is-expanded");
            toggle.setAttribute("aria-expanded", "true");
            note.scrollIntoView({ block: "nearest", behavior: "smooth" });
        }

        function collapseNote(note, toggle) {
            note.classList.remove("is-expanded");
            toggle.classList.remove("is-expanded");
            toggle.setAttribute("aria-expanded", "false");
        }

        function handleToggle(event) {
            if (!mobileQuery.matches) {
                return;
            }

            event.preventDefault();

            const targetId = event.currentTarget.dataset.marginnoteTarget;
            const entry = registry.get(targetId);
            if (!entry) return;

            const { note, toggle } = entry;
            const willOpen = !note.classList.contains("is-expanded");

            if (willOpen) {
                closeAll(targetId);
                expandNote(note, toggle);
            } else {
                collapseNote(note, toggle);
            }
        }

        function registerToggle(toggle, note) {
            if (!toggle || !note) return;

            toggle.dataset.marginnoteTarget = note.id;
            registry.set(note.id, { note, toggle });
            toggle.addEventListener("click", handleToggle);
        }

        function setupMarkdownFootnotes() {
            const footnotes = document.querySelector(".entry-content .footnotes");
            if (!footnotes) return;

            const refs = document.querySelectorAll(
                '.entry-content a.footnote-ref[href^="#"]'
            );
            if (!refs.length) return;

            let converted = 0;

            refs.forEach((ref) => {
                const footnoteId = decodeURIComponent(ref.getAttribute("href").slice(1));
                const source = document.getElementById(footnoteId);
                if (!source) return;

                const wrapper = ref.closest("sup") || ref;
                const note = document.createElement("aside");
                const noteId = `${footnoteId}-sidenote`;

                note.id = noteId;
                note.className = "marginnote sidenote footnote-sidenote";
                note.setAttribute("role", "note");

                const content = source.cloneNode(true);
                content.removeAttribute("id");
                content.querySelectorAll(".footnote-backref").forEach((backref) => {
                    backref.remove();
                });

                const number = document.createElement("sup");
                number.className = "marginnote-number";
                number.textContent = ref.textContent;
                note.append(number, " ");

                const onlyParagraph = content.children.length === 1 && content.firstElementChild.matches("p");
                const contentRoot = onlyParagraph ? content.firstElementChild : content;
                while (contentRoot.firstChild) {
                    note.appendChild(contentRoot.firstChild);
                }

                wrapper.classList.add("footnote-ref-wrapper");
                ref.classList.add("sidenote-number");
                ref.setAttribute("href", `#${noteId}`);
                ref.setAttribute("aria-controls", noteId);
                ref.setAttribute("aria-expanded", "false");

                wrapper.insertAdjacentElement("afterend", note);
                registerToggle(ref, note);
                converted += 1;
            });

            if (converted > 0) {
                footnotes.classList.add("has-sidenotes");
                footnotes.setAttribute("aria-hidden", "true");
            }
        }

        function setupExplicitToggles() {
            const toggles = document.querySelectorAll(
                ".marginnote-toggle[aria-controls]"
            );

            toggles.forEach((toggle) => {
                const targetId = toggle.getAttribute("aria-controls");
                if (!targetId) return;

                const note = document.getElementById(targetId);
                if (!note) return;

                toggle.setAttribute("aria-expanded", "false");
                registerToggle(toggle, note);
            });
        }

        function openFromHash() {
            if (!mobileQuery.matches) return;

            const hash = window.location.hash;
            if (!hash) return;

            const targetId = decodeURIComponent(hash.slice(1));
            const entry = registry.get(targetId);
            if (!entry) return;

            closeAll(targetId);
            expandNote(entry.note, entry.toggle);
        }

        setupMarkdownFootnotes();
        setupExplicitToggles();
        openFromHash();

        window.addEventListener("hashchange", openFromHash);

        mobileQuery.addEventListener("change", () => {
            if (!mobileQuery.matches) {
                registry.forEach(({ note, toggle }) => {
                    note.classList.remove("is-expanded");
                    toggle.classList.remove("is-expanded");
                    toggle.setAttribute("aria-expanded", "false");
                });
            }
        });
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();
