
const Games = {
    key: "fbo_games_v1",
    currentId: null,
    currentTab: "html",

    starterFiles: {
        html: `<main class="game">
    <h1>لعبتي الأولى</h1>
    <p>ابدئي بكتابة لعبتك هنا.</p>
</main>`,
        css: `body {
    font-family: system-ui, sans-serif;
    text-align: center;
    background: #fceaf3;
    color: #493344;
    padding: 24px;
}

.game {
    max-width: 500px;
    margin: 30px auto;
}`,
        js: `console.log("My game is running!");`
    },

    getAll() {
        try {
            return JSON.parse(localStorage.getItem(this.key)) || [];
        } catch (error) {
            console.error("Games storage error:", error);
            return [];
        }
    },

    saveAll(projects) {
        try {
            localStorage.setItem(this.key, JSON.stringify(projects));
            return true;
        } catch (error) {
            console.error("Games save error:", error);
            this.message("مساحة التخزين ممتلئة. قللي حجم المشروع أو عدد الإصدارات.");
            return false;
        }
    },

    escape(value) {
        return String(value ?? "").replace(/[&<>"']/g, char => ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        })[char]);
    },

    message(text) {
        if (window.App && typeof App.openMessage === "function") {
            App.openMessage("مساحة الألعاب", text);
        } else {
            alert(text);
        }
    },

    create() {
        const name = prompt("اسم اللعبة:");
        if (name === null || !name.trim()) return;

        const project = {
            id: "game_" + Date.now(),
            name: name.trim(),
            description: "",
            files: { ...this.starterFiles },
            commits: [],
            updatedAt: new Date().toISOString()
        };

        const projects = this.getAll();
        projects.unshift(project);

        if (!this.saveAll(projects)) return;

        this.currentId = project.id;
        this.renderEditor();
    },

    getCurrent() {
        return this.getAll().find(project => project.id === this.currentId);
    },

    updateCurrent(field, value) {
        const projects = this.getAll();
        const project = projects.find(item => item.id === this.currentId);

        if (!project) return false;

        project[field] = value;
        project.updatedAt = new Date().toISOString();

        return this.saveAll(projects);
    },

    render() {
        const container = document.getElementById("gamesContainer");
        if (!container) return;

        this.currentId = null;

        const projects = this.getAll();

        container.innerHTML = `
            <section class="games-welcome">
                <div class="games-welcome-icon">⌘</div>
                <h3>استوديو الألعاب</h3>
                <p>اكتبي الكود، جرّبي لعبتك، واحفظي إصداراتك.</p>
                <button class="primary-button" data-game-action="create">
                    ＋ مشروع جديد
                </button>
            </section>

            <section class="games-project-section">
                <h3>مشاريعي (${projects.length})</h3>
                <div class="games-project-list">
                    ${projects.length ? projects.map(project => `
                        <article class="game-project-card">
                            <div>
                                <strong>${this.escape(project.name)}</strong>
                                <small>${project.commits.length} إصدار</small>
                            </div>
                            <button class="secondary-button"
                                data-game-action="open"
                                data-id="${this.escape(project.id)}">
                                فتح المشروع
                            </button>
                        </article>
                    `).join("") : `
                        <div class="empty-state small">
                            <div class="empty-icon">🎮</div>
                            <p>ما عندكش مشاريع لحد الآن.</p>
                        </div>
                    `}
                </div>
            </section>
        `;
    },

    open(id) {
        const project = this.getAll().find(item => item.id === id);
        if (!project) return;

        this.currentId = id;
        this.renderEditor();
    },

    renderEditor() {
        const container = document.getElementById("gamesContainer");
        const project = this.getCurrent();

        if (!container || !project) return;

        this.currentTab = "html";

        container.innerHTML = `
            <section class="game-editor">
                <header class="game-editor-header">
                    <button class="secondary-button"
                        data-game-action="back">← مشاريعي</button>
                    <span>محرر الأكواد</span>
                </header>

                <label class="game-field-label" for="gameNameInput">
                    اسم المشروع
                </label>
                <input id="gameNameInput" class="game-name-input"
                    maxlength="60" value="${this.escape(project.name)}">

                <div class="game-file-tabs">
                    <button class="game-file-tab active"
                        data-game-tab="html">HTML</button>
                    <button class="game-file-tab"
                        data-game-tab="css">CSS</button>
                    <button class="game-file-tab"
                        data-game-tab="js">JavaScript</button>
                </div>

                <label class="game-field-label" id="gameEditorLabel">
                    index.html
                </label>
                <textarea id="gameCodeEditor" class="game-code-editor"
                    spellcheck="false" autocapitalize="off"
                    autocomplete="off" autocorrect="off"
                    dir="ltr"></textarea>

                <div class="game-editor-actions">
                    <button class="primary-button"
                        data-game-action="run">▶ تشغيل</button>
                    <button class="secondary-button"
                        data-game-action="commit">Commit</button>
                </div>

                <section class="game-preview-section">
                    <h3>معاينة اللعبة</h3>
                    <iframe id="gamePreview"
                        class="game-preview"
                        title="معاينة اللعبة"
                        sandbox="allow-scripts"></iframe>
                </section>

                <section class="game-commits">
                    <h3>سجل الإصدارات</h3>
                    <div id="gameCommitList"></div>
                </section>
            </section>
        `;

        this.loadTab("html");
        this.renderCommits();
    },

    loadTab(tab) {
        const project = this.getCurrent();
        const editor = document.getElementById("gameCodeEditor");
        const label = document.getElementById("gameEditorLabel");

        if (!project || !editor || !label) return;

        this.currentTab = tab;
        editor.value = project.files[tab] || "";

        label.textContent = {
            html: "index.html",
            css: "style.css",
            js: "script.js"
        }[tab];

        document.querySelectorAll(".game-file-tab").forEach(button => {
            button.classList.toggle("active", button.dataset.gameTab === tab);
        });
    },

    collectEditor() {
        const project = this.getCurrent();
        const editor = document.getElementById("gameCodeEditor");
        const nameInput = document.getElementById("gameNameInput");

        if (!project || !editor) return null;

        project.files[this.currentTab] = editor.value;

        if (nameInput && nameInput.value.trim()) {
            project.name = nameInput.value.trim();
        }

        return project;
    },

    run() {
        const project = this.collectEditor();
        const frame = document.getElementById("gamePreview");

        if (!project || !frame) return;

        const html = project.files.html || "";
        const css = (project.files.css || "").replace(/<\/style/gi, "<\\/style");
        const js = (project.files.js || "").replace(/<\/script/gi, "<\\/script");

        frame.srcdoc = `
<!DOCTYPE html>
<html lang="ar">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<style>
* { box-sizing: border-box; }
body { margin: 0; padding: 12px; }
${css}
</style>
</head>
<body>
${html}
<script>
${js}
<\/script>
</body>
</html>`;

        this.message("تم تشغيل المعاينة. التعديلات الحالية لم تُحفظ كإصدار بعد.");
    },

    commit() {
        const project = this.collectEditor();
        if (!project) return;

        const message = prompt("اكتبي وصفًا لهذا التعديل:");
        if (message === null || !message.trim()) return;

        const projects = this.getAll();
        const index = projects.findIndex(item => item.id === project.id);

        if (index === -1) return;

        projects[index].commits.unshift({
            id: "commit_" + Date.now(),
            message: message.trim(),
            files: { ...project.files },
            createdAt: new Date().toISOString()
        });

        projects[index].commits = projects[index].commits.slice(0, 20);
        projects[index].updatedAt = new Date().toISOString();

        if (!this.saveAll(projects)) return;

        this.renderCommits();
        this.message("تم حفظ الإصدار الجديد بنجاح.");
    },

    renderCommits() {
        const container = document.getElementById("gameCommitList");
        const project = this.getCurrent();

        if (!container || !project) return;

        container.innerHTML = project.commits.length
            ? project.commits.map(commit => `
                <article class="game-commit-item">
                    <div>
                        <strong>${this.escape(commit.message)}</strong>
                        <small>${new Date(commit.createdAt).toLocaleString("ar")}</small>
                    </div>
                    <button class="secondary-button"
                        data-game-action="restore"
                        data-id="${this.escape(commit.id)}">
                        استعادة
                    </button>
                </article>
            `).join("")
            : `<p class="game-muted">ما فيش إصدارات محفوظة بعد.</p>`;
    },

    restore(id) {
        const project = this.getCurrent();
        if (!project) return;

        const commit = project.commits.find(item => item.id === id);
        if (!commit) return;

        if (!confirm("استعادة هذا الإصدار؟ سيحل محل الكود الحالي في المحرر.")) {
            return;
        }

        project.files = { ...commit.files };

        const projects = this.getAll();
        const index = projects.findIndex(item => item.id === project.id);
        projects[index] = project;

        if (!this.saveAll(projects)) return;

        this.renderEditor();
        this.message("تمت استعادة الإصدار. اعملي Commit جديد لو تبي تحفظي التغيير كإصدار.");
    },

    handleClick(event) {
        const tabButton = event.target.closest("[data-game-tab]");
        if (tabButton) {
            this.collectEditor();
            this.loadTab(tabButton.dataset.gameTab);
            return;
        }

        const button = event.target.closest("[data-game-action]");
        if (!button) return;

        const action = button.dataset.gameAction;

        if (action === "create") this.create();
        if (action === "open") this.open(button.dataset.id);
        if (action === "back") this.render();
        if (action === "run") this.run();
        if (action === "commit") this.commit();
        if (action === "restore") this.restore(button.dataset.id);
    },

    init() {
        const container = document.getElementById("gamesContainer");
        if (!container) return;

        container.addEventListener("click", event => this.handleClick(event));

        container.addEventListener("input", event => {
            if (event.target.id === "gameCodeEditor") {
                const project = this.getCurrent();
                if (project) {
                    project.files[this.currentTab] = event.target.value;
                }
            }

            if (event.target.id === "gameNameInput") {
                const project = this.getCurrent();
                if (project) project.name = event.target.value;
            }
        });

        this.render();
    }
};

document.addEventListener("DOMContentLoaded", () => Games.init());
