const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "https://rfwrsqjanuelmzmttrbe.supabase.co";
const SESSION_KEY = 'pruthvi_admin_session';

export interface AdminSession {
  sessionToken: string;
  expiresAt: string;
}

export function getStoredSession(): AdminSession | null {
  try {
    const stored = localStorage.getItem(SESSION_KEY);
    if (!stored) return null;
    const session = JSON.parse(stored) as AdminSession;
    if (new Date(session.expiresAt) < new Date()) {
      localStorage.removeItem(SESSION_KEY);
      return null;
    }
    return session;
  } catch {
    localStorage.removeItem(SESSION_KEY);
    return null;
  }
}

export function storeSession(session: AdminSession): void {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function clearSession(): void {
  localStorage.removeItem(SESSION_KEY);
}

export async function loginWithPassphrase(passphrase: string): Promise<{ success: boolean; error?: string; session?: AdminSession }> {
  try {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/admin-login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ passphrase }),
    });
    const data = await response.json();
    if (!response.ok) return { success: false, error: data.error || 'Login failed' };
    const session: AdminSession = { sessionToken: data.sessionToken, expiresAt: data.expiresAt };
    storeSession(session);
    return { success: true, session };
  } catch (error) {
    return { success: false, error: 'Network error' };
  }
}

export async function verifySession(): Promise<boolean> {
  const session = getStoredSession();
  if (!session) return false;
  try {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/admin-verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionToken: session.sessionToken }),
    });
    const data = await response.json();
    if (!data.valid) { clearSession(); return false; }
    return true;
  } catch { return false; }
}

export async function logout(): Promise<void> {
  const session = getStoredSession();
  if (session) {
    try {
      await fetch(`${SUPABASE_URL}/functions/v1/admin-logout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-token': session.sessionToken },
      });
    } catch {}
  }
  clearSession();
}

// Admin API calls
export async function fetchAdminRequests(): Promise<{ requests?: any[]; error?: string }> {
  const session = getStoredSession();
  if (!session) return { error: 'Not authenticated' };
  try {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/admin-requests?action=list`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-admin-token': session.sessionToken },
      body: JSON.stringify({}),
    });
    const data = await response.json();
    if (!response.ok) {
      if (response.status === 401) clearSession();
      return { error: data.error || 'Failed to fetch requests' };
    }
    return { requests: data.requests };
  } catch { return { error: 'Network error' }; }
}

export async function updateAdminRequest(id: string, updates: Record<string, any>): Promise<{ success: boolean; error?: string }> {
  const session = getStoredSession();
  if (!session) return { success: false, error: 'Not authenticated' };
  try {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/admin-requests?action=update`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-admin-token': session.sessionToken },
      body: JSON.stringify({ id, updates }),
    });
    const data = await response.json();
    if (!response.ok) {
      if (response.status === 401) clearSession();
      return { success: false, error: data.error };
    }
    return { success: true };
  } catch { return { success: false, error: 'Network error' }; }
}

export async function deleteAdminRequest(id: string): Promise<{ success: boolean; error?: string }> {
  const session = getStoredSession();
  if (!session) return { success: false, error: 'Not authenticated' };
  try {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/admin-requests?action=delete`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-admin-token': session.sessionToken },
      body: JSON.stringify({ id }),
    });
    const data = await response.json();
    if (!response.ok) {
      if (response.status === 401) clearSession();
      return { success: false, error: data.error };
    }
    return { success: true };
  } catch { return { success: false, error: 'Network error' }; }
}

export async function adminReschedule(id: string, newDate: string, newTime: string): Promise<{ success: boolean; error?: string }> {
  const session = getStoredSession();
  if (!session) return { success: false, error: 'Not authenticated' };
  try {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/admin-requests?action=reschedule`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-admin-token': session.sessionToken },
      body: JSON.stringify({ id, newDate, newTime }),
    });
    const data = await response.json();
    if (!response.ok) {
      if (response.status === 401) clearSession();
      return { success: false, error: data.error };
    }
    return { success: true };
  } catch { return { success: false, error: 'Network error' }; }
}

// Track request (public)
export async function trackRequest(trackingCode: string): Promise<{ request?: any; error?: string }> {
  try {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/track-request`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ trackingCode }),
    });
    const data = await response.json();
    if (!response.ok) return { error: data.error || 'Request not found' };
    return { request: data.request };
  } catch { return { error: 'Network error' }; }
}

// Check availability (public)
export async function checkAvailability(date: string): Promise<{ bookedTimes?: string[]; error?: string }> {
  try {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/check-availability`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ date }),
    });
    const data = await response.json();
    if (!response.ok) return { error: data.error };
    return { bookedTimes: data.bookedTimes };
  } catch { return { error: 'Network error' }; }
}

// Reschedule request (public - user)
export async function rescheduleRequest(trackingCode: string, newDate: string, newTime: string): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/reschedule-request`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ trackingCode, newDate, newTime }),
    });
    const data = await response.json();
    if (!response.ok) return { success: false, error: data.error };
    return { success: true };
  } catch { return { success: false, error: 'Network error' }; }
}

// Site content (public read)
export async function fetchSiteContent(page: string): Promise<{ content?: any[]; error?: string }> {
  try {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/site-content?page=${page}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await response.json();
    if (!response.ok) return { error: data.error };
    return { content: data.content };
  } catch { return { error: 'Network error' }; }
}

// Site content (admin)
export async function adminFetchContent(page: string): Promise<{ content?: any[]; error?: string }> {
  const session = getStoredSession();
  if (!session) return { error: 'Not authenticated' };
  try {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/site-content?action=list`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-admin-token': session.sessionToken },
      body: JSON.stringify({ page }),
    });
    const data = await response.json();
    if (!response.ok) return { error: data.error };
    return { content: data.content };
  } catch { return { error: 'Network error' }; }
}

export async function adminBulkSaveContent(page: string, items: any[]): Promise<{ success: boolean; error?: string }> {
  const session = getStoredSession();
  if (!session) return { success: false, error: 'Not authenticated' };
  try {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/site-content?action=bulk-save`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-admin-token': session.sessionToken },
      body: JSON.stringify({ page, items }),
    });
    const data = await response.json();
    if (!response.ok) return { success: false, error: data.error };
    return { success: true };
  } catch { return { success: false, error: 'Network error' }; }
}
