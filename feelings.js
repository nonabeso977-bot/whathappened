/* ========================================
   Friends Boxes Open ♡
   Feelings System
======================================== */

const Feelings = {

    storageKey: "current_feeling",

    feelings: {

        happy: {
            name: "سعيد",
            icon: "☀️"
        },

        sad: {
            name: "حزين",
            icon: "🌧️"
        },

        anxious: {
            name: "موتر",
            icon: "🌿"
        },

        scared: {
            name: "خايف",
            icon: "🌙"
        },

        calm: {
            name: "هادئ",
            icon: "☕"
        },

        lonely: {
            name: "وحيد",
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

            return "لم تحدد إحساسك اليوم بعد ｡";

        }


        return (
            "إحساسي اليوم: " +
            feeling.icon +
            " " +
            feeling.name
        );

    },


    renderHome() {

        const element =
            document.getElementById(
                "currentFeeling"
            );


        if (!element) {
            return;
        }


        element.textContent =
            this.getDisplayText();

    },


    renderProfile() {

        const element =
            document.getElementById(
                "profileFeeling"
            );


        if (!element) {
            return;
        }


        element.textContent =
            this.getProfileText();

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


    showResult(feeling) {

        const result =
            document.getElementById(
                "feelingResult"
            );


        if (!result || !feeling) {
            return;
        }


        result.innerHTML = `

            <div class="feeling-result-card">

                ${feeling.icon}

                <span>
                    تم حفظ إحساسك اليوم ♡
                </span>

            </div>

        `;

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

        this.showResult(feeling);

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
            document.getElementById(
                "feelingsContainer"
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
