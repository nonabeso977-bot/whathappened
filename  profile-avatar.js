
const ProfileAvatar = {
    storageKey: "profileAvatarImage",

    init() {
        const avatar = document.getElementById("profileAvatar");
        if (!avatar) return;

        avatar.setAttribute("role", "button");
        avatar.setAttribute("tabindex", "0");
        avatar.setAttribute("aria-label", "اختيار صورة الملف الشخصي");
        avatar.title = "اضغطي لاختيار صورة";

        const input = document.createElement("input");
        input.type = "file";
        input.accept = "image/*";
        input.hidden = true;
        input.id = "profileAvatarInput";

        avatar.after(input);

        avatar.addEventListener("click", () => input.click());

        avatar.addEventListener("keydown", event => {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                input.click();
            }
        });

        input.addEventListener("change", event => {
            const file = event.target.files && event.target.files[0];
            if (file) this.processImage(file);
        });

        this.load();
    },

    processImage(file) {
        if (!file.type.startsWith("image/")) {
            this.notify("اختاري ملف صورة.");
            return;
        }

        if (file.size > 8 * 1024 * 1024) {
            this.notify("الصورة كبيرة. اختاري صورة أقل من 8 ميغابايت.");
            return;
        }

        const reader = new FileReader();

        reader.onload = () => {
            const image = new Image();

            image.onload = () => {
                const canvas = document.createElement("canvas");
                const size = 320;

                canvas.width = size;
                canvas.height = size;

                const context = canvas.getContext("2d");
                const cropSize = Math.min(image.width, image.height);
                const sx = (image.width - cropSize) / 2;
                const sy = (image.height - cropSize) / 2;

                context.drawImage(
                    image,
                    sx, sy, cropSize, cropSize,
                    0, 0, size, size
                );

                const compressed = canvas.toDataURL("image/jpeg", 0.78);

                try {
                    localStorage.setItem(this.storageKey, compressed);
                    this.show(compressed);
                    this.notify("تم تحديث صورة البروفايل.");
                } catch (error) {
                    console.error("Avatar storage error:", error);
                    this.notify("ما قدرناش نحفظوا الصورة. مساحة التخزين قد تكون ممتلئة.");
                }
            };

            image.onerror = () => this.notify("تعذر فتح الصورة.");
            image.src = reader.result;
        };

        reader.onerror = () => this.notify("تعذر قراءة الصورة.");
        reader.readAsDataURL(file);
    },

    load() {
        const saved = localStorage.getItem(this.storageKey);
        if (saved) this.show(saved);
    },

    show(source) {
        const avatar = document.getElementById("profileAvatar");
        if (!avatar) return;

        avatar.textContent = "";

        const image = document.createElement("img");
        image.src = source;
        image.alt = "صورة الملف الشخصي";

        avatar.appendChild(image);
        avatar.classList.add("has-avatar");
    },

    notify(message) {
        if (window.App && typeof App.openMessage === "function") {
            App.openMessage("صورة البروفايل", message);
        } else {
            alert(message);
        }
    }
};

document.addEventListener("DOMContentLoaded", () => {
    ProfileAvatar.init();
});
