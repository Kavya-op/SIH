import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if valid Supabase credentials are provided
const isConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl !== 'https://your-project.supabase.co' &&
  !supabaseUrl.includes('placeholder')
);

export const supabase = isConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export const isSupabaseConfigured = () => isConfigured;

const LOCAL_SESSION_KEY = 'portal_active_session';
const LOCAL_USERS_KEY = 'portal_registered_users';

const getLocalUsers = () => {
  try {
    const raw = localStorage.getItem(LOCAL_USERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
};

const saveLocalUsers = (users) => {
  try {
    localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(users));
  } catch (e) {
    console.error('Failed to persist local users', e);
  }
};

/**
 * Sign up a user with a mandatory role in Backend SQLite Database
 */
export async function signUpWithRole({ email, password, role, fullName, metadata = {} }) {
  const normalizedRole = (role || 'student').toLowerCase();
  const normalizedEmail = (email || '').trim().toLowerCase();

  // 1. Connect to Backend SQLite Database API
  try {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: normalizedEmail,
        password,
        fullName,
        role: normalizedRole,
        phone: metadata?.phone || null,
        metadata
      })
    });

    const data = await response.json();
    if (!response.ok || !data.success) {
      return { user: null, error: data.error || 'Registration failed' };
    }

    const user = data.user;
    localStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify(user));
    return { user, error: null, provider: 'backend-sqlite' };
  } catch (fetchErr) {
    console.warn('Backend SQLite API not reachable, using fallback:', fetchErr.message);
  }

  // 2. Supabase if configured
  if (isConfigured && supabase) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: normalizedEmail,
        password,
        options: {
          data: {
            full_name: fullName,
            role: normalizedRole,
            ...metadata
          }
        }
      });
      if (error) throw error;
      const user = {
        id: data.user?.id || `usr-${Date.now()}`,
        email: normalizedEmail,
        role: normalizedRole,
        fullName,
        metadata
      };
      localStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify(user));
      return { user, error: null, provider: 'supabase' };
    } catch (err) {
      return { user: null, error: err.message, provider: 'supabase' };
    }
  }

  // 3. Local fallback with strict duplicate email validation
  const existingUsers = getLocalUsers();
  const existing = existingUsers.find(u => u.email.toLowerCase() === normalizedEmail);
  if (existing) {
    return { user: null, error: 'An account with this email address already exists. Please log in.' };
  }

  const newUser = {
    id: `usr-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
    email: normalizedEmail,
    fullName: fullName || normalizedEmail.split('@')[0],
    role: normalizedRole,
    password,
    metadata,
    created_at: new Date().toISOString()
  };

  existingUsers.push(newUser);
  saveLocalUsers(existingUsers);
  localStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify(newUser));

  return { user: newUser, error: null, provider: 'local' };
}

/**
 * Sign in existing user with password against Backend SQLite Database
 */
export async function signInUser({ email, password }) {
  const normalizedEmail = (email || '').trim().toLowerCase();

  // 1. Authenticate against Backend SQLite Database API
  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: normalizedEmail,
        password
      })
    });

    const data = await response.json();
    if (!response.ok || !data.success) {
      return { user: null, error: data.error || 'Authentication failed' };
    }

    const user = data.user;
    localStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify(user));
    return { user, error: null, provider: 'backend-sqlite' };
  } catch (fetchErr) {
    console.warn('Backend SQLite API not reachable, checking fallback:', fetchErr.message);
  }

  // 2. Supabase if configured
  if (isConfigured && supabase) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: normalizedEmail,
        password
      });
      if (error) throw error;
      const userRole = data.user?.user_metadata?.role || 'student';
      const fullName = data.user?.user_metadata?.full_name || normalizedEmail.split('@')[0];
      const user = {
        id: data.user.id,
        email: data.user.email,
        role: userRole,
        fullName,
        metadata: data.user.user_metadata || {}
      };
      localStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify(user));
      return { user, error: null, provider: 'supabase' };
    } catch (err) {
      return { user: null, error: err.message, provider: 'supabase' };
    }
  }

  // 3. Local fallback with strict password and email check
  const existingUsers = getLocalUsers();
  const found = existingUsers.find(u => u.email.toLowerCase() === normalizedEmail);

  if (!found) {
    return { user: null, error: 'No account found with this email. Please create an account first.' };
  }

  if (found.password && found.password !== password) {
    return { user: null, error: 'Incorrect password entered. Please try again.' };
  }

  localStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify(found));
  return { user: found, error: null, provider: 'local' };
}

/**
 * Sign out current user
 */
export async function signOutUser() {
  if (isConfigured && supabase) {
    try {
      await supabase.auth.signOut();
    } catch (_) {}
  }
  try {
    localStorage.removeItem(LOCAL_SESSION_KEY);
    localStorage.removeItem('ayushsetu_active_session');
  } catch (_) {}
  return { success: true };
}

/**
 * Get active authenticated user session
 */
export function getSavedSession() {
  try {
    const raw = localStorage.getItem(LOCAL_SESSION_KEY) || localStorage.getItem('ayushsetu_active_session');
    return raw ? JSON.parse(raw) : null;
  } catch (_) {
    return null;
  }
}
