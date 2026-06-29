// Drag-and-Drop & Hotspot Answer Key
// type: 'sequence' = ordered steps, 'match' = item-to-target mapping
const DRAGDROP_ANSWERS = {
    20: {
        type: 'match',
        title: 'ARM Template Password Protection',
        items: [
            { target: 'Component 1', answer: 'An Azure Key Vault', explanation: 'Key Vault securely stores secrets like passwords, certificates, and keys. The ARM template references the Key Vault secret instead of storing the password in plain text.' },
            { target: 'Component 2', answer: 'An access policy', explanation: 'An access policy in Key Vault grants the ARM template deployment the permission to retrieve the secret during deployment.' }
        ]
    },
    23: {
        type: 'match',
        title: 'Hyper-V VM Replication to Azure',
        items: [
            { target: 'Object 1', answer: 'A Hyper-V site', explanation: 'A Hyper-V site groups on-premises Hyper-V hosts. You register your host servers into the site for Site Recovery to manage replication.' },
            { target: 'Object 2', answer: 'A Recovery Services vault', explanation: 'The vault stores backup data and replication configuration metadata. It is required for Azure Site Recovery.' },
            { target: 'Object 3', answer: 'A replication policy', explanation: 'The replication policy defines recovery point retention, app-consistent snapshot frequency, and replication frequency.' },
            { target: 'Object 4', answer: 'A Storage account', explanation: 'A storage account is needed to store the replicated data (VHDs) from on-premises to Azure.' }
        ]
    },
    61: {
        type: 'sequence',
        title: 'Cost Report by Department',
        steps: [
            { step: 1, action: 'Assign a tag to each resource', explanation: 'Tags (e.g., Department: Finance) are key-value pairs attached to resources. They allow logical grouping across resource groups.' },
            { step: 2, action: 'From the Cost analysis blade, filter the view by tag', explanation: 'Cost Management + Billing > Cost analysis allows filtering costs by tag, giving per-department cost breakdowns.' },
            { step: 3, action: 'Download the usage report', explanation: 'Export the filtered cost data as a CSV/Excel file to send to the finance department.' }
        ]
    },
    81: {
        type: 'sequence',
        title: 'Add Custom Domain to Azure AD',
        steps: [
            { step: 1, action: 'Add a custom domain name of contoso.com', explanation: 'In Azure AD > Custom domain names, add the domain. Azure AD generates a TXT or MX record value for verification.' },
            { step: 2, action: 'Create a DNS record at the registrar', explanation: 'At your third-party registrar, create the TXT (or MX) record with the value Azure AD provided. This proves domain ownership.' },
            { step: 3, action: 'Verify the custom domain name', explanation: 'Back in Azure AD, click Verify. Azure checks the DNS record exists. Once verified, you can create users with @contoso.com suffix.' }
        ]
    },
    107: {
        type: 'match',
        title: 'RBAC Roles – Least Privilege',
        items: [
            { target: 'User1 (view data in any storage account)', answer: 'Storage Blob Data Reader', explanation: 'Storage Blob Data Reader grants read access to blob container data. It follows least privilege for viewing storage data (Reader role alone only sees management plane, not data).' },
            { target: 'User2 (assign Contributor role for storage accounts)', answer: 'User Access Administrator', explanation: 'User Access Administrator allows managing user access to Azure resources (assign/remove roles). Owner could also work but violates least privilege.' }
        ]
    },
    147: {
        type: 'sequence',
        title: 'Microsoft 365 Group Naming Policy',
        steps: [
            { step: 1, action: 'Select Groups, then Naming policy', explanation: 'In Microsoft Entra admin center > Groups > Naming policy is where you configure automatic group name formatting.' },
            { step: 2, action: 'Under Prefix-suffix naming policy, configure the prefix and suffix', explanation: 'Add a fixed string or attribute-based prefix/suffix (e.g., "GRP_" + [GroupName] + "_" + [Department]).' },
            { step: 3, action: 'Save the policy', explanation: 'Once saved, all new Microsoft 365 groups will automatically have the configured naming format applied.' }
        ]
    },
    162: {
        type: 'sequence',
        title: 'Azure Import/Export Service',
        steps: [
            { step: 1, action: 'Attach an external disk to Server1', explanation: 'The Azure Import/Export service requires physical disks. Attach a supported drive (SATA II/III HDD or SSD) to the server.' },
            { step: 2, action: 'Run WAImportExport.exe to prepare the drive', explanation: 'The WAImportExport tool copies data to the drive, encrypts it with BitLocker, and generates the journal files needed for the import job.' },
            { step: 3, action: 'Create an import job in the Azure portal', explanation: 'In the Azure portal, create an Import job specifying the destination storage account and upload the journal files.' },
            { step: 4, action: 'Ship the disk to an Azure datacenter', explanation: 'Physically ship the prepared drive to the Azure datacenter region specified during job creation.' },
            { step: 5, action: 'Update the job with the tracking number', explanation: 'After shipping, update the import job with the carrier tracking number so Azure can track and receive the drive.' }
        ]
    },
    164: {
        type: 'match',
        title: 'Azure File Share UNC Path',
        items: [
            { target: 'UNC Path', answer: '\\\\contosostorage.file.core.windows.net\\data', explanation: 'Azure file shares use the UNC format: \\\\<storage-account>.file.core.windows.net\\<share-name>. The FQDN for Azure Files is always <account>.file.core.windows.net.' }
        ]
    },
    171: {
        type: 'sequence',
        title: 'Azure File Sync Setup',
        steps: [
            { step: 1, action: 'Install the Azure File Sync agent on Server1', explanation: 'The Azure File Sync agent must be installed on each on-premises Windows Server that will participate in sync.' },
            { step: 2, action: 'Register Server1 with the Storage Sync Service', explanation: 'After installing the agent, register the server. This establishes a trust relationship between the server and the Storage Sync Service.' },
            { step: 3, action: 'Add a server endpoint', explanation: 'A server endpoint represents a specific location on a registered server (e.g., D:\\Data). Adding it to the sync group starts synchronization.' }
        ]
    },
    183: {
        type: 'match',
        title: 'Prepare Subscription for Azure File Sync',
        items: [
            { target: 'Action 1', answer: 'Deploy a Storage Sync Service', explanation: 'The Storage Sync Service is the top-level Azure resource for Azure File Sync. It manages sync groups and registered servers.' },
            { target: 'Action 2', answer: 'Create a sync group and a cloud endpoint', explanation: 'A sync group defines the sync topology. The cloud endpoint points to the Azure file share that serves as the central sync point.' }
        ]
    },
    201: {
        type: 'match',
        title: 'AzCopy Authentication Methods',
        items: [
            { target: 'Source account (Blob storage - container1)', answer: 'SAS token or Azure AD', explanation: 'AzCopy supports both Azure AD authentication and SAS tokens for Blob storage operations.' },
            { target: 'Destination account (File share - share1)', answer: 'SAS token', explanation: 'Azure Files only supports SAS token authentication with AzCopy. Azure AD is NOT supported for Azure Files with AzCopy.' }
        ]
    },
    207: {
        type: 'sequence',
        title: 'Back Up VM with Zone-Redundant Storage',
        steps: [
            { step: 1, action: 'Create a Recovery Services vault with Zone-redundant storage (ZRS)', explanation: 'Storage redundancy must be set BEFORE configuring any backups. ZRS replicates data across three availability zones in the primary region.' },
            { step: 2, action: 'Create a backup policy', explanation: 'The backup policy defines the schedule (daily/weekly) and retention period for VM backups.' },
            { step: 3, action: 'Configure backup for VM1', explanation: 'Select the VM, assign the backup policy, and enable protection. Initial backup runs per the policy schedule.' }
        ]
    },
    263: {
        type: 'sequence',
        title: 'Azure Automation State Configuration',
        steps: [
            { step: 1, action: 'Upload a PowerShell DSC configuration', explanation: 'Upload your DSC configuration script (.ps1) that defines the desired state (e.g., installed features, file contents, registry keys).' },
            { step: 2, action: 'Compile the configuration', explanation: 'Compiling converts the DSC configuration into MOF files (node configurations) that can be applied to target nodes.' },
            { step: 3, action: 'Assign the node configuration to each VM', explanation: 'Assign the compiled node configuration to registered VMs. The Local Configuration Manager (LCM) on each VM pulls and applies the desired state.' }
        ]
    },
    385: {
        type: 'sequence',
        title: 'Add Address Space to Peered VNet',
        steps: [
            { step: 1, action: 'Delete the peering between VNet1 and VNet2', explanation: 'You cannot modify the address space of a VNet while an active peering exists. The peering must be removed first.' },
            { step: 2, action: 'Add the address space 10.33.0.0/16 to VNet1', explanation: 'With the peering removed, you can now add the new address space to VNet1 without conflicts.' },
            { step: 3, action: 'Recreate the peering between VNet1 and VNet2', explanation: 'Recreate the peering on both sides. The new peering will include the updated address space, allowing communication between all subnets.' }
        ]
    },
    400: {
        type: 'sequence',
        title: 'Site-to-Site VPN Setup',
        steps: [
            { step: 1, action: 'Create a gateway subnet', explanation: 'A dedicated subnet named "GatewaySubnet" is required in the VNet. It hosts the VPN gateway instances. Microsoft recommends /27 or larger.' },
            { step: 2, action: 'Create a VPN gateway', explanation: 'The VPN gateway is deployed into the GatewaySubnet. It handles IPsec/IKE tunnel negotiation. Deployment can take 30-45 minutes.' },
            { step: 3, action: 'Create a local network gateway', explanation: 'The local network gateway represents your on-premises VPN device. It specifies the on-premises public IP and address ranges behind it.' },
            { step: 4, action: 'Create a VPN connection', explanation: 'The connection links the VPN gateway to the local network gateway using a shared key (PSK). This establishes the IPsec tunnel.' }
        ]
    },
    449: {
        type: 'sequence',
        title: 'Load Balance HTTPS Connections',
        steps: [
            { step: 1, action: 'Create a health probe', explanation: 'A health probe monitors the availability of backend VMs. It checks a specific port/path (e.g., HTTPS on port 443) at regular intervals.' },
            { step: 2, action: 'Create a backend pool and add vm1 and vm2', explanation: 'The backend pool defines which VMs receive the load-balanced traffic. Both vm1 and vm2 must be added to the pool.' },
            { step: 3, action: 'Create a load balancing rule', explanation: 'The rule ties together the frontend IP, port (443), backend pool, and health probe. It defines how traffic is distributed to the backend VMs.' }
        ]
    },
    452: {
        type: 'sequence',
        title: 'Azure Virtual WAN – Connect Two Sites',
        steps: [
            { step: 1, action: 'Create a Virtual WAN', explanation: 'The Virtual WAN resource is the top-level container that represents your network topology in Azure.' },
            { step: 2, action: 'Create a virtual hub', explanation: 'A virtual hub is the central routing component. It contains gateways (VPN, ExpressRoute) and connects to VNets and branch sites.' },
            { step: 3, action: 'Create VPN sites for site1 and site2', explanation: 'Each physical branch/site is represented as a VPN site in Azure, specifying the on-premises device IP and address space.' },
            { step: 4, action: 'Associate the VPN sites with the hub', explanation: 'Connecting the VPN sites to the hub establishes the VPN tunnels and enables site-to-site communication through the hub.' }
        ]
    },
    493: {
        type: 'sequence',
        title: 'Remote Desktop via Azure Bastion',
        steps: [
            { step: 1, action: 'Run az login to authenticate', explanation: 'You must authenticate to Azure first. az login opens a browser for interactive authentication or uses device code flow.' },
            { step: 2, action: 'Run az network bastion tunnel to create the tunnel', explanation: 'This command creates a secure tunnel from your local device through Azure Bastion to the target VM. It opens a local port for RDP.' },
            { step: 3, action: 'Use mstsc (Remote Desktop) to connect to localhost on the tunnel port', explanation: 'Connect to localhost:<port> where port is the local port opened by the bastion tunnel command. RDP traffic flows securely through Bastion.' }
        ]
    },
    515: {
        type: 'sequence',
        title: 'ARM Template Resource Dependencies',
        steps: [
            { step: 1, action: 'Deploy a Virtual Network', explanation: 'The VNet is the foundational network resource. All other network resources depend on it.' },
            { step: 2, action: 'Deploy a Network Interface (NIC)', explanation: 'The NIC must reference a subnet within the VNet. It depends on the VNet being deployed first.' },
            { step: 3, action: 'Deploy the Virtual Machine (VM1)', explanation: 'The VM depends on the NIC for network connectivity. It cannot be created without an attached NIC.' },
            { step: 4, action: 'Deploy a VM Extension (for performance data)', explanation: 'The Azure Monitor/Diagnostics extension depends on the VM existing first. It enables capture of performance metrics.' }
        ]
    },
    539: {
        type: 'sequence',
        title: 'Restore Files from Azure Backup (Linux VM)',
        steps: [
            { step: 1, action: 'From the Recovery Services vault, select File Recovery', explanation: 'File Recovery (Item-level restore) lets you restore individual files without restoring the entire VM. Select the recovery point containing the deleted files.' },
            { step: 2, action: 'Download the script to the on-premises server', explanation: 'Azure generates an executable script that mounts the recovery point as a network drive on your local machine.' },
            { step: 3, action: 'Run the script on the Windows Server to mount the volume', explanation: 'Running the script mounts the backup as a local drive (e.g., E:\\). You can browse and copy files from the mounted recovery point.' },
            { step: 4, action: 'Copy the required files and unmount the recovery volume', explanation: 'Copy the two deleted files to their destination, then unmount the volume to release the recovery point.' }
        ]
    },
    554: {
        type: 'sequence',
        title: 'Back Up Individual Disk with Azure Backup',
        steps: [
            { step: 1, action: 'Create a Backup vault', explanation: 'Azure Disk Backup uses a Backup vault (not Recovery Services vault). Backup vault supports newer datasource types like managed disks and blobs.' },
            { step: 2, action: 'Create a backup policy for Azure Disk', explanation: 'Define the backup schedule and retention for disk snapshots. Azure Disk Backup creates incremental snapshots.' },
            { step: 3, action: 'Configure backup and select Disk2', explanation: 'Select the specific managed disk (Disk2) to protect. The backup instance is created and the first snapshot is taken per the policy schedule.' }
        ]
    },
    588: {
        type: 'sequence',
        title: 'Configure VM Alerts',
        steps: [
            { step: 1, action: 'Create an action group', explanation: 'An action group defines WHO gets notified and HOW (email, SMS, webhook, Azure Function, Logic App, etc.) when an alert fires.' },
            { step: 2, action: 'Create an alert rule', explanation: 'The alert rule defines the condition (metric threshold, log query, activity log event) that triggers the alert.' },
            { step: 3, action: 'Add the action group to the alert rule', explanation: 'Link the action group to the alert rule so the configured notification actions execute when the condition is met.' }
        ]
    }
};

if (typeof module !== 'undefined') module.exports = DRAGDROP_ANSWERS;
