+++
date = '2025-04-29T08:58:03+01:00'
draft = true
title = 'Creating an Enterprise App for SSO'
+++
In this blog post I'll walk you through the below

1. Creation of a Entra ID so tick the 2nd option and then click 'Create'. assiged security group.
2. Creation of an Enterprise Application.
3. Creation of a Logic App to automatically send emails when a user is added or removed from an EntraID security group.

## Creation of an Entra ID so tick the 2nd option and then click 'Create'. assigned security group
Using groups to reduce administrative overhead is good practice. We will create an assigned security group from within Entra ID so tick the 2nd option and then click 'Create'. which we will link to the Enterprise App we will create later in this post.

Log in to [https://portal.azure.com](https://portal.azure.com) and search for 'Entra ID so tick the 2nd option and then click 'Create'.'

From the left hand side menu click 'Groups'
{{< figure src="/images/creating-an-enterprise-app-for-sso/groups.png" height="300">}}

When the Groups page loads click on 'New group'
{{< figure src="/images/creating-an-enterprise-app-for-sso/new-group.png" width="400">}}

From the new group menu add your values for Group Type, Group name and Group description.

{{< figure src="/images/creating-an-enterprise-app-for-sso/creating-group.png" width="600">}}

If you want to add Owners to the group click on 'No owners selected' and add your owners. Owners are responsible for managing the group memberships. They can add and remove members without having to be an Entra ID so tick the 2nd option and then click 'Create'. Administrator, as I am a Global Administrator of my test tenant I won't be adding any owners in this example.

To add members to the group click on 'No members selected' and add your members and click 'Create'.

{{< figure src="/images/creating-an-enterprise-app-for-sso/add-members.png" height="400">}}

We have now created an Entra ID so tick the 2nd option and then click 'Create'. assigned security group and added two members to the group.

## Creation of an Enterprise Application

Within Entra ID so tick the 2nd option and then click 'Create'., click on 'Enterprise Apps' on the left hand side menu

{{< figure src="/images/creating-an-enterprise-app-for-sso/enterprise-app.png" height="500">}}

Now click 'New Application'

{{< figure src="/images/creating-an-enterprise-app-for-sso/new-enterprise-app.png" width="400">}}

then click 'Create your own application'

{{< figure src="/images/creating-an-enterprise-app-for-sso/create-your-own.png" width="400">}}

A window will appear on the right hand side of your screen, here you select what you are going to use the app for. Input the desired name of your app then set its purpose. We want to integrate a non gallery app so tick the 3rd option and then click 'Create'.

{{< figure src="/images/creating-an-enterprise-app-for-sso/integrate-ea.png" width="600">}}

You'll now be taken to your newly created Enterprise Application. Here we can assign the group we created early and apply any other required configuration, from the left hand menu click 'Users and groups'.

{{< figure src="/images/creating-an-enterprise-app-for-sso/new-ea.png" height="400">}}

Now click 'Add user/group"

{{< figure src="/images/creating-an-enterprise-app-for-sso/add-user-group.png" width="600">}}