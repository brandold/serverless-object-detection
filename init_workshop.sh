#!/bin/sh

sudo yum -y install amazon-efs-utils
sudo yum install -y mesa-libGL
sudo yum install jq -y
sudo mkdir /mnt/efs
python3 -m venv stg309-workshop
source stg309-workshop/bin/activate
cd stg309-workshop
export AWS_DEFAULT_REGION='us-west-2'
export C9_EC2_ID=`aws ec2 describe-instances --region us-west-2 --filters Name=tag-key,Values='aws:cloud9:environment' Name=instance-state-name,Values='running' --query "Reservations[*].Instances[*].InstanceId" --output text`
# Get file system id
export FILESYSTEM=$(aws cloudformation list-exports --query "Exports[?Name==\`FilesystemID\`].Value" --no-paginate --output text)
# Get access point
export ACCESS_POINT=$(aws cloudformation list-exports --query "Exports[?Name==\`AccessPointID\`].Value" --no-paginate --output text)
export WEIGHTS='https://s3.amazonaws.com/ee-assets-prod-us-east-1/modules/38c8887218564adebacdda266134918f/v1/yolo-big.weights'
pip install --upgrade pip
aws ec2 associate-iam-instance-profile --iam-instance-profile Name=STG309WorkshopInstanceProfile --region us-west-2 --instance-id $C9_EC2_ID
pip --disable-pip-version-check install -q boto3
pip --disable-pip-version-check install -q chalice
pip --disable-pip-version-check install -q opencv-python

# Mount access point
#sudo mount -t efs -o tls,accesspoint=$ACCESS_POINT $FILESYSTEM:/ /mnt/efs
# Create models folder
#sudo mkdir /mnt/efs/models