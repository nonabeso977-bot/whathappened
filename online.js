/* ========================================
   Friends Boxes Open ♡
   Supabase Online Connection
======================================== */

const SUPABASE_URL =
    "https://evwtqppshvwgqicnxqfh.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
    "sb_publishable_mA5G1U9uyH3VALLy9Kzqjw_85TyIclO";

const supabaseClient =
    supabase.createClient(
        SUPABASE_URL,
        SUPABASE_PUBLISHABLE_KEY
    );


const Online = {

    client: supabaseClient,


    async getSession() {

        const {
            data,
            error
        } = await this.client.auth.getSession();


        if (error) {

            console.error(
                "Supabase session error:",
                error
            );

            return null;
        }


        return data.session;
    },


    async getUser() {

        const {
            data,
            error
        } = await this.client.auth.getUser();


        if (error) {

            console.error(
                "Supabase user error:",
                error
            );

            return null;
        }


        return data.user;
    },


    isOnline() {

        return navigator.onLine;
    }

};


console.log(
    "Friends Boxes Open ♡ - Supabase connected"
);