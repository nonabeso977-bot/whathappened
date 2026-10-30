const Games = {
    key: "fbo_games_v1",
    currentId: null,
    currentTab: "html",

    starterFiles: {
        html: '<main class="game"><h1>لعبتي الأولى</h1><p>ابدئي بكتابة لعبتك هنا.</p></main>',
        css: 'body { font-family: system-ui, sans-serif; text-align: center; background: #fceaf3; color: #493344; padding: 24px; } .game { max-width: 500px; margin: 30px auto; }',
        js: 'console.log("My game is running!");'
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
            this.message("مساحة التخزين ممتلئة.");
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

    updateProject(project) {
        const projects = this.getAll();
        const index = projects.findIndex(item => item.id === project.id);

        if (index < 0) return false;

        projects[index] = project;
        return this.saveAll(projects);
    },

    render() {
        const container = document.getElementById("gamesContainer");
        if (!container) return;

        this.currentId = null;

        const projects = this.getAll();

        container.innerHTML = `
            <section class="games-welcome">
                <div class="games-welcome-icon">🎮</div>
                <h3>استوديو الألعاب</h3>
                <p>كل لعبة تصنعينها لها مربعها الخاص.</p>
            </section>

            <section class="games-project-section">
                <h3>ألعابي (${projects.length})</h3>

                <div class="games-project-list">
                    ${projects.map(project => `
                        <button type="button"
                            class="game-project-card"
                            data-game-action="open"
                            data-id="${this.escape(project.id)}">

                            <span class="game-tile-icon">🎮</span>
                            <strong>${this.escape(project.name)}</strong>
                            <small>${(project.commits || []).length} إصدار</small>
                        </button>
                    `).join("")}

                    <button type="button"
                        class="game-project-card game-add-card"
                        data-game-action="create">

                        <span class="game-add-icon">＋</span>
                        <strong>لعبة جديدة</strong>
                        <small>ابدئي مشروعًا جديدًا</small>
                    </button>
                </div>

                ${projects.length ? "" :
                    '<p class="game-empty-note">مربعاتك فاضية حاليًا. اضغطي على (+) وابدئي أول لعبة.</p>'
                }
            </section>
        `;
    },

    buildDocument(project) {
        const css = (project.files.css || "")
            .replace(/<\/style/gi, "<\\/style");

        const js = (project.files.js || "")
            .replace(/<\/script/gi, "<\\/script");

        return '<!DOCTYPE html><html lang="ar"><head>' +
            '<meta charset="UTF-8">' +
            '<meta name="viewport" content="width=device-width, initial-scale=1.0">' +
            '<style>*{box-sizing:border-box}body{margin:0;padding:12px}' +
            css +
            '</style></head><body>' +
            (project.files.html || '') +
            '<script>' + js + '<\/script></body></html>';
    },

    refreshFrame(id) {
        const project = this.getCurrent();
        const frame = document.getElementById(id);

        if (project && frame) {
            frame.srcdoc = this.buildDocument(project);
        }
    },

    open(id) {
        if (!this.getAll().some(project => project.id === id)) return;

        this.currentId = id;
        this.renderDetail();
    },

    renderDetail() {
        const container = document.getElementById("gamesContainer");
        const project = this.getCurrent();

        if (!container || !project) return;

        container.innerHTML = `
            <section class="game-detail">

                <header class="game-detail-header">
                    <button class="secondary-button"
                        data-game-action="back">← ألعابي</button>

                    <div>
                        <h3>${this.escape(project.name)}</h3>
                        <small>${(project.commits || []).length} إصدار محفوظ</small>
                    </div>
                </header>

                <div class="game-detail-preview-wrap">
                    <iframe id="gameDetailPreview"
                        class="game-detail-preview"
                        title="معاينة اللعبة"
                        sandbox="allow-scripts allow-forms allow-pointer-lock">
                    </iframe>
                </div>

                <div class="game-detail-actions">
                    <button class="primary-button game-play-button"
                        data-game-action="play">▶ لعب</button>

                    <button class="secondary-button"
                        data-game-action="edit">✎ تعديل</button>
                </div>

                <p class="game-detail-hint">
                    اللعب يفتح لعبتك وحدها، والتعديل يرجعك إلى محرر الأكواد.
                </p>

            </section>
        `;

        this.refreshFrame("gameDetailPreview");
    },

    play() {
        const project = this.getCurrent();
        if (!project) return;

        const overlay = document.createElement("div");

        overlay.className = "game-play-overlay";
        overlay.id = "gamePlayOverlay";

        overlay.innerHTML = `
            <header class="game-play-header">
                <strong>${this.escape(project.name)}</strong>

                <button type="button"
                    class="game-play-close"
                    data-game-action="close-play">×</button>
            </header>

            <iframe id="gamePlayFrame"
                class="game-play-frame"
                title="اللعبة"
                sandbox="allow-scripts allow-forms allow-pointer-lock">
            </iframe>
        `;

        document.body.appendChild(overlay);

        this.refreshFrame("gamePlayFrame");
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
                        data-game-action="back-detail">← رجوع للعبة</button>

                    <span>تعديل اللعبة</span>
                </header>

                <label class="game-field-label">اسم اللعبة</label>

                <input id="gameNameInput"
                    class="game-name-input"
                    maxlength="60"
                    value="${this.escape(project.name)}">

                <div class="game-file-tabs">
                    <button class="game-file-tab active"
                        data-game-tab="html">HTML</button>

                    <button class="game-file-tab"
                        data-game-tab="css">CSS</button>

                    <button class="game-file-tab"
                        data-game-tab="js">JavaScript</button>
                </div>

                <label class="game-field-label"
                    id="gameEditorLabel">index.html</label>

                <textarea id="gameCodeEditor"
                    class="game-code-editor"
                    spellcheck="false"
                    autocapitalize="off"
                    autocomplete="off"
                    autocorrect="off"
                    dir="ltr"></textarea>

                <div class="game-editor-actions">
                    <button class="primary-button"
                        data-game-action="preview">▶ معاينة</button>

                    <button class="secondary-button"
                        data-game-action="commit">حفظ إصدار</button>
                </div>

                <section class="game-preview-section">
                    <h3>معاينة سريعة</h3>

                    <iframe id="gamePreview"
                        class="game-preview"
                        title="معاينة اللعبة"
                        sandbox="allow-scripts allow-forms allow-pointer-lock">
                    </iframe>
                </section>

                <section class="game-commits">
                    <h3>الإصدارات المحفوظة</h3>
                    <div id="gameCommitList"></div>
                </section>

            </section>
        `;

        this.loadTab("html");
        this.renderCommits();
        this.refreshFrame("gamePreview");
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
            button.classList.toggle(
                "active",
                button.dataset.gameTab === tab
            );
        });
    },

    collectEditor() {
        const project = this.getCurrent();
        const editor = document.getElementById("gameCodeEditor");
        const name = document.getElementById("gameNameInput");

        if (!project || !editor) return null;

        project.files[this.currentTab] = editor.value;

        if (name && name.value.trim()) {
            project.name = name.value.trim();
        }

        project.updatedAt = new Date().toISOString();

        return this.updateProject(project) ? project : null;
    },

    preview() {
        if (!this.collectEditor()) return;

        this.refreshFrame("gamePreview");

        this.message("تم تحديث المعاينة.");
    },

    commit() {
        const project = this.collectEditor();
        if (!project) return;

        const description = prompt("اكتبي وصفًا لهذا الإصدار:");

        if (description === null || !description.trim()) return;

        project.commits = project.commits || [];

        project.commits.unshift({
            id: "commit_" + Date.now(),
            message: description.trim(),
            files: { ...project.files },
            createdAt: new Date().toISOString()
        });

        project.commits = project.commits.slice(0, 20);

        if (!this.updateProject(project)) return;

        this.renderCommits();
        this.message("تم حفظ الإصدار.");
    },

    renderCommits() {
        const container = document.getElementById("gameCommitList");
        const project = this.getCurrent();

        if (!container || !project) return;

        container.innerHTML = (project.commits || []).length
            ? project.commits.map(commit => `
                <article class="game-commit-item">
                    <div>
                        <strong>${this.escape(commit.message)}</strong>
                        <small>${new Date(commit.createdAt).toLocaleString("ar")}</small>
                    </div>

                    <button class="secondary-button"
                        data-game-action="restore"
                        data-id="${this.escape(commit.id)}">استعادة</button>
                </article>
            `).join("")
            : '<p class="game-muted">ما فيش إصدارات محفوظة بعد.</p>';
    },

    restore(id) {
        const project = this.getCurrent();
        if (!project) return;

        const commit = (project.commits || []).find(item => item.id === id);

        if (!commit || !confirm("استعادة هذا الإصدار؟ سيحل محل الكود الحالي.")) {
            return;
        }

        project.files = { ...commit.files };

        if (!this.updateProject(project)) return;

        this.renderEditor();
        this.message("تمت استعادة الإصدار.");
    },

    handleClick(event) {
        const tab = event.target.closest("[data-game-tab]");

        if (tab) {
            this.collectEditor();
            this.loadTab(tab.dataset.gameTab);
            return;
        }

        const button = event.target.closest("[data-game-action]");
        if (!button) return;

        const action = button.dataset.gameAction;

        if (action === "create") this.create();
        if (action === "open") this.open(button.dataset.id);
        if (action === "back") this.render();
        if (action === "edit") this.renderEditor();

        if (action === "back-detail") {
            this.collectEditor();
            this.renderDetail();
        }

        if (action === "play") this.play();

        if (action === "close-play") {
            document.getElementById("gamePlayOverlay")?.remove();
        }

        if (action === "preview") this.preview();
        if (action === "commit") this.commit();
        if (action === "restore") this.restore(button.dataset.id);
    },

    init() {
        const container = document.getElementById("gamesContainer");
        if (!container) return;

        container.addEventListener("click", event => {
            this.handleClick(event);
        });

        container.addEventListener("input", event => {
            const project = this.getCurrent();
            if (!project) return;

            if (event.target.id === "gameCodeEditor") {
                project.files[this.currentTab] = event.target.value;
            }

            if (event.target.id === "gameNameInput" &&
                event.target.value.trim()) {
                project.name = event.target.value;
            }
        });

        document.addEventListener("keydown", event => {
            if (event.key === "Escape") {
                document.getElementById("gamePlayOverlay")?.remove();
            }
        });

        this.render();
    }
};

document.addEventListener("DOMContentLoaded", () => Games.init());