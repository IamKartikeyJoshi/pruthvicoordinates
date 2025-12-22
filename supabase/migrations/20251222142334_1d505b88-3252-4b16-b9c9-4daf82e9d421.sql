-- Add meeting_link column to appointments table for Teams/Zoom links
ALTER TABLE public.appointments
ADD COLUMN meeting_link TEXT;