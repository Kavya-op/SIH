# Product Requirements Document (PRD)
## Portal for Academia–Industry Collaboration: Skill Mapping, Internships & Placement

**Problem Statement ID:** 26044
**Organization:** Ministry of Ayush | All India Institute of Ayurveda
**Category:** Software | **Theme:** Smart Automation
**Document Version:** 1.0
**Status:** Draft for SIH Submission

---

## 1. Executive Summary

A unified, role-based web platform that closes the gap between academic skill development and industry expectations by connecting **students, academicians, industries, and institutions** on a single system. The platform assesses student skills, maps them to industry-relevant roles and learning paths, and manages the full lifecycle of internships and placements — from opportunity posting to application, tracking, and analytics.

---

## 2. Problem Statement

- Students lack visibility into the skills required for their target careers.
- Industries struggle to find candidates with the right, verifiable skill sets.
- Academicians have limited access to industry internships, FDPs, and collaborative research opportunities.
- No centralized system exists to track skill development, internship participation, or placement outcomes at an institutional level.

---

## 3. Goals & Objectives

| Goal | Description |
|---|---|
| G1 | Provide every student a data-backed skill profile with identified gaps |
| G2 | Recommend personalized learning paths and career options |
| G3 | Centralize internship and placement postings with intelligent matching |
| G4 | Enable academicians to access industry collaboration opportunities |
| G5 | Give institutions real-time analytics on skill development and placement readiness |
| G6 | Maintain verified digital portfolios to boost student employability |

### Success Metrics (KPIs)
- % of students completing skill assessment
- Avg. skill-gap closure rate over a semester
- Number of internships/jobs posted and filled via the platform
- Student-to-opportunity match acceptance rate
- Academician participation in FDPs/collaborations sourced via portal
- Institutional dashboard adoption rate

---

## 4. User Personas & Roles

### 4.1 Student
Wants to discover skill gaps, get personalized upskilling recommendations, find and apply to internships/jobs, and build a verified portfolio.

### 4.2 Industry / Recruiter
Wants to post internships, jobs, training programs; find candidates matching required skills; manage applications and shortlisting.

### 4.3 Academician / Faculty
Wants visibility into faculty internships, industrial training, FDPs, consultancy, and collaborative research opportunities.

### 4.4 Institution Admin
Wants to monitor student skill development, internship/placement progress, and generate reports for accreditation and decision-making.

### 4.5 Platform (Super) Admin
Manages roles, verifies organizations, moderates content, and oversees system health.

---

## 5. Feature Requirements

### 5.1 Skill Development Module
| Feature | Description | Priority |
|---|---|---|
| Skill Assessment | Questionnaire + aptitude tests covering technical and soft skills | P0 |
| Skill Profiling | Auto-generated profile highlighting strengths and gaps vs. industry benchmarks | P0 |
| Learning Recommendations | Personalized courses/certifications mapped to identified gaps | P0 |
| Career Guidance | Suggested roles/industries based on skills, interests, and market demand | P1 |
| Digital Portfolio | Verified skills, certificates, projects, and achievements in one profile | P0 |

### 5.2 Internship Module
| Feature | Description | Priority |
|---|---|---|
| Internship Postings | Industries post roles with required skills, duration, stipend, mode | P0 |
| Matching Engine | Recommends internships to students based on skill profile fit | P0 |
| Application & Tracking | Students apply and track status end-to-end | P0 |
| Faculty/Academician Internships | Industrial training & FDP listings for faculty | P1 |
| Mentor Feedback & Completion Records | Structured feedback and certificate generation on completion | P1 |

### 5.3 Placement Module
| Feature | Description | Priority |
|---|---|---|
| Job Postings | Industry posts roles with qualifications/skills required | P0 |
| Recommendation Engine | Matches students to jobs based on compatibility score | P0 |
| Shortlisting | Auto-shortlist based on eligibility and skill match threshold | P1 |
| Application Tracking / ATS-lite | Recruiters manage pipeline (Applied → Shortlisted → Interview → Offer) | P0 |
| Placement Analytics | Institution-level dashboards on outcomes and trends | P1 |

### 5.4 Collaboration Module
| Feature | Description | Priority |
|---|---|---|
| Mentorship Programs | Industry experts mentor students/academicians | P2 |
| Workshops & Guest Lectures | Event listing and RSVP | P2 |
| Innovation Challenges / Live Projects | Industry-sponsored problem statements for students | P2 |
| Research Collaboration | Academician-industry joint research/consultancy listings | P2 |

### 5.5 Platform-Wide Features
| Feature | Description | Priority |
|---|---|---|
| Role-Based Access Control | Distinct dashboards/permissions per role | P0 |
| Secure Document Management | Resumes, certificates, internship reports, academic records | P0 |
| Notifications | Email/in-app alerts for matches, deadlines, status changes | P1 |
| Analytics & Reporting | Institution/industry dashboards with exportable reports | P1 |
| Integrations | LMS, certification providers (Coursera/NPTEL), institutional ERP/SIS | P2 |
| Search & Filters | Across internships, jobs, courses, and people | P1 |

---

## 6. Functional Requirements (Sample User Stories)

- As a **student**, I want to complete a skill assessment so I can see my strengths and gaps against industry benchmarks.
- As a **student**, I want personalized internship recommendations so I don't have to search manually.
- As an **industry recruiter**, I want to post an internship with required skills so the system surfaces well-matched candidates.
- As an **academician**, I want to browse FDPs and industrial training opportunities relevant to my domain.
- As an **institution admin**, I want a dashboard showing placement readiness across departments.
- As a **platform admin**, I want to verify industry accounts before they can post opportunities, to maintain trust.

---

## 7. Non-Functional Requirements

| Category | Requirement |
|---|---|
| Security | Role-based auth (JWT/OAuth2), encrypted document storage, data privacy compliance |
| Scalability | Support institution-wide and multi-institution scale (10k+ concurrent users) |
| Availability | 99.5%+ uptime target |
| Performance | Page load < 2s; matching engine results < 3s |
| Auditability | Activity logs for applications, approvals, document verification |
| Accessibility | WCAG 2.1 AA compliant UI |
| Data Portability | Export student portfolio as PDF/shareable link |

---

## 8. Suggested Tech Stack

| Layer | Options |
|---|---|
| Frontend | React.js / Next.js, Tailwind CSS |
| Backend | Node.js (Express/NestJS) or Django/FastAPI |
| Database | PostgreSQL (relational core) + Redis (caching) |
| Matching/Recommendation Engine | Python (scikit-learn / rule-based scoring initially, ML-based later) |
| Auth | OAuth2 / JWT, role-based access control |
| File Storage | AWS S3 / GCP Cloud Storage (encrypted) |
| Hosting | AWS / Azure / GCP with CI/CD (GitHub Actions) |
| Analytics | Metabase / custom dashboards (Chart.js, Recharts) |

---

## 9. MVP Scope (Hackathon Build)

**In Scope for MVP:**
1. Auth + role-based dashboards (Student, Industry, Academician, Admin)
2. Skill assessment questionnaire → skill profile generation
3. Internship/job posting by industry
4. Rule-based matching engine (skill overlap scoring)
5. Application & status tracking
6. Basic student digital portfolio
7. Institution admin dashboard with core analytics

**Out of Scope for MVP (Future Phases):**
- ML-based adaptive recommendation engine
- Full LMS/certification provider integrations
- Mentorship marketplace & innovation challenge module
- Advanced ATS features (interview scheduling, offer letters)

---

## 10. High-Level User Flow

1. **Onboarding:** User registers → selects role → institution/organization verification.
2. **Student:** Completes skill assessment → views skill profile & gaps → gets recommended courses/internships/jobs → applies → tracks status → builds portfolio.
3. **Industry:** Registers & gets verified → posts internship/job/training → reviews matched candidates → shortlists → manages pipeline.
4. **Academician:** Browses FDPs/industrial training/research opportunities → applies/registers.
5. **Institution Admin:** Views dashboard → monitors skill development, internship, and placement metrics → generates reports.

---

## 11. Risks & Mitigations

| Risk | Mitigation |
|---|---|
| Low industry adoption | Verified-partner onboarding, simple posting UX |
| Data privacy concerns (academic records) | Encryption, granular consent-based sharing |
| Matching accuracy issues | Start rule-based, iterate to ML with real usage data |
| Fake/unverified postings | Admin verification workflow for industry accounts |

---

## 12. Next Steps
1. Finalize wireframes for Student, Industry, Academician, and Admin dashboards.
2. Define the skill taxonomy and assessment question bank.
3. Build MVP matching algorithm (weighted skill-overlap scoring).
4. Prepare demo dataset (mock students, industries, internships) for hackathon presentation.
