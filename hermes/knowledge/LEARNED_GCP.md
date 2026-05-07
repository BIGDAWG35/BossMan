# Google Cloud Platform (GCP) Developer Learning

## Overview
Google Cloud Platform developer skills for building, deploying, and managing applications on GCP.

---

## Core Services

### Compute
- **Compute Engine** - VMs
- **Cloud Run** - Serverless containers
- **App Engine** - PaaS
- **Google Kubernetes Engine (GKE)** - Managed Kubernetes

### Storage
- **Cloud Storage** - Object storage
- **Filestore** - Managed NFS

### Databases
- **Cloud SQL** - MySQL, PostgreSQL, SQL Server
- **Firestore** - NoSQL
- **Cloud Spanner** - Globally distributed SQL
- **Bigtable** - NoSQL wide-column
- **Memorystore** - Redis/Memcached

### Networking
- **VPC** - Virtual Private Cloud
- **Cloud Load Balancing**
- **Cloud CDN**
- **Cloud NAT**

### Serverless
- **Cloud Functions**
- **Cloud Run**
- **App Engine**

### DevOps
- **Cloud Build** - CI/CD
- **Artifact Registry** - Container registry
- **Deployment Manager** - IaC

### Observability
- **Cloud Monitoring**
- **Cloud Logging**
- **Cloud Trace**
- **Cloud Profiler**

---

## Study Plan (Organized by Topic)

### Step 1: Core Services & Projects
- GCP console
- Projects and resource hierarchy
- Billing

### Step 2: Serverless & Compute
- Cloud Functions
- Cloud Run
- App Engine basics

### Step 3: Storage & Databases
- Cloud Storage buckets
- IAM permissions
- Object lifecycle
- Cloud SQL
- Firestore

### Step 4: Kubernetes & Containers (GKE)
- Clusters
- Node pools
- Deployments
- Services
- Ingress
- RBAC
- Horizontal pod autoscaling
- Network policies

### Step 5: Security & IAM
- IAM roles
- Service accounts
- Least privilege
- VPC Service Controls

### Step 6: Automation & IaC
- Terraform (Google provider)
- Deployment Manager

### Step 7: Observability
- Cloud Monitoring
- Cloud Logging
- Alerting
- Cloud Trace

---

## Quick-Start Checklist

- [ ] Pick concrete goal (e.g., "host 2-tier web app on GKE with Cloud SQL")
- [ ] Follow official docs quickstarts
- [ ] Do hands-on labs (Qwiklabs, Coursera, ACG)
- [ ] Explore sample configs on GitHub
- [ ] Document configurations in personal wiki

---

## Resources

### Official Docs
- Cloud Storage: storage.cloud.google.com/docs
- SQL: cloud.google.com/sql/docs
- Firestore: firebase.google.com/docs/firestore
- GKE: cloud.google.com/kubernetes-engine/docs
- Cloud Run: cloud.google.com/run/docs
- Cloud Functions: cloud.google.com/functions/docs

### Learning Platforms
- Qwiklabs
- A Cloud Guru
- Coursera

### Tools
- Terraform: registry.terraform.io/providers/hashicorp/google

---

## Additional Resources (Extended)

### Official Documentation
- Google Cloud Docs: cloud.google.com/docs
- Tutorials: cloud.google.com/docs/tutorials
- Community Tutorials: cloud.google.com/community/tutorials

### Hands-On Labs
- Qwiklabs: qwiklabs.com
- Coursera GCP: coursera.org/googlecloud
- Pluralsight GCP: pluralsight.com/paths/google-cloud-platform
- A Cloud Guru: acloudguru.com

### Sample Configs
- GitHub: Search "google cloud terraform examples"
- Terraform: registry.terraform.io/providers/hashicorp/google

### Kubernetes
- Official docs: kubernetes.io/docs

---

## Hands-On Learning (Database & Data)

### Cloud SQL
- **Create**: Cloud SQL → Create instance
- **Configure**: Machine type, storage, backups
- **Scaling**: High availability, read replicas
- **Connect**: Connect via SQL client

### Firestore
- **Create**: Firestore → Create database
- **Mode**: Native or Datastore mode
- **Collections**: Document-based
- **Queries**: Simple to complex

### Cloud Spanner
- **Create**: Spanner → Create instance
- **Nodes**: Processing units
- **Scaling**: Horizontal scaling

### BigQuery (Analytics)
- **Create**: BigQuery → Create dataset
- **Load**: Load from GCS, streaming
- **Query**: SQL editor
- **Visualize**: Looker Studio

---

## Hands-On Learning (Security, Monitoring, Governance)

### Security
- **IAM**: Roles, bindings, service accounts
- **Security Command Center**: Threat detection
- **KMS**: Key management
- **Secret Manager**: Credentials

### Monitoring
- **Cloud Monitoring**: Metrics, uptime checks
- **Cloud Logging**: Log explorer
- **Cloud Trace**: Distributed tracing
- **Cloud Profiler**: Performance profiling

### Governance
- **Organization**: Hierarchy
- **Folders**: Department grouping
- **Resource Manager**: Tagging
- **Config**: Policy controller

---

## Hands-On Learning (Cost Management)

### Budgets
- **Create**: Billing → Budgets & alerts
- **Alerts**: % threshold triggers
- **Scopes**: Project or folder

### Cost Analysis
- **Billing Export**: BigQuery or Cloud Storage
- **Cost Table**: SQL queries
- **Reports**: Billing reports

### Cost Optimization
- **Committed Use Discounts**: CPU/memory
- **Preemptible VMs**: Discounted VMs
- **Custom Machine Types**: Right-size

---

## Useful Practices for Self-Learning

### Safe Practice
- Use **Google Cloud Free Tier**
- Create **service accounts** (not user access)
- Enable **billing alerts**
- Use **projects** to isolate

### Build End-to-End Projects
1. Deploy to Cloud Run or App Engine
2. Add Cloud SQL database
3. Set up Cloud Storage
4. Configure Cloud CDN
5. Add Cloud Monitoring

### Local Notes (Markdown)
- Keep config steps
- Command snippets (gcloud CLI)
- Common tasks playbook:
  - Create VM instance
  - Deploy Cloud Function
  - Set up GKE cluster
  - Configure load balancer

### Documentation Pairing
| Task | Docs |
|------|------|
| Databases | Cloud SQL, Firestore, Spanner |
| Security | IAM, KMS, Secret Manager |
| Monitoring | Cloud Monitoring, Logging |
| Cost | Billing, Budgets, Committed Use |

---

## GCP Hands-On Resources

### Official
- **Google Cloud Free Tier**: cloud.google.com/free/
- **Google Cloud Skills Boost**: cloudskillsboost.google/
- **Qwiklabs**: qwiklabs.com
- **Codelabs**: codelabs.developers.google.com/

### Interactive Labs
- **Google Cloud Skills Boost**: gamified quests
- **Qwiklabs**: Hands-on labs
- **Coursera**: GCP certification courses

### Video Learning
- **Google Cloud YouTube**: youtube.com/@GoogleCloudTech
- **Google Cloud Events**: cloud.google.com/events

### Books
- **Google Cloud Platform Cookbook**
- **Terraform Up & Running** (GCP examples)

---

## gcloud CLI Quick Reference

```bash
# Compute Engine
gcloud compute instances list
gcloud compute instances create instance-1 --zone=us-central1-a

# Cloud Storage
gsutil ls
gsutil cp file.txt gs://bucket/

# Cloud Functions
gcloud functions deploy myFunction --runtime nodejs18 --trigger-http

# GKE
gcloud container clusters create my-cluster
gcloud container clusters get-credentials my-cluster

# IAM
gcloud projects get-iam-policy $PROJECT
gcloud add-iam-policy-binding --member=user:email --role=roles/viewer

# Deployment Manager
gcloud deployment-manager deployments create my-deployment --config config.yaml
```

---

## Hands-On Learning Path (Extended)

### Step 1: Core Concepts & Tooling
- Read: Getting started guides
- Lab: Create VM, assign roles, configure firewall

### Step 2: Compute & Networking
- Learn: VMs, VPCs, subnets, firewall, routes, NAT
- Lab: Two-tier app (front-end GKE/Compute, back-end Cloud Run/Compute)
- Resources: Compute docs, VPC docs
