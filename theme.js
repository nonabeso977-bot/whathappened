/* ========================================
   Friends Boxes Open ♡
   Theme System
======================================== */

const Themes = {

    storageKey: "selected_theme",

    themes: {

        sky: {
            name: "Sky 🩵",
            colors: {
                bg: "#eaf7ff",
                card: "#ffffff",
                text: "#30445a",
                muted: "#7890a5",
                primary: "#78c8ee",
                secondary: "#f5b9d0",
                border: "#d5eaf5",
                nav: "#ffffff"
            }
        },

        deepBlue: {
            name: "Deep Blue 💙",
            colors: {
                bg: "#101c35",
                card: "#182846",
                text: "#e9f2ff",
                muted: "#9db1cf",
                primary: "#4d8dff",
                secondary: "#7b6cff",
                border: "#2b4066",
                nav: "#14233f"
            }
        },

        black: {
            name: "Black 🖤",
            colors: {
                bg: "#0d0d0f",
                card: "#18181b",
                text: "#f3f3f3",
                muted: "#a1a1aa",
                primary: "#ffffff",
                secondary: "#52525b",
                border: "#29292e",
                nav: "#111113"
            }
        },

        redBlack: {
            name: "Red & Black ❤️🖤",
            colors: {
                bg: "#100b0d",
                card: "#1b1114",
                text: "#f8eeee",
                muted: "#b89ca2",
                primary: "#e5485d",
                secondary: "#8f2638",
                border: "#3a1d25",
                nav: "#140d10"
            }
        },

        lavender: {
            name: "Lavender Night 💜",
            colors: {
                bg: "#171329",
                card: "#241d3b",
                text: "#f2edff",
                muted: "#b5a9d0",
                primary: "#a78bfa",
                secondary: "#d09cff",
                border: "#3a3057",
                nav: "#1d1732"
            }
        },

        mint: {
            name: "Mint 🍃",
            colors: {
                bg: "#eafaf5",
                card: "#ffffff",
                text: "#29483f",
                muted: "#78978e",
                primary: "#69c9a7",
                secondary: "#a9e5d0",
                border: "#d0eee3",
                nav: "#ffffff"
            }
        },

        peach: {
            name: "Peach 🍑",
            colors: {
                bg: "#fff3ed",
                card: "#ffffff",
                text: "#59423b",
                muted: "#a58b80",
                primary: "#f3a27d",
                secondary: "#f4bfd0",
                border: "#f4ddd2",
                nav: "#ffffff"
            }
        },

        ocean: {
            name: "Ocean 🌊",
            colors: {
                bg: "#e7f8fb",
                card: "#ffffff",
                text: "#214451",
                muted: "#6e929d",
                primary: "#35b7c8",
                secondary: "#67aee8",
                border: "#ccebef",
                nav: "#ffffff"
            }
        },

        cherry: {
            name: "Cherry 🍒",
            colors: {
                bg: "#fff0f3",
                card: "#ffffff",
                text: "#542b35",
                muted: "#9d707b",
                primary: "#c93655",
                secondary: "#ee9caf",
                border: "#f1d1d9",
                nav: "#ffffff"
            }
        },

        coffee: {
            name: "Coffee ☕",
            colors: {
                bg: "#f4eee7",
                card: "#fffaf4",
                text: "#4c382c",
                muted: "#927c6d",
                primary: "#9b6b49",
                secondary: "#d2aa88",
                border: "#e5d6c8",
                nav: "#fffaf4"
            }
        },

        cyber: {
            name: "Cyber 💠",
            colors: {
                bg: "#090d16",
                card: "#111827",
                text: "#e8f7ff",
                muted: "#8da4b8",
                primary: "#22d3ee",
                secondary: "#a855f7",
                border: "#243247",
                nav: "#0c1220"
            }
        },

        midnight: {
            name: "Midnight Purple 🌌",
            colors: {
                bg: "#0c0b18",
                card: "#17152b",
                text: "#eeeaff",
                muted: "#9e98b8",
                primary: "#8b7cff",
                secondary: "#c084fc",
                border: "#2c2747",
                nav: "#111022"
            }
        },

        monochrome: {
            name: "Black & White ⚪",
            colors: {
                bg: "#eeeeee",
                card: "#ffffff",
                text: "#171717",
                muted: "#737373",
                primary: "#171717",
                secondary: "#737373",
                border: "#d4d4d4",
                nav: "#ffffff"
            }
        },

        sunset: {
            name: "Sunset 🌅",
            colors: {
                bg: "#fff0e8",
                card: "#fffaf7",
                text: "#4f3442",
                muted: "#987582",
                primary: "#ed8061",
                secondary: "#b978c9",
                border: "#f0d5d0",
                nav: "#fffaf7"
            }
        }

    },


    getCurrent() {

        return localStorage.getItem(
            this.storageKey
        ) || "sky";

    },


    apply(themeId) {

        const theme =
            this.themes[themeId];

        if (!theme) {
            return;
        }


        const root =
            document.documentElement;


        root.style.setProperty(
            "--theme-bg",
            theme.colors.bg
        );

        root.style.setProperty(
            "--theme-card",
            theme.colors.card
        );

        root.style.setProperty(
            "--theme-text",
            theme.colors.text
        );

        root.style.setProperty(
            "--theme-muted",
            theme.colors.muted
        );

        root.style.setProperty(
            "--theme-primary",
            theme.colors.primary
        );

        root.style.setProperty(
            "--theme-secondary",
            theme.colors.secondary
        );

        root.style.setProperty(
            "--theme-border",
            theme.colors.border
        );

        root.style.setProperty(
            "--theme-nav",
            theme.colors.nav
        );


        localStorage.setItem(
            this.storageKey,
            themeId
        );

    },


    load() {

        const themeId =
            this.getCurrent();

        this.apply(themeId);

    },


    getThemeList() {

        return Object.entries(
            this.themes
        ).map(([id, theme]) => ({
            id: id,
            name: theme.name
        }));

    }

};


/* ========================================
   تحميل الثيم المحفوظ
======================================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        Themes.load();

    }
);