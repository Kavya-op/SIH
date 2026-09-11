# Technical Requirements Document (TRD)
## Portal for Academia–Industry Collaboration: Skill Mapping, Internships & Placement

**Problem Statement ID:** 26044
**Companion Document:** PRD_Academia_Industry_Portal.md
**Document Version:** 1.0
**Status:** Draft for SIH Submission

---

## 1. Purpose & Scope

This TRD translates the PRD into concrete technical specifications: system architecture, data models, APIs, algorithms, infrastructure, security, and non-functional engineering targets needed to build the MVP and scale it post-hackathon.

---

## 2. System Architecture

### 2.1 High-Level Architecture (Layered / Microservice-Ready Monolith)

```
                        ┌─────────────────────────┐
                        │   Client Apps (Web)      │
                        │  React/Next.js SPA        │
                        └────────────┬─────────────┘
                                     │ HTTPS/REST (JSON)
                        ┌────────────▼─────────────┐
                        │   API Gateway / BFF        │
                        │  (Auth, rate limit, routing)│
                        └────────────┬─────────────┘
        ┌───────────────┬───────────┼───────────────┬───────────────┐
        ▼               ▼           ▼               ▼               ▼
 ┌────────────┐ ┌───────────────┐ ┌───────────────┐ ┌────────────┐ ┌────────────┐
 │ Auth &      │ │ Skill &       │ │ Internship &   │ │ Portfolio & │ │ Analytics & │
 │ User Service│ │ Assessment Svc│ │ Placement Svc  │ │ Docs Service│ │ Reporting Svc│
 └─────┬──────┘ └──────┬────────┘ └──────┬─────────┘ └─────┬──────┘ └─────┬──────┘
       │               │                  │                 │              │
       └───────────────┴────────┬─────────┴─────────────────┴──────────────┘
                                 ▼
                    ┌─────────────────────────┐
                    │  PostgreSQL (primary DB)  │
                    │  Redis (cache/queue)       │
                    │  S3-compatible storage      │
                    └─────────────────────────┘
```

For the hackathon MVP, build as a **modular monolith** (single deployable backend, clean service boundaries by module) so it can be split into microservices later without a rewrite.

### 2.2 Core Modules (mapped to services)

| Module | Responsibility |
|---|---|
| Auth & User Service | Registration, login, RBAC, org/institution verification |
| Skill & Assessment Service | Questionnaire delivery, scoring, skill-profile generation |
| Recommendation Engine | Skill-gap → course mapping; student → internship/job matching |
| Internship & Placement Service | Postings, applications, pipeline/status tracking |
| Portfolio & Document Service | Verified certificates, resumes, portfolio rendering/export |
| Collaboration Service | FDPs, mentorship, workshops, research listings |
| Notification Service | Email/in-app alerts (async, queue-based) |
| Analytics & Reporting Service | Aggregated dashboards for institutions/industries |

---

## 3. Technology Stack

| Layer | Choice | Rationale |
|---|---|---|
| Frontend | React.js + Next.js, Tailwind CSS, Redux/Zustand | Fast SSR-capable dashboards, component reuse across 4 roles |
| Backend | Node.js + NestJS (TypeScript) *or* Django REST Framework | Strong typing/module structure (NestJS) or rapid batteries-included dev (Django) |
| Database | PostgreSQL 15+ | Relational integrity for users, applications, skill mappings |
| Cache/Queue | Redis (cache + BullMQ/Celery for async jobs) | Notification dispatch, matching-score recompute jobs |
| Search | PostgreSQL full-text search (MVP) → Elasticsearch (scale) | Internship/job/course search & filters |
| File Storage | AWS S3 / GCP Cloud Storage (private buckets, signed URLs) | Resumes, certificates, reports |
| Auth | JWT (access + refresh tokens), OAuth2 for institutional SSO (future) | Stateless auth, RBAC |
| Matching Engine | Python microservice (FastAPI) using weighted skill-vector scoring; scikit-learn for future ML | Language best suited for scoring/ML iteration |
| Infra/DevOps | Docker, GitHub Actions CI/CD, deploy to AWS/Azure/GCP (ECS/App Runner or Render for MVP) | Fast iteration for hackathon, scalable later |
| Monitoring | Sentry (errors), Grafana + Prometheus (metrics, post-MVP) | Observability |

---

## 4. Data Model (Core Entities)

### 4.1 Entity-Relationship Overview

```
User (1) ── (1) Role [Student|Industry|Academician|InstitutionAdmin|SuperAdmin]
Student (1) ── (1) SkillProfile ── (M) SkillScore ── (1) Skill
Student (1) ── (M) Application ── (1) Opportunity
Industry (1) ── (M) Opportunity [Internship|Job|TrainingProgram]
Academician (1) ── (M) CollaborationListing [FDP|Research|Consultancy]
Institution (1) ── (M) Student
Institution (1) ── (M) Academician
Student (1) ── (1) Portfolio ── (M) Credential
Opportunity (1) ── (M) SkillRequirement ── (1) Skill
```

### 4.2 Key Tables (simplified schema)

**users**
| Column | Type | Notes |
|---|---|---|
| id | UUID (PK) | |
| email | varchar, unique | |
| password_hash | varchar | |
| role | enum(student, industry, academician, institution_admin, super_admin) | |
| institution_id | UUID (FK, nullable) | |
| is_verified | boolean | Org/industry verification gate |
| created_at / updated_at | timestamp | |

**skills**
| id | UUID (PK) | |
| name | varchar | e.g., "Python", "Communication" |
| category | enum(technical, soft) | |
| industry_tags | text[] | For mapping to job roles |

**skill_assessments**
| id | UUID (PK) | |
| student_id | UUID (FK) | |
| question_set_version | varchar | |
| responses | JSONB | |
| submitted_at | timestamp | |

**skill_scores**
| id | UUID (PK) | |
| student_id | UUID (FK) | |
| skill_id | UUID (FK) | |
| proficiency_score | numeric(0–100) | |
| benchmark_score | numeric(0–100) | Industry-expected level |
| gap | numeric | benchmark - proficiency |

**opportunities**
| id | UUID (PK) | |
| industry_id | UUID (FK) | |
| type | enum(internship, job, training) | |
| title, description | text | |
| required_skills | JSONB / linked table | skill_id + min_proficiency |
| duration, stipend, location, mode | varchar | |
| status | enum(draft, open, closed) | |

**applications**
| id | UUID (PK) | |
| student_id | UUID (FK) | |
| opportunity_id | UUID (FK) | |
| match_score | numeric | Computed at application time |
| status | enum(applied, shortlisted, interview, offered, rejected, completed) | |
| timestamps | | |

**portfolios / credentials**
| id | UUID (PK) | |
| student_id | UUID (FK) | |
| type | enum(certificate, project, internship_completion, achievement) | |
| file_url | varchar | S3 signed URL reference |
| verified_by | UUID (FK, nullable) | Institution/industry verifier |
| verified | boolean | |

**collaboration_listings**
| id | UUID (PK) | |
| academician_id / industry_id | UUID (FK) | |
| type | enum(fdp, research, consultancy, workshop, mentorship) | |
| details | JSONB | |

---

## 5. Matching / Recommendation Algorithm (MVP)

**Approach:** Weighted skill-vector cosine similarity (rule-based, explainable) — upgradeable to ML later.

```
For each student S and opportunity O:
  student_vector = [proficiency_score(skill_i) for skill_i in union(S.skills, O.required_skills)]
  opportunity_vector = [required_level(skill_i) for skill_i in same skill set]

  match_score = cosine_similarity(student_vector, opportunity_vector) * 100
  gap_skills = [skill_i where student_proficiency < required_level]

Return: match_score, gap_skills, ranked list of opportunities per student
```

- **Threshold-based recommendation:** Show opportunities with `match_score >= 60%` by default (configurable).
- **Course recommendation:** For each `gap_skill`, map to a curated course from a `skill_to_course` lookup table (seeded manually for MVP, later pluggable via LMS API).
- **Future (Phase 2):** Replace static weighting with a learned model (e.g., logistic regression / gradient boosting) trained on historical application-to-offer outcomes.

---

## 6. API Design (Representative Endpoints)

### Auth & User
```
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/refresh
GET    /api/users/me
PATCH  /api/users/me
```

### Skill & Assessment
```
GET    /api/skills
POST   /api/assessments/submit
GET    /api/students/:id/skill-profile
GET    /api/students/:id/recommendations/courses
```

### Internship & Placement
```
POST   /api/opportunities                (industry creates posting)
GET    /api/opportunities?type=internship&skills=...
GET    /api/students/:id/recommendations/opportunities
POST   /api/applications                 (student applies)
PATCH  /api/applications/:id/status      (industry updates pipeline)
GET    /api/industries/:id/applications
```

### Portfolio
```
POST   /api/portfolio/credentials
GET    /api/students/:id/portfolio
POST   /api/portfolio/credentials/:id/verify   (institution/industry)
```

### Collaboration (Academician)
```
GET    /api/collaborations?type=fdp
POST   /api/collaborations
POST   /api/collaborations/:id/register
```

### Analytics
```
GET    /api/institutions/:id/dashboard/skill-development
GET    /api/institutions/:id/dashboard/placement
GET    /api/industries/:id/dashboard/pipeline
```

**API conventions:** REST + JSON, versioned under `/api/v1/`, JWT bearer auth, pagination via `?page=&limit=`, standard error envelope `{ error: { code, message } }`.

---

## 7. Security Requirements

| Area | Requirement |
|---|---|
| Authentication | JWT access (15 min) + refresh token (7 days), bcrypt/argon2 password hashing |
| Authorization | RBAC middleware on every route; row-level checks (e.g., student can only view own profile) |
| Data Protection | AES-256 encryption at rest for documents; TLS 1.2+ in transit |
| Input Validation | Schema validation (Zod/Joi/Pydantic) on all endpoints |
| File Uploads | Type/size validation, virus scan hook, private S3 buckets with signed URL expiry |
| Verification Workflow | Manual/automated org-domain verification before industry accounts can post |
| Audit Logging | Log create/update/delete on applications, verifications, document access |
| Compliance | Align with India's DPDP Act principles for academic/personal data handling |

---

## 8. Non-Functional Engineering Targets

| Metric | Target |
|---|---|
| API response time (p95) | < 500ms for CRUD, < 3s for matching/recommendation calls |
| Concurrent users (MVP) | 1,000+ ; architecture to scale to 10,000+ |
| Uptime | 99.5% |
| DB backup | Daily automated snapshots, 7-day retention (MVP) |
| Horizontal scaling | Stateless API pods behind load balancer; DB read replicas (Phase 2) |

---

## 9. Deployment & DevOps

- **Environments:** dev → staging → production
- **CI/CD:** GitHub Actions — lint/test on PR, auto-deploy `main` to staging, manual promote to prod
- **Containerization:** Docker images per service; docker-compose for local dev
- **Hosting (MVP):** Render/Railway or AWS (ECS Fargate) + managed PostgreSQL (RDS) + S3
- **Secrets Management:** Environment variables via platform secret store (never committed)
- **Logging/Monitoring:** Centralized logs (CloudWatch/Logtail), Sentry for error tracking

---

## 10. Third-Party Integrations (Phased)

| Phase | Integration |
|---|---|
| MVP | Email service (SendGrid/SES) for notifications |
| Phase 2 | LMS/certification providers (NPTEL, Coursera API) for course auto-recommendation |
| Phase 2 | Institutional ERP/SIS for auto-importing student academic records |
| Phase 3 | Payment gateway (if paid certifications/premium features introduced) |
| Phase 3 | Video conferencing SDK (for mentorship/interview scheduling) |

---

## 11. Testing Strategy

| Level | Approach |
|---|---|
| Unit | Jest/PyTest for services (auth, matching algorithm, scoring logic) |
| Integration | API contract tests (Supertest/Postman/Newman) per module |
| E2E | Playwright/Cypress for critical flows: signup → assessment → apply → track |
| Load | k6/Locust on matching engine and search endpoints before scale-up |
| Security | OWASP ZAP scan, dependency vulnerability scanning (Dependabot/Snyk) |

---

## 12. Hackathon Build Plan (Suggested Sprint Breakdown)

| Sprint | Deliverable |
|---|---|
| Day 1 | Auth + RBAC, DB schema, project scaffolding |
| Day 2 | Skill assessment flow + skill profile generation |
| Day 3 | Opportunity posting (industry) + matching engine v1 |
| Day 4 | Application/tracking flow + portfolio module |
| Day 5 | Institution/industry dashboards + analytics |
| Day 6 | Polish, seed demo data, deployment, pitch deck |

---

## 13. Open Technical Decisions

- Modular monolith vs. microservices at launch (recommend monolith for MVP, split post-traction).
- NestJS vs. Django for backend (decide based on team's stronger stack).
- Rule-based vs. ML matching for MVP demo (recommend rule-based with clear roadmap to ML).
- Elasticsearch adoption trigger (introduce once postings exceed ~10k or search latency degrades).
