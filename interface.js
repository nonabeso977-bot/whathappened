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


        /* ========================================
   النشر
======================================== */

function publishPost() {

    if (typeof Posts === "undefined") {
        console.error("Posts.js غير محمل");
        return;
    }


    const textInput =
        document.getElementById("postText");

    const visibilityInput =
        document.getElementById("postVisibility");

    const imageInput =
        document.getElementById("postImageInput");


    const text =
        textInput
            ? textInput.value.trim()
            : "";


    const visibility =
        visibilityInput
            ? visibilityInput.value
            : "everyone";


    let image = null;


    /*
       الصور نحتاج نعالجها قبل إنشاء المنشور
    */

    const file =
        imageInput &&
        imageInput.files &&
        imageInput.files[0];


    if (file) {

        const reader =
            new FileReader();


        reader.onload = function () {

            image = reader.result;


            Posts.create(
                text,
                visibility,
                image
            );


            closePostModal();


            if (typeof App !== "undefined") {

                App.showPage("homePage");

            }

            refreshPosts();

        };


        reader.readAsDataURL(file);

        return;
    }


    Posts.create(
        text,
        visibility,
        null
    );


    closePostModal();


    if (typeof App !== "undefined") {

        App.showPage("homePage");

    }


    refreshPosts();

}


/* ========================================
   تحديث المنشورات
======================================== */

function refreshPosts() {

    const container =
        document.getElementById(
            "postsContainer"
        );


    if (
        container &&
        typeof Posts !== "undefined"
    ) {

        Posts.render(container);

    }

}


/* ========================================
   الثيمات
======================================== */

function renderThemesDirectly() {

    const container =
        document.getElementById(
            "themeList"
        );


    if (!container) {
        return;
    }


    if (typeof Themes === "undefined") {

        container.innerHTML =
            "<p>نظام الثيمات غير محمل</p>";

        return;
    }


    const current =
        Themes.getCurrent();


    const themes =
        Themes.getThemeList();


    container.innerHTML =
        themes.map(theme => {

            const selected =
                theme.id === current
                    ? "selected"
                    : "";


            return `
                <button
                    type="button"
                    class="theme-option ${selected}"
                    data-theme="${theme.id}"
                >
                    ${theme.name}
                </button>
            `;

        }).join("");
}


/* ========================================
   تشغيل الواجهة
======================================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {


        /* ============================
           التنقل
        ============================ */

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


                /* زر إنشاء منشور */

                const createButton =
                    event.target.closest(
                        "#navCreateButton, #openPostButton, #emptyPostButton"
                    );


                if (createButton) {

                    App.openPostModal();

                    return;

                }


                /* إغلاق نافذة المنشور */

                if (
                    event.target.closest(
                        "#closePostModal"
                    )
                ) {

                    App.closePostModal();

                    return;

                }


                /* نشر */

                if (
                    event.target.closest(
                        "#publishPostButton"
                    )
                ) {

                    publishPost();

                    return;

                }


                /* الإعدادات */

                if (
                    event.target.closest(
                        "#settingsButton"
                    )
                ) {

                    App.showPage(
                        "settingsPage"
                    );

                    renderThemesDirectly();

                    return;

                }


                /* الرجوع للملف */

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


                /* أزرار الرجوع */

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


                /* تعديل البروفايل */

                if (
                    event.target.closest(
                        "#editProfileButton"
                    )
                ) {

                    App.editProfile();

                    return;

                }


                /* ========================
                   اختيار الثيم
                ======================== */

                const themeButton =
                    event.target.closest(
                        "[data-theme]"
                    );


                if (
                    themeButton &&
                    typeof Themes !== "undefined"
                ) {

                    Themes.apply(
                        themeButton.dataset.theme
                    );


                    renderThemesDirectly();

                    return;

                }


                /* ========================
                   تغيير الشعور
                ======================== */

                const feelingButton =
                    event.target.closest(
                        ".feeling-option"
                    );


                if (feelingButton) {

                    const feeling =
                        feelingButton.dataset.feeling;

                    const icon =
                        feelingButton.dataset.icon ||
                        "♡";


                    localStorage.setItem(
                        "current_feeling",
                        JSON.stringify({
                            text: feeling,
                            icon: icon
                        })
                    );


                    App.refreshFeeling();

                    return;

                }


                /* تغيير الشعور */

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


                /* إدارة الأصدقاء */

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


                /* إغلاق الرسائل */

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


        /* ============================
           معاينة الصورة
        ============================ */

        const imageInput =
            document.getElementById(
                "postImageInput"
            );


        if (imageInput) {

            imageInput.addEventListener(
                "change",
                () => {

                    const preview =
                        document.getElementById(
                            "imagePreview"
                        );


                    const file =
                        imageInput.files &&
                        imageInput.files[0];


                    if (!preview) {
                        return;
                    }


                    if (!file) {

                        preview.innerHTML = "";

                        return;

                    }


                    const reader =
                        new FileReader();


                    reader.onload =
                        event => {

                            preview.innerHTML = `
                                <img
                                    src="${event.target.result}"
                                    alt="معاينة الصورة"
                                >
                            `;

                        };


                    reader.readAsDataURL(file);

                }
            );

        }


        /* ============================
           تحميل الثيمات
        ============================ */

        renderThemesDirectly();


        /* ============================
           الصفحة الأولى
        ============================ */

        App.showPage(
            "homePage"
        );


        refreshPosts();

    }
);