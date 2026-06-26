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
        this.renderQuestion();
    },

    renderQuestion() {
        if (this.filteredQuestions.length === 0) {
            document.getElementById('question-card').innerHTML = '<p style="text-align:center;color:var(--text-secondary);">No questions match your filters.</p>';
            document.getElementById('question-counter').textContent = '0 / 0';
            return;
        }

        const q = this.filteredQuestions[this.currentQuestionIndex];
        const topicInfo = TOPICS[q.topic];

        document.getElementById('question-counter').textContent = 
            `${this.currentQuestionIndex + 1} / ${this.filteredQuestions.length}`;
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
            <div class="answer-explanation">
                <strong>📖 Explanation:</strong><br>${explanation}
            </div>
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
        document.getElementById('answer-reveal').innerHTML = `
            <div class="answer-correct">
                <strong>Correct Answer:</strong> ${q.correctAnswers.join(', ')}
            </div>
            <div class="answer-explanation">
                <strong>📖 Explanation:</strong><br>${explanation}
            </div>
        `;

        document.getElementById('btn-check').classList.add('hidden');
        document.getElementById('btn-reveal').classList.add('hidden');
    },

    getExplanation(q) {
        const question = q.question.toLowerCase();
        const answer = q.correctAnswers.join(' ').toLowerCase();
        
        // Match explanations based on question content patterns
        if (answer.includes('tag')) {
            return "Tags are name-value pairs that allow you to categorize and organize Azure resources. They can be applied to resources, resource groups, and subscriptions to logically organize them by categories such as department, environment, or cost center.";
        }
        if (question.includes('conditional access') && answer.includes('grant control')) {
            return "The grant control in a Conditional Access policy is where you configure requirements like MFA, compliant device, or Azure AD-joined device. Session controls manage the experience after sign-in, not the authentication requirements.";
        }
        if (question.includes('conditional access') && answer.includes('no')) {
            return "Conditional Access policies are the recommended way to enforce MFA and device requirements based on conditions like location. The multi-factor authentication page user settings and session controls alone don't provide the combined location-based + device-based + MFA requirements needed.";
        }
        if (question.includes('multi-factor authentication') && question.includes('usage model')) {
            if (answer.includes('new') || answer.includes('create')) {
                return "Once a Multi-Factor Authentication provider is created, the usage model (Per Authentication or Per Enabled User) cannot be changed. You must create a new provider with the desired usage model and migrate/backup data from the existing one.";
            }
            return "The usage model for an MFA provider cannot be changed after creation through the portal or CLI. A new provider must be created with the correct usage model.";
        }
        if (question.includes('dirsync') || question.includes('ad connect') || question.includes('adsync')) {
            if (answer.includes('delta')) {
                return "Running Start-ADSyncSyncCycle -PolicyType Delta performs a delta sync which only processes changes since the last sync cycle. This is the fastest way to replicate a new user to Azure AD immediately.";
            }
            if (answer.includes('initial')) {
                return "An Initial sync processes ALL objects and is time-consuming. For immediate replication of a new user, a Delta sync (Start-ADSyncSyncCycle -PolicyType Delta) is the correct approach as it only syncs changes.";
            }
            return "Azure AD Connect sync cycles handle replication between on-premises AD and Azure AD. Delta sync processes only changes, while Initial sync processes everything. Using Active Directory Sites and Services or restarting NetLogon handles on-premises AD replication, not Azure AD sync.";
        }
        if (question.includes('redundancy') || question.includes('geo-redundant') || question.includes('ra-grs')) {
            return "Read-Access Geo-Redundant Storage (RA-GRS) stores data across multiple nodes in separate geographic locations AND allows read access from the secondary region. Standard GRS replicates to a secondary region but doesn't allow read access until failover.";
        }
        if (question.includes('arm template') && question.includes('review')) {
            if (answer.includes('resource group')) {
                return "ARM template deployments are tracked at the Resource Group level. You can view deployment history, including the templates used, by navigating to the Resource Group blade → Deployments section.";
            }
            return "To review ARM templates used for deployments, check the Resource Group's Deployments blade where all deployment history and templates are stored.";
        }
        if (question.includes('availability set') && question.includes('resize')) {
            return "When you get an allocation failure resizing a VM in an availability set, you must stop (deallocate) ALL VMs in the availability set. This is because all VMs in an availability set must be allocated from the same hardware cluster.";
        }
        if (question.includes('fault domain') || question.includes('platformfaultdomaincount')) {
            return "The platformFaultDomainCount should be set to the maximum value (2 or 3 depending on region) to ensure VMs are distributed across as many fault domains as possible, providing maximum protection against hardware failures.";
        }
        if (question.includes('update domain') || question.includes('platformupdatedomaincount')) {
            return "The platformUpdateDomainCount can be set up to 20 (the maximum). Setting it to the maximum value ensures VMs are distributed across as many update domains as possible, minimizing the impact of planned maintenance.";
        }
        if (question.includes('key vault') || question.includes('password') && question.includes('plain text')) {
            return "Azure Key Vault is designed to store secrets, keys, and certificates securely. When using ARM templates, you can reference Key Vault secrets as parameters to avoid storing sensitive data in plain text.";
        }
        if (question.includes('virtual network') && question.includes('peering')) {
            return "VNet peering allows virtual networks to communicate using Azure's backbone network. It's non-transitive — if VNet A peers with VNet B, and VNet B peers with VNet C, VNet A cannot communicate with VNet C unless directly peered.";
        }
        if (question.includes('nsg') || question.includes('network security group')) {
            return "Network Security Groups filter traffic using priority-based rules (lower number = higher priority). They can be associated to subnets or NICs. NSGs are stateful — if inbound traffic is allowed, return traffic is automatically permitted.";
        }
        if (question.includes('load balancer')) {
            return "Azure Load Balancer operates at Layer 4 (TCP/UDP). Use Standard SKU for production workloads as it provides an SLA, zone redundancy, and more features than Basic. Health probes determine backend pool member availability.";
        }
        if (question.includes('azure monitor') || question.includes('alert') || question.includes('diagnostic')) {
            return "Azure Monitor collects metrics (numeric time-series data) and logs (structured data) from Azure resources. Alerts can be configured on metrics, logs, or activity log events, with action groups defining the notification/automation response.";
        }
        if (question.includes('backup') || question.includes('recovery services')) {
            return "Azure Backup uses Recovery Services vaults to store backup data. The vault must be in the same region as the protected resource. Backup policies define the schedule and retention period for backups.";
        }
        if (question.includes('app service') || question.includes('web app')) {
            return "Azure App Service is a fully managed platform for hosting web apps. Deployment slots (Standard tier+) allow zero-downtime deployments by swapping slots. Auto-scale rules can be based on metrics like CPU usage.";
        }
        if (question.includes('container') || question.includes('aci') || question.includes('kubernetes') || question.includes('aks')) {
            return "Azure Container Instances (ACI) provides serverless containers for quick deployments. AKS is a managed Kubernetes service for orchestrating containers at scale. ACI is ideal for burst workloads; AKS for long-running production workloads.";
        }
        if (question.includes('dns') && !question.includes('dirsync')) {
            return "Azure DNS supports both public zones (internet-facing resolution) and private zones (VNet-internal resolution). Common record types: A (IPv4), AAAA (IPv6), CNAME (alias to another domain), MX (mail exchange), TXT (verification).";
        }
        if (question.includes('vpn') || question.includes('expressroute')) {
            return "VPN Gateway provides encrypted tunnels over the public internet (Site-to-Site, Point-to-Site). ExpressRoute provides private connectivity to Azure through a connectivity provider, offering higher reliability, faster speeds, and lower latencies.";
        }
        if (question.includes('storage account') || question.includes('blob') || question.includes('access tier')) {
            return "Azure Storage accounts support multiple redundancy options and access tiers. Hot tier is for frequently accessed data, Cool for 30+ day storage, Cold for 90+ days, and Archive for 180+ days (offline, requires rehydration).";
        }
        if (question.includes('azure ad') || question.includes('active directory')) {
            return "Azure Active Directory (now Microsoft Entra ID) is Microsoft's cloud-based identity and access management service. It supports user/group management, conditional access, RBAC, and hybrid identity with on-premises AD sync.";
        }
        if (question.includes('policy') && (question.includes('azure') || question.includes('governance'))) {
            return "Azure Policy evaluates resources for compliance with business rules. Policies can audit, deny, or modify resources. Policy initiatives group multiple policies together. Effects include Deny, Audit, DeployIfNotExists, and Modify.";
        }
        if (question.includes('rbac') || question.includes('role')) {
            return "RBAC provides fine-grained access management. Roles are assigned at a scope (management group, subscription, resource group, or resource). The built-in Owner role has full access including role assignment; Contributor has full access except role assignment.";
        }
        if (question.includes('virtual machine') || question.includes('vm')) {
            return "Azure Virtual Machines can be protected using Availability Sets (fault/update domains within a datacenter) or Availability Zones (separate physical locations within a region). Scale Sets enable auto-scaling of identical VMs.";
        }

        // Default explanation based on topic
        const topicInfo = TOPICS[q.topic];
        if (topicInfo) {
            return `This question relates to the "${topicInfo.name}" domain of the AZ-104 exam. The correct answer is based on Azure best practices and service capabilities for this topic area. Review the Study Notes section for more details on this topic.`;
        }
        return "Review the correct answer and consult the Study Notes section for detailed explanations on this topic area.";
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
