
/* Friends Boxes Open - Room System */

const FriendRoom = {
    friendId: null,
    friendName: "صديقي",

    open(friendId, friendName) {
        this.friendId = friendId;
        this.friendName = friendName || "صديقي";

        const title = document.getElementById("roomFriendName");

        if (title) {
            title.textContent = this.friendName;
        }

        const panel = document.getElementById("roomActionPanel");

        if (panel) {
            panel.hidden = true;
        }

        App.showPage("roomPage");
    },

    showAction(action) {
        const panel = document.getElementById("roomActionPanel");
        const title = document.getElementById("roomActionTitle");
        const description = document.getElementById("roomActionDescription");

        if (!panel || !title || !description) return;

        const actions = {
            chat: {
                title: "الكنبة ♡",
                description: "هنا ستكون محادثتك الخاصة مع " +
                    this.friendName + ". سنبني الرسائل في المرحلة القادمة."
            },
            games: {
                title: "التلفزيون 🎮",
                description: "هنا ستجدان الألعاب المشتركة والتحديات."
            },
            album: {
                title: "ألبوم الذكريات 📷",
                description: "هنا ستظهر الصور واللحظات التي تشاركتماها."
            },
            streak: {
                title: "ساعة الصداقة 🕒",
                description: "هنا سيظهر الستريك ومدة صداقتكما."
            }
        };

        const selected = actions[action];
        if (!selected) return;

        title.textContent = selected.title;
        description.textContent = selected.description;
        panel.hidden = false;

        panel.scrollIntoView({
            behavior: "smooth",
            block: "nearest"
        });
    },

    closeAction() {
        const panel = document.getElementById("roomActionPanel");

        if (panel) {
            panel.hidden = true;
        }
    },

    init() {
        document.addEventListener("click", event => {
            const friendButton = event.target.closest(".friend-chat-button");

            if (friendButton) {
                this.open(
                    friendButton.dataset.friendId,
                    friendButton.dataset.friendName
                );
                return;
            }

            const object = event.target.closest("[data-room-action]");

            if (object) {
                this.showAction(object.dataset.roomAction);
                return;
            }

            if (event.target.closest("#closeRoomAction")) {
                this.closeAction();
            }

            if (event.target.closest("#roomBackButton")) {
                App.showPage("friendsPage");
            }
        });
    }
};

document.addEventListener("DOMContentLoaded", () => {
    FriendRoom.init();
});
