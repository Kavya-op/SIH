/**
 * Database Compilation and Seeder Script
 * Generates portal.sqlite and init_database.sql containing records for all 4 profiles,
 * their data, and verifiable credentials.
 * Run with: node --experimental-sqlite scripts/seed_database.js
 */

import fs from 'node:fs';
import path from 'node:path';
import { DatabaseSync } from 'node:sqlite';

const DB_FILE = path.resolve(process.cwd(), 'portal.sqlite');
const SQL_FILE = path.resolve(process.cwd(), 'init_database.sql');

console.log('--- Initializing SQLite Database for 4 Profiles & Credentials ---');

// If existing db file exists, remove to re-create clean state
if (fs.existsSync(DB_FILE)) {
  try {
    fs.unlinkSync(DB_FILE);
    console.log('Cleaned previous portal.sqlite file.');
  } catch (e) {
    console.warn('Note: Could not unlink existing sqlite file, will append/overwrite.');
  }
}

const db = new DatabaseSync(DB_FILE);

// 1. Create Schema Tables
const schemaDDL = `
-- 1. PROFILES TABLE (All 4 Profiles: Student, Industry, Faculty, Admin)
CREATE TABLE IF NOT EXISTS portal_profiles (
  id TEXT PRIMARY KEY,
  role TEXT NOT NULL,                     -- 'student' | 'industry' | 'academician' | 'institution_admin'
  profile_type TEXT NOT NULL,
  name TEXT NOT NULL,
  institution_or_company TEXT,
  department TEXT,
  discipline TEXT,
  email TEXT,
  phone TEXT,
  cgpa REAL,
  designation TEXT,
  cin TEXT,
  gstin TEXT,
  verification_status TEXT DEFAULT 'verified',
  profile_metadata TEXT,                   -- Full JSON attributes
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 2. VERIFIABLE CREDENTIALS VAULT
CREATE TABLE IF NOT EXISTS portal_credentials (
  id TEXT PRIMARY KEY,
  profile_id TEXT NOT NULL,
  profile_name TEXT NOT NULL,
  role TEXT NOT NULL,
  title TEXT NOT NULL,
  issuer TEXT NOT NULL,
  credential_type TEXT NOT NULL,           -- 'certificate' | 'license' | 'grant_sanction' | 'accreditation'
  issued_date TEXT,
  valid_until TEXT,
  verification_status TEXT DEFAULT 'verified',
  sha256_hash TEXT NOT NULL,
  verification_seal TEXT,
  file_url TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (profile_id) REFERENCES portal_profiles(id)
);

-- 3. VACANCIES & OPPORTUNITIES TABLE
CREATE TABLE IF NOT EXISTS portal_vacancies (
  id TEXT PRIMARY KEY,
  industry_id TEXT,
  company TEXT NOT NULL,
  title TEXT NOT NULL,
  type TEXT NOT NULL,                      -- 'internship' | 'job' | 'training'
  discipline TEXT NOT NULL,               -- 'engineering' | 'commerce' | 'healthcare'
  mode TEXT NOT NULL,                      -- 'hybrid' | 'onsite' | 'remote'
  location TEXT,
  stipend_formatted TEXT,
  openings INTEGER DEFAULT 1,
  status TEXT DEFAULT 'open',
  required_skills TEXT,                    -- JSON skill weights
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 4. APPLICATIONS (ATS Pipeline)
CREATE TABLE IF NOT EXISTS portal_applications (
  id TEXT PRIMARY KEY,
  opportunity_id TEXT NOT NULL,
  student_id TEXT NOT NULL,
  student_name TEXT NOT NULL,
  company TEXT NOT NULL,
  match_score INTEGER,
  status TEXT DEFAULT 'applied',          -- 'applied' | 'shortlisted' | 'interview' | 'offered' | 'completed'
  applied_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  history_logs TEXT                        -- JSON transition remarks
);
`;

db.exec(schemaDDL);
console.log('Database tables created successfully.');

// 2. Insert Profiles
const insertProfile = db.prepare(`
  INSERT INTO portal_profiles (
    id, role, profile_type, name, institution_or_company, department,
    discipline, email, phone, cgpa, designation, cin, gstin,
    verification_status, profile_metadata
  ) VALUES (
    ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
  )
`);

const profilesToInsert = [
  // PROFILE 1: Students
  {
    id: 'stu-cs-101',
    role: 'student',
    profile_type: 'Student Scholar',
    name: 'Aditya Varma',
    institution_or_company: 'Indian Institute of Technology (IIT) Delhi',
    department: 'Department of Computer Science & Engineering',
    discipline: 'engineering',
    email: 'aditya.varma@cse.iitd.ac.in',
    phone: '+91 98101 22334',
    cgpa: 9.42,
    designation: 'Undergraduate Researcher',
    cin: null,
    gstin: null,
    verification_status: 'verified',
    profile_metadata: JSON.stringify({
      degree: 'B.Tech in Computer Science & Artificial Intelligence',
      year: 4,
      skills: { 'Full-Stack & Cloud Architecture': 92, 'Artificial Intelligence & Machine Learning': 95, 'Data Structures & Algorithms': 94 },
      target_roles: ['Software Development Engineer', 'AI Research Scientist']
    })
  },
  {
    id: 'stu-com-201',
    role: 'student',
    profile_type: 'Student Scholar',
    name: 'Rhea Chawla',
    institution_or_company: 'Shri Ram College of Commerce (SRCC), Delhi University',
    department: 'Department of Commerce & Financial Studies',
    discipline: 'commerce',
    email: 'rhea.chawla@srcc.du.ac.in',
    phone: '+91 98711 55667',
    cgpa: 9.28,
    designation: 'Finance & FinTech Scholar',
    cin: null,
    gstin: null,
    verification_status: 'verified',
    profile_metadata: JSON.stringify({
      degree: 'B.Com (Honours) with Specialization in FinTech & Valuation',
      year: 3,
      skills: { 'Financial Modeling & Valuation (DCF)': 94, 'Corporate Accounting & GST': 90, 'Business Analytics & PowerBI': 88 },
      target_roles: ['Quantitative FinTech Analyst', 'Equity Research Analyst']
    })
  },
  {
    id: 'stu-mech-301',
    role: 'student',
    profile_type: 'Student Scholar',
    name: 'Karan Singhania',
    institution_or_company: 'BITS Pilani',
    department: 'Department of Mechanical Engineering',
    discipline: 'engineering',
    email: 'karan.singhania@pilani.bits-pilani.ac.in',
    phone: '+91 98200 44556',
    cgpa: 8.95,
    designation: 'Robotics & Autonomous Systems Scholar',
    cin: null,
    gstin: null,
    verification_status: 'verified',
    profile_metadata: JSON.stringify({
      degree: 'B.Tech in Mechanical Engineering & Robotics',
      year: 4,
      skills: { 'CAD/CAM & Mechanical Mechatronics': 92, 'ROS2 Kinematics': 88, 'Data Structures & System Design': 72 },
      target_roles: ['Autonomous Robotics Engineer', 'EV Mechatronics Specialist']
    })
  },
  {
    id: 'stu-usr-001',
    role: 'student',
    profile_type: 'Student Scholar',
    name: 'Aarav Sharma',
    institution_or_company: 'All India Institute of Ayurveda (AIIA), New Delhi',
    department: 'Dravyaguna (Materia Medica & Pharmacology)',
    discipline: 'healthcare',
    email: 'aarav.sharma@aiia.gov.in',
    phone: '+91 98765 43210',
    cgpa: 8.78,
    designation: 'Clinical Pharmacology Scholar',
    cin: null,
    gstin: null,
    verification_status: 'verified',
    profile_metadata: JSON.stringify({
      degree: 'BAMS (Ayurvedic Medicine) + Minor in Computational Biology',
      year: 4,
      skills: { 'Clinical Trials & GCP Protocols': 85, 'Ayurvedic Pharmacology': 88, 'Analytical Chemistry (HPLC)': 78 },
      target_roles: ['Clinical Research Specialist', 'Pharmacovigilance Associate']
    })
  },

  // PROFILE 2: Industry Partners
  {
    id: 'ind-google-01',
    role: 'industry',
    profile_type: 'Corporate Industry Partner',
    name: 'Google India R&D & DeepMind Labs',
    institution_or_company: 'Google Signature Towers, Gurugram / Bengaluru',
    department: 'Software Engineering, Cloud & Artificial Intelligence',
    discipline: 'engineering',
    email: 'recruiter@careers.google.com',
    phone: '+91 80 6744 1122',
    cgpa: null,
    designation: 'Technology Enterprise Partner',
    cin: 'U72900KA2004PTC033228',
    gstin: '29AAACG9876R1ZT',
    verification_status: 'verified',
    profile_metadata: JSON.stringify({
      website: 'https://careers.google.com',
      badge: 'Verified Cloud & AI Partner',
      connected: 'Connected with IIT Delhi, BITS Pilani & Central Universities'
    })
  },
  {
    id: 'ind-goldman-02',
    role: 'industry',
    profile_type: 'Corporate Industry Partner',
    name: 'Goldman Sachs Global Quantitative & FinTech Solutions',
    institution_or_company: 'Helios Business Park, Bengaluru 560103',
    department: 'Quantitative Finance, FinTech & Investment Banking',
    discipline: 'commerce',
    email: 'recruiter@goldmansachs.com',
    phone: '+91 80 4127 1000',
    cgpa: null,
    designation: 'Financial Technology Partner',
    cin: 'U74140KA2006FTC039981',
    gstin: '29AAACG1234F1Z8',
    verification_status: 'verified',
    profile_metadata: JSON.stringify({
      website: 'https://goldmansachs.com',
      badge: 'Verified FinTech & Quantitative Partner',
      connected: 'Connected with SRCC, FMS Delhi & Top Commerce Nodes'
    })
  },
  {
    id: 'ind-tata-03',
    role: 'industry',
    profile_type: 'Corporate Industry Partner',
    name: 'Tata Motors & Autonomous Robotics Tech Center',
    institution_or_company: 'Pimpri Research Center, Pune 411018',
    department: 'Mechatronics, Autonomous Vehicles & Heavy Engineering',
    discipline: 'engineering',
    email: 'recruiter@tatamotors.com',
    phone: '+91 20 6613 1111',
    cgpa: null,
    designation: 'Automotive & Robotics OEM Partner',
    cin: 'L28920MH1945PLC004520',
    gstin: '27AAACT2727Q1ZW',
    verification_status: 'verified',
    profile_metadata: JSON.stringify({
      website: 'https://tatamotors.com',
      badge: 'Verified Robotics & Mechatronics OEM',
      connected: 'Connected with BITS Pilani & IIT Bombay'
    })
  },
  {
    id: 'ind-himalaya-05',
    role: 'industry',
    profile_type: 'Corporate Industry Partner',
    name: 'Himalaya Wellness Company',
    institution_or_company: 'Makali, Bengaluru 562162',
    department: 'Pharmaceuticals, Phytotherapy & Clinical Pharmacology',
    discipline: 'healthcare',
    email: 'recruiter@himalayawellness.com',
    phone: '+91 80 6754 9999',
    cgpa: null,
    designation: 'Ayush & Life Sciences Partner',
    cin: 'U24233MH1930PLC001234',
    gstin: '29AAACH1234F1Z5',
    verification_status: 'verified',
    profile_metadata: JSON.stringify({
      website: 'https://himalayawellness.in',
      badge: 'Verified Ayush Partner',
      connected: 'Connected with AIIA New Delhi & NIA Jaipur'
    })
  },

  // PROFILE 3: Academician / Faculty Lead
  {
    id: 'usr-fac-01',
    role: 'academician',
    profile_type: 'Academician / Faculty Lead',
    name: 'Prof. Dr. Ananya Trivedi',
    institution_or_company: 'All India Institute of Ayurveda (AIIA), New Delhi',
    department: 'Department of Clinical Pharmacology & Computational Biology',
    discipline: 'healthcare',
    email: 'dr.ananya.trivedi@aiia.gov.in',
    phone: '+91 11 2695 0401',
    cgpa: null,
    designation: 'Professor & Head of Department',
    cin: null,
    gstin: null,
    verification_status: 'verified',
    profile_metadata: JSON.stringify({
      orcid: '0000-0002-1825-009X',
      scopus_id: '57201948200',
      citations: 1420,
      h_index: 18,
      publications: 42,
      patents: 3,
      mentor_status: 'Active (National Ayush Directory)'
    })
  },

  // PROFILE 4: Institution Admin / Apex Directorate
  {
    id: 'usr-admin-01',
    role: 'institution_admin',
    profile_type: 'Apex Directorate Admin',
    name: 'Consortium Placement & Accreditation Directorate',
    institution_or_company: 'Apex Consortium: IIT Delhi, SRCC, BITS Pilani & AIIA',
    department: 'National Accreditation & Academic-Industry Secretariat',
    discipline: 'all',
    email: 'directorate@consortium.gov.in',
    phone: '+91 11 2301 5500',
    cgpa: null,
    designation: 'Director General & Chairperson',
    cin: null,
    gstin: null,
    verification_status: 'verified',
    profile_metadata: JSON.stringify({
      nirf_rank: 'Rank #1 Apex Cluster',
      naac_grade: 'A++ (CGPA: 3.89)',
      enrolled_students: 3450,
      partner_industries: 86
    })
  }
];

for (const p of profilesToInsert) {
  insertProfile.run(
    p.id, p.role, p.profile_type, p.name, p.institution_or_company, p.department,
    p.discipline, p.email, p.phone, p.cgpa, p.designation, p.cin, p.gstin,
    p.verification_status, p.profile_metadata
  );
}
console.log(`Inserted ${profilesToInsert.length} records into portal_profiles.`);

// 3. Insert Verifiable Credentials
const insertCredential = db.prepare(`
  INSERT INTO portal_credentials (
    id, profile_id, profile_name, role, title, issuer, credential_type,
    issued_date, valid_until, verification_status, sha256_hash, verification_seal, file_url
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

const credentialsToInsert = [
  // Student Credentials
  {
    id: 'cred-cs-01',
    profile_id: 'stu-cs-101',
    profile_name: 'Aditya Varma (IIT Delhi)',
    role: 'student',
    title: 'AWS Certified Solutions Architect – Professional',
    issuer: 'Amazon Web Services (AWS)',
    credential_type: 'certificate',
    issued_date: '2026-01-15',
    valid_until: '2029-01-15',
    verification_status: 'verified',
    sha256_hash: '0xa3f9104c89db42e189ac01287e5b3901bcf45a1982703810ecdf283940182740',
    verification_seal: 'AWS-VERIFIED-SEAL-883921',
    file_url: 's3://portal-vault/credentials/cred-cs-01.pdf'
  },
  {
    id: 'cred-com-01',
    profile_id: 'stu-com-201',
    profile_name: 'Rhea Chawla (SRCC Delhi)',
    role: 'student',
    title: 'CFA Institute Investment Foundations® Certificate',
    issuer: 'CFA Institute (USA)',
    credential_type: 'certificate',
    issued_date: '2026-01-20',
    valid_until: 'Lifetime',
    verification_status: 'verified',
    sha256_hash: '0x3910abef29384701bcdef8291029384701293847012938470129384701293847',
    verification_seal: 'CFA-VERIFIED-SEAL-102938',
    file_url: 's3://portal-vault/credentials/cred-com-01.pdf'
  },
  {
    id: 'cred-mech-01',
    profile_id: 'stu-mech-301',
    profile_name: 'Karan Singhania (BITS Pilani)',
    role: 'student',
    title: 'Certified SOLIDWORKS Professional (CSWP)',
    issuer: 'Dassault Systèmes (France)',
    credential_type: 'certificate',
    issued_date: '2025-12-05',
    valid_until: 'Lifetime',
    verification_status: 'verified',
    sha256_hash: '0x1928374019283740192837401928374019283740192837401928374019283740',
    verification_seal: 'DASSAULT-CSWP-SEAL-710293',
    file_url: 's3://portal-vault/credentials/cred-mech-01.pdf'
  },
  {
    id: 'cred-hlth-01',
    profile_id: 'stu-usr-001',
    profile_name: 'Aarav Sharma (AIIA New Delhi)',
    role: 'student',
    title: 'Good Clinical Practice (GCP) for Clinical Trials Certification',
    issuer: 'CDSCO & NIDA Clinical Trials Network',
    credential_type: 'certificate',
    issued_date: '2025-08-14',
    valid_until: '2028-08-14',
    verification_status: 'verified',
    sha256_hash: '0x9928102938475610293847561029384756102938475610293847561029384756',
    verification_seal: 'CDSCO-GCP-SEAL-810293',
    file_url: 's3://portal-vault/credentials/cred-01.pdf'
  },

  // Industry Credentials
  {
    id: 'cred-ind-01',
    profile_id: 'ind-google-01',
    profile_name: 'Google India R&D & DeepMind Labs',
    role: 'industry',
    title: 'Ministry of Corporate Affairs (MCA) Certificate of Incorporation',
    issuer: 'Registrar of Companies (RoC), Karnataka',
    credential_type: 'license',
    issued_date: '2004-03-24',
    valid_until: 'Active (Perpetual)',
    verification_status: 'verified',
    sha256_hash: '0x4910293847561029384756102938475610293847561029384756102938475610',
    verification_seal: 'MCA-ROC-VERIFIED-U72900KA2004PTC033228',
    file_url: 's3://portal-vault/corporate/google_cin_cert.pdf'
  },
  {
    id: 'cred-ind-02',
    profile_id: 'ind-goldman-02',
    profile_name: 'Goldman Sachs Global Quantitative Solutions',
    role: 'industry',
    title: 'SEBI Registered Portfolio Manager & Global Financial Institution License',
    issuer: 'Securities and Exchange Board of India (SEBI)',
    credential_type: 'license',
    issued_date: '2006-08-18',
    valid_until: '2030-12-31',
    verification_status: 'verified',
    sha256_hash: '0x5819203948571029384756102938475610293847561029384756102938475610',
    verification_seal: 'SEBI-FINTECH-SEAL-INM000012345',
    file_url: 's3://portal-vault/corporate/gs_sebi_license.pdf'
  },

  // Academician Credentials
  {
    id: 'cred-fac-01',
    profile_id: 'usr-fac-01',
    profile_name: 'Prof. Dr. Ananya Trivedi (AIIA)',
    role: 'academician',
    title: 'Extra-Mural Research Grant Sanction Order (₹34.50 Lakhs)',
    issuer: 'Ministry of Ayush Research Directorate',
    credential_type: 'grant_sanction',
    issued_date: '2024-04-12',
    valid_until: '2027-03-31',
    verification_status: 'verified',
    sha256_hash: '0x7910293847561029384756102938475610293847561029384756102938475610',
    verification_seal: 'AYUSH-EMR-GRANT-SANCTION-2024-88',
    file_url: 's3://portal-vault/faculty/emr_grant_sanction.pdf'
  },

  // Institution Admin Credentials
  {
    id: 'cred-adm-01',
    profile_id: 'usr-admin-01',
    profile_name: 'Consortium Directorate (IIT Delhi, SRCC, AIIA)',
    role: 'institution_admin',
    title: 'National Board of Accreditation (NAAC A++ Tier-1 Accreditation)',
    issuer: 'National Assessment and Accreditation Council (NAAC) & UGC',
    credential_type: 'institutional_accreditation',
    issued_date: '2023-07-01',
    valid_until: '2028-06-30',
    verification_status: 'verified',
    sha256_hash: '0x9910293847561029384756102938475610293847561029384756102938475610',
    verification_seal: 'NAAC-A-PLUS-PLUS-SEAL-2023',
    file_url: 's3://portal-vault/admin/naac_accreditation.pdf'
  }
];

for (const c of credentialsToInsert) {
  insertCredential.run(
    c.id, c.profile_id, c.profile_name, c.role, c.title, c.issuer, c.credential_type,
    c.issued_date, c.valid_until, c.verification_status, c.sha256_hash, c.verification_seal, c.file_url
  );
}
console.log(`Inserted ${credentialsToInsert.length} credentials into portal_credentials.`);

// 3. Seed Vacancies & Opportunities
const vacanciesToInsert = [
  {
    id: 'opp-cs-01',
    industry_id: 'ind-google-01',
    company: 'Google India R&D & DeepMind Labs',
    title: 'Cloud & Deep Learning Research Intern',
    type: 'internship',
    discipline: 'engineering',
    mode: 'hybrid',
    location: 'Bengaluru / Hyderabad',
    stipend_formatted: '₹85,000/mo',
    openings: 4,
    status: 'open',
    required_skills: JSON.stringify({ 'Python & PyTorch': 90, 'Distributed Cloud Systems (GCP)': 85, 'Data Structures & Algorithms': 92 })
  },
  {
    id: 'opp-fin-01',
    industry_id: 'ind-goldman-02',
    company: 'Goldman Sachs Global Quantitative Solutions',
    title: 'Quantitative FinTech Analyst & Valuation Intern',
    type: 'internship',
    discipline: 'commerce',
    mode: 'hybrid',
    location: 'Bengaluru 560103',
    stipend_formatted: '₹75,000/mo',
    openings: 3,
    status: 'open',
    required_skills: JSON.stringify({ 'Financial Modeling & Valuation (DCF)': 92, 'Corporate Accounting & GST': 88, 'Business Analytics & PowerBI': 85 })
  },
  {
    id: 'opp-mech-01',
    industry_id: 'ind-tata-03',
    company: 'Tata Motors Electric Mobility & Passenger Vehicles',
    title: 'EV Mechatronics & Autonomous Robotics Engineer',
    type: 'job',
    discipline: 'engineering',
    mode: 'onsite',
    location: 'Pune Research Centre',
    stipend_formatted: '₹14.5 LPA',
    openings: 5,
    status: 'open',
    required_skills: JSON.stringify({ 'CAD/CAM & Mechanical Mechatronics': 90, 'ROS2 Kinematics': 88, 'Thermal Battery Simulation': 82 })
  },
  {
    id: 'opp-hlth-01',
    industry_id: 'ind-himalaya-04',
    company: 'Himalaya Wellness Pure Therapeutics & R&D Directorate',
    title: 'Clinical Pharmacology & Phytomedicine Fellow',
    type: 'internship',
    discipline: 'healthcare',
    mode: 'onsite',
    location: 'Makali, Bengaluru',
    stipend_formatted: '₹45,000/mo',
    openings: 2,
    status: 'open',
    required_skills: JSON.stringify({ 'Clinical Trials & GCP Protocols': 85, 'Ayurvedic Pharmacology': 88, 'Analytical Chemistry (HPLC)': 80 })
  }
];

const insertVacancy = db.prepare(`
  INSERT INTO portal_vacancies (id, industry_id, company, title, type, discipline, mode, location, stipend_formatted, openings, status, required_skills)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

for (const v of vacanciesToInsert) {
  insertVacancy.run(
    v.id, v.industry_id, v.company, v.title, v.type, v.discipline, v.mode,
    v.location, v.stipend_formatted, v.openings, v.status, v.required_skills
  );
}
console.log(`Inserted ${vacanciesToInsert.length} vacancies into portal_vacancies.`);

// 4. Seed Applications (ATS Pipeline)
const applicationsToInsert = [
  {
    id: 'app-101',
    opportunity_id: 'opp-cs-01',
    student_id: 'stu-cs-101',
    student_name: 'Aditya Varma',
    company: 'Google India R&D & DeepMind Labs',
    match_score: 95,
    status: 'shortlisted',
    history_logs: JSON.stringify([{ step: 'Applied', date: '2026-03-01' }, { step: 'Profile Evaluated (95% Fit)', date: '2026-03-04' }])
  },
  {
    id: 'app-102',
    opportunity_id: 'opp-fin-01',
    student_id: 'stu-com-201',
    student_name: 'Rhea Chawla',
    company: 'Goldman Sachs Global Quantitative Solutions',
    match_score: 94,
    status: 'interview',
    history_logs: JSON.stringify([{ step: 'Applied', date: '2026-03-02' }, { step: 'Interview Scheduled', date: '2026-03-06' }])
  },
  {
    id: 'app-103',
    opportunity_id: 'opp-mech-01',
    student_id: 'stu-mech-301',
    student_name: 'Karan Singhania',
    company: 'Tata Motors Electric Mobility',
    match_score: 92,
    status: 'offered',
    history_logs: JSON.stringify([{ step: 'Applied', date: '2026-02-28' }, { step: 'Offer Letter Dispatched', date: '2026-03-08' }])
  },
  {
    id: 'app-104',
    opportunity_id: 'opp-hlth-01',
    student_id: 'stu-usr-001',
    student_name: 'Aarav Sharma',
    company: 'Himalaya Wellness R&D Directorate',
    match_score: 88,
    status: 'completed',
    history_logs: JSON.stringify([{ step: 'Applied', date: '2026-01-10' }, { step: 'Internship Completed & Credential Issued', date: '2026-02-28' }])
  }
];

const insertApp = db.prepare(`
  INSERT INTO portal_applications (id, opportunity_id, student_id, student_name, company, match_score, status, history_logs)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`);

for (const a of applicationsToInsert) {
  insertApp.run(a.id, a.opportunity_id, a.student_id, a.student_name, a.company, a.match_score, a.status, a.history_logs);
}
console.log(`Inserted ${applicationsToInsert.length} applications into portal_applications.`);

// 5. Output portable init_database.sql file
const sqlDumpContent = `
-- =====================================================================
-- INITIAL DATABASE DUMP: 4 PROFILES, DATA & CREDENTIALS
-- Generated at: ${new Date().toISOString()}
-- Compatible with SQLite 3 & PostgreSQL 15+
-- =====================================================================

${schemaDDL}

-- Insert profiles
${profilesToInsert.map(p => {
  const meta = p.profile_metadata.replace(/'/g, "''");
  return `INSERT INTO portal_profiles (id, role, profile_type, name, institution_or_company, department, discipline, email, phone, cgpa, designation, cin, gstin, verification_status, profile_metadata) VALUES ('${p.id}', '${p.role}', '${p.profile_type}', '${p.name.replace(/'/g, "''")}', '${(p.institution_or_company || '').replace(/'/g, "''")}', '${(p.department || '').replace(/'/g, "''")}', '${p.discipline || 'all'}', '${p.email}', '${p.phone}', ${p.cgpa || 'NULL'}, '${(p.designation || '').replace(/'/g, "''")}', ${p.cin ? `'${p.cin}'` : 'NULL'}, ${p.gstin ? `'${p.gstin}'` : 'NULL'}, '${p.verification_status}', '${meta}');`;
}).join('\n')}

-- Insert credentials
${credentialsToInsert.map(c => {
  return `INSERT INTO portal_credentials (id, profile_id, profile_name, role, title, issuer, credential_type, issued_date, valid_until, verification_status, sha256_hash, verification_seal, file_url) VALUES ('${c.id}', '${c.profile_id}', '${c.profile_name.replace(/'/g, "''")}', '${c.role}', '${c.title.replace(/'/g, "''")}', '${c.issuer.replace(/'/g, "''")}', '${c.credential_type}', '${c.issued_date}', '${c.valid_until}', '${c.verification_status}', '${c.sha256_hash}', '${c.verification_seal}', '${c.file_url}');`;
}).join('\n')}

-- Insert vacancies
${vacanciesToInsert.map(v => {
  const sk = v.required_skills.replace(/'/g, "''");
  return `INSERT INTO portal_vacancies (id, industry_id, company, title, type, discipline, mode, location, stipend_formatted, openings, status, required_skills) VALUES ('${v.id}', '${v.industry_id}', '${v.company.replace(/'/g, "''")}', '${v.title.replace(/'/g, "''")}', '${v.type}', '${v.discipline}', '${v.mode}', '${v.location.replace(/'/g, "''")}', '${v.stipend_formatted}', ${v.openings}, '${v.status}', '${sk}');`;
}).join('\n')}

-- Insert applications
${applicationsToInsert.map(a => {
  const logs = a.history_logs.replace(/'/g, "''");
  return `INSERT INTO portal_applications (id, opportunity_id, student_id, student_name, company, match_score, status, history_logs) VALUES ('${a.id}', '${a.opportunity_id}', '${a.student_id}', '${a.student_name.replace(/'/g, "''")}', '${a.company.replace(/'/g, "''")}', ${a.match_score}, '${a.status}', '${logs}');`;
}).join('\n')}
`;

fs.writeFileSync(SQL_FILE, sqlDumpContent, 'utf8');
console.log(`Exported SQL dump to ${SQL_FILE}`);

db.close();
console.log(`SQLite database successfully built at ${DB_FILE}`);
