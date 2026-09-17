const Storage = {

    get(key, defaultValue = null) {
        try {
            const value = localStorage.getItem(key);

            if (value === null) {
                return defaultValue;
            }

            return JSON.parse(value);

        } catch (error) {
            console.error("Storage get error:", error);
            return defaultValue;
        }
    },


    save(key, value) {
        try {
            localStorage.setItem(
                key,
                JSON.stringify(value)
            );

            return true;

        } catch (error) {
            console.error("Storage save error:", error);
            return false;
        }
    },


    remove(key) {
        try {
            localStorage.removeItem(key);
            return true;

        } catch (error) {
            console.error("Storage remove error:", error);
            return false;
        }
    },


    clear(key) {
        return this.remove(key);
    },


    has(key) {
        try {
            return localStorage.getItem(key) !== null;

        } catch (error) {
            console.error("Storage has error:", error);
            return false;
        }
    },


    createId(prefix = "id") {
        return Utils.createId(prefix);
    }

};


console.log("♡ Storage loaded");
