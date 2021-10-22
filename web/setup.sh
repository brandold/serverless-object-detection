#!/bin/bash
CREDENTIALS=/home/ec2-user//.aws/credentials
if [[ -f "$CREDENTIALS" ]]; then
    echo "$CREDENTIALS found. Cloud9 is configure to use AWS Temporary credentials"
    cd ~/.aws
    ln -s credentials config
    cd ~/environment/stg309-workshop/web/front-end
else
    echo "[ERROR] You must configure Cloud9 to use AWS Temporary credentials to continue. Review the instructions in the workshop"
    return 2
fi
npm install -g @aws-amplify/cli
npm install react-scripts
