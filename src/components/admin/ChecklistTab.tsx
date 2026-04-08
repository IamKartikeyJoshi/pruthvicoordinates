import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { dashboardApi } from '@/lib/adminDashboard';
import { toast } from '@/hooks/use-toast';
import { Plus, Trash2, Loader2, CheckSquare, Square } from 'lucide-react';

interface ChecklistItem {
  id: string;
  title: string;
  checked: boolean;
  category: string;
  order_index: number;
}

export default function ChecklistTab() {
  const [items, setItems] = useState<ChecklistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('general');

  const load = async () => {
    setLoading(true);
    const res = await dashboardApi.list('checklist');
    if (res.items) setItems(res.items);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleAdd = async () => {
    if (!newTitle.trim()) return;
    const res = await dashboardApi.create('checklist', { title: newTitle, category: newCategory, order_index: items.length });
    if (res.item) { setItems([...items, res.item]); setNewTitle(''); }
    else toast({ title: 'Error', description: res.error, variant: 'destructive' });
  };

  const toggleCheck = async (item: ChecklistItem) => {
    const res = await dashboardApi.update('checklist', item.id, { checked: !item.checked });
    if (res.item) setItems(items.map(i => i.id === item.id ? res.item : i));
  };

  const handleDelete = async (id: string) => {
    const res = await dashboardApi.delete('checklist', id);
    if (res.success) setItems(items.filter(i => i.id !== id));
  };

  const categories = [...new Set(items.map(i => i.category))];
  const progress = items.length > 0 ? Math.round((items.filter(i => i.checked).length / items.length) * 100) : 0;

  if (loading) return <div className="text-center py-16"><Loader2 className="w-8 h-8 animate-spin text-accent mx-auto" /></div>;

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="font-serif text-2xl text-foreground">Checklist</h3>
          <p className="font-mono text-sm text-foreground/50">{items.filter(i => i.checked).length}/{items.length} completed ({progress}%)</p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-foreground/10 rounded-full h-2 mb-6">
        <div className="bg-accent h-2 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
      </div>

      {/* Add form */}
      <div className="flex flex-col sm:flex-row gap-2 mb-6">
        <Input value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder="New checklist item..." className="flex-1" onKeyDown={e => e.key === 'Enter' && handleAdd()} />
        <Input value={newCategory} onChange={e => setNewCategory(e.target.value)} placeholder="Category" className="w-full sm:w-32" />
        <Button onClick={handleAdd} className="bg-accent hover:bg-accent/90 shrink-0"><Plus className="w-4 h-4 mr-1" />Add</Button>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-16 text-foreground/60"><CheckSquare className="w-12 h-12 mx-auto mb-4 opacity-50" /><p>No checklist items</p></div>
      ) : (
        <div className="space-y-6">
          {categories.map(cat => (
            <div key={cat}>
              <h4 className="font-mono text-xs uppercase tracking-widest text-foreground/40 mb-3">{cat}</h4>
              <div className="space-y-1">
                {items.filter(i => i.category === cat).map(item => (
                  <div key={item.id} className="flex items-center gap-3 p-3 border border-foreground/5 hover:border-foreground/10 transition-colors group">
                    <button onClick={() => toggleCheck(item)} className="shrink-0">
                      {item.checked ? <CheckSquare className="w-5 h-5 text-accent" /> : <Square className="w-5 h-5 text-foreground/30" />}
                    </button>
                    <span className={`flex-1 text-sm ${item.checked ? 'line-through text-foreground/40' : 'text-foreground'}`}>{item.title}</span>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(item.id)} className="opacity-0 group-hover:opacity-100 text-red-500"><Trash2 className="w-4 h-4" /></Button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
