import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

/**
 * Mock authentication (no backend in this build).
 *
 * Uses the exact same localStorage keys as the original site
 * (bridge_logged_in, bridge_user_name / _email / _college, bridge_users),
 * so existing accounts keep working after the React migration.
 *
 * Passwords are compared in plain text, which is fine for a class prototype
 * and must never be done in a real product.
 */
const AuthContext = createContext(null);

const KEYS = {
  loggedIn: 'bridge_logged_in',
  name: 'bridge_user_name',
  email: 'bridge_user_email',
  college: 'bridge_user_college',
  users: 'bridge_users',
};

function readSession() {
  return {
    isLoggedIn: localStorage.getItem(KEYS.loggedIn) === 'true',
    name: localStorage.getItem(KEYS.name) || '',
    email: localStorage.getItem(KEYS.email) || '',
    college: localStorage.getItem(KEYS.college) || '',
  };
}

function getUsers() {
  try {
    return JSON.parse(localStorage.getItem(KEYS.users) || '[]');
  } catch {
    return [];
  }
}

function saveUsers(users) {
  localStorage.setItem(KEYS.users, JSON.stringify(users));
}

function writeSession(user) {
  localStorage.setItem(KEYS.loggedIn, 'true');
  localStorage.setItem(KEYS.name, user.name);
  localStorage.setItem(KEYS.email, user.email);
  localStorage.setItem(KEYS.college, user.college || 'Main Campus');
}

function clearSession() {
  [KEYS.loggedIn, KEYS.name, KEYS.email, KEYS.college].forEach((key) => localStorage.removeItem(key));
}

export function getInitials(fullName) {
  const parts = (fullName || 'Student').trim().split(/\s+/);
  let initials = parts[0].charAt(0);
  if (parts.length > 1) initials += parts[parts.length - 1].charAt(0);
  return initials.toUpperCase();
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(readSession);

  // Keep several open tabs in sync (login / logout in one reflects in the others).
  useEffect(() => {
    const onStorage = (event) => {
      if (event.key && Object.values(KEYS).includes(event.key)) setSession(readSession());
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const startSession = useCallback((user) => {
    writeSession(user);
    setSession(readSession());
  }, []);

  /** Returns { ok: true, user } or { ok: false, reason: 'not_found' | 'wrong_password' }. */
  const login = useCallback(
    ({ email, password }) => {
      const normalised = email.trim().toLowerCase();
      const match = getUsers().find((u) => u.email.toLowerCase() === normalised);
      if (!match) return { ok: false, reason: 'not_found' };
      if (match.password !== password) return { ok: false, reason: 'wrong_password' };
      startSession(match);
      return { ok: true, user: match };
    },
    [startSession],
  );

  /** Returns { ok: true, user } or { ok: false, reason: 'exists' }. */
  const signup = useCallback(
    ({ name, email, college, password }) => {
      const normalised = email.trim().toLowerCase();
      const users = getUsers();
      if (users.some((u) => u.email.toLowerCase() === normalised)) return { ok: false, reason: 'exists' };

      const user = { name: name.trim(), email: normalised, college: college.trim(), password };
      saveUsers([...users, user]);
      startSession(user);
      return { ok: true, user };
    },
    [startSession],
  );

  const loginAsGuest = useCallback(() => {
    startSession({ name: 'Alex Rivera', email: 'guest@bridge.app', college: 'Main Campus' });
  }, [startSession]);

  const logout = useCallback(() => {
    clearSession();
    setSession(readSession());
  }, []);

  const value = useMemo(() => {
    const displayName = session.name || 'Student';
    return {
      isLoggedIn: session.isLoggedIn,
      user: {
        name: displayName,
        firstName: displayName.trim().split(' ')[0],
        initials: getInitials(displayName),
        email: session.email,
        college: session.college,
      },
      login,
      signup,
      loginAsGuest,
      logout,
    };
  }, [session, login, signup, loginAsGuest, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside <AuthProvider>');
  return context;
}
