import { DatabaseSync } from 'node:sqlite';
import crypto from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_PATH = path.resolve(__dirname, '..', 'portal.sqlite');

let dbInstance = null;

export function getDatabase() {
  if (!dbInstance) {
    dbInstance = new DatabaseSync(DB_PATH);
    initAuthSchema(dbInstance);
  }
  return dbInstance;
}

export function hashPassword(password, salt) {
  return crypto.scryptSync(password, salt, 32).toString('hex');
}

export function generateSalt() {
  return crypto.randomBytes(16).toString('hex');
}

function initAuthSchema(db) {
  // Ensure users table exists
  db.exec(`
    CREATE TABLE IF NOT EXISTS portal_users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL COLLATE NOCASE,
      password_hash TEXT NOT NULL,
      salt TEXT NOT NULL,
      full_name TEXT NOT NULL,
      role TEXT NOT NULL,
      phone TEXT,
      metadata TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Seed default demo accounts if table is empty
  const countStmt = db.prepare('SELECT count(*) as count FROM portal_users');
  const count = countStmt.get().count;

  if (count === 0) {
    console.log('[Auth DB] Seeding default authenticated users into portal.sqlite...');
    const defaultUsers = [
      {
        email: 'alex.morgan@student.edu',
        password: 'Password123',
        fullName: 'Alex Morgan',
        role: 'student',
        phone: '+91 98765 01001',
        metadata: {
          degree: 'B.Tech Computer Science & Engineering',
          institution: 'Indian Institute of Technology (IIT) Delhi',
          year: 'Final Year (Graduation Batch 2026)'
        }
      },
      {
        email: 'student.demo@portal.local',
        password: 'Password123',
        fullName: 'Aditya Varma',
        role: 'student',
        phone: '+91 98100 22334',
        metadata: {
          degree: 'B.Tech in Computer Science & AI',
          institution: 'IIT Delhi',
          year: '4th Year'
        }
      },
      {
        email: 'sarah.jenkins@university.edu',
        password: 'Password123',
        fullName: 'Prof. Dr. Sarah Jenkins',
        role: 'academia',
        phone: '+91 98765 02002',
        metadata: {
          specialization: 'Artificial Intelligence & Machine Learning',
          institution: 'IIT Delhi & Consortia',
          designation: 'Professor & Dean of Research'
        }
      },
      {
        email: 'faculty.demo@portal.local',
        password: 'Password123',
        fullName: 'Prof. Dr. Ananya Trivedi',
        role: 'academia',
        phone: '+91 98111 55667',
        metadata: {
          specialization: 'Computational Biology & Clinical Pharmacology',
          institution: 'AIIA New Delhi & IIT Delhi',
          designation: 'Principal Investigator'
        }
      },
      {
        email: 'dean@institute.edu',
        password: 'Password123',
        fullName: 'Dean Robert Taylor',
        role: 'institution',
        phone: '+91 98765 03003',
        metadata: {
          aishe_code: 'AISHE-U-1029',
          type: 'Autonomous Research University',
          institution: 'Apex Consortium Directorate'
        }
      },
      {
        email: 'institution.demo@portal.local',
        password: 'Password123',
        fullName: 'Dr. K. S. Radhakrishnan',
        role: 'institution',
        phone: '+91 98222 66778',
        metadata: {
          aishe_code: 'AISHE-U-1029',
          type: 'Tier-1 NAAC A++ Institution',
          institution: 'Apex Consortium Directorate'
        }
      },
      {
        email: 'talent@industrylabs.com',
        password: 'Password123',
        fullName: 'David Chen',
        role: 'industry',
        phone: '+91 98765 04004',
        metadata: {
          company_name: 'Google India R&D & DeepMind Labs',
          cin: 'U72900KA2004PTC033228'
        }
      },
      {
        email: 'industry.demo@portal.local',
        password: 'Password123',
        fullName: 'Rohit Mehra',
        role: 'industry',
        phone: '+91 80 4127 1000',
        metadata: {
          company_name: 'Goldman Sachs Global Quantitative Solutions',
          cin: 'U74140KA2006FTC039981'
        }
      }
    ];

    const insertStmt = db.prepare(`
      INSERT INTO portal_users (id, email, password_hash, salt, full_name, role, phone, metadata)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    for (const u of defaultUsers) {
      const salt = generateSalt();
      const hash = hashPassword(u.password, salt);
      const id = `usr-${Date.now().toString().slice(-6)}-${Math.random().toString(36).substr(2, 4)}`;
      insertStmt.run(id, u.email.toLowerCase(), hash, salt, u.fullName, u.role, u.phone, JSON.stringify(u.metadata));
    }
    console.log(`[Auth DB] Seeded ${defaultUsers.length} default user accounts.`);
  }
}

/**
 * Register a new user into portal_users in SQLite
 */
export function registerUserInDb({ email, password, fullName, role, phone, metadata = {} }) {
  const db = getDatabase();
  const normalizedEmail = (email || '').trim().toLowerCase();

  if (!normalizedEmail || !password) {
    throw new Error('Email and password are required.');
  }

  // Check existing
  const existingStmt = db.prepare('SELECT id, email FROM portal_users WHERE email = ?');
  const existing = existingStmt.get(normalizedEmail);

  if (existing) {
    throw new Error('An account with this email address already exists. Please log in.');
  }

  const salt = generateSalt();
  const passwordHash = hashPassword(password, salt);
  const userId = `usr-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
  const normalizedRole = (role || 'student').toLowerCase();

  const insertStmt = db.prepare(`
    INSERT INTO portal_users (id, email, password_hash, salt, full_name, role, phone, metadata)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertStmt.run(
    userId,
    normalizedEmail,
    passwordHash,
    salt,
    fullName || normalizedEmail.split('@')[0],
    normalizedRole,
    phone || null,
    JSON.stringify(metadata)
  );

  // Also add to portal_profiles if relevant
  try {
    const profileInsertStmt = db.prepare(`
      INSERT OR REPLACE INTO portal_profiles (id, role, profile_type, name, email, phone, verification_status, profile_metadata)
      VALUES (?, ?, ?, ?, ?, ?, 'verified', ?)
    `);
    profileInsertStmt.run(
      userId,
      normalizedRole,
      normalizedRole === 'student' ? 'Student Scholar' :
      normalizedRole === 'industry' ? 'Corporate Industry Partner' :
      normalizedRole === 'academia' ? 'Faculty Researcher' : 'Institution Administrator',
      fullName || normalizedEmail.split('@')[0],
      normalizedEmail,
      phone || null,
      JSON.stringify(metadata)
    );
  } catch (profErr) {
    console.warn('[Auth DB] Optional profile sync note:', profErr.message);
  }

  return {
    id: userId,
    email: normalizedEmail,
    fullName: fullName || normalizedEmail.split('@')[0],
    role: normalizedRole,
    phone: phone || null,
    metadata
  };
}

/**
 * Authenticate user with email and password from SQLite
 */
export function authenticateUserInDb({ email, password }) {
  const db = getDatabase();
  const normalizedEmail = (email || '').trim().toLowerCase();

  if (!normalizedEmail || !password) {
    throw new Error('Email and password are required.');
  }

  const userStmt = db.prepare(`
    SELECT id, email, password_hash, salt, full_name, role, phone, metadata
    FROM portal_users
    WHERE email = ?
  `);

  const user = userStmt.get(normalizedEmail);

  if (!user) {
    throw new Error('No account found with this email. Please create an account first.');
  }

  // Verify password hash
  const computedHash = hashPassword(password, user.salt);
  if (computedHash !== user.password_hash) {
    throw new Error('Incorrect password entered. Please try again.');
  }

  let parsedMetadata = {};
  try {
    parsedMetadata = user.metadata ? JSON.parse(user.metadata) : {};
  } catch (_) {}

  return {
    id: user.id,
    email: user.email,
    fullName: user.full_name,
    role: user.role,
    phone: user.phone,
    metadata: parsedMetadata
  };
}

/**
 * Get all registered users (excluding sensitive password hash and salt)
 */
export function getAllRegisteredUsers() {
  const db = getDatabase();
  const stmt = db.prepare(`
    SELECT id, email, full_name, role, phone, metadata, created_at
    FROM portal_users
    ORDER BY created_at DESC
  `);
  const rows = stmt.all();
  return rows.map(r => {
    let meta = {};
    try { meta = r.metadata ? JSON.parse(r.metadata) : {}; } catch (_) {}
    return {
      id: r.id,
      email: r.email,
      fullName: r.full_name,
      role: r.role,
      phone: r.phone,
      metadata: meta,
      createdAt: r.created_at
    };
  });
}
