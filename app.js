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
        document.getElementById('btn-goto').addEventListener('click', () => this.gotoQuestion());
        document.getElementById('question-search').addEventListener('keydown', (e) => {
            if (e.key === 'Enter') this.gotoQuestion();
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
        this.renderQuestion();
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
        document.getElementById('answer-reveal').innerHTML = `
            <div class="answer-correct">
                <strong>Correct Answer:</strong> ${q.correctAnswers.join(', ')}
            </div>
            ${explanation}
        `;

        document.getElementById('btn-check').classList.add('hidden');
        document.getElementById('btn-reveal').classList.add('hidden');
    },

    getExplanation(q) {
        const correctSet = new Set(q.correctAnswers.map(a => a.trim()));
        const options = q.options || [];
        
        // Build per-option breakdown
        let html = '<div class="explanation-header">Option Breakdown:</div>';
        
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
        } else {
            // Image-based / no options
            html += `<div class="option-explanation option-correct">
                <strong>✅ ${q.correctAnswers.join(', ')}</strong>
                ${this.explainCorrectAnswer(q)}
            </div>`;
        }
        
        return html;
    },

    explainOption(q, option, isCorrect) {
        const question = q.question.toLowerCase();
        const opt = option.toLowerCase();
        const answer = q.correctAnswers.join(' ').toLowerCase();

        // Extract the option letter and text
        const optText = option.replace(/^[A-Z]\.\s*/, '').trim();
        const optLower = optText.toLowerCase();

        // === IDENTITY & ACCESS MANAGEMENT ===
        if (question.includes('tag')) {
            if (isCorrect) return "Tags are name-value pairs that let you categorize and organize Azure resources by department, environment, cost center, etc. They can be applied to resources, resource groups, and subscriptions without requiring resource moves.";
            if (optLower.includes('management group')) return "Management Groups organize subscriptions for governance (policy, RBAC inheritance). They don't associate individual VMs with departments — they manage subscription-level hierarchy.";
            if (optLower.includes('resource group')) return "Moving VMs into separate resource groups by department is possible but unnecessary and disruptive. Tags achieve the same organizational goal without restructuring resources.";
            if (optLower.includes('settings') || optLower.includes('modify')) return "VM settings control compute/networking/disk configurations, not organizational metadata. There's no built-in 'department' setting on a VM.";
        }

        if (question.includes('conditional access')) {
            if (optLower.includes('multi-factor authentication page') || optLower.includes('user settings')) {
                if (isCorrect) return "This is the correct approach for the given scenario.";
                return "The MFA user settings page enables/disables MFA per user but cannot enforce device requirements or location-based conditions. Conditional Access policies are needed for combining multiple conditions.";
            }
            if (optLower.includes('session control')) {
                if (isCorrect) return "This is the correct approach for the given scenario.";
                return "Session controls manage what happens AFTER sign-in (e.g., app-enforced restrictions, sign-in frequency). They don't enforce authentication requirements like MFA or device compliance at sign-in time.";
            }
            if (optLower.includes('grant control') || optLower.includes('conditional access')) {
                if (isCorrect) return "Conditional Access grant controls let you require MFA AND compliant/Azure AD-joined devices simultaneously, with conditions for location (trusted/untrusted). This combines all the requirements in one policy.";
                return "This approach addresses part of the requirement but may not fully satisfy all conditions specified.";
            }
        }

        if (question.includes('ad connect') || question.includes('adsync') || question.includes('dirsync') || question.includes('sync')) {
            if (optLower.includes('delta')) {
                if (isCorrect) return "Delta sync (Start-ADSyncSyncCycle -PolicyType Delta) processes only changes since the last cycle. It's the fastest way to push a newly created user to Azure AD immediately without waiting for the 30-minute automatic cycle.";
                return "Delta sync handles changes but may not be what's needed in this specific scenario.";
            }
            if (optLower.includes('initial') || optLower.includes('full')) {
                if (isCorrect) return "An initial/full sync is required in this scenario to process all objects correctly.";
                return "A full/initial sync reprocesses ALL objects, which is slow and unnecessary when you only need to sync a single new user. Delta sync is more efficient for individual changes.";
            }
            if (optLower.includes('sites and services') || optLower.includes('active directory sites')) {
                return "Active Directory Sites and Services manages on-premises AD replication between domain controllers, not Azure AD Connect synchronization. It has no effect on cloud sync.";
            }
            if (optLower.includes('netlogon') || optLower.includes('restart')) {
                return "Restarting the NetLogon service handles domain authentication and DC locator, not Azure AD sync. It's irrelevant to Azure AD Connect operations.";
            }
        }

        if (question.includes('rbac') || question.includes('role-based') || (question.includes('role') && question.includes('assign'))) {
            if (optLower.includes('owner')) {
                if (isCorrect) return "The Owner role grants full access to all resources including the ability to assign roles to others via RBAC. It's the most privileged built-in role.";
                return "Owner is too permissive for this scenario — it grants full access including role assignment, which violates the principle of least privilege.";
            }
            if (optLower.includes('contributor')) {
                if (isCorrect) return "Contributor grants full access to manage all resources but cannot assign roles or manage access in Azure RBAC. It's appropriate when resource management is needed without access management.";
                return "Contributor can manage resources but CANNOT assign roles to others. If role assignment is needed, a different role like Owner or User Access Administrator is required.";
            }
            if (optLower.includes('reader')) {
                if (isCorrect) return "Reader allows viewing all resources but cannot make any changes. Appropriate for audit/monitoring scenarios.";
                return "Reader is read-only and cannot create, modify, or delete any resources. It's insufficient when management actions are required.";
            }
            if (optLower.includes('user access administrator')) {
                if (isCorrect) return "User Access Administrator can manage user access to Azure resources (assign roles) without managing the resources themselves.";
                return "User Access Administrator only manages role assignments, not resource operations. It doesn't grant the ability to create or modify resources.";
            }
        }

        // === STORAGE ===
        if (question.includes('redundancy') || question.includes('geo-redundant') || question.includes('ra-grs') || question.includes('replication')) {
            if (optLower.includes('ra-grs') || optLower.includes('read-access geo')) {
                if (isCorrect) return "RA-GRS replicates data to a secondary region AND allows read access from that secondary. This provides both disaster recovery and read availability from the secondary endpoint.";
                return "RA-GRS provides maximum redundancy with secondary read access, but may exceed the requirements or cost constraints of this scenario.";
            }
            if (optLower.includes('lrs') || optLower.includes('locally-redundant')) {
                if (isCorrect) return "LRS stores 3 copies within a single datacenter. It's the lowest cost option and suitable when cross-region redundancy isn't required.";
                return "LRS only replicates within a single datacenter. It doesn't protect against datacenter-level or regional failures — inadequate for geo-redundancy requirements.";
            }
            if (optLower.includes('grs') && !optLower.includes('ra-grs') && !optLower.includes('read-access')) {
                if (isCorrect) return "GRS replicates to a secondary region for disaster recovery, but read access to secondary is only available after Microsoft initiates a failover.";
                return "Standard GRS replicates to a secondary region but doesn't allow read access until a failover occurs. If read access from the secondary is needed, RA-GRS is required.";
            }
            if (optLower.includes('zrs') || optLower.includes('zone-redundant')) {
                if (isCorrect) return "ZRS replicates across 3 availability zones within a single region, protecting against zone-level failures while keeping data in-region.";
                return "ZRS provides high availability within a single region across availability zones, but doesn't replicate to a secondary geographic region for disaster recovery.";
            }
        }

        if (question.includes('access tier') || question.includes('blob') && question.includes('tier')) {
            if (optLower.includes('hot')) {
                if (isCorrect) return "Hot tier is optimized for frequently accessed data. Highest storage cost but lowest access cost.";
                return "Hot tier has the highest storage costs. It's not cost-effective for data accessed infrequently (30+ days between accesses).";
            }
            if (optLower.includes('cool')) {
                if (isCorrect) return "Cool tier is optimized for data stored at least 30 days. Lower storage cost than Hot, higher access cost. Good for short-term backup and older data.";
                return "Cool tier requires a minimum 30-day retention. Data deleted before 30 days incurs early deletion charges.";
            }
            if (optLower.includes('archive')) {
                if (isCorrect) return "Archive tier has the lowest storage cost but data is offline. Retrieval requires rehydration (hours to days). Ideal for long-term retention with rare access.";
                return "Archive tier stores data offline — it cannot be read or modified until rehydrated to Hot or Cool tier, which takes hours. Not suitable for data needing immediate access.";
            }
        }

        // === COMPUTE ===
        if (question.includes('availability set')) {
            if (optLower.includes('stop') || optLower.includes('deallocate')) {
                if (isCorrect) return "All VMs in an availability set share the same hardware cluster. To resize, you must deallocate ALL VMs so Azure can reallocate them to a cluster that supports the new size.";
                return "Stopping VMs releases compute resources but may not address the specific requirement in this scenario.";
            }
            if (optLower.includes('fault domain')) {
                if (isCorrect) return "Fault domains protect against hardware failures (shared power/network). Setting this correctly ensures VMs are distributed across physical racks.";
                return "Fault domains handle hardware failure isolation, not the resize allocation issue. The cluster constraint requires deallocation.";
            }
        }

        if (question.includes('arm template') || question.includes('azure resource manager')) {
            if (optLower.includes('resource group') && (optLower.includes('deployment') || question.includes('review'))) {
                if (isCorrect) return "ARM deployments are tracked per Resource Group. The Deployments blade shows full history including the template JSON, parameters, inputs, and outputs for each deployment.";
                return "While resource groups track deployments, this option may not fully address the specific requirement.";
            }
            if (optLower.includes('key vault') || optLower.includes('secret')) {
                if (isCorrect) return "Key Vault references in ARM templates allow you to pass secrets securely as parameters without storing them in plain text in template files or parameter files.";
                return "Key Vault stores secrets but doesn't directly solve the template review/deployment tracking question.";
            }
        }

        if (question.includes('app service') || question.includes('web app')) {
            if (optLower.includes('deployment slot')) {
                if (isCorrect) return "Deployment slots (Standard tier+) allow deploying to a staging environment and swapping to production with zero downtime. Slot settings can be made 'sticky' to stay with the slot.";
                return "Deployment slots require Standard tier or above. They're for zero-downtime deployments, not for the specific requirement in this scenario.";
            }
            if (optLower.includes('scale')) {
                if (isCorrect) return "Auto-scale allows you to automatically adjust the number of instances based on metrics like CPU percentage, memory, or custom metrics.";
                return "Scaling adjusts capacity but doesn't address the specific deployment or configuration requirement.";
            }
        }

        // === NETWORKING ===
        if (question.includes('peering') || question.includes('virtual network') && question.includes('connect')) {
            if (optLower.includes('peering')) {
                if (isCorrect) return "VNet peering provides low-latency, high-bandwidth connectivity using Azure's backbone. It's non-transitive: peered VNets can communicate, but their peers cannot without direct peering.";
                return "Peering connects VNets but is non-transitive. Traffic doesn't flow through a peered network to reach a third network without additional configuration.";
            }
            if (optLower.includes('gateway') || optLower.includes('vpn')) {
                if (isCorrect) return "A VPN gateway enables encrypted tunnel connectivity between networks, useful for cross-region or hybrid scenarios.";
                return "VPN gateways add complexity and latency. For VNet-to-VNet within Azure, peering is simpler and provides better performance without encryption overhead.";
            }
        }

        if (question.includes('nsg') || question.includes('network security group')) {
            if (optLower.includes('priority') || optLower.includes('rule')) {
                if (isCorrect) return "NSG rules are evaluated by priority (lower number = higher priority, range 100-4096). The first matching rule wins. Both inbound and outbound rules are processed independently.";
                return "NSG rule priority determines evaluation order. A lower priority number means the rule is evaluated earlier and takes precedence.";
            }
            if (optLower.includes('subnet') || optLower.includes('nic')) {
                if (isCorrect) return "NSGs can be associated to subnets (affects all resources in the subnet) or NICs (affects only that specific VM). Both can be applied simultaneously — traffic must pass both.";
                return "While NSGs can be attached here, the specific association doesn't address the requirement in this question.";
            }
        }

        if (question.includes('load balancer')) {
            if (optLower.includes('standard')) {
                if (isCorrect) return "Standard Load Balancer provides zone redundancy, SLA guarantee, supports availability zones, and allows cross-VNet backend pools. Required for production workloads.";
                return "Standard SKU has more features but also different defaults (closed by default via NSG). Consider if the basic requirements need Standard capabilities.";
            }
            if (optLower.includes('basic')) {
                if (isCorrect) return "Basic Load Balancer is suitable for small-scale testing with limited features (no SLA, no zone redundancy, open by default).";
                return "Basic Load Balancer lacks SLA, zone redundancy, and will be retired. It's not recommended for production workloads.";
            }
            if (optLower.includes('health probe')) {
                if (isCorrect) return "Health probes determine backend availability. If a probe fails, the load balancer stops sending traffic to that instance until it recovers.";
                return "Health probes monitor backend health but don't address the specific configuration needed here.";
            }
        }

        if (question.includes('vpn') || question.includes('expressroute')) {
            if (optLower.includes('expressroute')) {
                if (isCorrect) return "ExpressRoute provides private, dedicated connectivity to Azure through a connectivity provider — not over the public internet. Offers predictable performance, lower latency, and higher security.";
                return "ExpressRoute requires a connectivity provider and is more expensive. It's overkill if encrypted internet connectivity (VPN) meets the requirements.";
            }
            if (optLower.includes('site-to-site') || optLower.includes('s2s')) {
                if (isCorrect) return "Site-to-Site VPN creates an encrypted IPsec tunnel between on-premises and Azure over the public internet. Requires a VPN device on-premises.";
                return "S2S VPN goes over public internet with encryption. For dedicated private connectivity without internet traversal, ExpressRoute is needed.";
            }
            if (optLower.includes('point-to-site') || optLower.includes('p2s')) {
                if (isCorrect) return "Point-to-Site VPN connects individual client computers to Azure VNet. Ideal for remote workers without requiring a VPN device.";
                return "P2S VPN is for individual clients, not site-to-site connectivity. It doesn't connect an entire on-premises network.";
            }
        }

        if (question.includes('dns')) {
            if (optLower.includes('private') && optLower.includes('zone')) {
                if (isCorrect) return "Azure Private DNS zones provide name resolution within VNets without needing custom DNS servers. They support auto-registration of VM records.";
                return "Private DNS zones work within VNets for internal resolution. They don't resolve for external/internet clients.";
            }
            if (optLower.includes('cname') || optLower.includes('alias')) {
                if (isCorrect) return "CNAME records create an alias pointing to another domain name. Useful for pointing custom domains to Azure-managed endpoints.";
                return "CNAME records alias to another domain but cannot be at the zone apex (@). For apex domains, use an Alias record set.";
            }
        }

        // === MONITORING ===
        if (question.includes('monitor') || question.includes('alert') || question.includes('diagnostic') || question.includes('log analytics')) {
            if (optLower.includes('action group')) {
                if (isCorrect) return "Action groups define notification and automation responses to alerts — email, SMS, webhooks, Azure Functions, Logic Apps, ITSM. Reusable across multiple alert rules.";
                return "Action groups handle alert responses but don't address the monitoring configuration or data collection requirement.";
            }
            if (optLower.includes('diagnostic setting')) {
                if (isCorrect) return "Diagnostic settings stream platform metrics and logs to destinations: Log Analytics, Storage Account, or Event Hubs. Required to collect resource-level logs.";
                return "Diagnostic settings collect data but are not the alert mechanism itself.";
            }
        }

        if (question.includes('backup') || question.includes('recovery services')) {
            if (optLower.includes('recovery services vault')) {
                if (isCorrect) return "Recovery Services vault stores backup data and backup policies. Must be in the same region as the resource being protected. Supports VMs, SQL, Files, and more.";
                return "Recovery Services vault stores backups but the vault alone doesn't address all aspects of this requirement.";
            }
            if (optLower.includes('policy') || optLower.includes('schedule')) {
                if (isCorrect) return "Backup policies define the schedule (daily/weekly) and retention period (days/weeks/months/years) for backed-up data.";
                return "Backup policies define schedules but may not be the specific configuration needed here.";
            }
        }

        // === GOVERNANCE ===
        if (question.includes('policy') && (question.includes('azure') || question.includes('compliance'))) {
            if (optLower.includes('deny')) {
                if (isCorrect) return "The Deny effect prevents resource creation or modification that violates the policy rule. It blocks non-compliant operations in real-time.";
                return "Deny blocks operations but doesn't remediate existing non-compliant resources. For retroactive enforcement, DeployIfNotExists or Modify may be needed.";
            }
            if (optLower.includes('audit')) {
                if (isCorrect) return "Audit effect logs non-compliant resources in the activity log and marks them non-compliant, but doesn't prevent or modify them. Good for visibility.";
                return "Audit only reports non-compliance — it doesn't prevent non-compliant deployments or fix existing resources.";
            }
            if (optLower.includes('deployifnotexists')) {
                if (isCorrect) return "DeployIfNotExists evaluates the resource and deploys a related resource if the condition isn't met (e.g., auto-deploy diagnostics settings). Runs during create/update.";
                return "DeployIfNotExists deploys related resources but doesn't deny or block the original resource creation.";
            }
        }

        // === GENERAL FALLBACK with context-aware reasoning ===
        if (isCorrect) {
            return this.explainCorrectAnswer(q);
        } else {
            return this.explainWhyWrong(q, optText);
        }
    },

    explainCorrectAnswer(q) {
        const question = q.question.toLowerCase();
        const answer = q.correctAnswers.join(' ').toLowerCase();
        
        if (answer.includes('yes')) return "This solution correctly satisfies all the stated requirements in the scenario.";
        if (answer.includes('no')) return "This solution does NOT satisfy all requirements. The approach described is either incomplete, uses the wrong feature, or addresses the wrong layer of the problem.";
        
        const topicInfo = TOPICS[q.topic];
        if (topicInfo) {
            return `This is correct because it directly addresses the requirement using the appropriate Azure service/feature in the ${topicInfo.name} domain. It follows Azure best practices and is the most efficient solution.`;
        }
        return "This is the correct answer based on Azure documentation and best practices.";
    },

    explainWhyWrong(q, optText) {
        const opt = optText.toLowerCase();
        const question = q.question.toLowerCase();
        
        // Common wrong answer patterns
        if (opt.includes('yes') && q.correctAnswers.some(a => a.toLowerCase().includes('no'))) {
            return "The proposed solution does NOT meet all the goals. While it may address part of the requirement, it fails to satisfy one or more key conditions specified in the question.";
        }
        if (opt.includes('no') && q.correctAnswers.some(a => a.toLowerCase().includes('yes'))) {
            return "The proposed solution actually DOES meet the goals. The approach described correctly addresses all stated requirements.";
        }
        
        // Generic but helpful
        return "This option either addresses a different problem, uses an inappropriate service/feature for the stated requirement, or doesn't fully satisfy all conditions specified in the question.";
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
        // Reset filters to "all" so the question is findable
        document.getElementById('topic-filter').value = 'all';
        document.getElementById('status-filter').value = 'all';
        this.filteredQuestions = [...this.questions];
        // Find by question id
        const idx = this.filteredQuestions.findIndex(q => q.id === num);
        if (idx !== -1) {
            this.currentQuestionIndex = idx;
            this.renderQuestion();
            input.value = '';
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
