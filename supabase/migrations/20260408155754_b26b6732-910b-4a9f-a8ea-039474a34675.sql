
-- Admin Expenses
CREATE TABLE public.admin_expenses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  amount NUMERIC(12,2) NOT NULL DEFAULT 0,
  category TEXT NOT NULL DEFAULT 'general',
  expense_date DATE NOT NULL DEFAULT CURRENT_DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.admin_expenses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Deny all public access to admin_expenses" ON public.admin_expenses FOR ALL TO anon, authenticated USING (false) WITH CHECK (false);
CREATE TRIGGER update_admin_expenses_updated_at BEFORE UPDATE ON public.admin_expenses FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Admin Checklist
CREATE TABLE public.admin_checklist (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  checked BOOLEAN NOT NULL DEFAULT false,
  category TEXT NOT NULL DEFAULT 'general',
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.admin_checklist ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Deny all public access to admin_checklist" ON public.admin_checklist FOR ALL TO anon, authenticated USING (false) WITH CHECK (false);
CREATE TRIGGER update_admin_checklist_updated_at BEFORE UPDATE ON public.admin_checklist FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Admin Todos (Kanban)
CREATE TABLE public.admin_todos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'todo',
  priority TEXT NOT NULL DEFAULT 'medium',
  due_date DATE,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.admin_todos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Deny all public access to admin_todos" ON public.admin_todos FOR ALL TO anon, authenticated USING (false) WITH CHECK (false);
CREATE TRIGGER update_admin_todos_updated_at BEFORE UPDATE ON public.admin_todos FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Admin Notes
CREATE TABLE public.admin_notes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL DEFAULT '',
  content TEXT NOT NULL DEFAULT '',
  color TEXT NOT NULL DEFAULT 'default',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.admin_notes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Deny all public access to admin_notes" ON public.admin_notes FOR ALL TO anon, authenticated USING (false) WITH CHECK (false);
CREATE TRIGGER update_admin_notes_updated_at BEFORE UPDATE ON public.admin_notes FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Admin Calendar Events
CREATE TABLE public.admin_calendar_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE,
  color TEXT NOT NULL DEFAULT 'accent',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.admin_calendar_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Deny all public access to admin_calendar_events" ON public.admin_calendar_events FOR ALL TO anon, authenticated USING (false) WITH CHECK (false);
CREATE TRIGGER update_admin_calendar_events_updated_at BEFORE UPDATE ON public.admin_calendar_events FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
