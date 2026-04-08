import { getStoredSession, clearSession } from './adminSession';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "https://rfwrsqjanuelmzmttrbe.supabase.co";

async function dashboardFetch(table: string, action: string, body: any = {}): Promise<any> {
  const session = getStoredSession();
  if (!session) return { error: 'Not authenticated' };
  try {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/admin-dashboard?table=${table}&action=${action}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-admin-token': session.sessionToken },
      body: JSON.stringify(body),
    });
    const data = await response.json();
    if (response.status === 401) { clearSession(); return { error: 'Session expired' }; }
    if (!response.ok) return { error: data.error || 'Request failed' };
    return data;
  } catch { return { error: 'Network error' }; }
}

export const dashboardApi = {
  list: (table: string) => dashboardFetch(table, 'list'),
  create: (table: string, item: any) => dashboardFetch(table, 'create', { item }),
  update: (table: string, id: string, updates: any) => dashboardFetch(table, 'update', { id, ...updates }),
  delete: (table: string, id: string) => dashboardFetch(table, 'delete', { id }),
};
