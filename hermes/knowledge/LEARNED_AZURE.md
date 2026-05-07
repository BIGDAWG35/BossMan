# Azure Developer Learning

## Overview
Microsoft Azure developer concepts, services, and best practices for building cloud applications.

---

## Core Azure Services

### Compute
- **Azure App Service** - Web apps, APIs
- **Azure Functions** - Serverless
- **Azure Kubernetes Service (AKS)** - Containers
- **Azure Virtual Machines** - IaaS

### Storage
- **Azure Blob Storage** - Object storage
- **Azure Files** - File shares
- **Azure Disk Storage** - Managed disks
- **Azure Data Lake** - Big data

### Data & Databases
- **Azure Cosmos DB** - NoSQL globally distributed
- **Azure SQL Database** - Managed SQL
- **Azure Database for PostgreSQL/MySQL**
- **Azure Table Storage** - NoSQL key-value

### Messaging & Eventing
- **Azure Service Bus** - Enterprise messaging
- **Azure Event Grid** - Event routing
- **Azure Event Hubs** - Big data streaming
- **Azure Queue Storage** - Simple queues

### API & Integration
- **Azure API Management** - API gateway
- **Azure Logic Apps** - Workflow automation
- **Azure Functions** - Serverless APIs

### Security
- **Azure Key Vault** - Secrets management
- **Azure Active Directory** - Identity
- **Managed Identities** - App authentication
- **Azure RBAC** - Role-based access

### DevOps
- **Azure DevOps** - CI/CD pipelines
- **Azure Pipelines** - Build & release
- **Azure Boards** - Project management
- **Azure Repos** - Git repos
- **Azure Artifacts** - Package management

### Monitoring
- **Azure Monitor** - Full stack observability
- **Application Insights** - APM
- **Log Analytics** - Log queries
- **Azure Advisor** - Best practices

---

## Study Approach (8 Weeks)

### Week 1-2: Core Concepts
- Azure portal & resource groups
- Subscriptions & billing
- ARM templates
- Basic services overview

### Week 3-4: Compute & Storage
- App Service, Functions
- Blob Storage, Cosmos DB
- Hands-on labs

### Week 5-6: Messaging & Security
- Service Bus, Event Grid
- Key Vault, Managed Identities

### Week 7-8: API, DevOps & Monitoring
- API Management
- CI/CD pipelines
- Application Insights

---

## Key Concepts

### ARM Templates
- Infrastructure as Code
- JSON-based
- Declarative

### Serverless
- Azure Functions
- Pay-per-use
- Event-driven

### Microservices
- Container orchestration (AKS)
- Service mesh
- Distributed tracing

### Observability
- Telemetry collection
- Metrics, logs, traces
- Application Insights

---

## Resources
- learn.microsoft.com/azure/developer
- learn.microsoft.com/azure/devops
- learn.microsoft.com/azure/azure-resource-manager
- learn.microsoft.com/azure-azure-monitor

---

## Additional Resources (Extended)

### Core Documentation
- Azure Developer Docs: learn.microsoft.com/azure/developer
- Azure Services Docs: learn.microsoft.com/azure
- Azure SDKs: learn.microsoft.com/azure/developer/sdk/overview
- REST API: learn.microsoft.com/en-us/rest/api/azure

### Certification (AZ-204)
- Azure Developer Associate: learn.microsoft.com/certifications/azure-developer
- Exam sandbox: learn.microsoft.com/certifications/bundle/azure-developer-sandbox

### Hands-On Labs
- Microsoft Learn: learn.microsoft.com/training/modules/
- Browse by topic: learn.microsoft.com/training/browse/

### Service Deep Dives
- App Service: learn.microsoft.com/azure/app-service/
- Functions: learn.microsoft.com/azure/azure-functions/
- Storage: learn.microsoft.com/azure/storage/
- Cosmos DB: learn.microsoft.com/azure/cosmos-db/
- Identity: learn.microsoft.com/azure/active-directory/
- Key Vault: learn.microsoft.com/azure/key-vault/
- Service Bus: learn.microsoft.com/azure/service-bus/
- Event Grid: learn.microsoft.com/azure/event-grid/
- Event Hubs: learn.microsoft.com/azure/event-hubs/

### SDKs & Samples
- By language: learn.microsoft.com/azure/developer/sdks/
- Samples: github.com/Azure

### Governance & Cost
- Pricing: learn.microsoft.com/azure/cost-management-billing/

---

## Hands-On Learning (Database & Data)

### SQL Database
- **Create**: Azure Portal → SQL databases → Create
- **Configure**: DTU/vCores, pricing tier
- **Scaling**: Scale up/down as needed
- **Backups**: Automatic daily backups
- **Queries**: Query Editor in portal
- **Connection**: Connection strings available

### Cosmos DB
- **Create**: Cosmos DB accounts → API selection (SQL, MongoDB, Cassandra)
- **Scaling**: Provisioned RU/s or serverless
- **Data ingestion**: Data Explorer in portal
- **Queries**: SQL-like queries or MongoDB queries
- **Global distribution**: Enable multiple regions

### Synapse Analytics
- **Create**: Synapse workspaces
- **Data pipelines**: Copy data activities
- **SQL pools**: Dedicated vs serverless
- **Spark pools**: Big data processing

---

## Hands-On Learning (Security, Monitoring, Governance)

### Security
- **Azure Security Center** → Security recommendations
- **Enable** → Security Center on subscription
- **View** → Security score and recommendations
- **Remediate** → Follow guidance

### Monitoring
- **Azure Monitor** → Metrics, logs, alerts
- **Log Analytics** → Write Kusto queries
- **Application Insights** → Add to apps for APM
- **Alerts** → Create alert rules

### Policy
- **Azure Policy** → Definitions and assignments
- **Built-in** → Use Microsoft policies
- **Custom** → Create your own
- **Compliance** → Check resource compliance

### Governance
- **Resource groups** → Group related resources
- **Tags** → Apply for billing/cost tracking
- **RBAC** → Role assignments
- **Azure Advisor** → Cost optimization tips

---

## Hands-On Learning (Cost Management)

### Budgets
- **Create**: Cost Management → Budgets
- **Set alerts**: % of budget threshold
- **Scope**: Subscription or resource group
- **Actions** → Email or webhook on alert

### Cost Analysis
- **Cost Management** → Cost analysis
- **Visualize** → Charts and graphs
- **Filter** → By resource, tag, service
- **Export** → Download CSV

### Tagging Strategy
- **Apply tags**: Environment (dev/prod), Department, Owner
- **Enforce**: Azure Policy for required tags
- **Report**: Filter costs by tags

---

## Useful Practices for Self-Learning

### Safe Practice
- Use **free tier** or sandbox subscription
- Create **resource groups** for practice labs
- **Delete** resources when done

### Build End-to-End Projects
1. Web app behind load balancer
2. Add managed database (SQL or Cosmos)
3. Set up monitoring (Application Insights)
4. Add authentication (Azure AD)
5. Configure cost alerts

### Local Notes (Markdown)
- Keep config steps
- Command snippets
- Common tasks playbook:
  - Create VM
  - Set up storage account
  - Secure resource group
  - Deploy web app

### Documentation Pairing
| Task | Docs |
|------|------|
| Databases | SQL Database, Cosmos DB, Synapse |
| Security | Security, Monitor, Policy |
| Cost | Cost Management, Advisor, Tags |

---

## Additional Hands-On Resources

### Official Microsoft Resources
- **Microsoft Learn**: learn.microsoft.com/azure/
  - Interactive tutorials and modules
  - Start with Azure fundamentals
  
- **Azure Architecture Center**: learn.microsoft.com/azure/architecture/
  - Reference architectures
  - Design patterns
  
- **Azure Service Docs**: learn.microsoft.com/azure/
  - Service-by-service documentation
  - Quickstarts
  
- **Azure Quickstart Templates**: github.com/Azure/azure-quickstart-templates
  - Ready-to-deploy ARM templates
  - Fork and customize

### Video Learning
- **Azure Friday**: channel9.msdn.com/Shows/Azure-Friday
  - Short demos from Azure engineers
  - Practical tips

### Hands-On Platforms
- **Microsoft Learn Labs**: learn.microsoft.com/training/
  - Interactive cloud labs
  
- **Pluralsight**: pluralsight.com/paths/azure
  - Code-and-config examples
  - Requires subscription
  
- **A Cloud Guru**: acloudguru.com/
  - Real-world scenarios
  - Sandbox environments
  
- **Udemy**: udemy.com/
  - Project-based courses
  - Look for highly-rated labs

---

## Hands-On Paths by Topic

### VMs, Networking, Scale Sets
- Create VMs, load balancers, VNets
- Network security groups
- VPN/ExpressRoute basics

### Identity & Access
- Azure AD setup
- Enterprise applications
- Conditional access, MFA
- RBAC configuration

### Storage
- Storage accounts
- Access tiers
- Lifecycle rules
- Data transfer tools

### App Platform
- App Service deployment
- Azure Functions
- CI/CD with GitHub Actions
- Application Insights

### Databases
- SQL Database setup
- Cosmos DB configuration
- Synapse Analytics
