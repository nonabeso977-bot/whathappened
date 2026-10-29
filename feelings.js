/* ========================================
   Friends Boxes Open ♡
   Feelings System
======================================== */

const Feelings = {

    storageKey: "current_feeling",

    feelings: {

        happy: {
            name: "سعيدة",
            icon: "☀️"
        },

        calm: {
            name: "هادئة",
            icon: "☕"
        },

        anxious: {
            name: "متوترة",
            icon: "🌿"
        },

        scared: {
            name: "خايفة",
            icon: "🌙"
        },

        sad: {
            name: "حزينة",
            icon: "🌧️"
        },

        lonely: {
            name: "وحيدة",
            icon: "♡"
        }

    },

    get() {

        const saved = Storage.get(
            this.storageKey,
            null
        );

        if (!saved) {
            return null;
        }

        // يدعم الصيغة القديمة والجديدة

        if (
            saved.id &&
            this.feelings[saved.id]
        ) {
            return saved;
        }

        const savedName =
            saved.name || saved.text;

        const entry =
            Object.entries(this.feelings)
                .find(([id, feeling]) =>
                    feeling.name === savedName
                );

        if (!entry) {
            return null;
        }

        const [id, feeling] = entry;

        return {
            id: id,
            name: feeling.name,
            icon: saved.icon || feeling.icon,
            date: saved.date || null
        };

    },

    set(feelingId) {

        // قبول المعرّف الإنجليزي أو الاسم العربي

        const entry =
            Object.entries(this.feelings)
                .find(([id, feeling]) =>
                    id === feelingId ||
                    feeling.name === feelingId
                );

        if (!entry) {
            return null;
        }

        const [id, feelingData] = entry;

        const feeling = {

            id: id,

            name: feelingData.name,

            icon: feelingData.icon,

            date: new Date().toISOString()

        };

        Storage.save(
            this.storageKey,
            feeling
        );

        return feeling;

    },

    clear() {

        Storage.remove(
            this.storageKey
        );

    },

    getDisplayText() {

        const feeling = this.get();

        if (!feeling) {
            return "كيف تشعر اليوم؟ ♡";
        }

        return feeling.icon + " " + feeling.name;

    },

    getProfileText() {

        const feeling = this.get();

        if (!feeling) {
            return "🌿";
        }

        return feeling.icon;

    },

    renderHome() {

        const icon =
            document.getElementById(
                "currentFeelingIcon"
            );

        const text =
            document.getElementById(
                "currentFeelingText"
            );

        if (!icon || !text) {
            return;
        }

        const feeling = this.get();

        if (!feeling) {

            icon.textContent = "🌿";
            text.textContent = "موتر";

            return;
        }

        icon.textContent = feeling.icon;
        text.textContent = feeling.name;

    },

    renderProfile() {

        const element =
            document.getElementById(
                "profileFeeling"
            );

        if (!element) {
            return;
        }

        const feeling = this.get();

        element.textContent =
            feeling ? feeling.icon : "🌿";

    },

    renderSelection() {

        const current = this.get();

        document
            .querySelectorAll(".feeling-option")
            .forEach(button => {

                button.classList.toggle(
                    "selected",
                    Boolean(
                        current &&
                        button.dataset.feeling === current.id
                    )
                );

            });

    },

    choose(feelingId) {

        const feeling = this.set(feelingId);

        if (!feeling) {
            return;
        }

        this.renderHome();
        this.renderProfile();
        this.renderSelection();

    }

};


/* ========================================
   تشغيل نظام المشاعر
======================================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        Feelings.renderHome();
        Feelings.renderProfile();
        Feelings.renderSelection();

        const container =
            document.querySelector(".feelings-grid");

        if (!container) {
            return;
        }

        container.addEventListener(
            "click",
            event => {

                const button =
                    event.target.closest(".feeling-option");

                if (!button) {
                    return;
                }

                Feelings.choose(
                    button.dataset.feeling
                );

            }
        );

    }
);