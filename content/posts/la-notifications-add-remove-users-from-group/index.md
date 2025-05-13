+++
date = '2025-05-13T21:33:59+01:00'
draft = true
title = 'La Notifications Add Remove Users From Group'
+++

> **NOTE:** output is not perfectly refined it displays a key value pair e.g {"email":"joe.bloggs@email.com"} with a blank key, however, this met my desired outcome, when I have time I will refine and update this post.


Log in to [portal.azure.com](https://portal.azure.com), search for and click on 'Logic app'.

![searching for logic app within azure portal](search-la.png)

<!-- Example of how to resize an image {{< resized-img src="search-la.png" height="100">}}  -->

Click Add

{{< resized-img src="add-la.png" height="150">}}

Tick the Multi-tenant option within "Consumption" and click select.

**INSERT SCREENSHOT**

Create a new resource group by clicking on the 'Create new' button under the Resource group value box and enter the name of your new resourse group.

**INSERT SCREENSHOT**

Name your logic app and select the desired region, I will be using UK South, for this demo I will not be enabling log analytics. Click 'Review + create'.

**INSERT SCREENSHOT**

Once your config has validated click create.

**INSERT SCREENSHOT**

Once your logic app has been deployed click 'Go to resource'

**INSERT SCREENSHOT**

You should now see your newly created logic app, from the menu on the left hand side expand 'Development Tools' and click 'Logic app designer'.

**INSERT SCREENSHOT**

Click 'Add a trigger'.

**INSERT SCREENSHOT**

Search for and click 'Recurrence'.

**INSERT SCREENSHOT**

You will now have a recurrence trigger within your desinger window and its settings on the right hand side.

**INSERT SCREENSHOT**

Here we configure the recurrence, I am setting the recurrence to run every 1 day at 21:00 (UTC+00:00) Dublin, Edinburgh, Lisbon, London and to start on 13/05/2025 at 21:00 and then run at 21:00 each day.

**INSERT SCREENSHOT**

Click the + button under the recurrence trigger then click 'Add an action'.

**INSERT SCREENSHOT**

Next we want a HTTP action and to specify the below options

|----------:|----------|
|**URI:**| https://graph.microsoft.com/v1.0/groups/YOURGROUPSOBJECTID/members?$top=999&select=id,displayName,userPrincipalName|
- **Method:** GET
- **Authentication type:** System-managed identity
- **Audience:** https://graph.microsoft.com/

**INSERT SCREENSHOT**

