
# Complete Backend Restructuring and UI Updates

## Overview
This plan addresses three main requirements:
1. Complete backend simplification - remove all authentication, roles, and permissions
2. Replace the interactive coordinate display with the uploaded hero image
3. Maintain the existing theme and styling

---

## Part 1: Database Restructuring

### New Single Table: `requests`
Create one unified table to store all public requests (appointments and contacts):

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| created_at | timestamp | Auto-generated |
| type | text | "appointment" or "contact" |
| name | text | Client name |
| phone | text | Client phone |
| email | text | Client email |
| message | text | Message/notes (nullable) |
| project_type | text | Survey type selected (nullable) |
| location | text | Project location (nullable) |
| tracking_code | text | Human-readable code (e.g., PRU-A1B2C3) |
| meeting_link | text | Added by admin for appointments only (nullable) |
| appointment_date | date | For appointments only (nullable) |
| appointment_time | time | For appointments only (nullable) |

### Admin Settings Table: `admin_settings`
| Column | Type | Description |
|--------|------|-------------|
| id | integer | Primary key (always 1) |
| is_admin_allowed | boolean | Controls admin access |

### RLS Policies
- **requests**: Everyone can INSERT and SELECT (public access)
- **admin_settings**: Everyone can SELECT (for checking admin access)

### Migration Steps
1. Create `requests` table with all columns
2. Create `admin_settings` table with `is_admin_allowed = true`
3. Drop old tables: `appointments`, `contact_submissions`, `user_roles`
4. Remove old database functions: `has_role`

---

## Part 2: Frontend Changes

### Files to Create

**1. `/src/pages/TrackRequest.tsx`**
- Public tracking page at `/track/:trackingCode`
- Fetches request by tracking code
- For appointment type with meeting_link: shows "Join Meeting" button
- For appointment type without meeting_link: shows "Meeting link will be added by admin"
- For contact type: no meeting section, just shows request details

**2. `/src/lib/whatsappTemplates.ts`**
- Two message templates based on user's uploaded template:
  - Appointment confirmation template
  - Contact us confirmation template

### Files to Modify

**3. `/src/App.tsx`**
- Remove all authentication context (SimpleAuthProvider, useAuth)
- Add route for `/track/:trackingCode`
- Keep other routes but simplify

**4. `/src/pages/BookAppointment.tsx`**
- Remove authentication dependencies
- After submission, display the tracking code prominently
- Add message: "Your meeting link will be added later by the admin"
- Provide link to `/track/{trackingCode}` for checking status

**5. `/src/components/ContactSection.tsx`**
- Update to use new `requests` table
- Store as type="contact"
- Show tracking code after submission
- Provide link to tracking page

**6. `/src/pages/Auth.tsx`**
- Replace with simple admin check
- Fetch `is_admin_allowed` from `admin_settings`
- If true, redirect to `/admin`
- No login form, just a check

**7. `/src/pages/Admin.tsx`**
- Remove all authentication checks
- Fetch `is_admin_allowed` from `admin_settings`
- If false, show "Admin access disabled"
- If true, show admin dashboard with all requests
- Allow edit/delete of requests
- Allow adding/updating meeting_link for appointments
- Add "Send WhatsApp Confirmation" button using the templates

**8. `/src/components/HeroSection.tsx`**
- Replace `InteractiveCoordinateDisplay` with the uploaded hero image
- Use landscape aspect ratio with proper sizing
- Image will be copied to `src/assets/hero-surveyor.jpg`

### Files to Remove
- `/src/hooks/useAuth.tsx` - No longer needed
- `/src/hooks/useSupabase.tsx` - Simplify to direct import
- `/src/pages/ViewAppointments.tsx` - Replaced by tracking page
- `/src/components/InteractiveCoordinateDisplay.tsx` - Replaced by static hero image

---

## Part 3: WhatsApp Integration

### Message Templates (from user's file)

**Appointment Confirmation:**
```
Namaste {Client Name},

This is to confirm your appointment for {Survey Type} with Pruthvi Coordinates.

Appointment Details:
Date: {Date}
Time: {Time}
Location: {Location}

Meeting Link (if applicable):
{Meeting Link}

We appreciate the opportunity to be of service...
```

**Contact Confirmation:**
```
Namaste {Client Name},

Thank you for contacting Pruthvi Coordinates.

We have received your enquiry regarding {Survey Type}...
```

---

## Part 4: Route Structure

| Route | Purpose |
|-------|---------|
| `/` | Homepage with hero image |
| `/book-appointment` | Public appointment form |
| `/contact` | Contact page with form |
| `/track/:trackingCode` | Public request tracking |
| `/auth` | Admin access check |
| `/admin` | Admin dashboard (if allowed) |

---

## Technical Details

### Tracking Code Format
- Format: `PRU-XXXXXX` (6 alphanumeric characters)
- Generated client-side using: `PRU-${Date.now().toString(36).toUpperCase().slice(-6)}`

### Admin Dashboard Features
1. List all requests (both appointments and contacts)
2. Filter by type (appointment/contact)
3. Edit any request
4. Delete any request
5. Add/update meeting link for appointments
6. "Send WhatsApp Confirmation" button per request

### Theme Preservation
- All existing CSS classes and Tailwind configuration remain unchanged
- Color scheme: warm cream background, ink black text, laser red accent
- Page backgrounds use existing `page-bg` class

---

## Implementation Order

1. Database migration (create new tables, set up RLS)
2. Copy hero image to assets
3. Update HeroSection with static image
4. Create TrackRequest page
5. Create WhatsApp templates utility
6. Update BookAppointment page
7. Update ContactSection
8. Update Auth page (simple admin check)
9. Update Admin page (list and manage requests)
10. Update App.tsx (remove auth, add routes)
11. Clean up unused files
