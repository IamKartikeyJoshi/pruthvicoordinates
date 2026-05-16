import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { dashboardApi } from '@/lib/adminDashboard';
import { toast } from '@/hooks/use-toast';
import { Plus, Trash2, Edit, X, Check, Loader2, IndianRupee } from 'lucide-react';

interface Expense {
  id: string;
  title: string;
  amount: number;
  category: string;
  expense_date: string;
  notes: string | null;
}

const CATEGORIES = ['general', 'equipment', 'travel', 'salary', 'office', 'software', 'other'];

export default function ExpensesTab() {
  const [items, setItems] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ title: '', amount: '', category: 'general', expense_date: new Date().toISOString().split('T')[0], notes: '' });
  const [adding, setAdding] = useState(false);

  const load = async () => {
    setLoading(true);
    const res = await dashboardApi.list('expenses');
    if (res.items) setItems(res.items);
    else if (res.error) toast({ title: 'Error', description: res.error, variant: 'destructive' });
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleAdd = async () => {
    if (!form.title || !form.amount) return;
    const res = await dashboardApi.create('expenses', { title: form.title, amount: parseFloat(form.amount), category: form.category, expense_date: form.expense_date, notes: form.notes || null });
    if (res.item) { setItems([res.item, ...items]); setAdding(false); setForm({ title: '', amount: '', category: 'general', expense_date: new Date().toISOString().split('T')[0], notes: '' }); }
    else toast({ title: 'Error', description: res.error, variant: 'destructive' });
  };

  const handleUpdate = async (id: string) => {
    const res = await dashboardApi.update('expenses', id, { title: form.title, amount: parseFloat(form.amount), category: form.category, expense_date: form.expense_date, notes: form.notes || null });
    if (res.item) { setItems(items.map(i => i.id === id ? res.item : i)); setEditingId(null); }
    else toast({ title: 'Error', description: res.error, variant: 'destructive' });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this expense?')) return;
    const res = await dashboardApi.delete('expenses', id);
    if (res.success) setItems(items.filter(i => i.id !== id));
  };

  const total = items.reduce((sum, i) => sum + Number(i.amount), 0);

  if (loading) return <div className="text-center py-16"><Loader2 className="w-8 h-8 animate-spin text-accent mx-auto" /></div>;

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="font-serif text-2xl text-foreground">Expenses</h3>
          <p className="font-mono text-sm text-accent">Total: ₹{total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
        </div>
        <Button onClick={() => setAdding(true)} className="bg-accent hover:bg-accent/90"><Plus className="w-4 h-4 mr-2" /> Add Expense</Button>
      </div>

      {adding && (
        <div className="border border-foreground/10 bg-popover p-4 sm:p-6 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div><label className="text-xs font-mono text-foreground/60 mb-1 block">Title</label><Input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} /></div>
            <div><label className="text-xs font-mono text-foreground/60 mb-1 block">Amount (₹)</label><Input type="number" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} /></div>
            <div><label className="text-xs font-mono text-foreground/60 mb-1 block">Category</label>
              <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="w-full h-10 px-3 border border-input bg-background rounded-md text-foreground text-sm">
                {CATEGORIES.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
              </select>
            </div>
            <div><label className="text-xs font-mono text-foreground/60 mb-1 block">Date</label><Input type="date" value={form.expense_date} onChange={e => setForm({ ...form, expense_date: e.target.value })} /></div>
            <div className="sm:col-span-2"><label className="text-xs font-mono text-foreground/60 mb-1 block">Notes</label><Input value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} /></div>
          </div>
          <div className="flex gap-2 mt-4 justify-end">
            <Button variant="outline" size="sm" onClick={() => setAdding(false)}><X className="w-4 h-4 mr-1" />Cancel</Button>
            <Button size="sm" onClick={handleAdd} className="bg-accent hover:bg-accent/90"><Check className="w-4 h-4 mr-1" />Save</Button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {items.length === 0 ? (
          <div className="text-center py-16 text-foreground/60"><IndianRupee className="w-12 h-12 mx-auto mb-4 opacity-50" /><p>No expenses recorded</p></div>
        ) : items.map(item => (
          <div key={item.id} className="border border-foreground/10 bg-popover p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
            {editingId === item.id ? (
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <Input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
                <Input type="number" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} />
                <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="h-10 px-3 border border-input bg-background rounded-md text-foreground text-sm">
                  {CATEGORIES.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
                </select>
                <Input type="date" value={form.expense_date} onChange={e => setForm({ ...form, expense_date: e.target.value })} />
                <div className="flex gap-2 sm:col-span-2 lg:col-span-4">
                  <Button size="sm" onClick={() => handleUpdate(item.id)} className="bg-accent hover:bg-accent/90"><Check className="w-4 h-4" /></Button>
                  <Button size="sm" variant="outline" onClick={() => setEditingId(null)}><X className="w-4 h-4" /></Button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold text-foreground truncate">{item.title}</span>
                    <span className="px-2 py-0.5 text-xs font-mono bg-foreground/5 text-foreground/60 rounded">{item.category}</span>
                  </div>
                  <div className="flex flex-wrap gap-3 text-xs text-foreground/50 mt-1">
                    <span>{new Date(item.expense_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    {item.notes && <span className="truncate max-w-[200px]">{item.notes}</span>}
                  </div>
                </div>
                <div className="font-mono text-accent font-semibold whitespace-nowrap">₹{Number(item.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
                <div className="flex gap-1 shrink-0">
                  <Button variant="ghost" size="sm" onClick={() => { setEditingId(item.id); setForm({ title: item.title, amount: String(item.amount), category: item.category, expense_date: item.expense_date, notes: item.notes || '' }); }}><Edit className="w-4 h-4" /></Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(item.id)} className="text-red-500"><Trash2 className="w-4 h-4" /></Button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
