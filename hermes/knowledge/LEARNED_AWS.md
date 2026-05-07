# AWS Certified Developer Learning

## Overview
AWS Certified Developer – Associate (DVA-C01)
- Developing/maintaining AWS applications
- Writing code that interacts with AWS
- Deploying, debugging, monitoring
- Exam: Multiple choice, ~130 minutes

---

## Core Topics

### Compute
- EC2
- Lambda
- Elastic Beanstalk
- ECS/EKS

### Networking
- VPC basics
- Subnets
- Security Groups
- IAM roles

### Storage
- S3
- EBS
- Glacier
- Object Lifecycle

### Databases
- RDS (MySQL/PostgreSQL)
- DynamoDB

### Messaging
- SQS
- SNS
- SES

### API & Integration
- API Gateway
- Lambda integration

### Serverless
- Lambda
- Step Functions

### Security
- IAM users, roles, policies
- Least privilege
- Security best practices

### Deployment
- CloudFormation
- CDK
- CodeCommit, CodeBuild, CodeDeploy, CodePipeline

### Monitoring
- CloudWatch
- CloudTrail
- X-Ray

---

## Study Plan (12-16 Weeks)

### Week 1-2
- Exam structure
- Core services
- IAM basics

### Week 3-4
- Serverless (Lambda, API Gateway)
- DynamoDB basics

### Week 5-6
- Compute (EC2, ECS/Fargate)
- Deployment fundamentals

### Week 7-8
- Storage, databases, messaging

### Week 9-10
- Security, best practices
- Cost optimization

### Week 11-12
- CI/CD pipelines
- IaC (CloudFormation/CDK)

### Week 13-14
- Practice exams
- Weak areas
- Labs

### Week 15-16
- Review
- Timed practice test

---

## Resources

### Official
- AWS Certification: aws.amazon.com/certification/certification-prep/developer-associate/
- Exam Guide PDF: d1.awsstatic.com/training-and-certification/docs-assessment-guide/AWS_Certified_Developer_Associate_Exam_Guide.pdf
- AWS Training: aws.training/
- AWS Docs: docs.aws.amazon.com
- AWS Whitepapers: aws.amazon.com/whitepapers/

### Learning Platforms
- A Cloud Guru: acloudguru.com
- Pluralsight
- Udemy
- AWS Skill Builder: skillbuilder.aws/
- Coursera

### Labs
- AWS Free Tier: aws.amazon.com/free/
- Qwiklabs: qwiklabs.com
- Katacoda

### Books
- AWS Certified Developer Official Study Guide
- AWS Cookbook (practical solutions)

---

## Exam Domains
1. Deployment
2. Security
3. Development with AWS Services
4. Refactoring
5. Monitoring & Troubleshooting

---

## Hands-On Learning (Database & Data)

### RDS (Relational Database Service)
- **Create**: RDS Console → Create database
- **Configure**: Engine, instance class, storage
- **Scaling**: Read replicas, Multi-AZ
- **Backups**: Automated daily backups
- **Queries**: Connect via SQL client (MySQL Workbench, pgAdmin)

### DynamoDB
- **Create**: DynamoDB → Create table
- **Keys**: Partition key, sort key
- **Scaling**: Provisioned vs On-Demand
- **Data**: Item editor in console
- **Queries**: Scan vs Query operations

### Redshift
- **Create**: Redshift → Create cluster
- **Nodes**: Dense compute vs storage
- **Queries**: Query Editor in console
- **Data import**: S3, Database migration

---

## Hands-On Learning (Security, Monitoring, Governance)

### Security
- **IAM**: Users, groups, roles, policies
- **GuardDuty**: Enable threat detection
- **Security Hub**: Central security view
- **KMS**: Encryption keys
- **Secrets Manager**: Rotate credentials

### Monitoring
- **CloudWatch**: Metrics, alarms, dashboards
- **CloudWatch Logs**: Log groups, insights
- **X-Ray**: Trace requests
- **CloudTrail**: API call history

### Governance
- **Organizations**: Multi-account setup
- **Control Tower**: Landing zone
- **Config**: Resource compliance
- **Tags**: Tagging strategy

---

## Hands-On Learning (Cost Management)

### Budgets
- **Create**: AWS Budgets → Create budget
- **Alerts**: Threshold alerts
- **Actions**: Stop/terminate resources

### Cost Analysis
- **Cost Explorer**: Visualize costs
- **Curated views**: Common queries
- **S3**: Cost allocation reports

### Cost Optimization
- **Savings Plans**: Compute savings
- **Reserved Instances**: Database, EC2
- **Spot Instances**: Fault-tolerant workloads

---

## Useful Practices for Self-Learning

### Safe Practice
- Use **AWS Free Tier** for practice
- Create **IAM users** (not root)
- Enable **CloudTrail** for visibility
- Set **budget alerts** before starting

### Build End-to-End Projects
1. Deploy web app on EC2 or Lambda
2. Add RDS or DynamoDB database
3. Set up S3 for static assets
4. Configure API Gateway
5. Add CloudWatch monitoring

### Local Notes (Markdown)
- Keep config steps
- Command snippets (AWS CLI)
- Common tasks playbook:
  - Launch EC2 instance
  - Deploy Lambda function
  - Set up S3 bucket
  - Configure CloudFront CDN

### Documentation Pairing
| Task | Docs |
|------|------|
| Databases | RDS, DynamoDB, Redshift |
| Security | IAM, GuardDuty, KMS |
| Monitoring | CloudWatch, X-Ray, CloudTrail |
| Cost | Cost Explorer, Budgets, Savings Plans |

---

## AWS Hands-On Resources

### Official
- **AWS Free Tier**: aws.amazon.com/free/
- **AWS Skill Builder**: skillbuilder.aws/
- **AWS Well-Architected Labs**: wellarchitectedlabs.com

### Interactive Labs
- **Qwiklabs**: qwiklabs.com
- **Katacoda**: katacoda.com/learn?platform=aws
- **AWS Cloud Quest**: gamified learning

### Video Learning
- **AWS re:Invent**: youtube.com/@AmazonWebServices
- **AWS Tech Talks**: aws.amazon.com/events/online-tech-talks/

### Books
- **AWS Cookbook** - Practical solutions
- **Infrastructure as Code** - Python, Terraform

---

## AWS CLI Quick Reference

```bash
# EC2
aws ec2 describe-instances
aws ec2 run-instances --image-id ami-xxx --instance-type t2.micro

# S3
aws s3 ls
aws s3 cp file.txt s3://bucket/

# Lambda
aws lambda list-functions
aws lambda invoke --function-name myFunc response.json

# IAM
aws iam list-users
aws iam create-role --role-name myRole

# CloudWatch
aws logs describe-log-groups
aws cloudwatch get-metric-statistics
```
