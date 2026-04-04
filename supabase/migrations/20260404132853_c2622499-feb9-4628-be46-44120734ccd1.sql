
-- 1. Create site_content table for dynamic page content
CREATE TABLE public.site_content (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  page TEXT NOT NULL,
  section_key TEXT NOT NULL,
  content JSONB NOT NULL DEFAULT '{}'::jsonb,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;

-- No public access policies - only service role via edge functions

-- 2. Add status column to requests
ALTER TABLE public.requests ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'pending';

-- 3. Fix admin_sessions RLS - explicitly deny all public access
CREATE POLICY "Deny all public access to admin_sessions"
ON public.admin_sessions
FOR ALL
TO anon, authenticated
USING (false)
WITH CHECK (false);

-- 4. Fix requests RLS - explicitly deny SELECT for public
CREATE POLICY "Deny public select on requests"
ON public.requests
FOR SELECT
TO anon, authenticated
USING (false);

-- 5. Deny public update on requests
CREATE POLICY "Deny public update on requests"
ON public.requests
FOR UPDATE
TO anon, authenticated
USING (false)
WITH CHECK (false);

-- 6. Deny public delete on requests
CREATE POLICY "Deny public delete on requests"
ON public.requests
FOR DELETE
TO anon, authenticated
USING (false);

-- 7. Add trigger for updated_at on site_content
CREATE TRIGGER update_site_content_updated_at
BEFORE UPDATE ON public.site_content
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
