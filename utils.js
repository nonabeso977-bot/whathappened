const Utils = {

    getElement(id) {
        return document.getElementById(id);
    },

    qs(selector, parent = document) {
        return parent.querySelector(selector);
    },

    qsa(selector, parent = document) {
        return Array.from(
            parent.querySelectorAll(selector)
        );
    },

    escapeHTML(text) {
        return String(text ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    },

    showMessage(title, content) {
        if (
            typeof App !== "undefined" &&
            typeof App.openMessage === "function"
        ) {
            App.openMessage(title, content);
            return;
        }

        alert(title + "\n\n" + content);
    },

    createId(prefix = "id") {
        return (
            prefix +
            "_" +
            Date.now() +
            "_" +
            Math.random()
                .toString(36)
                .slice(2, 8)
        );
    },

    getToday() {
        const date = new Date();

        return (
            date.getFullYear() +
            "-" +
            String(date.getMonth() + 1).padStart(2, "0") +
            "-" +
            String(date.getDate()).padStart(2, "0")
        );
    },

    getYesterday() {
        const date = new Date();
        date.setDate(date.getDate() - 1);

        return (
            date.getFullYear() +
            "-" +
            String(date.getMonth() + 1).padStart(2, "0") +
            "-" +
            String(date.getDate()).padStart(2, "0")
        );
    },

    isEmpty(value) {
        return (
            value === null ||
            value === undefined ||
            String(value).trim() === ""
        );
    },

    getValue(id) {
        const element = this.getElement(id);

        if (!element) return "";

        return element.value.trim();
    },

    setText(id, text) {
        const element = this.getElement(id);

        if (!element) return;

        element.textContent = text;
    },

    hide(id) {
        const element = this.getElement(id);

        if (!element) return;

        element.style.display = "none";
    },

    show(id, display = "block") {
        const element = this.getElement(id);

        if (!element) return;

        element.style.display = display;
    }

};

console.log("♡ Utils loaded");