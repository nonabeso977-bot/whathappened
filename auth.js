/* ========================================
   Friends Boxes Open ♡
   Supabase Authentication
======================================== */

const Auth = {

    async signUp() {

        const emailInput =
            document.getElementById("authEmail");

        const passwordInput =
            document.getElementById("authPassword");

        const message =
            document.getElementById("authMessage");


        const email =
            emailInput.value.trim();

        const password =
            passwordInput.value;


        if (!email || !password) {

            message.textContent =
                "اكتبي الإيميل وكلمة السر أولًا ♡";

            return;
        }


        if (password.length < 6) {

            message.textContent =
                "كلمة السر لازم تكون 6 أحرف على الأقل.";

            return;
        }


        message.textContent =
            "جاري إنشاء الحساب...";


        const {
            data,
            error
        } = await Online.client.auth.signUp({

            email: email,

            password: password,

            options: {

                emailRedirectTo:
                    "https://nonabeso977-bot.github.io/whathappened/"

            }

        });


        if (error) {

            console.error(
                "Sign up error:",
                error
            );

            message.textContent =
                error.message;

            return;
        }


        if (data.user) {

            message.textContent =
                "تم إنشاء الحساب ♡ تفقدي إيميلك لتأكيد الحساب.";

        }

    },


    async signIn() {

        const emailInput =
            document.getElementById("authEmail");

        const passwordInput =
            document.getElementById("authPassword");

        const message =
            document.getElementById("authMessage");


        const email =
            emailInput.value.trim();

        const password =
            passwordInput.value;


        if (!email || !password) {

            message.textContent =
                "اكتبي الإيميل وكلمة السر أولًا ♡";

            return;
        }


        message.textContent =
            "جاري تسجيل الدخول...";


        const {
            data,
            error
        } = await Online.client.auth.signInWithPassword({

            email: email,

            password: password

        });


        if (error) {

            console.error(
                "Sign in error:",
                error
            );

            message.textContent =
                error.message;

            return;
        }


        if (data.user) {

            message.textContent =
                "تم تسجيل الدخول ♡";

        }

    },


    async signOut() {

        const message =
            document.getElementById("authMessage");


        const {
            error
        } = await Online.client.auth.signOut();


        if (error) {

            console.error(
                "Sign out error:",
                error
            );

            if (message) {

                message.textContent =
                    error.message;

            }

            return;
        }

    },


    updateUI(session) {

        const loggedOutBox =
            document.getElementById("loggedOutBox");

        const loggedInBox =
            document.getElementById("loggedInBox");

        const loggedInEmail =
            document.getElementById("loggedInEmail");

        const authMessage =
            document.getElementById("authMessage");


        if (session && session.user) {

            if (loggedOutBox) {

                loggedOutBox.style.display =
                    "none";

            }


            if (loggedInBox) {

                loggedInBox.style.display =
                    "block";

            }


            if (loggedInEmail) {

                loggedInEmail.textContent =
                    session.user.email || "الحساب متصل ♡";

            }

        } else {

            if (loggedOutBox) {

                loggedOutBox.style.display =
                    "block";

            }


            if (loggedInBox) {

                loggedInBox.style.display =
                    "none";

            }


            if (loggedInEmail) {

                loggedInEmail.textContent =
                    "تم تسجيل الدخول";

            }

        }


        if (authMessage && !session) {

            authMessage.textContent = "";

        }

    }

};


/* ========================================
   تشغيل أزرار الحساب
======================================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        const signUpButton =
            document.getElementById(
                "signUpButton"
            );


        const signInButton =
            document.getElementById(
                "signInButton"
            );


        const logoutButton =
            document.getElementById(
                "logoutButton"
            );


        if (signUpButton) {

            signUpButton.addEventListener(
                "click",
                () => {
                    Auth.signUp();
                }
            );

        }


        if (signInButton) {

            signInButton.addEventListener(
                "click",
                () => {
                    Auth.signIn();
                }
            );

        }


        if (logoutButton) {

            logoutButton.addEventListener(
                "click",
                () => {
                    Auth.signOut();
                }
            );

        }


        /* ================================
           مراقبة حالة تسجيل الدخول
        ================================= */

        /* ========================================
   مراقبة حالة الحساب
======================================== */


window.addEventListener(
    "supabase-auth-change",
    (event) => {

        const session =
            event.detail.session;

        Auth.updateUI(
            session
        );

    }
);


                    Auth.updateUI(
                        session
                    );

                }
            );


            Online.client.auth
                .getSession()
                .then(
                    ({
                        data
                    }) => {

                        Auth.updateUI(
                            data.session
                        );

                    }
                );

        }

    }
);