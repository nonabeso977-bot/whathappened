const App = {

    currentPage: "homePage",


    showPage(pageId) {

        document.querySelectorAll(".page").forEach(
            page => {
                page.classList.remove("active");
            }
        );


        const target =
            document.getElementById(pageId);


        if (!target) {

            console.warn(
                "Page not found:",
                pageId
            );

            return;
        }


        target.classList.add("active");

        this.currentPage = pageId;


        document
            .querySelectorAll(
                ".nav-item[data-page]"
            )
            .forEach(button => {

                button.classList.toggle(
                    "active",
                    button.dataset.page === pageId
                );

            });


        this.refreshPage(pageId);


        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    },


    refreshPage(pageId) {

        if (
            pageId === "homePage"
        ) {

            refreshPosts();

        }


        if (
            pageId === "profilePage"
        ) {

            this.refreshProfile();

        }


        if (
            pageId === "friendsPage" &&
            typeof Friends !== "undefined"
        ) {

            if (
                typeof Friends.loadMyCode === "function"
            ) {

                Friends.loadMyCode();

            }


            if (
                typeof Friends.render === "function"
            ) {

                Friends.render();

            }

        }


        if (
            pageId === "remindersPage" &&
            typeof Reminders !== "undefined"
        ) {

            if (
                typeof Reminders.render === "function"
            ) {

                Reminders.render();

            }


            if (
                typeof Reminders.renderStreak === "function"
            ) {

                Reminders.renderStreak();

            }

        }


        if (
            pageId === "settingsPage"
        ) {

            renderThemesDirectly();

        }


        if (
            pageId === "feelingsPage"
        ) {

            this.refreshFeeling();

        }

    },


    async refreshAuthState() {

        if (
            typeof Online === "undefined" ||
            typeof Online.getUser !== "function"
        ) {

            return null;

        }


        try {

            const user =
                await Online.getUser();


            if (user) {

                console.log(
                    "♡ الحساب متصل:",
                    user.email
                );

            } else {

                console.log(
                    "♡ لا يوجد حساب مسجل"
                );

            }


            return user;

        } catch (error) {

            console.error(
                "Auth refresh error:",
                error
            );

            return null;

        }

    },


    async refreshProfile() {

        let name =
            localStorage.getItem(
                "profileName"
            ) ||
            "مستخدم جديد";


        if (
            typeof Friends !== "undefined" &&
            typeof Friends.ensureProfile === "function"
        ) {

            try {

                const profile =
                    await Friends.ensureProfile();


                if (
                    profile &&
                    profile.username
                ) {

                    name =
                        profile.username;

                }

            } catch (error) {

                console.error(
                    "Profile refresh error:",
                    error
                );

            }

        }


        const nameElement =
            document.getElementById(
                "profileName"
            );


        if (nameElement) {

            nameElement.textContent =
                name;

        }


        if (
            typeof Posts !== "undefined" &&
            typeof Posts.getStats === "function"
        ) {

            const stats =
                Posts.getStats();


            const postCount =
                document.getElementById(
                    "postCount"
                );


            const likeCount =
                document.getElementById(
                    "likeCount"
                );


            if (postCount) {

                postCount.textContent =
                    stats.posts;

            }


            if (likeCount) {

                likeCount.textContent =
                    stats.likes;

            }

        }


        this.refreshFeeling();

    },


    editProfile() {

        const currentName =
            localStorage.getItem(
                "profileName"
            ) ||
            "مستخدم جديد";


        const newName =
            prompt(
                "اكتبي اسمك الجديد:",
                currentName
            );


        if (newName === null) {

            return;

        }


        const cleanName =
            newName.trim();


        if (!cleanName) {

            return;

        }


        localStorage.setItem(
            "profileName",
            cleanName
        );


        const nameElement =
            document.getElementById(
                "profileName"
            );


        if (nameElement) {

            nameElement.textContent =
                cleanName;

        }

    },


    refreshFeeling() {

        const iconElement =
            document.getElementById(
                "currentFeelingIcon"
            );


        const textElement =
            document.getElementById(
                "currentFeelingText"
            );


        const saved =
            localStorage.getItem(
                "current_feeling"
            );


        if (!saved) {

            if (iconElement) {

                iconElement.textContent =
                    "♡";

            }


            if (textElement) {

                textElement.textContent =
                    "ما اخترتيش شعورك اليوم";

            }


            return;

        }


        try {

            const feeling =
                JSON.parse(saved);


            if (iconElement) {

                iconElement.textContent =
                    feeling.icon ||
                    "♡";

            }


            if (textElement) {

                textElement.textContent =
                    feeling.text ||
                    "شعوري اليوم";

            }

        } catch (error) {

            console.error(
                "Feeling error:",
                error
            );

        }

    },


    openPostModal() {

        const modal =
            document.getElementById(
                "postModal"
            );


        if (!modal) {

            return;

        }


        modal.classList.add(
            "active"
        );


        modal.style.display =
            "flex";


        const input =
            document.getElementById(
                "postText"
            );


        if (input) {

            setTimeout(
                () => {
                    input.focus();
                },
                100
            );

        }

    },


    closePostModal() {

        const modal =
            document.getElementById(
                "postModal"
            );


        if (!modal) {

            return;

        }


        modal.classList.remove(
            "active"
        );


        modal.style.display =
            "none";


        const input =
            document.getElementById(
                "postText"
            );


        if (input) {

            input.value = "";

        }


        const imageInput =
            document.getElementById(
                "postImageInput"
            );


        if (imageInput) {

            imageInput.value = "";

        }


        const preview =
            document.getElementById(
                "imagePreview"
            );


        if (preview) {

            preview.innerHTML = "";

            preview.style.display =
                "none";

        }

    },


    openMessage(title, content) {

        const modal =
            document.getElementById(
                "messageModal"
            );


        if (!modal) {

            alert(content);

            return;

        }


        const titleElement =
            document.getElementById(
                "messageModalTitle"
            );


        const contentElement =
            document.getElementById(
                "messageModalContent"
            );


        if (titleElement) {

            titleElement.textContent =
                title;

        }


        if (contentElement) {

            contentElement.textContent =
                content;

        }


        modal.classList.add(
            "active"
        );


        modal.style.display =
            "flex";

    },


    closeMessage() {

        const modal =
            document.getElementById(
                "messageModal"
            );


        if (!modal) {

            return;

        }


        modal.classList.remove(
            "active"
        );


        modal.style.display =
            "none";

    }

};



function publishPost() {

    const input =
        document.getElementById(
            "postText"
        );


    if (!input) {

        return;

    }


    const text =
        input.value.trim();


    if (!text) {

        App.openMessage(
            "منشور فاضي؟ 🗿",
            "اكتبي حاجة قبل ما تنشريها ♡"
        );

        return;

    }


    if (
        typeof Posts === "undefined"
    ) {

        App.openMessage(
            "صار خطأ",
            "نظام المنشورات غير متوفر."
        );

        return;

    }


    try {

        if (
            typeof Posts.add === "function"
        ) {

            Posts.add(text);

        } else if (
            typeof Posts.create === "function"
        ) {

            Posts.create(text);

        } else {

            throw new Error(
                "Posts.add / Posts.create not found"
            );

        }


        App.closePostModal();

        refreshPosts();


    } catch (error) {

        console.error(
            "Publish post error:",
            error
        );


        App.openMessage(
            "صار خطأ",
            "ما قدرناش ننشروا المنشور."
        );

    }

}



function finishPublishing() {

    publishPost();

}



function refreshPosts() {

    if (
        typeof Posts === "undefined" ||
        typeof Posts.render !== "function"
    ) {

        return;

    }


    const container =
        document.getElementById(
            "postsContainer"
        );


    if (!container) {

        console.warn(
            "postsContainer not found"
        );

        return;

    }


    try {

        Posts.render(
            container
        );

    } catch (error) {

        console.error(
            "Refresh posts error:",
            error
        );

    }

}



function renderThemesDirectly() {

    const container =
        document.getElementById(
            "themeOptions"
        );


    if (!container) {

        return;

    }


    if (
        typeof Themes !== "undefined" &&
        typeof Themes.render === "function"
    ) {

        Themes.render(
            container
        );

        return;

    }


    if (
        typeof Themes !== "undefined" &&
        typeof Themes.getThemes === "function"
    ) {

        const themes =
            Themes.getThemes();


        container.innerHTML =
            "";


        Object.entries(
            themes
        ).forEach(
            ([key, theme]) => {

                const button =
                    document.createElement(
                        "button"
                    );


                button.type =
                    "button";


                button.className =
                    "theme-option";


                button.dataset.theme =
                    key;


                button.textContent =
                    theme.name ||
                    key;


                container.appendChild(
                    button
                );

            }
        );

    }

}



document.addEventListener(
    "DOMContentLoaded",
    () => {


        window.addEventListener(
            "supabase-auth-change",
            async event => {

                const user =
                    event.detail &&
                    event.detail.user;


                console.log(
                    "♡ تم تحديث حالة الحساب"
                );


                if (user) {

                    await App.refreshProfile();


                    if (
                        typeof Friends !== "undefined" &&
                        typeof Friends.loadMyCode === "function"
                    ) {

                        await Friends.loadMyCode();

                    }

                }

            }
        );


        document.addEventListener(
            "click",
            event => {


                const nav =
                    event.target.closest(
                        ".nav-item[data-page]"
                    );


                if (nav) {

                    App.showPage(
                        nav.dataset.page
                    );

                    return;

                }


                const createButton =
                    event.target.closest(
                        "#navCreateButton,#openPostButton,#emptyPostButton"
                    );


                if (createButton) {

                    App.openPostModal();

                    return;

                }


                if (
                    event.target.closest(
                        "#closePostModal"
                    )
                ) {

                    App.closePostModal();

                    return;

                }


                if (
                    event.target.closest(
                        "#publishPostButton"
                    )
                ) {

                    publishPost();

                    return;

                }


                if (
                    event.target.closest(
                        "#settingsButton"
                    )
                ) {

                    App.showPage(
                        "settingsPage"
                    );

                    return;

                }


                if (
                    event.target.closest(
                        "#backToProfileButton"
                    )
                ) {

                    App.showPage(
                        "profilePage"
                    );

                    return;

                }


                const back =
                    event.target.closest(
                        "[data-back]"
                    );


                if (back) {

                    App.showPage(
                        back.dataset.back
                    );

                    return;

                }


                if (
                    event.target.closest(
                        "#editProfileButton"
                    )
                ) {

                    App.editProfile();

                    return;

                }


                const themeButton =
                    event.target.closest(
                        ".theme-option[data-theme]"
                    );


                if (
                    themeButton &&
                    typeof Themes !== "undefined" &&
                    typeof Themes.apply === "function"
                ) {

                    Themes.apply(
                        themeButton.dataset.theme
                    );


                    renderThemesDirectly();

                    return;

                }


                const feelingButton =
                    event.target.closest(
                        ".feeling-option"
                    );


                if (feelingButton) {

                    const text =
                        feelingButton.dataset.text ||
                        feelingButton.textContent.trim();


                    const icon =
                        feelingButton.dataset.icon ||
                        "♡";


                    localStorage.setItem(
                        "current_feeling",
                        JSON.stringify({
                            text: text,
                            icon: icon
                        })
                    );


                    App.refreshFeeling();

                    return;

                }


                if (
                    event.target.closest(
                        "#changeFeelingButton"
                    )
                ) {

                    App.showPage(
                        "feelingsPage"
                    );

                    return;

                }


                if (
                    event.target.closest(
                        "#settingsFriendsButton"
                    )
                ) {

                    App.showPage(
                        "friendsPage"
                    );

                    return;

                }


                if (
                    event.target.closest(
                        "#closeMessageModal"
                    )
                ) {

                    App.closeMessage();

                    return;

                }

            }
        );


        const imageInput =
            document.getElementById(
                "postImageInput"
            );


        if (imageInput) {

            imageInput.addEventListener(
                "change",
                event => {

                    const file =
                        event.target.files[0];


                    const preview =
                        document.getElementById(
                            "imagePreview"
                        );


                    if (!preview) {

                        return;

                    }


                    if (!file) {

                        preview.innerHTML =
                            "";


                        preview.style.display =
                            "none";


                        return;

                    }


                    if (
                        !file.type.startsWith(
                            "image/"
                        )
                    ) {

                        preview.innerHTML =
                            "";


                        preview.style.display =
                            "none";


                        return;

                    }


                    const reader =
                        new FileReader();


                    reader.onload =
                        () => {

                            preview.innerHTML = `
                                <img
                                    src="${reader.result}"
                                    alt="معاينة الصورة"
                                    style="max-width:100%;border-radius:16px;"
                                >
                            `;


                            preview.style.display =
                                "block";

                        };


                    reader.readAsDataURL(
                        file
                    );

                }
            );

        }


        renderThemesDirectly();

        App.showPage(
            "homePage"
        );

        refreshPosts();

        App.refreshAuthState();

    }
);