// Hotspot Answer Key
// type: 'yesno' = Yes/No statements, 'dropdown' = select from options, 'table' = fill-in table
const HOTSPOT_ANSWERS = {
    41: {
        type: 'dropdown',
        title: 'Load Balancer Role Assignments',
        items: [
            { statement: 'Manage LB1 (internal load balancer)', answer: 'Network Contributor', explanation: 'Network Contributor can manage all networking resources including load balancers. This is the least-privileged role that can manage load balancers.' },
            { statement: 'Manage LB2 (public load balancer)', answer: 'Network Contributor', explanation: 'Same role — Network Contributor. Both internal and public load balancers are networking resources managed by this role.' }
        ]
    },
    44: {
        type: 'yesno',
        title: 'Access Review – Review1',
        items: [
            { statement: 'User3 will receive a review request for Group1 members', answer: 'Yes', explanation: 'User3 is the owner of Group1. In an access review configured for "Group owners" as reviewers, the owner receives the review request.' },
            { statement: 'User1 can review Group2 members', answer: 'No', explanation: 'The review scope is Group1 members. Group2 is a member of Group1 (nested group), but the review is for direct members. User1 is not an owner of Group1.' },
            { statement: 'The review will include members of Group2', answer: 'Yes', explanation: 'When Group2 is a member of Group1, the access review for Group1 includes Group2 as it is a direct member (the group itself, not its individual members).' }
        ]
    },
    45: {
        type: 'yesno',
        title: 'Management Groups & Policy Inheritance',
        items: [
            { statement: 'Policy1 applies to Sub1', answer: 'Yes', explanation: 'Policies assigned to a management group are inherited by all child subscriptions. Sub1 is a member of the management group where Policy1 is assigned.' },
            { statement: 'Policy2 applies to Sub2', answer: 'Yes', explanation: 'Policies are inherited down the management group hierarchy. Sub2 inherits policies from its parent management group.' },
            { statement: 'Policy1 applies to Sub3', answer: 'No', explanation: 'Sub3 is in a different management group branch that does not have Policy1 assigned. Policies only flow DOWN the hierarchy, not across.' }
        ]
    },
    47: {
        type: 'dropdown',
        title: 'Tag Inheritance with Azure Policy',
        items: [
            { statement: 'Tags on VNET1', answer: 'No new tags (existing tags only)', explanation: 'VNET1 already exists. The "Append a tag" policy only applies to NEW or MODIFIED resources. Existing resources are not retroactively tagged unless remediated.' },
            { statement: 'Tags on VNET2', answer: 'RGroup: RG6 AND Tag from policy (Tag4: value4)', explanation: 'VNET2 is newly deployed to RG6. The policy "Append a tag and its value to resources" applies Tag4:value4 to new resources. The resource also inherits tags if "Inherit a tag from the resource group" policy is active.' }
        ]
    },
    54: {
        type: 'yesno',
        title: 'Security Groups & Device Membership',
        items: [
            { statement: 'Device1 is a member of Group1', answer: 'Yes', explanation: 'Group1 uses dynamic device membership rules. If the rule matches Device1 properties (e.g., deviceOSType equals Windows), Device1 is automatically added.' },
            { statement: 'User1 is a member of Group2', answer: 'Yes', explanation: 'Based on the dynamic user membership rule configured for Group2, User1 matches the criteria (e.g., department equals a specific value).' },
            { statement: 'Device2 is a member of Group1', answer: 'No', explanation: 'Device2 does not meet the dynamic membership rule criteria for Group1 (different OS type or property value).' }
        ]
    },
    63: {
        type: 'yesno',
        title: 'ARM Template Deployment – Virtual Network',
        items: [
            { statement: 'A new VNet is created in the East US 2 region', answer: 'Yes', explanation: 'The ARM template deploys a virtual network. If the location parameter specifies East US 2, the VNet is created there.' },
            { statement: 'The VNet has two subnets', answer: 'Yes', explanation: 'Based on the ARM template subnet configuration, the VNet is deployed with the subnets defined in the template.' },
            { statement: 'VM1-NI connects to the new VNet', answer: 'No', explanation: 'The existing network interface VM1-NI is already connected to VNET1. Deploying a new VNet does not automatically move existing NICs.' }
        ]
    },
    65: {
        type: 'dropdown',
        title: 'Custom RBAC Role – CR1',
        items: [
            { statement: 'Assignable scopes', answer: '/subscriptions/c276fc76-9cd4-44c9-99a7-4fd71546436e', explanation: 'To limit assignment to resource groups in Subscription1, the assignable scope must be set to the subscription level. You cannot list every resource group individually as they may change.' },
            { statement: 'Actions', answer: '"*"', explanation: 'Using "*" allows all actions. Combined with NotActions to exclude what is not allowed, this permits viewing, creating, modifying, and deleting resources.' },
            { statement: 'NotActions', answer: '"Microsoft.Authorization/*/Write", "Microsoft.Authorization/*/Delete"', explanation: 'NotActions excludes role assignment management (access permissions). This prevents the custom role from managing RBAC while allowing all other resource operations.' }
        ]
    },
    68: {
        type: 'dropdown',
        title: 'Conditional Access Policy Settings',
        items: [
            { statement: 'Users – Include', answer: 'All users', explanation: 'The requirement states ALL users must use MFA when accessing the Azure portal.' },
            { statement: 'Cloud apps or actions – Include', answer: 'Microsoft Azure Management', explanation: '"Microsoft Azure Management" is the cloud app that represents the Azure portal. Select this specific app to trigger the policy only for portal access.' },
            { statement: 'Grant – Access controls', answer: 'Require multi-factor authentication', explanation: 'Under Grant controls, select "Require multi-factor authentication" to enforce MFA as the access requirement.' }
        ]
    },
    71: {
        type: 'dropdown',
        title: 'Dynamic Group Membership',
        items: [
            { statement: 'User1 is a member of', answer: 'Group1 and Group3', explanation: 'User1 matches the dynamic membership rules for Group1 (e.g., department = Sales) and Group3 (e.g., assigned membership). Check user properties against each group rule.' },
            { statement: 'User2 is a member of', answer: 'Group2 and Group3', explanation: 'User2 matches Group2 dynamic rule and Group3 criteria based on their user properties configured in Azure AD.' }
        ]
    },
    72: {
        type: 'dropdown',
        title: 'Modify User Attributes – Hybrid Identity',
        items: [
            { statement: 'Modify JobTitle', answer: 'Cloud-only users only (not synced users)', explanation: 'JobTitle is synced from on-premises AD. For synced (hybrid) users, you must change JobTitle in on-premises AD. Cloud-only users can be modified in Azure AD directly.' },
            { statement: 'Modify UsageLocation', answer: 'All users (both synced and cloud-only)', explanation: 'UsageLocation is an Azure AD-only attribute — it is NOT synced from on-premises. You can set it in Azure AD for all users regardless of sync status.' }
        ]
    },
    77: {
        type: 'yesno',
        title: 'Global Admin Access & Elevated Access',
        items: [
            { statement: 'Admin1 can manage the Azure subscription', answer: 'Yes', explanation: 'When "Access management for Azure resources" is enabled in Azure AD tenant properties, Global Admins get User Access Administrator role at root scope, allowing them to grant themselves access to any subscription.' },
            { statement: 'Admin2 can manage the Azure subscription', answer: 'Yes', explanation: 'All Global Admins gain the elevated access once the setting is enabled at the tenant level. It applies to all Global Administrators.' },
            { statement: 'Admin3 can manage the Azure subscription', answer: 'Yes', explanation: 'Same as above — the tenant-level setting applies to all Global Administrators, granting them access to manage Azure resources.' }
        ]
    },
    84: {
        type: 'yesno',
        title: 'Storage Account – File Share Access',
        items: [
            { statement: 'User1 can access share1 by using SMB', answer: 'Yes', explanation: 'User1 is a synced on-premises user. With AD DS authentication enabled for Azure Files, on-premises AD users can access file shares using their domain credentials via SMB.' },
            { statement: 'User2 can access share1 by using SMB', answer: 'No', explanation: 'User2 is a cloud-only Azure AD user. AD DS authentication for Azure Files requires on-premises AD identities. Cloud-only users cannot authenticate via SMB with AD DS auth.' },
            { statement: 'Group1 can be assigned RBAC on share1', answer: 'Yes', explanation: 'Security groups (synced from on-premises) can be assigned Azure RBAC roles like Storage File Data SMB Share Contributor on the file share.' }
        ]
    },
    85: {
        type: 'dropdown',
        title: 'VNet Configuration Permissions',
        items: [
            { statement: 'Add a subnet to VNet1', answer: 'User1 (Network Contributor)', explanation: 'Network Contributor role allows managing virtual networks including adding subnets. This requires Microsoft.Network/virtualNetworks/subnets/write permission.' },
            { statement: 'Peer VNet1 with another VNet', answer: 'User1 (Network Contributor)', explanation: 'VNet peering requires Microsoft.Network/virtualNetworks/peer/action which is included in the Network Contributor role.' }
        ]
    },
    86: {
        type: 'dropdown',
        title: 'Locks and Tags on Azure Resources',
        items: [
            { statement: 'Apply locks to', answer: 'Resource groups and resources (subscriptions, resource groups, and individual resources)', explanation: 'Locks can be applied at subscription, resource group, or individual resource level. All resource types support locks.' },
            { statement: 'Apply tags to', answer: 'Resource groups and resources (but NOT subscriptions directly in old portal)', explanation: 'Tags can be applied to subscriptions, resource groups, and resources. Note: tags are NOT inherited — child resources do not automatically get parent tags unless a policy enforces it.' }
        ]
    },
    88: {
        type: 'yesno',
        title: 'Azure Policy – Append Tag',
        items: [
            { statement: 'VNET1 will have Tag4: value4', answer: 'No', explanation: 'VNET1 is excluded from the policy (Exclusions: Sub1/RG1/VNET1). The append policy will not apply to excluded resources.' },
            { statement: 'RG1 will have Tag4: value4', answer: 'No', explanation: 'The "Append a tag" policy applies to resources, not resource groups. Resource groups are a different resource type than the ones targeted by this policy definition.' },
            { statement: 'After policy assignment, new resources in RG6 will have Tag4', answer: 'Yes', explanation: 'New resources deployed to non-excluded scopes under Sub1 will have Tag4:value4 appended by the policy during creation.' }
        ]
    },
    92: {
        type: 'dropdown',
        title: 'Load Balancer Roles',
        items: [
            { statement: 'User1 can add a backend pool to LB1', answer: 'Yes – has Contributor role', explanation: 'The Contributor role allows managing all resources except access. Adding a backend pool is a management operation on the load balancer.' },
            { statement: 'User1 can add a load balancing rule to LB1', answer: 'Yes – has Contributor role', explanation: 'Creating load balancing rules is a standard management operation covered by Contributor permissions on the load balancer resource.' }
        ]
    },
    94: {
        type: 'dropdown',
        title: 'Custom RBAC Role Capabilities',
        items: [
            { statement: 'The role can create VMs', answer: 'Check Actions for Microsoft.Compute/virtualMachines/*', explanation: 'If Actions includes "Microsoft.Compute/virtualMachines/*" or "Microsoft.Compute/*" or "*", the role can create VMs unless blocked by NotActions.' },
            { statement: 'The role can create VNets', answer: 'Check Actions for Microsoft.Network/virtualNetworks/*', explanation: 'Creating VNets requires Microsoft.Network/virtualNetworks/write permission. Check if this is in Actions and not in NotActions.' }
        ]
    },
    97: {
        type: 'dropdown',
        title: 'Azure Policy Assignment Scope',
        items: [
            { statement: 'Can assign Policy1 to', answer: 'Management groups, subscriptions, and resource groups', explanation: 'Azure Policy can be assigned at management group, subscription, or resource group scope. It cannot be assigned directly to individual resources.' },
            { statement: 'Can exclude from Policy1', answer: 'Subscriptions, resource groups, and resources', explanation: 'Exclusions can be defined at subscription, resource group, or individual resource level within the assignment scope.' }
        ]
    },
    106: {
        type: 'dropdown',
        title: 'Clone Custom RBAC Roles',
        items: [
            { statement: 'Role3 (Azure subscription role) can be cloned from', answer: 'Role1 and Role2 (any Azure role with subscription assignable scope)', explanation: 'Azure subscription custom roles can only be cloned from other Azure roles (not Azure AD roles). Any role with subscription/management-group scope works.' },
            { statement: 'Role4 (Azure AD role) can be cloned from', answer: 'Built-in Azure AD roles only', explanation: 'Azure AD custom roles can only be cloned from existing Azure AD roles. You cannot clone an Azure subscription role to create an Azure AD role.' }
        ]
    },
    110: {
        type: 'yesno',
        title: 'Access Package – Connected Organizations',
        items: [
            { statement: 'Users from fabrikam.com can request the access package', answer: 'Yes', explanation: 'Fabrikam.com is configured as a connected organization. The access package allows requests from connected organizations.' },
            { statement: 'Users from litwareinc.com can request the access package', answer: 'No', explanation: 'Litwareinc.com is NOT configured as a connected organization. Only users from connected organizations (or all users if configured) can request access packages.' },
            { statement: 'External user accounts will be removed when access expires', answer: 'Yes', explanation: 'The external user lifecycle setting is configured to remove external users when their last access package assignment expires.' }
        ]
    },
    112: {
        type: 'yesno',
        title: 'Resource Group RBAC',
        items: [
            { statement: 'User1 can create resources in RG1', answer: 'Yes', explanation: 'Check User1 role assignments. If User1 has Contributor or Owner role (directly or through group membership) on RG1, they can create resources.' },
            { statement: 'User2 can manage access to RG1', answer: 'No', explanation: 'Managing access (assigning roles) requires Owner or User Access Administrator role. Contributor cannot manage access permissions.' },
            { statement: 'User3 can view resources in RG1', answer: 'Yes', explanation: 'Reader role (or any higher role) allows viewing resources. If User3 has at least Reader on RG1 through any role assignment, they can view resources.' }
        ]
    },
    115: {
        type: 'yesno',
        title: 'NSG Role Assignments',
        items: [
            { statement: 'User1 can create inbound security rules for NSG1', answer: 'Yes', explanation: 'If User1 has Network Contributor or Contributor role on NSG1, they can create security rules (Microsoft.Network/networkSecurityGroups/securityRules/write).' },
            { statement: 'User1 can associate NSG1 to a subnet', answer: 'No', explanation: 'Associating an NSG to a subnet requires write permission on the VNet/subnet, not just the NSG. User1 needs Network Contributor on the VNet as well.' },
            { statement: 'User1 can delete NSG1', answer: 'Yes', explanation: 'With Contributor/Network Contributor role on NSG1, User1 has delete permissions (Microsoft.Network/networkSecurityGroups/delete).' }
        ]
    },
    117: {
        type: 'yesno',
        title: 'Management Group RBAC Inheritance',
        items: [
            { statement: 'User1 can create VMs in Sub1', answer: 'Yes', explanation: 'User1 has Virtual Machine Contributor assigned directly on Sub1, which grants VM creation permissions.' },
            { statement: 'User1 can create VMs in Sub3', answer: 'No', explanation: 'User1 only has Virtual Machine Contributor on Sub1 and Sub2. Sub3 is not part of MG1 and has no direct role assignment for User1.' },
            { statement: 'User1 can assign roles in Sub1', answer: 'Yes', explanation: 'User1 has User Access Administrator on MG1, which is inherited by Sub1 (a member of MG1). UAA allows managing role assignments.' }
        ]
    },
    120: {
        type: 'yesno',
        title: 'Azure AD License Assignment via Groups',
        items: [
            { statement: 'User1 has an Azure AD Premium P2 license', answer: 'Yes', explanation: 'User1 is a member of Group1 which has P2 license assigned. Group-based licensing automatically assigns the license to all group members.' },
            { statement: 'User2 has an Azure AD Premium P2 license', answer: 'Yes', explanation: 'If User2 is a member of Group1 (directly or via nested group), they inherit the P2 license through group-based licensing.' },
            { statement: 'Group2 members have Azure AD Premium P2 license', answer: 'Yes', explanation: 'If Group2 is nested inside Group1, members of Group2 inherit the license assigned to Group1. Group-based licensing supports nested groups.' }
        ]
    },
    121: {
        type: 'dropdown',
        title: 'Modify User Attributes – Hybrid Identity',
        items: [
            { statement: 'Modify JobTitle', answer: 'Cloud-only users only', explanation: 'JobTitle is synced from on-premises AD via Azure AD Connect. For synced users, this attribute is "source of authority" = on-premises and cannot be changed in Azure AD.' },
            { statement: 'Modify UsageLocation', answer: 'All users', explanation: 'UsageLocation is an Azure AD-only property that is NOT synced from on-premises. It can be modified in Azure AD for both synced and cloud-only users.' }
        ]
    },
    126: {
        type: 'dropdown',
        title: 'AzCopy Authentication Methods',
        items: [
            { statement: 'Blob storage', answer: 'Azure AD or SAS token', explanation: 'AzCopy supports both Azure AD authentication (azcopy login) and SAS tokens for Blob storage operations.' },
            { statement: 'File storage', answer: 'SAS token only', explanation: 'Azure Files does NOT support Azure AD authentication with AzCopy. You must use a SAS token for file storage operations with AzCopy.' }
        ]
    },
    127: {
        type: 'dropdown',
        title: 'Change External User Email',
        items: [
            { statement: 'Setting 1', answer: 'Email (under Identity)', explanation: 'Change the email address in the Identity section of the user Overview blade to update the authentication email.' },
            { statement: 'Setting 2', answer: 'User principal name', explanation: 'Update the user principal name to reflect the new email address for sign-in purposes.' }
        ]
    },
    131: {
        type: 'dropdown',
        title: 'Dynamic Group Membership Rule',
        items: [
            { statement: 'Property', answer: 'user.department', explanation: 'To filter by marketing department, use the user.department property in the dynamic membership rule.' },
            { statement: 'Operator', answer: '-eq', explanation: 'Use the equals (-eq) operator to match an exact department value.' },
            { statement: 'Value', answer: '"Marketing"', explanation: 'The value matches users whose department attribute equals "Marketing".' },
            { statement: 'Second rule – Property', answer: 'user.country', explanation: 'To also filter by France, add a second rule using user.country (or user.usageLocation).' },
            { statement: 'Second rule – Value', answer: '"France"', explanation: 'Combined with -and operator: (user.department -eq "Marketing") -and (user.country -eq "France")' }
        ]
    },
    132: {
        type: 'dropdown',
        title: 'Default User Role Permissions',
        items: [
            { statement: 'Prevent creating service principals', answer: 'Users can register applications → No', explanation: 'Setting "Users can register applications" to No prevents standard users from creating app registrations (service principals). This is under User settings.' },
            { statement: 'Only PowerShell/Graph for own resources', answer: 'Restrict access to Azure AD administration portal → Yes', explanation: 'Setting "Restrict access to Azure AD administration portal" to Yes forces non-admin users to use PowerShell or Microsoft Graph instead of the portal.' }
        ]
    },
    133: {
        type: 'yesno',
        title: 'Blob Storage RBAC with Conditions',
        items: [
            { statement: 'User1 can read blobs from container1', answer: 'Yes', explanation: 'User1 has Storage Blob Data Reader with Condition1. Check if the condition allows access to container1 based on the condition parameters (container name, tags, etc.).' },
            { statement: 'User1 can read blobs from container2', answer: 'No', explanation: 'Condition1 restricts User1 access to specific containers. Container2 does not match the condition criteria.' },
            { statement: 'User2 can read blobs from container1', answer: 'Yes', explanation: 'User2 has a role assignment with Condition2. If Condition2 allows access to container1, User2 can read from it.' }
        ]
    },
    135: {
        type: 'yesno',
        title: 'ARM Template Deployment Results',
        items: [
            { statement: 'The deployment creates a resource group', answer: 'Yes', explanation: 'Using New-AzDeployment (subscription-level deployment) with a template that includes Microsoft.Resources/resourceGroups creates a resource group.' },
            { statement: 'The deployment location is West US', answer: 'Yes', explanation: 'The -Location westus parameter specifies where the deployment metadata is stored. Resource group location is defined in the template.' },
            { statement: 'The resource group contains resources', answer: 'Depends on template', explanation: 'If the template only defines a resource group (and no nested deployments), the RG will be empty. Check template for nested resources.' }
        ]
    },
    140: {
        type: 'dropdown',
        title: 'Delete Users and Groups',
        items: [
            { statement: 'Can delete User1', answer: 'Check if cloud-only (Yes) or synced (No)', explanation: 'Synced users (source = Windows Server AD) cannot be deleted from Azure AD — they must be deleted on-premises. Cloud-only users can be deleted.' },
            { statement: 'Can delete Group1', answer: 'Check group type and source', explanation: 'Groups synced from on-premises cannot be deleted in Azure AD. Cloud-only groups (security or M365) can be deleted.' },
            { statement: 'Can delete Group2', answer: 'Check group type and source', explanation: 'Same rule: if synced from AD, cannot delete in Azure AD. If cloud-created, can be deleted.' }
        ]
    },
    142: {
        type: 'yesno',
        title: 'Subscription & Resource Group RBAC',
        items: [
            { statement: 'User1 can create resources in RG1', answer: 'Yes', explanation: 'Check User1 role on the subscription or RG1. Contributor or Owner at subscription level is inherited by all resource groups.' },
            { statement: 'User2 can move resources between resource groups', answer: 'Yes', explanation: 'Moving resources requires Contributor/Owner on both source and target resource groups. Check User2 roles on both RGs.' },
            { statement: 'User3 can create resource groups', answer: 'No', explanation: 'Creating resource groups requires Contributor/Owner at the subscription level. Resource group-level roles do not grant subscription-level permissions.' }
        ]
    },
    148: {
        type: 'dropdown',
        title: 'Delete Users and Groups (Entra)',
        items: [
            { statement: 'Which users can be deleted', answer: 'Cloud-only users (not synced from on-premises AD)', explanation: 'Users with source "Azure Active Directory" can be deleted. Users with source "Windows Server AD" (synced via AD Connect) must be deleted on-premises.' },
            { statement: 'Which groups can be deleted', answer: 'Cloud-only groups (created in Azure AD)', explanation: 'Groups synced from on-premises cannot be deleted in Entra ID. Only cloud-created groups can be managed (deleted) directly.' }
        ]
    },
    149: {
        type: 'dropdown',
        title: 'Key Vault Access for App Service',
        items: [
            { statement: 'What to create for app1', answer: 'System-assigned managed identity', explanation: 'A managed identity allows app1 to authenticate to Key Vault without storing credentials. System-assigned is tied to the app lifecycle.' },
            { statement: 'Which key vault can provide the secret', answer: 'Key vault in the same Azure AD tenant', explanation: 'The app and Key Vault must be in the same Azure AD tenant for managed identity authentication to work. Region does not matter.' }
        ]
    },
    156: {
        type: 'dropdown',
        title: 'Storage Account Capabilities',
        items: [
            { statement: 'Which account supports lifecycle management', answer: 'GPv2 or BlobStorage accounts', explanation: 'Blob lifecycle management (tiering policies) requires General Purpose v2 or BlobStorage accounts. GPv1 does not support lifecycle management.' },
            { statement: 'Which account supports NFS file shares', answer: 'Premium FileStorage account', explanation: 'NFS protocol for Azure Files requires a FileStorage (Premium) account type. Standard accounts only support SMB.' }
        ]
    },
    158: {
        type: 'dropdown',
        title: 'Storage Access – Managed Identity vs SAS',
        items: [
            { statement: 'App1 (App Service, managed identity, long-term)', answer: 'Azure RBAC role assignment (Storage Blob Data Reader)', explanation: 'For long-term access with managed identity, assign an RBAC role. This avoids secrets entirely and does not expire.' },
            { statement: 'App2 (container instance, 30-day limit)', answer: 'SAS token with 30-day expiry', explanation: 'A SAS token with a 30-day expiration provides temporary, time-limited access. After 30 days, access is automatically revoked.' }
        ]
    },
    159: {
        type: 'dropdown',
        title: 'Storage Account CLI Command',
        items: [
            { statement: 'Kind', answer: 'StorageV2 (GPv2)', explanation: 'StorageV2 supports hot, cool, and archive tiers. BlobStorage also supports tiers but GPv2 is more cost-effective and feature-complete.' },
            { statement: 'SKU', answer: 'Standard_GRS (or Standard_RAGRS)', explanation: 'GRS (Geo-Redundant Storage) provides fault tolerance against regional disasters by replicating to a secondary region. LRS/ZRS do not protect against regional failure.' },
            { statement: 'Access tier', answer: 'Hot', explanation: 'Hot is the default access tier. The question asks for a default; individual blobs can later be set to cool or archive.' }
        ]
    },
    161: {
        type: 'yesno',
        title: 'Azure Policy – Allowed Resource Types',
        items: [
            { statement: 'VM1 will continue to run', answer: 'Yes', explanation: 'Azure Policy does not stop or delete existing non-compliant resources. VM1 will be flagged as non-compliant but continues running.' },
            { statement: 'You can create a new VM in the subscription', answer: 'No', explanation: 'The policy restricts allowed resource types. If Microsoft.Compute/virtualMachines is NOT in the allowed list, new VMs cannot be created.' },
            { statement: 'You can create a new VNet in the subscription', answer: 'Yes', explanation: 'Microsoft.Network/virtualNetworks IS in the allowed resource types list, so new VNets can be created.' }
        ]
    },
    163: {
        type: 'dropdown',
        title: 'Azure File Sync – Server Endpoints',
        items: [
            { statement: 'Can you add E:\\Folder2 on Server1 as endpoint in Group1', answer: 'Yes', explanation: 'A registered server can have multiple server endpoints in different sync groups, as long as the paths do not overlap. E:\\Folder2 does not overlap D:\\Folder1.' },
            { statement: 'Can you add D:\\Folder1 on Server2 as endpoint in Group1', answer: 'Yes', explanation: 'Different servers can sync the same cloud endpoint (file share) through the same sync group. Each server maintains its own copy.' },
            { statement: 'Can you add a second cloud endpoint to Group1', answer: 'No', explanation: 'A sync group can only have ONE cloud endpoint (one Azure file share). You cannot add a second file share to the same sync group.' }
        ]
    },
    165: {
        type: 'dropdown',
        title: 'Storage Account Replication & Access Tiers',
        items: [
            { statement: 'Replication type for cross-region redundancy', answer: 'GRS or RA-GRS', explanation: 'GRS (Geo-Redundant Storage) replicates to a secondary region. RA-GRS additionally allows read access to the secondary. Both protect against regional disasters.' },
            { statement: 'Default access tier', answer: 'Hot or Cool', explanation: 'The default access tier determines cost structure. Hot = higher storage cost, lower access cost. Cool = lower storage, higher access. Choose based on access frequency.' }
        ]
    },
    166: {
        type: 'dropdown',
        title: 'Blob Storage Access Tiers',
        items: [
            { statement: 'Set blob tier using', answer: 'Set-AzStorageBlobContent or Set Blob Tier API', explanation: 'You can set access tier at upload time or change it later using Set Blob Tier. This works at the individual blob level.' },
            { statement: 'Archive tier characteristics', answer: 'Lowest cost, highest access latency (hours to rehydrate)', explanation: 'Archive tier has the lowest storage cost but data is offline. Rehydrating (moving to hot/cool) takes hours and incurs a high per-GB cost.' }
        ]
    },
    167: {
        type: 'yesno',
        title: 'Storage Account Properties',
        items: [
            { statement: 'Can change replication from LRS to GRS', answer: 'Yes', explanation: 'You can change replication type for GPv2 accounts. LRS → GRS is supported (data is replicated to secondary region).' },
            { statement: 'Can change account kind from BlobStorage to StorageV2', answer: 'Yes', explanation: 'You can upgrade BlobStorage or GPv1 accounts to GPv2 (StorageV2). This is a one-way upgrade with no downtime.' },
            { statement: 'Can change performance from Standard to Premium', answer: 'No', explanation: 'You CANNOT change performance tier after account creation. To go from Standard to Premium, you must create a new account and migrate data.' }
        ]
    },
    168: {
        type: 'dropdown',
        title: 'Blob Lifecycle Management',
        items: [
            { statement: 'Move to cool tier after', answer: 'X days since modification', explanation: 'Lifecycle management rules use "daysAfterModificationGreaterThan" to transition blobs. Unmodified blobs are moved to cool tier to save costs.' },
            { statement: 'Move to archive tier after', answer: 'X days since modification', explanation: 'Similar rule with a longer period. E.g., after 90 days without modification, move to archive for maximum cost savings.' },
            { statement: 'Delete after', answer: 'X days since modification or creation', explanation: 'Delete action removes blobs that exceed the retention period. Useful for compliance or cost management of old data.' }
        ]
    },
    172: {
        type: 'dropdown',
        title: 'Azure File Sync Components',
        items: [
            { statement: 'Cloud tiering', answer: 'Frequently accessed files cached locally, infrequent files tiered to Azure', explanation: 'Cloud tiering is a feature that caches frequently accessed files on the local server. Rarely-used files are replaced with namespace stubs that point to the Azure file share.' },
            { statement: 'Free space policy', answer: 'Percentage of volume to keep free on the server endpoint', explanation: 'The volume free space policy ensures that a specified percentage of the local volume remains free by tiering least-recently-used files to Azure.' }
        ]
    },
    175: {
        type: 'dropdown',
        title: 'Storage Account Network Rules',
        items: [
            { statement: 'Default action', answer: 'Deny', explanation: 'When configuring firewall rules, set default action to Deny so only explicitly allowed networks can access the storage account.' },
            { statement: 'Allow access from', answer: 'Selected virtual networks and IP addresses', explanation: 'Add specific VNet subnets (via service endpoints) and/or public IP ranges to the allow list for secure storage access.' }
        ]
    },
    177: {
        type: 'yesno',
        title: 'Storage Account Shared Access Signatures',
        items: [
            { statement: 'SAS with stored access policy can be revoked', answer: 'Yes', explanation: 'A SAS linked to a stored access policy can be revoked by modifying or deleting the access policy. This is the only way to revoke a SAS before expiry.' },
            { statement: 'Ad hoc SAS can be revoked', answer: 'No', explanation: 'An ad hoc SAS (not linked to stored access policy) CANNOT be revoked — it remains valid until it expires. The only option is to regenerate the storage account key.' },
            { statement: 'Service SAS can be restricted to specific IP', answer: 'Yes', explanation: 'Both Service SAS and Account SAS support IP range restrictions (signedIP/sip parameter) to limit access to specific client IPs.' }
        ]
    },
    179: {
        type: 'dropdown',
        title: 'Azure Disk Types',
        items: [
            { statement: 'Supports up to 160,000 IOPS', answer: 'Ultra Disk', explanation: 'Ultra Disks support up to 160,000 IOPS and 2,000 MBps throughput. They are designed for IO-intensive workloads like SAP HANA and transaction-heavy databases.' },
            { statement: 'Supports disk bursting', answer: 'Premium SSD (P30 and smaller)', explanation: 'Premium SSD disks of 512 GiB and smaller support credit-based bursting up to 3,500 IOPS and 170 MBps regardless of disk size.' }
        ]
    }
};

if (typeof module !== 'undefined') module.exports = HOTSPOT_ANSWERS;
