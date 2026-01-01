import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/App';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { 
  MapPin, LogOut, Calendar, Mail, Phone, User, 
  Trash2, Edit, Plus, X, Check, Clock, MessageSquare,
  ExternalLink
} from 'lucide-react';
import { generateWhatsAppLink } from '@/lib/whatsapp';

interface ContactSubmission {
  id: string;
  created_at: string;
  name: string;
  email: string;
  phone: string;
  project_type: string;
  location: string | null;
  message: string | null;
  reference_code: string | null;
}

interface Appointment {
  id: string;
  created_at: string;
  updated_at: string;
  client_name: string;
  client_email: string;
  client_phone: string;
  project_type: string;
  location: string | null;
  appointment_date: string;
  appointment_time: string;
  status: string;
  notes: string | null;
  admin_notes: string | null;
  meeting_link: string | null;
}

const Admin = () => {
  const { user, isAdmin, isLoading, signOut } = useAuth();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState<'appointments' | 'contacts'>('appointments');
  const [contacts, setContacts] = useState<ContactSubmission[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [supabaseClient, setSupabaseClient] = useState<any>(null);
  
  // Appointment form state
  const [showAppointmentForm, setShowAppointmentForm] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  const [appointmentForm, setAppointmentForm] = useState({
    client_name: '',
    client_email: '',
    client_phone: '',
    project_type: '',
    location: '',
    appointment_date: '',
    appointment_time: '',
    status: 'pending',
    notes: '',
    admin_notes: '',
    meeting_link: '',
  });

  // Initialize Supabase client
  useEffect(() => {
    const initSupabase = async () => {
      try {
        const { supabase } = await import('@/integrations/supabase/client');
        setSupabaseClient(supabase);
      } catch (err) {
        console.error('Failed to load supabase:', err);
      }
    };
    initSupabase();
  }, []);

  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/auth');
    }
  }, [user, isLoading, navigate]);

  useEffect(() => {
    if (user && isAdmin && supabaseClient) {
      fetchData();
    }
  }, [user, isAdmin, supabaseClient]);

  const fetchData = async () => {
    if (!supabaseClient) return;
    setLoading(true);
    try {
      const [contactsRes, appointmentsRes] = await Promise.all([
        supabaseClient.from('contact_submissions').select('*').order('created_at', { ascending: false }),
        supabaseClient.from('appointments').select('*').order('appointment_date', { ascending: true }),
      ]);

      if (contactsRes.data) setContacts(contactsRes.data);
      if (appointmentsRes.data) setAppointments(appointmentsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const handleSaveAppointment = async () => {
    if (!supabaseClient) return;
    try {
      if (editingAppointment) {
        const { error } = await supabaseClient
          .from('appointments')
          .update({
            ...appointmentForm,
            location: appointmentForm.location || null,
            notes: appointmentForm.notes || null,
            admin_notes: appointmentForm.admin_notes || null,
            meeting_link: appointmentForm.meeting_link || null,
          })
          .eq('id', editingAppointment.id);

        if (error) throw error;
        toast({ title: 'Appointment Updated' });
      } else {
        const { error } = await supabaseClient
          .from('appointments')
          .insert({
            ...appointmentForm,
            location: appointmentForm.location || null,
            notes: appointmentForm.notes || null,
            admin_notes: appointmentForm.admin_notes || null,
            meeting_link: appointmentForm.meeting_link || null,
          });

        if (error) throw error;
        toast({ title: 'Appointment Created' });
      }

      resetForm();
      fetchData();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  const handleDeleteAppointment = async (id: string) => {
    if (!supabaseClient) return;
    if (!confirm('Are you sure you want to delete this appointment?')) return;
    
    try {
      const { error } = await supabaseClient.from('appointments').delete().eq('id', id);
      if (error) throw error;
      toast({ title: 'Appointment Deleted' });
      fetchData();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  const handleDeleteContact = async (id: string) => {
    if (!supabaseClient) return;
    if (!confirm('Are you sure you want to delete this contact submission?')) return;
    
    try {
      const { error } = await supabaseClient.from('contact_submissions').delete().eq('id', id);
      if (error) throw error;
      toast({ title: 'Contact Deleted' });
      fetchData();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  const resetForm = () => {
    setShowAppointmentForm(false);
    setEditingAppointment(null);
    setAppointmentForm({
      client_name: '',
      client_email: '',
      client_phone: '',
      project_type: '',
      location: '',
      appointment_date: '',
      appointment_time: '',
      status: 'pending',
      notes: '',
      admin_notes: '',
      meeting_link: '',
    });
  };

  const openEditForm = (appointment: Appointment) => {
    setEditingAppointment(appointment);
    setAppointmentForm({
      client_name: appointment.client_name,
      client_email: appointment.client_email,
      client_phone: appointment.client_phone,
      project_type: appointment.project_type,
      location: appointment.location || '',
      appointment_date: appointment.appointment_date,
      appointment_time: appointment.appointment_time,
      status: appointment.status,
      notes: appointment.notes || '',
      admin_notes: appointment.admin_notes || '',
      meeting_link: appointment.meeting_link || '',
    });
    setShowAppointmentForm(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-500/20 text-green-600';
      case 'pending': return 'bg-yellow-500/20 text-yellow-600';
      case 'cancelled': return 'bg-red-500/20 text-red-600';
      case 'completed': return 'bg-blue-500/20 text-blue-600';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse font-mono text-foreground/60">Loading...</div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-6">
        <div className="text-center">
          <h1 className="font-serif text-3xl text-foreground mb-4">Access Denied</h1>
          <p className="text-foreground/60 mb-6">You don't have admin privileges.</p>
          <Button onClick={() => navigate('/')} variant="outline">Go to Homepage</Button>
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
          <div className="flex items-center gap-4">
            <span className="text-background/60 text-sm font-mono">{user?.email}</span>
            <Button onClick={handleLogout} variant="ghost" size="sm" className="text-background hover:text-accent">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-foreground/10">
          <button
            onClick={() => setActiveTab('appointments')}
            className={`pb-4 px-2 font-mono text-sm uppercase tracking-widest border-b-2 transition-colors ${
              activeTab === 'appointments' 
                ? 'border-accent text-accent' 
                : 'border-transparent text-foreground/60 hover:text-foreground'
            }`}
          >
            <Calendar className="w-4 h-4 inline mr-2" />
            Appointments ({appointments.length})
          </button>
          <button
            onClick={() => setActiveTab('contacts')}
            className={`pb-4 px-2 font-mono text-sm uppercase tracking-widest border-b-2 transition-colors ${
              activeTab === 'contacts' 
                ? 'border-accent text-accent' 
                : 'border-transparent text-foreground/60 hover:text-foreground'
            }`}
          >
            <MessageSquare className="w-4 h-4 inline mr-2" />
            Contacts ({contacts.length})
          </button>
        </div>

        {/* Appointments Tab */}
        {activeTab === 'appointments' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-serif text-2xl">Manage Appointments</h2>
              <Button onClick={() => setShowAppointmentForm(true)} className="bg-accent hover:bg-accent/90">
                <Plus className="w-4 h-4 mr-2" />
                New Appointment
              </Button>
            </div>

            {/* Appointment Form Modal */}
            {showAppointmentForm && (
              <div className="fixed inset-0 bg-foreground/80 flex items-center justify-center z-50 p-6">
                <div className="bg-background rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="font-serif text-xl">
                      {editingAppointment ? 'Edit Appointment' : 'New Appointment'}
                    </h3>
                    <button onClick={resetForm} className="text-foreground/60 hover:text-foreground">
                      <X className="w-6 h-6" />
                    </button>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-mono text-foreground/60 mb-1">Client Name *</label>
                      <Input
                        value={appointmentForm.client_name}
                        onChange={(e) => setAppointmentForm({ ...appointmentForm, client_name: e.target.value })}
                        placeholder="Enter client name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-mono text-foreground/60 mb-1">Email *</label>
                      <Input
                        type="email"
                        value={appointmentForm.client_email}
                        onChange={(e) => setAppointmentForm({ ...appointmentForm, client_email: e.target.value })}
                        placeholder="client@email.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-mono text-foreground/60 mb-1">Phone *</label>
                      <Input
                        value={appointmentForm.client_phone}
                        onChange={(e) => setAppointmentForm({ ...appointmentForm, client_phone: e.target.value })}
                        placeholder="+91 98765 43210"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-mono text-foreground/60 mb-1">Project Type *</label>
                      <Input
                        value={appointmentForm.project_type}
                        onChange={(e) => setAppointmentForm({ ...appointmentForm, project_type: e.target.value })}
                        placeholder="e.g., Topographical Survey"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-mono text-foreground/60 mb-1">Date *</label>
                      <Input
                        type="date"
                        value={appointmentForm.appointment_date}
                        onChange={(e) => setAppointmentForm({ ...appointmentForm, appointment_date: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-mono text-foreground/60 mb-1">Time *</label>
                      <Input
                        type="time"
                        value={appointmentForm.appointment_time}
                        onChange={(e) => setAppointmentForm({ ...appointmentForm, appointment_time: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-mono text-foreground/60 mb-1">Location</label>
                      <Input
                        value={appointmentForm.location}
                        onChange={(e) => setAppointmentForm({ ...appointmentForm, location: e.target.value })}
                        placeholder="City, State"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-mono text-foreground/60 mb-1">Status</label>
                      <select
                        value={appointmentForm.status}
                        onChange={(e) => setAppointmentForm({ ...appointmentForm, status: e.target.value })}
                        className="w-full h-10 px-3 border border-input bg-background rounded-md"
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-mono text-foreground/60 mb-1">Client Notes</label>
                      <textarea
                        value={appointmentForm.notes}
                        onChange={(e) => setAppointmentForm({ ...appointmentForm, notes: e.target.value })}
                        className="w-full h-20 px-3 py-2 border border-input bg-background rounded-md resize-none"
                        placeholder="Notes from client..."
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-mono text-foreground/60 mb-1">Admin Notes</label>
                      <textarea
                        value={appointmentForm.admin_notes}
                        onChange={(e) => setAppointmentForm({ ...appointmentForm, admin_notes: e.target.value })}
                        className="w-full h-20 px-3 py-2 border border-input bg-background rounded-md resize-none"
                        placeholder="Internal notes..."
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-mono text-foreground/60 mb-1">Meeting Link (Teams/Zoom)</label>
                      <Input
                        value={appointmentForm.meeting_link}
                        onChange={(e) => setAppointmentForm({ ...appointmentForm, meeting_link: e.target.value })}
                        placeholder="https://teams.microsoft.com/... or https://zoom.us/..."
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-4 mt-6">
                    <Button variant="outline" onClick={resetForm}>Cancel</Button>
                    <Button onClick={handleSaveAppointment} className="bg-accent hover:bg-accent/90">
                      <Check className="w-4 h-4 mr-2" />
                      {editingAppointment ? 'Update' : 'Create'}
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Appointments List */}
            {loading ? (
              <div className="text-center py-12 text-foreground/60">Loading...</div>
            ) : appointments.length === 0 ? (
              <div className="text-center py-12 text-foreground/60">No appointments yet.</div>
            ) : (
              <div className="grid gap-4">
                {appointments.map((apt) => (
                  <div key={apt.id} className="border border-foreground/10 bg-popover p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-2">
                          <h3 className="font-serif text-lg">{apt.client_name}</h3>
                          <span className={`px-2 py-1 text-xs font-mono uppercase rounded ${getStatusColor(apt.status)}`}>
                            {apt.status}
                          </span>
                        </div>
                        <div className="grid md:grid-cols-3 gap-4 text-sm text-foreground/70">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            {new Date(apt.appointment_date).toLocaleDateString()} at {apt.appointment_time}
                          </div>
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4" />
                            {apt.client_email}
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4" />
                            {apt.client_phone}
                          </div>
                        </div>
                        <div className="mt-2 text-sm">
                          <span className="text-accent font-mono">{apt.project_type}</span>
                          {apt.location && <span className="text-foreground/60"> • {apt.location}</span>}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {/* WhatsApp Send Button */}
                        <a
                          href={generateWhatsAppLink({
                            clientName: apt.client_name,
                            clientPhone: apt.client_phone,
                            projectType: apt.project_type,
                            appointmentDate: apt.appointment_date,
                            appointmentTime: apt.appointment_time,
                            location: apt.location,
                            meetingLink: apt.meeting_link,
                          })}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center h-8 px-3 text-xs font-mono bg-green-600 hover:bg-green-700 text-white rounded transition-colors"
                          title="Send on WhatsApp"
                        >
                          <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                          </svg>
                          WhatsApp
                        </a>
                        <Button variant="ghost" size="sm" onClick={() => openEditForm(apt)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDeleteAppointment(apt.id)} className="text-red-500 hover:text-red-600">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Contacts Tab */}
        {activeTab === 'contacts' && (
          <div>
            <h2 className="font-serif text-2xl mb-6">Contact Submissions</h2>
            
            {loading ? (
              <div className="text-center py-12 text-foreground/60">Loading...</div>
            ) : contacts.length === 0 ? (
              <div className="text-center py-12 text-foreground/60">No contact submissions yet.</div>
            ) : (
              <div className="grid gap-4">
                {contacts.map((contact) => (
                  <div key={contact.id} className="border border-foreground/10 bg-popover p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-2">
                          <h3 className="font-serif text-lg">{contact.name}</h3>
                          <span className="px-2 py-1 text-xs font-mono uppercase bg-accent/20 text-accent rounded">
                            {contact.project_type}
                          </span>
                          {contact.reference_code && (
                            <span className="text-xs font-mono text-foreground/40">
                              {contact.reference_code}
                            </span>
                          )}
                        </div>
                        <div className="grid md:grid-cols-3 gap-4 text-sm text-foreground/70">
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4" />
                            {contact.email}
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4" />
                            {contact.phone}
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            {new Date(contact.created_at).toLocaleString()}
                          </div>
                        </div>
                        {contact.location && (
                          <div className="mt-2 text-sm text-foreground/60">
                            <MapPin className="w-4 h-4 inline mr-1" />
                            {contact.location}
                          </div>
                        )}
                        {contact.message && (
                          <div className="mt-3 p-3 bg-background border-l-2 border-accent text-sm">
                            {contact.message}
                          </div>
                        )}
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleDeleteContact(contact.id)}
                        className="text-red-500 hover:text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default Admin;
