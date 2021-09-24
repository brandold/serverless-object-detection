# Lab 1 - Get your environment setup!


## Launch workshop cloudformation stack

*hint - open in new tab*

[Click me!](https://console.aws.amazon.com/cloudformation/home?region=us-west-2#/stacks/new?stackName=rt-workshop&templateURL=https://s3-us-west-2.amazonaws.com/www.roseburgtech.org/workshops/workshop_template.yaml)

- Wait for the stack to show "Create Complete" before progressing onto the next step

## Open the Cloud9 IDE

### Once the workshop stack has been successfully created, follow the steps below to access the hosted project IDE

- You can access the Cloud9 Console using the shortcut below:

*hint - open in new tab*

[Cloud9 Shortcut](https://us-west-2.console.aws.amazon.com/cloud9/home?region=us-west-2)

- Or you can follow these steps:

1. Navigate to the services tab in the AWS navigation bar
2. Search for Cloud9 and select the link for Cloud9

- Once you get to the Cloud9 Console, click open IDE on the created environment
- On the initial opening of the IDE, some first time automation needs to run. Wait for it to complete before moving on. 

*if you dont see 'Open IDE, expand the menu in the top left and click on 'Environments'*

## Initialize the workshop

### Once the initial automation completes, you should have a shell ready for use. From the current working directory, run:

`. ./stg309-workshop/init_workshop.sh`

- Again, this needs some time to run. Wait for it to complete before progressing.

## Turn off the managed C9 Credentials

### For the workshop to run correctly, we need to disable to default credentials that Cloud 9 provides us:

1. In the Cloud9 Environment, select 'AWS Cloud 9' in the top left corner, then 'preferences'
2. Scroll down to AWS Settings, then select 'credentials'
3. Click the radio button for 'AWS Managed temporary credentials' and ensure it is not checked (should be grey, not green)

# Lab 2 - Deploy the API!

## Now that our environment is configured properly, we can deploy the API and test our API

- From the CLI, run:
`chalice deploy`

- This will create our serverless lambda function, REST API, and associated security roles
- Run the command below, but replace the API Endpoint with the URL that was returned from the deploy command

`export MY_API_URL='https://your-api-endpoint/api/'`

## Test the API

- From the current working directory, run the following command, making sure to replace the api with what was returned in the last step:

`curl --location --request POST $MY_API_URL/detectObjects --header 'Content-Type: image/jpeg' --data-binary '@./images/people_test.jpg'`

# Lab 3 - Add support to API for returning an overlayed image

- From the navigation tree in the left pane, open up the app.py file 
- Parse the code and find the sections that have comments saying 'Uncomment' or 'Comment' and do as it says
- Save the updated code and redeploy the API with:
`chalice deploy`

## Test the new functionality in the API, again making sure you replace the api with yours

`curl --location --request POST $MY_API_URL/detectObjects?returnImage=true --header 'Content-Type: image/jpeg' --data-binary '@./images/people_test.jpg'`

# Lab 4 - Deploy a webapp to interact with the API

## Modify the webapp code to query your API endpoint

- Open the app.js file under the web directory
- Replace the 'replaceMe' variable with your REST API URL (`echo $MY_API_URL`) in the XMLHTTPRequest

## Deploy the webapp

1. `cd web` 

2. `aws s3 sync . s3://$BUCKET_NAME`

## Grab your webapp URL from Cloudformation
- Open the [cloudformation console](https://us-west-2.console.aws.amazon.com/cloudformation/home?region=us-west-2) in a new tab
- Find the stack you initally created and click on it
- Select the 'Outputs' tab
- Grab the URL from the WebsiteURL Value and paste it into a new tab


## Test the webapp

- Upload an image from your computer using the file browser and explore the results


# Cleanup

- From the shell, run:

1. `cd ..`

2. `chalice delete`

- Then run the following commands:


`aws s3api delete-object --bucket $BUCKET_NAME --key app.js`

`aws s3api delete-object --bucket $BUCKET_NAME --key index.html`

- Finally, navigate back to the Cloudformation console and delete the workshop stack

1. Click on the workshop stack
2. Click the 'Delete' button in the right viewing pane
3. Wait for the stack to successfully delete

# Done!