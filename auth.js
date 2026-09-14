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
            password: password
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
                "تم إنشاء الحساب ♡ تفقدي إيميلك إذا طلب تأكيد الحساب.";

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

    }
);