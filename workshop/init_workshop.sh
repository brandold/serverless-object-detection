#!/bin/sh

python3 -m venv rt-workshop
source rt-workshop/bin/activate
cd rt-workshop
export AWS_DEFAULT_REGION='us-west-2'
export C9_EC2_ID=`aws ec2 describe-instances --region us-west-2 --filters Name=tag-key,Values='aws:cloud9:environment' Name=instance-state-name,Values='running' --query "Reservations[*].Instances[*].InstanceId" --output text`
export BUCKET_NAME=`aws s3api list-buckets --query "reverse(sort_by(Buckets, &CreationDate))[:1] | [0].Name" | tr -d '"'`
aws ec2 associate-iam-instance-profile --iam-instance-profile Name=RTWorkshopInstanceProfile --region us-west-2 --instance-id $C9_EC2_ID
pip --disable-pip-version-check install -q boto3
pip --disable-pip-version-check install -q chalice
pip --disable-pip-version-check install -q opencv-python