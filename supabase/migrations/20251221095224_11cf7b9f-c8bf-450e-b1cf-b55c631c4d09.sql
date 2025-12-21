-- Fix security issue: appointments should only be viewable by admins
DROP POLICY IF EXISTS "Authenticated users can view appointments" ON public.appointments;

CREATE POLICY "Admins can view appointments"
ON public.appointments
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));