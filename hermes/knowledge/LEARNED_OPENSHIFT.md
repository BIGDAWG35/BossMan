# OpenShift & Kubernetes Learning

## Overview
OpenShift Container Platform vs upstream Kubernetes - container orchestration, deployment, and management.

---

## OpenShift vs Kubernetes

| Aspect | OpenShift | Kubernetes (kubeadm, kind, k3s) |
|--------|-----------|--------------------------------|
| **Vendor** | Red Hat | CNCF |
| **Management** | Managed platform | Self-managed |
| **UI** | Built-in web console | Optional (Dashboard) |
| **Security** | Security Context Constraints (SCC) | Pod Security Policies |
| **CI/CD** | OpenShift Pipelines/Tekton | Argo CD, Jenkins |
| **Registry** | Integrated container registry | Manual setup |

---

## Clusters & Installation

### Kubernetes Distributions
- **kubeadm** - Production clusters
- **kind** - Local testing (Kubernetes in Docker)
- **k3s** - Lightweight, IoT/Edge
- **minikube** - Local development

### OpenShift Variants
- **OpenShift Container Platform** - Enterprise (paid)
- **OKD** - Open source upstream
- **OpenShift Online** - Managed SaaS
- **CodeReady Containers** - Local development

### Node Management
- **Node labeling** - Organize nodes by role/region
- **Taints/Tolerations** - Restrict pod placement
- **RBAC** - Role-based access control
- **Cluster bootstrap** - Initial cluster setup

---

## Networking

### Service Types
| Type | Description |
|------|-------------|
| **ClusterIP** | Internal cluster communication |
| **NodePort** | Expose on each node's IP |
| **LoadBalancer** | External load balancer (cloud) |
| **ExternalName** | DNS alias |

### Ingress
- **nginx Ingress Controller** - Popular ingress
- **OpenShift Routes** - OpenShift-specific
- **Network policies** - Pod-to-pod traffic control
- **Egress controls** - Outbound traffic rules

---

## Storage

### Concepts
- **PersistentVolume (PV)** - Cluster-wide storage
- **PersistentVolumeClaim (PVC)** - Pod storage request
- **StorageClass** - Dynamic provisioning

### Storage Options
- **EmptyDir** - Ephemeral temporary storage
- **HostPath** - Node filesystem
- **Network storage** - NFS, iSCSI, Ceph
- **Cloud storage** - Azure Disk, AWS EBS, GCE PD

### Dynamic Provisioning
- **StorageClasses** - Define provisioners
- **CSI drivers** - Container Storage Interface

---

## Security

### Kubernetes Security
- **Service accounts** - Pod identity
- **RBAC bindings** - ClusterRole, Role, ClusterRoleBinding, RoleBinding
- **Pod Security Policies** - Pod security standards

### OpenShift Security
- **Security Context Constraints (SCC)** - OpenShift-specific
- **Privileged pods** - Requires SCC
- **Non-root containers** - Built-in support

### Secrets Management
| Method | Use |
|--------|-----|
| **Environment variables** | Simple secrets |
| **Secret volumes** | Mounted as files |
| **External secrets** | HashiCorp Vault, AWS Secrets Manager |
| **Sealed Secrets** | Encrypt for GitOps |

---

## Observability

### Monitoring
- **Prometheus** - Metrics collection
- **Grafana** - Visualization
- **Alertmanager** - Alert routing

### Logging
- **ELK Stack** - Elasticsearch, Logstash, Kibana
- **EFK** - Elasticsearch, Fluentd, Kibana
- ** Loki** - Grafana's logging solution

### Tracing
- **Jaeger** - Distributed tracing
- **Zipkin** - Alternative tracer

### Health Checks
- **Liveness probes** - Is container running?
- **Readiness probes** - Can serve traffic?
- **Startup probes** - Startup completion

---

## Application Deployment

### Kubernetes Objects
| Object | Use |
|--------|-----|
| **Pod** | Smallest deployable unit |
| **Deployment** | Stateless app management |
| **StatefulSet** | Stateful app management |
| **DaemonSet** | One pod per node |
| **Job/CronJob** | Batch processing |

### Operators & Helm
- **Operators** - Custom controllers for complex apps
- **Helm** - Package manager (charts)
- **Kustomize** - Kubernetes-native configuration

### OpenShift Specific
- **DeploymentConfig** - OpenShift deployment
- **BuildConfig** - Source-to-image builds
- **ImageStream** - Container image management

---

## CI/CD & GitOps

### Kubernetes CI/CD
- **Jenkins** - Classic CI/CD
- **Argo CD** - GitOps declarative
- **Tekton** - Kubernetes-native CI/CD
- **GitHub Actions** - Cloud CI/CD

### OpenShift CI/CD
- **OpenShift Pipelines** - Tekton-based
- **Source-to-Image (S2I)** - Build from source
- **Buildah** - Container builds

### GitOps Workflow
1. Store configs in Git
2. Argo CD syncs cluster with Git
3. Auto-deploy on Git changes

---

## Quick-Start Checklist

### Week 1: Kubernetes Basics
- [ ] Pods, Deployments, Services
- [ ] kubectl commands
- [ ] Kubernetes official docs

### Week 2: OpenShift Basics
- [ ] OKD/CRC installation
- [ ] Web console
- [ ] OpenShift routes

### Week 3: Build & Deploy
- [ ] Build Docker image
- [ ] Deploy app with database
- [ ] Compare OpenShift vs Kubernetes

### Week 4: CI/CD & Advanced
- [ ] Set up Tekton/Argo CD
- [ ] Networking policies
- [ ] Storage classes
- [ ] RBAC

---

## Resources

### Official Docs
- Kubernetes: kubernetes.io/docs/
- OpenShift: docs.openshift.com/
- kubectl: kubernetes.io/docs/reference/kubectl/

### Hands-On
- Kubernetes by Example: kubernetesbyexample.com
- Play with Kubernetes: play-with-k8s.com
- OpenShift DO101: learn.openshift.com

### Books
- Look for 2024+ editions
- "Kubernetes in Action" (Manning)
- "OpenShift in Action" (Manning)

---

## Commands Quick Reference

```bash
# kubectl basics
kubectl get pods
kubectl get services
kubectl apply -f deployment.yaml
kubectl exec -it <pod> -- /bin/bash
kubectl logs <pod>
kubectl describe pod <pod>

# OpenShift
oc get pods
oc new-app <image>
oc expose svc <service>
oc policy add-role-to-user view <user>
```

---

## Additional Resources

### Official Red Hat Resources
- **Red Hat Developer Portal**: developers.redhat.com/
  - Tutorials, quickstarts, hands-on labs
  - Start with "Get started with OpenShift"
  
- **OpenShift Documentation**: docs.openshift.com/container-platform/latest/
  - Installation, admin, networking, storage, security
  - Search by feature

- **OpenShift YouTube**: youtube.com/user/openshift
  - Walkthroughs, how-tos from Red Hat engineers

- **OpenShift Hands-On Labs**: youtube.com/playlist?list=PLW8d7FoZQK2K8aZ2o6x3nqZl9K3H0wG2Y
  - Step-by-step lab videos

### Community & Docs
- **Kubernetes Docs**: kubernetes.io/docs/
  - Core concepts, API reference, tutorials

- **Kubernetes By Example**: kubernetesbyexample.com
  - Task-driven YAML examples

- **CNCF**: cncf.io/
  - Cloud-native education, whitepapers

### Hands-On Labs
- **Katacoda**: katacoda.com/
  - Browser-based Kubernetes labs

- **Play with Kubernetes**: labs.play-with-k8s.com
  - Temporary clusters for practice

### Local OpenShift
- **CodeReady Containers**: developers.redhat.com/products/codeready-containers/
  - Local OpenShift on laptop

- **MiniShift**: github.com/minishift/minishift
  - Lightweight OpenShift emulator

### Books
- **Kubernetes Up & Running** - Kelsey Hightower, Brendan Burns, Joe Beda
- **Production-Ready Kubernetes** - Advanced topics

---

## Hands-On: Multi-Service App

### Architecture Example
```
Internet → Ingress → Service → Pod (Frontend)
                              → Pod (Backend)
                              → Database (PVC)
```

### Deployments (Multi-Container)
```yaml
# frontend-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: frontend
spec:
  replicas: 3
  selector:
    matchLabels:
      app: frontend
  template:
    metadata:
      labels:
        app: frontend
    spec:
      containers:
      - name: nginx
        image: nginx:1.21
        ports:
        - containerPort: 80
```

### Services
```yaml
apiVersion: v1
kind: Service
metadata:
  name: frontend-svc
spec:
  type: ClusterIP
  selector:
    app: frontend
  ports:
  - port: 80
    targetPort: 80
```

### Ingress with TLS
```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: myapp-ingress
spec:
  tls:
  - hosts:
    - myapp.example.com
    secretName: myapp-tls
  rules:
  - host: myapp.example.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: frontend-svc
            port:
              number: 80
```

---

## Hands-On: ConfigMaps & Secrets

### ConfigMap
```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
data:
  DATABASE_HOST: "postgres.default.svc.cluster.local"
  LOG_LEVEL: "info"
```

### Secret
```yaml
apiVersion: v1
kind: Secret
metadata:
  name: db-credentials
type: Opaque
stringData:
  username: admin
  password: changeme
```

### Use in Pod
```yaml
env:
- name: DB_HOST
  valueFrom:
    configMapKeyRef:
      name: app-config
      key: DATABASE_HOST
- name: DB_PASS
  valueFrom:
    secretKeyRef:
      name: db-credentials
      key: password
```

---

## Hands-On: Stateful Storage

### PVC
```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: mysql-pvc
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 10Gi
```

### StatefulSet
```yaml
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: mysql
spec:
  serviceName: mysql
  replicas: 1
  template:
    spec:
      containers:
      - name: mysql
        image: mysql:8
        volumeMounts:
        - name: data
          mountPath: /var/lib/mysql
  volumeClaimTemplates:
  - metadata:
      name: data
    spec:
      accessModes: ["ReadWriteOnce"]
      resources:
        requests:
          storage: 10Gi
```

---

## Hands-On: RBAC

### ServiceAccount
```yaml v1
kind: ServiceAccount

apiVersion:metadata:
  name: myapp-sa
```

### Role + RoleBinding
```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  name: myapp-role
rules:
- apiGroups: [""]
  resources: ["pods", "services"]
  verbs: ["get", "list", "watch"]
---
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: myapp-rolebinding
subjects:
- kind: ServiceAccount
  name: myapp-sa
roleRef:
  kind: Role
  name: myapp-role
```

---

## Hands-On: CI/CD with GitOps

### GitOps Flow
```
Git → CI (GitHub Actions) → CD (Argo CD) → Cluster
```

### Argo CD Application
```yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: myapp
spec:
  project: default
  source:
    repoURL: https://github.com/myuser/myapp.git
    targetRevision: main
    path: k8s/prod
  destination:
    server: https://kubernetes.default.svc
    namespace: myapp
  syncPolicy:
    automated:
      prune: true
      selfHeal: true
```

---

## Community Resources

### Kubernetes
- Community: kubernetes.io/community/
- SIGs: kubernetes.io/sig/
- Slack: kubernetes.slack.com

### OpenShift
- OKD: okd.io
- OpenShift Commons: events.openshift.com/commons

### Forums
- Stack Overflow: kubernetes, openshift
- Reddit: r/kubernetes, r/openshift

---

## CKAD - Practical Resources (No Exam Prep)

### Core Docs
- **Kubernetes Docs**: kubernetes.io/docs/
- **Tutorials**: kubernetes.io/docs/tutorials/
- **Concepts**: kubernetes.io/docs/concepts/
- **API Reference**: kubernetes.io/docs/reference/

### Client Tools
- **kubectl Cheat Sheet**: kubernetes.io/docs/reference/kubectl/overview/
- **Kustomize**: kubectl.docs.kubernetes.io/references/kustomize/kustomization/
- **Helm**: helm.sh/docs/

### Configuration
- **ConfigMaps**: kubernetes.io/docs/concepts/configuration/configmap/
- **Secrets**: kubernetes.io/docs/concepts/configuration/secret/

### Networking
- **Services**: kubernetes.io/docs/concepts/services-networking/service/
- **Ingress**: kubernetes.io/docs/concepts/services-networking/ingress/
- **NGINX Ingress**: docs.nginx.com/nginx-ingress-controller/

### Storage
- **Persistent Volumes**: kubernetes.io/docs/concepts/storage/persistent-volumes/
- **Storage Classes**: kubernetes.io/docs/concepts/storage/storage-classes/
- **CSI Drivers**: kubernetes-csi.github.io/docs/

### Security
- **RBAC**: kubernetes.io/docs/reference/access-authn-authz/rbac/
- **Security Best Practices**: kubernetes.io/docs/concepts/security/

### Troubleshooting
- **Debug Pods**: kubernetes.io/docs/tasks/debug-application/debug-application/
- **Debug Cluster**: kubernetes.io/docs/tasks/debug-application-cluster/debug-cluster/

---

## Local Clusters for Practice

### kind (Kubernetes IN Docker)
- **Docs**: kind.sigs.k8s.io/
- Run Kubernetes in Docker containers
- Great for CI/CD testing

### Minikube
- **Docs**: minikube.sigs.k8s.io/docs/
- Single-node Kubernetes on laptop
- Full Kubernetes experience

### k3d
- **Docs**: k3d.dev/
- Lightweight Kubernetes using K3s
- Fast cluster creation

---

## Practical Project Ideas

### 1. Web App + Database
- Deploy Nginx frontend
- Deploy API backend
- Connect to MySQL/PostgreSQL
- Use ConfigMaps for config
- Use Secrets for credentials

### 2. Microservices
- Multiple services with Ingress
- Service-to-service communication
- Health checks
- Resource limits

### 3. GitOps Pipeline
- GitHub Actions for CI
- ArgoCD for CD
- Kustomize for envs

### 4. Monitoring Stack
- Prometheus + Grafana
- ELK/EFK logging
- Alertmanager

### 5. Security Hardening
- RBAC policies
- Network policies
- Pod security policies
- Secrets management

---

## CKA - Practical Admin Resources

### Official Docs
- **Kubernetes Docs**: kubernetes.io/docs/
- **Kubernetes Blog**: kubernetes.io/blog/
- **CNCF**: cncf.io/

### Training & Labs
- **Linux Foundation CKA**: training.linuxfoundation.org/
- **CNCF Training Partners**: cncf.io/education/

### Hands-On Platforms
- **Katacoda**: katacoda.com/
- **Minikube**: minikube.sigs.k8s.io/
- **kind**: kind.sigs.k8s.io/
- **Kubernetes The Hard Way**: github.com/kelseyhightower/kubernetes-the-hard-way

### Video Channels
- **Kubernetes YouTube**: youtube.com/c/Kubernetes
- **CNCF YouTube**: youtube.com/c/CNCF

### Books
- **Kubernetes: Up and Running** - O'Reilly
- **Kubernetes in Action** - Manning

### Admin Topics
- **Networking**: kubernetes.io/docs/concepts/services-networking/
- **Security/RBAC**: kubernetes.io/docs/reference/access-authn-authz/rbac/
- **Storage**: kubernetes.io/docs/concepts/storage/

---

## Kubernetes Security - Practical Hands-On

### Container Security Scanning
- **Trivy**: aquasecurity.github.io/trivy/
- **Anchore**: github.com/anchore/anchore-engine
- **Clair**: kunrise.github.io/clair/

### Image Signing
- **Sigstore / Cosign**: docs.sigstore.dev/cosign/
- Sign and verify container images
- Integrate into CI/CD

### Secrets Management
- **Sealed Secrets**: github.com/bitnami-labs/sealed-secrets
- **External Secrets**: github.com/external-secrets/external-secrets
- **HashiCorp Vault**: vaultproject.io

---

## Security Hands-On Path

### Step 1: Cluster Setup
- Use Minikube, kind, or cloud cluster
- Enable API server security flags
- Enable etcd encryption at rest

### Step 2: Admission Control
- **OPA Gatekeeper**: open-policy-agent.github.io/gatekeeper/
- **Kyverno**: kyverno.io/
- Deploy policies:
  - Disallow privileged containers
  - Require read-only root filesystem

### Step 3: Pod Security Standards
- Use Restricted or Baseline
- Configure SecurityContext

### Step 4: Network Policies
- Limit pod-to-pod traffic
- Segment namespaces
- Control egress/ingress

### Step 5: Image Security
- Add Trivy to CI/CD
- Scan for vulnerabilities
- Sign images with Cosign

### Step 6: Monitoring
- Enable Audit Logs
- **Falco**: falco.org/ (runtime security)
- Prometheus + Alertmanager

### Step 7: Documentation
- Keep security playbook
- Document manifests
- Document rollback procedures

---

## Additional Security Resources

### Core Docs
- **Security Overview**: kubernetes.io/docs/concepts/security/
- **Hardening Guide**: kubernetes.io/docs/setup/production-environment/hardening/
- **API Reference**: kubernetes.io/docs/reference/

### Cloud Security Guides
- **GKE Best Practices**: cloud.google.com/kubernetes-engine/docs/concepts/security
- **EKS Best Practices**: docs.aws.amazon.com/eks/latest/userguide/security.html
- **AKS Security**: learn.microsoft.com/en-us/azure/aks/concepts-security

### Policy as Code
- **OPA Gatekeeper**: open-policy-agent.org/docs/latest/kubernetes/
- **Kyverno**: kyverno.io/docs/

### Observability
- **Audit Logs**: kubernetes.io/docs/tasks/debug-application-agent/audit/
- **Falco**: falco.org/docs/
- **Kube-bench**: github.com/aquasecurity/kube-bench

### More Security Tools
- **CIS Benchmarks**: Center for Internet Security Kubernetes benchmarks
- **Prometheus + Grafana**: Security metrics and alerting

---

## Additional Cloud Security Standards (NEW)

### ISO/IEC 27017
- Cloud-specific security controls
- Guidance for implementing 27001 in cloud
- Reference: iso.org/standard/43757.html

### ISO/IEC 27018
- Protection of PII in public clouds
- Privacy guidelines for cloud providers
- Reference: iso.org/standard/61498.html
