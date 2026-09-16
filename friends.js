/* ========================================
   Friends Boxes Open ♡
   Friends System
   Supabase + Friends Box
======================================== */

const Friends = {

    storageKey: "friends_local",

    generateCode() {

        const chars =
            "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

        let code = "FRIEND-";

        for (let i = 0; i < 6; i++) {
            code +=
                chars.charAt(
                    Math.floor(
                        Math.random() * chars.length
                    )
                );
        }

        return code;
    },


    async getUser() {

        if (
            typeof Online !== "undefined" &&
            typeof Online.getUser === "function"
        ) {
            return await Online.getUser();
        }

        if (
            typeof supabaseClient !== "undefined"
        ) {
            const {
                data,
                error
            } =
                await supabaseClient.auth.getUser();

            if (
                error ||
                !data ||
                !data.user
            ) {
                return null;
            }

            return data.user;
        }

        return null;
    },


    async ensureProfile() {

        const user =
            await this.getUser();

        if (!user) {
            return null;
        }

        const {
            data: existing,
            error: findError
        } =
            await supabaseClient
                .from("profiles")
                .select(
                    "id, username, friend_code"
                )
                .eq("id", user.id)
                .maybeSingle();

        if (findError) {
            console.error(
                "Profile lookup error:",
                findError
            );

            return null;
        }


        if (
            existing &&
            existing.friend_code
        ) {
            return existing;
        }


        let friendCode = null;
        let attempts = 0;

        while (
            !friendCode &&
            attempts < 10
        ) {

            const newCode =
                this.generateCode();

            const {
                data: duplicate
            } =
                await supabaseClient
                    .from("profiles")
                    .select("id")
                    .eq(
                        "friend_code",
                        newCode
                    )
                    .maybeSingle();

            if (!duplicate) {
                friendCode = newCode;
            }

            attempts++;
        }


        if (!friendCode) {
            console.error(
                "Could not generate unique friend code"
            );

            return null;
        }


        const username =
            existing &&
            existing.username
                ? existing.username
                : (
                    user.email
                        ? user.email.split("@")[0]
                        : "مستخدم جديد"
                );


        const {
            data,
            error
        } =
            await supabaseClient
                .from("profiles")
                .upsert(
                    {
                        id: user.id,
                        username: username,
                        friend_code: friendCode
                    },
                    {
                        onConflict: "id"
                    }
                )
                .select()
                .single();


        if (error) {
            console.error(
                "Profile creation error:",
                error
            );

            return null;
        }

        return data;
    },


    async loadMyCode() {

        const element =
            document.getElementById(
                "friendCode"
            );

        if (!element) {
            return;
        }


        const user =
            await this.getUser();


        if (!user) {

            element.textContent =
                "سجلي دخولك أولًا";

            return;
        }


        const profile =
            await this.ensureProfile();


        if (
            !profile ||
            !profile.friend_code
        ) {

            element.textContent =
                "FRIEND-......";

            return;
        }


        element.textContent =
            profile.friend_code;
    },


    async copyCode() {

        const element =
            document.getElementById(
                "friendCode"
            );

        if (!element) {
            return;
        }

        const code =
            element.textContent.trim();


        if (
            !code ||
            !code.startsWith("FRIEND-")
        ) {
            this.showMessage(
                "ما فيش كود",
                "سجلي دخولك أولًا باش نقدروا نعطوك كودك ♡"
            );

            return;
        }


        try {

            await navigator.clipboard.writeText(
                code
            );

            this.showMessage(
                "تم النسخ ♡",
                "كودك انسخ للحافظة"
            );

        } catch (error) {

            console.error(
                "Copy error:",
                error
            );

            this.showMessage(
                "تعذر النسخ",
                "اضغطي مطولًا على الكود وانسخيه يدويًا"
            );
        }
    },


    async addFriend() {

        const input =
            document.getElementById(
                "friendCodeInput"
            );

        if (!input) {
            return;
        }


        const friendCode =
            input.value
                .trim()
                .toUpperCase();


        if (!friendCode) {

            this.showMessage(
                "الكود فاضي",
                "اكتبي كود الصديق أولًا ♡"
            );

            return;
        }


        const user =
            await this.getUser();


        if (!user) {

            this.showMessage(
                "لازم حساب",
                "سجلي دخولك أولًا باش تضيفي أصدقاء"
            );

            return;
        }


        const myProfile =
            await this.ensureProfile();


        if (!myProfile) {

            this.showMessage(
                "حصلت مشكلة",
                "ما قدرناش نجهزوا حسابك في Friends Box"
            );

            return;
        }


        if (
            friendCode ===
            myProfile.friend_code
        ) {

            this.showMessage(
                "هذا كودك أنتِ 🗿",
                "ما تقدريش تضيفي روحك كصديقة"
            );

            return;
        }


        const {
            data: friend,
            error: friendError
        } =
            await supabaseClient
                .from("profiles")
                .select(
                    "id, username, friend_code"
                )
                .eq(
                    "friend_code",
                    friendCode
                )
                .maybeSingle();


        if (friendError) {

            console.error(
                "Friend search error:",
                friendError
            );

            this.showMessage(
                "حصل خطأ",
                "ما قدرناش نبحثوا عن الكود"
            );

            return;
        }


        if (!friend) {

            this.showMessage(
                "الكود غير موجود",
                "تأكدي من الكود وجربي مرة ثانية"
            );

            return;
        }


        const {
            data: alreadyFriend,
            error: existingError
        } =
            await supabaseClient
                .from("friendships")
                .select(
                    "id"
                )
                .or(
                    `and(user_id.eq.${user.id},friend_id.eq.${friend.id}),and(user_id.eq.${friend.id},friend_id.eq.${user.id})`
                )
                .maybeSingle();


        if (existingError) {

            console.error(
                "Friendship lookup error:",
                existingError
            );

            this.showMessage(
                "حصل خطأ",
                "ما قدرناش نتحققوا من الصداقة"
            );

            return;
        }


        if (alreadyFriend) {

            this.showMessage(
                "مضاف من قبل ♡",
                `${friend.username} موجود أصلًا في قائمة أصدقائك`
            );

            return;
        }


        const {
            error: insertError
        } =
            await supabaseClient
                .from("friendships")
                .insert({
                    user_id: user.id,
                    friend_id: friend.id
                });


        if (insertError) {

            console.error(
                "Add friend error:",
                insertError
            );

            this.showMessage(
                "تعذر إضافة الصديق",
                "تأكدي من إعداد جدول friendships والصلاحيات في Supabase"
            );

            return;
        }


        input.value = "";

        await this.render();


        this.showMessage(
            "تمت الإضافة ♡",
            `أضفنا ${friend.username} إلى أصدقائك`
        );
    },


    async getFriends() {

        const user =
            await this.getUser();


        if (!user) {
            return [];
        }


        const {
            data,
            error
        } =
            await supabaseClient
                .from("friendships")
                .select(
                    "friend_id, profiles!friendships_friend_id_fkey(id, username, friend_code)"
                )
                .eq(
                    "user_id",
                    user.id
                );


        if (error) {

            console.error(
                "Get friends error:",
                error
            );

            return [];
        }


        return (data || [])
            .map(row => row.profiles)
            .filter(Boolean);
    },


    async render() {

        const container =
            document.getElementById(
                "friendsList"
            );

        if (!container) {
            return;
        }


        const user =
            await this.getUser();


        if (!user) {

            container.innerHTML = `
                <div class="empty-state small">
                    <div class="empty-icon">
                        ♡
                    </div>

                    <p>
                        سجلي دخولك باش تشوفي أصدقاءك
                    </p>
                </div>
            `;

            return;
        }


        const friends =
            await this.getFriends();


        if (!friends.length) {

            container.innerHTML = `
                <div class="empty-state small">
                    <div class="empty-icon">
                        ♡
                    </div>

                    <p>
                        ما عندكش أصدقاء مضافين لحد الآن ♡
                    </p>

                    <small>
                        خذي كود صديقك وأضيفيه هنا
                    </small>
                </div>
            `;

            return;
        }


        container.innerHTML = "";


        friends.forEach(
            friend => {

                const item =
                    document.createElement(
                        "div"
                    );

                item.className =
                    "friend-item";


                item.innerHTML = `
                    <div class="friend-avatar">
                        ♡
                    </div>

                    <div class="friend-info">
                        <strong>
                            ${this.escapeHTML(
                                friend.username ||
                                "مستخدم"
                            )}
                        </strong>

                        <small>
                            ${this.escapeHTML(
                                friend.friend_code ||
                                ""
                            )}
                        </small>
                    </div>

                    <button
                        type="button"
                        class="secondary-button friend-chat-button"
                        data-friend-id="${friend.id}"
                    >
                        دردشة ♡
                    </button>
                `;


                container.appendChild(
                    item
                );
            }
        );
    },


    showMessage(title, content) {

        if (
            typeof App !== "undefined" &&
            typeof App.openMessage === "function"
        ) {

            App.openMessage(
                title,
                content
            );

            return;
        }


        alert(
            title + "\n\n" + content
        );
    },


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
   تشغيل النظام
======================================== */

document.addEventListener(
    "DOMContentLoaded",
    async () => {

        await Friends.loadMyCode();

        await Friends.render();


        const copyButton =
            document.getElementById(
                "copyFriendCode"
            );

        if (copyButton) {

            copyButton.addEventListener(
                "click",
                () => {
                    Friends.copyCode();
                }
            );
        }


        const addButton =
            document.getElementById(
                "addFriendButton"
            );

        if (addButton) {

            addButton.addEventListener(
                "click",
                () => {
                    Friends.addFriend();
                }
            );
        }


        const input =
            document.getElementById(
                "friendCodeInput"
            );

        if (input) {

            input.addEventListener(
                "keydown",
                event => {

                    if (
                        event.key ===
                        "Enter"
                    ) {
                        Friends.addFriend();
                    }

                }
            );
        }

    }
);