+++
date = '2025-04-29T08:58:03+01:00'
draft = true
title = 'Creating an Enterprise App for SSO'
+++
In this blog post I'll walk you through the below

1. Creation of an Entra ID security group.
2. Creation of an Enterprise Application.
3. Creation of a Logic App to automatically send emails when a user is added or removed from an EntraID security group.

## Creation of an Entra ID security group
Security groups within Entra ID are a useful tool reducing administrative tasks. In this example we will create a dynamic security group