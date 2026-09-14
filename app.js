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
            document.querySelectorAll(
                ".page"
            );


        const target =
            document.getElementById(
                pageId
            );


        if (!target) {
            return;
        }


        pages.forEach(page => {

            page.classList.remove(
                "active"
            );

        });


        target.classList.add(
            "active"
        );


        this.currentPage =
            pageId;


        this.updateNavigation(
            pageId
        );


        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });


        this.refreshPage(
            pageId
        );

    },


    /* ========================================
       تحديث الشريط السفلي
    ======================================== */

    updateNavigation(pageId) {

        const buttons =
            document.querySelectorAll(
                ".nav-button"
            );


        buttons.forEach(button => {

            button.classList.remove(
                "active"
            );


            if (
                button.dataset.page ===
                pageId
            ) {

                button.classList.add(
                    "active"
                );

            }

        });

    },


    /* ========================================
       تحديث محتوى الصفحة
    ======================================== */

    refreshPage(pageId) {

        if (
            pageId ===
            "homePage"
        ) {

            const container =
                document.getElementById(
                    "postsContainer"
                );


            if (container) {
                Posts.render(
                    container
                );
            }


            Feelings.renderHome();

        }


        if (
            pageId ===
            "profilePage"
        ) {

            Feelings.renderProfile();

            this.updateProfileStats();

        }


        if (
            pageId ===
            "feelingsPage"
        ) {

            Feelings.renderSelection();

        }


        if (
            pageId ===
            "remindersPage"
        ) {

            Reminders.render();

            Reminders.renderStreak();

        }

    },


    /* ========================================
       إحصائيات الملف الشخصي
    ======================================== */

    updateProfileStats() {

        const stats =
            Posts.getStats();


        const postsCount =
            document.getElementById(
                "postsCount"
            );


        const likesCount =
            document.getElementById(
                "likesCount"
            );


        const commentsCount =
            document.getElementById(
                "commentsCount"
            );


        if (postsCount) {

            postsCount.textContent =
                stats.posts;

        }


        if (likesCount) {

            likesCount.textContent =
                stats.likes;

        }


        if (commentsCount) {

            commentsCount.textContent =
                stats.comments;

        }

    },


    /* ========================================
       فتح Modal
    ======================================== */

    openModal(modalId) {

        const modal =
            document.getElementById(
                modalId
            );


        if (!modal) {
            return;
        }


        modal.classList.add(
            "active"
        );


        document.body.style.overflow =
            "hidden";

    },


    /* ========================================
       إغلاق Modal
    ======================================== */

    closeModal(modalId) {

        const modal =
            document.getElementById(
                modalId
            );


        if (!modal) {
            return;
        }


        modal.classList.remove(
            "active"
        );


        document.body.style.overflow =
            "";

    },


    /* ========================================
       رسالة صغيرة
    ======================================== */

    showMessage(title, text) {

        const content =
            document.getElementById(
                "messageModalContent"
            );


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
                class="main-button"
                type="button"
                id="messageOkButton"
            >
                تمام ♡
            </button>

        `;


        this.openModal(
            "messageModal"
        );


        const okButton =
            document.getElementById(
                "messageOkButton"
            );


        if (okButton) {

            okButton.addEventListener(
                "click",
                () => {

                    this.closeModal(
                        "messageModal"
                    );

                }
            );

        }

    },


    /* ========================================
       إنشاء صندوق أصدقاء
    ======================================== */

    createFriendsBox() {

        const result =
            document.getElementById(
                "boxResult"
            );


        if (!result) {
            return;
        }


        const code =
            this.generateBoxCode();


        result.innerHTML = `

            <div class="box-result-card">

                <h3>
                    صندوقك جاهز ♡
                </h3>

                <p
                    style="
                        color:#7890a3;
                        font-size:13px;
                        margin-top:8px;
                        line-height:1.7;
                    "
                >
                    شارك الرمز مع الشخص الذي
                    تريد أن يفتح الصندوق.
                </p>

                <span class="box-code">
                    ${code}
                </span>

                <button
                    class="main-button"
                    type="button"
                    id="copyBoxCodeButton"
                >
                    نسخ الرمز
                </button>

            </div>

        `;


        Storage.save(
            "friends_box",
            {
                code: code,
                createdAt:
                    new Date().toISOString()
            }
        );


        const copyButton =
            document.getElementById(
                "copyBoxCodeButton"
            );


        if (copyButton) {

            copyButton.addEventListener(
                "click",
                () => {

                    this.copyText(
                        code
                    );

                }
            );

        }

    },


    /* ========================================
       إنشاء رمز عشوائي
    ======================================== */

    generateBoxCode() {

        const characters =
            "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789";


        let code = "";


        for (
            let i = 0;
            i < 10;
            i++
        ) {

            const randomIndex =
                Math.floor(
                    Math.random() *
                    characters.length
                );


            code +=
                characters[randomIndex];

        }


        return code;

    },


    /* ========================================
       فتح صندوق
    ======================================== */

    openFriendsBox() {

        const code =
            prompt(
                "أدخل رمز الصندوق ♡"
            );


        if (!code) {
            return;
        }


        const savedBox =
            Storage.get(
                "friends_box",
                null
            );


        if (
            savedBox &&
            code.trim() ===
            savedBox.code
        ) {

            this.showMessage(
                "تم فتح الصندوق ♡",
                "الرمز صحيح. هنا يمكننا لاحقًا إضافة محتوى الصندوق والأصدقاء."
            );

            return;

        }


        this.showMessage(
            "الرمز غير صحيح",
            "تأكدي من الرمز وحاولي مرة ثانية."
        );

    },


    /* ========================================
       نسخ نص
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
                "انسخي الرمز يدويًا من الصندوق."
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
           التنقل السفلي
        ================================== */

        document
            .querySelectorAll(
                ".nav-button"
            )
            .forEach(button => {

                button.addEventListener(
                    "click",
                    () => {

                        const page =
                            button.dataset.page;


                        App.showPage(
                            page
                        );

                    }
                );

            });


        /* ==================================
           زر الملف الشخصي
        ================================== */

        const profileButton =
            document.getElementById(
                "profileButton"
            );


        if (profileButton) {

            profileButton.addEventListener(
                "click",
                () => {

                    App.showPage(
                        "profilePage"
                    );

                }
            );

        }


        /* ==================================
           أزرار الرجوع
        ================================== */

        document
            .querySelectorAll(
                "[data-back]"
            )
            .forEach(button => {

                button.addEventListener(
                    "click",
                    () => {

                        App.showPage(
                            button.dataset.back
                        );

                    }
                );

            });


        /* ==================================
           زر إحساس اليوم
        ================================== */

        const feelingButton =
            document.getElementById(
                "feelingButton"
            );


        if (feelingButton) {

            feelingButton.addEventListener(
                "click",
                () => {

                    App.showPage(
                        "feelingsPage"
                    );

                }
            );

        }


        /* ==================================
           إنشاء منشور
        ================================== */

        const createPostButton =
            document.getElementById(
                "createPostButton"
            );


        if (createPostButton) {

            createPostButton.addEventListener(
                "click",
                () => {

                    const textarea =
                        document.getElementById(
                            "postText"
                        );


                    if (textarea) {
                        textarea.value = "";
                    }


                    App.openModal(
                        "postModal"
                    );


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


                    const post =
                        Posts.create(
                            textarea.value,
                            visibility
                                ? visibility.value
                                : "everyone"
                        );


                    if (!post) {

                        App.showMessage(
                            "المنشور فاضي 🗿",
                            "اكتبي شيئًا أولًا قبل النشر."
                        );

                        return;

                    }


                    textarea.value = "";


                    App.closeModal(
                        "postModal"
                    );


                    App.showPage(
                        "homePage"
                    );

                }
            );

        }


        /* ==================================
           تحديث المنشورات
        ================================== */

        const refreshPosts =
            document.getElementById(
                "refreshPosts"
            );


        if (refreshPosts) {

            refreshPosts.addEventListener(
                "click",
                () => {

                    const container =
                        document.getElementById(
                            "postsContainer"
                        );


                    Posts.render(
                        container
                    );

                }
            );

        }


        /* ==================================
           Friends Box
        ================================== */

        const friendsBoxButton =
            document.getElementById(
                "friendsBoxButton"
            );


        if (friendsBoxButton) {

            friendsBoxButton.addEventListener(
                "click",
                () => {

                    App.showPage(
                        "friendsBoxPage"
                    );

                }
            );

        }


        const createBoxButton =
            document.getElementById(
                "createBoxButton"
            );


        if (createBoxButton) {

            createBoxButton.addEventListener(
                "click",
                () => {

                    App.createFriendsBox();

                }
            );

        }


        const openBoxButton =
            document.getElementById(
                "openBoxButton"
            );


        if (openBoxButton) {

            openBoxButton.addEventListener(
                "click",
                () => {

                    App.openFriendsBox();

                }
            );

        }


        /* ==================================
           التذكيرات
        ================================== */

        const remindersButton =
            document.getElementById(
                "remindersButton"
            );


        if (remindersButton) {

            remindersButton.addEventListener(
                "click",
                () => {

                    App.showPage(
                        "remindersPage"
                    );

                }
            );

        }


        /* ==================================
           إغلاق المودالات
        ================================== */

        document
            .querySelectorAll(
                "[data-close]"
            )
            .forEach(button => {

                button.addEventListener(
                    "click",
                    () => {

                        App.closeModal(
                            button.dataset.close
                        );

                    }
                );

            });


        /* ==================================
           إغلاق عند الضغط خارج النافذة
        ================================== */

        document
            .querySelectorAll(
                ".modal"
            )
            .forEach(modal => {

                modal.addEventListener(
                    "click",
                    event => {

                        if (
                            event.target ===
                            modal
                        ) {

                            App.closeModal(
                                modal.id
                            );

                        }

                    }
                );

            });


        /* ==================================
           زر ESC لإغلاق النوافذ
        ================================== */

        document.addEventListener(
            "keydown",
            event => {

                if (
                    event.key !==
                    "Escape"
                ) {
                    return;
                }


                document
                    .querySelectorAll(
                        ".modal.active"
                    )
                    .forEach(modal => {

                        App.closeModal(
                            modal.id
                        );

                    });

            }
        );


        /* ==================================
           التشغيل الأول
        ================================== */

        App.showPage(
            "homePage"
        );


        Feelings.renderHome();

        Feelings.renderProfile();

        Reminders.render();

        Reminders.renderStreak();


    }
);
