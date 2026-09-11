
-- =====================================================================
-- INITIAL DATABASE DUMP: 4 PROFILES, DATA & CREDENTIALS
-- Generated at: 2026-09-10T15:58:17.640Z
-- Compatible with SQLite 3 & PostgreSQL 15+
-- =====================================================================


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


-- Insert profiles
INSERT INTO portal_profiles (id, role, profile_type, name, institution_or_company, department, discipline, email, phone, cgpa, designation, cin, gstin, verification_status, profile_metadata) VALUES ('stu-cs-101', 'student', 'Student Scholar', 'Aditya Varma', 'Indian Institute of Technology (IIT) Delhi', 'Department of Computer Science & Engineering', 'engineering', 'aditya.varma@cse.iitd.ac.in', '+91 98101 22334', 9.42, 'Undergraduate Researcher', NULL, NULL, 'verified', '{"degree":"B.Tech in Computer Science & Artificial Intelligence","year":4,"skills":{"Full-Stack & Cloud Architecture":92,"Artificial Intelligence & Machine Learning":95,"Data Structures & Algorithms":94},"target_roles":["Software Development Engineer","AI Research Scientist"]}');
INSERT INTO portal_profiles (id, role, profile_type, name, institution_or_company, department, discipline, email, phone, cgpa, designation, cin, gstin, verification_status, profile_metadata) VALUES ('stu-com-201', 'student', 'Student Scholar', 'Rhea Chawla', 'Shri Ram College of Commerce (SRCC), Delhi University', 'Department of Commerce & Financial Studies', 'commerce', 'rhea.chawla@srcc.du.ac.in', '+91 98711 55667', 9.28, 'Finance & FinTech Scholar', NULL, NULL, 'verified', '{"degree":"B.Com (Honours) with Specialization in FinTech & Valuation","year":3,"skills":{"Financial Modeling & Valuation (DCF)":94,"Corporate Accounting & GST":90,"Business Analytics & PowerBI":88},"target_roles":["Quantitative FinTech Analyst","Equity Research Analyst"]}');
INSERT INTO portal_profiles (id, role, profile_type, name, institution_or_company, department, discipline, email, phone, cgpa, designation, cin, gstin, verification_status, profile_metadata) VALUES ('stu-mech-301', 'student', 'Student Scholar', 'Karan Singhania', 'BITS Pilani', 'Department of Mechanical Engineering', 'engineering', 'karan.singhania@pilani.bits-pilani.ac.in', '+91 98200 44556', 8.95, 'Robotics & Autonomous Systems Scholar', NULL, NULL, 'verified', '{"degree":"B.Tech in Mechanical Engineering & Robotics","year":4,"skills":{"CAD/CAM & Mechanical Mechatronics":92,"ROS2 Kinematics":88,"Data Structures & System Design":72},"target_roles":["Autonomous Robotics Engineer","EV Mechatronics Specialist"]}');
INSERT INTO portal_profiles (id, role, profile_type, name, institution_or_company, department, discipline, email, phone, cgpa, designation, cin, gstin, verification_status, profile_metadata) VALUES ('stu-usr-001', 'student', 'Student Scholar', 'Aarav Sharma', 'All India Institute of Ayurveda (AIIA), New Delhi', 'Dravyaguna (Materia Medica & Pharmacology)', 'healthcare', 'aarav.sharma@aiia.gov.in', '+91 98765 43210', 8.78, 'Clinical Pharmacology Scholar', NULL, NULL, 'verified', '{"degree":"BAMS (Ayurvedic Medicine) + Minor in Computational Biology","year":4,"skills":{"Clinical Trials & GCP Protocols":85,"Ayurvedic Pharmacology":88,"Analytical Chemistry (HPLC)":78},"target_roles":["Clinical Research Specialist","Pharmacovigilance Associate"]}');
INSERT INTO portal_profiles (id, role, profile_type, name, institution_or_company, department, discipline, email, phone, cgpa, designation, cin, gstin, verification_status, profile_metadata) VALUES ('ind-google-01', 'industry', 'Corporate Industry Partner', 'Google India R&D & DeepMind Labs', 'Google Signature Towers, Gurugram / Bengaluru', 'Software Engineering, Cloud & Artificial Intelligence', 'engineering', 'recruiter@careers.google.com', '+91 80 6744 1122', NULL, 'Technology Enterprise Partner', 'U72900KA2004PTC033228', '29AAACG9876R1ZT', 'verified', '{"website":"https://careers.google.com","badge":"Verified Cloud & AI Partner","connected":"Connected with IIT Delhi, BITS Pilani & Central Universities"}');
INSERT INTO portal_profiles (id, role, profile_type, name, institution_or_company, department, discipline, email, phone, cgpa, designation, cin, gstin, verification_status, profile_metadata) VALUES ('ind-goldman-02', 'industry', 'Corporate Industry Partner', 'Goldman Sachs Global Quantitative & FinTech Solutions', 'Helios Business Park, Bengaluru 560103', 'Quantitative Finance, FinTech & Investment Banking', 'commerce', 'recruiter@goldmansachs.com', '+91 80 4127 1000', NULL, 'Financial Technology Partner', 'U74140KA2006FTC039981', '29AAACG1234F1Z8', 'verified', '{"website":"https://goldmansachs.com","badge":"Verified FinTech & Quantitative Partner","connected":"Connected with SRCC, FMS Delhi & Top Commerce Nodes"}');
INSERT INTO portal_profiles (id, role, profile_type, name, institution_or_company, department, discipline, email, phone, cgpa, designation, cin, gstin, verification_status, profile_metadata) VALUES ('ind-tata-03', 'industry', 'Corporate Industry Partner', 'Tata Motors & Autonomous Robotics Tech Center', 'Pimpri Research Center, Pune 411018', 'Mechatronics, Autonomous Vehicles & Heavy Engineering', 'engineering', 'recruiter@tatamotors.com', '+91 20 6613 1111', NULL, 'Automotive & Robotics OEM Partner', 'L28920MH1945PLC004520', '27AAACT2727Q1ZW', 'verified', '{"website":"https://tatamotors.com","badge":"Verified Robotics & Mechatronics OEM","connected":"Connected with BITS Pilani & IIT Bombay"}');
INSERT INTO portal_profiles (id, role, profile_type, name, institution_or_company, department, discipline, email, phone, cgpa, designation, cin, gstin, verification_status, profile_metadata) VALUES ('ind-himalaya-05', 'industry', 'Corporate Industry Partner', 'Himalaya Wellness Company', 'Makali, Bengaluru 562162', 'Pharmaceuticals, Phytotherapy & Clinical Pharmacology', 'healthcare', 'recruiter@himalayawellness.com', '+91 80 6754 9999', NULL, 'Ayush & Life Sciences Partner', 'U24233MH1930PLC001234', '29AAACH1234F1Z5', 'verified', '{"website":"https://himalayawellness.in","badge":"Verified Ayush Partner","connected":"Connected with AIIA New Delhi & NIA Jaipur"}');
INSERT INTO portal_profiles (id, role, profile_type, name, institution_or_company, department, discipline, email, phone, cgpa, designation, cin, gstin, verification_status, profile_metadata) VALUES ('usr-fac-01', 'academician', 'Academician / Faculty Lead', 'Prof. Dr. Ananya Trivedi', 'All India Institute of Ayurveda (AIIA), New Delhi', 'Department of Clinical Pharmacology & Computational Biology', 'healthcare', 'dr.ananya.trivedi@aiia.gov.in', '+91 11 2695 0401', NULL, 'Professor & Head of Department', NULL, NULL, 'verified', '{"orcid":"0000-0002-1825-009X","scopus_id":"57201948200","citations":1420,"h_index":18,"publications":42,"patents":3,"mentor_status":"Active (National Ayush Directory)"}');
INSERT INTO portal_profiles (id, role, profile_type, name, institution_or_company, department, discipline, email, phone, cgpa, designation, cin, gstin, verification_status, profile_metadata) VALUES ('usr-admin-01', 'institution_admin', 'Apex Directorate Admin', 'Consortium Placement & Accreditation Directorate', 'Apex Consortium: IIT Delhi, SRCC, BITS Pilani & AIIA', 'National Accreditation & Academic-Industry Secretariat', 'all', 'directorate@consortium.gov.in', '+91 11 2301 5500', NULL, 'Director General & Chairperson', NULL, NULL, 'verified', '{"nirf_rank":"Rank #1 Apex Cluster","naac_grade":"A++ (CGPA: 3.89)","enrolled_students":3450,"partner_industries":86}');

-- Insert credentials
INSERT INTO portal_credentials (id, profile_id, profile_name, role, title, issuer, credential_type, issued_date, valid_until, verification_status, sha256_hash, verification_seal, file_url) VALUES ('cred-cs-01', 'stu-cs-101', 'Aditya Varma (IIT Delhi)', 'student', 'AWS Certified Solutions Architect – Professional', 'Amazon Web Services (AWS)', 'certificate', '2026-01-15', '2029-01-15', 'verified', '0xa3f9104c89db42e189ac01287e5b3901bcf45a1982703810ecdf283940182740', 'AWS-VERIFIED-SEAL-883921', 's3://portal-vault/credentials/cred-cs-01.pdf');
INSERT INTO portal_credentials (id, profile_id, profile_name, role, title, issuer, credential_type, issued_date, valid_until, verification_status, sha256_hash, verification_seal, file_url) VALUES ('cred-com-01', 'stu-com-201', 'Rhea Chawla (SRCC Delhi)', 'student', 'CFA Institute Investment Foundations® Certificate', 'CFA Institute (USA)', 'certificate', '2026-01-20', 'Lifetime', 'verified', '0x3910abef29384701bcdef8291029384701293847012938470129384701293847', 'CFA-VERIFIED-SEAL-102938', 's3://portal-vault/credentials/cred-com-01.pdf');
INSERT INTO portal_credentials (id, profile_id, profile_name, role, title, issuer, credential_type, issued_date, valid_until, verification_status, sha256_hash, verification_seal, file_url) VALUES ('cred-mech-01', 'stu-mech-301', 'Karan Singhania (BITS Pilani)', 'student', 'Certified SOLIDWORKS Professional (CSWP)', 'Dassault Systèmes (France)', 'certificate', '2025-12-05', 'Lifetime', 'verified', '0x1928374019283740192837401928374019283740192837401928374019283740', 'DASSAULT-CSWP-SEAL-710293', 's3://portal-vault/credentials/cred-mech-01.pdf');
INSERT INTO portal_credentials (id, profile_id, profile_name, role, title, issuer, credential_type, issued_date, valid_until, verification_status, sha256_hash, verification_seal, file_url) VALUES ('cred-hlth-01', 'stu-usr-001', 'Aarav Sharma (AIIA New Delhi)', 'student', 'Good Clinical Practice (GCP) for Clinical Trials Certification', 'CDSCO & NIDA Clinical Trials Network', 'certificate', '2025-08-14', '2028-08-14', 'verified', '0x9928102938475610293847561029384756102938475610293847561029384756', 'CDSCO-GCP-SEAL-810293', 's3://portal-vault/credentials/cred-01.pdf');
INSERT INTO portal_credentials (id, profile_id, profile_name, role, title, issuer, credential_type, issued_date, valid_until, verification_status, sha256_hash, verification_seal, file_url) VALUES ('cred-ind-01', 'ind-google-01', 'Google India R&D & DeepMind Labs', 'industry', 'Ministry of Corporate Affairs (MCA) Certificate of Incorporation', 'Registrar of Companies (RoC), Karnataka', 'license', '2004-03-24', 'Active (Perpetual)', 'verified', '0x4910293847561029384756102938475610293847561029384756102938475610', 'MCA-ROC-VERIFIED-U72900KA2004PTC033228', 's3://portal-vault/corporate/google_cin_cert.pdf');
INSERT INTO portal_credentials (id, profile_id, profile_name, role, title, issuer, credential_type, issued_date, valid_until, verification_status, sha256_hash, verification_seal, file_url) VALUES ('cred-ind-02', 'ind-goldman-02', 'Goldman Sachs Global Quantitative Solutions', 'industry', 'SEBI Registered Portfolio Manager & Global Financial Institution License', 'Securities and Exchange Board of India (SEBI)', 'license', '2006-08-18', '2030-12-31', 'verified', '0x5819203948571029384756102938475610293847561029384756102938475610', 'SEBI-FINTECH-SEAL-INM000012345', 's3://portal-vault/corporate/gs_sebi_license.pdf');
INSERT INTO portal_credentials (id, profile_id, profile_name, role, title, issuer, credential_type, issued_date, valid_until, verification_status, sha256_hash, verification_seal, file_url) VALUES ('cred-fac-01', 'usr-fac-01', 'Prof. Dr. Ananya Trivedi (AIIA)', 'academician', 'Extra-Mural Research Grant Sanction Order (₹34.50 Lakhs)', 'Ministry of Ayush Research Directorate', 'grant_sanction', '2024-04-12', '2027-03-31', 'verified', '0x7910293847561029384756102938475610293847561029384756102938475610', 'AYUSH-EMR-GRANT-SANCTION-2024-88', 's3://portal-vault/faculty/emr_grant_sanction.pdf');
INSERT INTO portal_credentials (id, profile_id, profile_name, role, title, issuer, credential_type, issued_date, valid_until, verification_status, sha256_hash, verification_seal, file_url) VALUES ('cred-adm-01', 'usr-admin-01', 'Consortium Directorate (IIT Delhi, SRCC, AIIA)', 'institution_admin', 'National Board of Accreditation (NAAC A++ Tier-1 Accreditation)', 'National Assessment and Accreditation Council (NAAC) & UGC', 'institutional_accreditation', '2023-07-01', '2028-06-30', 'verified', '0x9910293847561029384756102938475610293847561029384756102938475610', 'NAAC-A-PLUS-PLUS-SEAL-2023', 's3://portal-vault/admin/naac_accreditation.pdf');

-- Insert vacancies
INSERT INTO portal_vacancies (id, industry_id, company, title, type, discipline, mode, location, stipend_formatted, openings, status, required_skills) VALUES ('opp-cs-01', 'ind-google-01', 'Google India R&D & DeepMind Labs', 'Cloud & Deep Learning Research Intern', 'internship', 'engineering', 'hybrid', 'Bengaluru / Hyderabad', '₹85,000/mo', 4, 'open', '{"Python & PyTorch":90,"Distributed Cloud Systems (GCP)":85,"Data Structures & Algorithms":92}');
INSERT INTO portal_vacancies (id, industry_id, company, title, type, discipline, mode, location, stipend_formatted, openings, status, required_skills) VALUES ('opp-fin-01', 'ind-goldman-02', 'Goldman Sachs Global Quantitative Solutions', 'Quantitative FinTech Analyst & Valuation Intern', 'internship', 'commerce', 'hybrid', 'Bengaluru 560103', '₹75,000/mo', 3, 'open', '{"Financial Modeling & Valuation (DCF)":92,"Corporate Accounting & GST":88,"Business Analytics & PowerBI":85}');
INSERT INTO portal_vacancies (id, industry_id, company, title, type, discipline, mode, location, stipend_formatted, openings, status, required_skills) VALUES ('opp-mech-01', 'ind-tata-03', 'Tata Motors Electric Mobility & Passenger Vehicles', 'EV Mechatronics & Autonomous Robotics Engineer', 'job', 'engineering', 'onsite', 'Pune Research Centre', '₹14.5 LPA', 5, 'open', '{"CAD/CAM & Mechanical Mechatronics":90,"ROS2 Kinematics":88,"Thermal Battery Simulation":82}');
INSERT INTO portal_vacancies (id, industry_id, company, title, type, discipline, mode, location, stipend_formatted, openings, status, required_skills) VALUES ('opp-hlth-01', 'ind-himalaya-04', 'Himalaya Wellness Pure Therapeutics & R&D Directorate', 'Clinical Pharmacology & Phytomedicine Fellow', 'internship', 'healthcare', 'onsite', 'Makali, Bengaluru', '₹45,000/mo', 2, 'open', '{"Clinical Trials & GCP Protocols":85,"Ayurvedic Pharmacology":88,"Analytical Chemistry (HPLC)":80}');

-- Insert applications
INSERT INTO portal_applications (id, opportunity_id, student_id, student_name, company, match_score, status, history_logs) VALUES ('app-101', 'opp-cs-01', 'stu-cs-101', 'Aditya Varma', 'Google India R&D & DeepMind Labs', 95, 'shortlisted', '[{"step":"Applied","date":"2026-03-01"},{"step":"Profile Evaluated (95% Fit)","date":"2026-03-04"}]');
INSERT INTO portal_applications (id, opportunity_id, student_id, student_name, company, match_score, status, history_logs) VALUES ('app-102', 'opp-fin-01', 'stu-com-201', 'Rhea Chawla', 'Goldman Sachs Global Quantitative Solutions', 94, 'interview', '[{"step":"Applied","date":"2026-03-02"},{"step":"Interview Scheduled","date":"2026-03-06"}]');
INSERT INTO portal_applications (id, opportunity_id, student_id, student_name, company, match_score, status, history_logs) VALUES ('app-103', 'opp-mech-01', 'stu-mech-301', 'Karan Singhania', 'Tata Motors Electric Mobility', 92, 'offered', '[{"step":"Applied","date":"2026-02-28"},{"step":"Offer Letter Dispatched","date":"2026-03-08"}]');
INSERT INTO portal_applications (id, opportunity_id, student_id, student_name, company, match_score, status, history_logs) VALUES ('app-104', 'opp-hlth-01', 'stu-usr-001', 'Aarav Sharma', 'Himalaya Wellness R&D Directorate', 88, 'completed', '[{"step":"Applied","date":"2026-01-10"},{"step":"Internship Completed & Credential Issued","date":"2026-02-28"}]');
