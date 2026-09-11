-- =====================================================================
-- BACKEND DATABASE SCHEMA (PostgreSQL 15+)
-- Portal for Academia–Industry Collaboration: Skill Mapping,
-- Internships & Placement  |  SIH Problem Statement ID: 26044
-- =====================================================================
-- Notes:
--   * UUIDs used as primary keys (requires pgcrypto or uuid-ossp)
--   * JSONB used for flexible/semi-structured fields
--   * All tables have created_at / updated_at audit columns
--   * Soft-delete via deleted_at where relevant (avoid hard deletes on
--     records referenced by applications/portfolio for audit integrity)
-- =====================================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto; -- for gen_random_uuid()

-- =====================================================================
-- 1. ENUM TYPES
-- =====================================================================

CREATE TYPE user_role AS ENUM (
    'student', 'industry', 'academician', 'institution_admin', 'super_admin'
);

CREATE TYPE skill_category AS ENUM ('technical', 'soft');

CREATE TYPE opportunity_type AS ENUM ('internship', 'job', 'training');

CREATE TYPE opportunity_mode AS ENUM ('remote', 'onsite', 'hybrid');

CREATE TYPE opportunity_status AS ENUM ('draft', 'open', 'closed', 'archived');

CREATE TYPE application_status AS ENUM (
    'applied', 'shortlisted', 'interview', 'offered', 'rejected', 'completed', 'withdrawn'
);

CREATE TYPE credential_type AS ENUM (
    'certificate', 'project', 'internship_completion', 'achievement', 'resume'
);

CREATE TYPE collaboration_type AS ENUM (
    'fdp', 'research', 'consultancy', 'workshop', 'mentorship', 'guest_lecture', 'innovation_challenge'
);

CREATE TYPE notification_channel AS ENUM ('email', 'in_app', 'sms');

CREATE TYPE verification_status AS ENUM ('pending', 'verified', 'rejected');

-- =====================================================================
-- 2. CORE IDENTITY TABLES
-- =====================================================================

CREATE TABLE institutions (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name                VARCHAR(255) NOT NULL,
    type                VARCHAR(100),               -- e.g. university, college, autonomous institute
    address             TEXT,
    domain              VARCHAR(255),                -- email domain used for auto-verification
    verification_status verification_status NOT NULL DEFAULT 'pending',
    created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE industries (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name                VARCHAR(255) NOT NULL,
    industry_sector     VARCHAR(150),                -- IT, Manufacturing, Healthcare, etc.
    website             VARCHAR(255),
    address             TEXT,
    verification_status verification_status NOT NULL DEFAULT 'pending',
    verification_doc_url TEXT,                        -- e.g. GST/company registration proof
    created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE users (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email           VARCHAR(255) NOT NULL UNIQUE,
    password_hash   VARCHAR(255) NOT NULL,
    role            user_role NOT NULL,
    full_name       VARCHAR(255) NOT NULL,
    phone           VARCHAR(20),
    institution_id  UUID REFERENCES institutions(id) ON DELETE SET NULL,  -- for student/academician/institution_admin
    industry_id     UUID REFERENCES industries(id) ON DELETE SET NULL,    -- for industry role
    is_active       BOOLEAN NOT NULL DEFAULT true,
    is_verified     BOOLEAN NOT NULL DEFAULT false,
    last_login_at   TIMESTAMPTZ,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at      TIMESTAMPTZ,
    CONSTRAINT chk_role_org CHECK (
        (role IN ('student','academician','institution_admin') AND institution_id IS NOT NULL) OR
        (role = 'industry' AND industry_id IS NOT NULL) OR
        (role = 'super_admin')
    )
);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_institution ON users(institution_id);
CREATE INDEX idx_users_industry ON users(industry_id);

-- Role-specific profile extension tables (1:1 with users)

CREATE TABLE student_profiles (
    user_id         UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    enrollment_no   VARCHAR(100),
    department      VARCHAR(150),
    course          VARCHAR(150),          -- e.g. B.Tech CSE
    year_of_study   SMALLINT,
    graduation_year SMALLINT,
    resume_url      TEXT,
    bio             TEXT,
    linkedin_url    VARCHAR(255),
    github_url      VARCHAR(255),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE academician_profiles (
    user_id         UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    designation     VARCHAR(150),
    department      VARCHAR(150),
    specialization  TEXT,
    research_areas  TEXT[],
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE industry_contacts (            -- recruiter/HR user extension
    user_id         UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    designation     VARCHAR(150),
    department      VARCHAR(150),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =====================================================================
-- 3. SKILLS, ASSESSMENTS & PROFILING
-- =====================================================================

CREATE TABLE skills (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name            VARCHAR(150) NOT NULL UNIQUE,
    category        skill_category NOT NULL,
    description     TEXT,
    industry_tags   TEXT[],                 -- e.g. {'IT','Data Science'}
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_skills_category ON skills(category);

CREATE TABLE assessment_question_sets (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    version         VARCHAR(50) NOT NULL,
    title           VARCHAR(255) NOT NULL,
    is_active       BOOLEAN NOT NULL DEFAULT true,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE assessment_questions (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question_set_id UUID NOT NULL REFERENCES assessment_question_sets(id) ON DELETE CASCADE,
    skill_id        UUID NOT NULL REFERENCES skills(id),
    question_text   TEXT NOT NULL,
    question_type   VARCHAR(50) NOT NULL DEFAULT 'mcq',  -- mcq, likert, coding, subjective
    options         JSONB,                  -- for mcq/likert
    correct_option  VARCHAR(50),            -- nullable for subjective/self-rated
    weight          NUMERIC(5,2) NOT NULL DEFAULT 1.0,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_questions_set ON assessment_questions(question_set_id);
CREATE INDEX idx_questions_skill ON assessment_questions(skill_id);

CREATE TABLE skill_assessments (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id          UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    question_set_id     UUID NOT NULL REFERENCES assessment_question_sets(id),
    responses           JSONB NOT NULL,     -- [{question_id, answer, score}]
    total_score         NUMERIC(6,2),
    status              VARCHAR(30) NOT NULL DEFAULT 'submitted', -- in_progress, submitted, scored
    submitted_at        TIMESTAMPTZ,
    scored_at           TIMESTAMPTZ,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_assessments_student ON skill_assessments(student_id);

CREATE TABLE skill_scores (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id          UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    skill_id            UUID NOT NULL REFERENCES skills(id),
    assessment_id       UUID REFERENCES skill_assessments(id) ON DELETE SET NULL,
    proficiency_score   NUMERIC(5,2) NOT NULL CHECK (proficiency_score BETWEEN 0 AND 100),
    benchmark_score     NUMERIC(5,2) NOT NULL DEFAULT 0 CHECK (benchmark_score BETWEEN 0 AND 100),
    gap                 NUMERIC(5,2) GENERATED ALWAYS AS (benchmark_score - proficiency_score) STORED,
    computed_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (student_id, skill_id, assessment_id)
);
CREATE INDEX idx_skillscores_student ON skill_scores(student_id);
CREATE INDEX idx_skillscores_skill ON skill_scores(skill_id);

-- Skill -> recommended course/certification mapping (used by rec. engine)
CREATE TABLE skill_courses (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    skill_id        UUID NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
    title           VARCHAR(255) NOT NULL,
    provider        VARCHAR(150),           -- NPTEL, Coursera, internal, etc.
    url             TEXT,
    level           VARCHAR(30),            -- beginner/intermediate/advanced
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_skillcourses_skill ON skill_courses(skill_id);

-- =====================================================================
-- 4. OPPORTUNITIES (INTERNSHIP / JOB / TRAINING)
-- =====================================================================

CREATE TABLE opportunities (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    industry_id     UUID NOT NULL REFERENCES industries(id) ON DELETE CASCADE,
    posted_by       UUID NOT NULL REFERENCES users(id),      -- industry_contacts user
    type            opportunity_type NOT NULL,
    title           VARCHAR(255) NOT NULL,
    description     TEXT NOT NULL,
    mode            opportunity_mode NOT NULL DEFAULT 'onsite',
    location        VARCHAR(255),
    duration_weeks  SMALLINT,
    stipend_min     NUMERIC(10,2),
    stipend_max     NUMERIC(10,2),
    openings        SMALLINT NOT NULL DEFAULT 1,
    application_deadline DATE,
    status          opportunity_status NOT NULL DEFAULT 'draft',
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at      TIMESTAMPTZ
);
CREATE INDEX idx_opportunities_industry ON opportunities(industry_id);
CREATE INDEX idx_opportunities_type_status ON opportunities(type, status);
CREATE INDEX idx_opportunities_deadline ON opportunities(application_deadline);

CREATE TABLE opportunity_skill_requirements (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    opportunity_id      UUID NOT NULL REFERENCES opportunities(id) ON DELETE CASCADE,
    skill_id            UUID NOT NULL REFERENCES skills(id),
    min_proficiency     NUMERIC(5,2) NOT NULL DEFAULT 50 CHECK (min_proficiency BETWEEN 0 AND 100),
    is_mandatory        BOOLEAN NOT NULL DEFAULT true,
    UNIQUE (opportunity_id, skill_id)
);
CREATE INDEX idx_oppreq_opportunity ON opportunity_skill_requirements(opportunity_id);
CREATE INDEX idx_oppreq_skill ON opportunity_skill_requirements(skill_id);

-- =====================================================================
-- 5. APPLICATIONS & MATCHING
-- =====================================================================

CREATE TABLE applications (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id      UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    opportunity_id  UUID NOT NULL REFERENCES opportunities(id) ON DELETE CASCADE,
    match_score     NUMERIC(5,2),           -- computed at time of application/recommendation
    status          application_status NOT NULL DEFAULT 'applied',
    cover_note      TEXT,
    mentor_id       UUID REFERENCES users(id),   -- assigned mentor (industry side) once shortlisted
    applied_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (student_id, opportunity_id)
);
CREATE INDEX idx_applications_student ON applications(student_id);
CREATE INDEX idx_applications_opportunity ON applications(opportunity_id);
CREATE INDEX idx_applications_status ON applications(status);

CREATE TABLE application_status_history (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id  UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
    old_status      application_status,
    new_status      application_status NOT NULL,
    changed_by      UUID REFERENCES users(id),
    remarks         TEXT,
    changed_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_apphistory_application ON application_status_history(application_id);

CREATE TABLE mentor_feedback (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id  UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
    given_by        UUID NOT NULL REFERENCES users(id),
    rating          SMALLINT CHECK (rating BETWEEN 1 AND 5),
    feedback_text   TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_feedback_application ON mentor_feedback(application_id);

-- =====================================================================
-- 6. PORTFOLIO & DOCUMENT MANAGEMENT
-- =====================================================================

CREATE TABLE credentials (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id      UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type            credential_type NOT NULL,
    title           VARCHAR(255) NOT NULL,
    issuer          VARCHAR(255),
    file_url        TEXT NOT NULL,          -- signed S3 object reference
    issued_date     DATE,
    related_application_id UUID REFERENCES applications(id) ON DELETE SET NULL,
    verified        BOOLEAN NOT NULL DEFAULT false,
    verified_by     UUID REFERENCES users(id),
    verified_at     TIMESTAMPTZ,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_credentials_student ON credentials(student_id);
CREATE INDEX idx_credentials_verified ON credentials(verified);

-- =====================================================================
-- 7. COLLABORATION (ACADEMICIAN <-> INDUSTRY)
-- =====================================================================

CREATE TABLE collaboration_listings (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type            collaboration_type NOT NULL,
    title           VARCHAR(255) NOT NULL,
    description     TEXT,
    posted_by_industry_id UUID REFERENCES industries(id) ON DELETE CASCADE,
    posted_by_user_id     UUID REFERENCES users(id),   -- academician who posted (for research/consultancy)
    start_date      DATE,
    end_date        DATE,
    location        VARCHAR(255),
    mode            opportunity_mode DEFAULT 'onsite',
    capacity        SMALLINT,
    status          opportunity_status NOT NULL DEFAULT 'open',
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_collab_type_status ON collaboration_listings(type, status);

CREATE TABLE collaboration_registrations (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    listing_id          UUID NOT NULL REFERENCES collaboration_listings(id) ON DELETE CASCADE,
    user_id             UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status              VARCHAR(30) NOT NULL DEFAULT 'registered', -- registered, attended, cancelled
    registered_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (listing_id, user_id)
);
CREATE INDEX idx_collabreg_listing ON collaboration_registrations(listing_id);
CREATE INDEX idx_collabreg_user ON collaboration_registrations(user_id);

-- =====================================================================
-- 8. NOTIFICATIONS
-- =====================================================================

CREATE TABLE notifications (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    channel         notification_channel NOT NULL DEFAULT 'in_app',
    title           VARCHAR(255) NOT NULL,
    body            TEXT,
    metadata        JSONB,                  -- e.g. {application_id, opportunity_id}
    is_read         BOOLEAN NOT NULL DEFAULT false,
    sent_at         TIMESTAMPTZ,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_notifications_user ON notifications(user_id, is_read);

-- =====================================================================
-- 9. ANALYTICS SUPPORT (MATERIALIZED VIEWS)
-- =====================================================================

-- Institution-level skill development snapshot
CREATE MATERIALIZED VIEW mv_institution_skill_summary AS
SELECT
    u.institution_id,
    s.id AS skill_id,
    s.name AS skill_name,
    ROUND(AVG(ss.proficiency_score), 2) AS avg_proficiency,
    ROUND(AVG(ss.gap), 2) AS avg_gap,
    COUNT(DISTINCT ss.student_id) AS students_assessed
FROM skill_scores ss
JOIN users u ON u.id = ss.student_id
JOIN skills s ON s.id = ss.skill_id
GROUP BY u.institution_id, s.id, s.name;

CREATE UNIQUE INDEX idx_mv_inst_skill ON mv_institution_skill_summary(institution_id, skill_id);

-- Institution-level placement funnel
CREATE MATERIALIZED VIEW mv_institution_placement_funnel AS
SELECT
    u.institution_id,
    o.type,
    a.status,
    COUNT(*) AS total
FROM applications a
JOIN users u ON u.id = a.student_id
JOIN opportunities o ON o.id = a.opportunity_id
GROUP BY u.institution_id, o.type, a.status;

CREATE INDEX idx_mv_inst_placement ON mv_institution_placement_funnel(institution_id, type, status);

-- Refresh strategy (run via scheduled job, e.g. nightly or on-demand):
-- REFRESH MATERIALIZED VIEW CONCURRENTLY mv_institution_skill_summary;
-- REFRESH MATERIALIZED VIEW CONCURRENTLY mv_institution_placement_funnel;

-- =====================================================================
-- 10. AUDIT LOG (generic, for sensitive actions)
-- =====================================================================

CREATE TABLE audit_logs (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_id        UUID REFERENCES users(id),
    action          VARCHAR(100) NOT NULL,      -- e.g. 'credential.verify', 'opportunity.publish'
    entity_type     VARCHAR(100) NOT NULL,
    entity_id       UUID,
    metadata        JSONB,
    ip_address      INET,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_auditlogs_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX idx_auditlogs_actor ON audit_logs(actor_id);

-- =====================================================================
-- 11. UPDATED_AT AUTO-TOUCH TRIGGER (applied to key mutable tables)
-- =====================================================================

CREATE OR REPLACE FUNCTION trg_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at_users
    BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION trg_set_updated_at();

CREATE TRIGGER set_updated_at_opportunities
    BEFORE UPDATE ON opportunities
    FOR EACH ROW EXECUTE FUNCTION trg_set_updated_at();

CREATE TRIGGER set_updated_at_applications
    BEFORE UPDATE ON applications
    FOR EACH ROW EXECUTE FUNCTION trg_set_updated_at();

CREATE TRIGGER set_updated_at_collaboration_listings
    BEFORE UPDATE ON collaboration_listings
    FOR EACH ROW EXECUTE FUNCTION trg_set_updated_at();

-- =====================================================================
-- END OF SCHEMA
-- =====================================================================
