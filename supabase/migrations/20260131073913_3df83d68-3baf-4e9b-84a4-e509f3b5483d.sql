-- Step 1: Create new 'requests' table for unified public requests
CREATE TABLE public.requests (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  type text NOT NULL CHECK (type IN ('appointment', 'contact')),
  name text NOT NULL,
  phone text NOT NULL,
  email text NOT NULL,
  message text,
  project_type text,
  location text,
  tracking_code text NOT NULL UNIQUE,
  meeting_link text,
  appointment_date date,
  appointment_time time without time zone
);

-- Step 2: Create 'admin_settings' table with single boolean
CREATE TABLE public.admin_settings (
  id integer NOT NULL PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  is_admin_allowed boolean NOT NULL DEFAULT true
);

-- Insert default admin setting
INSERT INTO public.admin_settings (id, is_admin_allowed) VALUES (1, true);

-- Step 3: Enable RLS on both tables
ALTER TABLE public.requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_settings ENABLE ROW LEVEL SECURITY;

-- Step 4: RLS policies for requests - full public access (insert + select)
CREATE POLICY "Anyone can insert requests"
ON public.requests FOR INSERT
WITH CHECK (true);

CREATE POLICY "Anyone can view requests"
ON public.requests FOR SELECT
USING (true);

CREATE POLICY "Anyone can update requests"
ON public.requests FOR UPDATE
USING (true);

CREATE POLICY "Anyone can delete requests"
ON public.requests FOR DELETE
USING (true);

-- Step 5: RLS policies for admin_settings - public read only
CREATE POLICY "Anyone can read admin settings"
ON public.admin_settings FOR SELECT
USING (true);

CREATE POLICY "Anyone can update admin settings"
ON public.admin_settings FOR UPDATE
USING (true);

-- Step 6: Drop old tables and function
DROP TABLE IF EXISTS public.appointments CASCADE;
DROP TABLE IF EXISTS public.contact_submissions CASCADE;
DROP TABLE IF EXISTS public.user_roles CASCADE;
DROP TYPE IF EXISTS public.app_role CASCADE;
DROP FUNCTION IF EXISTS public.has_role CASCADE;