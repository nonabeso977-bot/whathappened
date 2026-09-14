const App = {

    currentPage: "homePage",

    /* =========================
       الصفحات
    ========================= */

    showPage(pageId) {

        document.querySelectorAll(".page").forEach(page => {
            page.classList.remove("active");
        });

        const page = document.getElementById(pageId);

        if (!page) return;

        page.classList.add("active");
        this.currentPage = pageId;

        document.querySelectorAll(".nav-button").forEach(button => {
            button.classList.toggle(
                "active",
                button.dataset.page === pageId
            );
        });

        this.refreshPage(pageId);
    },


    refreshPage(pageId) {

        if (pageId === "homePage") {

            const container =
                document.getElementById("postsContainer");

            if (
                container &&
                typeof Posts !== "undefined" &&
                typeof Posts.render === "function"
            ) {
                Posts.render(container);
            }
        }


        if (pageId === "profilePage") {
            this.updateProfileStats();
        }


        if (pageId === "feelingsPage") {

            const container =
                document.getElementById("feelingsContainer");

            if (
                container &&
                typeof Feelings !== "undefined" &&
                typeof Feelings.render === "function"
            ) {
                Feelings.render(container);
            }

            this.updateCurrentFeeling();
        }


        if (pageId === "remindersPage") {

            const container =
                document.getElementById("remindersContainer");

            if (
                container &&
                typeof Reminders !== "undefined" &&
                typeof Reminders.render === "function"
            ) {
                Reminders.render(container);
            }
        }


        if (pageId === "friendsPage") {
            this.renderFriends();
        }
    },


    /* =========================
       الملف الشخصي
    ========================= */

    updateProfileStats() {

        if (
            typeof Posts === "undefined" ||
            typeof Posts.getStats !== "function"
        ) {
            return;
        }

        const stats = Posts.getStats();

        const postCount =
            document.getElementById("postCount");

        const likeCount =
            document.getElementById("likeCount");

        if (postCount) {
            postCount.textContent = stats.posts || 0;
        }

        if (likeCount) {
            likeCount.textContent = stats.likes || 0;
        }
    },


    /* =========================
       النوافذ
    ========================= */

    openModal(id) {

        const modal =
            document.getElementById(id);

        if (modal) {
            modal.classList.add("active");
        }
    },


    closeModal(id) {

        const modal =
            document.getElementById(id);

        if (modal) {
            modal.classList.remove("active");
        }
    },


    showMessage(message) {

        const content =
            document.getElementById("messageContent");

        if (content) {
            content.textContent = message;
        }

        this.openModal("messageModal");
    },


    /* =========================
       المشاعر
    ========================= */

    updateCurrentFeeling() {

        const currentFeeling =
            document.getElementById("currentFeeling");

        if (!currentFeeling) return;

        if (
            typeof Feelings === "undefined"
        ) {
            return;
        }

        let feeling = null;

        if (
            typeof Feelings.getToday === "function"
        ) {
            feeling = Feelings.getToday();
        }

        if (
            !feeling &&
            typeof Feelings.getCurrent === "function"
        ) {
            feeling = Feelings.getCurrent();
        }

        if (feeling) {
            currentFeeling.textContent =
                "شعورك اليوم: " + feeling;
        }
    },


    chooseFeeling(feeling) {

        if (
            typeof Feelings === "undefined"
        ) {
            return;
        }

        if (
            typeof Feelings.set === "function"
        ) {
            Feelings.set(feeling);
        } else if (
            typeof Feelings.choose === "function"
        ) {
            Feelings.choose(feeling);
        }

        this.updateCurrentFeeling();
    },


    /* =========================
       Friend Code
    ========================= */

    generateFriendCode() {

        const characters =
            "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

        let code = "FRIEND-";

        for (let i = 0; i < 6; i++) {

            const randomIndex =
                Math.floor(
                    Math.random() * characters.length
                );

            code += characters[randomIndex];
        }

        return code;
    },


    getMyFriendCode() {

        let code =
            localStorage.getItem("myFriendCode");

        if (!code) {

            code = this.generateFriendCode();

            localStorage.setItem(
                "myFriendCode",
                code
            );
        }

        return code;
    },


    setupFriendCode() {

        const element =
            document.getElementById("friendCode");

        if (!element) return;

        element.textContent =
            this.getMyFriendCode();
    },


    /* =========================
       الأصدقاء
    ========================= */

    getFriends() {

        try {

            const saved =
                localStorage.getItem("friends");

            if (!saved) {
                return [];
            }

            const friends =
                JSON.parse(saved);

            return Array.isArray(friends)
                ? friends
                : [];

        } catch (error) {

            return [];
        }
    },


    saveFriends(friends) {

        localStorage.setItem(
            "friends",
            JSON.stringify(friends)
        );
    },


    addFriend() {

        const input =
            document.getElementById("friendCodeInput");

        if (!input) return;

        const code =
            input.value.trim().toUpperCase();

        if (!code) {

            this.showMessage(
                "اكتبي كود الصديق أولًا ♡"
            );

            return;
        }


        if (!code.startsWith("FRIEND-")) {

            this.showMessage(
                "الكود لازم يبدأ بـ FRIEND-"
            );

            return;
        }


        const myCode =
            this.getMyFriendCode();

        if (code === myCode) {

            this.showMessage(
                "هذا كودك أنتِ 🗿"
            );

            return;
        }


        const friends =
            this.getFriends();


        const alreadyAdded =
            friends.some(
                friend => friend.code === code
            );


        if (alreadyAdded) {

            this.showMessage(
                "هذا الصديق مضاف بالفعل ♡"
            );

            return;
        }


        friends.push({
            code: code,
            name: "صديق جديد ♡",
            addedAt: new Date().toISOString()
        });


        this.saveFriends(friends);

        input.value = "";

        this.renderFriends();

        this.showMessage(
            "تمت إضافة الصديق ♡"
        );
    },


    removeFriend(code) {

        const friends =
            this.getFriends();

        const updated =
            friends.filter(
                friend => friend.code !== code
            );

        this.saveFriends(updated);

        this.renderFriends();
    },


    renderFriends() {

        const container =
            document.getElementById("friendsList");

        if (!container) return;

        const friends =
            this.getFriends();


        if (friends.length === 0) {

            container.innerHTML = `
                <p class="empty-friends">
                    ما عندكش أصدقاء مضافين لحد الآن ♡
                </p>
            `;

            return;
        }


        container.innerHTML =
            friends.map(friend => {

                const safeCode =
                    this.escapeHTML(friend.code);

                return `
                    <div class="friend-item">

                        <div class="friend-avatar">
                            ♡
                        </div>

                        <div class="friend-info">

                            <strong>
                                صديق جديد
                            </strong>

                            <span>
                                ${safeCode}
                            </span>

                        </div>

                        <button
                            class="secondary-button remove-friend-button"
                            type="button"
                            data-remove-friend="${safeCode}"
                        >
                            حذف
                        </button>

                    </div>
                `;

            }).join("");
    },


    /* =========================
       نسخ الكود
    ========================= */

    async copyFriendCode() {

        const code =
            this.getMyFriendCode();

        try {

            await navigator.clipboard.writeText(
                code
            );

            this.showMessage(
                "تم نسخ كودك ♡"
            );

        } catch (error) {

            this.showMessage(
                "ما قدرناش ننسخوا الكود تلقائيًا."
            );
        }
    },


    /* =========================
       التذكيرات
    ========================= */

    addReminder() {

        const text =
            prompt("اكتبي التذكير ♡");

        if (!text || !text.trim()) {
            return;
        }

        if (
            typeof Reminders !== "undefined" &&
            typeof Reminders.add === "function"
        ) {

            Reminders.add(
                text.trim()
            );

            this.refreshPage(
                "remindersPage"
            );

        } else {

            this.showMessage(
                "نظام التذكيرات غير متاح حاليًا."
            );
        }
    },


    /* =========================
       حماية النص
    ========================= */

    escapeHTML(text) {

        const div =
            document.createElement("div");

        div.textContent =
            text;

        return div.innerHTML;
    }
};



/* =========================
   تشغيل التطبيق
========================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        /* التنقل */

        document.querySelectorAll(
            "[data-page]"
        ).forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    App.showPage(
                        button.dataset.page
                    );
                }
            );
        });


        /* الصفحة الرئيسية */

        App.showPage("homePage");


        /* Friend Code */

        App.setupFriendCode();


        /* إضافة صديق */

        const addFriendButton =
            document.getElementById(
                "addFriendButton"
            );

        if (addFriendButton) {

            addFriendButton.addEventListener(
                "click",
                () => {
                    App.addFriend();
                }
            );
        }


        /* زر نسخ الكود */

        const copyFriendCode =
            document.getElementById(
                "copyFriendCode"
            );

        if (copyFriendCode) {

            copyFriendCode.addEventListener(
                "click",
                () => {
                    App.copyFriendCode();
                }
            );
        }


        /* حذف صديق */

        const friendsList =
            document.getElementById(
                "friendsList"
            );

        if (friendsList) {

            friendsList.addEventListener(
                "click",
                event => {

                    const button =
                        event.target.closest(
                            "[data-remove-friend]"
                        );

                    if (!button) return;

                    const code =
                        button.dataset.removeFriend;

                    App.removeFriend(code);
                }
            );
        }


        /* زر إنشاء منشور */

        const openPostButton =
            document.getElementById(
                "openPostButton"
            );

        if (openPostButton) {

            openPostButton.addEventListener(
                "click",
                () => {
                    App.openModal("postModal");
                }
            );
        }


        /* إغلاق المنشور */

        const closePostModal =
            document.getElementById(
                "closePostModal"
            );

        if (closePostModal) {

            closePostModal.addEventListener(
                "click",
                () => {
                    App.closeModal("postModal");
                }
            );
        }


        /* زر المشاعر */

        const goFeelingsButton =
            document.getElementById(
                "goFeelingsButton"
            );

        if (goFeelingsButton) {

            goFeelingsButton.addEventListener(
                "click",
                () => {
                    App.showPage("feelingsPage");
                }
            );
        }


        /* اختيار الشعور */

        document.querySelectorAll(
            "[data-feeling]"
        ).forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    App.chooseFeeling(
                        button.dataset.feeling
                    );

                    App.showPage(
                        "homePage"
                    );
                }
            );
        });


        /* الصورة */

        const postImage =
            document.getElementById(
                "postImage"
            );

        const imagePreview =
            document.getElementById(
                "imagePreview"
            );

        let selectedImage = null;


        if (postImage) {

            postImage.addEventListener(
                "change",
                event => {

                    const file =
                        event.target.files?.[0];

                    if (!file) {

                        selectedImage = null;

                        if (imagePreview) {
                            imagePreview.innerHTML = "";
                        }

                        return;
                    }


                    if (
                        !file.type.startsWith(
                            "image/"
                        )
                    ) {

                        App.showMessage(
                            "اختاري صورة فقط ♡"
                        );

                        postImage.value = "";

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


                    reader.readAsDataURL(
                        file
                    );
                }
            );
        }


        /* نشر المنشور */

        const publishPostButton =
            document.getElementById(
                "publishPostButton"
            );


        if (publishPostButton) {

            publishPostButton.addEventListener(
                "click",
                () => {

                    const textInput =
                        document.getElementById(
                            "postText"
                        );

                    const visibilityInput =
                        document.getElementById(
                            "postVisibility"
                        );


                    const text =
                        textInput
                            ? textInput.value.trim()
                            : "";


                    const visibility =
                        visibilityInput
                            ? visibilityInput.value
                            : "everyone";


                    if (
                        !text &&
                        !selectedImage
                    ) {

                        App.showMessage(
                            "اكتبي شيء أو اختاري صورة ♡"
                        );

                        return;
                    }


                    if (
                        typeof Posts === "undefined" ||
                        typeof Posts.create !== "function"
                    ) {

                        App.showMessage(
                            "نظام المنشورات غير متاح."
                        );

                        return;
                    }


                    Posts.create(
                        text,
                        visibility,
                        selectedImage
                    );


                    if (textInput) {
                        textInput.value = "";
                    }


                    if (postImage) {
                        postImage.value = "";
                    }


                    if (imagePreview) {
                        imagePreview.innerHTML = "";
                    }


                    selectedImage = null;


                    App.closeModal(
                        "postModal"
                    );

                    App.showPage(
                        "homePage"
                    );
                }
            );
        }


        /* إغلاق نافذة الرسائل */

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


        /* إغلاق النوافذ عند الضغط خارجها */

        document.querySelectorAll(
            ".modal"
        ).forEach(modal => {

            modal.addEventListener(
                "click",
                event => {

                    if (
                        event.target === modal
                    ) {
                        modal.classList.remove(
                            "active"
                        );
                    }
                }
            );
        });


        /* إضافة تذكير */

        const addReminderButton =
            document.getElementById(
                "addReminderButton"
            );


        if (addReminderButton) {

            addReminderButton.addEventListener(
                "click",
                () => {
                    App.addReminder();
                }
            );
        }


        /* عرض الأصدقاء */

        App.renderFriends();

    }
);