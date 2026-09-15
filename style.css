/* ========================================
   Friends Boxes Open ♡
   Main App System
======================================== */

const App = {

    currentPage: "homePage",


    /* ================================
       الصفحات
    ================================= */

    showPage(pageId) {

        const pages =
            document.querySelectorAll(".page");


        pages.forEach(page => {

            page.classList.remove("active");

        });


        const page =
            document.getElementById(pageId);


        if (!page) {
            return;
        }


        page.classList.add("active");

        this.currentPage = pageId;


        /*
           نخفي شريط التنقل في صفحة الإعدادات
           لأنها صفحة مستقلة
        */

        const bottomNav =
            document.querySelector(".bottom-nav");


        if (bottomNav) {

            bottomNav.style.display =
                pageId === "settingsPage"
                    ? "none"
                    : "";

        }


        /*
           تحديث الزر النشط
        */

        document
            .querySelectorAll(".nav-button")
            .forEach(button => {

                button.classList.toggle(
                    "active",
                    button.dataset.page === pageId
                );

            });


        this.refreshPage(pageId);
    },


    /* ================================
       تحديث الصفحة
    ================================= */

    refreshPage(pageId) {

        if (pageId === "homePage") {

            const container =
                document.getElementById(
                    "postsContainer"
                );


            if (
                container &&
                typeof Posts !== "undefined" &&
                typeof Posts.render === "function"
            ) {

                Posts.render(container);

            }
        }


        if (pageId === "profilePage") {

            this.updateProfile();

            this.updateProfileStats();

            this.updateProfileFeeling();

        }


        if (pageId === "feelingsPage") {

            const container =
                document.getElementById(
                    "feelingsContainer"
                );


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
                document.getElementById(
                    "remindersContainer"
                );


            if (
                container &&
                typeof Reminders !== "undefined" &&
                typeof Reminders.render === "function"
            ) {

                Reminders.render(container);

            }

        }


        if (pageId === "friendsPage") {

            this.setupFriendCode();

            this.renderFriends();

        }


        if (pageId === "settingsPage") {

            if (
                typeof Settings !== "undefined" &&
                typeof Settings.renderThemes === "function"
            ) {

                Settings.renderThemes();

            }

        }

    },


    /* ================================
       البروفايل
    ================================= */

    updateProfile() {

        const nameElement =
            document.getElementById(
                "profileName"
            );


        if (!nameElement) {
            return;
        }


        const savedName =
            localStorage.getItem(
                "profileName"
            );


        if (savedName) {

            nameElement.textContent =
                savedName;

        } else {

            nameElement.textContent =
                "مستخدم جديد";

        }

    },


    editProfile() {

        const currentName =
            localStorage.getItem(
                "profileName"
            ) || "مستخدم جديد";


        const newName =
            prompt(
                "اكتبي اسم البروفايل ♡",
                currentName
            );


        if (
            newName === null
        ) {

            return;

        }


        const cleanName =
            newName.trim();


        if (!cleanName) {

            this.showMessage(
                "الاسم ما يقدرش يكون فاضي ♡"
            );

            return;

        }


        if (cleanName.length > 30) {

            this.showMessage(
                "الاسم طويل شوية، خليه أقل من 30 حرف."
            );

            return;

        }


        localStorage.setItem(
            "profileName",
            cleanName
        );


        this.updateProfile();


        this.showMessage(
            "تم تحديث البروفايل ♡"
        );

    },


    updateProfileStats() {

        const postCount =
            document.getElementById(
                "postCount"
            );


        const likeCount =
            document.getElementById(
                "likeCount"
            );


        if (
            typeof Posts === "undefined" ||
            typeof Posts.getStats !== "function"
        ) {

            return;

        }


        const stats =
            Posts.getStats();


        if (postCount) {

            postCount.textContent =
                stats.posts || 0;

        }


        if (likeCount) {

            likeCount.textContent =
                stats.likes || 0;

        }

    },


    updateProfileFeeling() {

        const element =
            document.getElementById(
                "profileFeeling"
            );


        if (!element) {
            return;
        }


        const feeling =
            localStorage.getItem(
                "current_feeling"
            );


        if (feeling) {

            element.textContent =
                "شعورك اليوم: " + feeling;

        } else {

            element.textContent =
                "لم تحدد إحساسك اليوم بعد ｡";

        }

    },


    /* ================================
       الإحساس
    ================================= */

    updateCurrentFeeling() {

        const element =
            document.getElementById(
                "currentFeeling"
            );


        if (!element) {
            return;
        }


        const feeling =
            localStorage.getItem(
                "current_feeling"
            );


        if (feeling) {

            element.textContent =
                "شعورك اليوم: " + feeling;

        } else {

            element.textContent =
                "كيف تشعر اليوم؟ ♡";

        }

    },


    chooseFeeling(feeling) {

        if (
            typeof Feelings === "undefined"
        ) {

            return;

        }


        if (
            typeof Feelings.choose === "function"
        ) {

            Feelings.choose(feeling);

        } else if (
            typeof Feelings.set === "function"
        ) {

            Feelings.set(feeling);

        }


        this.updateCurrentFeeling();

        this.updateProfileFeeling();

    },


    /* ================================
       الأكواد
    ================================= */

    generateFriendCode() {

        const characters =
            "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";


        let code =
            "FRIEND-";


        for (
            let i = 0;
            i < 6;
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


    getMyFriendCode() {

        let code =
            localStorage.getItem(
                "myFriendCode"
            );


        if (!code) {

            code =
                this.generateFriendCode();


            localStorage.setItem(
                "myFriendCode",
                code
            );

        }


        return code;

    },


    setupFriendCode() {

        const element =
            document.getElementById(
                "friendCode"
            );


        if (!element) {
            return;
        }


        element.textContent =
            this.getMyFriendCode();

    },


    /* ================================
       الأصدقاء
    ================================= */

    getFriends() {

        try {

            const saved =
                localStorage.getItem(
                    "friends"
                );


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
            document.getElementById(
                "friendCodeInput"
            );


        if (!input) {
            return;
        }


        const code =
            input.value
                .trim()
                .toUpperCase();


        if (!code) {

            this.showMessage(
                "اكتبي كود الصديق أولًا ♡"
            );

            return;

        }


        if (
            !code.startsWith("FRIEND-")
        ) {

            this.showMessage(
                "الكود لازم يبدأ بـ FRIEND-"
            );

            return;

        }


        if (
            code.length !== 13
        ) {

            this.showMessage(
                "كود الصديق لازم يكون بالشكل FRIEND-XXXXXX"
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


        const exists =
            friends.some(
                friend =>
                    friend.code === code
            );


        if (exists) {

            this.showMessage(
                "هذا الصديق مضاف بالفعل ♡"
            );

            return;

        }


        friends.push({

            code: code,

            name: "صديق جديد ♡",

            addedAt:
                new Date().toISOString()

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
                friend =>
                    friend.code !== code
            );


        this.saveFriends(updated);


        this.renderFriends();

    },


    renderFriends() {

        const container =
            document.getElementById(
                "friendsList"
            );


        if (!container) {
            return;
        }


        const friends =
            this.getFriends();


        if (
            friends.length === 0
        ) {

            container.innerHTML = `
                <p class="empty-friends">
                    ما عندكش أصدقاء مضافين لحد الآن ♡
                </p>
            `;

            return;

        }


        container.innerHTML =
            friends
                .map(friend => {

                    const safeCode =
                        this.escapeHTML(
                            friend.code
                        );


                    const safeName =
                        this.escapeHTML(
                            friend.name ||
                            "صديق جديد"
                        );


                    return `
                        <div class="friend-item">

                            <div class="friend-avatar">
                                ♡
                            </div>

                            <div class="friend-info">

                                <strong>
                                    ${safeName}
                                </strong>

                                <span>
                                    ${safeCode}
                                </span>

                            </div>

                            <div class="friend-actions">

                                <button
                                    class="primary-button chat-friend-button"
                                    type="button"
                                    data-chat-friend="${safeCode}"
                                >
                                    فتح الشات
                                </button>

                                <button
                                    class="secondary-button remove-friend-button"
                                    type="button"
                                    data-remove-friend="${safeCode}"
                                >
                                    حذف
                                </button>

                            </div>

                        </div>
                    `;

                })
                .join("");

    },


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


    /* ================================
       التذكيرات
    ================================= */

    addReminder() {

        const text =
            prompt(
                "اكتبي التذكير ♡"
            );


        if (
            !text ||
            !text.trim()
        ) {

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


    /* ================================
       النوافذ
    ================================= */

    openModal(id) {

        const modal =
            document.getElementById(id);


        if (modal) {

            modal.classList.add(
                "active"
            );

        }

    },


    closeModal(id) {

        const modal =
            document.getElementById(id);


        if (modal) {

            modal.classList.remove(
                "active"
            );

        }

    },


    showMessage(message) {

        const content =
            document.getElementById(
                "messageContent"
            );


        if (content) {

            content.textContent =
                message;

        }


        this.openModal(
            "messageModal"
        );

    },


    /* ================================
       أدوات
    ================================= */

    escapeHTML(text) {

        const div =
            document.createElement(
                "div"
            );


        div.textContent =
            text ?? "";


        return div.innerHTML;

    }

};


/* ========================================
   تشغيل التطبيق
======================================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {


        /* ================================
           أزرار التنقل
        ================================= */

        document
            .querySelectorAll(
                ".nav-button"
            )
            .forEach(button => {

                button.addEventListener(
                    "click",
                    () => {

                        App.showPage(
                            button.dataset.page
                        );

                    }
                );

            });


        /* ================================
           زر الإحساس
        ================================= */

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


        document
            .querySelectorAll(
                "[data-feeling]"
            )
            .forEach(button => {

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


        /* ================================
           البروفايل
        ================================= */

        const editProfileButton =
            document.getElementById(
                "editProfileButton"
            );


        if (editProfileButton) {

            editProfileButton.addEventListener(
                "click",
                () => {

                    App.editProfile();

                }
            );

        }


        /* ================================
           الإعدادات
        ================================= */

        const settingsButton =
            document.getElementById(
                "settingsButton"
            );


        if (settingsButton) {

            settingsButton.addEventListener(
                "click",
                () => {

                    App.showPage(
                        "settingsPage"
                    );

                }
            );

        }


        const backToProfileButton =
            document.getElementById(
                "backToProfileButton"
            );


        if (backToProfileButton) {

            backToProfileButton.addEventListener(
                "click",
                () => {

                    App.showPage(
                        "profilePage"
                    );

                }
            );

        }


        /* ================================
           كود الصديق
        ================================= */

        App.setupFriendCode();


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


        const friendsList =
            document.getElementById(
                "friendsList"
            );


        if (friendsList) {

            friendsList.addEventListener(
                "click",
                event => {

                    const removeButton =
                        event.target.closest(
                            "[data-remove-friend]"
                        );


                