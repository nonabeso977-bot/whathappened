/* ========================================
   Friends Boxes Open ♡
   Local Storage Manager
======================================== */

const Storage = {

    /*
     * مفتاح عام للتطبيق
     */
    prefix: "friends_boxes_open_",

    /*
     * حفظ بيانات
     */
    save(key, data) {

        try {

            const fullKey = this.prefix + key;

            localStorage.setItem(
                fullKey,
                JSON.stringify(data)
            );

            return true;

        } catch (error) {

            console.error(
                "حدث خطأ أثناء حفظ البيانات:",
                error
            );

            return false;
        }
    },


    /*
     * قراءة بيانات
     */
    get(key, defaultValue = null) {

        try {

            const fullKey = this.prefix + key;

            const savedData =
                localStorage.getItem(fullKey);

            if (savedData === null) {
                return defaultValue;
            }

            return JSON.parse(savedData);

        } catch (error) {

            console.error(
                "حدث خطأ أثناء قراءة البيانات:",
                error
            );

            return defaultValue;
        }
    },


    /*
     * حذف بيانات محددة
     */
    remove(key) {

        try {

            const fullKey = this.prefix + key;

            localStorage.removeItem(fullKey);

            return true;

        } catch (error) {

            console.error(
                "حدث خطأ أثناء حذف البيانات:",
                error
            );

            return false;
        }
    },


    /*
     * مسح كل بيانات التطبيق
     */
    clearAppData() {

        try {

            const keysToRemove = [];

            for (
                let i = 0;
                i < localStorage.length;
                i++
            ) {

                const key =
                    localStorage.key(i);

                if (
                    key &&
                    key.startsWith(this.prefix)
                ) {

                    keysToRemove.push(key);
                }
            }


            keysToRemove.forEach(key => {
                localStorage.removeItem(key);
            });


            return true;

        } catch (error) {

            console.error(
                "حدث خطأ أثناء مسح بيانات التطبيق:",
                error
            );

            return false;
        }
    },


    /*
     * التحقق هل توجد بيانات
     */
    has(key) {

        try {

            const fullKey = this.prefix + key;

            return (
                localStorage.getItem(fullKey)
                !== null
            );

        } catch (error) {

            return false;
        }
    },


    /*
     * إنشاء ID بسيط وفريد
     */
    createId(prefix = "id") {

        return (
            prefix +
            "_" +
            Date.now() +
            "_" +
            Math.random()
                .toString(36)
                .substring(2, 9)
        );
    },


    /*
     * الحصول على نسخة من البيانات
     * بدل تعديل الأصل مباشرة
     */
    clone(data) {

        if (data === null || data === undefined) {
            return data;
        }

        return JSON.parse(
            JSON.stringify(data)
        );
    }

};


/* ========================================
   البيانات الأساسية للتطبيق
======================================== */

if (!Storage.has("posts")) {
    Storage.save("posts", []);
}

if (!Storage.has("feelings")) {
    Storage.save("feelings", []);
}

if (!Storage.has("reminders")) {
    Storage.save("reminders", []);
}

if (!Storage.has("profile")) {

    Storage.save(
        "profile",
        {
            name: "مستخدم جديد",
            avatar: "♡"
        }
    );
              }
