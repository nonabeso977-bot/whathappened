/* ========================================
   Friends Boxes Open ♡
   Main Application Controller
======================================== */

const App = {

    currentPage: "homePage",


    /* ========================================
       تغيير الصفحة
    ======================================== */

    showPage(pageId) {

        const pages =
            document.querySelectorAll(".page");

        const target =
            document.getElementById(pageId);

        if (!target) {
            return;
        }

        pages.forEach(page => {
            page.classList.remove("active");
        });

        target.classList.add("active");

        this.currentPage = pageId;

        this.updateNavigation(pageId);

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

        this.refreshPage(pageId);
    },


    /* ========================================
       تحديث الشريط السفلي
    ======================================== */

    updateNavigation(pageId) {

        const buttons =
            document.querySelectorAll(".nav-button");

        buttons.forEach(button => {

            button.classList.remove("active");

            if (button.dataset.page === pageId) {
                button.classList.add("active");
            }

        });
    },


    /* ========================================
       تحديث الصفحة
    ======================================== */

    refreshPage(pageId) {

        if (pageId === "homePage") {

            const container =
                document.getElementById("postsContainer");

            if (container && typeof Posts !== "undefined") {
                Posts.render(container);
            }

            if (
                typeof Feelings !== "undefined" &&
                typeof Feelings.renderHome === "function"
            ) {
                Feelings.renderHome();
            }
        }


        if (pageId === "profilePage") {

            if (
                typeof Feelings !== "undefined" &&
                typeof Feelings.renderProfile === "function"
            ) {
                Feelings.renderProfile();
            }

            this.updateProfileStats();
        }


        if (pageId === "feelingsPage") {

            if (
                typeof Feelings !== "undefined" &&
                typeof Feelings.renderSelection === "function"
            ) {
                Feelings.renderSelection();
            }
        }


        if (pageId === "remindersPage") {

            if (
                typeof Reminders !== "undefined" &&
                typeof Reminders.render === "function"
            ) {
                Reminders.render();
            }

            if (
                typeof Reminders !== "undefined" &&
                typeof Reminders.renderStreak === "function"
            ) {
                Reminders.renderStreak();
            }
        }
    },


    /* ========================================
       إحصائيات الملف
    ======================================== */

    updateProfileStats() {

        if (typeof Posts === "undefined") {
            return;
        }

        const stats = Posts.getStats();

        const postCount =
            document.getElementById("postCount");

        const likeCount =
            document.getElementById("likeCount");

        if (postCount) {
            postCount.textContent =
                stats.posts || 0;
        }

        if (likeCount) {
            likeCount.textContent =
                stats.likes || 0;
        }
    },


    /* ========================================
       فتح Modal
    ======================================== */

    openModal(modalId) {

        const modal =
            document.getElementById(modalId);

        if (!modal) {
            return;
        }

        modal.classList.add("active");

        document.body.style.overflow = "hidden";
    },


    /* ========================================
       إغلاق Modal
    ======================================== */

    closeModal(modalId) {

        const modal =
            document.getElementById(modalId);

        if (!modal) {
            return;
        }

        modal.classList.remove("active");

        document.body.style.overflow = "";
    },


    /* ========================================
       رسالة صغيرة
    ======================================== */

    showMessage(title, text) {

        const content =
            document.getElementById("messageContent");

        if (!content) {
            return;
        }

        content.innerHTML = `

            <h2>
                ${this.escapeHTML(title)}
            </h2>

            <p
                style="
                    color:#7890a3;
                    line-height:1.8;
                    font-size:14px;
                    margin-bottom:18px;
                "
            >
                ${this.escapeHTML(text)}
            </p>

            <button
                class="primary-button"
                type="button"
                id="messageOkButton"
            >
                تمام ♡
            </button>
        `;

        this.openModal("messageModal");

        const okButton =
            document.getElementById("messageOkButton");

        if (okButton) {

            okButton.addEventListener(
                "click",
                () => {
                    this.closeModal("messageModal");
                }
            );

        }
    },


    /* ========================================
       Friends Box
    ======================================== */

    createFriendsBox() {

        const code =
            this.generateBoxCode();

        const friendCode =
            document.getElementById("friendCode");

        if (friendCode) {
            friendCode.textContent = code;
        }

        if (typeof Storage !== "undefined") {

            Storage.save(
                "friends_box",
                {
                    code: code,
                    createdAt:
                        new Date().toISOString()
                }
            );

        }

        this.showMessage(
            "صندوقك جاهز ♡",
            "تم إنشاء رمز صندوق الأصدقاء."
        );
    },


    generateBoxCode() {

        const characters =
            "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789";

        let code = "";

        for (let i = 0; i < 10; i++) {

            const randomIndex =
                Math.floor(
                    Math.random() *
                    characters.length
                );

            code += characters[randomIndex];
        }

        return code;
    },


    openFriendsBox() {

        const code =
            prompt(
                "أدخل رمز الصندوق ♡"
            );

        if (!code) {
            return;
        }

        let savedBox = null;

        if (typeof Storage !== "undefined") {

            savedBox =
                Storage.get(
                    "friends_box",
                    null
                );
        }

        if (
            savedBox &&
            code.trim() === savedBox.code
        ) {

            this.showMessage(
                "تم فتح الصندوق ♡",
                "الرمز صحيح."
            );

            return;
        }

        this.showMessage(
            "الرمز غير صحيح",
            "تأكدي من الرمز وحاولي مرة ثانية."
        );
    },


    /* ========================================
       نسخ النص
    ======================================== */

    async copyText(text) {

        try {

            await navigator.clipboard.writeText(
                text
            );

            this.showMessage(
                "تم النسخ ♡",
                "تم نسخ الرمز إلى الحافظة."
            );

        } catch (error) {

            this.showMessage(
                "تعذر النسخ",
                "انسخي الرمز يدويًا."
            );
        }
    },


    /* ========================================
       حماية النص
    ======================================== */

    escapeHTML(text) {

        return String(text)

            .replace(
                /&/g,
                "&amp;"
            )

            .replace(
                /</g,
                "&lt;"
            )

            .replace(
                />/g,
                "&gt;"
            )

            .replace(
                /"/g,
                "&quot;"
            )

            .replace(
                /'/g,
                "&#039;"
            );
    }
};



/* ========================================
   تشغيل التطبيق
======================================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {


        /* ==================================
           المتغيرات الخاصة بالمنشور
        ================================== */

        const imageInput =
            document.getElementById("postImage");

        const imagePreview =
            document.getElementById("imagePreview");

        let selectedImage = null;


        /* ==================================
           اختيار الصورة
        ================================== */

        if (imageInput) {

            imageInput.addEventListener(
                "change",
                () => {

                    const file =
                        imageInput.files[0];

                    if (!file) {

                        selectedImage = null;

                        if (imagePreview) {
                            imagePreview.innerHTML = "";
                        }

                        return;
                    }


                    if (
                        !file.type.startsWith("image/")
                    ) {

                        App.showMessage(
                            "مش صورة 🗿",
                            "اختاري ملف صورة فقط."
                        );

                        imageInput.value = "";

                        return;
                    }


                    const reader =
                        new FileReader();

                    reader.onload =
                        event => {

                            selectedImage =
                                event.target.result;

                            if (imagePreview) {

                                imagePreview.innerHTML = `

                                    <img
                                        src="${selectedImage}"
                                        alt="معاينة الصورة"
                                    >

                                `;
                            }
                        };

                    reader.readAsDataURL(file);
                }
            );
        }



        /* ==================================
           أزرار التنقل السفلي
        ================================== */

        document
            .querySelectorAll(".nav-button")
            .forEach(button => {

                button.addEventListener(
                    "click",
                    () => {

                        const page =
                            button.dataset.page;

                        App.showPage(page);
                    }
                );
            });



        /* ==================================
           زر اختاري شعورك
        ================================== */

        const goFeelingsButton =
            document.getElementById(
                "goFeelingsButton"
            );

        if (goFeelingsButton) {

            goFeelingsButton.addEventListener(
                "click",
                () => {

                    App.showPage(
                        "feelingsPage"
                    );
                }
            );
        }



        /* ==================================
           فتح نافذة المنشور
        ================================== */

        const openPostButton =
            document.getElementById(
                "openPostButton"
            );

        if (openPostButton) {

            openPostButton.addEventListener(
                "click",
                () => {

                    const textarea =
                        document.getElementById(
                            "postText"
                        );

                    if (textarea) {
                        textarea.value = "";
                    }

                    selectedImage = null;

                    if (imageInput) {
                        imageInput.value = "";
                    }

                    if (imagePreview) {
                        imagePreview.innerHTML = "";
                    }

                    App.openModal("postModal");

                    if (textarea) {

                        setTimeout(
                            () => {
                                textarea.focus();
                            },
                            100
                        );
                    }
                }
            );
        }



        /* ==================================
           إغلاق نافذة المنشور
        ================================== */

        const closePostModal =
            document.getElementById(
                "closePostModal"
            );

        if (closePostModal) {

            closePostModal.addEventListener(
                "click",
                () => {

                    App.closeModal(
                        "postModal"
                    );
                }
            );
        }



        /* ==================================
           نشر المنشور
        ================================== */

        const publishButton =
            document.getElementById(
                "publishPostButton"
            );

        if (publishButton) {

            publishButton.addEventListener(
                "click",
                () => {

                    const textarea =
                        document.getElementById(
                            "postText"
                        );

                    const visibility =
                        document.getElementById(
                            "postVisibility"
                        );

                    if (!textarea) {
                        return;
                    }

                    if (typeof Posts === "undefined") {

                        App.showMessage(
                            "فيه مشكلة 🗿",
                            "ملف المنشورات لم يتم تحميله."
                        );

                        return;
                    }

                    const post =
                        Posts.create(
                            textarea.value,
                            visibility
                                ? visibility.value
                                : "everyone",
                            selectedImage
                        );

                    if (!post) {

                        App.showMessage(
                            "المنشور فاضي 🗿",
                            "اكتبي نصًا أو أضيفي صورة أولًا."
                        );

                        return;
                    }

                    textarea.value = "";

                    selectedImage = null;

                    if (imageInput) {
                        imageInput.value = "";
                    }

                    if (imagePreview) {
                        imagePreview.innerHTML = "";
                    }

                    App.closeModal("postModal");

                    App.showPage("homePage");
                }
            );
        }



        /* ==================================
           إغلاق نافذة الرسائل
        ================================== */

        const closeMessageModal =
            document.getElementById(
                "closeMessageModal"
            );

        if (closeMessageModal) {

            closeMessageModal.addEventListener(
                "click",
                () => {

                    App.closeModal(
                        "messageModal"
                    );
                }
            );
        }



        /* ==================================
           الضغط خارج الـ Modal
        ================================== */

        document
            .querySelectorAll(".modal")
            .forEach(modal => {

                modal.addEventListener(
                    "click",
                    event => {

                        if (
                            event.target === modal
                        ) {

                            App.closeModal(
                                modal.id
                            );
                        }
                    }
                );
            });



        /* ==================================
           نسخ كود Friends Box
        ================================== */

        const copyFriendCode =
            document.getElementById(
                "copyFriendCode"
            );

        if (copyFriendCode) {

            copyFriendCode.addEventListener(
                "click",
                () => {

                    const friendCode =
                        document.getElementById(
                            "friendCode"
                        );

                    if (friendCode) {

                        App.copyText(
                            friendCode.textContent
                        );
                    }
                }
            );
        }



        /* ==================================
           إضافة تذكير
        ================================== */

        const addReminderButton =
            document.getElementById(
                "addReminderButton"
            );

        if (addReminderButton) {

            addReminderButton.addEventListener(
                "click",
                () => {

                    if (
                        typeof Reminders ===
                        "undefined"
                    ) {

                        App.showMessage(
                            "فيه مشكلة 🗿",
                            "ملف التذكيرات لم يتم تحميله."
                        );

                        return;
                    }

                    const text =
                        prompt(
                            "اكتب التذكير ♡"
                        );

                    if (
                        text &&
                        text.trim()
                    ) {

                        if (
                            typeof Reminders.add ===
                            "function"
                        ) {

                            Reminders.add(
                                text.trim()
                            );

                            App.refreshPage(
                                "remindersPage"
                            );

                        }
                    }
                }
            );
        }



        /* ==================================
           اختيار الشعور
        ================================== */

        const feelingsContainer =
            document.getElementById(
                "feelingsContainer"
            );

        if (feelingsContainer) {

            feelingsContainer.addEventListener(
                "click",
                event => {

                    const button =
                        event.target.closest(
                            "[data-feeling]"
                        );

                    if (!button) {
                        return;
                    }

                    const feeling =
                        button.dataset.feeling;

                    if (
                        typeof Feelings !==
                        "undefined"
                    ) {

                        if (
                            typeof Feelings.set ===
                            "function"
                        ) {

                            Feelings