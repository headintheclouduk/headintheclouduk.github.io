+++
date = '2025-05-13T21:33:59+01:00'
draft = true
title = 'Automate email notifications when adding/removing users to a group using a Logic app'
+++

> **NOTE:** output is not perfectly refined it displays a key value pair e.g {"email":"joe.bloggs@email.com"} with a blank key, however, this met my desired outcome, when I have time I will refine and update this post.

# Prerequisites

You will need the following to implement this Logic app.

1. A resource group or permissions to create a new resource group
2. A storage account or permissions to create a storage account
3. Permissions to write to the storage account

# Steps

Log in to [portal.azure.com](https://portal.azure.com), search for and click on 'Logic app'.

![](search-la.png)

<!-- Example of how to resize an image {{< resized-img src="search-la.png" height="100">}}  -->

Click Add.

{{< resized-img src="add-la.png" height="150">}}

Tick the Multi-tenant option within 'Consumption' and click 'Select'.

{{< resized-img src="select-consumption.png" height="400">}}

Create a new resource group by clicking on the 'Create new' button under the Resource group value box and enter the name of your new resourse group.

![](create-rg.png)

Name your logic app and select the desired region, I will be using UK South, for this demo I will not be enabling log analytics. Click 'Review + create'.

![](select-region.png)

Once your config has validated click create.

![](summary.png)

Once your logic app has been deployed click 'Go to resource'

![](go-to-resource.png)


You should now see your newly created logic app, Expand 'Settings' on the left hand side menu and select 'Identity'

**INSERT SCREENSHOT**

Change the status of the 'System assigned' identity to 'On' and click 'Save'.

**INSERT SCREENSHOT**

We now need to grant the System assigned identity we just created the relevant permissions, to do this we

**FINISH THE PERMISSIONS SECTION**

from the menu on the left hand side expand 'Development Tools' and click 'Logic app designer'.

![](deployment-tools.png)

Click 'Add a trigger'.

![](add-trigger.png)

Search for and click 'Recurrence'.

![](recurrence.png)

You will now have a recurrence trigger within your designer window and its settings on the right hand side. Here we configure the recurrence, I am setting the recurrence to run every 1 day at 21:00 (UTC+00:00) Dublin, Edinburgh, Lisbon, London and to start on 13/05/2025 at 21:00 and then run at 21:00 each day.

![](recurrence-config.png)

Click the + button under the recurrence trigger then click 'Add an action'.

![](add-action.png)

Search and click on 'HTTP'

![](http.png)

Now enter the below options, make sure to substitue *YOURGROUPSOBJECTID* with the object id of the group you'd like to monitor:

You can also rename each of your actions by clicking on the title of the action erasing and typing in your desired name, In this example I have change the name 'HTTP' to 'get-group-members'. Be as descriptive as you can to make life for your future self easier.

|                    |                    |
|--------------------|--------------------|
|**URI:**            | https://graph.microsoft.com/v1.0/groups/YOURGROUPSOBJECTID/members?$top=999&select=id,displayName,userPrincipalName|
|**Method:**         | GET                |
|**Authentication:** | System-managed identity|
|**Audience:**       | https://graph.microsoft.com/|


**INSERT SCREENSHOT**

Now add a Parse JSON action, we'll use this action to parse the output of our previous graph query to make it easier to work with.

|                    |                    |
|--------------------|--------------------|
|**Content:**        | *body('get-group-members')?['value']* |

> **IMPORTANT!** When adding the content value you need to add it as a function by clicking on the fx button that appears when you click in the Content box. I will *italisise* everything that needs to be added as a function.

**INSERT SCREENSHOT**

The required schema is below, paste this directly into the schema box.

```JSON
{

  "type": "array",

  "items": {

    "type": "object",

    "properties": {

      "@@odata.type": {

        "type": "string"

      },

      "id": {

        "type": "string"

      },

      "displayName": {

        "type": "string"

      },

      "userPrincipalName": {

        "type": "string"

      }

    },

    "required": [

      "@@odata.type",

      "id",

      "displayName",

      "userPrincipalName"

    ]
  }
}
```

Now add a select with the below values. This select isolates just the id value from the output of 'parse-get-group-members-output'.

|                    |                    |
|--------------------|--------------------|
|**Name:**                | select-id     |
|**From:**                | *body('parse-get-group-members')* |
|**Map Key:**             | Leave this blank   |
|**Map value:**           | *item()?['id']*      |

**INSERT SCREENSHOT**

> Don't forget to add them as functions, you'll know when you haven't as it'll show as plain text rather than an object like it displays in the screenshot above.

Now add a 'Get blob content (V2) action. Below are the required parameters:

|                    |                    |
|--------------------|--------------------|
|**Name:**           | get-previous-members |
|**Storage account:**                | NAME-OF-YOUR-STORAGE-ACCOUNT     |
|**Blob:**                | NAME-OF-YOUR-JSON-FILE-CREATED-EARLIER.json |
|**Infer Content Type:**             | Yes   |
|**Authentication:**           | System-assigned managed identity      |

Now add another Parse JSON action with the below parameters:

|                    |                    |
|--------------------|--------------------|
|**Name:**           | parse-previous-members |
|**Content:**                | *string(body('get-previous-members))*     |
|**Blob:**                | NAME-OF-YOUR-JSON-FILE-CREATED-EARLIER.json |
|**Schema:**         | Copy the same schema we used in 'parse-get-grou-members' |

Now add another 'Select'. This select is isolating just the ID values from the JSON file.

|                    |                    |
|--------------------|--------------------|
|**Name:**                | select-previous-id     |
|**From:**                | *body('parse-previous-members')* |
|**Map Key:**             | Leave this blank   |
|**Map value:**           | *item()?['id']*      |