-- Drop admin_settings table (boolean-based access)
DROP TABLE IF EXISTS public.admin_settings;

-- Create admin_sessions table for session-based authentication
CREATE TABLE public.admin_sessions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_token text NOT NULL UNIQUE,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  expires_at timestamp with time zone NOT NULL
);

-- Enable RLS on admin_sessions - no public access
ALTER TABLE public.admin_sessions ENABLE ROW LEVEL SECURITY;

-- No public policies for admin_sessions - only accessible via service role

-- Drop all existing RLS policies on requests table
DROP POLICY IF EXISTS "Anyone can delete requests" ON public.requests;
DROP POLICY IF EXISTS "Anyone can insert requests" ON public.requests;
DROP POLICY IF EXISTS "Anyone can update requests" ON public.requests;
DROP POLICY IF EXISTS "Anyone can view requests" ON public.requests;

-- Create strict RLS policies for requests table
-- Public can only INSERT (submit new requests)
CREATE POLICY "Public can insert requests"
ON public.requests
FOR INSERT
WITH CHECK (true);

-- No public SELECT, UPDATE, or DELETE - all access via edge functions with service role