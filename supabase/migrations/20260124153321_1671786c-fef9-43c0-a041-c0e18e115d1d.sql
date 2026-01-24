-- Add RLS policy for public read-only access to appointments
CREATE POLICY "Anyone can view appointments (read-only)"
ON public.appointments
FOR SELECT
USING (true);

-- Drop the restrictive admin-only select policy to allow public read
DROP POLICY IF EXISTS "Admins can view appointments" ON public.appointments;