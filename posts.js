const Posts = {

    storageKey: "posts",

    getAll() {
        return Storage.get(this.storageKey, []);
    },

    saveAll(posts) {
        Storage.save(this.storageKey, posts);
    },


    create(
        text,
        visibility = "everyone",
        image = null
    ) {

        const cleanText = text.trim();

        if (!cleanText && !image) {
            return null;
        }

        const posts = this.getAll();

        const newPost = {

            id: Storage.createId("post"),

            author: {
                name: "مستخدم جديد",
                avatar: "♡"
            },

            text: cleanText,

            image: image,

            visibility: visibility,

            likes: [],

            comments: [],

            createdAt: new Date().toISOString()
        };

        posts.unshift(newPost);

        this.saveAll(posts);

        return newPost;
    },


    delete(postId) {

        const posts = this.getAll();

        const filtered = posts.filter(
            post => post.id !== postId
        );

        this.saveAll(filtered);
    },


    toggleLike(postId) {

        const posts = this.getAll();

        const post = posts.find(
            post => post.id === postId
        );

        if (!post) {
            return;
        }

        if (!post.likes) {
            post.likes = [];
        }

        const userId = "current-user";

        const index = post.likes.indexOf(userId);

        if (index === -1) {
            post.likes.push(userId);
        } else {
            post.likes.splice(index, 1);
        }

        this.saveAll(posts);
    },


    addComment(postId, text) {

        const cleanText = text.trim();

        if (!cleanText) {
            return;
        }

        const posts = this.getAll();

        const post = posts.find(
            post => post.id === postId
        );

        if (!post) {
            return;
        }

        if (!post.comments) {
            post.comments = [];
        }

        post.comments.push({

            id: Storage.createId("comment"),

            text: cleanText,

            author: {
                name: "مستخدم جديد",
                avatar: "♡"
            },

            createdAt: new Date().toISOString()

        });

        this.saveAll(posts);
    },


    getVisiblePosts() {

        return this.getAll();
    },


    formatDate(dateString) {

        const date = new Date(dateString);

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

        const posts = this.getVisiblePosts();

        container.innerHTML = "";

        if (posts.length === 0) {

            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">♡</div>

                    <p>
                        لا توجد منشورات بعد
                    </p>

                    <small>
                        كوني أول من يكتب شيئًا
                    </small>
                </div>
            `;

            return;
        }

        posts.forEach(post => {

            container.appendChild(
                this.createPostElement(post)
            );

        });
    },


    createPostElement(post) {

        const article = document.createElement("article");

        article.className = "post-card";

        const likesCount = post.likes
            ? post.likes.length
            : 0;

        const commentsCount = post.comments
            ? post.comments.length
            : 0;


        const imageHTML = post.image
            ? `
                <div class="post-image">
                    <img
                        src="${post.image}"
                        alt="صورة المنشور"
                    >
                </div>
            `
            : "";


        const commentsHTML =
            post.comments && post.comments.length
                ? `
                    <div class="comments-list">

                        ${post.comments.map(comment => `

                            <div class="comment">

                                <span class="comment-avatar">
                                    ${this.escapeHTML(
                                        comment.author?.avatar || "♡"
                                    )}
                                </span>

                                <div class="comment-body">

                                    <strong>
                                        ${this.escapeHTML(
                                            comment.author?.name ||
                                            "مستخدم جديد"
                                        )}
                                    </strong>

                                    <p>
                                        ${this.escapeHTML(
                                            comment.text
                                        )}
                                    </p>

                                </div>

                            </div>

                        `).join("")}

                    </div>
                `
                : "";


        article.innerHTML = `

            <div class="post-header">

                <div class="post-author">

                    <div class="post-avatar">
                        ${this.escapeHTML(
                            post.author?.avatar || "♡"
                        )}
                    </div>

                    <div>

                        <strong>
                            ${this.escapeHTML(
                                post.author?.name ||
                                "مستخدم جديد"
                            )}
                        </strong>

                        <small>
                            ${this.formatDate(
                                post.createdAt
                            )}
                        </small>

                    </div>

                </div>

                <button
                    class="post-menu"
                    data-action="delete"
                    data-id="${post.id}"
                    type="button"
                >
                    ⋮
                </button>

            </div>


            ${
                post.text
                    ? `
                        <div class="post-text">
                            ${this.escapeHTML(post.text)}
                        </div>
                    `
                    : ""
            }


            ${imageHTML}


            <div class="post-actions">

                <button
                    class="post-action"
                    data-action="like"
                    data-id="${post.id}"
                    type="button"
                >
                    ♡
                    <span>
                        ${likesCount}
                    </span>
                </button>


                <button
                    class="post-action"
                    data-action="comment"
                    data-id="${post.id}"
                    type="button"
                >
                    💬
                    <span>
                        ${commentsCount}
                    </span>
                </button>

            </div>


            ${commentsHTML}

        `;

        return article;
    },


    escapeHTML(text) {

        const div = document.createElement("div");

        div.textContent = text;

        return div.innerHTML;
    },


    getStats() {

        const posts = this.getAll();

        let likes = 0;

        posts.forEach(post => {

            if (post.likes) {
                likes += post.likes.length;
            }

        });

        return {

            posts: posts.length,

            likes: likes

        };
    }

};



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