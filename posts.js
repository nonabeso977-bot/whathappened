/* ========================================
   Friends Boxes Open ♡
   Posts System
======================================== */


/* ========================================
   إعدادات المنشورات
======================================== */

const Posts = {

    storageKey: "posts",

    getAll() {

        return Storage.get(
            this.storageKey,
            []
        );
    },


    saveAll(posts) {

        Storage.save(
            this.storageKey,
            posts
        );
    },


    create(text, visibility = "everyone") {

        const cleanText =
            text.trim();

        if (!cleanText) {
            return null;
        }

        const posts =
            this.getAll();

        const newPost = {

            id: Storage.createId("post"),

            author: {
                name: "مستخدم جديد",
                avatar: "♡"
            },

            text: cleanText,

            visibility: visibility,

            likes: [],

            comments: [],

            createdAt:
                new Date().toISOString()
        };


        posts.unshift(newPost);

        this.saveAll(posts);

        return newPost;
    },


    delete(postId) {

        const posts =
            this.getAll();

        const updated =
            posts.filter(
                post => post.id !== postId
            );

        this.saveAll(updated);

        return true;
    },


    toggleLike(postId) {

        const posts =
            this.getAll();

        const post =
            posts.find(
                item => item.id === postId
            );

        if (!post) {
            return null;
        }


        if (!Array.isArray(post.likes)) {
            post.likes = [];
        }


        const userId =
            "local_user";


        const index =
            post.likes.indexOf(userId);


        if (index === -1) {

            post.likes.push(userId);

        } else {

            post.likes.splice(index, 1);
        }


        this.saveAll(posts);

        return post;
    },


    addComment(postId, text) {

        const cleanText =
            text.trim();

        if (!cleanText) {
            return null;
        }


        const posts =
            this.getAll();

        const post =
            posts.find(
                item => item.id === postId
            );


        if (!post) {
            return null;
        }


        if (!Array.isArray(post.comments)) {
            post.comments = [];
        }


        const comment = {

            id: Storage.createId("comment"),

            author: "مستخدم جديد",

            text: cleanText,

            createdAt:
                new Date().toISOString()
        };


        post.comments.push(comment);

        this.saveAll(posts);

        return comment;
    },


    getVisiblePosts() {

        const posts =
            this.getAll();


        /*
         * في النسخة الحالية نحن مستخدم واحد
         * لذلك المنشورات الخاصة بنا تظهر لنا.
         *
         * لاحقًا عند إضافة حسابات حقيقية
         * نقدر نضيف نظام أصدقاء كامل.
         */

        return posts.filter(post => {

            return (
                post.visibility === "everyone" ||
                post.visibility === "friends" ||
                post.visibility === "private" ||
                post.visibility === "selected"
            );

        });
    },


    formatDate(dateString) {

        const date =
            new Date(dateString);

        if (Number.isNaN(date.getTime())) {
            return "";
        }


        return date.toLocaleString(
            "ar-LY",
            {
                dateStyle: "medium",
                timeStyle: "short"
            }
        );
    },


    render(container) {

        if (!container) {
            return;
        }


        const posts =
            this.getVisiblePosts();


        container.innerHTML = "";


        if (posts.length === 0) {

            container.innerHTML = `

                <div
                    id="emptyPosts"
                    class="empty-state"
                >

                    <div class="empty-icon">
                        ♡
                    </div>

                    <p>
                        لا توجد منشورات بعد ｡
                    </p>

                    <small>
                        يمكن أن تكون أنت أول شخص يبدأ.
                    </small>

                </div>

            `;

            return;
        }


        posts.forEach(post => {

            const card =
                this.createPostElement(post);

            container.appendChild(card);

        });
    },


    createPostElement(post) {

        const article =
            document.createElement("article");


        article.className =
            "post-card";


        article.dataset.postId =
            post.id;


        const likes =
            Array.isArray(post.likes)
                ? post.likes.length
                : 0;


        const comments =
            Array.isArray(post.comments)
                ? post.comments.length
                : 0;


        const liked =
            Array.isArray(post.likes) &&
            post.likes.includes("local_user");


        article.innerHTML = `

            <div class="post-header">

                <div class="post-avatar">
                    ${post.author.avatar}
                </div>

                <div>

                    <div class="post-author">
                        ${this.escapeHTML(
                            post.author.name
                        )}
                    </div>

                    <div class="post-date">
                        ${this.formatDate(
                            post.createdAt
                        )}
                    </div>

                </div>

            </div>


            <div class="post-text">
                ${this.escapeHTML(
                    post.text
                )}
            </div>


            <div class="post-actions">

                <button
                    class="post-action like-button"
                    type="button"
                    data-action="like"
                    data-id="${post.id}"
                >
                    ${liked ? "♥" : "♡"}
                    ${likes}
                </button>


                <button
                    class="post-action comment-button"
                    type="button"
                    data-action="comment"
                    data-id="${post.id}"
                >
                    ♡ تعليق
                    ${comments}
                </button>


                <button
                    class="post-action delete-button"
                    type="button"
                    data-action="delete"
                    data-id="${post.id}"
                >
                    × حذف
                </button>

            </div>

        `;


        return article;
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
    },


    getStats() {

        const posts =
            this.getAll();


        let likes = 0;

        let comments = 0;


        posts.forEach(post => {

            if (Array.isArray(post.likes)) {
                likes += post.likes.length;
            }

            if (Array.isArray(post.comments)) {
                comments += post.comments.length;
            }

        });


        return {

            posts: posts.length,

            likes: likes,

            comments: comments

        };
    }

};


/* ========================================
   تشغيل نظام المنشورات
======================================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        const container =
            document.getElementById(
                "postsContainer"
            );


        if (!container) {
            return;
        }


        Posts.render(container);


        container.addEventListener(
            "click",
            event => {

                const button =
                    event.target.closest(
                        "[data-action]"
                    );


                if (!button) {
                    return;
                }


                const action =
                    button.dataset.action;


                const postId =
                    button.dataset.id;


                if (action === "like") {

                    Posts.toggleLike(postId);

                    Posts.render(container);

                }


                if (action === "delete") {

                    Posts.delete(postId);

                    Posts.render(container);

                }


                if (action === "comment") {

                    const text =
                        prompt(
                            "اكتب تعليقك ♡"
                        );


                    if (
                        text &&
                        text.trim()
                    ) {

                        Posts.addComment(
                            postId,
                            text
                        );

                        Posts.render(container);
                    }

                }

            }
        );

    }
);
