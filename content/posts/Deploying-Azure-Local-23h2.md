+++
date = '2025-03-24T21:45:12Z'
draft = true
title = 'Deploying Azure Local 23H2 via the Azure Portal'
+++

Recently I had the task of deploying an Azure Local 23H2 cluster and when searching for a clear "how to" stumbled across many outdated deployment guides and a rabbit warren of Microsoft Learn links so here i'm writing this for anyone like my past self who would have saved hours of time if i'd had a guide like this to read pre-deployment.

In this post I am assuming that you know how to install a Windows OS and how to install firmware and drivers.

# Useful Links
Here are a bunch of useful links to MS Learn articles to start your search if for any reason your deployment needs to different from what I describe.

- [Preparing AD](https://learn.microsoft.com/en-us/azure/azure-local/deploy/deployment-prep-active-directory?view=azloc-24113)
- [Install Azure Local 23H2](https://learn.microsoft.com/en-us/azure/azure-local/deploy/deployment-install-os?view=azloc-24113#prerequisites)

# Preparing Active Directory
The first step is to prepare AD for the upcoming Azure Local deployment. Microsoft have kindly created a PowerShell module to make this step simple. Below I detail each step required for the AD preperation.

Lets start by installing the required PowerShell modules.

On a computer that is joined to your AD Domain open PowerShell as Administrator and run the below commands
```
Install-Module AsHciADArtifactsPreCreationTool -Repository PSGallery -Force
```
> If you have installed a previous version of the AsHciADArtifactsPreCreationTool module make sure to uninstall any previous versions of the module.

Once the modules have been installed we then need to import the module.

```
Import-Module AsHciADArtifactsPreCreationTool
```
Now we have the required module installed lets build the command that will do the AD preparation for us, there is only 1 part of the command that requires customisation and that is **"OU=<OU>,DC=<domain>,DC=<com>"** here you need to specify which OU you would like the Azure Local cluster to be deployed into.

```
New-HciAdObjectsPreCreation -AzureStackLCMUserCredential (Get-Credential) -AsHCIOUName "OU=<OU>,DC=<domain>,DC=<com>"
```
> - The -AsHCIOUName path does not support any of the following special characters &,",',<,>
> - Once the deployment is complete, moving the computer objects to a different OU is not supported.

You will be prompted to enter credentials, enter the username and password for the deployment.

>- Make sure the username is no longer than 64 characters and only contains leters, numbers, hyphens and underscores, it cannot start with a hyphen or a number.
>- Make sure the password meets complexity and length requirements.

Open AD and confirm the OU has been created, the OU will contain the new Lifecycle Manager (LCM) deployment user account and will have inheritance blocked by default.

<!-- # Installing Azure Local 23H2
Now we have preparted AD the next step is to install the OS onto our desired hardware, for this guide I am installing the OS onto 2 identical Dell AX-760s so certain parts of this guide will be tailored to using Dell hardware.

I'm assuming if you're attempting to build a failover cluster you know how to install Windows so I will be skipping the installation steps and focusing on the Azure specific configuration, if you require assistance with the installation of Windows refer to [Install Azure Local 23H2](https://learn.microsoft.com/en-us/azure/azure-local/deploy/deployment-install-os?view=azloc-24113#prerequisites)

# Installing required drivers
Now you have Azure Local 23H2 running on your desired hardware its time to ensure all the firmwares and drivers are updated, this a requirement before deploying the cluster.

As I mentioned earlier I am using 2 x Dell AX-760s to run my Azure Local 23H2 cluster, I gathered the required firmwares and driver install media from [Dell's GitHub](https://dell.github.io/azurestack-docs/docs/hci/supportmatrix/2412/16g_hci/) and installed all the required drivers  -->

# Create required pre-requisite Azure resources
Ahead of configure the cluster nodes we need to create a few resources in Azure to ensure a smooth Arc regisitration.

We will require:

- 1 x Resource Group
- 1 x Storage Account to host the quorum witness

I will go through te creation of the storage account as their are specific requirements, I'm assuming you have the existing knowledge to create a resource group.

# Storage Account creation
Start the creation of a storage account via the Azure portal. public access must be enabled (unless you're connecting via a private endpoint however this guide will not cover that).

## INSERT SCREENSHOT

# Configuring Azure Local 23H2 ready for deployment

The first thing I do after installing the OS is not required but makes life easier in the future is to rename your NICs. As part of the cluster deployment you will need to select the relevant NICs via the Azure portal, this is much easier when your NICs are named for there purpose instead of being named "Port#1", "Port#2", etc.

I was working with 3 pairs of NICs and named them as shown below, note if you don't know already, here is where you need to decide which physical NIC will be connected to what.

```
Rename-NetAdapter -Name "Port3" -NewName "Storage"
Rename-NetAdapter -Name "Port4" -NewName "Storage1"
Rename-NetAdapter -Name "Port5" -NewName "Compute"
Rename-NetAdapter -Name "Port6" -NewName "Compute1"
Rename-NetAdapter -Name "Port7" -NewName "Management"
Rename-NetAdapter -Name "Port8" -NewName "Management1"
```
We can confirm this has worked by running 'get-netadapter' and the new names should be displayed in the "Name" column.

**INSERT SCREENSHOT HERE**

Now we can easily identify the role of each NIC lets configure the management interface.

## Set Managment Team IP Configuration

When deploying Azure 23H2 via the Azure portal, NIC teaming is done at the deployment stage, however our servers need to connect to Azure for a successful deployment therefore require an IP address, lets set one now.

To set the IP address via cli we use 'New-NetIPAddress'. In the example below we will set the NIC with the alias "Management" to have an IP address of 10.0.0.1, a subnet mask of 255.255.255.0 which in CIDR notation is /24 and a default gateway of 10.0.0.254, I'm using a /24 in this example for ease of demonstration, set your subnet size according to your personal requirements.

```
New-NetIPAddress -InterfaceAlias "Management" -IPAddress "10.0.0.10" -PrefixLength 24 -DefaultGateway "10.0.0.254"
```
we can set the DNS servers with the below command

```
Set-DNSClientServerAddress - InterfaceAlias "Management" -ServerAddress "10.0.1.10","10.0.1.11"
```
To check all the config has applied run 'ipconfig /all' you can also ping the gateway and ensure you get an icmp reply.

## Configure time settings
To ensure the OS you have just installed is in sync with the domain you will be joining as part of the deployment process we will manually set the time settings. These settings will be overridden upon domain join, however its vital the servers are in the correct time zone etc pre-deployment.

Run the below commands to set your time servers manually, In my example the 2 servers specificed are domain controllers so they act as DNS and time servers.

```
#Configure time
w32tm /config /manualpeerlist:"10.0.1.10,10.0.32.11" /syncfromflags:manual /update

#Confirm time
w32tm /query /status
```

## Enable RDP
So we can manage the cluster nodes via RDP post cluster deployment lets enable RDP. The easiest way of doing this is via sconfig.

From the sconfig menu select option 7

# INSERT SCREENSHOT HERE

Then type 'e' and '1'

# INSERT SCREENSHOT HERE

## Change computer name
The final step in the host configuration pre arc registration is change the hostname of the computer, we do this step last as it requires a reboot to take effect. We can also do this via sconfig.

From the sconfig menu select option 2

# INSERT SCREENSHOT HERE

Now input the new name for the computer. and type Y and hit enter to restart the server.

# INSERT SCREENSHOT HERE

## Register each node with Azure Arc
Each node needs to be registered with Arc for Azure to be aware of the servers pre-deployment. To register each server we need to run a registration script detailed below.

```Define the subscription where you want to register your machine as Arc device
$Subscription = "<SUBSCRIPTION ID>"

#Define the resource group where you want to to register your machine as an Arc device
$RG = "<RESOURCE GROUP NAME>"

#Define the region to use to register your server as an Arc device
#Do not use spaces or capital letters when defining a region
$Region = "westeurope"

#Define the tenant you will use to register your machine as an Arc device
$Tenant = "<TENANT ID>"

#Define the proxy address if your Azure local deployment accesses the internet via a proxy, if not skip setting the $proxyServer variable
$proxyServer = "http://proxyaddress:port"

#Connect to your Azure account and subscription
Connect-AzAccount -SubscriptionId $Subscription -TenantId $Tenant -DeviceCode

#Get the access token for the registration
$ARMToken = (Get-AzAccessToken -WarningAction SilentlyContinue).Token

#Get the account ID for the registration
$id = (Get-AzContext).Account.Id

#Invoke the registration script
Invoke-AzStackHciArcInitialization -SubscriptionID $Subscription -ResourceGroup $RG -TenantID $Tenant -Region $Region -Cloud "AzureCloud" -ArmAccessToken $ARMtoken -AccountID $id
```
The cli will keep regreshing as the server goes throigh all the required steps until it reaches

## INSERT SCREENSHOT

It will then trigger a log collecton

## INSERT SCREENSHOT

exit upon completion, within the RG you created earlier you'll be able to see the registered server

## INSERT SCREENSHOT

The mandatory Azure extensions will be installed on your machine

## INSERT SCREENSHOT

# Cluster deployment
We've now completed all the pre-requisites for the cluster deployment, within the Azure portal search for "Azure Arc". Within Azure Arc > Host environmnets > Azure Local > Deploy Local

## INSERT SCREENSHOT

Select your subscription and resource group

## INSERT SCREENSHOT

Choose your instance name (name of cluster) and its region

## INSERT SCREENSHOT

Select the nodes you want to form the cluser and validate each nodes cluster

## INSERT SCREENSHOT

Select the keyvault you created earlier and click 'Next: Configuration'

## INSERT SCREENSHOT

Select 'New configuration'. We are deploying a cluster with switchless storage so we need to select 'no switch for storage' this means you have to have direct connections between the 2 servers.

## INSERT SCREENSHOT

We need to map out network traffic types by intent so we select custom configuration

## INSERT SCREENSHOT

Create your intents, in this example I have split each intent into a seperate NIC team

## INSERT SCREENSHOT

 For the Management intent ensure RDMA is disabled.

 ## INSERT SCREENSHOT

 Specifiy your IP configuration and validate the subnet

 ## INSERT SCREENSHOT

 Specify all the AD information you prepped earlier

## INSERT SCREENSHOT

Click 'Customised security settings' and click the 7th security option in addition to the 6 security defaults.

## INSERT SCREENSHOT

Create workload volumes as well as infrastructure volumes

## INSERT SCREENSHOT

Add the relevant tags