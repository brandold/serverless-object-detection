#!/bin/sh

sudo yum -y install amazon-efs-utils
sudo yum install -y mesa-libGL
sudo yum install jq -y
sudo mkdir /mnt/efs
python3 -m venv stg319-workshop
source stg319-workshop/bin/activate
cd stg319-workshop
export AWS_DEFAULT_REGION='us-west-2'
export ROLE_ARN=$(aws cloudformation list-exports --query "Exports[?Name==\`RootRole\`].Value" --no-paginate --output text)
export C9_EC2_ID=`aws ec2 describe-instances --region us-west-2 --filters Name=tag-key,Values='aws:cloud9:environment' Name=instance-state-name,Values='running' --query "Reservations[*].Instances[*].InstanceId" --output text`
# Get file system id
export FILESYSTEM=$(aws cloudformation list-exports --query "Exports[?Name==\`FilesystemID\`].Value" --no-paginate --output text)
# Get access point
export ACCESS_POINT=$(aws cloudformation list-exports --query "Exports[?Name==\`AccessPointID\`].Value" --no-paginate --output text)
pip install --upgrade pip
aws ec2 associate-iam-instance-profile --iam-instance-profile Name=stg319WorkshopInstanceProfile --region us-west-2 --instance-id $C9_EC2_ID
pip --disable-pip-version-check install -q boto3
pip --disable-pip-version-check install -q chalice
pip --disable-pip-version-check install -q opencv-python

CONFIG=/home/ec2-user/.aws/config
touch $CONFIG
echo "[profile default]\nrole_arn = $ROLE_ARN\ncredential_source = Ec2InstanceMetadata\nregion = $AWS_DEFAULT_REGION" >> $CONFIG

# Mount access point
#sudo mount -t efs -o tls,accesspoint=$ACCESS_POINT $FILESYSTEM:/ /mnt/efs
# Create models folder
#sudo mkdir /mnt/efs/models