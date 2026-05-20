# MedFlow: Advanced OPD & Clinic Management System

MedFlow is a comprehensive, enterprise-grade clinical information platform designed to digitize and automate Outpatient Department (OPD) workflows and specialty clinic operations. By replacing manual, paper-based tracking, MedFlow provides role-based workspaces for Admins, Doctors, Nurses, Receptionists, and Pharmacists, complete with intelligent decision support and real-time patient queue dynamics.

---

## 🚀 Key Features

*   **Admin Dashboard & Master Configuration**: Central control panel for clinic parameters, user roles (RBAC), custom templates, expense logs, and business analytics.
*   **Doctor Panel (7-Tab EMR Consultation)**: Dynamic workspace guiding clinical flow through Complaints, Investigations, Prescription signatures, Procedures, Media history, Diagnosis, and Printing.
*   **Reception Counter**: Streamlined interface for three-step patient registration, smart queue token allocation, Razorpay payments, and lab upload support.
*   **Nursing Portal**: Specialized dashboard for patient vitals, active follow-up lists, and lab record tracking.
*   **Pharmacy & Dispensing Inventory**: Stock management, low-stock threshold alerting, and prescription validation.
*   **Live Patient Display Screen**: Real-time waiting area display showing current and next tokens in queue.

---

## 🛠️ Technology Stack

MedFlow is designed with a modern, high-performance, and scalable technology stack:

*   **Frontend (Next.js Single Page Application)**
    *   **Framework**: Next.js 16.2.6 (App Router)
    *   **UI & Core**: React 19.2.4, Tailwind CSS v4, Framer Motion
    *   **State Management**: Zustand 5.0.13
    *   **Data Vis**: Recharts
*   **Backend (NestJS API)**
    *   **Framework**: NestJS (TypeScript Node.js API)
    *   **ORM**: Prisma ORM
    *   **Database**: PostgreSQL (Active replication and clustering support)
*   **Integrations & Infrastructure**
    *   **Payments**: Razorpay Gateway (UPI, Netbanking, Cards)
    *   **Caching**: Redis (High-availability HA)
    *   **Websockets**: Real-time queue sync and notification signals
    *   **Reverse Proxy**: NGINX Gateway
    *   **Containers**: Docker Compose / Kubernetes (K8s Ready)

---

## 📁 Repository Directory Structure

```txt
opd-system/
├── backend/                   # NestJS Backend API & Prisma DB schemas
│   ├── prisma/                # Database migrations and Prisma schema
│   ├── src/                   # NestJS modules, services, and controllers
│   └── test/                  # End-to-end integration tests
├── frontend/                  # Next.js App Router SPA frontend
│   ├── app/                   # Dynamic pages, layouts, and route definitions
│   ├── components/            # Reusable UI component libraries & panels
│   ├── store/                 # Global Zustand state stores (Branding, Auth)
│   └── public/                # Public SVG/PNG graphics & PWA Service Worker
├── docs/                      # Categorized Systems Documentation
│   ├── guides/                # Installation, deployments, runbooks, and scaling
│   ├── architecture/          # Architecture blueprints, flows, and AI safety
│   ├── audits/                # Performance, database, and security audits
│   ├── receptionist/          # Receptionist-specific panels, GAP audits, maps
│   ├── developer/             # API webhooks, authentication, and rate-limits
│   └── archive/               # Historical completion records and matrices
├── scripts/                   # Utility administration scripts
│   └── scaffolds/             # Relocated PowerShell code scaffolding scripts
├── k8s/                       # Kubernetes manifests for container orchestration
├── nginx/                     # Gateway configuration files
└── observability/             # Prometheus, Grafana, and system tracing setups
```

---

## 📚 Categorized Systems Documentation

All detailed project documents have been logically grouped within the [**`/docs`**](./docs) directory:

### 📖 1. Operational & Deployment Guides
*   [Installation Guide](./docs/guides/installation.md) – Step-by-step developer setup and system initialization guidelines.
*   [Production Deployment](./docs/guides/deployment.md) – Production environment server setup, SSL, and system environment maps.
*   [Disaster Recovery Plan](./docs/guides/disaster-recovery.md) – Standard backup restoration, database redundancy, and recovery procedures.
*   [System Runbook](./docs/guides/runbook.md) – Day-to-day administration commands, service control, and operations support.
*   [Scaling Guide](./docs/guides/scaling.md) – Performance tuning, scaling parameters, and database sharding patterns.

### 📐 2. System Architecture & Policies
*   [Technology Stack](./docs/architecture/tech-stack.md) – Deep dive into Next.js/NestJS decisions and external sync APIs.
*   [System Workflows Master](./docs/architecture/system-workflows.md) – End-to-end trace of appointments, billing, prescriptions, and queue states.
*   [Clinical AI Safety](./docs/architecture/clinical-ai-safety.md) – Clinical guidelines, validation checks, and safety rules.
*   [AI Usage Policy](./docs/architecture/ai-usage-policy.md) – Governance and ethical guidelines for generative features in EMR.
*   [Project Rules](./docs/project-rules.md) – Codebase design patterns, formatting guidelines, and developer standard workflows.

### 🔍 3. Systems Audits & Assessments
*   [Database Architecture](./docs/audits/database-architecture.md) – DB indexing plans, query profiling, and schema designs.
*   [Security Audit](./docs/audits/security.md) – Vulnerability prevention measures, JWT specs, and device authorization constraints.
*   [Performance Audit](./docs/audits/performance.md) – Optimization metrics, page load metrics, and asset compression rules.
*   [UI/UX Audit](./docs/audits/ui-ux.md) – Design layout principles, dynamic states, and accessibility audits.
*   [Documentation Compliance](./docs/audits/documentation-compliance.md) – Verification of ISO safety standards and architectural completeness.
*   [Static vs Dynamic Audit](./docs/audits/static-vs-dynamic.md) – Prerendering, server actions, and hydration checks.
*   [Workflow Validation](./docs/audits/workflow-validation.md) – Comprehensive QA flows and edge case handling rules.
*   [Infrastructure Audit (Phase 18)](./docs/audits/phase-18-infrastructure.md) – Server resources and load-balancer validations.
*   [Master System Audit](./docs/audits/master-system.md) – Summary audit of clinic operations.

### 🛎️ 4. Receptionist Panel Audits & Reports
*   [Receptionist Auth Audit](./docs/receptionist/auth-audit.md) – Device checking security and front-desk auth specs.
*   [Reception API Map](./docs/receptionist/api-map.md) – Receptionist page network request index.
*   [Reception Dynamic Audit](./docs/receptionist/dynamic-audit.md) – Front-desk real-time updates and queue signaling audit.
*   [Reception Flow Gap Report](./docs/receptionist/flow-gap-report.md) – Analysis of registration flows and missing details.
*   [Reception Implementation Report](./docs/receptionist/implementation-report.md) – Execution summary of receptionist improvements.
*   [Reception Missing Items](./docs/receptionist/missing-items.md) – Action items for missing front-desk capabilities.
*   [Reception Production Readiness](./docs/receptionist/production-readiness.md) – Quality checks and performance readiness benchmarks.
*   [Receptionist Workflow Validation](./docs/receptionist/workflow-validation.md) – E2E validation scenarios for appointments and payments.

### 🏛️ 5. Historical Archive & Functional Requirements
*   [Functional Requirements Document Draft](./docs/archive/documentation1.md) – Initial Draft of the Functional Requirements Document (FRD) compiled by Dr. Nikunj Valaki.
*   [Functional Requirements Document V1.0](./docs/archive/documentation2.md) – Formatted master Functional Requirements Document (FRD) mapping all clinic panels.
*   [Implementation Status Matrix](./docs/archive/implementation-status-matrix.md) – Tracker of architectural components and features.
*   [Final Implementation Roadmap](./docs/archive/implementation-roadmap.md) – The master architectural plan.
*   [Phase 26 Completion](./docs/archive/phase-26-completion.md) | [Phase 27 Completion](./docs/archive/phase-27-completion.md) | [Phase 28 Completion](./docs/archive/phase-28-completion.md) | [Phase 29 Completion](./docs/archive/phase-29-completion.md) – Completion summaries and verification matrixes for previous engineering cycles.
