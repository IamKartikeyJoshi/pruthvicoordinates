import { z } from 'zod';

// Common validation patterns
const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,4}[-\s.]?[0-9]{1,9}$/;

// Contact form validation
export const contactFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters'),
  email: z
    .string()
    .trim()
    .email('Please enter a valid email address')
    .max(255, 'Email must be less than 255 characters'),
  phone: z
    .string()
    .trim()
    .min(10, 'Phone number must be at least 10 digits')
    .max(20, 'Phone number is too long')
    .regex(phoneRegex, 'Please enter a valid phone number'),
  projectType: z
    .string()
    .min(1, 'Please select a project type'),
  location: z
    .string()
    .max(200, 'Location must be less than 200 characters')
    .optional()
    .or(z.literal('')),
  message: z
    .string()
    .max(1000, 'Message must be less than 1000 characters')
    .optional()
    .or(z.literal('')),
});

// Appointment form validation
export const appointmentFormSchema = z.object({
  clientName: z
    .string()
    .trim()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters'),
  clientEmail: z
    .string()
    .trim()
    .email('Please enter a valid email address')
    .max(255, 'Email must be less than 255 characters'),
  clientPhone: z
    .string()
    .trim()
    .min(10, 'Phone number must be at least 10 digits')
    .max(20, 'Phone number is too long')
    .regex(phoneRegex, 'Please enter a valid phone number'),
  projectType: z
    .string()
    .min(1, 'Please select a project type'),
  location: z
    .string()
    .max(200, 'Location must be less than 200 characters')
    .optional()
    .or(z.literal('')),
  appointmentDate: z
    .string()
    .min(1, 'Please select a date'),
  appointmentTime: z
    .string()
    .min(1, 'Please select a time'),
  notes: z
    .string()
    .max(500, 'Notes must be less than 500 characters')
    .optional()
    .or(z.literal('')),
});

// Auth form validation
export const authFormSchema = z.object({
  email: z
    .string()
    .trim()
    .email('Please enter a valid email address'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters'),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;
export type AppointmentFormData = z.infer<typeof appointmentFormSchema>;
export type AuthFormData = z.infer<typeof authFormSchema>;