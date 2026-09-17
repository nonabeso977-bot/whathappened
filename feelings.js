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

        return Storage.get(
            this.storageKey,
            null
        );

    },


    set(feelingId) {

        if (!this.feelings[feelingId]) {
            return null;
        }

        const feeling = {

            id: feelingId,

            name:
                this.feelings[feelingId].name,

            icon:
                this.feelings[feelingId].icon,

            date:
                new Date().toISOString()

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

        const feeling =
            this.get();

        if (!feeling) {
            return "كيف تشعر اليوم؟ ♡";
        }

        return (
            feeling.icon +
            " " +
            feeling.name
        );

    },


    getProfileText() {

        const feeling =
            this.get();

        if (!feeling) {
            return "🌿";
        }

        return (
            feeling.icon
        );

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

        const feeling =
            this.get();

        if (!icon || !text) {
            return;
        }

        if (!feeling) {

            icon.textContent =
                "🌿";

            text.textContent =
                "موتر";

            return;

        }

        icon.textContent =
            feeling.icon;

        text.textContent =
            feeling.name;

    },


    renderProfile() {

        const element =
            document.getElementById(
                "profileFeeling"
            );

        if (!element) {
            return;
        }

        const feeling =
            this.get();

        if (!feeling) {

            element.textContent =
                "🌿";

            return;

        }

        element.textContent =
            feeling.icon;

    },


    renderSelection() {

        const current =
            this.get();

        document
            .querySelectorAll(
                ".feeling-option"
            )
            .forEach(button => {

                button.classList.remove(
                    "selected"
                );

                if (
                    current &&
                    button.dataset.feeling ===
                    current.id
                ) {

                    button.classList.add(
                        "selected"
                    );

                }

            });

    },


    choose(feelingId) {

        const feeling =
            this.set(feelingId);

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
            document.querySelector(
                ".feelings-grid"
            );


        if (!container) {
            return;
        }


        container.addEventListener(
            "click",
            event => {

                const button =
                    event.target.closest(
                        ".feeling-option"
                    );

                if (!button) {
                    return;
                }


                const feelingId =
                    button.dataset.feeling;


                Feelings.choose(
                    feelingId
                );

            }
        );

    }
);