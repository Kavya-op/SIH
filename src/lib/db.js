/**
 * Database Engine for Academia–Industry Portal
 * Supports persistent records, data, and verifiable credentials for all 4 profiles:
 * 1. Student Profiles (Engineering, Commerce, Mechanical, Healthcare)
 * 2. Industry Corporate Profiles (Google India, Goldman Sachs, Tata Motors, Himalaya Wellness)
 * 3. Academician / Faculty Profiles (Prof. Dr. Ananya Trivedi, Co-investigators)
 * 4. Institution Admin Profiles (Apex Consortium Directorate, IIT Delhi, SRCC, AIIA)
 */

import {
  STUDENT_PERSONAS,
  INDUSTRIES,
  INSTITUTIONS,
  INITIAL_OPPORTUNITIES,
  INITIAL_APPLICATIONS,
  INITIAL_COLLABORATIONS,
  INITIAL_AUDIT_LOGS,
  INSTITUTION_ANALYTICS,
  DISCIPLINES
} from '../data/mockData';

const DB_STORAGE_KEY = 'portal_database_v1';

// Cryptographic hash simulation for credentials (SHA-256 like hex format)
export function generateSHA256Hash(seed) {
  let hash = 0x811c9dc5;
  const str = `${seed}-${Date.now()}-portal-secure-vault-2026`;
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
  }
  const hex = (hash >>> 0).toString(16).padStart(8, '0');
  return `0x${hex}${hex.split('').reverse().join('')}e4b7890a5d21c3fa4710`;
}

// Initial Seed Data for all 4 profiles and their credentials
export function getInitialDatabaseSeed() {
  // 1. STUDENT PROFILES
  const students = Object.values(STUDENT_PERSONAS).map(p => ({
    ...p,
    role: 'student',
    profile_type: 'Student Scholar',
    updated_at: new Date().toISOString()
  }));

  // 2. INDUSTRY PROFILES
  const industryProfiles = INDUSTRIES.map(ind => ({
    id: ind.id,
    role: 'industry',
    profile_type: 'Corporate Industry Partner',
    name: ind.name,
    industry_sector: ind.industry_sector,
    discipline: ind.discipline,
    cin: ind.cin,
    gstin: ind.gstin,
    website: ind.website,
    address: ind.address,
    verification_status: ind.verification_status || 'verified',
    logo: ind.logo,
    lead_contact: {
      name: ind.name.includes('Google') ? 'Aditi Nair' :
            ind.name.includes('Goldman') ? 'Rohit Mehra' :
            ind.name.includes('Tata') ? 'Vikram Sawant' : 'Dr. Ramesh Kulkarni',
      designation: 'Head of Talent Acquisition & Campus Partnerships',
      email: `recruiter@${ind.website.replace('https://', '').replace('/', '')}`,
      phone: '+91 80 6754 1100'
    },
    accreditation: 'Active & Verified Corporate Partner (Valid till 2029)',
    active_mous: [
      { institution: 'Indian Institute of Technology (IIT) Delhi', scope: 'Joint Cloud AI & Edge Systems CoE', validity: '2024–2029' },
      { institution: 'Shri Ram College of Commerce (SRCC)', scope: 'FinTech & Quantitative Risk Sandbox', validity: '2024–2028' },
      { institution: 'All India Institute of Ayurveda (AIIA)', scope: 'Clinical Trials & Pharmacovigilance', validity: '2024–2029' }
    ],
    updated_at: new Date().toISOString()
  }));

  // 3. ACADEMICIAN / FACULTY PROFILES
  const facultyProfiles = [
    {
      id: 'usr-fac-01',
      role: 'academician',
      profile_type: 'Academician / Faculty Lead',
      name: 'Prof. Dr. Ananya Trivedi',
      title: 'Prof. Dr. Ananya Trivedi, PhD',
      institution: 'All India Institute of Ayurveda (AIIA) & IIT Collaborator',
      institution_id: 'inst-aiia-04',
      department: 'Department of Clinical Pharmacology & Computational Biology',
      designation: 'Professor & Head of Department',
      orcid_id: '0000-0002-1825-009X',
      scopus_id: '57201948200',
      citations_count: 1420,
      h_index: 18,
      publications_count: 42,
      patents_count: 3,
      is_mentor_listed: true,
      mentor_specialization: 'Multidisciplinary Academic-Industry Mentorship',
      email: 'dr.ananya.trivedi@aiia.gov.in',
      phone: '+91 11 2695 0401',
      bio: 'Distinguished researcher bridging computational algorithms, reverse pharmacology, and clinical GCP trials. Directing sponsored research labs funded by DST and Ministry of Ayush.',
      updated_at: new Date().toISOString()
    },
    {
      id: 'usr-fac-02',
      role: 'academician',
      profile_type: 'Academician / Faculty Lead',
      name: 'Prof. V. Ramgopal Rao',
      title: 'Prof. V. Ramgopal Rao, PhD (IEEE Fellow)',
      institution: 'Indian Institute of Technology (IIT) Delhi',
      institution_id: 'inst-iitd-01',
      department: 'Department of Electrical Engineering & Nano-Scale Systems',
      designation: 'Professor & Former Director, IIT Delhi',
      orcid_id: '0000-0001-5234-8891',
      scopus_id: '56123490100',
      citations_count: 8900,
      h_index: 48,
      publications_count: 180,
      patents_count: 22,
      is_mentor_listed: true,
      mentor_specialization: 'Edge-AI Swarms, Nanoelectronics & Sensor Fusion',
      email: 'rrao@ee.iitd.ac.in',
      phone: '+91 11 2659 1000',
      bio: 'Leading joint academia-industry research in autonomous UAV swarms, edge machine learning, and semiconductor sensor systems.',
      updated_at: new Date().toISOString()
    }
  ];

  // 4. INSTITUTION ADMIN PROFILES
  const adminProfiles = [
    {
      id: 'usr-admin-01',
      role: 'institution_admin',
      profile_type: 'Apex Directorate Admin',
      name: 'Consortium Placement & Accreditation Directorate',
      lead_admin: 'Prof. Dr. Tanuja Nesari / Prof. Rangan Banerjee',
      institution: 'Apex Consortium: IIT Delhi, SRCC, BITS Pilani & Central Universities',
      institution_id: 'inst-consortium-01',
      designation: 'Director General & Chairperson, Apex Academic Consortium',
      nirf_rank: 'Rank #1 (Engineering, Commerce & Integrative Medicine Apex Cluster)',
      naac_grade: 'A++ (CGPA: 3.89 / 4.00)',
      aishe_code: 'U-0105 / INI-2026',
      official_email: 'directorate@consortium.gov.in',
      domain: 'gov.in / ac.in',
      phone: '+91 11 2301 5500',
      registered_students: 3450,
      verified_faculty: 184,
      partner_industries: 86,
      readiness_index: 91.2,
      updated_at: new Date().toISOString()
    }
  ];

  // ALL VERIFIABLE DIGITAL CREDENTIALS (across all 4 profiles)
  const credentials = [
    // Student Credentials (Aditya Varma - CS)
    {
      id: 'cred-cs-01',
      profileId: 'stu-cs-101',
      profileName: 'Aditya Varma (IIT Delhi)',
      role: 'student',
      title: 'AWS Certified Solutions Architect – Professional',
      issuer: 'Amazon Web Services (AWS)',
      type: 'certificate',
      issued_date: '2026-01-15',
      valid_until: '2029-01-15',
      verification_status: 'verified',
      sha256_hash: '0xa3f9104c89db42e189ac01287e5b3901bcf45a1982703810ecdf283940182740',
      verification_seal: 'AWS-VERIFIED-SEAL-883921',
      file_url: 's3://portal-vault/credentials/cred-cs-01.pdf'
    },
    {
      id: 'cred-cs-02',
      profileId: 'stu-cs-101',
      profileName: 'Aditya Varma (IIT Delhi)',
      role: 'student',
      title: 'TensorFlow Developer Certificate (Deep Learning)',
      issuer: 'Google Developers Certification Authority',
      type: 'certificate',
      issued_date: '2025-10-10',
      valid_until: '2028-10-10',
      verification_status: 'verified',
      sha256_hash: '0x81920acde5421098efab40192837482910abcef1928304918237401928374019',
      verification_seal: 'GOOGLE-DEV-SEAL-491028',
      file_url: 's3://portal-vault/credentials/cred-cs-02.pdf'
    },

    // Student Credentials (Rhea Chawla - Commerce)
    {
      id: 'cred-com-01',
      profileId: 'stu-com-201',
      profileName: 'Rhea Chawla (SRCC Delhi)',
      role: 'student',
      title: 'CFA Institute Investment Foundations® Certificate',
      issuer: 'CFA Institute (USA)',
      type: 'certificate',
      issued_date: '2026-01-20',
      valid_until: 'Lifetime',
      verification_status: 'verified',
      sha256_hash: '0x3910abef29384701bcdef8291029384701293847012938470129384701293847',
      verification_seal: 'CFA-VERIFIED-SEAL-102938',
      file_url: 's3://portal-vault/credentials/cred-com-01.pdf'
    },
    {
      id: 'cred-com-02',
      profileId: 'stu-com-201',
      profileName: 'Rhea Chawla (SRCC Delhi)',
      role: 'student',
      title: 'Financial Modeling & Valuation Analyst (FMVA®)',
      issuer: 'Corporate Finance Institute (CFI)',
      type: 'certificate',
      issued_date: '2025-11-15',
      valid_until: 'Lifetime',
      verification_status: 'verified',
      sha256_hash: '0x7102938401928374019283740192837401928374019283740192837401928374',
      verification_seal: 'CFI-FMVA-SEAL-591820',
      file_url: 's3://portal-vault/credentials/cred-com-02.pdf'
    },

    // Student Credentials (Karan Singhania - Mech & Robotics)
    {
      id: 'cred-mech-01',
      profileId: 'stu-mech-301',
      profileName: 'Karan Singhania (BITS Pilani)',
      role: 'student',
      title: 'Certified SOLIDWORKS Professional (CSWP)',
      issuer: 'Dassault Systèmes (France)',
      type: 'certificate',
      issued_date: '2025-12-05',
      valid_until: 'Lifetime',
      verification_status: 'verified',
      sha256_hash: '0x1928374019283740192837401928374019283740192837401928374019283740',
      verification_seal: 'DASSAULT-CSWP-SEAL-710293',
      file_url: 's3://portal-vault/credentials/cred-mech-01.pdf'
    },

    // Student Credentials (Aarav Sharma - Healthcare)
    {
      id: 'cred-hlth-01',
      profileId: 'stu-usr-001',
      profileName: 'Aarav Sharma (AIIA New Delhi)',
      role: 'student',
      title: 'Good Clinical Practice (GCP) for Clinical Trials Certification',
      issuer: 'CDSCO & NIDA Clinical Trials Network',
      type: 'certificate',
      issued_date: '2025-08-14',
      valid_until: '2028-08-14',
      verification_status: 'verified',
      sha256_hash: '0x9928102938475610293847561029384756102938475610293847561029384756',
      verification_seal: 'CDSCO-GCP-SEAL-810293',
      file_url: 's3://portal-vault/credentials/cred-01.pdf'
    },

    // Industry Corporate Credentials
    {
      id: 'cred-ind-01',
      profileId: 'ind-google-01',
      profileName: 'Google India R&D & DeepMind Labs',
      role: 'industry',
      title: 'Ministry of Corporate Affairs (MCA) Certificate of Incorporation',
      issuer: 'Registrar of Companies (RoC), Karnataka',
      type: 'license',
      issued_date: '2004-03-24',
      valid_until: 'Active (Perpetual)',
      verification_status: 'verified',
      sha256_hash: '0x4910293847561029384756102938475610293847561029384756102938475610',
      verification_seal: 'MCA-ROC-VERIFIED-U72900KA2004PTC033228',
      file_url: 's3://portal-vault/corporate/google_cin_cert.pdf'
    },
    {
      id: 'cred-ind-02',
      profileId: 'ind-goldman-02',
      profileName: 'Goldman Sachs Global Quantitative Solutions',
      role: 'industry',
      title: 'SEBI Registered Portfolio Manager & Global Financial Institution License',
      issuer: 'Securities and Exchange Board of India (SEBI)',
      type: 'license',
      issued_date: '2006-08-18',
      valid_until: '2030-12-31',
      verification_status: 'verified',
      sha256_hash: '0x5819203948571029384756102938475610293847561029384756102938475610',
      verification_seal: 'SEBI-FINTECH-SEAL-INM000012345',
      file_url: 's3://portal-vault/corporate/gs_sebi_license.pdf'
    },
    {
      id: 'cred-ind-03',
      profileId: 'ind-himalaya-05',
      profileName: 'Himalaya Wellness Company',
      role: 'industry',
      title: 'AYUSH GMP Quality Certification & WHO-COPP License',
      issuer: 'Ministry of Ayush & CDSCO Directorate',
      type: 'license',
      issued_date: '2024-05-10',
      valid_until: '2029-05-10',
      verification_status: 'verified',
      sha256_hash: '0x6910293847561029384756102938475610293847561029384756102938475610',
      verification_seal: 'AYUSH-GMP-SEAL-2024-HM981',
      file_url: 's3://portal-vault/corporate/himalaya_gmp_cert.pdf'
    },

    // Academician / Faculty Credentials
    {
      id: 'cred-fac-01',
      profileId: 'usr-fac-01',
      profileName: 'Prof. Dr. Ananya Trivedi (AIIA)',
      role: 'academician',
      title: 'Extra-Mural Research Grant Sanction Order (₹34.50 Lakhs)',
      issuer: 'Ministry of Ayush Research Directorate',
      type: 'grant_sanction',
      issued_date: '2024-04-12',
      valid_until: '2027-03-31',
      verification_status: 'verified',
      sha256_hash: '0x7910293847561029384756102938475610293847561029384756102938475610',
      verification_seal: 'AYUSH-EMR-GRANT-SANCTION-2024-88',
      file_url: 's3://portal-vault/faculty/emr_grant_sanction.pdf'
    },
    {
      id: 'cred-fac-02',
      profileId: 'usr-fac-01',
      profileName: 'Prof. Dr. Ananya Trivedi (AIIA)',
      role: 'academician',
      title: 'National Ayush Industrial Mentor Directory Accreditation',
      issuer: 'National Medicinal Plants Board (NMPB) & AIIA Directorate',
      type: 'accreditation',
      issued_date: '2025-01-10',
      valid_until: '2030-01-10',
      verification_status: 'verified',
      sha256_hash: '0x8910293847561029384756102938475610293847561029384756102938475610',
      verification_seal: 'NATIONAL-MENTOR-SEAL-AIIA-2025',
      file_url: 's3://portal-vault/faculty/mentor_accreditation.pdf'
    },

    // Institution Admin Credentials
    {
      id: 'cred-adm-01',
      profileId: 'usr-admin-01',
      profileName: 'Consortium Directorate (IIT Delhi, SRCC, AIIA)',
      role: 'institution_admin',
      title: 'National Board of Accreditation (NBA / NAAC A++ Tier-1 Accreditation)',
      issuer: 'National Assessment and Accreditation Council (NAAC) & UGC',
      type: 'institutional_accreditation',
      issued_date: '2023-07-01',
      valid_until: '2028-06-30',
      verification_status: 'verified',
      sha256_hash: '0x9910293847561029384756102938475610293847561029384756102938475610',
      verification_seal: 'NAAC-A-PLUS-PLUS-SEAL-2023',
      file_url: 's3://portal-vault/admin/naac_accreditation.pdf'
    },
    {
      id: 'cred-adm-02',
      profileId: 'usr-admin-01',
      profileName: 'Consortium Directorate (IIT Delhi, SRCC, AIIA)',
      role: 'institution_admin',
      title: 'ISO 9001:2015 Educational Quality & Academic Placement Audit Certificate',
      issuer: 'Bureau Veritas & International Organization for Standardization (ISO)',
      type: 'quality_certification',
      issued_date: '2024-02-15',
      valid_until: '2027-02-14',
      verification_status: 'verified',
      sha256_hash: '0xaa10293847561029384756102938475610293847561029384756102938475610',
      verification_seal: 'ISO-9001-2015-CERT-BV-98210',
      file_url: 's3://portal-vault/admin/iso_9001_audit.pdf'
    }
  ];

  return {
    metadata: {
      version: '1.0.0',
      name: 'Academia-Industry Collaboration Portal Database',
      problemStatementId: '26044',
      generated_at: new Date().toISOString()
    },
    profiles: {
      students,
      industry: industryProfiles,
      faculty: facultyProfiles,
      admin: adminProfiles
    },
    credentials,
    institutions: INSTITUTIONS,
    vacancies: INITIAL_OPPORTUNITIES,
    applications: INITIAL_APPLICATIONS,
    collaborations: INITIAL_COLLABORATIONS,
    audit_logs: INITIAL_AUDIT_LOGS,
    analytics: INSTITUTION_ANALYTICS,
    disciplines: DISCIPLINES
  };
}

class PortalDatabase {
  constructor() {
    this.memoryDb = null;
    this.init();
  }

  init() {
    try {
      const stored = localStorage.getItem(DB_STORAGE_KEY);
      if (stored) {
        this.memoryDb = JSON.parse(stored);
      } else {
        this.memoryDb = getInitialDatabaseSeed();
        this.persist();
      }
    } catch (e) {
      console.warn('LocalStorage unavailable, initializing in-memory database:', e);
      this.memoryDb = getInitialDatabaseSeed();
    }
  }

  persist() {
    try {
      localStorage.setItem(DB_STORAGE_KEY, JSON.stringify(this.memoryDb));
    } catch (e) {
      console.error('Failed to persist database state to localStorage:', e);
    }
  }

  // --- PROFILES API ---
  getProfiles(role = null) {
    if (!this.memoryDb) this.init();
    const { students = [], industry = [], faculty = [], admin = [] } = this.memoryDb.profiles || {};
    if (role === 'student') return students;
    if (role === 'industry') return industry;
    if (role === 'academician' || role === 'faculty') return faculty;
    if (role === 'institution' || role === 'institution_admin' || role === 'admin') return admin;
    return { students, industry, faculty, admin };
  }

  getProfileById(id) {
    const all = this.getProfiles();
    return (
      all.students.find(s => s.id === id) ||
      all.industry.find(i => i.id === id) ||
      all.faculty.find(f => f.id === id) ||
      all.admin.find(a => a.id === id) ||
      null
    );
  }

  saveProfile(profile) {
    if (!profile || !profile.role) return false;
    const role = profile.role === 'faculty' ? 'faculty' :
                 profile.role === 'institution' ? 'admin' :
                 profile.role;

    const list = this.memoryDb.profiles[role] || [];
    const index = list.findIndex(p => p.id === profile.id);
    if (index >= 0) {
      list[index] = { ...list[index], ...profile, updated_at: new Date().toISOString() };
    } else {
      list.push({ ...profile, updated_at: new Date().toISOString() });
    }
    this.memoryDb.profiles[role] = list;
    this.persist();
    return true;
  }

  // --- CREDENTIALS API ---
  getCredentials(profileId = null, role = null) {
    if (!this.memoryDb) this.init();
    let list = this.memoryDb.credentials || [];
    if (profileId) {
      list = list.filter(c => c.profileId === profileId);
    }
    if (role) {
      list = list.filter(c => c.role === role);
    }
    return list;
  }

  saveCredential(cred) {
    if (!cred.id) {
      cred.id = `cred-${Date.now()}`;
    }
    if (!cred.sha256_hash) {
      cred.sha256_hash = generateSHA256Hash(cred.title || cred.id);
    }
    const list = this.memoryDb.credentials || [];
    const idx = list.findIndex(c => c.id === cred.id);
    if (idx >= 0) {
      list[idx] = { ...list[idx], ...cred };
    } else {
      list.unshift(cred);
    }
    this.memoryDb.credentials = list;
    this.persist();
    return cred;
  }

  verifyCredential(credentialId) {
    const cred = (this.memoryDb.credentials || []).find(c => c.id === credentialId);
    if (!cred) return { valid: false, error: 'Credential record not found in database.' };

    const hasValidHash = cred.sha256_hash && cred.sha256_hash.startsWith('0x') && cred.sha256_hash.length >= 20;
    return {
      valid: hasValidHash && cred.verification_status === 'verified',
      credentialId: cred.id,
      title: cred.title,
      issuer: cred.issuer,
      sha256_hash: cred.sha256_hash,
      verification_seal: cred.verification_seal,
      verified_at: new Date().toISOString()
    };
  }

  // --- VACANCIES & APPLICATIONS API ---
  getVacancies() {
    return this.memoryDb.vacancies || [];
  }

  saveVacancy(vacancy) {
    const list = this.memoryDb.vacancies || [];
    const idx = list.findIndex(v => v.id === vacancy.id);
    if (idx >= 0) {
      list[idx] = { ...list[idx], ...vacancy };
    } else {
      list.unshift(vacancy);
    }
    this.memoryDb.vacancies = list;
    this.persist();
    return vacancy;
  }

  getApplications() {
    return this.memoryDb.applications || [];
  }

  saveApplication(app) {
    const list = this.memoryDb.applications || [];
    const idx = list.findIndex(a => a.id === app.id);
    if (idx >= 0) {
      list[idx] = { ...list[idx], ...app };
    } else {
      list.unshift(app);
    }
    this.memoryDb.applications = list;
    this.persist();
    return app;
  }

  // --- EXPORT & RESET API ---
  exportDatabase(format = 'json') {
    if (!this.memoryDb) this.init();

    if (format === 'json') {
      return JSON.stringify(this.memoryDb, null, 2);
    }

    if (format === 'sql') {
      return this.generateSQLDump();
    }

    return null;
  }

  generateSQLDump() {
    const { profiles, credentials, vacancies } = this.memoryDb;
    let sql = `-- =====================================================================\n`;
    sql += `-- PORTAL DATABASE SQL EXPORT (PostgreSQL & SQLite Compatible)\n`;
    sql += `-- Generated: ${new Date().toISOString()}\n`;
    sql += `-- SIH Problem Statement ID: 26044 | Academia–Industry Collaboration\n`;
    sql += `-- =====================================================================\n\n`;

    // 1. PROFILES TABLE
    sql += `-- 1. USER PROFILES (All 4 Profiles)\n`;
    sql += `CREATE TABLE IF NOT EXISTS portal_profiles (\n`;
    sql += `  id VARCHAR(64) PRIMARY KEY,\n`;
    sql += `  role VARCHAR(32) NOT NULL,\n`;
    sql += `  name VARCHAR(255) NOT NULL,\n`;
    sql += `  institution_or_company VARCHAR(255),\n`;
    sql += `  discipline VARCHAR(64),\n`;
    sql += `  profile_data JSON,\n`;
    sql += `  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP\n`;
    sql += `);\n\n`;

    const allProfiles = [
      ...profiles.students.map(s => ({ id: s.id, role: 'student', name: s.name, org: s.institution, disc: s.discipline, raw: s })),
      ...profiles.industry.map(i => ({ id: i.id, role: 'industry', name: i.name, org: i.name, disc: i.discipline, raw: i })),
      ...profiles.faculty.map(f => ({ id: f.id, role: 'academician', name: f.name, org: f.institution, disc: 'all', raw: f })),
      ...profiles.admin.map(a => ({ id: a.id, role: 'institution_admin', name: a.name, org: a.institution, disc: 'all', raw: a }))
    ];

    for (const p of allProfiles) {
      const escapedData = JSON.stringify(p.raw).replace(/'/g, "''");
      const escapedName = p.name.replace(/'/g, "''");
      const escapedOrg = (p.org || '').replace(/'/g, "''");
      sql += `INSERT INTO portal_profiles (id, role, name, institution_or_company, discipline, profile_data)\n`;
      sql += `VALUES ('${p.id}', '${p.role}', '${escapedName}', '${escapedOrg}', '${p.disc || 'general'}', '${escapedData}');\n`;
    }

    // 2. CREDENTIALS TABLE
    sql += `\n-- 2. VERIFIABLE DIGITAL CREDENTIALS VAULT\n`;
    sql += `CREATE TABLE IF NOT EXISTS portal_credentials (\n`;
    sql += `  id VARCHAR(64) PRIMARY KEY,\n`;
    sql += `  profile_id VARCHAR(64) NOT NULL,\n`;
    sql += `  role VARCHAR(32) NOT NULL,\n`;
    sql += `  title VARCHAR(255) NOT NULL,\n`;
    sql += `  issuer VARCHAR(255) NOT NULL,\n`;
    sql += `  sha256_hash VARCHAR(128) NOT NULL,\n`;
    sql += `  verification_status VARCHAR(32) NOT NULL,\n`;
    sql += `  issued_date VARCHAR(32),\n`;
    sql += `  verification_seal VARCHAR(128)\n`;
    sql += `);\n\n`;

    for (const c of credentials) {
      const escapedTitle = c.title.replace(/'/g, "''");
      const escapedIssuer = c.issuer.replace(/'/g, "''");
      sql += `INSERT INTO portal_credentials (id, profile_id, role, title, issuer, sha256_hash, verification_status, issued_date, verification_seal)\n`;
      sql += `VALUES ('${c.id}', '${c.profileId}', '${c.role}', '${escapedTitle}', '${escapedIssuer}', '${c.sha256_hash}', '${c.verification_status}', '${c.issued_date}', '${c.verification_seal || ''}');\n`;
    }

    // 3. OPPORTUNITIES & VACANCIES
    sql += `\n-- 3. VACANCIES & OPPORTUNITIES\n`;
    sql += `CREATE TABLE IF NOT EXISTS portal_vacancies (\n`;
    sql += `  id VARCHAR(64) PRIMARY KEY,\n`;
    sql += `  title VARCHAR(255) NOT NULL,\n`;
    sql += `  company VARCHAR(255) NOT NULL,\n`;
    sql += `  type VARCHAR(32) NOT NULL,\n`;
    sql += `  discipline VARCHAR(64),\n`;
    sql += `  stipend VARCHAR(64),\n`;
    sql += `  status VARCHAR(32) DEFAULT 'open'\n`;
    sql += `);\n\n`;

    for (const v of vacancies) {
      const escapedTitle = v.title.replace(/'/g, "''");
      const escapedComp = v.company.replace(/'/g, "''");
      sql += `INSERT INTO portal_vacancies (id, title, company, type, discipline, stipend, status)\n`;
      sql += `VALUES ('${v.id}', '${escapedTitle}', '${escapedComp}', '${v.type}', '${v.discipline || 'all'}', '${v.stipend_formatted || 'Undisclosed'}', '${v.status || 'open'}');\n`;
    }

    return sql;
  }

  resetToSeed() {
    this.memoryDb = getInitialDatabaseSeed();
    this.persist();
    return this.memoryDb;
  }
}

export const db = new PortalDatabase();
export default db;
