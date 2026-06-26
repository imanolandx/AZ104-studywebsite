// AZ-104 Topic Classification
// Based on Microsoft Learn AZ-104 Study Guide skill areas

const TOPICS = {
    "identity": {
        name: "Manage Azure Identities & Governance",
        color: "#6366f1",
        keywords: ["Azure AD", "Azure Active Directory", "identity", "RBAC", "role", "policy", "management group", "subscription", "governance", "conditional access", "MFA", "Multi-Factor", "user", "group", "guest", "B2B", "tenant", "directory", "license", "administrative unit", "PIM", "access review", "custom role", "built-in role", "resource lock", "tag", "blueprint", "compliance", "Azure Policy"]
    },
    "storage": {
        name: "Implement & Manage Storage",
        color: "#06b6d4",
        keywords: ["storage account", "blob", "container", "file share", "Azure Files", "disk", "redundancy", "replication", "LRS", "GRS", "ZRS", "RA-GRS", "access tier", "lifecycle", "SAS", "shared access signature", "storage explorer", "AzCopy", "Import/Export", "Data Box", "queue", "table storage", "soft delete", "immutable", "encryption"]
    },
    "compute": {
        name: "Deploy & Manage Compute Resources",
        color: "#f59e0b",
        keywords: ["virtual machine", "VM", "availability set", "availability zone", "scale set", "VMSS", "App Service", "container", "ACI", "AKS", "Kubernetes", "Docker", "ARM template", "deployment", "extension", "custom script", "DSC", "Azure Bastion", "disk encryption", "backup", "recovery", "fault domain", "update domain", "proximity placement", "dedicated host", "image", "snapshot"]
    },
    "networking": {
        name: "Configure & Manage Virtual Networking",
        color: "#10b981",
        keywords: ["virtual network", "VNet", "subnet", "NSG", "network security group", "load balancer", "Application Gateway", "VPN", "ExpressRoute", "peering", "DNS", "private endpoint", "service endpoint", "firewall", "route table", "UDR", "NAT gateway", "Traffic Manager", "Front Door", "CDN", "IP address", "NIC", "network interface", "bastion", "network watcher"]
    },
    "monitor": {
        name: "Monitor & Maintain Azure Resources",
        color: "#ec4899",
        keywords: ["monitor", "alert", "metric", "log", "Log Analytics", "diagnostic", "insight", "Azure Monitor", "Application Insights", "action group", "workbook", "dashboard", "backup", "Recovery Services", "site recovery", "Azure Backup", "restore", "retention", "snapshot"]
    }
};

function classifyQuestion(question) {
    const text = question.question.toLowerCase() + ' ' + question.options.join(' ').toLowerCase();
    let bestTopic = "identity"; // default
    let bestScore = 0;

    for (const [key, topic] of Object.entries(TOPICS)) {
        let score = 0;
        for (const keyword of topic.keywords) {
            if (text.includes(keyword.toLowerCase())) {
                score += keyword.split(' ').length; // multi-word keywords score higher
            }
        }
        if (score > bestScore) {
            bestScore = score;
            bestTopic = key;
        }
    }

    return bestTopic;
}

// Classify all questions
function classifyAllQuestions(questions) {
    const classified = {};
    for (const topic of Object.keys(TOPICS)) {
        classified[topic] = [];
    }
    
    questions.forEach(q => {
        const topic = classifyQuestion(q);
        q.topic = topic;
        classified[topic].push(q);
    });
    
    return classified;
}
