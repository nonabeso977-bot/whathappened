/* ========================================
   Friends Boxes Open ♡
   Settings System
======================================== */

const Settings = {

    open() {

        if (
            typeof App !== "undefined" &&
            typeof App.showPage === "function"
        ) {
            App.showPage("settingsPage");
        }

    },


    close() {

        if (
            typeof App !== "undefined" &&
            typeof App.showPage === "function"
        ) {
            App.showPage("profilePage");
        }

    },


    selectTheme(themeId) {

        if (
            typeof Themes === "undefined"
        ) {
            return;
        }


        Themes.apply(themeId);

        this.renderThemes();

    },


    renderThemes() {

        const container =
            document.getElementById(
                "themeList"
            );


        if (!container) {
            return;
        }


        if (
            typeof Themes === "undefined"
        ) {
            return;
        }


        const current =
            Themes.getCurrent();


        container.innerHTML =
            Themes.getThemeList()
                .map(theme => {

                    const selected =
                        theme.id === current
                            ? "selected"
                            : "";


                    return `
                        <button
                            class="theme-option ${selected}"
                            type="button"
                            data-theme="${theme.id}"
                        >
                            ${this.escapeHTML(theme.name)}
                        </button>
                    `;

                })
                .join("");

    },


    escapeHTML(text) {

        const div =
            document.createElement("div");

        div.textContent =
            text;

        return div.innerHTML;

    }

};


/* ========================================
   تشغيل الإعدادات
======================================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        const settingsButton =
            document.getElementById(
                "settingsButton"
            );


        if (settingsButton) {

            settingsButton.addEventListener(
                "click",
                () => {
                    Settings.open();
                }
            );

        }


        const themeList =
            document.getElementById(
                "themeList"
            );


        if (themeList) {

            themeList.addEventListener(
                "click",
                event => {

                    const button =
                        event.target.closest(
                            "[data-theme]"
                        );


                    if (!button) {
                        return;
                    }


                    Settings.selectTheme(
                        button.dataset.theme
                    );

                }
            );

        }


        Settings.renderThemes();

    }
);