#!/bin/sh

sudo yum -y install amazon-efs-utils
sudo yum install -y mesa-libGL
sudo mkdir /mnt/efs
sudo mkdir /mnt/efs/models
python3 -m venv stg309-workshop
source stg309-workshop/bin/activate
cd stg309-workshop
export AWS_DEFAULT_REGION='us-west-2'
export C9_EC2_ID=`aws ec2 describe-instances --region us-west-2 --filters Name=tag-key,Values='aws:cloud9:environment' Name=instance-state-name,Values='running' --query "Reservations[*].Instances[*].InstanceId" --output text`
# Get file system id
export FILESYSTEM=`aws cloudformation describe-stacks --query "Stacks[?starts_with(StackName, `stg`)].Outputs[0].OutputValue" --output text`
# Mount filesystem
sudo mount -t nfs4 -o nfsvers=4.1,rsize=1048576,wsize=1048576,hard,timeo=600,retrans=2,noresvport $FILESYSTEM.efs.us-west-2.amazonaws.com:/ /mnt/efs
#export BUCKET_NAME=`aws s3api list-buckets --query "reverse(sort_by(Buckets, &CreationDate))[:1] | [0].Name" | tr -d '"'`
pip install --upgrade pip
aws ec2 associate-iam-instance-profile --iam-instance-profile Name=STG309WorkshopInstanceProfile --region us-west-2 --instance-id $C9_EC2_ID
pip --disable-pip-version-check install -q boto3
pip --disable-pip-version-check install -q chalice
pip --disable-pip-version-check install -q opencv-python