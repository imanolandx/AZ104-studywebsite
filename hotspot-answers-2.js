// Hotspot Answers - Part 2 (remaining 140 questions)
const HOTSPOT_ANSWERS_2 = {
    152: {
        type: 'dropdown',
        title: 'Case Study – Network & Policy',
        items: [
            { statement: 'Refer to the case study details for this question', answer: 'See case study exhibits', explanation: 'This question requires reviewing the case study exhibits for VM configurations, network settings, and policy assignments. Answers depend on the specific scenario details shown.' }
        ]
    },
    184: {
        type: 'yesno',
        title: 'Azure File Sync – Multiple Endpoints',
        items: [
            { statement: 'Files from data1 will sync to share1', answer: 'Yes', explanation: 'data1 is added as a server endpoint for Sync1, and share1 is the cloud endpoint. Files sync between server endpoints and the cloud endpoint.' },
            { statement: 'Files from share2 can be added as a cloud endpoint to Sync1', answer: 'No', explanation: 'A sync group can only have ONE cloud endpoint. share1 is already the cloud endpoint for Sync1. You cannot add share2 to the same sync group.' },
            { statement: 'Server2 can add a server endpoint to Sync1', answer: 'Yes', explanation: 'Server2 is registered to Sync1. Any registered server can add server endpoints to sync groups within that Storage Sync Service.' }
        ]
    },
    185: {
        type: 'dropdown',
        title: 'Azure Backup Reports – Diagnostics',
        items: [
            { statement: 'Storage accounts that can be used', answer: 'Any storage account in the same region as the vault', explanation: 'Diagnostic settings for Recovery Services vaults can send data to storage accounts. The storage account should be in the same region for performance, but cross-region is technically possible.' },
            { statement: 'Log Analytics workspaces that can be used', answer: 'Any Log Analytics workspace (any region)', explanation: 'Unlike storage accounts, Log Analytics workspaces can be in any region. Azure Backup reports work with workspaces in any region.' }
        ]
    },
    186: {
        type: 'dropdown',
        title: 'Storage Account Features',
        items: [
            { statement: 'Which account supports page blobs', answer: 'GPv1 and GPv2 (General Purpose accounts)', explanation: 'Page blobs are supported by General Purpose v1 and v2 accounts. BlobStorage accounts also support page blobs. Premium page blobs require Premium storage.' },
            { statement: 'Which account supports archive tier', answer: 'GPv2 and BlobStorage accounts only', explanation: 'Archive access tier is only available on GPv2 and BlobStorage accounts. GPv1 does NOT support access tiers (hot/cool/archive).' }
        ]
    },
    187: {
        type: 'dropdown',
        title: 'Shared Access Signature (SAS) Settings',
        items: [
            { statement: 'Allowed services based on SAS config', answer: 'Check SAS exhibit for selected services (Blob, File, Queue, Table)', explanation: 'The SAS token grants access only to the services selected during creation. Unselected services are inaccessible via this SAS.' },
            { statement: 'Allowed permissions', answer: 'Check SAS exhibit for Read/Write/Delete/List/etc.', explanation: 'Only the permissions explicitly selected in the SAS configuration are granted. The principle of least privilege should apply.' }
        ]
    },
    193: {
        type: 'yesno',
        title: 'ARM Template Export – Storage Account',
        items: [
            { statement: 'The exported template can be redeployed to create a new storage account', answer: 'Yes', explanation: 'Exported ARM templates can be redeployed. You may need to change the storage account name (must be globally unique) and adjust parameters.' },
            { statement: 'The template includes the storage account access keys', answer: 'No', explanation: 'ARM template exports NEVER include secrets like access keys. Keys are runtime values, not deployment configuration.' },
            { statement: 'The template includes blob data stored in the account', answer: 'No', explanation: 'ARM templates only capture the resource configuration (SKU, location, settings), not the data stored within the resource.' }
        ]
    },
    196: {
        type: 'yesno',
        title: 'Lifecycle Management Rules – Timing',
        items: [
            { statement: 'Blob1 will be moved to Cool tier after the rule runs', answer: 'Yes', explanation: 'If the lifecycle rule specifies moving blobs to Cool after X days and Blob1 has not been modified for that many days, it will be moved.' },
            { statement: 'Blob2 will be moved to Archive tier', answer: 'No', explanation: 'Check if Blob2 meets the days-since-modification threshold for the archive rule. If it was recently modified or uploaded, it will not yet be archived.' },
            { statement: 'Lifecycle rules run once per day', answer: 'Yes', explanation: 'Azure Storage lifecycle management evaluates rules once per day. Changes may take up to 24 hours to take effect after the condition is met.' }
        ]
    },
    198: {
        type: 'dropdown',
        title: 'Object Replication – New Account Config',
        items: [
            { statement: 'Account kind', answer: 'General-purpose v2 (StorageV2)', explanation: 'Object replication requires both source and destination accounts to be GPv2. BlobStorage and GPv1 do not support object replication.' },
            { statement: 'Blob versioning', answer: 'Enabled (on both source and destination)', explanation: 'Object replication requires blob versioning to be enabled on BOTH the source and destination accounts.' },
            { statement: 'Change feed', answer: 'Enabled (on source account only)', explanation: 'Change feed must be enabled on the SOURCE account to track blob changes. The destination does not require change feed.' }
        ]
    },
    203: {
        type: 'yesno',
        title: 'Lifecycle Management – Blob Tiers Over Time',
        items: [
            { statement: 'After 30 days, Blob1 is in Cool tier', answer: 'Yes', explanation: 'The lifecycle rule moves blobs to Cool after 30 days without modification. Blob1 stored on June 1 will move to Cool by July 1.' },
            { statement: 'After 90 days, Blob1 is in Archive tier', answer: 'Yes', explanation: 'The lifecycle rule moves blobs to Archive after 90 days. Blob1 will be archived by September 1.' },
            { statement: 'Blob2 follows the same schedule', answer: 'Yes', explanation: 'Both blobs in storage1 are subject to the same lifecycle rules. The timer starts from their last modification date.' }
        ]
    },
    204: {
        type: 'yesno',
        title: 'ARM Template – Storage Account Deployment',
        items: [
            { statement: 'The storage account uses LRS replication', answer: 'Check template for sku.name value', explanation: 'Look at the "sku" section in the ARM template. Standard_LRS = LRS, Standard_GRS = GRS, Standard_ZRS = ZRS.' },
            { statement: 'The storage account supports file shares', answer: 'Yes', explanation: 'GPv2 (StorageV2) accounts support all storage services: Blob, File, Queue, Table. Check the template "kind" property.' },
            { statement: 'The storage account name is valid', answer: 'Check if 3-24 chars, lowercase letters and numbers only', explanation: 'Storage account names must be 3-24 characters, lowercase letters and numbers only. No hyphens, spaces, or uppercase.' }
        ]
    },
    206: {
        type: 'dropdown',
        title: 'Lifecycle Management Rule – Move to Lowest Cost',
        items: [
            { statement: 'tierToArchive or tierToCool', answer: 'tierToArchive', explanation: 'Archive is the LOWEST cost tier for storage. The rule should use "tierToArchive" action to move blobs to the cheapest tier after 90 days.' },
            { statement: 'daysAfterModificationGreaterThan', answer: '90', explanation: 'The rule triggers after 90 days since last modification. This is the condition that determines when blobs are moved.' },
            { statement: 'blobTypes', answer: 'blockBlob', explanation: 'Lifecycle management rules apply to block blobs. Page blobs and append blobs do not support access tiers.' }
        ]
    },
    210: {
        type: 'dropdown',
        title: 'RA-GRS Failover & Blob Write Access',
        items: [
            { statement: 'User1 must write blob data', answer: 'Storage Blob Data Contributor role', explanation: 'Storage Blob Data Contributor allows read, write, and delete blob data. This is required for writing blob data using Azure AD authentication.' },
            { statement: 'Account must fail over to secondary', answer: 'Change replication to GRS (remove RA-)', explanation: 'RA-GRS allows read access to secondary. For failover, account must be GRS/RA-GRS. Initiate failover from Azure portal or PowerShell.' }
        ]
    },
    212: {
        type: 'dropdown',
        title: 'SAS Permissions vs RBAC Roles',
        items: [
            { statement: 'Resources User1 can access via SAS1', answer: 'Only resources allowed by BOTH the SAS permissions AND the user RBAC role', explanation: 'A user-delegation SAS is limited by both the SAS permissions and the user delegating it. If User1 has Blob Data Reader but SAS allows write, write still fails.' },
            { statement: 'User1 can access File shares via SAS1', answer: 'No', explanation: 'User delegation SAS only works with Blob storage. File, Table, and Queue services require account key-based SAS or Azure AD (Files only via RBAC).' }
        ]
    },
    213: {
        type: 'dropdown',
        title: 'Storage Account Settings',
        items: [
            { statement: 'Replication type available', answer: 'Based on account kind and performance tier shown', explanation: 'Premium storage only supports LRS and ZRS. Standard supports LRS, ZRS, GRS, RA-GRS, GZRS, RA-GZRS. Check the exhibit for the specific account.' },
            { statement: 'Access tier default', answer: 'Hot or Cool (set at account level)', explanation: 'The default access tier is set at the account level. Individual blobs can override this. Archive is blob-level only.' }
        ]
    },
    216: {
        type: 'dropdown',
        title: 'Lifecycle Management & Archive Support',
        items: [
            { statement: 'Supports lifecycle management', answer: 'GPv2 and BlobStorage accounts', explanation: 'Lifecycle management requires GPv2 or BlobStorage account kind. GPv1 and Premium accounts do not support lifecycle management policies.' },
            { statement: 'Supports Archive access tier', answer: 'GPv2 and BlobStorage accounts (Standard tier only)', explanation: 'Archive tier is only available on Standard GPv2/BlobStorage. Premium storage accounts do not support Archive tier.' }
        ]
    },
    218: {
        type: 'dropdown',
        title: 'Lifecycle Rule – Move to Cool After 45 Days',
        items: [
            { statement: 'Action', answer: 'tierToCool', explanation: 'The tierToCool action moves blobs from Hot to Cool tier, reducing storage costs for infrequently accessed data.' },
            { statement: 'Condition', answer: 'daysAfterModificationGreaterThan: 45', explanation: 'This condition checks if the blob has NOT been modified for 45 days. Once true, the action executes.' },
            { statement: 'Filter – blobTypes', answer: 'blockBlob', explanation: 'Only block blobs support tiering. The filter ensures the rule only applies to block blobs in container1.' }
        ]
    },
    223: {
        type: 'yesno',
        title: 'AKS Cluster Deployment Requirements',
        items: [
            { statement: 'AKS1 can be deployed to VNet1', answer: 'Check if VNet1 region matches AKS1 region', explanation: 'AKS cluster must be in the same region as its virtual network. If regions do not match, deployment fails.' },
            { statement: 'AKS2 can be deployed to VNet2', answer: 'Check if VNet2 region matches and subnet has enough IPs', explanation: 'AKS requires a subnet with enough IP addresses for nodes + pods (Azure CNI) or just nodes (kubenet). Check subnet size.' },
            { statement: 'AKS clusters in different VNets can communicate', answer: 'Only with VNet peering configured', explanation: 'Resources in different VNets are isolated by default. VNet peering or VPN gateway is required for cross-VNet communication.' }
        ]
    },
    225: {
        type: 'dropdown',
        title: 'Storage Account – Region & Redundancy',
        items: [
            { statement: 'Primary region for the data', answer: 'Based on account location shown in exhibit', explanation: 'The primary region is where the storage account is created. All writes go to the primary region first.' },
            { statement: 'Data available if primary region fails', answer: 'Only with GRS/RA-GRS/GZRS/RA-GZRS replication', explanation: 'GRS replicates to a paired region. RA-GRS additionally allows read access to secondary during primary outage. LRS/ZRS have no cross-region copy.' }
        ]
    },
    226: {
        type: 'dropdown',
        title: 'Storage Encryption – Customer-Managed Key',
        items: [
            { statement: 'Key type', answer: 'RSA', explanation: 'Azure Storage encryption supports RSA keys for customer-managed keys. RSA is the key type stored in Azure Key Vault for storage encryption.' },
            { statement: 'Key bit length (maximum supported)', answer: '4096-bit', explanation: 'Azure Key Vault supports RSA keys up to 4096 bits. For maximum security (as required), use RSA-4096. 2048 and 3072 are also supported but not maximum.' }
        ]
    },
    229: {
        type: 'dropdown',
        title: 'Custom Role – Storage & VNet',
        items: [
            { statement: 'View storage account configuration', answer: 'Microsoft.Storage/storageAccounts/read', explanation: 'The /read action allows viewing the configuration (properties, settings) of a storage account. This does NOT include reading blob data.' },
            { statement: 'All actions on virtual networks', answer: 'Microsoft.Network/virtualNetworks/*', explanation: 'The wildcard (*) after the resource type grants all actions (read, write, delete, join, peer) on virtual networks.' }
        ]
    },
    231: {
        type: 'dropdown',
        title: 'Data Disk – Resiliency & Performance',
        items: [
            { statement: 'Type of storage', answer: 'Premium SSD (with Zone-redundant storage)', explanation: 'ZRS managed disks provide cross-datacenter resiliency. Premium SSD provides the lowest latency and highest performance among standard options.' },
            { statement: 'Host caching', answer: 'None (or Read-only for read-heavy workloads)', explanation: 'For data disks that require no data loss on host failure, use None or ReadOnly caching. ReadWrite caching risks data loss if the host crashes.' }
        ]
    },
    234: {
        type: 'dropdown',
        title: 'SAS – Download Blobs by Name Only',
        items: [
            { statement: 'Allowed resource types', answer: 'Object (not Container or Service)', explanation: 'To download blobs by name (individual objects), select Object. Do NOT select Container (which would allow listing blobs) or Service.' },
            { statement: 'Allowed protocols', answer: 'HTTPS only', explanation: 'For secure downloads, restrict to HTTPS only. This ensures data in transit is encrypted. HTTP would be insecure.' }
        ]
    },
    237: {
        type: 'yesno',
        title: 'Lifecycle Management – Versions & Snapshots',
        items: [
            { statement: 'The policy deletes blob versions older than X days', answer: 'Yes', explanation: 'Lifecycle rules can target previous versions with delete actions after a specified number of days since version creation.' },
            { statement: 'The policy deletes snapshots', answer: 'Yes', explanation: 'Lifecycle rules can include actions to delete snapshots after a specified period (daysAfterCreationGreaterThan for snapshots).' },
            { statement: 'Current blob versions are affected', answer: 'Check rule scope', explanation: 'If the rule targets "baseBlob" it affects current versions. If it targets "snapshot" or "version" it only affects those specific types.' }
        ]
    },
    241: {
        type: 'dropdown',
        title: 'Blob Inventory Rule Configuration',
        items: [
            { statement: 'Schedule', answer: 'Daily', explanation: 'The requirement specifies daily inventory. Set the schedule to "Daily" to generate the CSV file once per day.' },
            { statement: 'Object type', answer: 'Blob', explanation: 'The inventory rule tracks blobs. Options are Blob or Container. Since we want blob-level details, select Blob.' },
            { statement: 'Prefix match (filter)', answer: 'container1/finance', explanation: 'The blobNamePrefix filter "container1/finance" ensures only blobs whose names start with "finance" in container1 are inventoried.' }
        ]
    },
    242: {
        type: 'dropdown',
        title: 'SAS – List and Download from Container',
        items: [
            { statement: 'Allowed services', answer: 'Blob', explanation: 'Containers and blobs are part of the Blob service. Select Blob to access container1.' },
            { statement: 'Allowed resource types', answer: 'Container and Object', explanation: 'Container allows listing (enumerating) blobs. Object allows downloading individual blobs. Both are needed.' },
            { statement: 'Permissions', answer: 'Read and List', explanation: 'Read = download blobs. List = enumerate blobs in the container. These are the minimum permissions (least privilege) for the requirements.' }
        ]
    },
    243: {
        type: 'yesno',
        title: 'Lifecycle Management – Timeline',
        items: [
            { statement: 'Blob1 moves to Cool after 30 days', answer: 'Yes', explanation: 'If the rule has tierToCool with daysAfterModificationGreaterThan: 30, Blob1 (unmodified since June 1) moves to Cool around July 1.' },
            { statement: 'Blob2 moves to Cool after 30 days', answer: 'Yes', explanation: 'Same rule applies to Blob2. Both blobs stored on June 1 will transition to Cool tier after 30 days without modification.' },
            { statement: 'Blobs move to Archive after 90 days', answer: 'Yes', explanation: 'If the rule includes tierToArchive at 90 days, both blobs will be archived around September 1 (90 days after June 1).' }
        ]
    },
    244: {
        type: 'yesno',
        title: 'Storage Account Permissions & Access',
        items: [
            { statement: 'User with Reader role can list blobs', answer: 'No', explanation: 'Reader role only sees management plane (account properties). To list/read blob data, you need Storage Blob Data Reader or higher data-plane role.' },
            { statement: 'User with Storage Blob Data Contributor can create containers', answer: 'Yes', explanation: 'Storage Blob Data Contributor allows read, write, delete blob data AND create/delete containers.' },
            { statement: 'Access depends on network rules if configured', answer: 'Yes', explanation: 'Even with correct RBAC, if the storage account firewall denies the users network, access will be blocked. Network rules are evaluated first.' }
        ]
    },
    245: {
        type: 'yesno',
        title: 'Azure Files – Identity-Based Access',
        items: [
            { statement: 'Synced user can access file share via SMB', answer: 'Yes', explanation: 'With AD DS authentication enabled, synced users (on-premises AD → Azure AD) can authenticate to Azure Files using their domain credentials via SMB.' },
            { statement: 'Cloud-only user can access file share via SMB with AD DS', answer: 'No', explanation: 'AD DS authentication requires the user to have an on-premises AD identity. Cloud-only Azure AD users cannot authenticate via SMB with AD DS as the identity source.' },
            { statement: 'Azure AD Kerberos can be used for hybrid users', answer: 'Yes', explanation: 'Azure AD Kerberos authentication for Azure Files supports hybrid identities (synced from AD) for SMB access without needing line-of-sight to domain controllers.' }
        ]
    },
    246: {
        type: 'yesno',
        title: 'Azure Files – AD DS & Share-Level Permissions',
        items: [
            { statement: 'User1 can access share1', answer: 'Check role assignment for User1 on share1', explanation: 'With AD DS authentication and default share-level permissions for all authenticated users, any domain-authenticated user gets read access. Specific roles (Contributor/Elevated Contributor) override.' },
            { statement: 'Group1 can access share1', answer: 'Check if Group1 has a share-level role OR if default permissions allow it', explanation: 'Default share-level permissions "Enable permissions for all authenticated users" grants read access to all domain users. Specific roles can grant write/elevated access.' },
            { statement: 'NTFS permissions also apply', answer: 'Yes', explanation: 'Azure Files with AD DS uses a two-layer model: share-level (RBAC) acts as a gatekeeper, then NTFS/file-level permissions provide granular control.' }
        ]
    },
    250: {
        type: 'dropdown',
        title: 'Case Study – Resource Configuration',
        items: [
            { statement: 'Refer to case study exhibits', answer: 'Review all exhibits and tables in the case study', explanation: 'Case study questions require careful reading of all provided exhibits, tables, and requirements before answering.' }
        ]
    },
    257: {
        type: 'dropdown',
        title: 'Move VM to Different VNet',
        items: [
            { statement: 'What to do with VM1', answer: 'Delete VM1 (keep disk), recreate in VNet2', explanation: 'You CANNOT move a running VM between VNets. You must delete the VM (keeping the OS disk), then recreate it attached to a NIC in VNet2.' },
            { statement: 'What to keep', answer: 'Disk1 (OS disk)', explanation: 'Keep the managed disk. When you recreate the VM in VNet2, attach the existing disk so you keep the custom application and data.' }
        ]
    },
    259: {
        type: 'dropdown',
        title: 'App Service Plans for Web Apps',
        items: [
            { statement: 'Web app OS and plan OS must match', answer: 'Yes', explanation: 'A Windows web app must use a Windows App Service plan. A Linux web app must use a Linux App Service plan. They cannot be mixed.' },
            { statement: 'Web app region and plan region must match', answer: 'Yes', explanation: 'An App Service plan is region-specific. Web apps can only be created in plans within the same region.' }
        ]
    },
    260: {
        type: 'dropdown',
        title: 'VM Scale Set Configuration',
        items: [
            { statement: 'Instance count behavior', answer: 'Based on scaling rules shown in exhibit', explanation: 'VMSS autoscale rules define when to scale out (add instances) and scale in (remove instances) based on metrics like CPU percentage.' },
            { statement: 'Upgrade policy', answer: 'Based on exhibit (Manual/Rolling/Automatic)', explanation: 'Manual = you trigger upgrades. Rolling = instances upgrade in batches. Automatic = all instances upgrade simultaneously.' }
        ]
    },
    262: {
        type: 'dropdown',
        title: 'Install kubectl via Azure CLI',
        items: [
            { statement: 'Command to install kubectl', answer: 'az aks install-cli', explanation: 'The az aks install-cli command downloads and installs kubectl (and optionally kubelogin) on the local machine.' },
            { statement: 'Command to get cluster credentials', answer: 'az aks get-credentials', explanation: 'After installing kubectl, run az aks get-credentials --resource-group <RG> --name <cluster> to configure kubectl to connect to the AKS cluster.' }
        ]
    },
    275: {
        type: 'yesno',
        title: 'VM Deployment Quotas',
        items: [
            { statement: 'VM5 can be deployed (check quota for its size/region)', answer: 'Check if total vCPU count exceeds regional quota', explanation: 'Azure subscriptions have vCPU quotas per region and per VM family. Total deployed vCPUs + new VM vCPUs must not exceed the quota.' },
            { statement: 'VM6 can be deployed', answer: 'Check remaining quota after existing deployments', explanation: 'Calculate: existing VMs vCPUs + new VM vCPUs ≤ quota limit. If exceeded, deployment fails with quota error.' },
            { statement: 'You can request quota increase', answer: 'Yes', explanation: 'Azure quota limits are soft limits that can be increased by submitting a support request through the Azure portal.' }
        ]
    },
    276: {
        type: 'dropdown',
        title: 'Availability Set – Fault & Update Domains',
        items: [
            { statement: 'Maximum VMs guaranteed to be available during planned maintenance', answer: '14 - (14/update domains) — at least 14 - floor(14/updateDomains)', explanation: 'During planned maintenance, one update domain goes offline at a time. With 14 VMs distributed across update domains, most remain available.' },
            { statement: 'Maximum VMs that can be unavailable during unplanned hardware failure', answer: 'VMs in one fault domain = ceil(14/fault domains)', explanation: 'A fault domain shares a common power source and network switch. One FD failure takes down all VMs in that FD. With 2 FDs: max 7 VMs down. With 3 FDs: max 5 VMs down.' }
        ]
    },
    279: {
        type: 'dropdown',
        title: 'Azure Container Instance – ARM Template',
        items: [
            { statement: 'Container port', answer: 'Based on ports section in template', explanation: 'The container instance exposes the port defined in the "ports" array of the ARM template. This allows inbound traffic on that port.' },
            { statement: 'OS type', answer: 'Based on "osType" property (Linux or Windows)', explanation: 'The osType property determines the container host OS. Linux containers are more common and cost-effective.' }
        ]
    },
    285: {
        type: 'dropdown',
        title: 'Azure Budget & Action Groups',
        items: [
            { statement: 'When alert is triggered', answer: 'When forecasted/actual cost exceeds threshold percentage', explanation: 'Budget alerts fire when spending reaches the configured percentage thresholds (e.g., 80%, 100%, 120% of budget).' },
            { statement: 'What action is taken', answer: 'Email sent to admin@contoso.com via AG1', explanation: 'The action group AG1 contains admin@contoso.com. When the budget alert fires, an email notification is sent to this address.' }
        ]
    },
    289: {
        type: 'yesno',
        title: 'Move Web App Between Subscriptions',
        items: [
            { statement: 'App1 can be moved to a resource group in Subscription2', answer: 'Yes', explanation: 'Web apps can be moved between resource groups and subscriptions, but ALL App Service resources in the same plan must move together.' },
            { statement: 'App1 can be moved to a different region', answer: 'No', explanation: 'Moving a resource between resource groups/subscriptions does NOT change its region. To change region, you must recreate the app.' },
            { statement: 'The App Service plan must move with App1', answer: 'Yes', explanation: 'When moving a web app, the entire App Service plan and all apps in that plan must move together. You cannot separate them.' }
        ]
    },
    290: {
        type: 'yesno',
        title: 'Azure Policy – Append Tag to New Resources',
        items: [
            { statement: 'The new storage account has tag1: value1', answer: 'No', explanation: 'Tags assigned to a resource group are NOT automatically inherited by resources in it. The storage account gets tag2:value2 from the policy, not tag1:value1 from RG1.' },
            { statement: 'The new storage account has tag2: value2', answer: 'Yes', explanation: 'The "Append a tag and its value to resources" policy adds tag2:value2 to all new resources created in the policy scope (Subscription1).' },
            { statement: 'RG1 has tag2: value2', answer: 'No', explanation: 'The policy targets resources, not resource groups. Resource groups are a different resource type and are not affected by this specific policy unless explicitly included.' }
        ]
    },
    291: {
        type: 'dropdown',
        title: 'Alert Rule – Action Group Rate Limiting',
        items: [
            { statement: 'How many emails are sent in 10 minutes', answer: 'Maximum 1 email per 5 minutes (rate-limited)', explanation: 'Azure Monitor enforces rate limiting: max 1 email per 5 minutes per action group, max 100 emails per hour. Even if alert fires every minute.' },
            { statement: 'SMS rate limiting', answer: 'No more than 1 SMS every 5 minutes', explanation: 'SMS notifications are rate-limited to 1 per 5 minutes. Voice calls are limited to 1 per 5 minutes as well.' }
        ]
    },
    300: {
        type: 'dropdown',
        title: 'Effective NSG Rules – VM1',
        items: [
            { statement: 'Can connect to web server on port 80', answer: 'Check if Allow rule for port 80 exists with higher priority than any Deny', explanation: 'NSG rules are evaluated by priority (lowest number = highest priority). An Allow rule at priority 100 overrides a Deny at priority 200.' },
            { statement: 'Can connect to DNS on port 53', answer: 'Check inbound rules for port 53 (TCP/UDP)', explanation: 'DNS uses port 53. Check if there is an explicit Allow rule for port 53. Default rules deny all inbound except VNet-to-VNet and load balancer.' }
        ]
    },
    305: {
        type: 'dropdown',
        title: 'AKS Network Profile',
        items: [
            { statement: 'Network plugin type', answer: 'Check exhibit for azure (Azure CNI) or kubenet', explanation: 'Azure CNI: pods get VNet IPs directly. Kubenet: pods use an overlay network. Azure CNI requires more IPs but provides direct VNet connectivity.' },
            { statement: 'DNS service IP', answer: 'Must be within the service CIDR range', explanation: 'The DNS service IP is used by CoreDNS. It must be within the service address range (--service-cidr) but NOT the first IP (.1) of that range.' }
        ]
    },
    306: {
        type: 'dropdown',
        title: 'App Service Autoscale Rules',
        items: [
            { statement: 'Scale out trigger', answer: 'Based on metric threshold and duration in exhibit', explanation: 'Scale out occurs when the metric (e.g., CPU > 70%) is sustained for the specified duration. The cool down prevents rapid re-scaling.' },
            { statement: 'Scale in trigger', answer: 'Based on metric threshold (e.g., CPU < 30%) and same duration', explanation: 'Scale in removes instances when load decreases below the threshold for the configured duration. Cool down applies after each scale action.' }
        ]
    },
    309: {
        type: 'dropdown',
        title: 'VMSS – Get-AzVmss Output',
        items: [
            { statement: 'Capacity/instance count', answer: 'Check sku.capacity in the output', explanation: 'The sku.capacity property shows the current number of instances in the scale set.' },
            { statement: 'Upgrade policy', answer: 'Check upgradePolicy.mode in the output', explanation: 'upgradePolicy.mode shows Manual, Rolling, or Automatic. This determines how OS/app updates are applied to instances.' }
        ]
    },
    312: {
        type: 'dropdown',
        title: 'Azure Backup – VM Restore Locations',
        items: [
            { statement: 'Restore disks to', answer: 'Any resource group in the same subscription and region', explanation: 'When restoring VM disks, you can restore to any resource group, but it must be in the same subscription and same region as the vault.' },
            { statement: 'Restore to a new VM in', answer: 'Same region as the vault (any resource group/VNet in that region)', explanation: 'Creating a new VM from backup requires the target to be in the same region as the Recovery Services vault.' }
        ]
    },
    315: {
        type: 'dropdown',
        title: 'Availability Set – Maximum Domains',
        items: [
            { statement: 'platformFaultDomainCount', answer: '3 (maximum for most regions) or 2', explanation: 'Most Azure regions support up to 3 fault domains. Some regions only support 2. This maximizes availability during hardware failures.' },
            { statement: 'platformUpdateDomainCount', answer: '20 (maximum)', explanation: 'Azure supports up to 20 update domains. Setting to 20 means during planned maintenance, at most 1/20th of VMs are offline simultaneously.' }
        ]
    },
    317: {
        type: 'dropdown',
        title: 'VMSS Configuration',
        items: [
            { statement: 'Initial instance count', answer: 'Based on exhibit "capacity" value', explanation: 'The instance count is the number of VMs initially deployed in the scale set, visible in the exhibit configuration.' },
            { statement: 'Scaling mode', answer: 'Based on exhibit (Manual or Autoscale)', explanation: 'Manual = you set instance count. Autoscale = rules automatically adjust count based on metrics.' }
        ]
    },
    320: {
        type: 'dropdown',
        title: 'ARM Template Deployment Command',
        items: [
            { statement: 'Command', answer: 'New-AzResourceGroupDeployment (or az deployment group create)', explanation: 'To deploy a template to a resource group, use New-AzResourceGroupDeployment in PowerShell or az deployment group create in CLI.' },
            { statement: 'Parameter for template file', answer: '-TemplateFile', explanation: 'The -TemplateFile parameter specifies the path to the ARM template JSON file.' },
            { statement: 'Parameter for resource group', answer: '-ResourceGroupName', explanation: 'Specify which resource group to deploy into using -ResourceGroupName parameter.' }
        ]
    },
    325: {
        type: 'dropdown',
        title: 'ARM Template – Multiple Data Disks',
        items: [
            { statement: 'Copy element for data disks', answer: '"copy" loop in the dataDisks array', explanation: 'Use the "copy" element within the dataDisks property to create multiple data disks dynamically based on a count parameter.' },
            { statement: 'diskSizeGB property', answer: 'Size in GB for each data disk', explanation: 'Each data disk in the array needs diskSizeGB to specify its capacity. createOption should be "Empty" for new disks.' }
        ]
    },
    330: {
        type: 'dropdown',
        title: 'App Service Backup – Exclude Folder',
        items: [
            { statement: 'Create first', answer: 'A storage account (or storage container) for backup destination', explanation: 'App Service backups require an Azure Storage account with a blob container as the backup destination. This must exist before configuring backup.' },
            { statement: 'Exclude Folder2', answer: '_backup.filter file in the site root', explanation: 'Create a _backup.filter file in D:\\home\\site\\wwwroot. Add the folder path to exclude (e.g., \\Folder2). This tells Azure Backup to skip that folder.' }
        ]
    },
    332: {
        type: 'dropdown',
        title: 'ARM Template – Domain Join Extension',
        items: [
            { statement: 'Extension type', answer: 'JsonADDomainExtension', explanation: 'The JsonADDomainExtension VM extension joins a Windows VM to an Active Directory domain during deployment.' },
            { statement: 'Publisher', answer: 'Microsoft.Compute', explanation: 'The publisher for the domain join extension is Microsoft.Compute.' },
            { statement: 'domainJoinOptions', answer: '3 (join domain and create computer account)', explanation: 'domainJoinOptions value 3 = NETSETUP_JOIN_DOMAIN (1) + NETSETUP_ACCT_CREATE (2). This joins the domain and creates the computer account.' }
        ]
    },
    334: {
        type: 'dropdown',
        title: 'AKS Cluster Configuration',
        items: [
            { statement: 'Network plugin', answer: 'Based on exhibit settings', explanation: 'The network plugin determines pod networking: Azure CNI (pods get VNet IPs) or Kubenet (pods use overlay network with NAT).' },
            { statement: 'Node pool OS', answer: 'Based on exhibit (Linux or Windows)', explanation: 'AKS system node pools must be Linux. Windows node pools are supported as user node pools for Windows container workloads.' }
        ]
    },
    335: {
        type: 'dropdown',
        title: 'AKS Coordinated Upgrade – Max Surge',
        items: [
            { statement: 'max-surge parameter', answer: '2', explanation: 'max-surge: 2 deploys 2 extra nodes during upgrade (surge nodes). Workloads are moved to surge nodes, then old nodes are cordoned and drained.' },
            { statement: 'Command', answer: 'az aks nodepool upgrade --max-surge 2', explanation: 'The az aks nodepool upgrade command with --max-surge specifies how many additional nodes to deploy during the upgrade process.' }
        ]
    },
    336: {
        type: 'yesno',
        title: 'ARM Template Deployment Results',
        items: [
            { statement: 'Deployment creates the resource group specified', answer: 'Depends on deployment scope', explanation: 'If using subscription-level deployment (New-AzDeployment) with Microsoft.Resources/resourceGroups in template, yes. If resource-group-level, the RG must exist.' },
            { statement: 'Resources are created in the specified location', answer: 'Yes', explanation: 'Resources are created in the location specified in the template or parameter. The deployment location is just for metadata.' },
            { statement: 'Template validates before deployment', answer: 'Yes', explanation: 'ARM validates the template syntax and checks resource provider availability before starting deployment. Invalid templates fail at validation.' }
        ]
    },
    338: {
        type: 'dropdown',
        title: 'ARM Deployment – Complete Mode',
        items: [
            { statement: 'Deployment mode', answer: '-Mode Complete', explanation: 'Complete mode DELETES all existing resources in the resource group that are NOT in the template. Only resources defined in the template remain.' },
            { statement: 'Command', answer: 'New-AzResourceGroupDeployment -Mode Complete', explanation: 'Use -Mode Complete parameter. Default is Incremental (which only adds/updates, never deletes). Complete mode removes everything not in template.' }
        ]
    },
    339: {
        type: 'dropdown',
        title: 'App Service Autoscale',
        items: [
            { statement: 'Maximum instances', answer: 'Based on "Maximum" value in autoscale settings exhibit', explanation: 'The Maximum instance count sets the upper limit for scale-out. Autoscale will never exceed this number regardless of load.' },
            { statement: 'Scale out when', answer: 'Metric exceeds threshold for specified duration', explanation: 'Scale-out triggers when the metric (CPU/memory/requests) exceeds the configured threshold consistently for the time window.' }
        ]
    },
    341: {
        type: 'dropdown',
        title: 'Container Registry – Dedicated Data Endpoint',
        items: [
            { statement: 'Setting 1', answer: 'Upgrade to Premium SKU', explanation: 'Dedicated data endpoints require the Premium tier container registry. Basic and Standard tiers do not support this feature.' },
            { statement: 'Setting 2', answer: 'Enable dedicated data endpoints', explanation: 'Once on Premium, enable the dedicated data endpoint setting. This provides a separate FQDN for data operations (pulls) to avoid throttling on the management endpoint.' }
        ]
    },
    343: {
        type: 'dropdown',
        title: 'ARM Template – VM Deployment',
        items: [
            { statement: 'Resource type', answer: 'Microsoft.Compute/virtualMachines', explanation: 'The VM resource type in ARM templates is Microsoft.Compute/virtualMachines.' },
            { statement: 'Required properties', answer: 'hardwareProfile, storageProfile, osProfile, networkProfile', explanation: 'A VM requires: hardwareProfile (size), storageProfile (disks), osProfile (admin credentials, computer name), networkProfile (NIC reference).' }
        ]
    },
    344: {
        type: 'dropdown',
        title: 'App Service – Custom Domain & Scaling',
        items: [
            { statement: 'Pricing plan', answer: 'Standard S1 (minimum that supports custom domains + autoscale up to 10 instances)', explanation: 'Standard tier supports custom domains, SSL, autoscale up to 10 instances. Basic supports custom domains but only 3 instances max. Need S1 for up to 8 instances.' },
            { statement: 'DNS record type for domain verification', answer: 'TXT record', explanation: 'Azure App Service uses a TXT record (asuid.<domain>) for domain ownership verification. After verification, you add a CNAME or A record for routing.' }
        ]
    },
    345: {
        type: 'yesno',
        title: 'Azure Compute Gallery – Image Definition',
        items: [
            { statement: 'VM1 can use Image1', answer: 'Check if VM1 region matches a replica region of Image1', explanation: 'A VM can only use a gallery image if the image has a version replicated to the same region as the VM.' },
            { statement: 'VM2 can use Image1', answer: 'Check OS type and generation match', explanation: 'The VM must be compatible with the image definition OS type (Windows/Linux) and Hyper-V generation (Gen1/Gen2).' },
            { statement: 'Image can be shared across subscriptions', answer: 'Yes (with RBAC permissions)', explanation: 'Azure Compute Gallery supports cross-subscription and cross-tenant sharing through RBAC role assignments or community galleries.' }
        ]
    },
    347: {
        type: 'yesno',
        title: 'ARM Template Deployment',
        items: [
            { statement: 'Deployment succeeds', answer: 'Check for valid resource names and correct API versions', explanation: 'ARM template deployments fail if resource names are invalid, API versions are wrong, or dependencies are missing.' },
            { statement: 'Resources created in correct location', answer: 'Check location parameter or resourceGroup().location', explanation: 'The location of resources depends on the template. [resourceGroup().location] uses the RG location. Explicit location overrides.' },
            { statement: 'Resources inherit RG tags', answer: 'No', explanation: 'Resources do NOT inherit resource group tags automatically. Tags must be explicitly set on each resource or enforced via policy.' }
        ]
    },
    349: {
        type: 'dropdown',
        title: 'Container Services Compatibility',
        items: [
            { statement: 'Azure Container Instances supports', answer: 'Linux and Windows containers', explanation: 'ACI supports both Linux and Windows containers. However, GPU resources are only available for Linux containers.' },
            { statement: 'Azure Container Apps supports', answer: 'Linux containers only', explanation: 'Azure Container Apps currently only supports Linux-based container images. Windows containers are not supported.' },
            { statement: 'Azure App Service supports', answer: 'Linux and Windows containers (separate plans)', explanation: 'App Service supports both Linux and Windows containers, but they must be in separate App Service plans (OS-specific).' }
        ]
    },
    354: {
        type: 'yesno',
        title: 'ARM Template – Subscription-Level Deployment',
        items: [
            { statement: 'Creates a resource group', answer: 'Yes (if template contains Microsoft.Resources/resourceGroups)', explanation: 'New-AzDeployment deploys at subscription level. If the template defines a resource group resource, it will be created.' },
            { statement: 'Resource group location is West US', answer: 'Check the location property in the template RG resource', explanation: 'The -Location westus parameter is the deployment metadata location, NOT necessarily the resource group location. The RG location is defined in the template.' },
            { statement: 'Nested resources are deployed', answer: 'Yes (if template has nested deployments)', explanation: 'Subscription-level templates can include nested deployments (Microsoft.Resources/deployments) to deploy resources into the created resource group.' }
        ]
    },
    356: {
        type: 'yesno',
        title: 'VNet Communication – VMs & Web Apps',
        items: [
            { statement: 'VM1 can communicate with VM2', answer: 'Only if their VNets are peered or connected', explanation: 'VMs in different VNets cannot communicate unless VNet peering, VPN gateway, or other connectivity is configured.' },
            { statement: 'WebApp1 can communicate with VM1', answer: 'Only with VNet Integration configured', explanation: 'App Service web apps need VNet Integration (regional) to communicate with resources in a VNet. Without it, they can only reach public endpoints.' },
            { statement: 'WebApp1 can communicate with WebApp2', answer: 'Yes (via public endpoints)', explanation: 'Web apps have public endpoints by default. They can communicate with each other over the internet without VNet configuration.' }
        ]
    },
    360: {
        type: 'dropdown',
        title: 'Container Registry – ACR Tasks & Private Endpoints',
        items: [
            { statement: 'ACR Tasks supported on', answer: 'All tiers (Basic, Standard, Premium)', explanation: 'ACR Tasks (automated image builds) are supported on all container registry tiers: Basic, Standard, and Premium.' },
            { statement: 'Private endpoints supported on', answer: 'Premium tier only', explanation: 'Private endpoints (Private Link) for container registries require the Premium SKU. Basic and Standard do not support private endpoints.' }
        ]
    },
    364: {
        type: 'dropdown',
        title: 'ACR – Create Registry & Push Image',
        items: [
            { statement: 'Create registry command', answer: 'az acr create', explanation: 'az acr create --name <name> --resource-group <rg> --sku Basic creates a new Azure Container Registry.' },
            { statement: 'Push image command', answer: 'az acr build (or docker push after docker tag + az acr login)', explanation: 'az acr build --registry <name> --image image1:latest . builds and pushes directly. Alternatively: az acr login + docker tag + docker push.' }
        ]
    },
    374: {
        type: 'dropdown',
        title: 'Load Balancing & WAF',
        items: [
            { statement: 'Spread traffic equally to web servers', answer: 'Azure Load Balancer (or Application Gateway)', explanation: 'A load balancer distributes incoming traffic across backend VMs. Use Standard Load Balancer for production workloads.' },
            { statement: 'Protect from SQL injection', answer: 'Azure Web Application Firewall (WAF) on Application Gateway', explanation: 'WAF protects web applications from common exploits like SQL injection, XSS. It runs on Application Gateway or Azure Front Door.' }
        ]
    },
    376: {
        type: 'dropdown',
        title: 'NICs and NSGs – Minimum Required',
        items: [
            { statement: 'Minimum network interfaces', answer: '5 (one per VM)', explanation: 'Each VM requires at least one NIC. 5 VMs = 5 NICs minimum. Each NIC can have its own public and private IP.' },
            { statement: 'Minimum network security groups', answer: '1', explanation: 'Since all VMs need the SAME security rules, one NSG can be associated with the subnet. All VMs in that subnet inherit the rules.' }
        ]
    },
    378: {
        type: 'dropdown',
        title: 'Private DNS Zone – Auto Registration',
        items: [
            { statement: 'A record for VM1 (in VNET1)', answer: 'Yes – auto-registered', explanation: 'VM1 is in VNET1, and auto-registration is enabled from VNET1 to adatum.com zone. Its private IP is automatically registered as an A record.' },
            { statement: 'A record for VM2 (in VNET1)', answer: 'Yes – auto-registered', explanation: 'VM2 is also in VNET1, so it is auto-registered in the adatum.com zone with its private IP.' },
            { statement: 'A record for VM3 (in different VNet)', answer: 'No – not auto-registered', explanation: 'Only VMs in VNets with auto-registration enabled for this zone get A records. If VM3 is in a different VNet without registration link, no record is created.' }
        ]
    },
    379: {
        type: 'dropdown',
        title: 'Load Balancer Diagnostics – NSG Flow Logs',
        items: [
            { statement: 'What to enable', answer: 'NSG flow logs (on NSG1)', explanation: 'NSG flow logs capture information about IP traffic flowing through an NSG, including source/destination IP, port, protocol, and whether traffic was allowed/denied.' },
            { statement: 'Where to query data', answer: 'Log Analytics workspace (using Traffic Analytics)', explanation: 'NSG flow logs can be sent to a Log Analytics workspace. Traffic Analytics processes them and provides interactive queries in the Azure portal.' }
        ]
    },
    383: {
        type: 'yesno',
        title: 'Public & Private DNS Zones',
        items: [
            { statement: 'VM1 can resolve records in contoso.com private zone', answer: 'Yes (if VNet link exists with resolution)', explanation: 'VMs in a VNet linked to a private DNS zone can resolve records in that zone using Azure-provided DNS (168.63.129.16).' },
            { statement: 'VM1 is auto-registered in contoso.com', answer: 'Check if auto-registration is enabled on the VNet link', explanation: 'Only VNets with "Enable auto registration" turned on in the virtual network link will have VMs automatically registered.' },
            { statement: 'External users can resolve adatum.com public zone', answer: 'Yes', explanation: 'Public DNS zones are resolvable by anyone on the internet, assuming proper NS delegation is configured at the domain registrar.' }
        ]
    },
    386: {
        type: 'yesno',
        title: 'Move Resources Between Resource Groups',
        items: [
            { statement: 'VM1 can be moved to RG2', answer: 'Yes (all dependent resources must move together)', explanation: 'VMs can be moved between resource groups. The NIC, disk, and other dependent resources must move with the VM (or already exist in target RG).' },
            { statement: 'NIC1 can be moved to RG2', answer: 'Yes (if VM1 is also moved or NIC is detached)', explanation: 'A NIC attached to a VM must move with the VM. You cannot move the NIC alone while it is attached.' },
            { statement: 'IP2 from RG2 can be moved to RG1', answer: 'Yes (unassigned IPs can move freely)', explanation: 'IP2 is not assigned to any VM, so it can be freely moved between resource groups within the same subscription.' }
        ]
    },
    393: {
        type: 'dropdown',
        title: 'VNet Configuration',
        items: [
            { statement: 'Address space allows X subnets/hosts', answer: 'Based on the CIDR notation shown in exhibit', explanation: 'The address space CIDR determines total IPs. Subnets divide this space. Azure reserves 5 IPs per subnet (first 4 + last 1).' },
            { statement: 'Subnets configuration', answer: 'Check exhibit for subnet names and address ranges', explanation: 'Each subnet must be within the VNet address space and cannot overlap with other subnets. Azure reserves 5 addresses per subnet.' }
        ]
    },
    398: {
        type: 'yesno',
        title: 'Internal Load Balancer – Basic SKU',
        items: [
            { statement: 'LB1 can load balance VM1', answer: 'Check if VM1 is in Subnet12 and same VNet', explanation: 'A Basic internal LB requires backend VMs to be in the same virtual network. VMs must be in the same availability set or VMSS.' },
            { statement: 'LB1 can load balance VM2', answer: 'Check if VM2 is in VNET1 and same availability set', explanation: 'Basic Load Balancer requires all backend pool VMs to be in the SAME availability set or VMSS. Mixed is not allowed.' },
            { statement: 'LB1 can load balance VMs from VNET2', answer: 'No', explanation: 'Basic internal load balancer only works within a single VNet. It cannot load balance VMs in different virtual networks.' }
        ]
    },
    399: {
        type: 'dropdown',
        title: 'DNS Zones – Link & Auto Registration',
        items: [
            { statement: 'Which zones can be linked to VNET1', answer: 'Both private DNS zones (adatum.com and contoso.com)', explanation: 'A VNet can be linked to multiple private DNS zones. However, a VNet can only have auto-registration enabled for ONE private zone.' },
            { statement: 'VM1 can auto-register in', answer: 'Only ONE zone (max one registration VNet link per VNet)', explanation: 'A virtual network can only be linked as a registration network to ONE private DNS zone. Resolution links have no such limit.' }
        ]
    },
    404: {
        type: 'dropdown',
        title: 'Add VM to VMSS (Flexible Orchestration)',
        items: [
            { statement: 'Resource group for VM1', answer: 'Same resource group as VMSS1', explanation: 'VMs added to a Flexible VMSS must be in the same resource group as the scale set.' },
            { statement: 'Location for VM1', answer: 'Same region as VMSS1', explanation: 'VMs must be in the same Azure region as the VMSS they are being added to.' }
        ]
    },
    405: {
        type: 'dropdown',
        title: 'VNet Peering – Routing Between Networks',
        items: [
            { statement: 'VNET1 to VNET2', answer: 'Check if peering exists and is Connected on both sides', explanation: 'Peering must be configured on BOTH VNets and show "Connected" status. If one side is not configured or is disconnected, no traffic flows.' },
            { statement: 'VNET1 to VNET3', answer: 'Check for direct peering or transit', explanation: 'VNet peering is NOT transitive. If VNET1↔VNET2 and VNET2↔VNET3, VNET1 cannot reach VNET3 unless VNET1↔VNET3 peering exists or a hub/gateway is used.' },
            { statement: 'VNET2 to VNET3', answer: 'Check for direct peering between them', explanation: 'Same rule: direct peering must exist between VNET2 and VNET3, or a gateway/NVA transit must be configured.' }
        ]
    },
    411: {
        type: 'yesno',
        title: 'NSG Rules & Network Watcher',
        items: [
            { statement: 'Traffic is allowed based on NSG rules', answer: 'Check rule priorities – lower number = higher priority', explanation: 'Network Watcher IP flow verify shows which NSG rule allows/denies specific traffic. Rules are evaluated in priority order (100 before 200).' },
            { statement: 'The effective rule is shown by Network Watcher', answer: 'Yes', explanation: 'Network Watcher shows the specific security rule name that allows or denies the tested traffic flow, making it easy to identify the effective rule.' },
            { statement: 'Both subnet-level and NIC-level NSGs are evaluated', answer: 'Yes', explanation: 'Inbound traffic passes through subnet NSG first, then NIC NSG. Traffic must be allowed by BOTH. Outbound is NIC NSG first, then subnet NSG.' }
        ]
    },
    415: {
        type: 'dropdown',
        title: 'VNet Peering Configuration',
        items: [
            { statement: 'Traffic forwarding', answer: 'Based on "Allow forwarded traffic" setting in exhibit', explanation: 'If "Allow forwarded traffic" is enabled, traffic originating from outside the peered VNet (e.g., from NVA) can flow through the peering.' },
            { statement: 'Gateway transit', answer: 'Based on "Allow gateway transit" / "Use remote gateways" in exhibit', explanation: 'Gateway transit allows one VNet to use the other VNet VPN/ExpressRoute gateway. One side enables "Allow gateway transit", the other "Use remote gateways".' }
        ]
    },
    416: {
        type: 'yesno',
        title: 'Load Balancer Rules & Backend Pool',
        items: [
            { statement: 'Traffic reaches VM1 on the configured port', answer: 'Check LB rule frontend port → backend port mapping', explanation: 'The load balancing rule maps frontend IP:port to backend pool VMs on the backend port. Verify the port matches what IIS is listening on (usually 80).' },
            { statement: 'Health probe marks VMs as healthy', answer: 'Check probe port and protocol match the service', explanation: 'If the health probe checks a port/path that the VM responds to, it is marked healthy. Unhealthy VMs are removed from rotation.' },
            { statement: 'Session persistence is configured', answer: 'Check Rule1 for session persistence setting', explanation: 'None = round-robin. Client IP = same client always goes to same VM. Client IP and protocol = adds protocol to the hash.' }
        ]
    },
    417: {
        type: 'dropdown',
        title: 'Standard Load Balancer – VM Requirements',
        items: [
            { statement: 'Public IP SKU change needed', answer: 'Upgrade to Standard SKU public IP', explanation: 'Standard Load Balancer requires Standard SKU public IP addresses. Basic SKU public IPs are NOT compatible with Standard LB.' },
            { statement: 'Availability set requirement', answer: 'VM must be in an availability set or zone (or standalone)', explanation: 'Standard LB supports VMs in availability sets, availability zones, or standalone VMs. No restriction like Basic LB.' },
            { statement: 'NSG requirement', answer: 'NSG is required on the NIC or subnet', explanation: 'Standard LB requires an NSG to allow traffic. Without an NSG explicitly allowing traffic, Standard LB blocks all inbound by default (zero-trust model).' }
        ]
    },
    420: {
        type: 'dropdown',
        title: 'Network Watcher Features',
        items: [
            { statement: 'Task1: Identify blocking security rule', answer: 'IP flow verify', explanation: 'IP flow verify checks if a packet is allowed or denied by NSG rules and tells you which specific rule caused the allow/deny decision.' },
            { statement: 'Task2: Validate outbound connectivity to external host', answer: 'Connection troubleshoot (Next hop for routing)', explanation: 'Connection troubleshoot tests connectivity from a VM to a destination (external host) and reports if the connection succeeds, latency, and any blocking issues.' }
        ]
    },
    421: {
        type: 'yesno',
        title: 'DNS Server Configuration – VNet vs NIC',
        items: [
            { statement: 'VM1 uses the DNS server configured on its NIC', answer: 'Yes (NIC-level DNS overrides VNet-level)', explanation: 'If DNS servers are configured on the NIC, they take precedence over VNet-level DNS settings. The VM uses NIC DNS first.' },
            { statement: 'VM2 uses the VNet-level DNS server', answer: 'Yes (if no NIC-level DNS is configured)', explanation: 'VMs without NIC-specific DNS settings inherit the VNet-level DNS configuration. This is the fallback behavior.' },
            { statement: 'VMs can resolve both internal and external names', answer: 'Depends on DNS server capabilities', explanation: 'If the custom DNS server (192.168.10.15) forwards queries it cannot resolve to a public DNS, VMs can resolve both internal and external names.' }
        ]
    },
    422: {
        type: 'dropdown',
        title: 'Move Resources Between Resource Groups',
        items: [
            { statement: 'Which resources can move from RG1 to RG2', answer: 'VM, NIC, Disk, VNet (all dependent resources together)', explanation: 'VMs and their dependencies (NIC, disk) can move between RGs. VNets can also move. All dependent resources must move together.' },
            { statement: 'Which resources from RG2 can move to RG1', answer: 'Public IP (if unassigned) and other independent resources', explanation: 'Independent resources like unassigned public IPs can freely move. Resources with cross-RG dependencies may have restrictions.' }
        ]
    },
    429: {
        type: 'yesno',
        title: 'VNet Peering – Address Space Overlap',
        items: [
            { statement: 'VNet1 can peer with VNet2', answer: 'Check for overlapping address spaces', explanation: 'VNet peering FAILS if the VNets have overlapping IP address spaces. Even partial overlap (one subnet) blocks the entire peering.' },
            { statement: 'VNet1 can peer with VNETA (cross-subscription)', answer: 'Yes (if no address overlap)', explanation: 'VNet peering works across subscriptions and even across tenants. The only hard requirement is non-overlapping address spaces.' },
            { statement: 'Subnets in different VNets must not overlap', answer: 'The VNet address SPACES must not overlap', explanation: 'Peering validates at the address space level, not individual subnets. If VNet address spaces overlap at all, peering cannot be created.' }
        ]
    },
    438: {
        type: 'dropdown',
        title: 'VMs for Load Balancers – SKU Requirements',
        items: [
            { statement: 'VMs for Standard LB', answer: 'Must have Standard public IP (or no public IP) + NSG', explanation: 'Standard LB requires: Standard SKU public IPs on VMs (or none), VMs in same VNet, and an NSG to allow traffic.' },
            { statement: 'VMs for Basic LB', answer: 'Must be in same availability set (or VMSS)', explanation: 'Basic LB requires all backend VMs to be in the same availability set or virtual machine scale set.' }
        ]
    },
    439: {
        type: 'dropdown',
        title: 'Site-to-Site VPN – High Availability',
        items: [
            { statement: 'Minimum public IP addresses', answer: '2 (one per VPN gateway instance in active-active)', explanation: 'Active-active VPN gateway requires 2 public IPs (one per gateway instance). Each connects to one on-premises VPN device.' },
            { statement: 'Minimum local network gateways', answer: '2 (one per on-premises VPN device)', explanation: 'Each on-premises VPN device is represented by a local network gateway. Two devices = two local network gateways.' },
            { statement: 'Gateway SKU needed', answer: 'VpnGw1 or higher (supports active-active)', explanation: 'Active-active mode requires VpnGw1 or higher SKU. Basic SKU does NOT support active-active configuration.' }
        ]
    },
    443: {
        type: 'yesno',
        title: 'Private DNS Zone – Registration & Resolution',
        items: [
            { statement: 'VMs in VNet2 are auto-registered', answer: 'Yes (VNet2 is the registration network)', explanation: 'The registration virtual network for adatum.com is VNet2. VMs in VNet2 automatically create A records in the zone.' },
            { statement: 'VMs in VNet1 can resolve records in adatum.com', answer: 'Only if VNet1 has a resolution link to the zone', explanation: 'Resolution requires a virtual network link. Without a link, VNet1 VMs cannot resolve names in the private zone.' },
            { statement: 'Manual records are visible to linked VNets', answer: 'Yes', explanation: 'All manually created records (like the A record shown in the exhibit) are visible to all VNets linked to the zone (both registration and resolution links).' }
        ]
    },
    444: {
        type: 'yesno',
        title: 'Private DNS – Multiple Zones & VNet Links',
        items: [
            { statement: 'VMs in VNet1 can resolve Zone1 records', answer: 'Check if VNet1 is linked to Zone1', explanation: 'VMs can only resolve private DNS zone records if their VNet has a virtual network link (registration or resolution) to that zone.' },
            { statement: 'VMs in VNet2 auto-register in Zone2', answer: 'Check if VNet2 link to Zone2 has auto-registration enabled', explanation: 'Auto-registration only occurs on links explicitly configured with "Enable auto registration". A resolution-only link does not register VMs.' },
            { statement: 'A VNet can link to both Zone1 and Zone2', answer: 'Yes (but auto-registration in only ONE zone)', explanation: 'A VNet can have resolution links to multiple zones but can only have auto-registration enabled for ONE zone at a time.' }
        ]
    },
    445: {
        type: 'dropdown',
        title: 'ARM Template – Azure Bastion Subnet',
        items: [
            { statement: 'Subnet name', answer: 'AzureBastionSubnet', explanation: 'Azure Bastion REQUIRES a subnet named exactly "AzureBastionSubnet". No other name is accepted.' },
            { statement: 'Minimum subnet size', answer: '/26 (64 addresses)', explanation: 'AzureBastionSubnet must be at least /26. Microsoft recommends /26 or larger for Standard SKU (supports host scaling).' }
        ]
    },
    453: {
        type: 'yesno',
        title: 'Private DNS & Custom DNS Resolution',
        items: [
            { statement: 'VM1 can resolve records in contoso.com private zone', answer: 'Check if VNET1 uses Azure DNS (168.63.129.16) or custom DNS', explanation: 'Private DNS zones only work when VMs use Azure-provided DNS. If a VNet uses a custom DNS server, that server must forward to 168.63.129.16 for private zone resolution.' },
            { statement: 'VM2 resolves contoso.com from Server1 DNS', answer: 'Only if Server1 has the record or forwards to Azure DNS', explanation: 'If VNET2 uses Server1 as DNS, queries go to Server1 first. Server1 must either have the record or conditionally forward to 168.63.129.16.' },
            { statement: 'Auto-registered records are available', answer: 'Only to VNets with links using Azure DNS', explanation: 'Auto-registered records exist in the private zone. VMs can only see them if their DNS resolution path includes Azure DNS (directly or via forwarder).' }
        ]
    },
    456: {
        type: 'dropdown',
        title: 'NSG Rule – Allow ICMP (Ping)',
        items: [
            { statement: 'Protocol', answer: 'ICMP', explanation: 'Ping uses ICMP (Internet Control Message Protocol). Select ICMP as the protocol in the NSG rule.' },
            { statement: 'Source', answer: 'VM1 IP address (or its subnet)', explanation: 'Least privilege: restrict source to VM1 specific IP. Using the subnet would be broader than necessary.' },
            { statement: 'Destination', answer: 'VM2 IP address', explanation: 'Least privilege: restrict destination to VM2 specific IP address.' },
            { statement: 'Action', answer: 'Allow', explanation: 'Set action to Allow to permit the ICMP traffic between VM1 and VM2.' }
        ]
    },
    461: {
        type: 'dropdown',
        title: 'Route Table – Force Traffic Through NVA',
        items: [
            { statement: 'Address prefix', answer: '10.0.0.0/16 (or VNet1 address space)', explanation: 'To route ALL VNet1 inbound traffic through VM1, the route must match the VNet address space. Traffic from VPN gateway will follow this route.' },
            { statement: 'Next hop type', answer: 'Virtual appliance', explanation: 'Virtual appliance next hop type routes traffic to a specific IP (the NVA/router VM). This is VM1 acting as a router.' },
            { statement: 'Next hop address', answer: 'VM1 private IP address', explanation: 'Specify VM1 private IP as the next hop address. Traffic will be forwarded to VM1 for inspection/routing.' },
            { statement: 'Associate RT1 to', answer: 'GatewaySubnet', explanation: 'To intercept traffic FROM the VPN gateway, associate the route table to the GatewaySubnet. This applies to all traffic entering from VPN.' }
        ]
    },
    463: {
        type: 'yesno',
        title: 'NSG Rules – RDP Access Between VMs',
        items: [
            { statement: 'RDP from internet to VM1 is allowed', answer: 'Check NSG1 rules for port 3389 from Internet/Any', explanation: 'NSG1 uses only default rules. Default rules DO NOT allow inbound RDP from internet. A custom rule at priority 100 in NSG2 might allow it.' },
            { statement: 'RDP from VM1 to VM2 is allowed', answer: 'Check NSG rules on both source and destination', explanation: 'Inbound to VM2 is controlled by NSG on VM2 NIC/subnet. Default VNet rule allows VNet-to-VNet traffic, so internal RDP may be allowed.' },
            { statement: 'The custom rule in NSG2 affects traffic', answer: 'Yes (priority 100 is higher than default rules)', explanation: 'Custom rules at priority 100 are evaluated before default rules (priority 65000+). The custom rule takes precedence.' }
        ]
    },
    466: {
        type: 'yesno',
        title: 'Storage Account Network Rules & VM Access',
        items: [
            { statement: 'VM1 can access contoso2024', answer: 'Check if VM1 VNet/subnet is in the storage firewall allow list', explanation: 'Storage account firewall rules control network access. VMs must be in an allowed VNet/subnet (service endpoint) or allowed IP range.' },
            { statement: 'VM2 can access contoso2024', answer: 'Check if VM2 VNet/subnet is allowed', explanation: 'Same check: if VM2 is in a different subnet not listed in the service endpoints or IP rules, access is denied.' },
            { statement: 'Public access is allowed', answer: 'Check the "Public network access" setting in exhibit', explanation: 'If set to "Enabled from selected virtual networks and IP addresses", only explicitly allowed networks can connect. If "Disabled", only private endpoints work.' }
        ]
    },
    467: {
        type: 'yesno',
        title: 'DNS Zones – VNet Link & Registration',
        items: [
            { statement: 'VM1 is auto-registered in fabrikam.com', answer: 'Yes (fabrikam.com has a VNet link to vnet1 with auto-registration)', explanation: 'Since fabrikam.com has a virtual network link to vnet1 with auto-registration enabled, VM1 (in vnet1) gets an A record automatically.' },
            { statement: 'VM2 is auto-registered in fabrikam.com', answer: 'Check if vm2 VNet has auto-registration link to fabrikam.com', explanation: 'VM2 is only auto-registered if its VNet also has an auto-registration link. A VNet can have auto-registration in only one zone.' },
            { statement: 'Assigning Owner role allows DNS record management', answer: 'No (Owner on the zone is needed, not on VMs)', explanation: 'Owner role on VMs does not grant DNS zone management permissions. You need DNS Zone Contributor or Owner on the zone resource itself.' }
        ]
    },
    469: {
        type: 'yesno',
        title: 'NSG Rules – Multiple NSGs on Subnets & NICs',
        items: [
            { statement: 'Traffic from VM1 to VM3 is allowed', answer: 'Check both NSG1 (source subnet) and NSG2 (destination subnet/NIC)', explanation: 'Outbound from VM1: check NSG on VM1 NIC/subnet. Inbound to VM3: check NSG on VM3 NIC/subnet. Both must allow the traffic.' },
            { statement: 'The custom rule priority determines outcome', answer: 'Yes', explanation: 'Lower priority number = higher precedence. A Deny at 100 overrides an Allow at 200. Rules are processed in order until a match is found.' },
            { statement: 'VNet-to-VNet default rule allows traffic', answer: 'Yes (priority 65000, AllowVnetInBound)', explanation: 'Default rule AllowVnetInBound allows all traffic within the VNet (and peered VNets). Custom deny rules with lower priority numbers can override this.' }
        ]
    },
    470: {
        type: 'yesno',
        title: 'User-Defined Routes (UDR) & NVA',
        items: [
            { statement: 'Traffic from Subnet1 to internet goes through VM3 (NVA)', answer: 'Check RT1 for 0.0.0.0/0 → Virtual Appliance route', explanation: 'If RT1 has a route for 0.0.0.0/0 with next hop Virtual Appliance (VM3 IP), all internet-bound traffic from Subnet1 routes through VM3.' },
            { statement: 'Traffic from Subnet1 to Subnet2 goes through VM3', answer: 'Check RT1 for Subnet2 address prefix → Virtual Appliance', explanation: 'If RT1 has a specific route matching Subnet2 CIDR pointing to VM3, inter-subnet traffic is forced through the NVA.' },
            { statement: 'IP forwarding must be enabled on VM3 NIC', answer: 'Yes', explanation: 'Azure drops packets not destined for a NIC IP unless IP forwarding is enabled. NVAs MUST have IP forwarding enabled on their NIC.' }
        ]
    },
    477: {
        type: 'yesno',
        title: 'VNet Peering Options',
        items: [
            { statement: 'VMs in VNet1 can communicate with VMs in VNet2', answer: 'Check if peering is Connected on both sides', explanation: 'Peering must be established from both VNets (connected status). If only one side is configured, it shows "Initiated" and traffic does not flow.' },
            { statement: 'Allow forwarded traffic setting affects NVA routing', answer: 'Yes', explanation: 'If "Allow forwarded traffic" is disabled, traffic forwarded by an NVA in one VNet will be dropped at the peering boundary to the other VNet.' },
            { statement: 'Allow gateway transit enables shared VPN', answer: 'Yes', explanation: 'Gateway transit lets a peered VNet use the other VNet VPN gateway to reach on-premises. One side sets "Allow gateway transit", other sets "Use remote gateways".' }
        ]
    },
    480: {
        type: 'dropdown',
        title: 'Migrate DC to Azure – DNS Configuration',
        items: [
            { statement: 'VM size/configuration for DC', answer: 'Deploy DC1 to Subnet1 with a static private IP', explanation: 'Domain controllers must have static IP addresses. Deploy in the VNet subnet and configure a static private IP for DNS stability.' },
            { statement: 'DNS configuration for VNET1', answer: 'Set VNet DNS to the DC VM private IP', explanation: 'After migrating DC1 to Azure, update VNET1 DNS settings to point to the DC VM private IP so member servers can resolve AD DNS names.' }
        ]
    },
    484: {
        type: 'yesno',
        title: 'ARM Template Deployment',
        items: [
            { statement: 'Template creates specified resources', answer: 'Verify resource types and names in template', explanation: 'ARM templates declaratively define resources. All resources in the template are created (or updated if they exist) upon deployment.' },
            { statement: 'Dependencies are resolved', answer: 'Yes (ARM resolves dependsOn automatically)', explanation: 'ARM processes dependsOn declarations and deploys resources in correct order. Circular dependencies cause deployment failure.' },
            { statement: 'Location is correct', answer: 'Check each resource location property', explanation: 'Each resource has its own location property. It may use [resourceGroup().location] or a parameter value.' }
        ]
    },
    508: {
        type: 'dropdown',
        title: 'Container Apps Environment – VNet & Subnet',
        items: [
            { statement: 'Which VNets can be used', answer: 'VNets in the same region (East US) as the container app', explanation: 'Container App Environments must be in the same region as the VNet they connect to. Only East US VNets qualify for an East US container app.' },
            { statement: 'Minimum subnet size', answer: '/23 (512 addresses)', explanation: 'Container Apps environments require a dedicated subnet of at least /23. This subnet cannot be shared with other services.' }
        ]
    },
    510: {
        type: 'yesno',
        title: 'Azure Bastion – Connectivity',
        items: [
            { statement: 'You can connect to VM1 (in VNet1)', answer: 'Yes', explanation: 'Azure Bastion in VNet1 can connect to any VM in VNet1 that the Bastion subnet can reach (same VNet).' },
            { statement: 'You can connect to VM2 (in peered VNet)', answer: 'Yes (with Standard SKU Bastion + VNet peering)', explanation: 'Azure Bastion Standard SKU supports connecting to VMs in peered VNets. Basic SKU only supports same-VNet connections.' },
            { statement: 'You can connect to VM3 (in non-peered VNet)', answer: 'No', explanation: 'Without VNet peering or other connectivity, Bastion cannot reach VMs in isolated VNets.' }
        ]
    },
    511: {
        type: 'yesno',
        title: 'Service Endpoint Policies',
        items: [
            { statement: 'VMs in Subnet1 can access all storage accounts', answer: 'No (policy restricts to specific accounts)', explanation: 'Service endpoint policies filter outbound traffic to storage. Only storage accounts listed in Policy1 are accessible from the subnet.' },
            { statement: 'Policy applies to all storage accounts in the subscription', answer: 'Yes (if policy allows all accounts in subscription)', explanation: 'The policy is configured to "allow connectivity to all storage accounts in the subscription." This means all accounts in the sub are accessible, but not accounts in other subs.' },
            { statement: 'Policy works across regions', answer: 'No (same region only)', explanation: 'Service endpoint policies only work for storage accounts in the SAME region as the policy. Cross-region accounts require separate configuration.' }
        ]
    },
    514: {
        type: 'yesno',
        title: 'Custom DNS & VNet Peering Resolution',
        items: [
            { statement: 'VM1 can resolve contoso.com records from VM4 DNS', answer: 'Check if VNET1 uses VM4 IP as DNS server', explanation: 'If VNET1 DNS is set to VM4 IP and peering allows traffic to reach VM4, then VM1 can resolve contoso.com records served by VM4.' },
            { statement: 'VM2 can resolve contoso.com', answer: 'Check if VNET2 DNS settings point to VM4', explanation: 'Each VNet has independent DNS settings. VM2 resolves names using whatever DNS server VNET2 is configured to use.' },
            { statement: 'VM3 can resolve contoso.com via VM4', answer: 'Check VNET3 DNS settings and peering to reach VM4', explanation: 'VM3 needs: (1) VNET3 DNS pointing to VM4, (2) network path to VM4 (direct peering or transitive routing). VNet peering is NOT transitive.' }
        ]
    },
    520: {
        type: 'dropdown',
        title: 'Azure Bastion – Standard SKU Configuration',
        items: [
            { statement: 'SKU', answer: 'Standard', explanation: 'Standard SKU supports host scaling, file upload/download, and connectivity to peered VNets. Basic SKU does not.' },
            { statement: 'Location', answer: 'Same region as VNet1 (deploy once, use across peered VNets)', explanation: 'Deploy Bastion in one VNet and peer with other VNets. Standard SKU allows cross-VNet connectivity via peering.' },
            { statement: 'Subnet size', answer: '/26 (minimum, 64 addresses)', explanation: 'AzureBastionSubnet requires at least /26. For host scaling (Standard SKU), /26 supports up to 50 concurrent sessions per instance.' }
        ]
    },
    527: {
        type: 'dropdown',
        title: 'Alert Rules & Action Groups – Minimum Required',
        items: [
            { statement: 'Minimum alert rules', answer: '2 (one for each signal type/metric)', explanation: 'Different signal types (e.g., metrics vs activity log) require separate alert rules. You cannot combine different signal types in one rule.' },
            { statement: 'Minimum action groups', answer: '1 (if same notification method for all alerts)', explanation: 'An action group can be reused across multiple alert rules. If all alerts need the same email notification, one action group suffices.' }
        ]
    },
    529: {
        type: 'dropdown',
        title: 'Backup Recovery Points Count',
        items: [
            { statement: 'Recovery points on January 8', answer: '7 (daily backups from Jan 1-7)', explanation: 'With daily backups starting Jan 1 at 1:00 AM, by January 8 you have 7 recovery points (one per day for 7 days).' },
            { statement: 'Recovery points on January 15', answer: '14 (daily backups from Jan 1-14)', explanation: 'By January 15 you have 14 recovery points. With 30-day retention, none have expired yet (oldest is only 14 days old).' }
        ]
    },
    530: {
        type: 'dropdown',
        title: 'Application Insights – Code Modifications',
        items: [
            { statement: '.NET web app', answer: 'Enable auto-instrumentation (no code changes needed)', explanation: 'For .NET apps on App Service, you can enable Application Insights without code changes using auto-instrumentation in the portal.' },
            { statement: 'Node.js web app', answer: 'Add Application Insights SDK (code modification required)', explanation: 'Node.js apps require adding the Application Insights SDK package and initialization code. Auto-instrumentation is limited for Node.js.' }
        ]
    },
    532: {
        type: 'yesno',
        title: 'Self-Service Password Reset (SSPR)',
        items: [
            { statement: 'User1 can use SSPR', answer: 'Check if User1 is in the SSPR-enabled group', explanation: 'SSPR can be enabled for All users, Selected users (specific group), or None. Only users in the selected group(s) can use SSPR.' },
            { statement: 'User1 can reset using security questions alone', answer: 'No (if 2 methods required)', explanation: 'If "Number of methods required to reset" is 2, the user must provide 2 different authentication methods. Security questions alone is only 1 method.' },
            { statement: 'Synced users can use SSPR with password writeback', answer: 'Yes', explanation: 'With password writeback configured in Azure AD Connect, synced users can reset their password via SSPR and it writes back to on-premises AD.' }
        ]
    },
    534: {
        type: 'yesno',
        title: 'App Service Backup Configuration',
        items: [
            { statement: 'App1 backup includes the database', answer: 'Check if database connection is included in backup config', explanation: 'App Service backup can optionally include linked databases. Check the backup configuration for database connection strings.' },
            { statement: 'App2 has automatic backup configured', answer: 'Check backup schedule configuration for App2', explanation: 'Each app can have its own backup configuration. Check if App2 production slot has a scheduled backup or only manual.' },
            { statement: 'Test slot backups are separate from production', answer: 'Yes', explanation: 'Deployment slots have their own backup configurations. A backup configured on the production slot does NOT automatically back up the test slot.' }
        ]
    },
    535: {
        type: 'yesno',
        title: 'SSPR – Authentication Methods',
        items: [
            { statement: 'User1 can reset password (has mobile phone + security questions)', answer: 'Yes (has 2 methods meeting the requirement)', explanation: 'User1 has mobile phone + security questions = 2 methods. This meets "Number of methods required to reset: 2".' },
            { statement: 'User2 can reset (has only security questions)', answer: 'No (only 1 method, needs 2)', explanation: 'With 2 methods required, having only security questions (1 method) is insufficient. User2 cannot complete SSPR.' },
            { statement: 'Security questions count as one method regardless of how many answered', answer: 'Yes', explanation: 'Security questions is counted as a single authentication method, even if multiple questions are answered. It is one category.' }
        ]
    },
    538: {
        type: 'dropdown',
        title: 'App Service Plan – CPU Usage & Scaling',
        items: [
            { statement: 'Current scaling state', answer: 'Based on CPU graph in exhibit', explanation: 'Read the CPU percentage from the graph. If consistently above the scale-out threshold, instances should have been added.' },
            { statement: 'Recommended action', answer: 'Scale out (if CPU high) or scale up (if already max instances)', explanation: 'If CPU is high and instance count is at maximum, scale UP (more powerful instances). If instances are below max, scale OUT (add instances).' }
        ]
    },
    540: {
        type: 'dropdown',
        title: 'Azure Backup – Protect VM1',
        items: [
            { statement: 'First step', answer: 'Create a Recovery Services vault', explanation: 'Before configuring backup, you need a Recovery Services vault in the same region as the VM. This stores the backup data.' },
            { statement: 'Backup policy schedule', answer: 'Daily at 01:00 with 30-day retention', explanation: 'Create (or use) a backup policy with: schedule = daily at 01:00, retention = 30 days. Then apply this policy to VM1.' }
        ]
    },
    545: {
        type: 'dropdown',
        title: 'Log Analytics – Activity Log Query',
        items: [
            { statement: 'Table to query', answer: 'AzureActivity', explanation: 'The AzureActivity table in Log Analytics contains Azure Activity Log events (service health, resource operations, etc.).' },
            { statement: 'Query fields', answer: 'TimeGenerated, OperationNameValue, Resource', explanation: 'TimeGenerated = event time, OperationNameValue = event name, Resource = affected resource. Use "project" to select these columns.' }
        ]
    },
    547: {
        type: 'yesno',
        title: 'Azure Monitor & Diagnostics',
        items: [
            { statement: 'Platform metrics are collected automatically', answer: 'Yes', explanation: 'Azure platform metrics (CPU, memory, network) are collected automatically without any agent. They are available in Azure Monitor immediately.' },
            { statement: 'Guest OS metrics require an agent', answer: 'Yes', explanation: 'Guest OS metrics (processes, application logs, custom counters) require Azure Monitor Agent (AMA) or the legacy diagnostics extension.' },
            { statement: 'Metrics are retained for 93 days', answer: 'Yes', explanation: 'Azure Monitor platform metrics are retained for 93 days by default. For longer retention, send to Log Analytics workspace or storage account.' }
        ]
    },
    548: {
        type: 'dropdown',
        title: 'Azure Monitor – Data Collection',
        items: [
            { statement: 'Collect Windows event logs', answer: 'Data Collection Rule (DCR) with Azure Monitor Agent', explanation: 'Data Collection Rules define what data to collect. Windows event logs require Azure Monitor Agent + a DCR configured to collect Windows events.' },
            { statement: 'Destination', answer: 'Log Analytics workspace', explanation: 'Windows event logs are sent to a Log Analytics workspace where they can be queried using KQL (Kusto Query Language).' }
        ]
    },
    549: {
        type: 'dropdown',
        title: 'Azure Monitor – Alerts Configuration',
        items: [
            { statement: 'Signal type for VM CPU alert', answer: 'Metric', explanation: 'VM CPU percentage is a platform metric. Use metric signal type for real-time monitoring of resource performance.' },
            { statement: 'Signal type for activity log events', answer: 'Activity log', explanation: 'Activity log signals detect management plane operations (e.g., VM stopped, role assigned, resource deleted).' }
        ]
    },
    550: {
        type: 'dropdown',
        title: 'Log Analytics – KQL Query',
        items: [
            { statement: 'Query operator to filter', answer: 'where', explanation: 'The "where" operator in KQL filters rows based on a condition (e.g., where TimeGenerated > ago(1h)).' },
            { statement: 'Query operator to select columns', answer: 'project', explanation: 'The "project" operator selects which columns to include in the output (like SELECT in SQL).' }
        ]
    },
    552: {
        type: 'dropdown',
        title: 'Azure Monitor – Diagnostic Settings',
        items: [
            { statement: 'Send metrics to', answer: 'Log Analytics workspace, Storage account, or Event Hub', explanation: 'Diagnostic settings can send platform metrics and logs to: Log Analytics workspace, Azure Storage account, or Event Hub for external processing.' },
            { statement: 'Category to enable', answer: 'Based on the required data type', explanation: 'Each resource has different diagnostic categories (e.g., AuditEvent for Key Vault, Metrics for most resources, etc.).' }
        ]
    },
    559: {
        type: 'dropdown',
        title: 'Azure Backup – Configuration',
        items: [
            { statement: 'Vault type needed', answer: 'Recovery Services vault (for VMs) or Backup vault (for disks/blobs)', explanation: 'VMs and SQL in VMs use Recovery Services vault. Managed disks, blob storage, and Azure Database for PostgreSQL use Backup vault.' },
            { statement: 'Backup policy defines', answer: 'Schedule, retention, and snapshot tier retention', explanation: 'Backup policies define when backups run, how long to retain them, and how long to keep instant recovery snapshots.' }
        ]
    },
    564: {
        type: 'dropdown',
        title: 'Azure Monitor – Network Watcher',
        items: [
            { statement: 'Connection Monitor', answer: 'Tests connectivity between source and destination over time', explanation: 'Connection Monitor continuously monitors reachability, latency, and network topology changes between endpoints.' },
            { statement: 'NSG diagnostics', answer: 'Shows effective NSG rules for a NIC', explanation: 'NSG diagnostics shows all effective rules (from subnet + NIC NSGs combined) and simulates traffic flows.' }
        ]
    },
    571: {
        type: 'dropdown',
        title: 'Azure Backup – Restore Options',
        items: [
            { statement: 'Restore type for full VM', answer: 'Create new VM or Replace existing', explanation: 'Full VM restore: either create a brand new VM from backup or replace the existing VM disk with the backup version.' },
            { statement: 'Restore individual files', answer: 'File Recovery (mount recovery point as drive)', explanation: 'File Recovery mounts the backup as a network drive. Browse and copy individual files without restoring the entire VM.' }
        ]
    },
    572: {
        type: 'dropdown',
        title: 'Azure Monitor – Metrics & Alerts',
        items: [
            { statement: 'Metric alert evaluation frequency', answer: '1 minute (minimum)', explanation: 'Metric alerts can be evaluated as frequently as every 1 minute. This provides near real-time alerting on metric conditions.' },
            { statement: 'Alert state lifecycle', answer: 'New → Acknowledged → Closed', explanation: 'Alert states: New (just fired), Acknowledged (someone is investigating), Closed (resolved). Stateful alerts auto-resolve when condition clears.' }
        ]
    },
    573: {
        type: 'dropdown',
        title: 'Log Analytics – Workspace Configuration',
        items: [
            { statement: 'Data retention', answer: '30 days free, up to 730 days (2 years) paid', explanation: 'Log Analytics includes 30 days free retention. You can extend up to 730 days with additional cost per GB retained beyond 30 days.' },
            { statement: 'Access control mode', answer: 'Resource-context or Workspace-context', explanation: 'Resource-context: users see only logs for resources they have access to. Workspace-context: access to all data in workspace based on workspace permissions.' }
        ]
    },
    575: {
        type: 'dropdown',
        title: 'Backup Vaults – Which Vault for Each Resource',
        items: [
            { statement: 'cont1 (container/blob)', answer: 'Backup vault', explanation: 'Azure Blob backup (operational and vaulted) uses Backup vault, not Recovery Services vault.' },
            { statement: 'share1 (file share)', answer: 'Recovery Services vault', explanation: 'Azure file share backup uses Recovery Services vault. File shares are backed up via snapshot-based backup in RSV.' }
        ]
    },
    582: {
        type: 'yesno',
        title: 'Service Endpoints & Storage Access',
        items: [
            { statement: 'VM in VNet1/Subnet with service endpoint can access contoso101', answer: 'Check storage firewall rules for VNet1 allowed', explanation: 'Service endpoints route traffic via Azure backbone. The storage account firewall must list VNet1/Subnet as allowed for access to work.' },
            { statement: 'Service endpoint policy restricts to specific accounts', answer: 'Yes', explanation: 'Service endpoint policies can restrict which specific storage accounts are accessible from the subnet, even if the endpoint allows the service generally.' },
            { statement: 'VMs without service endpoint use public path', answer: 'Yes', explanation: 'Without service endpoints, VM traffic to storage goes over the public internet path (though still within Azure network). The storage firewall may block this.' }
        ]
    },
    583: {
        type: 'dropdown',
        title: 'Backup Vault vs Recovery Services Vault',
        items: [
            { statement: 'Backup vault supports', answer: 'Azure Disks, Azure Blobs, Azure Database for PostgreSQL', explanation: 'Backup vault is the newer vault type supporting newer datasources: managed disks, blob storage, and PostgreSQL servers.' },
            { statement: 'Recovery Services vault supports', answer: 'Azure VMs, SQL in VMs, Azure Files, SAP HANA', explanation: 'Recovery Services vault is the original vault supporting VMs, file shares, SQL Server in VMs, and SAP HANA in VMs.' }
        ]
    },
    584: {
        type: 'dropdown',
        title: 'Case Study – Backup & Recovery',
        items: [
            { statement: 'Refer to case study exhibits', answer: 'Review case study requirements', explanation: 'Case study questions require reading all exhibits and technical requirements carefully before selecting answers.' }
        ]
    },
    585: {
        type: 'dropdown',
        title: 'Device Settings – Entra ID',
        items: [
            { statement: 'Setting 1', answer: 'Users may join devices to Azure AD (or register)', explanation: 'Control who can join or register devices. Set to "All" or "Selected" based on user requirements.' },
            { statement: 'Setting 2', answer: 'Require Multi-Factor Authentication to register or join devices', explanation: 'Enable MFA requirement for device registration/join to add a security layer when devices are added to the tenant.' }
        ]
    },
    587: {
        type: 'dropdown',
        title: 'Recovery Services Vaults & Backup Policies',
        items: [
            { statement: 'Minimum Recovery Services vaults', answer: '1 per region (vaults must be in same region as resources)', explanation: 'Recovery Services vaults can only back up resources in the same region. If resources are in multiple regions, you need one vault per region.' },
            { statement: 'Minimum backup policies', answer: '1 per resource type with different schedule/retention', explanation: 'Different backup schedules or retention requirements need separate policies. VMs and file shares use different policy types.' }
        ]
    },
    589: {
        type: 'dropdown',
        title: 'Policy Roles – Create & Assign Initiatives',
        items: [
            { statement: 'User1 (create initiative definitions)', answer: 'Resource Policy Contributor', explanation: 'Resource Policy Contributor can create and manage resource policies including initiative (policy set) definitions. Does NOT allow assigning policies.' },
            { statement: 'User4 (assign initiatives to RG2)', answer: 'Resource Policy Contributor (or Owner of RG2)', explanation: 'To assign a policy/initiative to a scope, you need Microsoft.Authorization/policyAssignments/write permission. Resource Policy Contributor or Owner provides this.' }
        ]
    },
    593: {
        type: 'yesno',
        title: 'Storage Requirements',
        items: [
            { statement: 'Requirement can be met with standard storage', answer: 'Check performance requirements vs Standard/Premium', explanation: 'Standard storage (HDD-backed) is cost-effective for infrequent access. Premium (SSD-backed) is needed for low-latency, high-IOPS workloads.' },
            { statement: 'GRS is required for DR', answer: 'If cross-region disaster recovery is needed, yes', explanation: 'GRS (Geo-Redundant Storage) replicates data to a paired region. Required if the solution needs to survive a complete regional outage.' },
            { statement: 'Blob versioning is needed', answer: 'Check if point-in-time recovery or version history is required', explanation: 'Blob versioning maintains previous versions of blobs automatically. Useful for accidental overwrite/delete protection.' }
        ]
    },
    594: {
        type: 'dropdown',
        title: 'Storage Accounts for Container & File Share',
        items: [
            { statement: 'container1 (blob container)', answer: 'Any GPv2 or BlobStorage account', explanation: 'Blob containers can be created in GPv2, BlobStorage, or Premium BlockBlobStorage accounts. GPv2 is most common and cost-effective.' },
            { statement: 'share1 (file share)', answer: 'GPv2 or Premium FileStorage account', explanation: 'Standard file shares use GPv2 accounts. Premium file shares (NFS or high-performance SMB) require a FileStorage account type.' }
        ]
    },
    595: {
        type: 'dropdown',
        title: 'Storage Account for Replication Destination',
        items: [
            { statement: 'Storage account type', answer: 'General-purpose v2 (StorageV2)', explanation: 'Object replication destination must be GPv2. It supports all required features (versioning, change feed) for replication.' },
            { statement: 'Destination account', answer: 'Account in a different region (for cross-region replication)', explanation: 'Object replication destination should be in a different region for disaster recovery, or same region for compliance/latency requirements.' }
        ]
    },
    599: {
        type: 'dropdown',
        title: 'New York Office – Connection Requirements',
        items: [
            { statement: 'Connection type', answer: 'Site-to-Site VPN or ExpressRoute (based on requirements)', explanation: 'Site-to-Site VPN for internet-based encrypted connectivity. ExpressRoute for private, high-bandwidth, low-latency connections.' },
            { statement: 'Configuration', answer: 'Based on bandwidth and redundancy requirements in case study', explanation: 'Review case study for specific bandwidth needs, SLA requirements, and whether active-active gateway is needed for redundancy.' }
        ]
    },
    600: {
        type: 'dropdown',
        title: 'App1 Solution – Technical Requirements',
        items: [
            { statement: 'Recommended solution', answer: 'Based on case study technical requirements for App1', explanation: 'Review the technical requirements section of the case study for specific App1 constraints (scaling, region, connectivity, etc.).' },
            { statement: 'Configuration', answer: 'Match App Service plan tier and features to requirements', explanation: 'Select the appropriate pricing tier based on scaling needs, custom domain, SSL, deployment slots, and VNet integration requirements.' }
        ]
    },
    602: {
        type: 'yesno',
        title: 'NSG Changes – Traffic Impact',
        items: [
            { statement: 'Traffic allowed after NSG changes', answer: 'Evaluate new rules by priority (lowest number first)', explanation: 'After modifying NSG rules, re-evaluate: rules are processed in priority order. First matching rule (allow or deny) determines outcome.' },
            { statement: 'Existing connections are affected', answer: 'No (NSG is stateful – existing flows continue)', explanation: 'NSGs are stateful. Existing established connections continue even if a new deny rule would block initial connection. Only new flows are affected.' },
            { statement: 'Both inbound and outbound rules apply', answer: 'Yes', explanation: 'NSGs have separate inbound and outbound rule sets. Traffic must be allowed by the appropriate direction rules. Return traffic for allowed flows is automatic (stateful).' }
        ]
    },
    605: {
        type: 'dropdown',
        title: 'Custom RBAC Role – Prerequisites',
        items: [
            { statement: 'Command before creating Role1', answer: 'Get-AzRoleDefinition (to get a base role JSON) or New-AzRoleDefinition prerequisite', explanation: 'Before creating a custom role, you need the role definition JSON. Use Get-AzRoleDefinition -Name "Reader" | ConvertTo-Json to get a template, then modify it.' },
            { statement: 'Alternative CLI command', answer: 'az role definition list (to get base template)', explanation: 'In CLI: az role definition list --name "Contributor" to get the JSON structure, modify Actions/NotActions/AssignableScopes, then use az role definition create.' }
        ]
    }
};

// Merge into HOTSPOT_ANSWERS if it exists, otherwise make standalone
if (typeof HOTSPOT_ANSWERS !== 'undefined') {
    Object.assign(HOTSPOT_ANSWERS, HOTSPOT_ANSWERS_2);
}

if (typeof module !== 'undefined') module.exports = HOTSPOT_ANSWERS_2;
