import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { dashboardApi } from '@/lib/adminDashboard';
import { toast } from '@/hooks/use-toast';
import { Plus, Trash2, Loader2, ChevronLeft, ChevronRight, X, Check, CalendarDays } from 'lucide-react';

interface CalendarEvent {
  id: string;
  title: string;
  description: string | null;
  start_date: string;
  end_date: string | null;
  color: string;
}

const EVENT_COLORS = ['accent', 'blue', 'green', 'red', 'yellow', 'purple'];
const COLOR_MAP: Record<string, string> = {
  accent: 'bg-accent/20 text-accent border-accent/30',
  blue: 'bg-blue-500/20 text-blue-600 border-blue-500/30',
  green: 'bg-green-500/20 text-green-600 border-green-500/30',
  red: 'bg-red-500/20 text-red-600 border-red-500/30',
  yellow: 'bg-yellow-500/20 text-yellow-700 border-yellow-500/30',
  purple: 'bg-purple-500/20 text-purple-600 border-purple-500/30',
};

export default function CalendarTab() {
  const [items, setItems] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [adding, setAdding] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [form, setForm] = useState({ title: '', description: '', start_date: '', start_time: '09:00', color: 'accent' });

  const load = async () => {
    setLoading(true);
    const res = await dashboardApi.list('calendar');
    if (res.items) setItems(res.items);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleAdd = async () => {
    if (!form.title.trim() || !form.start_date) return;
    const startDate = `${form.start_date}T${form.start_time}:00`;
    const res = await dashboardApi.create('calendar', { title: form.title, description: form.description || null, start_date: startDate, color: form.color });
    if (res.item) { setItems([...items, res.item]); setAdding(false); setForm({ title: '', description: '', start_date: '', start_time: '09:00', color: 'accent' }); }
    else toast({ title: 'Error', description: res.error, variant: 'destructive' });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this event?')) return;
    const res = await dashboardApi.delete('calendar', id);
    if (res.success) setItems(items.filter(i => i.id !== id));
  };

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthName = currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const days = useMemo(() => {
    const arr: (number | null)[] = [];
    for (let i = 0; i < firstDay; i++) arr.push(null);
    for (let i = 1; i <= daysInMonth; i++) arr.push(i);
    return arr;
  }, [firstDay, daysInMonth]);

  const getEventsForDay = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return items.filter(e => e.start_date.startsWith(dateStr));
  };

  const today = new Date();
  const isToday = (day: number) => today.getDate() === day && today.getMonth() === month && today.getFullYear() === year;

  if (loading) return <div className="text-center py-16"><Loader2 className="w-8 h-8 animate-spin text-accent mx-auto" /></div>;

  const selectedDateStr = selectedDate;
  const selectedEvents = selectedDate ? items.filter(e => e.start_date.startsWith(selectedDate)) : [];

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <h3 className="font-serif text-2xl text-foreground">Calendar</h3>
        <Button onClick={() => { setAdding(true); setForm({ title: '', description: '', start_date: selectedDate || new Date().toISOString().split('T')[0], start_time: '09:00', color: 'accent' }); }} className="bg-accent hover:bg-accent/90"><Plus className="w-4 h-4 mr-2" />New Event</Button>
      </div>

      {adding && (
        <div className="border border-foreground/10 bg-popover p-4 sm:p-6 mb-6 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div><label className="text-xs font-mono text-foreground/60 mb-1 block">Title</label><Input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} /></div>
            <div><label className="text-xs font-mono text-foreground/60 mb-1 block">Date</label><Input type="date" value={form.start_date} onChange={e => setForm({ ...form, start_date: e.target.value })} /></div>
            <div><label className="text-xs font-mono text-foreground/60 mb-1 block">Time</label><Input type="time" value={form.start_time} onChange={e => setForm({ ...form, start_time: e.target.value })} /></div>
            <div><label className="text-xs font-mono text-foreground/60 mb-1 block">Color</label>
              <div className="flex gap-2 mt-1">
                {EVENT_COLORS.map(c => (
                  <button key={c} onClick={() => setForm({ ...form, color: c })} className={`w-7 h-7 rounded-full border-2 ${form.color === c ? 'border-foreground' : 'border-transparent'} ${COLOR_MAP[c]?.split(' ')[0] || 'bg-accent/20'}`} />
                ))}
              </div>
            </div>
            <div className="sm:col-span-2"><label className="text-xs font-mono text-foreground/60 mb-1 block">Description</label><Input value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} /></div>
          </div>
          <div className="flex gap-2 justify-end">
            <Button variant="outline" size="sm" onClick={() => setAdding(false)}><X className="w-4 h-4 mr-1" />Cancel</Button>
            <Button size="sm" onClick={handleAdd} className="bg-accent hover:bg-accent/90"><Check className="w-4 h-4 mr-1" />Save</Button>
          </div>
        </div>
      )}

      {/* Calendar Grid */}
      <div className="border border-foreground/10 bg-popover rounded-lg overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-foreground/10">
          <Button variant="ghost" size="sm" onClick={() => setCurrentMonth(new Date(year, month - 1))}><ChevronLeft className="w-4 h-4" /></Button>
          <h4 className="font-serif text-lg text-foreground">{monthName}</h4>
          <Button variant="ghost" size="sm" onClick={() => setCurrentMonth(new Date(year, month + 1))}><ChevronRight className="w-4 h-4" /></Button>
        </div>

        <div className="grid grid-cols-7">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
            <div key={d} className="p-2 text-center font-mono text-[10px] text-foreground/40 uppercase tracking-widest border-b border-foreground/5">{d}</div>
          ))}
          {days.map((day, i) => {
            const dayEvents = day ? getEventsForDay(day) : [];
            const dateStr = day ? `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}` : '';
            return (
              <div
                key={i}
                onClick={() => day && setSelectedDate(dateStr === selectedDate ? null : dateStr)}
                className={`min-h-[60px] sm:min-h-[80px] p-1 border-b border-r border-foreground/5 cursor-pointer transition-colors ${
                  !day ? 'bg-foreground/[0.02]' : selectedDate === dateStr ? 'bg-accent/10' : 'hover:bg-foreground/[0.03]'
                }`}
              >
                {day && (
                  <>
                    <span className={`text-xs font-mono inline-flex items-center justify-center w-6 h-6 rounded-full ${isToday(day) ? 'bg-accent text-background font-bold' : 'text-foreground/60'}`}>{day}</span>
                    <div className="space-y-0.5 mt-0.5">
                      {dayEvents.slice(0, 2).map(e => (
                        <div key={e.id} className={`text-[9px] sm:text-[10px] px-1 py-0.5 rounded truncate border ${COLOR_MAP[e.color] || COLOR_MAP.accent}`}>{e.title}</div>
                      ))}
                      {dayEvents.length > 2 && <div className="text-[9px] text-foreground/40 px-1">+{dayEvents.length - 2} more</div>}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected day events */}
      {selectedDate && (
        <div className="mt-4 border border-foreground/10 bg-popover p-4 rounded-lg">
          <h4 className="font-mono text-xs uppercase tracking-widest text-foreground/50 mb-3">
            Events on {new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </h4>
          {selectedEvents.length === 0 ? (
            <p className="text-sm text-foreground/40">No events on this day</p>
          ) : (
            <div className="space-y-2">
              {selectedEvents.map(e => (
                <div key={e.id} className={`flex items-center gap-3 p-3 rounded border ${COLOR_MAP[e.color] || COLOR_MAP.accent}`}>
                  <div className="flex-1">
                    <div className="font-semibold text-sm">{e.title}</div>
                    <div className="text-xs opacity-70">{new Date(e.start_date).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</div>
                    {e.description && <p className="text-xs mt-1 opacity-60">{e.description}</p>}
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(e.id)} className="text-red-500 shrink-0"><Trash2 className="w-4 h-4" /></Button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
