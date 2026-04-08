import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { dashboardApi } from '@/lib/adminDashboard';
import { toast } from '@/hooks/use-toast';
import { Plus, Trash2, Loader2, X, Edit, ChevronRight, ChevronLeft } from 'lucide-react';

interface Todo {
  id: string;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  due_date: string | null;
  order_index: number;
}

const COLUMNS = [
  { id: 'todo', label: 'To Do', color: 'bg-foreground/10' },
  { id: 'in_progress', label: 'In Progress', color: 'bg-blue-500/10' },
  { id: 'review', label: 'Review', color: 'bg-yellow-500/10' },
  { id: 'done', label: 'Done', color: 'bg-green-500/10' },
];

const PRIORITY_COLORS: Record<string, string> = {
  low: 'bg-foreground/10 text-foreground/60',
  medium: 'bg-yellow-500/20 text-yellow-700',
  high: 'bg-red-500/20 text-red-600',
};

export default function TodoKanbanTab() {
  const [items, setItems] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ title: '', description: '', priority: 'medium', due_date: '' });

  const load = async () => {
    setLoading(true);
    const res = await dashboardApi.list('todos');
    if (res.items) setItems(res.items);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleAdd = async (status: string) => {
    if (!form.title.trim()) return;
    const res = await dashboardApi.create('todos', { title: form.title, description: form.description || null, status, priority: form.priority, due_date: form.due_date || null, order_index: items.filter(i => i.status === status).length });
    if (res.item) { setItems([...items, res.item]); setAdding(null); setForm({ title: '', description: '', priority: 'medium', due_date: '' }); }
    else toast({ title: 'Error', description: res.error, variant: 'destructive' });
  };

  const moveItem = async (item: Todo, newStatus: string) => {
    const res = await dashboardApi.update('todos', item.id, { status: newStatus });
    if (res.item) setItems(items.map(i => i.id === item.id ? res.item : i));
  };

  const handleUpdate = async (id: string) => {
    const res = await dashboardApi.update('todos', id, { title: form.title, description: form.description || null, priority: form.priority, due_date: form.due_date || null });
    if (res.item) { setItems(items.map(i => i.id === id ? res.item : i)); setEditingId(null); }
  };

  const handleDelete = async (id: string) => {
    const res = await dashboardApi.delete('todos', id);
    if (res.success) setItems(items.filter(i => i.id !== id));
  };

  if (loading) return <div className="text-center py-16"><Loader2 className="w-8 h-8 animate-spin text-accent mx-auto" /></div>;

  return (
    <div>
      <h3 className="font-serif text-2xl text-foreground mb-6">To-Do Board</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {COLUMNS.map(col => {
          const colItems = items.filter(i => i.status === col.id);
          const colIdx = COLUMNS.findIndex(c => c.id === col.id);
          return (
            <div key={col.id} className={`${col.color} rounded-lg p-3 sm:p-4 min-h-[200px]`}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <h4 className="font-mono text-xs uppercase tracking-widest text-foreground/70">{col.label}</h4>
                  <span className="w-5 h-5 rounded-full bg-foreground/10 flex items-center justify-center text-xs text-foreground/50">{colItems.length}</span>
                </div>
                <Button variant="ghost" size="sm" onClick={() => { setAdding(col.id); setForm({ title: '', description: '', priority: 'medium', due_date: '' }); }}><Plus className="w-4 h-4" /></Button>
              </div>

              {adding === col.id && (
                <div className="bg-background border border-foreground/10 rounded p-3 mb-3 space-y-2">
                  <Input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Task title" className="text-sm" />
                  <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Description (optional)" className="w-full h-16 px-3 py-2 border border-input bg-background rounded-md resize-none text-foreground text-sm" />
                  <div className="flex gap-2">
                    <select value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })} className="h-8 px-2 text-xs border border-input bg-background rounded-md text-foreground">
                      <option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option>
                    </select>
                    <Input type="date" value={form.due_date} onChange={e => setForm({ ...form, due_date: e.target.value })} className="h-8 text-xs flex-1" />
                  </div>
                  <div className="flex gap-1 justify-end">
                    <Button size="sm" variant="ghost" onClick={() => setAdding(null)}><X className="w-3 h-3" /></Button>
                    <Button size="sm" onClick={() => handleAdd(col.id)} className="bg-accent hover:bg-accent/90 h-7 text-xs">Add</Button>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                {colItems.map(item => (
                  <div key={item.id} className="bg-background border border-foreground/10 rounded p-3 group">
                    {editingId === item.id ? (
                      <div className="space-y-2">
                        <Input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="text-sm" />
                        <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="w-full h-16 px-3 py-2 border border-input bg-background rounded-md resize-none text-foreground text-sm" />
                        <div className="flex gap-1 justify-end">
                          <Button size="sm" variant="ghost" onClick={() => setEditingId(null)}><X className="w-3 h-3" /></Button>
                          <Button size="sm" onClick={() => handleUpdate(item.id)} className="bg-accent hover:bg-accent/90 h-7 text-xs">Save</Button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-start justify-between gap-2">
                          <h5 className="text-sm font-medium text-foreground flex-1">{item.title}</h5>
                          <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 shrink-0">
                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => { setEditingId(item.id); setForm({ title: item.title, description: item.description || '', priority: item.priority, due_date: item.due_date || '' }); }}><Edit className="w-3 h-3" /></Button>
                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-red-500" onClick={() => handleDelete(item.id)}><Trash2 className="w-3 h-3" /></Button>
                          </div>
                        </div>
                        {item.description && <p className="text-xs text-foreground/50 mt-1 line-clamp-2">{item.description}</p>}
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex gap-1 items-center">
                            <span className={`px-1.5 py-0.5 text-[10px] font-mono rounded ${PRIORITY_COLORS[item.priority] || PRIORITY_COLORS.medium}`}>{item.priority}</span>
                            {item.due_date && <span className="text-[10px] text-foreground/40 font-mono">{new Date(item.due_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>}
                          </div>
                          <div className="flex gap-0.5">
                            {colIdx > 0 && <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => moveItem(item, COLUMNS[colIdx - 1].id)}><ChevronLeft className="w-3 h-3" /></Button>}
                            {colIdx < COLUMNS.length - 1 && <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => moveItem(item, COLUMNS[colIdx + 1].id)}><ChevronRight className="w-3 h-3" /></Button>}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
