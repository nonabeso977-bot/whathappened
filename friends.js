
/* ========================================
   Friends Boxes Open ♡
   Friends System - Rebuilt
   Supabase
======================================== */

const Friends = {

    // إعدادات
    codePrefix: "FRIEND-",
    codeLength: 6,

    getClient() {
        if (typeof Online !== "undefined" && Online.client) {
            return Online.client;
        }

        if (typeof supabaseClient !== "undefined") {
            return supabaseClient;
        }

        throw new Error("Supabase client غير متصل");
    },

    async getUser() {
        try {
            const client = this.getClient();

            const { data, error } =
                await client.auth.getUser();

            if (error) throw error;

            return data.user || null;

        } catch (error) {
            console.error("Get user error:", error);
            return null;
        }
    },

    // إنشاء كود عشوائي
    generateCode() {
        const chars =
            "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

        let result = this.codePrefix;

        const random = new Uint32Array(this.codeLength);

        if (window.crypto && window.crypto.getRandomValues) {
            window.crypto.getRandomValues(random);

            for (let i = 0; i < this.codeLength; i++) {
                result += chars[random[i] % chars.length];
            }

        } else {
            for (let i = 0; i < this.codeLength; i++) {
                result += chars.charAt(
                    Math.floor(Math.random() * chars.length)
                );
            }
        }

        return result;
    },

    // تجهيز ملف المستخدم وإنشاء كود عند الحاجة
    async ensureProfile() {
        const client = this.getClient();
        const user = await this.getUser();

        if (!user) {
            console.warn("No logged-in user");
            return null;
        }

        try {
            // البحث عن الملف الحالي
            const { data: existing, error: findError } =
                await client
                    .from("profiles")
                    .select("id, username, friend_code")
                    .eq("id", user.id)
                    .maybeSingle();

            if (findError) throw findError;

            // إذا كان لديه كود بالفعل، نستخدمه
            if (
                existing &&
                existing.friend_code &&
                existing.friend_code.trim()
            ) {
                return existing;
            }

            // تحديد اسم المستخدم
            const username =
                existing?.username ||
                user.user_metadata?.username ||
                user.email?.split("@")[0] ||
                "مستخدم جديد";

            // محاولة إنشاء كود فريد
            for (let attempt = 0; attempt < 15; attempt++) {

                const friendCode = this.generateCode();

                const { data: duplicate, error: duplicateError } =
                    await client
                        .from("profiles")
                        .select("id")
                        .eq("friend_code", friendCode)
                        .maybeSingle();

                if (duplicateError) {
                    throw duplicateError;
                }

                if (duplicate) {
                    continue;
                }

                // إنشاء الملف أو تحديثه
                const { data: profile, error: saveError } =
                    await client
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
                        .select("id, username, friend_code")
                        .single();

                if (!saveError) {
                    console.log(
                        "Friend profile ready:",
                        profile.friend_code
                    );

                    return profile;
                }

                // إذا كان الكود مستخدماً بالفعل، نجرب غيره
                if (saveError.code === "23505") {
                    continue;
                }

                throw saveError;
            }

            throw new Error(
                "تعذر إنشاء كود فريد بعد عدة محاولات"
            );

        } catch (error) {
            console.error("Ensure profile error:", error);

            this.showMessage(
                "تعذر إنشاء كود الصديق",
                error.message || "حدث خطأ أثناء تجهيز حسابك"
            );

            return null;
        }
    },

    // عرض كود المستخدم
    async loadMyCode() {
        const element =
            document.getElementById("friendCode");

        if (!element) return;

        element.textContent = "جاري تجهيز الكود...";

        const user = await this.getUser();

        if (!user) {
            element.textContent = "سجلي دخولك أولاً";
            return;
        }

        const profile = await this.ensureProfile();

        if (!profile || !profile.friend_code) {
            element.textContent = "تعذر تحميل الكود";
            return;
        }

        element.textContent = profile.friend_code;
    },

    // نسخ الكود
    async copyCode() {
        const element =
            document.getElementById("friendCode");

        if (!element) return;

        const code = element.textContent.trim();

        if (!code.startsWith(this.codePrefix)) {
            this.showMessage(
                "لا يوجد كود",
                "سجلي دخولك وانتظري تجهيز كودك أولاً"
            );
            return;
        }

        try {
            await navigator.clipboard.writeText(code);

            this.showMessage(
                "تم النسخ ♡",
                "تم نسخ كود الصديق"
            );

        } catch (error) {
            console.error("Copy error:", error);

            this.showMessage(
                "تعذر النسخ",
                "اضغطي مطولاً على الكود وانسخيه يدوياً"
            );
        }
    },

    // إضافة صديق
    async addFriend() {
        const client = this.getClient();

        const input =
            document.getElementById("friendCodeInput");

        if (!input) return;

        const friendCode =
            input.value.trim().toUpperCase();

        if (!friendCode) {
            this.showMessage(
                "الكود فارغ",
                "اكتبي كود الصديق أولاً"
            );
            return;
        }

        const user = await this.getUser();

        if (!user) {
            this.showMessage(
                "تسجيل الدخول مطلوب",
                "سجلي دخولك أولاً"
            );
            return;
        }

        // التأكد من تجهيز ملف المستخدم
        const myProfile = await this.ensureProfile();

        if (!myProfile) return;

        if (friendCode === myProfile.friend_code) {
            this.showMessage(
                "هذا كودك أنتِ 🗿",
                "ما تقدريش تضيفي نفسك"
            );
            return;
        }

        try {
            // البحث عن صاحب الكود
            const { data: friend, error: searchError } =
                await client
                    .from("profiles")
                    .select("id, username, friend_code")
                    .eq("friend_code", friendCode)
                    .maybeSingle();

            if (searchError) throw searchError;

            if (!friend) {
                this.showMessage(
                    "الكود غير موجود",
                    "تأكدي من كتابة الكود بشكل صحيح"
                );
                return;
            }

            // التأكد من عدم وجود العلاقة في أي اتجاه
            const { data: existing, error: checkError } =
                await client
                    .from("friendships")
                    .select("id")
                    .or(
                        `and(user_id.eq.${user.id},friend_id.eq.${friend.id}),and(user_id.eq.${friend.id},friend_id.eq.${user.id})`
                    )
                    .limit(1);

            if (checkError) throw checkError;

            if (existing && existing.length > 0) {
                this.showMessage(
                    "الصديق موجود بالفعل ♡",
                    `${friend.username} موجود في قائمة أصدقائك`
                );
                return;
            }

            // إنشاء علاقة واحدة
            const { error: insertError } =
                await client
                    .from("friendships")
                    .insert({
                        user_id: user.id,
                        friend_id: friend.id
                    });

            if (insertError) throw insertError;

            input.value = "";

            await this.render();

            this.showMessage(
                "تمت الإضافة ♡",
                `أصبحت ${friend.username} ضمن قائمة أصدقائك`
            );

        } catch (error) {
            console.error("Add friend error:", error);

            this.showMessage(
                "تعذرت إضافة الصديق",
                error.message || "حدث خطأ غير معروف"
            );
        }
    },

    // جلب الأصدقاء من الاتجاهين
    async getFriends() {
        const client = this.getClient();
        const user = await this.getUser();

        if (!user) return [];

        try {
            const { data: relations, error } =
                await client
                    .from("friendships")
                    .select("user_id, friend_id")
                    .or(
                        `user_id.eq.${user.id},friend_id.eq.${user.id}`
                    );

            if (error) throw error;

            if (!relations || relations.length === 0) {
                return [];
            }

            // استخراج معرفات الطرف الآخر
            const friendIds = [
                ...new Set(
                    relations.map(row =>
                        row.user_id === user.id
                            ? row.friend_id
                            : row.user_id
                    )
                )
            ];

            if (friendIds.length === 0) return [];

            const { data: profiles, error: profileError } =
                await client
                    .from("profiles")
                    .select("id, username, friend_code")
                    .in("id", friendIds);

            if (profileError) throw profileError;

            return profiles || [];

        } catch (error) {
            console.error("Get friends error:", error);

            this.showMessage(
                "تعذر تحميل الأصدقاء",
                error.message || "حدث خطأ أثناء تحميل القائمة"
            );

            return [];
        }
    },

    // عرض قائمة الأصدقاء
    async render() {
        const container =
            document.getElementById("friendsList");

        if (!container) return;

        const user = await this.getUser();

        if (!user) {
            container.innerHTML = `
                <div class="empty-state small">
                    <div class="empty-icon">♡</div>
                    <p>سجلي دخولك باش تشوفي أصدقاءك</p>
                </div>
            `;
            return;
        }

        container.innerHTML = `
            <div class="empty-state small">
                <p>جاري تحميل الأصدقاء...</p>
            </div>
        `;

        const friends = await this.getFriends();

        if (!friends.length) {
            container.innerHTML = `
                <div class="empty-state small">
                    <div class="empty-icon">♡</div>
                    <p>ما عندكش أصدقاء مضافين لحد الآن ♡</p>
                    <small>استخدمي كود صديقك لإضافته</small>
                </div>
            `;
            return;
        }

        container.innerHTML = "";

        friends.forEach(friend => {
            const item = document.createElement("div");

            item.className = "friend-item";

            const avatar = document.createElement("div");
            avatar.className = "friend-avatar";
            avatar.textContent = "♡";

            const info = document.createElement("div");
            info.className = "friend-info";

            const name = document.createElement("strong");
            name.textContent = friend.username || "مستخدم";

            const code = document.createElement("small");
            code.textContent = friend.friend_code || "";

            info.appendChild(name);
            info.appendChild(code);

            const chatButton = document.createElement("button");
            chatButton.type = "button";
            chatButton.className =
                "secondary-button friend-chat-button";
            chatButton.textContent = "دردشة ♡";
            chatButton.dataset.friendId = friend.id;

            item.appendChild(avatar);
            item.appendChild(info);
            item.appendChild(chatButton);

            container.appendChild(item);
        });
    },

    // تحديث الواجهة بعد تسجيل الدخول
    async refresh() {
        await this.loadMyCode();
        await this.render();
    },

    // رسائل التطبيق
    showMessage(title, content) {
        if (
            typeof App !== "undefined" &&
            typeof App.openMessage === "function"
        ) {
            App.openMessage(title, content);
        } else {
            alert(title + "\n\n" + content);
        }
    },

    escapeHTML(value) {
        return String(value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    },

    // ربط الأزرار
    init() {
        const copyButton =
            document.getElementById("copyFriendCode");

        const addButton =
            document.getElementById("addFriendButton");

        const input =
            document.getElementById("friendCodeInput");

        if (copyButton) {
            copyButton.addEventListener("click", () => {
                this.copyCode();
            });
        }

        if (addButton) {
            addButton.addEventListener("click", () => {
                this.addFriend();
            });
        }

        if (input) {
            input.addEventListener("keydown", event => {
                if (event.key === "Enter") {
                    this.addFriend();
                }
            });
        }

        // أول تحميل
        this.refresh();

        // متابعة تسجيل الدخول والخروج
        window.addEventListener(
            "supabase-auth-change",
            async event => {
                if (event.detail && event.detail.user) {
                    await this.refresh();
                } else {
                    const code =
                        document.getElementById("friendCode");

                    if (code) {
                        code.textContent = "سجلي دخولك أولاً";
                    }

                    await this.render();
                }
            }
        );
    }
};


/* ========================================
   تشغيل النظام
======================================== */

document.addEventListener("DOMContentLoaded", () => {
    Friends.init();
});
