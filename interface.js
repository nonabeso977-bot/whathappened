/* ========================================
   Friends Boxes Open ♡
   Interface Controller
   هذا الملف مسؤول عن الواجهة فقط
======================================== */

const App = {

    currentPage: "homePage",


    /* ================================
       الانتقال بين الصفحات
    ================================= */

    showPage(pageId) {

        const pages = document.querySelectorAll(".page");

        pages.forEach(page => {
            page.classList.remove("active");
        });


        const target = document.getElementById(pageId);

        if (!target) {
            console.warn("Page not found:", pageId);
            return;
        }


        target.classList.add("active");

        this.currentPage = pageId;


        /* تحديث أزرار التنقل */

        const navItems =
            document.querySelectorAll(
                ".nav-item[data-page]"
            );


        navItems.forEach(button => {

            button.classList.toggle(
                "active",
                button.dataset.page === pageId
            );

        });


        /* تحديث الصفحة */

        this.refreshPage(pageId);


        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    },


    /* ================================
       تحديث الصفحة
    ================================= */

    refreshPage(pageId) {

        if (
            pageId === "homePage" &&
            typeof Posts !== "undefined"
        ) {

            const container =
                document.getElementById(
                    "postsContainer"
                );

            if (container) {
                Posts.render(container);
            }
        }


        if (
            pageId === "profilePage"
        ) {

            this.refreshProfile();

        }


        if (
            pageId === "friendsPage"
        ) {

            this.refreshFriends();

        }


        if (
            pageId === "settingsPage" &&
            typeof Settings !== "undefined"
        ) {

            Settings.renderThemes();

        }


        if (
            pageId === "feelingsPage"
        ) {

            this.refreshFeeling();

        }
    },


    /* ================================
       الملف الشخصي
    ================================= */

    refreshProfile() {

        const name =
            localStorage.getItem(
                "profileName"
            ) || "مستخدم جديد";


        const nameElement =
            document.getElementById(
                "profileName"
            );


        if (nameElement) {
            nameElement.textContent = name;
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
    },


    /* ================================
       تعديل البروفايل
    ================================= */

    editProfile() {

        const oldName =
            localStorage.getItem(
                "profileName"
            ) || "مستخدم جديد";


        const newName =
            prompt(
                "اكتبي اسم البروفايل ♡",
                oldName
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
            cleanName.slice(0, 30)
        );


        this.refreshProfile();

    },


    /* ================================
       المشاعر
    ================================= */

    refreshFeeling() {

        const saved =
            localStorage.getItem(
                "current_feeling"
            );


        if (!saved) {
            return;
        }


        let feeling = saved;


        try {
            feeling = JSON.parse(saved);
        } catch {
            /* القيمة نص عادي */
        }


        let text = "";
        let icon = "♡";


        if (
            typeof feeling === "object" &&
            feeling !== null
        ) {

            text =
                feeling.text ||
                feeling.name ||
                feeling.feeling ||
                "";

            icon =
                feeling.icon ||
                "♡";

        } else {

            text = feeling;
        }


        const textElement =
            document.getElementById(
                "currentFeelingText"
            );

        const iconElement =
            document.getElementById(
                "currentFeelingIcon"
            );

        const profileElement =
            document.getElementById(
                "profileFeeling"
            );


        if (textElement && text) {
            textElement.textContent = text;
        }


        if (iconElement) {
            iconElement.textContent = icon;
        }


        if (profileElement) {

            profileElement.textContent =
                icon + " " + text;

        }
    },


    /* ================================
       الأصدقاء
    ================================= */

    refreshFriends() {

        if (
            typeof Friends !== "undefined" &&
            typeof Friends.render === "function"
        ) {

            Friends.render();

        }

    },


    /* ================================
       نافذة المنشور
    ================================= */

    openPostModal() {

        const modal =
            document.getElementById(
                "postModal"
            );


        if (!modal) {
            return;
        }


        modal.classList.remove("hidden");


        const textarea =
            document.getElementById(
                "postText"
            );


        if (textarea) {
            setTimeout(() => {
                textarea.focus();
            }, 100);
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


        modal.classList.add("hidden");
    },


    /* ================================
       نافذة الرسالة
    ================================= */

    openMessage(title, content) {

        const modal =
            document.getElementById(
                "messageModal"
            );

        const titleElement =
            document.getElementById(
                "messageTitle"
            );

        const contentElement =
            document.getElementById(
                "messageContent"
            );


        if (!modal) {
            return;
        }


        if (titleElement) {
            titleElement.textContent = title;
        }


        if (contentElement) {
            contentElement.textContent = content;
        }


        modal.classList.remove("hidden");
    },


    closeMessage() {

        const modal =
            document.getElementById(
                "messageModal"
            );


        if (modal) {
            modal.classList.add("hidden");
        }
    },


    /* ================================
       تهيئة الواجهة
    ================================= */

    init() {

        /* شريط التنقل */

        document.addEventListener(
            "click",
            event => {

                const nav =
                    event.target.closest(
                        ".nav-item[data-page]"
                    );


                if (nav) {

                    this.showPage(
                        nav.dataset.page
                    );

                    return;
                }


                /* زر إنشاء المنشور */

                const createButton =
                    event.target.closest(
                        "#navCreateButton, #openPostButton, #emptyPostButton"
                    );


                if (createButton) {

                    this.openPostModal();

                    return;
                }


                /* إغلاق المنشور */

                const closePost =
                    event.target.closest(
                        "#closePostModal"
                    );


                if (closePost) {

                    this.closePostModal();

                    return;
                }


                /* تعديل البروفايل */

                const editProfile =
                    event.target.closest(
                        "#editProfileButton"
                    );


                if (editProfile) {

                    this.editProfile();

                    return;
                }


                /* الإعدادات */

                const settings =
                    event.target.closest(
                        "#settingsButton"
                    );


                if (settings) {

                    this.showPage(
                        "settingsPage"
                    );

                    return;
                }


                /* الرجوع للملف */

                const backProfile =
                    event.target.closest(
                        "#backToProfileButton"
                    );


                if (backProfile) {

                    this.showPage(
                        "profilePage"
                    );

                    return;
                }


                /* أزرار الرجوع */

                const back =
                    event.target.closest(
                        "[data-back]"
                    );


                if (back) {

                    this.showPage(
                        back.dataset.back
                    );

                    return;
                }


                /* إغلاق الرسالة */

                const closeMessage =
                    event.target.closest(
                        "#closeMessageModal"
                    );


                if (closeMessage) {

                    this.closeMessage();

                }

            }
        );


        /* زر المشاعر */

        const feelingButtons =
            document.querySelectorAll(
                ".feeling-option"
            );


        feelingButtons.forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const feeling =
                        button.dataset.feeling;

                    const icon =
                        button.dataset.icon || "♡";


                    localStorage.setItem(
                        "current_feeling",
                        JSON.stringify({
                            text: feeling,
                            icon: icon
                        })
                    );


                    this.refreshFeeling();

                }
            );

        });


        /* زر تغيير الشعور */

        const changeFeeling =
            document.getElementById(
                "changeFeelingButton"
            );


        if (changeFeeling) {

            changeFeeling.addEventListener(
                "click",
                () => {

                    this.showPage(
                        "feelingsPage"
                    );

                }
            );

        }


        /* إدارة الأصدقاء */

        const settingsFriends =
            document.getElementById(
                "settingsFriendsButton"
            );


        if (settingsFriends) {

            settingsFriends.addEventListener(
                "click",
                () => {

                    this.showPage(
                        "friendsPage"
                    );

                }
            );

        }


        /* تحميل الصفحة الأولى */

        this.showPage("homePage");

    }

};


/* ========================================
   تشغيل
======================================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        App.init();

    }
);