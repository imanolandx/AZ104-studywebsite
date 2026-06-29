// AZ-104 Study Hub - Main Application
const app = {
    questions: [],
    filteredQuestions: [],
    classifiedQuestions: {},
    currentQuestionIndex: 0,
    currentFlashcardIndex: 0,
    allFlashcards: [],
    flashcardDeck: [],
    progress: {},
    currentNoteTopic: 'identity',

    init() {
        this.questions = QUESTIONS;
        this.classifiedQuestions = classifyAllQuestions(this.questions);
        this.filteredQuestions = [...this.questions];
        this.loadProgress();
        this.setupNavigation();
        this.setupPractice();
        this.setupFlashcards();
        this.setupTopicAnalysis();
        this.setupNotes();
        this.updateDashboard();
        this.populateTopicFilters();
        this.populateQuestionList();
    },

    // === Navigation ===
    setupNavigation() {
        document.querySelectorAll('.nav-menu a').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = link.dataset.page;
                this.navigateTo(page);
            });
        });

        document.getElementById('mobile-menu-btn').addEventListener('click', () => {
            document.getElementById('sidebar').classList.toggle('open');
        });
    },

    navigateTo(page) {
        document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
        document.querySelectorAll('.nav-menu a').forEach(a => a.classList.remove('active'));
        document.getElementById(`page-${page}`).classList.add('active');
        document.querySelector(`[data-page="${page}"]`).classList.add('active');
        document.getElementById('sidebar').classList.remove('open');

        if (page === 'dashboard') this.updateDashboard();
        if (page === 'topics') this.setupTopicAnalysis();
    },

    // === Progress Management ===
    loadProgress() {
        const saved = localStorage.getItem('az104_progress');
        this.progress = saved ? JSON.parse(saved) : {};
    },

    saveProgress() {
        localStorage.setItem('az104_progress', JSON.stringify(this.progress));
    },

    recordAnswer(questionId, isCorrect) {
        this.progress[questionId] = {
            correct: isCorrect,
            timestamp: Date.now()
        };
        this.saveProgress();
    },

    // === Dashboard ===
    updateDashboard() {
        const total = this.questions.length;
        const attempted = Object.keys(this.progress).length;
        const correct = Object.values(this.progress).filter(p => p.correct).length;
        const accuracy = attempted > 0 ? Math.round((correct / attempted) * 100) : 0;

        document.getElementById('stat-total').textContent = total;
        document.getElementById('stat-attempted').textContent = attempted;
        document.getElementById('stat-correct').textContent = correct;
        document.getElementById('stat-accuracy').textContent = accuracy + '%';

        // Topic progress chart
        const chartEl = document.getElementById('topic-progress-chart');
        chartEl.innerHTML = '';
        const colors = { identity: '#6366f1', storage: '#06b6d4', compute: '#f59e0b', networking: '#10b981', monitor: '#ec4899' };

        for (const [key, topic] of Object.entries(TOPICS)) {
            const topicQuestions = this.classifiedQuestions[key] || [];
            const topicAttempted = topicQuestions.filter(q => this.progress[q.id]).length;
            const pct = topicQuestions.length > 0 ? Math.round((topicAttempted / topicQuestions.length) * 100) : 0;

            chartEl.innerHTML += `
                <div class="topic-progress-item">
                    <span class="label">${topic.name.substring(0, 20)}...</span>
                    <div class="bar"><div class="bar-fill" style="width:${pct}%;background:${colors[key]}"></div></div>
                    <span class="pct">${pct}%</span>
                </div>
            `;
        }

        // Recent activity
        const activityEl = document.getElementById('recent-activity');
        const recent = Object.entries(this.progress)
            .sort((a, b) => b[1].timestamp - a[1].timestamp)
            .slice(0, 5);

        if (recent.length === 0) {
            activityEl.innerHTML = '<p style="color:var(--text-secondary);font-size:14px;">No activity yet. Start practicing!</p>';
        } else {
            activityEl.innerHTML = recent.map(([id, data]) => {
                const timeAgo = this.timeAgo(data.timestamp);
                const icon = data.correct ? '✅' : '❌';
                return `<div class="activity-item">${icon} Question ${id} <span class="time">${timeAgo}</span></div>`;
            }).join('');
        }
    },

    timeAgo(timestamp) {
        const diff = Date.now() - timestamp;
        const mins = Math.floor(diff / 60000);
        if (mins < 1) return 'just now';
        if (mins < 60) return `${mins}m ago`;
        const hours = Math.floor(mins / 60);
        if (hours < 24) return `${hours}h ago`;
        return `${Math.floor(hours / 24)}d ago`;
    },

    // === Practice Questions ===
    setupPractice() {
        document.getElementById('btn-prev').addEventListener('click', () => this.prevQuestion());
        document.getElementById('btn-next').addEventListener('click', () => this.nextQuestion());
        document.getElementById('btn-random').addEventListener('click', () => this.randomQuestion());
        document.getElementById('btn-check').addEventListener('click', () => this.checkAnswer());
        document.getElementById('btn-reveal').addEventListener('click', () => this.revealAnswer());
        document.getElementById('topic-filter').addEventListener('change', () => this.filterQuestions());
        document.getElementById('status-filter').addEventListener('change', () => this.filterQuestions());
        document.getElementById('btn-goto').addEventListener('click', () => this.gotoQuestion());
        document.getElementById('question-search').addEventListener('keydown', (e) => {
            if (e.key === 'Enter') this.gotoQuestion();
        });
        document.getElementById('question-list').addEventListener('change', (e) => {
            const idx = parseInt(e.target.value);
            if (!isNaN(idx)) {
                this.currentQuestionIndex = idx;
                this.renderQuestion();
                e.target.value = '';
            }
        });
        this.renderQuestion();
    },

    populateTopicFilters() {
        const topicFilter = document.getElementById('topic-filter');
        const fcFilter = document.getElementById('flashcard-topic-filter');
        
        for (const [key, topic] of Object.entries(TOPICS)) {
            const count = (this.classifiedQuestions[key] || []).length;
            topicFilter.innerHTML += `<option value="${key}">${topic.name} (${count})</option>`;
            const fcCount = (FLASHCARDS[key] || []).length;
            fcFilter.innerHTML += `<option value="${key}">${topic.name} (${fcCount} cards)</option>`;
        }
    },

    filterQuestions() {
        const topic = document.getElementById('topic-filter').value;
        const status = document.getElementById('status-filter').value;

        this.filteredQuestions = this.questions.filter(q => {
            if (topic !== 'all' && q.topic !== topic) return false;
            if (status === 'unanswered' && this.progress[q.id]) return false;
            if (status === 'correct' && (!this.progress[q.id] || !this.progress[q.id].correct)) return false;
            if (status === 'incorrect' && (!this.progress[q.id] || this.progress[q.id].correct)) return false;
            return true;
        });

        this.currentQuestionIndex = 0;
        this.populateQuestionList();
        this.renderQuestion();
    },

    populateQuestionList() {
        const list = document.getElementById('question-list');
        const topic = document.getElementById('topic-filter').value;
        const label = topic === 'all' ? 'Browse Questions' : 'Browse Topic Questions';
        list.innerHTML = `<option value="">${label} (${this.filteredQuestions.length})</option>`;
        this.filteredQuestions.forEach((q, idx) => {
            const preview = q.question.substring(0, 60).replace(/\n/g, ' ');
            const status = this.progress[q.id] ? (this.progress[q.id].correct ? '✅' : '❌') : '○';
            list.innerHTML += `<option value="${idx}">${status} Q${q.id}: ${preview}...</option>`;
        });
    },

    renderQuestion() {
        const container = document.getElementById('question-card');
        
        // Always ensure card structure exists
        if (!document.getElementById('question-topic-badge')) {
            container.innerHTML = `
                <div class="question-topic-badge" id="question-topic-badge"></div>
                <div class="question-text" id="question-text"></div>
                <div class="options-list" id="options-list"></div>
                <div class="answer-section hidden" id="answer-section">
                    <div class="answer-reveal" id="answer-reveal"></div>
                </div>
                <div class="question-actions">
                    <button class="btn btn-primary" id="btn-check" onclick="app.checkAnswer()">Check Answer</button>
                    <button class="btn btn-secondary hidden" id="btn-reveal" onclick="app.revealAnswer()">Reveal Answer</button>
                </div>
            `;
        }

        if (this.filteredQuestions.length === 0) {
            document.getElementById('question-topic-badge').textContent = '';
            document.getElementById('question-text').textContent = 'No questions match your filters.';
            document.getElementById('options-list').innerHTML = '';
            document.getElementById('answer-section').classList.add('hidden');
            document.getElementById('btn-check').classList.add('hidden');
            document.getElementById('btn-reveal').classList.add('hidden');
            document.getElementById('question-counter').textContent = '0 / 0';
            return;
        }

        const q = this.filteredQuestions[this.currentQuestionIndex];
        const topicInfo = TOPICS[q.topic];

        document.getElementById('question-counter').textContent = 
            `Q${q.id} — ${this.currentQuestionIndex + 1} / ${this.filteredQuestions.length}`;
        document.getElementById('question-topic-badge').textContent = topicInfo ? topicInfo.name : 'General';
        document.getElementById('question-topic-badge').style.background = topicInfo ? topicInfo.color + '20' : '#e3f2fd';
        document.getElementById('question-topic-badge').style.color = topicInfo ? topicInfo.color : '#0078d4';
        document.getElementById('question-text').textContent = q.question;

        const optionsEl = document.getElementById('options-list');
        if (q.options && q.options.length > 0) {
            optionsEl.innerHTML = q.options.map((opt, i) => 
                `<div class="option-item" data-index="${i}" onclick="app.selectOption(this)">${opt}</div>`
            ).join('');
        } else {
            optionsEl.innerHTML = '<p style="color:var(--text-secondary);font-style:italic;">This is a drag-and-drop or image-based question. Click "Reveal Answer" to see the correct answer.</p>';
        }

        // Reset state
        document.getElementById('answer-section').classList.add('hidden');
        if (q.options && q.options.length > 0) {
            document.getElementById('btn-check').classList.remove('hidden');
        } else {
            document.getElementById('btn-check').classList.add('hidden');
        }
        document.getElementById('btn-reveal').classList.remove('hidden');
    },

    selectOption(el) {
        document.querySelectorAll('.option-item').forEach(o => o.classList.remove('selected'));
        el.classList.add('selected');
    },

    checkAnswer() {
        const q = this.filteredQuestions[this.currentQuestionIndex];
        const selected = document.querySelector('.option-item.selected');
        
        if (!selected) {
            alert('Please select an answer first!');
            return;
        }

        const selectedText = selected.textContent.trim();
        const isCorrect = q.correctAnswers.some(a => a.trim() === selectedText);

        // Mark options
        document.querySelectorAll('.option-item').forEach(opt => {
            const optText = opt.textContent.trim();
            if (q.correctAnswers.some(a => a.trim() === optText)) {
                opt.classList.add('correct');
            } else if (opt.classList.contains('selected') && !isCorrect) {
                opt.classList.add('incorrect');
            }
        });

        // Show answer + explanation
        const answerSection = document.getElementById('answer-section');
        answerSection.classList.remove('hidden');
        const explanation = this.getExplanation(q);
        document.getElementById('answer-reveal').innerHTML = `
            <div class="answer-result ${isCorrect ? 'correct' : 'incorrect'}">
                <strong>${isCorrect ? '✅ Correct!' : '❌ Incorrect'}</strong>
            </div>
            <div class="answer-correct">
                <strong>Correct Answer:</strong> ${q.correctAnswers.join(', ')}
            </div>
            ${explanation}
        `;

        document.getElementById('btn-check').classList.add('hidden');
        document.getElementById('btn-reveal').classList.add('hidden');

        this.recordAnswer(q.id, isCorrect);
    },

    revealAnswer() {
        const q = this.filteredQuestions[this.currentQuestionIndex];
        
        document.querySelectorAll('.option-item').forEach(opt => {
            const optText = opt.textContent.trim();
            if (q.correctAnswers.some(a => a.trim() === optText)) {
                opt.classList.add('correct');
            }
        });

        const answerSection = document.getElementById('answer-section');
        answerSection.classList.remove('hidden');
        const explanation = this.getExplanation(q);
        
        // For drag-drop/hotspot questions, the visualization IS the answer
        const isDragDrop = (!q.options || q.options.length === 0) && 
            ((typeof DRAGDROP_ANSWERS !== 'undefined' && DRAGDROP_ANSWERS[q.id]) || 
             (typeof HOTSPOT_ANSWERS !== 'undefined' && HOTSPOT_ANSWERS[q.id]));
        
        if (isDragDrop) {
            document.getElementById('answer-reveal').innerHTML = explanation;
        } else {
            document.getElementById('answer-reveal').innerHTML = `
                <div class="answer-correct">
                    <strong>Correct Answer:</strong> ${q.correctAnswers.join(', ')}
                </div>
                ${explanation}
            `;
        }

        document.getElementById('btn-check').classList.add('hidden');
        document.getElementById('btn-reveal').classList.add('hidden');
    },

    getExplanation(q) {
        const correctSet = new Set(q.correctAnswers.map(a => a.trim()));
        const options = q.options || [];
        
        // Build per-option breakdown
        let html = '<div class="explanation-header">📖 Option Breakdown:</div>';
        
        if (options.length > 0) {
            options.forEach(opt => {
                const isCorrect = correctSet.has(opt.trim());
                const reason = this.explainOption(q, opt, isCorrect);
                const cls = isCorrect ? 'option-correct' : 'option-wrong';
                const icon = isCorrect ? '✅' : '❌';
                html += `<div class="option-explanation ${cls}">
                    <strong>${icon} ${opt}</strong>
                    ${reason}
                </div>`;
            });
        } else if (typeof DRAGDROP_ANSWERS !== 'undefined' && DRAGDROP_ANSWERS[q.id]) {
            // Drag-and-drop visual answer
            html = this.renderDragDropAnswer(q, DRAGDROP_ANSWERS[q.id]);
        } else if (typeof HOTSPOT_ANSWERS !== 'undefined' && HOTSPOT_ANSWERS[q.id]) {
            // Hotspot visual answer
            html = this.renderHotspotAnswer(q, HOTSPOT_ANSWERS[q.id]);
        } else {
            // Fallback for questions without answer data
            html += `<div class="option-explanation" style="border-left:3px solid #ff9800;padding:12px;background:#fff8e1;">
                <strong>⚠️ This is a drag-and-drop or image-based question.</strong><br>
                Answer data not yet available for this question. Check Microsoft Learn for the correct answer.
            </div>`;
        }
        
        return html;
    },

    renderDragDropAnswer(q, answer) {
        let html = `<div class="dragdrop-answer">`;
        html += `<div class="dragdrop-title">✅ Correct Answer: ${answer.title}</div>`;

        if (answer.type === 'sequence') {
            html += `<div class="dragdrop-sequence">`;
            answer.steps.forEach((s, i) => {
                html += `<div class="dragdrop-step">
                    <div class="step-number">${s.step}</div>
                    <div class="step-content">
                        <div class="step-action">${s.action}</div>
                        <div class="step-explanation">${s.explanation}</div>
                    </div>
                </div>`;
                if (i < answer.steps.length - 1) {
                    html += `<div class="step-arrow">↓</div>`;
                }
            });
            html += `</div>`;
        } else if (answer.type === 'match') {
            html += `<div class="dragdrop-match">`;
            answer.items.forEach(item => {
                html += `<div class="match-row">
                    <div class="match-target">${item.target}</div>
                    <div class="match-arrow">→</div>
                    <div class="match-answer">${item.answer}</div>
                </div>
                <div class="match-explanation">${item.explanation}</div>`;
            });
            html += `</div>`;
        }

        html += `</div>`;
        return html;
    },

    renderHotspotAnswer(q, answer) {
        let html = `<div class="hotspot-answer">`;
        html += `<div class="dragdrop-title">✅ Correct Answer: ${answer.title}</div>`;

        if (answer.type === 'yesno') {
            html += `<table class="hotspot-table">
                <thead><tr><th>Statement</th><th>Answer</th></tr></thead><tbody>`;
            answer.items.forEach(item => {
                const cls = item.answer === 'Yes' ? 'hs-yes' : 'hs-no';
                html += `<tr>
                    <td>${item.statement}</td>
                    <td class="${cls}"><strong>${item.answer}</strong></td>
                </tr>
                <tr class="hs-explanation-row"><td colspan="2">${item.explanation}</td></tr>`;
            });
            html += `</tbody></table>`;
        } else if (answer.type === 'dropdown') {
            html += `<div class="hotspot-dropdowns">`;
            answer.items.forEach(item => {
                html += `<div class="hotspot-item">
                    <div class="hotspot-statement">${item.statement}</div>
                    <div class="hotspot-selected">→ ${item.answer}</div>
                    <div class="hotspot-explanation">${item.explanation}</div>
                </div>`;
            });
            html += `</div>`;
        } else if (answer.type === 'table') {
            html += `<div class="hotspot-dropdowns">`;
            answer.items.forEach(item => {
                html += `<div class="hotspot-item">
                    <div class="hotspot-statement">${item.statement}</div>
                    <div class="hotspot-selected">→ ${item.answer}</div>
                    <div class="hotspot-explanation">${item.explanation}</div>
                </div>`;
            });
            html += `</div>`;
        }

        html += `</div>`;
        return html;
    },

    explainOption(q, option, isCorrect) {
        const question = q.question.toLowerCase();
        const optText = option.replace(/^[A-Z]\.\s*/, '').trim();
        const optLower = optText.toLowerCase();
        const answer = q.correctAnswers.join(' ').toLowerCase();

        // FIRST: Try cmdlet/command dictionary lookup (highest priority for command-based options)
        const cmdletExplanation = this.explainCmdlet(optText, optLower, isCorrect, q);
        if (cmdletExplanation) return cmdletExplanation;

        // Try to get a specific explanation from the knowledge base
        const specific = this.getSpecificExplanation(question, optLower, optText, isCorrect, q);
        if (specific) return specific;

        // Fallback: analyze option keywords to provide technical context
        const techExplanation = this.getTechExplanation(optLower, isCorrect, question);
        if (techExplanation) return techExplanation;

        // Smart fallback: analyze the QUESTION to explain why this option value is right/wrong
        const questionContext = this.explainFromQuestionContext(q, optText, optLower, isCorrect);
        if (questionContext) return questionContext;

        // Final fallback with context
        if (isCorrect) return this.explainCorrectAnswer(q);
        return this.explainWhyWrong(q, optText, question);
    },

    getSpecificExplanation(question, optLower, optText, isCorrect, q) {
        // === YES/NO questions (common in AZ-104) ===
        if (optLower === 'yes' || optLower === 'no') {
            return this.explainYesNo(q, isCorrect, optLower);
        }

        // === TAG questions ===
        if (question.includes('tag') || (question.includes('associate') && question.includes('department'))) {
            if (optLower.includes('tag')) {
                return isCorrect ? 
                    "<b>Tags</b> are metadata (name-value pairs) attached to Azure resources. They allow logical organization without moving resources. Example: Tag key='Department', value='Finance'. Tags can be enforced via Azure Policy and used in cost management for billing reports per department." :
                    "Tags provide metadata but don't meet the specific requirement here.";
            }
            if (optLower.includes('management group')) {
                return "<b>Management Groups</b> are containers ABOVE subscriptions in the Azure hierarchy. They're used for applying governance (policies, RBAC) across multiple subscriptions. They do NOT organize individual resources like VMs — they operate at the subscription level only.";
            }
            if (optLower.includes('resource group')) {
                return "<b>Resource Groups</b> are logical containers for Azure resources. While you COULD create one per department, this forces moving all VMs to new resource groups (disruptive), and resources can only belong to ONE resource group. Tags are simpler for categorization.";
            }
            if (optLower.includes('modify') || optLower.includes('settings')) {
                return "<b>VM Settings</b> control compute configurations (size, disks, networking, extensions). There is no built-in 'department' field in VM settings. For organizational metadata, Azure Tags are the designed solution.";
            }
        }

        // === CONDITIONAL ACCESS ===
        if (question.includes('conditional access')) {
            if (optLower.includes('multi-factor authentication') || optLower.includes('user settings') || optLower.includes('mfa')) {
                return isCorrect ?
                    "<b>MFA user settings</b> allow per-user MFA configuration. In this context, it satisfies the requirement." :
                    "<b>MFA user settings page</b> (Security > MFA > User settings) only toggles MFA on/off per user. It CANNOT: (1) enforce device requirements, (2) evaluate location conditions, (3) combine multiple conditions. For conditional requirements (location + device + MFA together), you need a Conditional Access policy.";
            }
            if (optLower.includes('session control')) {
                return isCorrect ?
                    "<b>Session controls</b> in Conditional Access manage post-authentication behavior and satisfy this requirement." :
                    "<b>Session controls</b> manage what happens AFTER successful sign-in: sign-in frequency, persistent browser sessions, app-enforced restrictions. They do NOT control authentication requirements (MFA, device compliance) — those are configured in <b>Grant controls</b>.";
            }
            if (optLower.includes('grant control') || optLower.includes('conditional access policy')) {
                return isCorrect ?
                    "<b>Conditional Access Grant controls</b> are the correct mechanism. They allow combining conditions (Who: Global Admins, Where: untrusted locations) with requirements (Grant: Require MFA + Require Azure AD-joined device). This is the ONLY way to enforce all three conditions simultaneously." :
                    "Conditional Access grant controls can combine conditions but may not be the exact approach needed here.";
            }
        }

        // === GPO / SCRIPTS ===
        if (optLower.includes('group policy') || optLower.includes('gpo')) {
            if (optLower.includes('startup script')) {
                return isCorrect ?
                    "<b>GPO Startup Scripts</b> run during computer startup (before user login) under the SYSTEM context. They execute every time the machine boots. Path: Computer Configuration > Policies > Windows Settings > Scripts > Startup. Ideal for: machine-level configurations, deploying agents, running setup tasks that must complete before users interact with the system." :
                    "<b>GPO Startup Scripts</b> run at boot time under SYSTEM context. While GPO is the right tool, startup scripts run before login. Consider whether the timing (startup vs. logon) matches what's required — startup = machine boot, logon = user signs in.";
            }
            if (optLower.includes('logon script')) {
                return isCorrect ?
                    "<b>GPO Logon Scripts</b> run when a user logs in, executing in the user's security context. Ideal for per-user configurations like drive mappings or printer connections." :
                    "<b>GPO Logon Scripts</b> run when a USER logs in (not at machine boot). They execute in the user's context, not SYSTEM. Key difference: Logon scripts are user-triggered and run per-login. If the requirement needs something to run at MACHINE startup (before any user logs in), logon scripts are wrong — use Startup Scripts instead.";
            }
            if (!optLower.includes('startup') && !optLower.includes('logon')) {
                return isCorrect ?
                    "<b>Group Policy Objects (GPO)</b> allow centralized management of computer and user settings across Active Directory domains. GPOs can deploy scripts, configure security, install software, and enforce settings." :
                    "<b>Group Policy Objects (GPO)</b> are domain management tools. Depending on whether the scripts need to run at startup or logon, you must configure the correct policy node.";
            }
        }

        // === SETUPCOMPLETE.CMD ===
        if (optLower.includes('setupcomplete.cmd') || optLower.includes('setupcomplete')) {
            return isCorrect ?
                "<b>SetupComplete.cmd</b> is a special Windows batch file that runs ONCE after Windows Setup (OOBE) completes. Located at %WINDIR%\\Setup\\Scripts\\SetupComplete.cmd. It only executes during initial OS deployment/sysprep — it does NOT run on subsequent boots." :
                "<b>SetupComplete.cmd</b> (%WINDIR%\\Setup\\Scripts\\) is a one-time post-setup script that runs ONLY after Windows initial installation or sysprep completes. It does NOT run on regular reboots or subsequent startups. For recurring execution on every boot, this is the wrong mechanism — GPO Startup Scripts or Scheduled Tasks are needed instead.";
        }

        // === VHD (only for text options like "Place scripts in a VHD", not cmdlets like Add-AzVhd) ===
        if ((optLower.includes('virtual hard disk') || (optLower.includes('vhd') && !optLower.includes('-az'))) && optLower.length > 10) {
            return isCorrect ?
                "<b>Virtual Hard Disk (VHD)</b> is used here to distribute or store the scripts. This is the correct approach for this scenario." :
                "<b>Virtual Hard Disk (VHD)</b> is a disk image format used by Hyper-V and Azure VMs. Simply placing scripts IN a VHD does not automatically execute them. A VHD is just storage — there's no built-in mechanism to run scripts placed inside it without additional configuration (mount + scheduled task/GPO).";
        }

        // === AZURE AD CONNECT / SYNC ===
        if (question.includes('ad connect') || question.includes('adsync') || question.includes('sync') || question.includes('dirsync')) {
            if (optLower.includes('start-adsyncsync') || optLower.includes('delta')) {
                return isCorrect ?
                    "<b>Start-ADSyncSyncCycle -PolicyType Delta</b> triggers an immediate delta synchronization. Delta sync only processes CHANGES since the last sync (new/modified/deleted objects). It takes seconds to minutes vs. hours for a full sync. The default auto-sync runs every 30 minutes." :
                    "<b>Delta sync</b> processes only changes. While efficient, it may not be the right approach if the scenario requires a full object recalculation.";
            }
            if (optLower.includes('initial') || optLower.includes('full sync')) {
                return isCorrect ?
                    "<b>Full/Initial sync</b> reprocesses ALL objects from scratch. Required when sync rules are changed or attribute mappings are modified." :
                    "<b>Full/Initial sync</b> (Start-ADSyncSyncCycle -PolicyType Initial) reprocesses ALL objects in the directory. This takes hours for large directories (thousands of objects). For syncing a single new user immediately, a Delta sync is far more efficient — it only processes the change.";
            }
            if (optLower.includes('sites and services')) {
                return "<b>Active Directory Sites and Services</b> (dssite.msc) manages INTER-DC replication topology: site links, replication schedules between domain controllers. It has ZERO effect on Azure AD Connect synchronization. AD Connect uses its own scheduler independent of AD replication.";
            }
            if (optLower.includes('netlogon')) {
                return "<b>NetLogon service</b> handles domain authentication, secure channel maintenance, and DC locator (finding domain controllers). Restarting it does NOT trigger Azure AD sync — it only affects local domain authentication. Completely unrelated to Azure AD Connect.";
            }
        }

        // === POWERSHELL COMMANDS (now handled by explainCmdlet - only keep New-AzVM for context) ===

        // === RBAC ROLES ===
        if (optLower.includes('owner') && (question.includes('role') || question.includes('rbac') || question.includes('permission') || question.includes('access'))) {
            return isCorrect ?
                "<b>Owner role</b> provides FULL access: read, write, delete ALL resources + ability to assign roles to others (delegate access). Scope: can be assigned at management group, subscription, resource group, or resource level. Inherits downward." :
                "<b>Owner role</b> grants EVERYTHING including role assignment (RBAC management). This violates least-privilege if the user only needs to manage resources (use Contributor) or only needs to assign roles (use User Access Administrator).";
        }
        if (optLower.includes('contributor') && (question.includes('role') || question.includes('rbac') || question.includes('permission') || question.includes('access'))) {
            return isCorrect ?
                "<b>Contributor role</b> can create, modify, and delete ALL resource types. It CANNOT: assign roles, manage access, or create/modify policy assignments. Ideal for developers/admins who need full resource management without granting access to others." :
                "<b>Contributor role</b> manages resources but CANNOT assign roles or manage RBAC. If the requirement involves granting access to other users, Contributor is insufficient — Owner or User Access Administrator is needed.";
        }
        if (optLower.includes('reader') && (question.includes('role') || question.includes('rbac') || question.includes('permission') || question.includes('access'))) {
            return isCorrect ?
                "<b>Reader role</b> provides read-only access to view all resources. Cannot create, modify, delete, or manage access. Ideal for auditors, monitoring teams, or stakeholders who need visibility without change capability." :
                "<b>Reader role</b> is purely read-only — it cannot create, update, delete, or manage any resource. If the task requires ANY write operation (deployment, configuration, deletion), Reader is insufficient.";
        }

        // === STORAGE ===
        if (optLower.includes('storage account') || optLower.includes('blob') || optLower.includes('file share')) {
            if (question.includes('redundancy') || question.includes('replication')) {
                if (optLower.includes('lrs')) return isCorrect ? "<b>LRS (Locally Redundant Storage)</b> maintains 3 synchronous copies within a SINGLE datacenter. Cheapest option. Protects against drive/rack failures but NOT datacenter or regional outages. 11 nines durability." : "<b>LRS</b> keeps all 3 copies in ONE datacenter. If the datacenter fails, ALL copies are lost. Doesn't meet geo-redundancy requirements.";
                if (optLower.includes('zrs')) return isCorrect ? "<b>ZRS (Zone-Redundant Storage)</b> replicates synchronously across 3 availability zones in one region. Protects against single-zone failures. 12 nines durability." : "<b>ZRS</b> stays within ONE region (across zones). It doesn't replicate to another geographic region — inadequate if geo-disaster recovery is required.";
                if (optLower.includes('grs') && !optLower.includes('ra-')) return isCorrect ? "<b>GRS (Geo-Redundant Storage)</b> replicates asynchronously to a paired region 100+ miles away. Secondary is NOT readable until Microsoft initiates failover. 16 nines durability." : "<b>GRS</b> replicates to secondary region but you CANNOT read from it until failover. If read-access from secondary is needed, use RA-GRS instead.";
                if (optLower.includes('ra-grs')) return isCorrect ? "<b>RA-GRS (Read-Access Geo-Redundant Storage)</b> same as GRS but secondary endpoint is always readable (read-only). Use -secondary suffix on account URL. Enables high-availability reads across regions." : "<b>RA-GRS</b> provides maximum redundancy + secondary reads. May be overkill/expensive if only local redundancy is needed.";
            }
        }

        // === NETWORKING ===
        if (optLower.includes('peering') || optLower.includes('vnet peering')) {
            return isCorrect ?
                "<b>VNet Peering</b> connects two Azure Virtual Networks directly through Microsoft's backbone (not internet). Low latency, high bandwidth. Key facts: (1) Non-transitive, (2) Works cross-region (Global VNet Peering), (3) Resources communicate via private IPs, (4) No gateways needed." :
                "<b>VNet Peering</b> provides direct VNet-to-VNet connectivity but is non-transitive (A↔B and B↔C does NOT mean A↔C). Consider if transitivity, encryption, or on-premises connectivity is needed — those require VPN Gateway or other solutions.";
        }
        if (optLower.includes('network security group') || (optLower.includes('nsg') && !optLower.includes('message'))) {
            return isCorrect ?
                "<b>NSG (Network Security Group)</b> contains inbound/outbound security rules evaluated by priority (100-4096, lower=first). Stateful: if inbound allowed, return traffic auto-allowed. Can attach to subnet or NIC. Default rules: allow VNet-to-VNet, allow Azure LB, deny all other inbound." :
                "<b>NSG</b> filters network traffic but may not address the specific networking requirement here. NSGs work at L3/L4 (IP, port, protocol) — they don't inspect L7 (application layer content).";
        }

        // === AZURE POLICY ===
        if (optLower.includes('azure policy') || (optLower.includes('policy') && (question.includes('governance') || question.includes('compliance') || question.includes('enforce')))) {
            if (optLower.includes('deny')) return isCorrect ? "<b>Azure Policy - Deny effect:</b> Blocks resource creation/modification that violates the rule in real-time. The deployment fails with a policy violation error. Use for hard enforcement of standards." : "<b>Deny</b> prevents future non-compliant resources but doesn't remediate existing ones. Also doesn't work for all resource types during updates.";
            if (optLower.includes('audit')) return isCorrect ? "<b>Azure Policy - Audit effect:</b> Logs a warning in the Activity Log and marks the resource as non-compliant in the compliance dashboard. Does NOT block or modify anything — pure visibility." : "<b>Audit</b> only reports — it doesn't prevent or fix non-compliance. If enforcement is needed, Deny or Modify/DeployIfNotExists is required.";
            if (optLower.includes('deployifnotexists')) return isCorrect ? "<b>Azure Policy - DeployIfNotExists:</b> Evaluates if a related resource exists (e.g., diagnostic settings). If not, automatically deploys it using an ARM template. Runs on create/update of the target resource. Requires managed identity." : "<b>DeployIfNotExists</b> auto-deploys related resources but doesn't deny the original deployment or modify the resource itself.";
            if (optLower.includes('modify')) return isCorrect ? "<b>Azure Policy - Modify effect:</b> Adds, updates, or removes properties/tags on a resource during create/update. Requires managed identity. Great for auto-tagging or enforcing property values." : "<b>Modify</b> changes properties on the resource but cannot deploy separate related resources or deny the operation entirely.";
        }

        // === BACKUP ===
        if (optLower.includes('recovery services vault') || optLower.includes('backup vault')) {
            return isCorrect ?
                "<b>Recovery Services Vault</b> is the storage entity for backup data. Key requirements: (1) Must be in SAME region as protected resource, (2) One vault can protect multiple resources, (3) Supports: Azure VMs, SQL in VMs, Azure Files, SAP HANA. Backup data is encrypted at rest." :
                "<b>Recovery Services Vault</b> stores backups but by itself doesn't configure what to back up or when. You also need a backup policy (schedule + retention) and must register the resource.";
        }

        // === AZURE MONITOR ===
        if (optLower.includes('log analytics') || optLower.includes('workspace')) {
            return isCorrect ?
                "<b>Log Analytics Workspace</b> is the central repository for Azure Monitor Logs. It stores log data from multiple sources (Azure resources, on-prem, other clouds). Query using KQL (Kusto Query Language). Data retention: 30 days free, up to 730 days paid." :
                "<b>Log Analytics Workspace</b> stores and queries log data but doesn't directly trigger alerts or actions. You need Alert Rules (on top of workspace queries) for notifications.";
        }
        if (optLower.includes('application insights')) {
            return isCorrect ?
                "<b>Application Insights</b> is an APM (Application Performance Management) service for web apps. Monitors: request rates, response times, exceptions, page views, dependency tracking. Supports .NET, Java, Node.js, Python." :
                "<b>Application Insights</b> monitors application-level performance (code/requests/exceptions). It doesn't monitor infrastructure-level metrics like VM CPU or disk. For VM monitoring, use Azure Monitor metrics or VM Insights.";
        }

        // === DNS ===
        if (optLower.includes('dns zone') || optLower.includes('dns record')) {
            if (optLower.includes('private')) {
                return isCorrect ?
                    "<b>Azure Private DNS Zone</b> provides name resolution INSIDE virtual networks. Supports auto-registration of VM hostnames. No internet exposure. Link zones to VNets for resolution." :
                    "<b>Private DNS zones</b> only resolve within linked VNets. They don't provide public internet DNS resolution. For public-facing domains, use public DNS zones.";
            }
            if (optLower.includes('cname')) return isCorrect ? "<b>CNAME record</b> creates an alias pointing to another domain name (canonical name). Cannot coexist with other records at same name. Cannot be at zone apex (@)." : "<b>CNAME</b> aliases to another domain but has restrictions: cannot be at zone apex (@), cannot coexist with other record types at same name.";
            if (optLower.includes('a record') || optLower.includes(' a ')) return isCorrect ? "<b>A record</b> maps a hostname directly to an IPv4 address. The most basic DNS record type." : "<b>A records</b> map to static IPs. If the underlying IP can change (Azure services), an Alias record or CNAME is more appropriate.";
            if (optLower.includes('alias')) return isCorrect ? "<b>Alias record set</b> is Azure-specific — points to an Azure resource (Traffic Manager, CDN, Public IP, etc.) directly. Works at zone apex (@), auto-updates when resource IP changes." : "<b>Alias records</b> point to Azure resources but are Azure DNS-specific. They resolve to the resource's current IP automatically.";
        }

        // === LOAD BALANCER ===
        if (optLower.includes('load balancer')) {
            if (optLower.includes('standard')) return isCorrect ? "<b>Standard Load Balancer:</b> Zone-redundant, SLA-backed, supports 1000+ backend instances, cross-VNet backends. Closed by default (requires NSG). Required for Availability Zones." : "<b>Standard LB</b> is more capable but closed by default (needs NSG to allow traffic) and costs more than Basic.";
            if (optLower.includes('basic')) return isCorrect ? "<b>Basic Load Balancer:</b> Limited scale (300 instances), no SLA, no zone support, open by default. Being retired — not for production." : "<b>Basic Load Balancer</b> is being retired. No SLA, no zone redundancy, limited to 300 backend instances. Not suitable for production workloads.";
        }
        if (optLower.includes('application gateway')) {
            return isCorrect ?
                "<b>Application Gateway</b> is a Layer 7 (HTTP/HTTPS) load balancer. Supports: URL-based routing, SSL termination, WAF (Web Application Firewall), cookie-based session affinity, WebSocket, HTTP/2." :
                "<b>Application Gateway</b> operates at Layer 7 (HTTP/HTTPS). If the requirement is for Layer 4 (TCP/UDP) load balancing or non-HTTP protocols, Azure Load Balancer is more appropriate.";
        }
        if (optLower.includes('traffic manager')) {
            return isCorrect ?
                "<b>Traffic Manager</b> is a DNS-based global traffic distributor. Routes users to closest/healthiest endpoint. Methods: Priority, Weighted, Performance, Geographic, Multivalue, Subnet. Works across regions." :
                "<b>Traffic Manager</b> is DNS-level routing (not a proxy). It doesn't see actual traffic or provide L4/L7 features. For in-region load balancing, use Azure LB or App Gateway.";
        }
        if (optLower.includes('front door')) {
            return isCorrect ?
                "<b>Azure Front Door</b> is a global Layer 7 load balancer + CDN + WAF. Provides: instant global failover, SSL offloading, URL rewriting, caching at edge. Operates at Microsoft's edge network." :
                "<b>Azure Front Door</b> is global L7 with CDN/WAF. May be overkill for simple regional load balancing or L4 requirements.";
        }

        // === VPN / EXPRESSROUTE ===
        if (optLower.includes('expressroute')) {
            return isCorrect ?
                "<b>ExpressRoute</b> provides PRIVATE dedicated connectivity to Azure via a connectivity provider (not internet). Speeds: 50Mbps to 100Gbps. Use cases: large data transfers, strict compliance, predictable latency. More expensive than VPN." :
                "<b>ExpressRoute</b> is private and dedicated but expensive. Requires a connectivity provider contract. Overkill if encrypted internet tunnel (VPN) meets the requirements.";
        }
        if (optLower.includes('site-to-site') || optLower.includes('s2s vpn')) {
            return isCorrect ?
                "<b>Site-to-Site VPN</b> creates an IPsec/IKE encrypted tunnel between on-premises VPN device and Azure VPN Gateway over the public internet. Requires: compatible VPN device, public IP on-prem. Max ~1.25 Gbps throughput." :
                "<b>Site-to-Site VPN</b> uses internet with encryption. Throughput limited to ~1.25Gbps. If private dedicated connectivity is required, ExpressRoute is needed instead.";
        }
        if (optLower.includes('point-to-site') || optLower.includes('p2s')) {
            return isCorrect ?
                "<b>Point-to-Site VPN</b> connects individual client computers to Azure VNet. Protocols: OpenVPN, SSTP, IKEv2. No VPN device needed — just VPN client software. Ideal for remote workers/developers." :
                "<b>Point-to-Site VPN</b> is for individual CLIENT computers, not connecting entire networks. For connecting offices/datacenters, Site-to-Site VPN or ExpressRoute is needed.";
        }

        // === AVAILABILITY ===
        if (optLower.includes('availability set')) {
            return isCorrect ?
                "<b>Availability Set</b> distributes VMs across Fault Domains (separate racks/power) and Update Domains (staggered maintenance). Provides 99.95% SLA. VMs in same set share a hardware cluster. Max 3 FDs, 20 UDs." :
                "<b>Availability Sets</b> provide in-datacenter redundancy but not cross-zone or cross-region protection. For zone-level protection, use Availability Zones instead.";
        }
        if (optLower.includes('availability zone')) {
            return isCorrect ?
                "<b>Availability Zones</b> are physically separate datacenters within an Azure region. Each zone has independent power, cooling, networking. Provides 99.99% SLA — higher than Availability Sets (99.95%)." :
                "<b>Availability Zones</b> provide zone-level protection but not all regions/services support them. Also doesn't protect against region-wide outages.";
        }
        if (optLower.includes('scale set') || optLower.includes('vmss')) {
            return isCorrect ?
                "<b>VM Scale Sets (VMSS)</b> deploy and manage a group of identical VMs. Support auto-scaling based on metrics or schedule. Can span Availability Zones. Ideal for stateless workloads that need to scale horizontally." :
                "<b>VM Scale Sets</b> provide auto-scaling for identical VMs but are designed for stateless, horizontally-scalable workloads. Not suitable for unique/specialized VM configurations.";
        }

        // === ARM TEMPLATES / DEPLOYMENT ===
        if (optLower.includes('arm template') || optLower.includes('azure resource manager template')) {
            return isCorrect ?
                "<b>ARM Templates</b> are JSON files that define Azure infrastructure as code. Benefits: repeatable deployments, declarative syntax, dependency management, parallel deployment. Stored in Resource Group deployment history." :
                "<b>ARM Templates</b> provide infrastructure-as-code but may not be the specific tool needed for this scenario.";
        }
        if (optLower.includes('bicep')) {
            return isCorrect ?
                "<b>Bicep</b> is a domain-specific language (DSL) that transpiles to ARM template JSON. Simpler syntax than raw JSON, first-class VS Code support, modules for reuse." :
                "<b>Bicep</b> transpiles to ARM JSON — same capabilities, cleaner syntax. But if the question asks about existing ARM template operations, Bicep may not apply.";
        }

        // === KEY VAULT ===
        if (optLower.includes('key vault')) {
            return isCorrect ?
                "<b>Azure Key Vault</b> securely stores: secrets (passwords, connection strings), encryption keys, and SSL/TLS certificates. Access controlled via RBAC or vault access policies. Supports HSM-backed keys. Referenced in ARM templates to avoid plaintext secrets." :
                "<b>Azure Key Vault</b> stores secrets/keys/certs but is for secure storage and retrieval — not for the specific operational requirement described.";
        }

        // === APP SERVICE / WEB APPS ===
        if (optLower.includes('app service') || optLower.includes('web app')) {
            if (optLower.includes('deployment slot')) return isCorrect ? "<b>Deployment Slots</b> (Standard tier+) allow staging deployments. Swap slots for zero-downtime releases. Slot settings can be 'sticky' (not swapped). Each slot has its own URL and can have different app settings." : "<b>Deployment Slots</b> require Standard tier or above. They're specifically for staging/swapping deployments — not for other App Service configurations.";
            if (optLower.includes('scale')) return isCorrect ? "<b>App Service Scale</b> (Scale Up = bigger instance, Scale Out = more instances). Auto-scale rules trigger based on metrics (CPU, memory, HTTP queue) or schedule." : "<b>Scaling</b> adjusts compute capacity but doesn't address deployment or configuration requirements.";
            return isCorrect ?
                "<b>Azure App Service</b> is a PaaS for hosting web apps, REST APIs, mobile backends. Supports: .NET, Java, Node.js, Python, PHP. Features: custom domains, SSL, deployment slots, auto-scale." :
                "<b>App Service</b> is a PaaS offering. Consider if the scenario requires IaaS (VM) control or PaaS simplicity.";
        }

        // === CONTAINERS ===
        if (optLower.includes('container instance') || optLower.includes('aci')) {
            return isCorrect ?
                "<b>Azure Container Instances (ACI)</b> runs containers serverlessly — no VM management. Fast startup (~seconds). Supports Linux/Windows containers. Per-second billing. Ideal for: burst workloads, build agents, short-lived tasks." :
                "<b>ACI</b> is for simple, short-lived container workloads. For complex orchestration (service discovery, auto-scaling, rolling updates), AKS is more appropriate.";
        }
        if (optLower.includes('kubernetes') || optLower.includes('aks')) {
            return isCorrect ?
                "<b>Azure Kubernetes Service (AKS)</b> is managed Kubernetes. Handles: control plane, upgrades, scaling, self-healing. You manage worker nodes. Features: RBAC integration, Azure CNI networking, pod autoscaling, cluster autoscaling." :
                "<b>AKS</b> is a full orchestration platform — complex and expensive for simple container workloads. For single containers or batch jobs, ACI is simpler.";
        }

        return null; // No specific explanation found
    },

    explainYesNo(q, isCorrect, optLower) {
        const text = q.question;
        
        // Extract the solution - try multiple patterns
        let solution = '';
        const solPatterns = [
            /Solution:\s*(.+?)(?=\n.*(?:Does this meet|Does the solution))/si,
            /Solution:\s*(.+?)(?=Does this meet|Does the solution)/si,
            /Solution:\s*(.+?)$/mi
        ];
        for (const pat of solPatterns) {
            const m = text.match(pat);
            if (m) { solution = m[1].trim().replace(/\n+/g, ' '); break; }
        }
        
        // Extract the goal/requirement
        let goal = '';
        const goalPatterns = [
            /(?:you need to|you want to|you must|you plan to|you have been tasked to|the goal is to|you intend to)\s+(.+?)(?:\.|$)/mi,
            /(?:must be configured to|needs to be configured to|should be configured to)\s+(.+?)(?:\.|$)/mi,
            /(?:the policy must be|the solution must)\s+(.+?)(?:\.|$)/mi
        ];
        for (const pat of goalPatterns) {
            const m = text.match(pat);
            if (m) { goal = m[1].trim(); break; }
        }

        // Build the correct approach explanation
        const correctWay = this.getCorrectApproach(text, goal, solution);

        if (isCorrect && optLower === 'yes') {
            let explanation = `<b>✅ Yes — this solution works.</b><br><br>`;
            if (solution) explanation += `<b>Proposed solution:</b> ${solution}<br><br>`;
            if (goal) explanation += `<b>Goal:</b> ${goal}<br><br>`;
            explanation += `<b>Why it works:</b> ${correctWay.whyWorks || 'The proposed approach uses the correct Azure service/feature with the right scope and configuration to achieve all stated requirements.'}`;
            return explanation;
        }
        if (isCorrect && optLower === 'no') {
            let explanation = `<b>❌ No — this solution does NOT work.</b><br><br>`;
            if (solution) explanation += `<b>Proposed solution:</b> ${solution}<br><br>`;
            if (goal) explanation += `<b>Goal:</b> ${goal}<br><br>`;
            explanation += `<b>Why it fails:</b> ${correctWay.whyFails || 'The proposed approach either uses the wrong feature, wrong scope, or is missing required steps.'}<br><br>`;
            explanation += `<b>✅ Correct approach:</b> ${correctWay.correct || 'Use a different Azure service/feature that directly addresses all the stated requirements.'}`;
            return explanation;
        }
        if (!isCorrect && optLower === 'yes') {
            let explanation = `<b>This answer is wrong — the solution does NOT work.</b><br><br>`;
            if (solution) explanation += `<b>Proposed solution:</b> ${solution}<br><br>`;
            explanation += `<b>Why it fails:</b> ${correctWay.whyFails || 'The proposed approach doesn\'t fully meet the requirements.'}<br><br>`;
            explanation += `<b>✅ Correct approach:</b> ${correctWay.correct || 'A different service or configuration is needed.'}`;
            return explanation;
        }
        if (!isCorrect && optLower === 'no') {
            let explanation = `<b>This answer is wrong — the solution actually DOES work.</b><br><br>`;
            if (solution) explanation += `<b>Proposed solution:</b> ${solution}<br><br>`;
            explanation += `<b>Why it works:</b> ${correctWay.whyWorks || 'The proposed approach correctly satisfies all requirements.'}`;
            return explanation;
        }
        return null;
    },

    getCorrectApproach(text, goal, solution) {
        const t = text.toLowerCase();
        const s = solution.toLowerCase();
        const result = { whyWorks: '', whyFails: '', correct: '' };

        // === GUEST USERS / B2B ===
        if (t.includes('guest') || t.includes('external user') || t.includes('b2b') || (t.includes('invite') && t.includes('user'))) {
            if (s.includes('new-azureaduser') && !s.includes('invitation')) {
                result.whyFails = "<b>New-AzureADUser</b> creates INTERNAL (member) users in your directory. It cannot create guest/external users. Guest users are created through the B2B invitation process, not regular user creation.";
                result.correct = "Use <b>New-AzureADMSInvitation</b> cmdlet to send B2B invitations to external users. This sends an invitation email and creates a guest user object. For bulk operations: Import the CSV and loop with New-AzureADMSInvitation -InvitedUserEmailAddress $email -InviteRedirectUrl 'https://myapps.microsoft.com'";
            } else if (s.includes('new-azureadmsinvitation') || s.includes('invitation')) {
                result.whyWorks = "<b>New-AzureADMSInvitation</b> is the correct cmdlet for creating guest (B2B) users. It sends invitations to external email addresses and creates guest user objects in your Azure AD tenant. You can loop through a CSV to bulk-invite 500 users.";
            } else if (s.includes('new-msoluser')) {
                result.whyFails = "<b>New-MsolUser</b> creates internal users using the deprecated MSOnline module. It cannot create guest users. Additionally, the MSOnline module is deprecated in favor of Microsoft Graph.";
                result.correct = "Use <b>New-AzureADMSInvitation</b> (AzureAD module) or <b>New-MgInvitation</b> (Microsoft Graph module) to invite external users as guests.";
            } else if (s.includes('bulk') && s.includes('portal')) {
                result.whyWorks = "The Azure Portal supports bulk invite of guest users: Azure AD > Users > Bulk operations > Bulk invite. You can upload a CSV file with email addresses to invite multiple external users at once.";
            }
        }

        // === CONDITIONAL ACCESS ===
        if (t.includes('conditional access') && (t.includes('mfa') || t.includes('multi-factor'))) {
            if (s.includes('multi-factor authentication page') || s.includes('user settings')) {
                result.whyFails = "The MFA user settings page (Security > MFA) only enables/disables MFA per user. It CANNOT enforce device requirements (Azure AD-joined) or location-based conditions. These require Conditional Access policies.";
                result.correct = "Create a <b>Conditional Access policy</b> with: Assignments → Users (Global Administrators), Conditions → Locations (untrusted), Grant controls → Require MFA + Require Azure AD-joined device.";
            } else if (s.includes('session control')) {
                result.whyFails = "Session controls in Conditional Access manage POST-sign-in behavior (sign-in frequency, app restrictions). They do NOT enforce authentication requirements like MFA or device compliance at the time of sign-in.";
                result.correct = "Use <b>Grant controls</b> (not session controls) in a Conditional Access policy. Grant controls enforce: Require MFA, Require compliant device, Require Azure AD-joined device, etc.";
            } else if (s.includes('grant control') || s.includes('conditional access policy')) {
                result.whyWorks = "A Conditional Access policy with Grant controls can combine multiple requirements: (1) Target users = Global Administrators, (2) Condition = untrusted locations, (3) Grant = Require MFA AND Require Azure AD-joined device. This satisfies all stated conditions.";
            } else if (s.includes('security default')) {
                result.whyFails = "Security Defaults enable basic MFA for all users but don't allow granular control over device requirements, specific user groups, or location conditions.";
                result.correct = "Disable Security Defaults and create a <b>Conditional Access policy</b> with specific user/group targeting, location conditions, and device compliance requirements in Grant controls.";
            }
        }

        // === AZURE AD CONNECT / SYNC ===
        if (t.includes('azure ad') && (t.includes('sync') || t.includes('replicate') || t.includes('ad connect'))) {
            if (s.includes('start-adsyncsync') && s.includes('delta')) {
                result.whyWorks = "Start-ADSyncSyncCycle -PolicyType Delta immediately processes ONLY objects changed since last sync. It's the fastest way to push a new/modified user to Azure AD without waiting for the 30-minute auto-cycle.";
            } else if (s.includes('start-adsyncsync') && s.includes('initial')) {
                result.whyFails = "An Initial sync reprocesses ALL objects (can take hours for large directories). While it would eventually sync the user, a Delta sync achieves the same result in seconds for a single change.";
                result.correct = "Run <b>Start-ADSyncSyncCycle -PolicyType Delta</b> on the Azure AD Connect server. This only syncs changes since the last cycle and completes in seconds.";
            } else if (s.includes('sites and services') || s.includes('active directory sites')) {
                result.whyFails = "Active Directory Sites and Services manages replication BETWEEN on-premises domain controllers. It has zero effect on Azure AD Connect synchronization to the cloud.";
                result.correct = "Run <b>Start-ADSyncSyncCycle -PolicyType Delta</b> on the Azure AD Connect server to trigger an immediate cloud sync.";
            } else if (s.includes('netlogon')) {
                result.whyFails = "The NetLogon service handles domain controller authentication and secure channel operations. Restarting it does not trigger any Azure AD synchronization.";
                result.correct = "Run <b>Start-ADSyncSyncCycle -PolicyType Delta</b> on the Azure AD Connect server.";
            }
        }

        // === USER CREATION (not guest) ===
        if ((t.includes('create') || t.includes('add')) && t.includes('user') && !t.includes('guest') && !t.includes('external')) {
            if (s.includes('new-azureadmsinvitation') || s.includes('invitation')) {
                result.whyFails = "New-AzureADMSInvitation creates GUEST (external/B2B) users via invitation. It cannot create regular internal member users in your directory.";
                result.correct = "Use <b>New-AzureADUser</b> to create internal member users. Parameters: -DisplayName, -UserPrincipalName, -PasswordProfile, -AccountEnabled $true, -MailNickName.";
            } else if (s.includes('new-azureaduser')) {
                result.whyWorks = "New-AzureADUser correctly creates internal member users in your Azure AD tenant. Combined with Import-Csv for bulk operations, it efficiently creates multiple users from a CSV file.";
            }
        }

        // === RESOURCE GROUPS / MOVING RESOURCES ===
        if (t.includes('move') && (t.includes('resource group') || t.includes('subscription'))) {
            if (t.includes('different region') || t.includes('another region')) {
                result.whyFails = "Moving a resource between resource groups or subscriptions does NOT change its physical region/location. The resource stays in its original region. Move only changes logical container.";
                result.correct = "To move a resource to a different REGION, you must <b>redeploy</b> it in the target region (create new → migrate data → delete old), or use <b>Azure Resource Mover</b> for supported resource types (VMs, VNets, NSGs).";
            }
        }

        // === RESOURCE LOCKS ===
        if (t.includes('lock') || t.includes('prevent') && t.includes('delet')) {
            if (s.includes('readonly') || s.includes('read-only') || s.includes('readlock')) {
                if (t.includes('delete') && !t.includes('modify')) {
                    result.whyFails = "A ReadOnly lock prevents both modifications AND deletions. While it does prevent deletion, it's overly restrictive — users also cannot modify the resource. If only deletion prevention is needed, use a Delete lock.";
                    result.correct = "Apply a <b>Delete lock (CanNotDelete)</b> on the resource. This prevents deletion while still allowing modifications to the resource properties.";
                } else {
                    result.whyWorks = "A ReadOnly lock prevents ALL write operations (modify and delete). Users can only read the resource. This protects against both accidental changes and deletions.";
                }
            }
            if (s.includes('delete lock') || s.includes('cannotdelete')) {
                if (t.includes('modify') || t.includes('change')) {
                    result.whyFails = "A Delete lock (CanNotDelete) only prevents deletion. It does NOT prevent modifications to the resource. Users can still change properties, settings, and configurations.";
                    result.correct = "Apply a <b>ReadOnly lock</b> to prevent both modifications and deletions. Only read operations are allowed with this lock type.";
                } else {
                    result.whyWorks = "A Delete lock prevents accidental deletion while still allowing users to modify the resource. This is the least-restrictive lock that prevents deletion.";
                }
            }
        }

        // === POLICY ASSIGNMENT ===
        if (t.includes('policy') || t.includes('initiative')) {
            if (s.includes('management group') && t.includes('subscription')) {
                result.whyWorks = "Assigning a policy at the Management Group level applies it to ALL subscriptions under that management group. Policy assignments inherit downward through the hierarchy.";
            }
            if (s.includes('resource group') && (t.includes('subscription') || t.includes('all resource'))) {
                result.whyFails = "Assigning policy at a resource group scope only affects that single resource group, not the entire subscription or other resource groups.";
                result.correct = "Assign the policy at the <b>subscription scope</b> to cover all resource groups within that subscription, or at the <b>management group scope</b> to cover multiple subscriptions.";
            }
        }

        // === BACKUP ===
        if (t.includes('backup') || t.includes('recovery services')) {
            if (s.includes('different region') && t.includes('vault')) {
                result.whyFails = "A Recovery Services vault must be in the SAME region as the resource being backed up. You cannot back up a resource to a vault in a different region directly.";
                result.correct = "Create a <b>Recovery Services vault in the same region</b> as the resource, then configure the backup policy. For cross-region redundancy, set the vault's storage replication to GRS.";
            }
            if (s.includes('same region') || (s.includes('vault') && !s.includes('different'))) {
                result.whyWorks = "The Recovery Services vault is in the same region as the protected resource, which is required. Backup data is stored locally and can be geo-replicated based on vault redundancy settings (LRS/GRS).";
            }
        }

        // === RBAC / PERMISSIONS ===
        if (t.includes('permission') || t.includes('role') || (t.includes('access') && t.includes('assign'))) {
            if (s.includes('contributor') && (t.includes('assign role') || t.includes('delegate') || t.includes('grant access'))) {
                result.whyFails = "The Contributor role can manage all resources but CANNOT assign RBAC roles to other users. Role assignment requires the Owner role or User Access Administrator role.";
                result.correct = "Assign the <b>Owner</b> role (full access + RBAC management) or <b>User Access Administrator</b> role (RBAC management only, no resource management) at the appropriate scope.";
            }
            if (s.includes('reader') && (t.includes('create') || t.includes('modify') || t.includes('deploy') || t.includes('manage'))) {
                result.whyFails = "The Reader role is strictly read-only. It cannot create, modify, delete, or manage any Azure resources. Only view operations are allowed.";
                result.correct = "Assign <b>Contributor</b> (for full resource management without RBAC) or a specific role like <b>Virtual Machine Contributor</b>, <b>Network Contributor</b>, <b>Storage Account Contributor</b> for least-privilege.";
            }
        }

        // === NETWORKING ===
        if (t.includes('virtual network') || t.includes('vnet')) {
            if (s.includes('peering') && (t.includes('transitive') || t.includes('three') || t.includes('hub'))) {
                result.whyFails = "VNet peering is NON-transitive. If VNet-A peers with VNet-B and VNet-B peers with VNet-C, VNet-A CANNOT communicate with VNet-C through VNet-B.";
                result.correct = "Either create a <b>direct peering between all VNets that need to communicate</b>, or use a <b>hub-and-spoke topology with Azure Firewall/NVA</b> in the hub for transit routing (enable 'Allow Gateway Transit' and 'Use Remote Gateways').";
            }
            if (t.includes('different region') && s.includes('peering')) {
                result.whyWorks = "Global VNet Peering allows peering between VNets in different Azure regions. Traffic uses Microsoft's backbone network with low latency. No encryption overhead (unlike VPN).";
            }
        }

        // === DNS ===
        if (t.includes('dns') && !t.includes('ad connect')) {
            if ((s.includes('cname') && (t.includes('apex') || t.includes('root domain') || t.includes('@')))) {
                result.whyFails = "CNAME records CANNOT be created at the zone apex (@ record). This is a DNS protocol limitation — the apex must have SOA and NS records which conflict with CNAME.";
                result.correct = "Use an <b>Azure DNS Alias record set</b> (A or AAAA type) at the zone apex. Alias records can point to Azure resources (Traffic Manager profile, Public IP, CDN endpoint) and auto-update when the resource IP changes.";
            }
        }

        // === STORAGE ===
        if (t.includes('storage')) {
            if (s.includes('access key') && (t.includes('limit') || t.includes('time') || t.includes('granular') || t.includes('specific'))) {
                result.whyFails = "Access keys provide FULL unrestricted access to the entire storage account. They don't support time-limits, IP restrictions, or granular (per-container/blob) permissions.";
                result.correct = "Use a <b>Shared Access Signature (SAS)</b> for time-limited, permission-scoped, optionally IP-restricted access. Or use <b>Azure AD RBAC</b> (Storage Blob Data Reader/Contributor) for identity-based access.";
            }
            if (s.includes('azcopy') && t.includes('between') && t.includes('account')) {
                result.whyWorks = "AzCopy is the correct tool for server-side copy between storage accounts. Use: <code>azcopy copy 'source-url-with-sas' 'dest-url-with-sas' --recursive</code>. Data transfers directly between accounts without downloading locally.";
            }
        }

        // === AZURE MONITOR / ALERTS ===
        if (t.includes('alert') || t.includes('notify') || t.includes('monitor')) {
            if (s.includes('action group') && !t.includes('create alert') && !t.includes('alert rule')) {
                result.whyFails = "An action group defines WHO to notify and HOW (email, SMS, webhook), but you still need an Alert Rule to define WHAT condition triggers the notification.";
                result.correct = "Create an <b>Alert Rule</b> (metric alert, log alert, or activity log alert) that defines the trigger condition, then associate it with an Action Group for notifications/automation.";
            }
            if (s.includes('diagnostic setting') && t.includes('alert')) {
                result.whyFails = "Diagnostic settings send logs/metrics to destinations (Log Analytics, Storage, Event Hub) for storage/analysis, but don't create alerts by themselves.";
                result.correct = "Configure diagnostic settings first (to send data to Log Analytics), then create a <b>Log Alert Rule</b> in Azure Monitor that queries the workspace and triggers an Action Group when conditions are met.";
            }
        }

        // === VM / COMPUTE ===
        if (t.includes('virtual machine') || t.includes(' vm ') || t.includes(' vms ')) {
            if (s.includes('availability set') && t.includes('zone')) {
                result.whyFails = "Availability Sets provide redundancy within a SINGLE datacenter (fault/update domains). They don't protect against datacenter-level failures.";
                result.correct = "Deploy VMs across <b>Availability Zones</b> (zone 1, 2, 3) — these are separate physical datacenters within a region. Provides 99.99% SLA vs Availability Sets' 99.95%.";
            }
            if ((s.includes('resize') || s.includes('allocation')) && t.includes('availability set')) {
                result.whyFails = "VMs in an availability set share a hardware cluster. If the new size isn't available on that cluster, you'll get an allocation failure.";
                result.correct = "<b>Stop (deallocate) ALL VMs in the availability set</b>, then resize. Deallocating releases the cluster constraint, allowing Azure to reallocate to a cluster supporting the new VM size.";
            }
        }

        // === APP SERVICE ===
        if (t.includes('app service') || t.includes('web app')) {
            if (s.includes('basic') && (t.includes('slot') || t.includes('deployment slot'))) {
                result.whyFails = "Deployment slots require <b>Standard tier or higher</b>. Basic tier does not support deployment slots. Tier features: Free (10 apps), Basic (unlimited apps, custom domain), Standard (slots, auto-scale), Premium (more slots, VNet integration).";
                result.correct = "Scale up to <b>Standard (S1)</b> or <b>Premium (P1)</b> tier, then create deployment slots for zero-downtime deployments.";
            }
            if (s.includes('free') && (t.includes('custom domain') || t.includes('ssl'))) {
                result.whyFails = "The Free tier does not support custom domains or SSL bindings. It's limited to the *.azurewebsites.net domain.";
                result.correct = "Scale to <b>Basic (B1)</b> for custom domains, <b>Standard</b> for SSL + slots + auto-scale.";
            }
        }

        // === SCALE SETS ===
        if (t.includes('scale set') || t.includes('vmss')) {
            if (s.includes('availability set')) {
                result.whyFails = "VM Scale Sets and Availability Sets are SEPARATE availability mechanisms. Scale Sets have built-in fault/update domain distribution and don't use Availability Sets.";
                result.correct = "Configure the <b>VM Scale Set directly</b> with the desired fault domain count. VMSS handles distribution automatically. For zone protection, deploy VMSS across Availability Zones.";
            }
        }

        // === SUBSCRIPTION / MANAGEMENT ===
        if (t.includes('subscription') && (t.includes('transfer') || t.includes('move') || t.includes('billing'))) {
            if (s.includes('account admin') || s.includes('service admin')) {
                result.whyWorks = "The Account Administrator (billing admin) can transfer subscription ownership. The Service Administrator has full control over Azure resources within the subscription.";
            }
        }

        // === GENERAL: If nothing specific matched, analyze solution keywords ===
        if (!result.whyWorks && !result.whyFails) {
            // Analyze PowerShell cmdlets
            if (s.includes('new-azureaduser') && (t.includes('guest') || t.includes('external') || t.includes('invitation'))) {
                result.whyFails = "New-AzureADUser creates internal MEMBER users only. For guest/external/B2B users, the invitation API must be used.";
                result.correct = "Use <b>New-AzureADMSInvitation</b> to invite external users as guests, or use the Azure Portal bulk invite feature (Azure AD > Users > Bulk operations > Bulk invite).";
            }
            if (s.includes('new-azureadgroup') && t.includes('dynamic')) {
                result.whyFails = "New-AzureADGroup creates static groups by default. Dynamic groups require setting -GroupTypes 'DynamicMembership' and providing a -MembershipRule.";
                result.correct = "Use <b>New-AzureADMSGroup</b> with -GroupTypes 'DynamicMembership' -MembershipRule '(user.department -eq \"Sales\")' -MembershipRuleProcessingState 'On'";
            }
            // Last resort: generic but informative
            if (!result.whyWorks && !result.whyFails) {
                if (s) {
                    // Analyze what's wrong based on the question context
                    const keywords = [];
                    if (t.includes('guest') || t.includes('external')) keywords.push('B2B/guest user operations');
                    if (t.includes('powershell') || t.includes('script') || t.includes('cmdlet')) keywords.push('PowerShell automation');
                    if (t.includes('portal')) keywords.push('Azure Portal');
                    if (t.includes('csv') || t.includes('bulk')) keywords.push('bulk operations');
                    if (t.includes('permission') || t.includes('role')) keywords.push('access control');
                    if (t.includes('policy')) keywords.push('Azure Policy');
                    
                    const context = keywords.length > 0 ? ` (Context: ${keywords.join(', ')})` : '';
                    result.whyFails = `The proposed solution uses an approach that doesn't fully address the requirement.${context} The cmdlet/service/configuration described either targets the wrong object type, operates at the wrong scope, or is missing required parameters.`;
                    result.correct = `Review the requirement carefully — the key distinction is what TYPE of operation is needed (create vs invite, internal vs external, member vs guest, read vs write). The correct tool must match both the OPERATION and the TARGET.`;
                }
            }
        }

        return result;
    },

    // Comprehensive Azure cmdlet/command dictionary
    cmdletDB: {
        // === VM / COMPUTE ===
        'add-azvm': 'Adds a VM to an existing configuration (e.g., a recovery plan). Does NOT create a new VM. For creating VMs use New-AzVM.',
        'new-azvm': 'Creates a new Azure Virtual Machine. Requires parameters: -ResourceGroupName, -Name, -Location, -Image, -Size, -Credential.',
        'set-azvm': 'Modifies properties of an existing VM (e.g., generalize, mark as deallocated). Use Update-AzVM for configuration changes.',
        'update-azvm': 'Applies configuration changes to a VM (after modifying the VM object in memory with Set-AzVMOSDisk, etc.).',
        'stop-azvm': 'Stops (deallocates) a running VM. Use -StayProvisioned to keep the VM allocated (still billed for compute). Without it, VM is fully deallocated (no compute billing).',
        'start-azvm': 'Starts a stopped/deallocated VM.',
        'restart-azvm': 'Restarts a running VM (equivalent to reboot).',
        'remove-azvm': 'Deletes a VM. Does NOT delete associated resources (disks, NICs, public IPs) unless explicitly specified.',
        'get-azvm': 'Retrieves VM properties and status. Use -Status flag to get power state (running, stopped, deallocated).',
        'new-azvmconfig': 'Creates a VM configuration object in memory. Used as the first step before piping to Set-AzVMOperatingSystem, Set-AzVMSourceImage, etc.',
        'set-azvmoperatingsystem': 'Configures OS properties (Windows/Linux, computer name, credentials) on a VM config object.',
        'set-azvmsourceimage': 'Sets the marketplace image reference (Publisher, Offer, SKU, Version) on a VM config object.',
        'add-azvmnetworkinterface': 'Attaches a NIC to a VM config object.',
        'set-azvmosdisk': 'Configures the OS disk (name, create option, managed disk ID) on a VM config object.',
        
        // === VHD / IMAGES ===
        'add-azvhd': 'Uploads a local VHD file to an Azure managed disk or page blob. Used to bring on-premises VM disks into Azure. This is for VHD upload, not VM creation.',
        'save-azvhd': 'Downloads a VHD from Azure to local storage.',
        'add-azimage': 'Does not exist as a standard cmdlet. Use New-AzImage to create a managed image from a generalized VM or VHD.',
        'new-azimage': 'Creates a custom managed image from a generalized/captured VM. The image can then be used to create multiple VMs.',
        'new-azimagegallery': 'Creates a Shared Image Gallery for organizing and sharing VM images across subscriptions/regions.',
        'add-azimagedatadisk': 'Adds a data disk configuration to an image object (New-AzImageConfig). Used when creating images that include additional data disks.',
        
        // === DISKS ===
        'new-azdisk': 'Creates a new managed disk (empty, from snapshot, from VHD, or from another disk).',
        'new-azdiskconfig': 'Creates a disk configuration object with specified properties (size, SKU, source).',
        'add-azvmdatadisk': 'Attaches a data disk to an existing VM. Parameters: -VM, -Name, -CreateOption, -Lun, -DiskSizeGB.',
        'remove-azvmdatadisk': 'Detaches a data disk from a VM. The disk is not deleted, just disconnected.',
        'set-azvmdiskencryptionextension': 'Enables Azure Disk Encryption (BitLocker for Windows, DM-Crypt for Linux) on a VM using Key Vault.',
        'new-azsnapshot': 'Creates a snapshot of a managed disk (point-in-time copy).',
        
        // === NETWORKING ===
        'new-azvirtualnetwork': 'Creates a new Virtual Network with specified address space and subnets.',
        'add-azvirtualnetworksubnetconfig': 'Adds a subnet configuration to an existing VNet object (must call Set-AzVirtualNetwork to apply).',
        'set-azvirtualnetwork': 'Applies changes to a VNet object (after adding/modifying subnets in memory).',
        'new-aznetworksecuritygroup': 'Creates a new NSG (empty or with rules).',
        'new-aznetworksecurityruleconfig': 'Creates a security rule for an NSG (priority, direction, port, protocol, action).',
        'add-aznetworksecurityruleconfig': 'Adds a new rule to an existing NSG object.',
        'set-aznetworksecuritygroup': 'Applies changes to an NSG (after adding/modifying rules in memory).',
        'new-azloadbalancer': 'Creates a new Azure Load Balancer (Basic or Standard SKU).',
        'new-azpublicipaddress': 'Creates a new public IP address resource (Static or Dynamic allocation).',
        'new-aznetworkinterface': 'Creates a new NIC associated with a subnet, NSG, and optionally a public IP.',
        'new-azvirtualnetworkpeering': 'Creates a peering connection between two VNets.',
        'add-azvirtualnetworkpeering': 'Adds a peering to an existing VNet.',
        'new-azvpngateway': 'Creates a VPN Gateway for site-to-site or point-to-site VPN connectivity.',
        'new-azfirewall': 'Creates an Azure Firewall instance in a VNet.',
        'new-azapplicationgateway': 'Creates a Layer 7 Application Gateway (HTTP/HTTPS load balancer with WAF).',
        'new-azroutetable': 'Creates a user-defined route table (UDR) for custom routing.',
        'add-azrouteconfig': 'Adds a route to a route table (next hop: VNet, Internet, VirtualAppliance, None).',
        'new-azdnszone': 'Creates an Azure DNS zone (public or private).',
        'new-azdnsrecordset': 'Creates a DNS record set in a zone.',
        'add-azdnsrecordconfig': 'Adds a record to a DNS record set (A, AAAA, CNAME, MX, etc.).',
        
        // === STORAGE ===
        'new-azstorageaccount': 'Creates a new storage account with specified SKU (LRS, GRS, ZRS), Kind (StorageV2, BlobStorage), and access tier.',
        'set-azstorageaccount': 'Modifies storage account properties (change access tier, redundancy, enable/disable features).',
        'get-azstorageaccountkey': 'Retrieves the access keys for a storage account.',
        'new-azstoragecontainer': 'Creates a blob container within a storage account.',
        'set-azstorageblobcontent': 'Uploads a file to blob storage.',
        'get-azstorageblobcontent': 'Downloads a blob to local storage.',
        'new-azstorageaccountsastoken': 'Generates an account-level SAS token for the storage account.',
        'new-azstorageblobsastoken': 'Generates a blob-level SAS token for a specific blob.',
        'new-azstorageshare': 'Creates an Azure Files share.',
        'set-azstorageaccount': 'Updates storage account properties (tier, replication, network rules).',
        'new-azdatalaketransfer': 'Transfers data to/from Data Lake Storage.',
        
        // === IDENTITY / AZURE AD ===
        'new-azureaduser': 'Creates a new INTERNAL (member) user in Azure AD. Cannot create guest users. Parameters: -DisplayName, -UserPrincipalName, -PasswordProfile, -AccountEnabled.',
        'new-azureadmsinvitation': 'Sends a B2B invitation to create a GUEST (external) user. The invited user receives an email to accept. Parameters: -InvitedUserEmailAddress, -InviteRedirectUrl.',
        'new-azureadgroup': 'Creates a new security or Microsoft 365 group. Use -GroupTypes for dynamic membership.',
        'add-azureadgroupmember': 'Adds a user/service principal as a member to a group.',
        'add-azureadgroupowner': 'Adds an owner to a group (owners can manage group membership).',
        'new-azureadapplication': 'Registers a new application in Azure AD (creates an app registration).',
        'new-azureadserviceprincipal': 'Creates a service principal for an Azure AD application (enterprise app).',
        'set-azureaduser': 'Modifies properties of an existing Azure AD user.',
        'remove-azureaduser': 'Deletes a user from Azure AD (soft delete, recoverable for 30 days).',
        'get-azureaduser': 'Retrieves user properties from Azure AD. Use -Filter for queries.',
        'new-azadserviceprincipal': 'Creates a service principal (Az module equivalent).',
        'new-azroleassignment': 'Assigns an RBAC role to a user/group/service principal at a specified scope.',
        'remove-azroleassignment': 'Removes an RBAC role assignment.',
        'get-azroleassignment': 'Lists all RBAC role assignments at a specified scope.',
        'get-azroledefinition': 'Lists available role definitions (built-in and custom).',
        'new-azroledefinition': 'Creates a custom RBAC role definition with specific permissions.',
        
        // === RESOURCE MANAGEMENT ===
        'new-azresourcegroup': 'Creates a new resource group in a specified location.',
        'remove-azresourcegroup': 'Deletes a resource group and ALL resources within it.',
        'move-azresource': 'Moves resources from one resource group to another (or different subscription). Does NOT change region.',
        'new-azresourcegroupdeployment': 'Deploys an ARM template to a resource group.',
        'new-azdeployment': 'Deploys an ARM template at subscription or management group scope.',
        'test-azresourcegroupdeployment': 'Validates an ARM template without actually deploying it (what-if).',
        'export-azresourcegroup': 'Exports all resources in a resource group as an ARM template JSON.',
        'new-azresourcelock': 'Creates a lock (ReadOnly or CanNotDelete) on a resource/resource group.',
        'remove-azresourcelock': 'Removes a resource lock.',
        'get-azresourcelock': 'Lists all locks at a specified scope.',
        'register-azresourceprovider': 'Registers a resource provider for use in the subscription (e.g., Microsoft.Compute, Microsoft.Storage).',
        
        // === POLICY ===
        'new-azpolicyassignment': 'Assigns an Azure Policy to a scope (management group, subscription, resource group).',
        'new-azpolicydefinition': 'Creates a custom policy definition with rules and effect.',
        'get-azpolicyassignment': 'Lists policy assignments at a scope.',
        'new-azpolicysetdefinition': 'Creates a policy initiative (group of policies).',
        
        // === BACKUP / RECOVERY ===
        'backup-azrecoveryservicesvaultitem': 'Triggers an on-demand backup of a protected item.',
        'enable-azrecoveryservicesbackupprotection': 'Enables backup for a resource using a specified backup policy.',
        'get-azrecoveryservicesbackupitem': 'Gets backed up items in a vault.',
        'restore-azrecoveryservicesbackupitem': 'Restores a backed-up item to a specified recovery point.',
        'set-azrecoveryservicesvaultcontext': 'Sets the vault context for subsequent Recovery Services operations.',
        'get-azrecoveryservicesbackuprecoverypoint': 'Lists available recovery points for a backup item.',
        'new-azrecoveryservicesvault': 'Creates a new Recovery Services vault for backup/site recovery.',
        
        // === MONITORING ===
        'add-azmetric alertrule': 'Creates a classic metric alert rule (deprecated, use Add-AzMetricAlertRuleV2).',
        'add-azmetricalertrulev2': 'Creates a metric alert rule (monitors a metric and triggers action group).',
        'set-azdiagnosticsetting': 'Configures diagnostic settings to send metrics/logs to Log Analytics, Storage, or Event Hub.',
        'new-azactiongroup': 'Creates an action group (defines notification receivers and automation actions).',
        'new-azactivitylogalert': 'Creates an activity log alert (triggers on Azure control plane operations).',
        'get-azlog': 'Retrieves activity log entries.',
        'get-azmetric': 'Retrieves metric data for a resource.',
        
        // === APP SERVICE ===
        'new-azwebapp': 'Creates a new Azure Web App (App Service).',
        'new-azappserviceplan': 'Creates an App Service Plan (defines compute resources: tier, size, region).',
        'set-azwebapp': 'Modifies web app configuration (app settings, connection strings, runtime).',
        'new-azwebappslot': 'Creates a deployment slot for a web app.',
        'switch-azwebappslot': 'Swaps two deployment slots (typically staging → production).',
        'publish-azwebapp': 'Deploys code to a web app from a ZIP package.',
        
        // === CONTAINERS ===
        'new-azcontainergroup': 'Creates an Azure Container Instance (ACI) group with one or more containers.',
        'new-azakscluster': 'Creates a new Azure Kubernetes Service (AKS) cluster.',
        'import-azaksclustercredential': 'Downloads AKS cluster credentials to kubectl config.',
        'set-azakscluster': 'Modifies AKS cluster properties (scaling, upgrades).',
        
        // === KEY VAULT ===
        'new-azkeyvault': 'Creates a new Azure Key Vault.',
        'set-azkeyvaultaccesspolicy': 'Sets access policy on a Key Vault (permissions for keys, secrets, certificates per identity).',
        'set-azkeyvaultsecret': 'Stores a secret in Key Vault.',
        'get-azkeyvaultsecret': 'Retrieves a secret from Key Vault.',
        'add-azkeyvaultkey': 'Adds or imports a key to Key Vault.',
        
        // === SCALE SETS ===
        'new-azvmss': 'Creates a VM Scale Set (group of identical auto-scaling VMs).',
        'update-azvmss': 'Updates VMSS model (image, size, extensions). Instances need manual upgrade unless set to Automatic.',
        'update-azvmssinstance': 'Applies the latest VMSS model to specific instances.',
        
        // === AZURE AD CONNECT ===
        'start-adsyncsync cycle': 'Triggers Azure AD Connect synchronization. Use -PolicyType Delta (changes only) or Initial (full sync).',
        'start-adsyncsync cycle -policytype delta': 'Syncs only CHANGES since last cycle. Fast (seconds). Use for immediate sync of new/modified objects.',
        'start-adsyncsync cycle -policytype initial': 'Full re-sync of ALL objects. Slow (hours for large directories). Required after sync rule changes.',
    },

    explainCmdlet(optText, optLower, isCorrect, q) {
        // Try to find a cmdlet name in the option (Verb-Noun pattern)
        const cmdletMatch = optText.match(/(?:^|\b)([A-Z][a-z]+-(?:Az|AzureAD|AzureADMS|ADSync|Msol|Mg)[A-Za-z]*)/);
        if (!cmdletMatch) {
            // Also try a more general PowerShell cmdlet pattern (Verb-Noun with dash)
            const generalMatch = optText.match(/(?:^|\b)([A-Z][a-z]+(?:[A-Z][a-z]*)*-[A-Z][a-z]+[A-Za-z]*)/);
            if (!generalMatch) return null;
            // Check if it looks like an Azure cmdlet
            const cmd = generalMatch[0].toLowerCase();
            if (!this.cmdletDB[cmd] && !cmd.includes('-az') && !cmd.includes('-msol') && !cmd.includes('-mg')) return null;
            return this._formatCmdletExplanation(generalMatch[0], isCorrect, q);
        }
        return this._formatCmdletExplanation(cmdletMatch[1], isCorrect, q);
    },

    _formatCmdletExplanation(cmdlet, isCorrect, q) {
        const cmdletKey = cmdlet.toLowerCase();
        const correctAnswer = q.correctAnswers[0] ? q.correctAnswers[0].replace(/^[A-Z]\.\s*/, '').trim() : '';
        
        // Look up in dictionary
        const description = this.cmdletDB[cmdletKey];
        
        // Get correct answer's cmdlet info
        const correctCmdletMatch = correctAnswer.match(/(?:^|\b)([A-Z][a-z]+-(?:Az|AzureAD|AzureADMS|ADSync|Msol|Mg)[A-Za-z]*)/);
        let correctInfo = '';
        if (!isCorrect && correctCmdletMatch) {
            const correctDesc = this.cmdletDB[correctCmdletMatch[1] ? correctCmdletMatch[1].toLowerCase() : correctCmdletMatch[0].toLowerCase()];
            const correctName = correctCmdletMatch[1] || correctCmdletMatch[0];
            if (correctDesc) {
                correctInfo = `<br><br>✅ <b>Correct: ${correctName}</b> — ${correctDesc}`;
            } else {
                correctInfo = `<br><br>✅ <b>Correct: ${correctName}</b>`;
            }
        }

        if (description) {
            if (isCorrect) {
                return `<b>${cmdlet}</b> — ${description}<br><br>✅ This is the correct cmdlet for this scenario.`;
            } else {
                return `<b>${cmdlet}</b> — ${description}<br><br>❌ Wrong cmdlet for this requirement.${correctInfo}`;
            }
        }
        
        // Cmdlet found but not in dictionary — generate from verb-noun pattern
        const verb = cmdlet.split('-')[0].toLowerCase();
        const noun = cmdlet.split('-').slice(1).join('-');
        
        const verbMeanings = {
            'new': 'Creates a new resource/object',
            'set': 'Modifies/configures an existing resource',
            'get': 'Retrieves/reads information (read-only, no changes)',
            'remove': 'Permanently deletes a resource',
            'add': 'Adds an item to a collection or attaches a component',
            'update': 'Applies queued/pending changes to a resource',
            'start': 'Starts/triggers a process or resource',
            'stop': 'Stops/deallocates a running resource',
            'restart': 'Restarts a running resource',
            'move': 'Moves a resource between containers/scopes',
            'export': 'Exports configuration to a file/template',
            'import': 'Imports configuration from a file/source',
            'enable': 'Enables a feature, protection, or service',
            'disable': 'Disables a feature or service',
            'register': 'Registers a provider or resource type',
            'unregister': 'Unregisters a provider',
            'test': 'Validates without executing (dry-run/what-if)',
            'invoke': 'Executes an action or runs a command',
            'backup': 'Creates a backup copy',
            'restore': 'Restores from a backup/recovery point',
            'publish': 'Deploys/publishes content to a service',
            'switch': 'Swaps between two configurations (e.g., slots)',
            'save': 'Downloads/saves to local storage',
            'select': 'Sets the current working context',
            'grant': 'Grants permissions or access rights',
            'revoke': 'Revokes permissions or access rights',
            'connect': 'Establishes a connection to a service',
            'disconnect': 'Closes a connection',
            'lock': 'Applies a resource lock',
            'unlock': 'Removes a resource lock'
        };
        
        const verbDesc = verbMeanings[verb] || `Performs the "${verb}" operation on`;
        
        if (isCorrect) {
            return `<b>${cmdlet}</b> — ${verbDesc} ${noun}. This is the correct cmdlet for the scenario described.`;
        } else {
            return `<b>${cmdlet}</b> — ${verbDesc} ${noun}. This performs a different operation than what's required.${correctInfo}`;
        }
    },

    explainFromQuestionContext(q, optText, optLower, isCorrect) {
        const question = q.question.toLowerCase();
        const correctAnswer = q.correctAnswers[0] ? q.correctAnswers[0].replace(/^[A-Z]\.\s*/, '').trim() : '';
        
        // For numeric options or very short options — explain using the question context
        const isNumericOption = /^\d+$/.test(optLower.trim());
        const isShortOption = optLower.length < 30;
        
        if (!isNumericOption && !isShortOption) return null;

        // === MANAGEMENT GROUPS / HIERARCHY depth ===
        if (question.includes('management group') && question.includes('level') || question.includes('depth') || (question.includes('management group') && question.includes('how many'))) {
            if (isCorrect) return `<b>${optText}</b> is correct. Azure Management Groups support up to 6 levels of depth (not counting the root or subscription level). The hierarchy goes: Root > Level 1 > Level 2 > Level 3 > Level 4 > Level 5 > Level 6 > Subscriptions.`;
            return `<b>${optText}</b> is incorrect. Azure Management Groups have a maximum of 6 levels of depth below the root level. This value doesn't match the Azure platform limit.`;
        }

        // === SUBSCRIPTIONS per management group ===
        if (question.includes('management group') && question.includes('subscription')) {
            if (isCorrect) return `<b>${optText}</b> is correct. A subscription can only belong to ONE management group at a time, but a management group can contain many subscriptions.`;
            return `<b>${optText}</b> is incorrect for this management group/subscription relationship.`;
        }

        // === RESOURCE GROUPS limits ===
        if (question.includes('resource group') && (question.includes('how many') || question.includes('maximum') || question.includes('limit'))) {
            if (isCorrect) return `<b>${optText}</b> is correct. This is the Azure platform limit for this resource group operation/configuration.`;
            return `<b>${optText}</b> is incorrect — it doesn't match the documented Azure limit.`;
        }

        // === TAGS limits ===
        if (question.includes('tag') && (question.includes('how many') || question.includes('maximum') || question.includes('limit') || question.includes('number'))) {
            if (isCorrect) return `<b>${optText}</b> is correct. Azure resources, resource groups, and subscriptions can each have a maximum of 50 tag name-value pairs. Tag name max is 512 chars (128 for storage), tag value max is 256 chars.`;
            return `<b>${optText}</b> is incorrect. The Azure tag limit is 50 tags per resource/resource group/subscription.`;
        }

        // === AVAILABILITY SET: Fault Domains ===
        if (question.includes('fault domain') || question.includes('platformfaultdomaincount')) {
            if (isCorrect) return `<b>${optText}</b> is correct. Fault Domains (FDs) represent separate physical racks in a datacenter with independent power and networking. Azure regions support a maximum of 2 or 3 fault domains per availability set (region-dependent). This ensures VMs are distributed across racks to survive hardware failures.`;
            return `<b>${optText}</b> is incorrect. Azure Availability Sets support a maximum of 3 fault domains (2 in some regions). Each FD is a separate physical rack — setting this value wrong means less hardware failure protection.`;
        }

        // === AVAILABILITY SET: Update Domains ===
        if (question.includes('update domain') || question.includes('platformupdatedomaincount')) {
            if (isCorrect) return `<b>${optText}</b> is correct. Update Domains (UDs) determine how VMs are grouped for planned maintenance. Azure reboots only one UD at a time during updates. Maximum is 20 UDs per availability set (default is 5). More UDs = fewer VMs affected per maintenance wave.`;
            return `<b>${optText}</b> is incorrect. Update Domains range from 1-20 (default 5). The value should provide optimal distribution for the scenario described.`;
        }

        // === NSG rule limits ===
        if (question.includes('nsg') && (question.includes('rule') || question.includes('limit') || question.includes('maximum') || question.includes('priority'))) {
            if (question.includes('priority')) {
                if (isCorrect) return `<b>${optText}</b> is correct. NSG rule priorities range from 100 to 4096. Lower number = higher priority (evaluated first). The system reserves priorities below 100 and above 4096 for default rules.`;
                return `<b>${optText}</b> is incorrect for NSG rule priority. Valid range is 100-4096 (lower = evaluated first).`;
            }
            if (isCorrect) return `<b>${optText}</b> is correct. This matches the Azure platform limit for NSG rules.`;
            return `<b>${optText}</b> is incorrect — doesn't match the documented NSG limit.`;
        }

        // === VNET limits: subnets, peering ===
        if (question.includes('subnet') && (question.includes('how many') || question.includes('maximum') || question.includes('limit'))) {
            if (isCorrect) return `<b>${optText}</b> is correct. Azure VNets support this number of subnets per virtual network as a platform limit.`;
            return `<b>${optText}</b> doesn't match the Azure subnet limit.`;
        }
        if (question.includes('peering') && (question.includes('how many') || question.includes('maximum') || question.includes('limit'))) {
            if (isCorrect) return `<b>${optText}</b> is correct. Azure limits the number of VNet peerings per virtual network (default 500, can be increased).`;
            return `<b>${optText}</b> doesn't match the VNet peering limit.`;
        }

        // === IP address limits ===
        if (question.includes('ip address') && (question.includes('how many') || question.includes('maximum') || question.includes('limit'))) {
            if (isCorrect) return `<b>${optText}</b> is correct. This matches the Azure limit for IP addresses in this configuration.`;
            return `<b>${optText}</b> is incorrect for the IP address limit in this scenario.`;
        }

        // === LOAD BALANCER rules/pools ===
        if (question.includes('load balancer') && (question.includes('how many') || question.includes('maximum') || question.includes('rule') || question.includes('pool'))) {
            if (isCorrect) return `<b>${optText}</b> is correct. Standard Load Balancer supports up to 1000 backend pool instances, 500 LB rules, and multiple frontend IPs.`;
            return `<b>${optText}</b> doesn't match the Load Balancer platform limit for this configuration.`;
        }

        // === STORAGE: number of storage accounts per subscription ===
        if (question.includes('storage account') && (question.includes('how many') || question.includes('maximum') || question.includes('limit') || question.includes('per'))) {
            if (isCorrect) return `<b>${optText}</b> is correct. Azure allows up to 250 storage accounts per subscription per region (can be increased via support request).`;
            return `<b>${optText}</b> is incorrect. The default limit is 250 storage accounts per subscription per region.`;
        }

        // === BACKUP: retention, snapshots ===
        if (question.includes('backup') && (question.includes('retention') || question.includes('how many') || question.includes('maximum') || question.includes('day') || question.includes('point'))) {
            if (isCorrect) return `<b>${optText}</b> is correct. This matches the Azure Backup retention/recovery point limit for the described configuration.`;
            return `<b>${optText}</b> doesn't match the backup retention or recovery point limit.`;
        }

        // === GENERAL: "how many" / "maximum" / "minimum" questions with numeric answers ===
        if (isNumericOption && (question.includes('how many') || question.includes('maximum') || question.includes('minimum') || question.includes('at least') || question.includes('number of'))) {
            if (isCorrect) return `<b>${optText}</b> is the correct value. This is the documented Azure platform limit or required minimum for the scenario described in the question. Azure enforces these limits at the resource provider level.`;
            return `<b>${optText}</b> is incorrect. This doesn't match the Azure-documented value for this configuration. Azure has specific platform limits and minimums that must be memorized for the AZ-104 exam.`;
        }

        // === GENERAL: numeric with context about what the question asks ===
        if (isNumericOption) {
            // Extract what the question is actually asking about
            let topic = '';
            if (question.includes('virtual machine') || question.includes('vm')) topic = 'VMs/compute';
            else if (question.includes('storage')) topic = 'storage';
            else if (question.includes('network') || question.includes('vnet') || question.includes('subnet')) topic = 'networking';
            else if (question.includes('resource group')) topic = 'resource groups';
            else if (question.includes('subscription')) topic = 'subscriptions';
            else if (question.includes('policy')) topic = 'Azure Policy';
            else if (question.includes('user') || question.includes('group') || question.includes('role')) topic = 'identity/access';
            
            if (topic) {
                if (isCorrect) return `<b>${optText}</b> is correct for this ${topic} scenario. This value represents the correct Azure limit, count, or configuration parameter as documented by Microsoft.`;
                return `<b>${optText}</b> is incorrect for this ${topic} scenario. This value either exceeds the Azure limit, is below the required minimum, or simply doesn't match the documented behavior.`;
            }
        }

        // === Short text options that aren't numbers ===
        if (isShortOption && !isNumericOption) {
            // Try to explain based on what's in the question
            if (question.includes('which') || question.includes('what')) {
                if (isCorrect) return `<b>${optText}</b> is correct — this is the right value/setting for the scenario described. It matches the specific Azure configuration or parameter that satisfies the requirement.`;
                return `<b>${optText}</b> is incorrect for this scenario. While it may be a valid Azure value in other contexts, it doesn't match what's needed for the specific requirement described in the question.`;
            }
        }

        return null;
    },

    getTechExplanation(optLower, isCorrect, question) {
        // Analyze keywords in the option to provide technical context
        const concepts = [];
        
        if (optLower.includes('powershell') || optLower.includes('az ')) concepts.push('PowerShell/Azure CLI command');
        if (optLower.includes('portal')) concepts.push('Azure Portal GUI action');
        if (optLower.includes('cli') || optLower.includes('az ')) concepts.push('Azure CLI');
        if (optLower.includes('resource group')) concepts.push('Resource Group (logical container for related resources)');
        if (optLower.includes('subscription')) concepts.push('Subscription (billing and access boundary)');
        if (optLower.includes('management group')) concepts.push('Management Group (container above subscriptions for governance)');
        if (optLower.includes('managed identity')) concepts.push('Managed Identity (auto-managed credentials for Azure-to-Azure auth)');
        if (optLower.includes('service principal')) concepts.push('Service Principal (app identity for programmatic access)');
        if (optLower.includes('access key')) concepts.push('Access Key (shared key for storage authentication — full access)');
        if (optLower.includes('sas') || optLower.includes('shared access signature')) concepts.push('SAS (time-limited, permission-scoped access token)');
        if (optLower.includes('private endpoint')) concepts.push('Private Endpoint (private IP in your VNet for Azure service)');
        if (optLower.includes('service endpoint')) concepts.push('Service Endpoint (optimized route from VNet to Azure service, still public IP)');
        if (optLower.includes('custom script extension')) concepts.push('Custom Script Extension (downloads and runs scripts on Azure VMs post-deploy)');
        if (optLower.includes('desired state configuration') || optLower.includes('dsc')) concepts.push('DSC (declarative config management ensuring VMs stay in desired state)');
        if (optLower.includes('runbook') || optLower.includes('automation account')) concepts.push('Azure Automation (scheduled/triggered scripts and runbooks)');
        if (optLower.includes('logic app')) concepts.push('Logic App (serverless workflow with 400+ connectors)');
        if (optLower.includes('function app') || optLower.includes('azure function')) concepts.push('Azure Function (serverless compute triggered by events)');
        if (optLower.includes('event grid')) concepts.push('Event Grid (reactive event routing from Azure services)');
        if (optLower.includes('event hub')) concepts.push('Event Hub (big data streaming/telemetry ingestion)');
        if (optLower.includes('service bus')) concepts.push('Service Bus (enterprise message broker with queues/topics)');
        if (optLower.includes('azure ad') || optLower.includes('entra')) concepts.push('Azure AD/Entra ID (cloud identity platform)');
        if (optLower.includes('network watcher')) concepts.push('Network Watcher (network monitoring and diagnostic tools)');
        if (optLower.includes('ip flow verify')) concepts.push('IP Flow Verify (checks if packet is allowed/denied by NSG rules)');
        if (optLower.includes('connection monitor')) concepts.push('Connection Monitor (continuous network connectivity testing)');
        if (optLower.includes('nsg flow log')) concepts.push('NSG Flow Logs (records all IP traffic through NSGs)');
        if (optLower.includes('azure bastion')) concepts.push('Azure Bastion (secure RDP/SSH without public IP on VM)');
        if (optLower.includes('just-in-time') || optLower.includes('jit')) concepts.push('JIT VM Access (time-limited, approved port opening via Defender for Cloud)');
        
        if (concepts.length > 0) {
            const conceptStr = concepts.join('; ');
            if (isCorrect) {
                return `<b>Concepts:</b> ${conceptStr}. This is the correct approach because it uses the right tool/service that directly satisfies the specific requirement in the question.`;
            } else {
                return `<b>Concepts:</b> ${conceptStr}. While this is a valid Azure tool/service, it doesn't address the specific requirement. The correct answer uses a different service or approach that better fits what's being asked.`;
            }
        }
        
        return null;
    },

    explainCorrectAnswer(q) {
        const question = q.question.toLowerCase();
        const answer = q.correctAnswers.join(' ').toLowerCase();
        const correctText = q.correctAnswers[0] ? q.correctAnswers[0].replace(/^[A-Z]\.\s*/, '').trim() : '';
        
        if (answer.includes('yes')) return "The proposed solution correctly satisfies ALL requirements: it uses the right service, at the right scope, with the right configuration to achieve the stated goal.";
        if (answer.includes('no')) return "The proposed solution FAILS to meet the goal because it either: uses the wrong service/feature, operates at the wrong scope (subscription vs resource group vs resource), is missing required steps, or the described feature doesn't work the way the question implies.";
        
        // Try to give context about WHY this specific answer is correct
        const topicInfo = TOPICS[q.topic];
        const domain = topicInfo ? topicInfo.name : 'Azure Administration';
        
        if (question.includes('minimum') || question.includes('at least'))
            return `<b>${correctText}</b> is the minimum required value. Azure requires at least this number/configuration for the scenario to function correctly in the ${domain} domain.`;
        if (question.includes('maximum') || question.includes('limit'))
            return `<b>${correctText}</b> is the platform limit. Azure enforces this as the maximum for this configuration in the ${domain} area.`;
        if (question.includes('how many'))
            return `<b>${correctText}</b> is the correct count. Based on Azure's documented limits and behavior for ${domain}, this is the accurate number.`;
        if (question.includes('which command') || question.includes('which cmdlet') || question.includes('powershell'))
            return `<b>${correctText}</b> is the correct command/cmdlet. It performs the exact operation needed with the right parameters for this requirement.`;
        if (question.includes('which tool') || question.includes('which service'))
            return `<b>${correctText}</b> is the right tool/service. It's specifically designed for this use case in the ${domain} domain.`;
            
        return `<b>${correctText}</b> is correct — it directly satisfies the requirement by using the appropriate Azure capability for the ${domain} domain.`;
    },

    explainWhyWrong(q, optText, question) {
        const opt = optText.toLowerCase();
        const correctText = q.correctAnswers[0] ? q.correctAnswers[0].replace(/^[A-Z]\.\s*/, '').trim() : '';
        
        if (opt === 'yes' && q.correctAnswers.some(a => a.toLowerCase().includes('no'))) {
            return "Incorrect — this solution FAILS to meet the goal. It either uses the wrong service, wrong scope, missing steps, or the feature doesn't provide the specific capability required.";
        }
        if (opt === 'no' && q.correctAnswers.some(a => a.toLowerCase().includes('yes'))) {
            return "Incorrect — this solution actually DOES work. The described approach correctly uses the right Azure service/feature to achieve all stated requirements.";
        }
        
        // Provide specific "why not this one" based on comparison to correct answer
        if (question.includes('minimum') || question.includes('at least')) {
            return `<b>${optText}</b> is incorrect. The correct minimum is <b>${correctText}</b>. This value is either too high (unnecessary over-provisioning) or too low (doesn't meet the requirement).`;
        }
        if (question.includes('maximum') || question.includes('limit') || question.includes('how many')) {
            return `<b>${optText}</b> is incorrect. The correct answer is <b>${correctText}</b>. This value doesn't match Azure's documented limit or required configuration.`;
        }
        
        // Analyze why it might be wrong based on common patterns
        if (opt.includes('powershell') || opt.includes('cli') || opt.includes('az ')) {
            return `<b>${optText}</b> — this command/tool exists but either targets the wrong resource type, uses incorrect parameters, or performs the wrong operation. The correct approach is <b>${correctText}</b>.`;
        }
        if (opt.includes('portal') || opt.includes('blade') || opt.includes('navigate')) {
            return `<b>${optText}</b> — this Azure Portal path exists but either leads to the wrong setting or doesn't provide the capability needed. The correct approach is <b>${correctText}</b>.`;
        }
        
        return `<b>${optText}</b> — while this is a valid Azure option, it doesn't satisfy the specific requirement here. The correct answer is <b>${correctText}</b> which directly addresses the scenario.`;
    },

    prevQuestion() {
        if (this.currentQuestionIndex > 0) {
            this.currentQuestionIndex--;
            this.renderQuestion();
        }
    },

    nextQuestion() {
        if (this.currentQuestionIndex < this.filteredQuestions.length - 1) {
            this.currentQuestionIndex++;
            this.renderQuestion();
        }
    },

    randomQuestion() {
        this.currentQuestionIndex = Math.floor(Math.random() * this.filteredQuestions.length);
        this.renderQuestion();
    },

    gotoQuestion() {
        const input = document.getElementById('question-search');
        const num = parseInt(input.value);
        if (!num || num < 1 || num > this.questions.length) {
            input.style.borderColor = 'var(--danger)';
            setTimeout(() => input.style.borderColor = '', 1000);
            return;
        }
        // Apply current topic filter but reset status filter
        const topic = document.getElementById('topic-filter').value;
        document.getElementById('status-filter').value = 'all';
        
        if (topic === 'all') {
            this.filteredQuestions = [...this.questions];
        } else {
            this.filteredQuestions = this.questions.filter(q => q.topic === topic);
        }
        
        // Find by question id within filtered set
        const idx = this.filteredQuestions.findIndex(q => q.id === num);
        if (idx !== -1) {
            this.currentQuestionIndex = idx;
            this.renderQuestion();
            input.value = '';
        } else {
            // Question exists but not in this topic
            input.style.borderColor = 'var(--warning)';
            input.placeholder = 'Not in this topic';
            setTimeout(() => {
                input.style.borderColor = '';
                input.placeholder = 'Go to Q#';
            }, 1500);
        }
    },

    // === Flashcards (Based on Microsoft Learn Concepts) ===
    setupFlashcards() {
        this.allFlashcards = [];
        for (const [topic, cards] of Object.entries(FLASHCARDS)) {
            cards.forEach(card => {
                this.allFlashcards.push({ ...card, topic });
            });
        }
        this.flashcardDeck = [...this.allFlashcards];
        this.currentFlashcardIndex = 0;

        document.getElementById('btn-fc-prev').addEventListener('click', () => this.prevFlashcard());
        document.getElementById('btn-fc-next').addEventListener('click', () => this.nextFlashcard());
        document.getElementById('btn-shuffle').addEventListener('click', () => this.shuffleFlashcards());
        document.getElementById('btn-fc-easy').addEventListener('click', () => this.rateFlashcard('easy'));
        document.getElementById('btn-fc-medium').addEventListener('click', () => this.rateFlashcard('medium'));
        document.getElementById('btn-fc-hard').addEventListener('click', () => this.rateFlashcard('hard'));
        document.getElementById('flashcard-topic-filter').addEventListener('change', () => this.filterFlashcards());
        this.renderFlashcard();
    },

    filterFlashcards() {
        const topic = document.getElementById('flashcard-topic-filter').value;
        this.flashcardDeck = topic === 'all' 
            ? [...this.allFlashcards] 
            : this.allFlashcards.filter(c => c.topic === topic);
        this.currentFlashcardIndex = 0;
        this.renderFlashcard();
    },

    flipCard() {
        document.getElementById('flashcard').classList.toggle('flipped');
    },

    renderFlashcard() {
        if (this.flashcardDeck.length === 0) return;
        
        const card = this.flashcardDeck[this.currentFlashcardIndex];
        const topicInfo = TOPICS[card.topic];
        document.getElementById('flashcard').classList.remove('flipped');
        document.getElementById('flashcard-front').innerHTML = `
            <div style="width:100%">
                <div style="margin-bottom:12px;font-size:11px;padding:3px 10px;display:inline-block;border-radius:12px;background:${topicInfo.color}20;color:${topicInfo.color};font-weight:600;">${topicInfo.name}</div>
                <p style="font-size:18px;font-weight:600;">${card.front}</p>
            </div>`;
        document.getElementById('flashcard-back').innerHTML = `
            <div style="width:100%;text-align:left;white-space:pre-line;font-size:14px;line-height:1.8;">${card.back}</div>`;
        document.getElementById('flashcard-counter').textContent = 
            `${this.currentFlashcardIndex + 1} / ${this.flashcardDeck.length}`;
    },

    prevFlashcard() {
        if (this.currentFlashcardIndex > 0) {
            this.currentFlashcardIndex--;
            this.renderFlashcard();
        }
    },

    nextFlashcard() {
        if (this.currentFlashcardIndex < this.flashcardDeck.length - 1) {
            this.currentFlashcardIndex++;
            this.renderFlashcard();
        }
    },

    shuffleFlashcards() {
        for (let i = this.flashcardDeck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.flashcardDeck[i], this.flashcardDeck[j]] = [this.flashcardDeck[j], this.flashcardDeck[i]];
        }
        this.currentFlashcardIndex = 0;
        this.renderFlashcard();
    },

    rateFlashcard(difficulty) {
        // Move to next card after rating
        this.nextFlashcard();
    },

    // === Topic Analysis ===
    setupTopicAnalysis() {
        const container = document.getElementById('topic-analysis');
        container.innerHTML = '';

        const totalQuestions = this.questions.length;
        const colors = { identity: '#6366f1', storage: '#06b6d4', compute: '#f59e0b', networking: '#10b981', monitor: '#ec4899' };

        // Sort topics by question count (descending) - more questions = more focus needed
        const topicEntries = Object.entries(TOPICS).map(([key, topic]) => {
            const questions = this.classifiedQuestions[key] || [];
            const attempted = questions.filter(q => this.progress[q.id]).length;
            const correct = questions.filter(q => this.progress[q.id]?.correct).length;
            return { key, topic, questions, attempted, correct };
        }).sort((a, b) => b.questions.length - a.questions.length);

        topicEntries.forEach(({ key, topic, questions, attempted, correct }, index) => {
            const count = questions.length;
            const pct = Math.round((count / totalQuestions) * 100);
            const accuracy = attempted > 0 ? Math.round((correct / attempted) * 100) : 0;
            const completionPct = Math.round((attempted / count) * 100);
            
            // Priority based on: more questions + lower accuracy = higher priority
            let priority = 'low';
            let priorityLabel = 'On Track';
            if (attempted === 0 || accuracy < 50) {
                priority = 'high';
                priorityLabel = 'Needs Focus';
            } else if (accuracy < 75) {
                priority = 'medium';
                priorityLabel = 'Review';
            }

            container.innerHTML += `
                <div class="topic-card">
                    <div class="topic-card-header">
                        <h3 style="color:${colors[key]}">${topic.name}</h3>
                        <span class="count">${count} questions (${pct}% of exam)</span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width:${completionPct}%;background:${colors[key]}"></div>
                    </div>
                    <div class="topic-stats">
                        <span>📊 ${attempted}/${count} attempted</span>
                        <span>✅ ${accuracy}% accuracy</span>
                        <span>📈 ${completionPct}% complete</span>
                        <span class="priority-badge priority-${priority}">${priorityLabel}</span>
                    </div>
                </div>
            `;
        });
    },

    // === Notes ===
    setupNotes() {
        const nav = document.getElementById('notes-nav');
        nav.innerHTML = '';

        for (const [key, notes] of Object.entries(STUDY_NOTES)) {
            nav.innerHTML += `<li><a href="#" data-topic="${key}" ${key === this.currentNoteTopic ? 'class="active"' : ''}>${notes.title}</a></li>`;
        }

        nav.querySelectorAll('a').forEach(a => {
            a.addEventListener('click', (e) => {
                e.preventDefault();
                nav.querySelectorAll('a').forEach(l => l.classList.remove('active'));
                a.classList.add('active');
                this.currentNoteTopic = a.dataset.topic;
                this.renderNotes();
            });
        });

        this.renderNotes();
    },

    renderNotes() {
        const notes = STUDY_NOTES[this.currentNoteTopic];
        if (!notes) return;

        const content = document.getElementById('notes-content');
        content.innerHTML = `<h3>${notes.title}</h3>` + 
            notes.sections.map(s => `<h4>${s.heading}</h4>${s.content}`).join('');
    }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => app.init());
