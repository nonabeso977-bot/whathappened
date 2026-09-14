/* ========================================
   Friends Boxes Open ♡
   Reminders System
======================================== */

const Reminders = {

    storageKey: "reminders",

    streakKey: "reminder_streak",


    /* ========================================
       قراءة التذكيرات
    ======================================== */

    getAll() {

        return Storage.get(
            this.storageKey,
            []
        );

    },


    /* ========================================
       حفظ التذكيرات
    ======================================== */

    saveAll(reminders) {

        Storage.save(
            this.storageKey,
            reminders
        );

    },


    /* ========================================
       إضافة تذكير
    ======================================== */

    add(text) {

        const cleanText =
            text.trim();


        if (!cleanText) {
            return null;
        }


        const reminders =
            this.getAll();


        const reminder = {

            id:
                Storage.createId(
                    "reminder"
                ),

            text:
                cleanText,

            completed:
                false,

            createdAt:
                new Date().toISOString()

        };


        reminders.push(
            reminder
        );


        this.saveAll(
            reminders
        );


        return reminder;

    },


    /* ========================================
       حذف تذكير
    ======================================== */

    delete(reminderId) {

        const reminders =
            this.getAll();


        const updated =
            reminders.filter(
                reminder =>
                    reminder.id !== reminderId
            );


        this.saveAll(
            updated
        );


        return true;

    },


    /* ========================================
       إكمال / إلغاء تذكير
    ======================================== */

    toggle(reminderId) {

        const reminders =
            this.getAll();


        const reminder =
            reminders.find(
                item =>
                    item.id === reminderId
            );


        if (!reminder) {
            return null;
        }


        reminder.completed =
            !reminder.completed;


        this.saveAll(
            reminders
        );


        this.updateStreak(
            reminder.completed
        );


        return reminder;

    },


    /* ========================================
       حساب سلسلة الأيام
    ======================================== */

    getStreak() {

        return Storage.get(
            this.streakKey,
            {
                count: 0,
                lastDate: null
            }
        );

    },


    updateStreak(completed) {

        if (!completed) {
            return;
        }


        const streak =
            this.getStreak();


        const today =
            this.getToday();


        if (
            streak.lastDate ===
            today
        ) {

            return;

        }


        if (
            streak.lastDate ===
            this.getYesterday()
        ) {

            streak.count += 1;

        } else {

            streak.count = 1;

        }


        streak.lastDate =
            today;


        Storage.save(
            this.streakKey,
            streak
        );


        this.renderStreak();

    },


    getToday() {

        const date =
            new Date();


        return date
            .toISOString()
            .split("T")[0];

    },


    getYesterday() {

        const date =
            new Date();


        date.setDate(
            date.getDate() - 1
        );


        return date
            .toISOString()
            .split("T")[0];

    },


    /* ========================================
       عرض سلسلة الأيام
    ======================================== */

    renderStreak() {

        const element =
            document.getElementById(
                "streakCount"
            );


        if (!element) {
            return;
        }


        const streak =
            this.getStreak();


        element.textContent =
            streak.count;

    },


    /* ========================================
       عرض التذكيرات
    ======================================== */

    render() {

        const container =
            document.getElementById(
                "remindersContainer"
            );


        if (!container) {
            return;
        }


        const reminders =
            this.getAll();


        container.innerHTML = "";


        if (
            reminders.length === 0
        ) {

            container.innerHTML = `

                <div class="empty-state">

                    <div class="empty-icon">
                        ☆
                    </div>

                    <p>
                        ما عندكش تذكيرات بعد.
                    </p>

                    <small>
                        أضف أول تذكير ليك ｡
                    </small>

                </div>

            `;

            return;

        }


        reminders.forEach(
            reminder => {

                const item =
                    this.createElement(
                        reminder
                    );


                container.appendChild(
                    item
                );

            }
        );

    },


    /* ========================================
       إنشاء عنصر التذكير
    ======================================== */

    createElement(reminder) {

        const item =
            document.createElement(
                "div"
            );


        item.className =
            "reminder-item";


        item.dataset.id =
            reminder.id;


        item.innerHTML = `

            <label
                style="
                    display:flex;
                    align-items:center;
                    gap:10px;
                    flex:1;
                    cursor:pointer;
                "
            >

                <input
                    type="checkbox"
                    class="reminder-check"
                    ${reminder.completed
                        ? "checked"
                        : ""}
                >

                <span
                    class="reminder-text"
                    style="
                        ${
                            reminder.completed
                            ? "text-decoration:line-through; opacity:0.55;"
                            : ""
                        }
                    "
                >
                    ${this.escapeHTML(
                        reminder.text
                    )}
                </span>

            </label>


            <button
                class="reminder-delete"
                type="button"
                data-action="delete"
                aria-label="حذف التذكير"
            >
                ×
            </button>

        `;


        return item;

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
   تشغيل نظام التذكيرات
======================================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        Reminders.render();

        Reminders.renderStreak();


        const input =
            document.getElementById(
                "reminderInput"
            );


        const addButton =
            document.getElementById(
                "addReminderButton"
            );


        const container =
            document.getElementById(
                "remindersContainer"
            );


        /* إضافة تذكير */

        if (
            input &&
            addButton
        ) {

            const addReminder = () => {

                const reminder =
                    Reminders.add(
                        input.value
                    );


                if (!reminder) {
                    return;
                }


                input.value = "";

                Reminders.render();

            };


            addButton.addEventListener(
                "click",
                addReminder
            );


            input.addEventListener(
                "keydown",
                event => {

                    if (
                        event.key ===
                        "Enter"
                    ) {

                        addReminder();

                    }

                }
            );

        }


        /* التعامل مع الحذف والإكمال */

        if (container) {

            container.addEventListener(
                "click",
                event => {

                    const deleteButton =
                        event.target.closest(
                            '[data-action="delete"]'
                        );


                    if (
                        deleteButton
                    ) {

                        const item =
                            deleteButton.closest(
                                ".reminder-item"
                            );


                        if (!item) {
                            return;
                        }


                        Reminders.delete(
                            item.dataset.id
                        );


                        Reminders.render();

                    }

                }
            );


            container.addEventListener(
                "change",
                event => {

                    if (
                        !event.target.classList.contains(
                            "reminder-check"
                        )
                    ) {

                        return;

                    }


                    const item =
                        event.target.closest(
                            ".reminder-item"
                        );


                    if (!item) {
                        return;
                    }


                    Reminders.toggle(
                        item.dataset.id
                    );


                    Reminders.render();

                }
            );

        }

    }
);
