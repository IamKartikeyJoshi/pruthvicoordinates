import { useState, useEffect, lazy, Suspense } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { 
  MapPin, Calendar, Mail, Phone, Trash2, Edit, X, Check, Clock, 
  MessageSquare, Video, Loader2, User, LogOut,
  Plus, Save, ArrowUp, ArrowDown, FileText, RefreshCw
} from 'lucide-react';

const ExpensesTab = lazy(() => import('@/components/admin/ExpensesTab'));
const ChecklistTab = lazy(() => import('@/components/admin/ChecklistTab'));
const TodoKanbanTab = lazy(() => import('@/components/admin/TodoKanbanTab'));
const NotesTab = lazy(() => import('@/components/admin/NotesTab'));
const CalendarTab = lazy(() => import('@/components/admin/CalendarTab'));
import { 
  generateAppointmentWhatsAppMessage, generateContactWhatsAppMessage, createWhatsAppLink 
} from '@/lib/whatsappTemplates';
import {
  verifySession, logout, fetchAdminRequests, updateAdminRequest,
  deleteAdminRequest, getStoredSession, adminReschedule,
  adminFetchContent, adminBulkSaveContent,
} from '@/lib/adminSession';
import { PAGE_DEFAULTS, ContentItem } from '@/lib/defaultContent';
import { fetchSiteContent } from '@/lib/adminSession';

function AdminBrand() {
  const [logo, setLogo] = useState<string>('');
  const [title, setTitle] = useState<string>('Pruthvi Admin');
  useEffect(() => {
    let cancelled = false;
    fetchSiteContent('site').then(res => {
      if (cancelled) return;
      const brand = (res.content || []).find((i: any) => i.section_key === 'brand');
      if (brand?.content) {
        setLogo(brand.content.admin_logo_url || brand.content.logo_url || '');
        setTitle(brand.content.admin_title || 'Pruthvi Admin');
      }
    });
    return () => { cancelled = true; };
  }, []);
  return (
    <div className="flex items-center gap-2">
      {logo ? (
        <img src={logo} alt="Logo" className="w-8 h-8 object-contain" />
      ) : (
        <div className="w-3 h-3 bg-accent rounded-full" />
      )}
      <span className="font-serif text-xl">{title}</span>
    </div>
  );
}

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
  status: string;
}

type AdminTab = 'requests' | 'dashboard' | 'site' | 'home' | 'mission' | 'expertise' | 'services' | 'portfolio';
type DashboardSubTab = 'expenses' | 'checklist' | 'todos' | 'notes' | 'calendar';

// Content section schemas for each page
const PAGE_SCHEMAS: Record<string, { key: string; label: string; fields: { name: string; label: string; type: 'text' | 'textarea' | 'image' }[] }[]> = {
  site: [
    { key: 'brand', label: 'Brand & Logo', fields: [
      { name: 'name_bold', label: 'Brand Name (Bold)', type: 'text' },
      { name: 'name_italic', label: 'Brand Name (Italic)', type: 'text' },
      { name: 'logo_url', label: 'Website Logo (URL or upload)', type: 'image' },
      { name: 'admin_logo_url', label: 'Admin Panel Logo (URL or upload)', type: 'image' },
      { name: 'admin_title', label: 'Admin Panel Title', type: 'text' },
    ]},
    { key: 'header_data', label: 'Header (LAT / LON / EST / CTA)', fields: [
      { name: 'lat_label', label: 'LAT Label', type: 'text' },
      { name: 'lat_value', label: 'LAT Value', type: 'text' },
      { name: 'lon_label', label: 'LON Label', type: 'text' },
      { name: 'lon_value', label: 'LON Value', type: 'text' },
      { name: 'est_label', label: 'EST Label', type: 'text' },
      { name: 'est_value', label: 'EST Value', type: 'text' },
      { name: 'cta_text', label: 'Header CTA Text', type: 'text' },
      { name: 'cta_link', label: 'Header CTA Link', type: 'text' },
    ]},
    { key: 'nav_item', label: 'Header Navigation Items', fields: [
      { name: 'label', label: 'Label', type: 'text' },
      { name: 'link', label: 'Link Path', type: 'text' },
    ]},
    { key: 'footer_main', label: 'Footer (Tagline / Social / Copyright)', fields: [
      { name: 'tagline', label: 'Tagline', type: 'textarea' },
      { name: 'quick_links_heading', label: 'Quick Links Heading', type: 'text' },
      { name: 'services_heading', label: 'Services Heading', type: 'text' },
      { name: 'connect_heading', label: 'Connect Heading', type: 'text' },
      { name: 'linkedin_url', label: 'LinkedIn URL', type: 'text' },
      { name: 'instagram_url', label: 'Instagram URL', type: 'text' },
      { name: 'twitter_url', label: 'Twitter URL', type: 'text' },
      { name: 'copyright', label: 'Copyright (use {year} for current year)', type: 'text' },
      { name: 'sign_off', label: 'Sign-off line', type: 'text' },
    ]},
    { key: 'footer_quick_link', label: 'Footer Quick Links', fields: [
      { name: 'label', label: 'Label', type: 'text' },
      { name: 'link', label: 'Link Path', type: 'text' },
    ]},
    { key: 'footer_service', label: 'Footer Services List', fields: [
      { name: 'label', label: 'Service Label', type: 'text' },
    ]},
  ],
  home: [
    { key: 'hero', label: 'Hero Section', fields: [
      { name: 'badge', label: 'Badge Text', type: 'text' },
      { name: 'title1', label: 'Title Line 1', type: 'text' },
      { name: 'title2', label: 'Title Line 2 (italic)', type: 'text' },
      { name: 'subtitle', label: 'Subtitle', type: 'text' },
      { name: 'description', label: 'Description', type: 'textarea' },
      { name: 'cta1_text', label: 'Button 1 Text', type: 'text' },
      { name: 'cta1_link', label: 'Button 1 Link', type: 'text' },
      { name: 'cta2_text', label: 'Button 2 Text', type: 'text' },
      { name: 'cta2_link', label: 'Button 2 Link', type: 'text' },
    ]},
    { key: 'stat', label: 'Stats (Numbers That Define Us)', fields: [
      { name: 'value', label: 'Value (e.g. 500+)', type: 'text' },
      { name: 'label', label: 'Label', type: 'text' },
      { name: 'description', label: 'Description', type: 'text' },
    ]},
    { key: 'client', label: 'Clients (Who We Serve)', fields: [
      { name: 'name', label: 'Client Type Name', type: 'text' },
      { name: 'description', label: 'Description', type: 'text' },
      { name: 'icon', label: 'Icon (Building2/Landmark/Factory/Home/TreePine/Truck)', type: 'text' },
    ]},
    { key: 'process', label: 'Process (How We Work)', fields: [
      { name: 'number', label: 'Step Number', type: 'text' },
      { name: 'title', label: 'Title', type: 'text' },
      { name: 'description', label: 'Description', type: 'textarea' },
      { name: 'icon', label: 'Icon (ClipboardList/Compass/FileCheck/Send)', type: 'text' },
    ]},
    { key: 'contact_info', label: 'Contact Info (Phone & Email)', fields: [
      { name: 'phone', label: 'Phone Number', type: 'text' },
      { name: 'email', label: 'Email Address', type: 'text' },
    ]},
  ],
  mission: [
    { key: 'hero', label: 'Hero Section', fields: [
      { name: 'subtitle', label: 'Subtitle', type: 'text' },
      { name: 'title', label: 'Title', type: 'text' },
      { name: 'titleAccent', label: 'Title Accent', type: 'text' },
      { name: 'description', label: 'Description', type: 'textarea' },
    ]},
    { key: 'stats', label: 'Stats', fields: [
      { name: 'label', label: 'Label', type: 'text' },
      { name: 'value', label: 'Value', type: 'text' },
      { name: 'icon', label: 'Icon (Target/Clock/Award/Users/Shield/Compass/MapPin)', type: 'text' },
    ]},
    { key: 'philosophy', label: 'Our Philosophy', fields: [
      { name: 'title', label: 'Title', type: 'text' },
      { name: 'description', label: 'Description (use double newlines for paragraphs)', type: 'textarea' },
      { name: 'quote', label: 'Quote', type: 'textarea' },
      { name: 'quoteName', label: 'Quote Author', type: 'text' },
      { name: 'quoteRole', label: 'Quote Role', type: 'text' },
    ]},
    { key: 'value', label: 'Core Values', fields: [
      { name: 'number', label: 'Number (01, 02...)', type: 'text' },
      { name: 'title', label: 'Title', type: 'text' },
      { name: 'description', label: 'Description', type: 'textarea' },
    ]},
    { key: 'milestone', label: 'Our Journey (Milestones)', fields: [
      { name: 'year', label: 'Year', type: 'text' },
      { name: 'event', label: 'Event', type: 'text' },
    ]},
    { key: 'team', label: 'Leadership Team', fields: [
      { name: 'name', label: 'Name', type: 'text' },
      { name: 'role', label: 'Role', type: 'text' },
      { name: 'experience', label: 'Experience', type: 'text' },
      { name: 'specialty', label: 'Specialty', type: 'text' },
      { name: 'license', label: 'License', type: 'text' },
    ]},
  ],
  expertise: [
    { key: 'hero', label: 'Hero Section', fields: [
      { name: 'subtitle', label: 'Subtitle', type: 'text' },
      { name: 'title', label: 'Title', type: 'text' },
      { name: 'titleAccent', label: 'Title Accent', type: 'text' },
      { name: 'description', label: 'Description', type: 'textarea' },
      { name: 'hero_image', label: 'Hero Image URL', type: 'image' },
    ]},
    { key: 'equipment', label: 'Equipment (Our Arsenal)', fields: [
      { name: 'name', label: 'Equipment Name', type: 'text' },
      { name: 'category', label: 'Category', type: 'text' },
      { name: 'accuracy', label: 'Accuracy', type: 'text' },
      { name: 'description', label: 'Description', type: 'textarea' },
      { name: 'image_url', label: 'Image URL (optional)', type: 'image' },
    ]},
    { key: 'methodology', label: 'Methodologies', fields: [
      { name: 'title', label: 'Title', type: 'text' },
      { name: 'description', label: 'Description', type: 'textarea' },
      { name: 'applications', label: 'Applications (comma-separated)', type: 'text' },
    ]},
    { key: 'software', label: 'Software Stack', fields: [
      { name: 'name', label: 'Software Name', type: 'text' },
    ]},
    { key: 'certification', label: 'Credentials', fields: [
      { name: 'name', label: 'Certification Name', type: 'text' },
      { name: 'authority', label: 'Authority', type: 'text' },
    ]},
  ],
  services: [
    { key: 'hero', label: 'Hero Section', fields: [
      { name: 'subtitle', label: 'Subtitle', type: 'text' },
      { name: 'title', label: 'Title', type: 'text' },
      { name: 'titleAccent', label: 'Title Accent', type: 'text' },
      { name: 'description', label: 'Description', type: 'textarea' },
    ]},
    { key: 'service', label: 'Services (Scope of Work)', fields: [
      { name: 'title', label: 'Service Title', type: 'text' },
      { name: 'subtitle', label: 'Subtitle', type: 'text' },
      { name: 'description', label: 'Description', type: 'textarea' },
      { name: 'deliverables', label: 'Deliverables (comma-separated)', type: 'textarea' },
      { name: 'timeline', label: 'Timeline', type: 'text' },
      { name: 'idealFor', label: 'Ideal For', type: 'text' },
    ]},
    { key: 'process', label: 'How We Work (Process)', fields: [
      { name: 'step', label: 'Step Number', type: 'text' },
      { name: 'title', label: 'Step Title', type: 'text' },
      { name: 'description', label: 'Description', type: 'textarea' },
    ]},
    { key: 'faq', label: 'FAQs', fields: [
      { name: 'question', label: 'Question', type: 'text' },
      { name: 'answer', label: 'Answer', type: 'textarea' },
    ]},
  ],
  portfolio: [
    { key: 'hero', label: 'Hero Section', fields: [
      { name: 'subtitle', label: 'Subtitle', type: 'text' },
      { name: 'title', label: 'Title', type: 'text' },
      { name: 'titleAccent', label: 'Title Accent', type: 'text' },
      { name: 'description', label: 'Description', type: 'textarea' },
      { name: 'hero_image', label: 'Hero Image URL', type: 'image' },
    ]},
    { key: 'project', label: 'Featured Projects', fields: [
      { name: 'title', label: 'Project Title', type: 'text' },
      { name: 'category', label: 'Category', type: 'text' },
      { name: 'location', label: 'Location', type: 'text' },
      { name: 'year', label: 'Year', type: 'text' },
      { name: 'area', label: 'Area', type: 'text' },
      { name: 'description', label: 'Description', type: 'textarea' },
      { name: 'services', label: 'Services (comma-separated)', type: 'text' },
      { name: 'highlight', label: 'Key Achievement', type: 'text' },
      { name: 'image_url', label: 'Project Image URL (optional)', type: 'image' },
    ]},
    { key: 'category', label: 'Industry Experience', fields: [
      { name: 'name', label: 'Category Name', type: 'text' },
      { name: 'count', label: 'Count', type: 'text' },
      { name: 'description', label: 'Description', type: 'textarea' },
      { name: 'projects', label: 'Notable Projects (comma-separated)', type: 'text' },
    ]},
    { key: 'client', label: 'Our Clients', fields: [
      { name: 'name', label: 'Client Name', type: 'text' },
      { name: 'type', label: 'Type', type: 'text' },
    ]},
    { key: 'testimonial', label: 'Client Feedback', fields: [
      { name: 'quote', label: 'Quote', type: 'textarea' },
      { name: 'author', label: 'Author', type: 'text' },
      { name: 'position', label: 'Position', type: 'text' },
    ]},
  ],
};

const Admin = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<AdminTab>('requests');
  
  // Request state
  const [requests, setRequests] = useState<Request[]>([]);
  const [filter, setFilter] = useState<'all' | 'appointment' | 'contact'>('all');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Request>>({});
  const [rescheduleId, setRescheduleId] = useState<string | null>(null);
  const [rescheduleForm, setRescheduleForm] = useState({ date: '', time: '' });
  
  // Content state
  const [contentItems, setContentItems] = useState<ContentItem[]>([]);
  const [contentLoading, setContentLoading] = useState(false);
  const [contentSaving, setContentSaving] = useState(false);
  const [selectedSection, setSelectedSection] = useState<string>('');
  const [dashboardTab, setDashboardTab] = useState<DashboardSubTab>('expenses');
  useEffect(() => {
    const checkAuth = async () => {
      const session = getStoredSession();
      if (!session) { navigate('/auth'); return; }
      const valid = await verifySession();
      if (!valid) { navigate('/auth'); return; }
      setIsAuthenticated(true);
      await loadRequests();
      setIsLoading(false);
    };
    checkAuth();
  }, [navigate]);

  useEffect(() => {
    if (activeTab !== 'requests' && activeTab !== 'dashboard' && isAuthenticated) {
      loadContent(activeTab);
      setSelectedSection('');
    }
  }, [activeTab, isAuthenticated]);

  const loadRequests = async () => {
    const result = await fetchAdminRequests();
    if (result.error) {
      if (result.error === 'Not authenticated' || result.error === 'Invalid or expired session') {
        navigate('/auth'); return;
      }
      toast({ title: 'Error', description: result.error, variant: 'destructive' });
    } else {
      setRequests((result.requests || []) as Request[]);
    }
  };

  const loadContent = async (page: string) => {
    setContentLoading(true);
    const result = await adminFetchContent(page);
    if (result.content && result.content.length > 0) {
      setContentItems(result.content as ContentItem[]);
    } else {
      // Pre-populate with defaults
      const defaults = PAGE_DEFAULTS[page] || [];
      setContentItems(defaults.map(d => ({ ...d })));
    }
    setContentLoading(false);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/auth');
  };

  // Request handlers
  const handleEdit = (request: Request) => {
    setEditingId(request.id);
    setEditForm({
      name: request.name, email: request.email, phone: request.phone,
      project_type: request.project_type || '', location: request.location || '',
      message: request.message || '', meeting_link: request.meeting_link || '',
      appointment_date: request.appointment_date || '',
      appointment_time: request.appointment_time || '',
      status: request.status || 'pending',
    });
  };

  const handleSaveEdit = async (id: string) => {
    const result = await updateAdminRequest(id, {
      name: editForm.name, email: editForm.email, phone: editForm.phone,
      project_type: editForm.project_type || null, location: editForm.location || null,
      message: editForm.message || null, meeting_link: editForm.meeting_link || null,
      appointment_date: editForm.appointment_date || null,
      appointment_time: editForm.appointment_time || null,
      status: editForm.status || 'pending',
    });
    if (result.error) {
      if (result.error === 'Not authenticated') { navigate('/auth'); return; }
      toast({ title: 'Error', description: result.error, variant: 'destructive' });
    } else {
      toast({ title: 'Request Updated' });
      setEditingId(null); setEditForm({});
      loadRequests();
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure? This will also free up the appointment time slot.')) return;
    const result = await deleteAdminRequest(id);
    if (result.error) {
      toast({ title: 'Error', description: result.error, variant: 'destructive' });
    } else {
      toast({ title: 'Request Deleted' });
      loadRequests();
    }
  };

  const handleReschedule = async (id: string) => {
    if (!rescheduleForm.date || !rescheduleForm.time) {
      toast({ title: 'Error', description: 'Date and time required', variant: 'destructive' });
      return;
    }
    const result = await adminReschedule(id, rescheduleForm.date, rescheduleForm.time);
    if (result.error) {
      toast({ title: 'Error', description: result.error, variant: 'destructive' });
    } else {
      toast({ title: 'Appointment Rescheduled' });
      setRescheduleId(null);
      setRescheduleForm({ date: '', time: '' });
      loadRequests();
    }
  };

  const handleSendWhatsApp = (request: Request) => {
    let message: string;
    if (request.type === 'appointment') {
      message = generateAppointmentWhatsAppMessage({
        clientName: request.name, clientPhone: request.phone,
        surveyType: request.project_type || 'Survey Consultation',
        date: request.appointment_date || undefined, time: request.appointment_time || undefined,
        location: request.location || undefined, meetingLink: request.meeting_link || undefined,
      });
    } else {
      message = generateContactWhatsAppMessage({
        clientName: request.name, clientPhone: request.phone,
        surveyType: request.project_type || 'General Inquiry',
      });
    }
    window.open(createWhatsAppLink(request.phone, message), '_blank');
  };

  // Content handlers
  const addContentItem = (sectionKey: string) => {
    const schema = PAGE_SCHEMAS[activeTab]?.find(s => s.key === sectionKey);
    if (!schema) return;
    const emptyContent: Record<string, string> = {};
    schema.fields.forEach(f => { emptyContent[f.name] = ''; });
    setContentItems([...contentItems, {
      section_key: sectionKey,
      content: emptyContent,
      order_index: contentItems.filter(i => i.section_key === sectionKey).length,
    }]);
  };

  const updateContentItem = (index: number, field: string, value: string) => {
    const updated = [...contentItems];
    updated[index] = { ...updated[index], content: { ...updated[index].content, [field]: value } };
    setContentItems(updated);
  };

  const removeContentItem = (index: number) => {
    setContentItems(contentItems.filter((_, i) => i !== index));
  };

  const moveContentItem = (index: number, direction: 'up' | 'down') => {
    const items = [...contentItems];
    const sectionIndices = items.map((item, idx) => item.section_key === items[index].section_key ? idx : -1).filter(i => i !== -1);
    const posInSection = sectionIndices.indexOf(index);
    
    if (direction === 'up' && posInSection > 0) {
      const swapIdx = sectionIndices[posInSection - 1];
      [items[index], items[swapIdx]] = [items[swapIdx], items[index]];
      setContentItems(items);
    } else if (direction === 'down' && posInSection < sectionIndices.length - 1) {
      const swapIdx = sectionIndices[posInSection + 1];
      [items[index], items[swapIdx]] = [items[swapIdx], items[index]];
      setContentItems(items);
    }
  };

  const saveContent = async () => {
    setContentSaving(true);
    const result = await adminBulkSaveContent(activeTab, contentItems);
    if (result.error) {
      toast({ title: 'Error', description: result.error, variant: 'destructive' });
    } else {
      toast({ title: 'Content Saved', description: 'Changes published to website.' });
    }
    setContentSaving(false);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const filteredRequests = requests.filter(r => filter === 'all' ? true : r.type === filter);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  if (!isAuthenticated) return null;

  const tabs: { id: AdminTab; label: string }[] = [
    { id: 'requests', label: 'Requests' },
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'site', label: 'Site (Header/Footer)' },
    { id: 'home', label: 'Home' },
    { id: 'mission', label: 'Mission' },
    { id: 'expertise', label: 'Expertise' },
    { id: 'services', label: 'Services' },
    { id: 'portfolio', label: 'Portfolio' },
  ];

  return (
    <div className="min-h-screen bg-background" style={{ fontFamily: '"Poppins", system-ui, sans-serif' }}>
      {/* Header */}
      <header className="bg-foreground text-background py-4 px-6 sticky top-0 z-50">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AdminBrand />
          </div>
          <div className="flex items-center gap-4">
            <Link to="/" className="text-background/60 hover:text-accent text-sm font-mono">← Back to Website</Link>
            <Button variant="ghost" size="sm" onClick={handleLogout} className="text-background hover:text-accent hover:bg-background/10">
              <LogOut className="w-4 h-4 mr-1" /> Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        {/* Main Tabs */}
        <div className="flex gap-4 mb-8 border-b border-foreground/10 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-4 px-2 font-mono text-sm uppercase tracking-widest border-b-2 transition-colors whitespace-nowrap ${
                activeTab === tab.id 
                  ? 'border-accent text-accent' 
                  : 'border-transparent text-foreground/60 hover:text-foreground'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Requests Tab */}
        {activeTab === 'requests' && (
          <>
            <div className="flex gap-4 mb-8">
              {(['all', 'appointment', 'contact'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setFilter(tab)}
                  className={`px-4 py-2 font-mono text-xs uppercase tracking-widest transition-colors ${
                    filter === tab ? 'bg-accent/20 text-accent' : 'text-foreground/60 hover:text-foreground'
                  }`}
                >
                  {tab === 'all' ? 'All' : tab === 'appointment' ? 'Appointments' : 'Contacts'}
                  <span className="ml-2">({tab === 'all' ? requests.length : requests.filter(r => r.type === tab).length})</span>
                </button>
              ))}
            </div>

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
                      <div className="space-y-4">
                        <div className="grid md:grid-cols-3 gap-4">
                          <div><label className="text-xs font-mono text-foreground/60 mb-1 block">Name</label><Input value={editForm.name || ''} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} /></div>
                          <div><label className="text-xs font-mono text-foreground/60 mb-1 block">Email</label><Input type="email" value={editForm.email || ''} onChange={(e) => setEditForm({ ...editForm, email: e.target.value })} /></div>
                          <div><label className="text-xs font-mono text-foreground/60 mb-1 block">Phone</label><Input value={editForm.phone || ''} onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })} /></div>
                          <div>
                            <label className="text-xs font-mono text-foreground/60 mb-1 block">Status</label>
                            <select value={editForm.status || 'pending'} onChange={(e) => setEditForm({ ...editForm, status: e.target.value })} className="w-full h-10 px-3 border border-input bg-background rounded-md text-foreground">
                              <option value="pending">Pending</option>
                              <option value="confirmed">Confirmed</option>
                              <option value="completed">Completed</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                          </div>
                          <div><label className="text-xs font-mono text-foreground/60 mb-1 block">Project Type</label><Input value={editForm.project_type || ''} onChange={(e) => setEditForm({ ...editForm, project_type: e.target.value })} /></div>
                          <div><label className="text-xs font-mono text-foreground/60 mb-1 block">Location</label><Input value={editForm.location || ''} onChange={(e) => setEditForm({ ...editForm, location: e.target.value })} /></div>
                          {request.type === 'appointment' && (
                            <>
                              <div><label className="text-xs font-mono text-foreground/60 mb-1 block">Date</label><Input type="date" value={editForm.appointment_date || ''} onChange={(e) => setEditForm({ ...editForm, appointment_date: e.target.value })} /></div>
                              <div><label className="text-xs font-mono text-foreground/60 mb-1 block">Time</label><Input type="time" value={editForm.appointment_time || ''} onChange={(e) => setEditForm({ ...editForm, appointment_time: e.target.value })} /></div>
                              <div className="md:col-span-2"><label className="text-xs font-mono text-foreground/60 mb-1 block">Meeting Link</label><Input value={editForm.meeting_link || ''} onChange={(e) => setEditForm({ ...editForm, meeting_link: e.target.value })} placeholder="https://..." /></div>
                            </>
                          )}
                          <div className="md:col-span-3"><label className="text-xs font-mono text-foreground/60 mb-1 block">Message</label><textarea value={editForm.message || ''} onChange={(e) => setEditForm({ ...editForm, message: e.target.value })} className="w-full h-20 px-3 py-2 border border-input bg-background rounded-md resize-none text-foreground" /></div>
                        </div>
                        <div className="flex gap-2 justify-end">
                          <Button variant="outline" size="sm" onClick={() => setEditingId(null)}><X className="w-4 h-4 mr-1" /> Cancel</Button>
                          <Button size="sm" onClick={() => handleSaveEdit(request.id)} className="bg-accent hover:bg-accent/90"><Check className="w-4 h-4 mr-1" /> Save</Button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <span className={`px-2 py-1 text-xs font-mono uppercase ${request.type === 'appointment' ? 'bg-accent/20 text-accent' : 'bg-blue-500/20 text-blue-600'}`}>{request.type}</span>
                            <span className={`px-2 py-1 text-xs font-mono uppercase ${
                              request.status === 'confirmed' ? 'bg-green-500/20 text-green-600' :
                              request.status === 'cancelled' ? 'bg-red-500/20 text-red-600' :
                              request.status === 'completed' ? 'bg-blue-500/20 text-blue-600' :
                              'bg-yellow-500/20 text-yellow-600'
                            }`}>{request.status || 'pending'}</span>
                            <span className="font-mono text-xs text-foreground/40">{request.tracking_code}</span>
                          </div>
                          <span className="text-xs text-foreground/40 font-mono">{formatDate(request.created_at)}</span>
                        </div>
                        <div className="grid md:grid-cols-3 gap-4 mb-4 text-sm">
                          <div className="flex items-center gap-2"><User className="w-4 h-4 text-foreground/40" /><span>{request.name}</span></div>
                          <div className="flex items-center gap-2"><Mail className="w-4 h-4 text-foreground/40" /><span className="text-foreground/80">{request.email}</span></div>
                          <div className="flex items-center gap-2"><Phone className="w-4 h-4 text-foreground/40" /><span className="text-foreground/80">{request.phone}</span></div>
                        </div>
                        {request.project_type && (
                          <div className="text-sm text-accent mb-2"><MapPin className="w-4 h-4 inline mr-1" />{request.project_type}{request.location && ` • ${request.location}`}</div>
                        )}
                        {request.type === 'appointment' && (request.appointment_date || request.appointment_time) && (
                          <div className="flex gap-4 text-sm text-foreground/70 mb-2">
                            {request.appointment_date && <span className="flex items-center gap-1"><Calendar className="w-4 h-4" />{formatDate(request.appointment_date)}</span>}
                            {request.appointment_time && <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{request.appointment_time}</span>}
                          </div>
                        )}
                        {request.type === 'appointment' && request.meeting_link && (
                          <div className="flex items-center gap-2 text-sm text-green-600 mb-2">
                            <Video className="w-4 h-4" />
                            <a href={request.meeting_link} target="_blank" rel="noopener noreferrer" className="hover:underline truncate max-w-xs">{request.meeting_link}</a>
                          </div>
                        )}
                        {request.message && <p className="text-sm text-foreground/60 mt-2 italic">"{request.message}"</p>}
                        {rescheduleId === request.id && (
                          <div className="mt-4 p-4 bg-secondary/30 border border-foreground/10">
                            <p className="font-mono text-xs text-foreground/60 mb-3 uppercase">Reschedule (Admin - No Restrictions)</p>
                            <div className="grid grid-cols-2 gap-4 mb-3">
                              <Input type="date" value={rescheduleForm.date} onChange={(e) => setRescheduleForm({ ...rescheduleForm, date: e.target.value })} />
                              <Input type="time" value={rescheduleForm.time} onChange={(e) => setRescheduleForm({ ...rescheduleForm, time: e.target.value })} />
                            </div>
                            <div className="flex gap-2">
                              <Button size="sm" onClick={() => handleReschedule(request.id)} className="bg-accent hover:bg-accent/90"><Check className="w-4 h-4 mr-1" /> Confirm</Button>
                              <Button size="sm" variant="outline" onClick={() => setRescheduleId(null)}><X className="w-4 h-4 mr-1" /> Cancel</Button>
                            </div>
                          </div>
                        )}
                        <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-foreground/10">
                          <Button variant="outline" size="sm" onClick={() => handleEdit(request)}><Edit className="w-4 h-4 mr-1" /> Edit</Button>
                          {request.type === 'appointment' && (
                            <Button variant="outline" size="sm" onClick={() => { setRescheduleId(request.id); setRescheduleForm({ date: request.appointment_date || '', time: request.appointment_time || '' }); }}>
                              <RefreshCw className="w-4 h-4 mr-1" /> Reschedule
                            </Button>
                          )}
                          <Button variant="outline" size="sm" onClick={() => handleDelete(request.id)} className="text-red-500 hover:text-red-600 hover:border-red-500">
                            <Trash2 className="w-4 h-4 mr-1" /> Delete
                          </Button>
                          <Button size="sm" onClick={() => handleSendWhatsApp(request)} className="bg-green-600 hover:bg-green-700 text-white ml-auto">
                            <MessageSquare className="w-4 h-4 mr-1" /> WhatsApp
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </>
        )}

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div>
            <div className="flex flex-wrap gap-2 mb-6">
              {([
                { id: 'expenses', label: 'Expenses' },
                { id: 'checklist', label: 'Checklist' },
                { id: 'todos', label: 'To-Do' },
                { id: 'notes', label: 'Notes' },
                { id: 'calendar', label: 'Calendar' },
              ] as { id: DashboardSubTab; label: string }[]).map(sub => (
                <button
                  key={sub.id}
                  onClick={() => setDashboardTab(sub.id)}
                  className={`px-4 py-2 font-mono text-xs uppercase tracking-widest transition-colors ${
                    dashboardTab === sub.id
                      ? 'bg-accent text-background'
                      : 'bg-foreground/5 text-foreground/60 hover:text-foreground'
                  }`}
                >
                  {sub.label}
                </button>
              ))}
            </div>
            <Suspense fallback={<div className="text-center py-16"><Loader2 className="w-8 h-8 animate-spin text-accent mx-auto" /></div>}>
              {dashboardTab === 'expenses' && <ExpensesTab />}
              {dashboardTab === 'checklist' && <ChecklistTab />}
              {dashboardTab === 'todos' && <TodoKanbanTab />}
              {dashboardTab === 'notes' && <NotesTab />}
              {dashboardTab === 'calendar' && <CalendarTab />}
            </Suspense>
          </div>
        )}

        {/* Content Management Tabs */}
        {activeTab !== 'requests' && activeTab !== 'dashboard' && (
          <div>
            {contentLoading ? (
              <div className="text-center py-16">
                <Loader2 className="w-8 h-8 animate-spin text-accent mx-auto" />
              </div>
            ) : (
              <>
                {/* Section selector */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {PAGE_SCHEMAS[activeTab]?.map((schema) => {
                    const count = contentItems.filter(i => i.section_key === schema.key).length;
                    return (
                      <button
                        key={schema.key}
                        onClick={() => setSelectedSection(selectedSection === schema.key ? '' : schema.key)}
                        className={`px-4 py-2 font-mono text-xs uppercase tracking-widest transition-colors ${
                          selectedSection === schema.key
                            ? 'bg-accent text-white'
                            : 'bg-foreground/5 text-foreground/60 hover:text-foreground'
                        }`}
                      >
                        {schema.label} ({count})
                      </button>
                    );
                  })}
                </div>

                {/* Content items for selected section */}
                {selectedSection && (
                  <div className="space-y-4">
                    {contentItems.map((item, index) => {
                      if (item.section_key !== selectedSection) return null;
                      const schema = PAGE_SCHEMAS[activeTab]?.find(s => s.key === selectedSection);
                      if (!schema) return null;

                      return (
                        <div key={index} className="border border-foreground/10 bg-popover p-6">
                          <div className="flex items-center justify-between mb-4">
                            <span className="font-mono text-xs text-foreground/60 uppercase">
                              {schema.label} #{contentItems.filter((ci, ci_idx) => ci.section_key === selectedSection && ci_idx <= index).length}
                            </span>
                            <div className="flex gap-1">
                              <Button variant="ghost" size="sm" onClick={() => moveContentItem(index, 'up')}><ArrowUp className="w-4 h-4" /></Button>
                              <Button variant="ghost" size="sm" onClick={() => moveContentItem(index, 'down')}><ArrowDown className="w-4 h-4" /></Button>
                              <Button variant="ghost" size="sm" onClick={() => removeContentItem(index)} className="text-red-500 hover:text-red-600"><Trash2 className="w-4 h-4" /></Button>
                            </div>
                          </div>
                          <div className="grid md:grid-cols-2 gap-4">
                            {schema.fields.map((field) => (
                              <div key={field.name} className={field.type === 'textarea' || field.type === 'image' ? 'md:col-span-2' : ''}>
                                <label className="text-xs font-mono text-foreground/60 mb-1 block">{field.label}</label>
                                {field.type === 'textarea' ? (
                                  <textarea
                                    value={item.content[field.name] || ''}
                                    onChange={(e) => updateContentItem(index, field.name, e.target.value)}
                                    className="w-full h-24 px-3 py-2 border border-input bg-background rounded-md resize-none text-foreground"
                                  />
                                ) : field.type === 'image' ? (
                                  <div>
                                    <Input
                                      value={item.content[field.name] || ''}
                                      onChange={(e) => updateContentItem(index, field.name, e.target.value)}
                                      placeholder="https://example.com/image.jpg"
                                    />
                                    <input
                                      type="file"
                                      accept="image/*"
                                      onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (!file) return;
                                        if (file.size > 2 * 1024 * 1024) {
                                          toast({ title: 'Image too large', description: 'Please use an image under 2 MB or paste a URL.', variant: 'destructive' });
                                          return;
                                        }
                                        const reader = new FileReader();
                                        reader.onload = () => updateContentItem(index, field.name, String(reader.result || ''));
                                        reader.readAsDataURL(file);
                                      }}
                                      className="mt-2 text-xs"
                                    />
                                    {item.content[field.name] && (
                                      <img src={item.content[field.name]} alt="Preview" className="mt-2 h-24 object-cover rounded border border-foreground/10" />
                                    )}
                                  </div>
                                ) : (
                                  <Input
                                    value={item.content[field.name] || ''}
                                    onChange={(e) => updateContentItem(index, field.name, e.target.value)}
                                  />
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}

                    <Button variant="outline" onClick={() => addContentItem(selectedSection)} className="w-full border-dashed">
                      <Plus className="w-4 h-4 mr-2" /> Add {PAGE_SCHEMAS[activeTab]?.find(s => s.key === selectedSection)?.label} Item
                    </Button>
                  </div>
                )}

                {/* Save button */}
                <div className="mt-8 flex justify-end">
                  <Button onClick={saveContent} disabled={contentSaving} className="bg-accent hover:bg-accent/90">
                    {contentSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                    Save & Publish
                  </Button>
                </div>

                {!selectedSection && (
                  <div className="text-center py-16 text-foreground/60">
                    <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p className="mb-2">Select a section above to edit content for the {activeTab} page</p>
                    <p className="text-sm">All current website content is pre-loaded. Edit, reorder, add or delete items, then click Save & Publish.</p>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default Admin;
