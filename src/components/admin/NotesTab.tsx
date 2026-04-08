import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { dashboardApi } from '@/lib/adminDashboard';
import { toast } from '@/hooks/use-toast';
import { Plus, Trash2, Loader2, StickyNote, Edit, X, Check } from 'lucide-react';

interface Note {
  id: string;
  title: string;
  content: string;
  color: string;
  updated_at: string;
}

const COLORS = [
  { id: 'default', bg: 'bg-popover', border: 'border-foreground/10' },
  { id: 'yellow', bg: 'bg-yellow-50', border: 'border-yellow-200' },
  { id: 'green', bg: 'bg-green-50', border: 'border-green-200' },
  { id: 'blue', bg: 'bg-blue-50', border: 'border-blue-200' },
  { id: 'pink', bg: 'bg-pink-50', border: 'border-pink-200' },
  { id: 'purple', bg: 'bg-purple-50', border: 'border-purple-200' },
];

export default function NotesTab() {
  const [items, setItems] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ title: '', content: '', color: 'default' });
  const [adding, setAdding] = useState(false);

  const load = async () => {
    setLoading(true);
    const res = await dashboardApi.list('notes');
    if (res.items) setItems(res.items);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleAdd = async () => {
    if (!form.title.trim() && !form.content.trim()) return;
    const res = await dashboardApi.create('notes', { title: form.title, content: form.content, color: form.color });
    if (res.item) { setItems([res.item, ...items]); setAdding(false); setForm({ title: '', content: '', color: 'default' }); }
    else toast({ title: 'Error', description: res.error, variant: 'destructive' });
  };

  const handleUpdate = async (id: string) => {
    const res = await dashboardApi.update('notes', id, { title: form.title, content: form.content, color: form.color });
    if (res.item) { setItems(items.map(i => i.id === id ? res.item : i)); setEditingId(null); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this note?')) return;
    const res = await dashboardApi.delete('notes', id);
    if (res.success) setItems(items.filter(i => i.id !== id));
  };

  const getColorClasses = (color: string) => COLORS.find(c => c.id === color) || COLORS[0];

  if (loading) return <div className="text-center py-16"><Loader2 className="w-8 h-8 animate-spin text-accent mx-auto" /></div>;

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <h3 className="font-serif text-2xl text-foreground">Notes</h3>
        <Button onClick={() => { setAdding(true); setForm({ title: '', content: '', color: 'default' }); }} className="bg-accent hover:bg-accent/90"><Plus className="w-4 h-4 mr-2" />New Note</Button>
      </div>

      {adding && (
        <div className="border border-foreground/10 bg-popover p-4 sm:p-6 mb-6 space-y-3">
          <Input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Note title..." />
          <textarea value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} placeholder="Write your note..." className="w-full h-32 px-3 py-2 border border-input bg-background rounded-md resize-none text-foreground" />
          <div className="flex items-center gap-2">
            <span className="text-xs text-foreground/50">Color:</span>
            {COLORS.map(c => (
              <button key={c.id} onClick={() => setForm({ ...form, color: c.id })} className={`w-6 h-6 rounded-full ${c.bg} border-2 ${form.color === c.id ? 'border-accent' : c.border}`} />
            ))}
          </div>
          <div className="flex gap-2 justify-end">
            <Button variant="outline" size="sm" onClick={() => setAdding(false)}><X className="w-4 h-4 mr-1" />Cancel</Button>
            <Button size="sm" onClick={handleAdd} className="bg-accent hover:bg-accent/90"><Check className="w-4 h-4 mr-1" />Save</Button>
          </div>
        </div>
      )}

      {items.length === 0 ? (
        <div className="text-center py-16 text-foreground/60"><StickyNote className="w-12 h-12 mx-auto mb-4 opacity-50" /><p>No notes yet</p></div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map(item => {
            const colorCls = getColorClasses(item.color);
            return (
              <div key={item.id} className={`${colorCls.bg} border ${colorCls.border} p-4 sm:p-5 group relative`}>
                {editingId === item.id ? (
                  <div className="space-y-2">
                    <Input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
                    <textarea value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} className="w-full h-24 px-3 py-2 border border-input bg-background rounded-md resize-none text-foreground text-sm" />
                    <div className="flex items-center gap-1">
                      {COLORS.map(c => (
                        <button key={c.id} onClick={() => setForm({ ...form, color: c.id })} className={`w-5 h-5 rounded-full ${c.bg} border ${form.color === c.id ? 'border-accent' : c.border}`} />
                      ))}
                    </div>
                    <div className="flex gap-1 justify-end">
                      <Button size="sm" variant="ghost" onClick={() => setEditingId(null)}><X className="w-3 h-3" /></Button>
                      <Button size="sm" onClick={() => handleUpdate(item.id)} className="bg-accent hover:bg-accent/90 h-7 text-xs">Save</Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="absolute top-2 right-2 flex gap-0.5 opacity-0 group-hover:opacity-100">
                      <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => { setEditingId(item.id); setForm({ title: item.title, content: item.content, color: item.color }); }}><Edit className="w-3 h-3" /></Button>
                      <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-red-500" onClick={() => handleDelete(item.id)}><Trash2 className="w-3 h-3" /></Button>
                    </div>
                    {item.title && <h4 className="font-semibold text-foreground mb-2 pr-14">{item.title}</h4>}
                    <p className="text-sm text-foreground/70 whitespace-pre-wrap">{item.content}</p>
                    <div className="mt-3 font-mono text-[10px] text-foreground/30">{new Date(item.updated_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
