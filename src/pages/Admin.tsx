import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { 
  MapPin, Calendar, Mail, Phone, 
  Trash2, Edit, X, Check, Clock, MessageSquare, Video, ArrowLeft, Loader2, User
} from 'lucide-react';
import { 
  generateAppointmentWhatsAppMessage, 
  generateContactWhatsAppMessage, 
  createWhatsAppLink 
} from '@/lib/whatsappTemplates';

interface Request {
  id: string;
  created_at: string;
  type: 'appointment' | 'contact';
  name: string;
  phone: string;
  email: string;
  message: string | null;
  project_type: string | null;
  location: string | null;
  tracking_code: string;
  meeting_link: string | null;
  appointment_date: string | null;
  appointment_time: string | null;
}

const Admin = () => {
  const _navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isAllowed, setIsAllowed] = useState(false);
  const [requests, setRequests] = useState<Request[]>([]);
  const [filter, setFilter] = useState<'all' | 'appointment' | 'contact'>('all');
  
  // Edit state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Request>>({});

  useEffect(() => {
    const checkAndLoad = async () => {
      try {
        // Check if admin is allowed
        const { data: settings, error: settingsError } = await supabase
          .from('admin_settings')
          .select('is_admin_allowed')
          .eq('id', 1)
          .single();

        if (settingsError || !settings?.is_admin_allowed) {
          setIsAllowed(false);
          setIsLoading(false);
          return;
        }

        setIsAllowed(true);
        await fetchRequests();
      } catch (err) {
        console.error('Error:', err);
        setIsAllowed(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAndLoad();
  }, []);

  const fetchRequests = async () => {
    const { data, error } = await supabase
      .from('requests')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching requests:', error);
      toast({ title: 'Error', description: 'Failed to load requests', variant: 'destructive' });
    } else {
      setRequests((data || []) as Request[]);
    }
  };

  const handleEdit = (request: Request) => {
    setEditingId(request.id);
    setEditForm({
      name: request.name,
      email: request.email,
      phone: request.phone,
      project_type: request.project_type || '',
      location: request.location || '',
      message: request.message || '',
      meeting_link: request.meeting_link || '',
      appointment_date: request.appointment_date || '',
      appointment_time: request.appointment_time || '',
    });
  };

  const handleSaveEdit = async (id: string) => {
    const { error } = await supabase
      .from('requests')
      .update({
        name: editForm.name,
        email: editForm.email,
        phone: editForm.phone,
        project_type: editForm.project_type || null,
        location: editForm.location || null,
        message: editForm.message || null,
        meeting_link: editForm.meeting_link || null,
        appointment_date: editForm.appointment_date || null,
        appointment_time: editForm.appointment_time || null,
      })
      .eq('id', id);

    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Request Updated' });
      setEditingId(null);
      setEditForm({});
      fetchRequests();
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this request?')) return;

    const { error } = await supabase
      .from('requests')
      .delete()
      .eq('id', id);

    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Request Deleted' });
      fetchRequests();
    }
  };

  const handleSendWhatsApp = (request: Request) => {
    let message: string;
    
    if (request.type === 'appointment') {
      message = generateAppointmentWhatsAppMessage({
        clientName: request.name,
        clientPhone: request.phone,
        surveyType: request.project_type || 'Survey Consultation',
        date: request.appointment_date || undefined,
        time: request.appointment_time || undefined,
        location: request.location || undefined,
        meetingLink: request.meeting_link || undefined,
      });
    } else {
      message = generateContactWhatsAppMessage({
        clientName: request.name,
        clientPhone: request.phone,
        surveyType: request.project_type || 'General Inquiry',
      });
    }

    const link = createWhatsAppLink(request.phone, message);
    window.open(link, '_blank');
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const filteredRequests = requests.filter(r => 
    filter === 'all' ? true : r.type === filter
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  if (!isAllowed) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-6">
        <div className="text-center">
          <MapPin className="w-12 h-12 text-accent mx-auto mb-4" />
          <h1 className="font-serif text-3xl text-foreground mb-4">Admin Access Disabled</h1>
          <p className="text-foreground/60 text-sm mb-8">
            The admin panel is currently not available.
          </p>
          <Link to="/">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-foreground text-background py-4 px-6 sticky top-0 z-50">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="w-6 h-6 text-accent" />
            <span className="font-serif text-xl">Pruthvi Admin</span>
          </div>
          <Link to="/" className="text-background/60 hover:text-accent text-sm font-mono">
            ← Back to Website
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        {/* Filter Tabs */}
        <div className="flex gap-4 mb-8 border-b border-foreground/10">
          {(['all', 'appointment', 'contact'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`pb-4 px-2 font-mono text-sm uppercase tracking-widest border-b-2 transition-colors ${
                filter === tab 
                  ? 'border-accent text-accent' 
                  : 'border-transparent text-foreground/60 hover:text-foreground'
              }`}
            >
              {tab === 'all' ? 'All Requests' : tab === 'appointment' ? 'Appointments' : 'Contacts'}
              <span className="ml-2 text-xs">
                ({tab === 'all' 
                  ? requests.length 
                  : requests.filter(r => r.type === tab).length})
              </span>
            </button>
          ))}
        </div>

        {/* Requests List */}
        <div className="space-y-4">
          {filteredRequests.length === 0 ? (
            <div className="text-center py-16 text-foreground/60">
              <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No requests found</p>
            </div>
          ) : (
            filteredRequests.map((request) => (
              <div key={request.id} className="border border-foreground/10 bg-popover p-6">
                {editingId === request.id ? (
                  // Edit Form
                  <div className="space-y-4">
                    <div className="grid md:grid-cols-3 gap-4">
                      <div>
                        <label className="text-xs font-mono text-foreground/60 mb-1 block">Name</label>
                        <Input
                          value={editForm.name || ''}
                          onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="text-xs font-mono text-foreground/60 mb-1 block">Email</label>
                        <Input
                          type="email"
                          value={editForm.email || ''}
                          onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="text-xs font-mono text-foreground/60 mb-1 block">Phone</label>
                        <Input
                          value={editForm.phone || ''}
                          onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="text-xs font-mono text-foreground/60 mb-1 block">Project Type</label>
                        <Input
                          value={editForm.project_type || ''}
                          onChange={(e) => setEditForm({ ...editForm, project_type: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="text-xs font-mono text-foreground/60 mb-1 block">Location</label>
                        <Input
                          value={editForm.location || ''}
                          onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                        />
                      </div>
                      {request.type === 'appointment' && (
                        <>
                          <div>
                            <label className="text-xs font-mono text-foreground/60 mb-1 block">Date</label>
                            <Input
                              type="date"
                              value={editForm.appointment_date || ''}
                              onChange={(e) => setEditForm({ ...editForm, appointment_date: e.target.value })}
                            />
                          </div>
                          <div>
                            <label className="text-xs font-mono text-foreground/60 mb-1 block">Time</label>
                            <Input
                              type="time"
                              value={editForm.appointment_time || ''}
                              onChange={(e) => setEditForm({ ...editForm, appointment_time: e.target.value })}
                            />
                          </div>
                          <div className="md:col-span-2">
                            <label className="text-xs font-mono text-foreground/60 mb-1 block">Meeting Link</label>
                            <Input
                              value={editForm.meeting_link || ''}
                              onChange={(e) => setEditForm({ ...editForm, meeting_link: e.target.value })}
                              placeholder="https://teams.microsoft.com/... or https://zoom.us/..."
                            />
                          </div>
                        </>
                      )}
                      <div className="md:col-span-3">
                        <label className="text-xs font-mono text-foreground/60 mb-1 block">Message</label>
                        <textarea
                          value={editForm.message || ''}
                          onChange={(e) => setEditForm({ ...editForm, message: e.target.value })}
                          className="w-full h-20 px-3 py-2 border border-input bg-background rounded-md resize-none"
                        />
                      </div>
                    </div>
                    <div className="flex gap-2 justify-end">
                      <Button variant="outline" size="sm" onClick={() => setEditingId(null)}>
                        <X className="w-4 h-4 mr-1" /> Cancel
                      </Button>
                      <Button size="sm" onClick={() => handleSaveEdit(request.id)} className="bg-accent hover:bg-accent/90">
                        <Check className="w-4 h-4 mr-1" /> Save
                      </Button>
                    </div>
                  </div>
                ) : (
                  // View Mode
                  <div>
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <span className={`px-2 py-1 text-xs font-mono uppercase ${
                          request.type === 'appointment' 
                            ? 'bg-accent/20 text-accent' 
                            : 'bg-blue-500/20 text-blue-600'
                        }`}>
                          {request.type}
                        </span>
                        <span className="font-mono text-xs text-foreground/40">{request.tracking_code}</span>
                      </div>
                      <span className="text-xs text-foreground/40 font-mono">
                        {formatDate(request.created_at)}
                      </span>
                    </div>

                    <div className="grid md:grid-cols-3 gap-4 mb-4 text-sm">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-foreground/40" />
                        <span className="text-foreground">{request.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-foreground/40" />
                        <span className="text-foreground/80">{request.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-foreground/40" />
                        <span className="text-foreground/80">{request.phone}</span>
                      </div>
                    </div>

                    {request.project_type && (
                      <div className="text-sm text-accent mb-2">
                        <MapPin className="w-4 h-4 inline mr-1" />
                        {request.project_type}
                        {request.location && ` • ${request.location}`}
                      </div>
                    )}

                    {request.type === 'appointment' && (request.appointment_date || request.appointment_time) && (
                      <div className="flex gap-4 text-sm text-foreground/70 mb-2">
                        {request.appointment_date && (
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {formatDate(request.appointment_date)}
                          </span>
                        )}
                        {request.appointment_time && (
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {request.appointment_time}
                          </span>
                        )}
                      </div>
                    )}

                    {request.type === 'appointment' && request.meeting_link && (
                      <div className="flex items-center gap-2 text-sm text-green-600 mb-2">
                        <Video className="w-4 h-4" />
                        <a href={request.meeting_link} target="_blank" rel="noopener noreferrer" className="hover:underline truncate max-w-xs">
                          {request.meeting_link}
                        </a>
                      </div>
                    )}

                    {request.message && (
                      <p className="text-sm text-foreground/60 mt-2 italic">"{request.message}"</p>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2 mt-4 pt-4 border-t border-foreground/10">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleEdit(request)}
                      >
                        <Edit className="w-4 h-4 mr-1" /> Edit
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleDelete(request.id)}
                        className="text-red-500 hover:text-red-600 hover:border-red-500"
                      >
                        <Trash2 className="w-4 h-4 mr-1" /> Delete
                      </Button>
                      <Button 
                        size="sm" 
                        onClick={() => handleSendWhatsApp(request)}
                        className="bg-green-600 hover:bg-green-700 text-white ml-auto"
                      >
                        <MessageSquare className="w-4 h-4 mr-1" /> Send WhatsApp
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default Admin;
