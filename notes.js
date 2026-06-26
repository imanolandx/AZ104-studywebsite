// AZ-104 Study Notes based on Microsoft Learn
const STUDY_NOTES = {
    identity: {
        title: "Manage Azure Identities & Governance",
        sections: [
            {
                heading: "Azure Active Directory (Azure AD / Entra ID)",
                content: `
<h4>Key Concepts</h4>
<ul>
<li><strong>Tenant:</strong> A dedicated instance of Azure AD representing an organization</li>
<li><strong>Azure AD vs On-premises AD:</strong> Azure AD uses HTTP/HTTPS (not Kerberos), supports SAML, OAuth, OpenID Connect</li>
<li><strong>User types:</strong> Cloud identities, Directory-synced identities, Guest users (B2B)</li>
<li><strong>Azure AD editions:</strong> Free, P1, P2 (P2 adds Identity Protection & PIM)</li>
</ul>

<h4>User & Group Management</h4>
<ul>
<li><strong>Bulk operations:</strong> Create/invite/delete users via CSV upload</li>
<li><strong>Group types:</strong> Security groups and Microsoft 365 groups</li>
<li><strong>Membership types:</strong> Assigned, Dynamic User, Dynamic Device</li>
<li><strong>Administrative Units:</strong> Restrict administrative scope to a portion of the org</li>
<li><strong>Self-service password reset (SSPR):</strong> Requires Azure AD P1 or P2</li>
</ul>

<h4>Conditional Access</h4>
<ul>
<li>Requires Azure AD P1 minimum</li>
<li><strong>Signals:</strong> User/group, IP location, device, application, risk detection</li>
<li><strong>Decisions:</strong> Block access, Grant access (with requirements like MFA, compliant device)</li>
<li><strong>Session controls:</strong> App enforced restrictions, Conditional Access App Control</li>
</ul>

<div class="tip">💡 Conditional Access policies are enforced AFTER first-factor authentication. They are not a first line of defense against DoS attacks.</div>
`
            },
            {
                heading: "Role-Based Access Control (RBAC)",
                content: `
<h4>Key Concepts</h4>
<ul>
<li><strong>Security principal:</strong> User, group, service principal, or managed identity</li>
<li><strong>Role definition:</strong> Collection of permissions (Actions, NotActions, DataActions)</li>
<li><strong>Scope:</strong> Management group → Subscription → Resource group → Resource</li>
<li><strong>Role assignment:</strong> Attaching a role definition to a principal at a scope</li>
</ul>

<h4>Built-in Roles</h4>
<ul>
<li><strong>Owner:</strong> Full access + can assign roles to others</li>
<li><strong>Contributor:</strong> Full access but cannot assign roles</li>
<li><strong>Reader:</strong> View everything but make no changes</li>
<li><strong>User Access Administrator:</strong> Manage user access to Azure resources</li>
</ul>

<h4>Custom Roles</h4>
<ul>
<li>Can be created via Azure portal, PowerShell, CLI, or REST API</li>
<li>Defined in JSON with Actions, NotActions, DataActions, NotDataActions</li>
<li>AssignableScopes defines where the role can be assigned</li>
</ul>

<div class="tip">💡 RBAC is an allow model. If one assignment grants read and another grants write, you have both read AND write.</div>
`
            },
            {
                heading: "Azure Governance",
                content: `
<h4>Management Groups</h4>
<ul>
<li>Organize subscriptions into a hierarchy for governance</li>
<li>Maximum 6 levels of depth (not including root or subscription level)</li>
<li>A management group can have many children, but only ONE parent</li>
<li>All subscriptions within a management group inherit its conditions</li>
</ul>

<h4>Azure Policy</h4>
<ul>
<li><strong>Policy definition:</strong> Describes compliance conditions and actions</li>
<li><strong>Policy initiative:</strong> A collection of policy definitions</li>
<li><strong>Policy effects:</strong> Deny, Audit, Append, DeployIfNotExists, AuditIfNotExists, Modify, Disabled</li>
<li>Policies are inherited down the resource hierarchy</li>
<li>Exclusions can be set at any scope</li>
</ul>

<h4>Resource Locks</h4>
<ul>
<li><strong>ReadOnly (CanNotDelete):</strong> Authorized users can read but not modify or delete</li>
<li><strong>Delete:</strong> Authorized users can read and modify but not delete</li>
<li>Locks are inherited by child resources</li>
<li>Only Owner and User Access Administrator can create/delete locks</li>
</ul>

<h4>Tags</h4>
<ul>
<li>Name-value pairs for organizing resources</li>
<li>Tags are NOT inherited by default (use Azure Policy to enforce inheritance)</li>
<li>Maximum 50 tags per resource/resource group</li>
<li>Tag name: 512 characters, Tag value: 256 characters</li>
</ul>
`
            }
        ]
    },
    storage: {
        title: "Implement & Manage Storage",
        sections: [
            {
                heading: "Storage Accounts",
                content: `
<h4>Storage Account Types</h4>
<ul>
<li><strong>Standard general-purpose v2:</strong> Blob, File, Queue, Table (recommended for most scenarios)</li>
<li><strong>Premium block blobs:</strong> High transaction rates, smaller objects, low latency</li>
<li><strong>Premium file shares:</strong> Enterprise file share applications, supports SMB and NFS</li>
<li><strong>Premium page blobs:</strong> VM disks, databases</li>
</ul>

<h4>Redundancy Options</h4>
<ul>
<li><strong>LRS:</strong> 3 copies in single datacenter (11 9s durability)</li>
<li><strong>ZRS:</strong> 3 copies across availability zones (12 9s durability)</li>
<li><strong>GRS:</strong> LRS + async copy to secondary region (16 9s)</li>
<li><strong>RA-GRS:</strong> GRS + read access from secondary</li>
<li><strong>GZRS:</strong> ZRS + async copy to secondary region</li>
<li><strong>RA-GZRS:</strong> GZRS + read access from secondary</li>
</ul>

<div class="tip">💡 To change from LRS to GRS, you can do it directly. To change to ZRS, you must perform a live migration or manual migration.</div>

<h4>Access Tiers</h4>
<ul>
<li><strong>Hot:</strong> Frequently accessed data (highest storage cost, lowest access cost)</li>
<li><strong>Cool:</strong> Infrequently accessed, stored 30+ days</li>
<li><strong>Cold:</strong> Infrequently accessed, stored 90+ days</li>
<li><strong>Archive:</strong> Rarely accessed, stored 180+ days (offline, must rehydrate)</li>
</ul>
`
            },
            {
                heading: "Blob Storage",
                content: `
<h4>Blob Types</h4>
<ul>
<li><strong>Block blobs:</strong> Text and binary data, up to ~190 TB</li>
<li><strong>Append blobs:</strong> Optimized for append operations (logging)</li>
<li><strong>Page blobs:</strong> Random read/write, up to 8 TB (VHD files)</li>
</ul>

<h4>Lifecycle Management</h4>
<ul>
<li>Automatically transition blobs between tiers based on rules</li>
<li>Rules based on: last modified date, creation date, last accessed date</li>
<li>Can delete blobs/snapshots based on age</li>
</ul>

<h4>Security</h4>
<ul>
<li><strong>SAS (Shared Access Signature):</strong> Delegated access with specified permissions & time frame</li>
<li><strong>Types:</strong> Account SAS, Service SAS, User delegation SAS (most secure, uses Azure AD)</li>
<li><strong>Stored access policy:</strong> Server-side, can modify/revoke SAS without regenerating keys</li>
<li><strong>Immutable storage:</strong> WORM (Write Once Read Many) - time-based retention & legal holds</li>
</ul>

<h4>Data Transfer Tools</h4>
<ul>
<li><strong>AzCopy:</strong> Command-line tool, copy data to/from storage (supports SAS & Azure AD auth)</li>
<li><strong>Storage Explorer:</strong> GUI tool for managing storage</li>
<li><strong>Azure Import/Export:</strong> Ship physical disks (large data, limited bandwidth)</li>
<li><strong>Azure Data Box:</strong> Microsoft ships appliance for massive data transfer (up to 80 TB per device)</li>
</ul>
`
            },
            {
                heading: "Azure Files & File Sync",
                content: `
<h4>Azure Files</h4>
<ul>
<li>Fully managed file shares via SMB (445) or NFS protocol</li>
<li>Can mount on Windows, Linux, macOS</li>
<li>Standard: HDD-based, Premium: SSD-based</li>
<li>Snapshots: Read-only point-in-time copy of file share</li>
<li>Soft delete: Recover accidentally deleted shares</li>
</ul>

<h4>Azure File Sync</h4>
<ul>
<li>Centralize file shares in Azure Files while keeping local cache</li>
<li><strong>Components:</strong> Storage Sync Service, Sync Group, Registered Server, Server Endpoint, Cloud Endpoint</li>
<li><strong>Cloud tiering:</strong> Frequently accessed files cached locally; others tiered to cloud</li>
<li>One cloud endpoint (Azure file share) per sync group</li>
<li>Multiple server endpoints per sync group</li>
</ul>

<div class="tip">💡 Azure File Sync requires the Azure File Sync agent installed on Windows Server. It does NOT support Linux.</div>
`
            }
        ]
    },
    compute: {
        title: "Deploy & Manage Compute Resources",
        sections: [
            {
                heading: "Virtual Machines",
                content: `
<h4>VM Availability</h4>
<ul>
<li><strong>Availability Sets:</strong> Fault domains (max 3) + Update domains (max 20). Protects from hardware failure & planned maintenance</li>
<li><strong>Availability Zones:</strong> Physically separate zones within a region. Protects from datacenter failure</li>
<li><strong>VM Scale Sets (VMSS):</strong> Auto-scale group of identical VMs</li>
<li><strong>SLA:</strong> Single VM (Premium SSD): 99.9%, Availability Set: 99.95%, Availability Zones: 99.99%</li>
</ul>

<h4>VM Sizing</h4>
<ul>
<li><strong>General purpose (B, D):</strong> Balanced CPU-to-memory</li>
<li><strong>Compute optimized (F):</strong> High CPU-to-memory</li>
<li><strong>Memory optimized (E, M):</strong> High memory-to-CPU</li>
<li><strong>Storage optimized (L):</strong> High disk throughput</li>
<li><strong>GPU (N):</strong> GPU-intensive workloads</li>
</ul>

<h4>VM Disks</h4>
<ul>
<li><strong>OS disk:</strong> Every VM has one, registered as SATA, labeled /dev/sda (Linux) or C: (Windows)</li>
<li><strong>Temporary disk:</strong> Short-term storage, data may be lost during maintenance (D: on Windows)</li>
<li><strong>Data disks:</strong> Registered as SCSI, number depends on VM size</li>
<li><strong>Managed disks:</strong> Ultra, Premium SSD, Standard SSD, Standard HDD</li>
</ul>

<div class="tip">💡 To resize a VM in an availability set when you get an allocation failure, you must stop ALL VMs in the availability set first.</div>
`
            },
            {
                heading: "ARM Templates & Automation",
                content: `
<h4>Azure Resource Manager (ARM) Templates</h4>
<ul>
<li>JSON files that define infrastructure and configuration</li>
<li><strong>Sections:</strong> $schema, contentVersion, parameters, variables, resources, outputs</li>
<li><strong>Deployment modes:</strong> Incremental (add/update only) vs Complete (delete resources not in template)</li>
<li>Linked/nested templates for modular deployments</li>
<li>Template specs: Store templates in Azure for sharing</li>
</ul>

<h4>Azure Bicep</h4>
<ul>
<li>Domain-specific language for ARM template deployment</li>
<li>Simpler syntax than JSON ARM templates</li>
<li>Compiles to ARM template JSON</li>
</ul>

<h4>Key Vault</h4>
<ul>
<li>Store secrets, keys, and certificates securely</li>
<li>Reference Key Vault secrets in ARM template parameters</li>
<li>Access policies or RBAC for authorization</li>
<li>Soft delete (default) and purge protection</li>
</ul>
`
            },
            {
                heading: "App Service & Containers",
                content: `
<h4>Azure App Service</h4>
<ul>
<li>Fully managed platform for web apps, REST APIs, mobile backends</li>
<li><strong>App Service Plans:</strong> Free, Shared, Basic, Standard, Premium, Isolated</li>
<li><strong>Deployment slots:</strong> Available in Standard tier and above. Swap slots for zero-downtime deployments</li>
<li><strong>Custom domains:</strong> CNAME for subdomains, A record for root domain</li>
<li><strong>SSL/TLS:</strong> Free managed certificate or bring your own</li>
</ul>

<h4>Azure Container Instances (ACI)</h4>
<ul>
<li>Run containers without managing VMs</li>
<li>Fast startup, per-second billing</li>
<li>Supports both Linux and Windows containers</li>
<li>Container groups: Multiple containers sharing lifecycle and resources</li>
</ul>

<h4>Azure Kubernetes Service (AKS)</h4>
<ul>
<li>Managed Kubernetes cluster</li>
<li>Azure manages the control plane (free)</li>
<li>You manage/pay for worker nodes</li>
<li>Supports auto-scaling (cluster autoscaler + horizontal pod autoscaler)</li>
</ul>
`
            }
        ]
    },
    networking: {
        title: "Configure & Manage Virtual Networking",
        sections: [
            {
                heading: "Virtual Networks (VNet)",
                content: `
<h4>Key Concepts</h4>
<ul>
<li>VNet is scoped to a single region and single subscription</li>
<li>Can span multiple Availability Zones within the region</li>
<li>Address space uses CIDR notation (e.g., 10.0.0.0/16)</li>
<li>Subnets cannot overlap within a VNet</li>
<li>Azure reserves 5 IP addresses in each subnet (first 4 + last 1)</li>
</ul>

<h4>VNet Peering</h4>
<ul>
<li><strong>Regional peering:</strong> VNets in same region</li>
<li><strong>Global peering:</strong> VNets in different regions</li>
<li>Traffic uses Microsoft backbone (private, low latency)</li>
<li>Non-transitive: if A↔B and B↔C, A cannot reach C unless A↔C is configured</li>
<li>Can peer across subscriptions and tenants</li>
</ul>

<h4>VPN Gateway</h4>
<ul>
<li><strong>Site-to-Site (S2S):</strong> On-premises to Azure over IPsec/IKE tunnel</li>
<li><strong>Point-to-Site (P2S):</strong> Individual client to Azure VNet</li>
<li><strong>VNet-to-VNet:</strong> Between Azure VNets (can be cross-region)</li>
<li>Only ONE VPN gateway per VNet</li>
<li>Gateway subnet must be named "GatewaySubnet"</li>
</ul>

<div class="tip">💡 VNet peering is non-transitive. Use hub-spoke topology with a VPN gateway or Azure Firewall for transit routing.</div>
`
            },
            {
                heading: "Network Security",
                content: `
<h4>Network Security Groups (NSG)</h4>
<ul>
<li>Filter network traffic with security rules</li>
<li>Associated to subnet or NIC (or both)</li>
<li>Rules: Priority (100-4096, lower = higher priority), Source, Destination, Port, Protocol, Action</li>
<li>Default rules: Allow VNet inbound/outbound, Allow Azure Load Balancer inbound, Deny all inbound</li>
<li>Stateful: if inbound traffic is allowed, return traffic is automatic</li>
</ul>

<h4>Azure Firewall</h4>
<ul>
<li>Managed cloud-based network security service</li>
<li>Stateful firewall as a service with built-in high availability</li>
<li>Rule types: NAT rules, Network rules, Application rules</li>
<li>Threat intelligence-based filtering</li>
</ul>

<h4>Service Endpoints & Private Endpoints</h4>
<ul>
<li><strong>Service Endpoints:</strong> Extend VNet identity to Azure services, traffic stays on Azure backbone</li>
<li><strong>Private Endpoints:</strong> Private IP address from your VNet for the Azure service</li>
<li>Private Link: Access services over private endpoint (removes public exposure)</li>
</ul>
`
            },
            {
                heading: "Load Balancing & DNS",
                content: `
<h4>Azure Load Balancer</h4>
<ul>
<li>Layer 4 (TCP/UDP) load balancing</li>
<li><strong>Public LB:</strong> Internet to VMs</li>
<li><strong>Internal LB:</strong> Between VMs in VNet</li>
<li><strong>SKUs:</strong> Basic (free, limited) and Standard (SLA, zone-redundant)</li>
<li><strong>Health probes:</strong> HTTP, HTTPS, TCP</li>
</ul>

<h4>Application Gateway</h4>
<ul>
<li>Layer 7 (HTTP/HTTPS) load balancing</li>
<li>URL-based routing, multi-site hosting</li>
<li>SSL termination, Web Application Firewall (WAF)</li>
<li>Cookie-based session affinity</li>
</ul>

<h4>Azure DNS</h4>
<ul>
<li>Host DNS domains in Azure</li>
<li><strong>Public DNS zones:</strong> Internet-facing name resolution</li>
<li><strong>Private DNS zones:</strong> Name resolution within VNets</li>
<li><strong>Record types:</strong> A, AAAA, CNAME, MX, NS, PTR, SOA, SRV, TXT</li>
<li>Alias records: Point to Azure resource (LB, Traffic Manager, CDN, Public IP)</li>
</ul>

<h4>Other Load Balancing Options</h4>
<ul>
<li><strong>Traffic Manager:</strong> DNS-based global load balancing (routing methods: Priority, Weighted, Performance, Geographic)</li>
<li><strong>Azure Front Door:</strong> Global HTTP load balancing with CDN and WAF</li>
</ul>
`
            }
        ]
    },
    monitor: {
        title: "Monitor & Maintain Azure Resources",
        sections: [
            {
                heading: "Azure Monitor",
                content: `
<h4>Key Components</h4>
<ul>
<li><strong>Metrics:</strong> Numerical time-series data (near real-time, stored 93 days)</li>
<li><strong>Logs:</strong> Structured/semi-structured data (stored in Log Analytics workspace)</li>
<li><strong>Activity Log:</strong> Subscription-level events (control plane operations)</li>
<li><strong>Diagnostic Settings:</strong> Route platform logs/metrics to destinations</li>
</ul>

<h4>Log Analytics</h4>
<ul>
<li>Collect, analyze, and act on telemetry data</li>
<li>Uses Kusto Query Language (KQL) for queries</li>
<li>Workspace: Central store for log data</li>
<li>Data sources: VMs (agents), Azure resources, applications, OS</li>
</ul>

<h4>Alerts</h4>
<ul>
<li><strong>Alert types:</strong> Metric alerts, Log alerts, Activity log alerts</li>
<li><strong>Components:</strong> Alert rule (condition), Action group (notification/action), Severity (0-4)</li>
<li><strong>Action groups:</strong> Email, SMS, Voice, Push, Azure Function, Logic App, Webhook, ITSM, Automation Runbook</li>
<li><strong>Alert states:</strong> New, Acknowledged, Closed</li>
</ul>

<div class="tip">💡 Activity Log stores events for 90 days. To retain longer, send to Log Analytics workspace or Azure Storage.</div>
`
            },
            {
                heading: "Azure Backup",
                content: `
<h4>Key Concepts</h4>
<ul>
<li><strong>Recovery Services Vault:</strong> Storage entity for backup data (must be in same region as source)</li>
<li><strong>Backup policy:</strong> Schedule (when to backup) + Retention (how long to keep)</li>
<li><strong>Supported workloads:</strong> Azure VMs, SQL in Azure VM, Azure Files, SAP HANA, on-premises (MARS agent)</li>
</ul>

<h4>VM Backup</h4>
<ul>
<li>Application-consistent snapshots (Windows VSS, Linux custom scripts)</li>
<li>Backup once a day (or multiple with Enhanced policy)</li>
<li>Supports both managed and unmanaged disks</li>
<li><strong>Restore options:</strong> Create new VM, Restore disk, Replace existing disk, Cross-region (if GRS)</li>
<li><strong>Soft delete:</strong> Retains backup data 14 days after deletion</li>
</ul>

<h4>MARS Agent (Microsoft Azure Recovery Services)</h4>
<ul>
<li>Backup files, folders, and system state from on-premises/Azure VMs</li>
<li>Installed directly on Windows machines</li>
<li>Does NOT require a separate backup server</li>
<li>Backs up to Recovery Services vault</li>
</ul>

<h4>Restore Points</h4>
<ul>
<li><strong>Instant restore:</strong> Restore from local snapshot (faster, 1-5 day retention)</li>
<li><strong>Vault tier:</strong> Restore from vault (longer retention, slower)</li>
</ul>
`
            },
            {
                heading: "Network Watcher & Diagnostics",
                content: `
<h4>Network Watcher Tools</h4>
<ul>
<li><strong>IP flow verify:</strong> Test if packet is allowed/denied to/from a VM</li>
<li><strong>Next hop:</strong> Determine next hop for a packet from a VM</li>
<li><strong>Connection troubleshoot:</strong> Test connectivity between resources</li>
<li><strong>NSG flow logs:</strong> Log info about IP traffic through NSG</li>
<li><strong>Packet capture:</strong> Capture packets to/from a VM</li>
<li><strong>Connection monitor:</strong> Monitor connectivity between endpoints</li>
<li><strong>Topology:</strong> Visual diagram of VNet resources</li>
</ul>

<h4>Azure Service Health</h4>
<ul>
<li><strong>Azure Status:</strong> Global view of Azure service health</li>
<li><strong>Service Health:</strong> Personalized view of services/regions you use</li>
<li><strong>Resource Health:</strong> Health of your specific resources</li>
<li>Can set up alerts for service health events</li>
</ul>
`
            }
        ]
    }
};
