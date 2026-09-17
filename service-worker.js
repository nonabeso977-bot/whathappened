const CACHE_NAME =
    "friends-boxes-open-v1";


const FILES_TO_CACHE = [
    "./",
    "./index.html",
    "./style.css",
    "./storage.js",
    "./posts.js",
    "./feelings.js",
    "./reminders.js",
    "./interface.js",
    "./online.js",
    "./friends.js",
    "./theme.js",
    "./sitting.js",
    "./auth.js",
    "./manifest.json",
    "./icon-192.png",
    "./icon-512.png"
];


self.addEventListener(
    "install",
    (event) => {

        event.waitUntil(
            caches
                .open(CACHE_NAME)
                .then(
                    (cache) => {
                        return cache.addAll(
                            FILES_TO_CACHE
                        );
                    }
                )
        );

        self.skipWaiting();

    }
);


self.addEventListener(
    "activate",
    (event) => {

        event.waitUntil(
            caches.keys().then(
                (keys) => {

                    return Promise.all(
                        keys
                            .filter(
                                (key) =>
                                    key !== CACHE_NAME
                            )
                            .map(
                                (key) =>
                                    caches.delete(key)
                            )
                    );

                }
            )
        );

        self.clients.claim();

    }
);


self.addEventListener(
    "fetch",
    (event) => {

        event.respondWith(
            fetch(event.request)
                .catch(
                    () =>
                        caches.match(
                            event.request
                        )
                )
        );

    }
);