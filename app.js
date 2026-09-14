const App = {
    currentPage: "homePage",

    showPage(pageId) {
        document.querySelectorAll(".page").forEach(page => {
            page.classList.remove("active");
        });

        const page = document.getElementById(pageId);

        if (page) {
            page.classList.add("active");
            this.currentPage = pageId;
        }

        this.updateNavigation(pageId);
        this.refreshPage(pageId);
    },

    updateNavigation(pageId) {
        document.querySelectorAll("[data-page]").forEach(button => {
            button.classList.toggle(
                "active",
                button.dataset.page === pageId
            );
        });
    },

    refreshPage(pageId) {
        if (pageId === "homePage") {
            const postsContainer =
                document.getElementById("postsContainer");

            if (postsContainer && typeof Posts !== "undefined") {
                Posts.render(postsContainer);
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
    },

    updateProfileStats() {
        if (typeof Posts === "undefined") return;

        const stats =
            typeof Posts.getStats === "function"
                ? Posts.getStats()
                : { posts: 0, likes: 0 };

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

    openModal(id) {
        const modal = document.getElementById(id);

        if (modal) {
            modal.classList.add("active");
        }
    },

    closeModal(id) {
        const modal = document.getElementById(id);

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

    generateFriendCode() {
        return "FRIEND-" +
            Math.random()
                .toString(36)
                .substring(2, 8)
                .toUpperCase();
    }
};


document.addEventListener("DOMContentLoaded", () => {

    /* =========================
       Navigation
    ========================= */

    document.querySelectorAll("[data-page]").forEach(button => {
        button.addEventListener("click", () => {
            const pageId = button.dataset.page;

            if (pageId) {
                App.showPage(pageId);
            }
        });
    });


    /* =========================
       Post Modal
    ========================= */

    const openPostButton =
        document.getElementById("openPostButton");

    const closePostModal =
        document.getElementById("closePostModal");

    const publishPostButton =
        document.getElementById("publishPostButton");

    const postModal =
        document.getElementById("postModal");

    if (openPostButton) {
        openPostButton.addEventListener("click", () => {
            App.openModal("postModal");
        });
    }

    if (closePostModal) {
        closePostModal.addEventListener("click", () => {
            App.closeModal("postModal");
        });
    }


    /* =========================
       Image Preview
    ========================= */

    const postImage =
        document.getElementById("postImage");

    const imagePreview =
        document.getElementById("imagePreview");

    let selectedImage = null;

    if (postImage) {
        postImage.addEventListener("change", event => {

            const file = event.target.files?.[0];

            if (!file) {
                selectedImage = null;

                if (imagePreview) {
                    imagePreview.innerHTML = "";
                }

                return;
            }

            if (!file.type.startsWith("image/")) {
                App.showMessage("اختاري صورة فقط ♡");
                postImage.value = "";
                return;
            }

            const reader = new FileReader();

            reader.onload = event => {
                selectedImage = event.target.result;

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
        });
    }


    /* =========================
       Publish Post
    ========================= */

    if (publishPostButton) {
        publishPostButton.addEventListener("click", () => {

            const textInput =
                document.getElementById("postText");

            const visibilityInput =
                document.getElementById("postVisibility");

            const text =
                textInput ? textInput.value.trim() : "";

            const visibility =
                visibilityInput
                    ? visibilityInput.value
                    : "everyone";

            if (
                !text &&
                !selectedImage
            ) {
                App.showMessage("اكتبي شيء أو اختاري صورة ♡");
                return;
            }

            if (
                typeof Posts === "undefined" ||
                typeof Posts.create !== "function"
            ) {
                App.showMessage("صار خطأ في نظام المنشورات 🗿");
                return;
            }

            const post = Posts.create(
                text,
                visibility,
                selectedImage
            );

            if (!post) {
                App.showMessage("ما قدرناش ننشر المنشور.");
                return;
            }

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

            App.closeModal("postModal");
            App.showPage("homePage");
        });
    }


    /* =========================
       Message Modal
    ========================= */

    const closeMessageModal =
        document.getElementById("closeMessageModal");

    if (closeMessageModal) {
        closeMessageModal.addEventListener("click", () => {
            App.closeModal("messageModal");
        });
    }


    /* =========================
       Close Modal by Clicking Outside
    ========================= */

    document.querySelectorAll(".modal").forEach(modal => {

        modal.addEventListener("click", event => {

            if (event.target === modal) {
                modal.classList.remove("active");
            }

        });

    });


    /* =========================
       Feelings
    ========================= */

    document.querySelectorAll("[data-feeling]").forEach(button => {

        button.addEventListener("click", () => {

            const feeling =
                button.dataset.feeling;

            if (
                typeof Feelings !== "undefined"
            ) {

                if (
                    typeof Feelings.set === "function"
                ) {
                    Feelings.set(feeling);

                } else if (
                    typeof Feelings.select === "function"
                ) {
                    Feelings.select(feeling);
                }

            }

        });

    });


    /* =========================
       Friend Code
    ========================= */

    const friendCode =
        document.getElementById("friendCode");

    if (friendCode) {

        let code =
            localStorage.getItem("friendCode");

        if (!code) {
            code = App.generateFriendCode();
            localStorage.setItem("friendCode", code);
        }

        friendCode.textContent = code;
    }


    const copyFriendCode =
        document.getElementById("copyFriendCode");

    if (copyFriendCode) {

        copyFriendCode.addEventListener("click", async () => {

            const code =
                document.getElementById("friendCode");

            if (!code) return;

            try {

                await navigator.clipboard.writeText(
                    code.textContent
                );

                App.showMessage("تم نسخ الكود ♡");

            } catch (error) {

                App.showMessage(
                    "ما قدرناش ننسخوا الكود تلقائيًا."
                );

            }

        });

    }


    /* =========================
       Add Reminder
    ========================= */

    const addReminderButton =
        document.getElementById("addReminderButton");

    if (addReminderButton) {

        addReminderButton.addEventListener("click", () => {

            const text =
                prompt("اكتبي التذكير ♡");

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

                Reminders.add(text.trim());

                App.refreshPage("remindersPage");

            } else {

                App.showMessage(
                    "نظام التذكيرات مش متاح حاليًا."
                );

            }

        });

    }


    /* =========================
       Initial Page
    ========================= */

    App.showPage("homePage");

});