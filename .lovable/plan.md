
# Comprehensive Update Plan

## Phase 1: Database Migration
Create tables and fix security:

### New Tables
- **`site_content`** — Stores dynamic content for Mission, Expertise, Services, Portfolio pages
  - Fields: `page` (mission/expertise/services/portfolio), `section_key`, `content` (JSONB), `order_index`, `created_at`, `updated_at`
  - RLS: No public policies (service role only via edge functions for admin CRUD, public read via edge function)

### Schema Changes
- **`requests`** — Add `status` column (text, default 'pending') for appointment lifecycle management
- Fix RLS: Add explicit `USING (false)` SELECT policy for anon to block public reads

### Security Fixes
- **`admin_sessions`** — Add explicit deny-all policies (no SELECT/INSERT/UPDATE/DELETE for anon)
- Ensure both tables are locked down

## Phase 2: Remove Email Functionality
- Delete `supabase/functions/send-contact-email/`
- Delete `supabase/functions/send-appointment-email/`
- Remove from `supabase/config.toml`
- Remove any email-related code from frontend

## Phase 3: Edge Functions
### New Functions
- **`site-content`** — Public GET (read content by page), Admin POST (CRUD with session auth)
- **`check-availability`** — Public: check if a date/time slot is already booked
- **`reschedule-request`** — Public: reschedule own appointment (postpone only, day prior limit, requires tracking code)
- Update **`admin-requests`** — Add reschedule action (prepone/postpone, no restrictions)

## Phase 4: Frontend Updates

### Admin Dashboard
- Fix logout button styling/functionality
- Add tabs: Requests | Mission | Expertise | Services | Portfolio
- Each content tab shows current page content with inline editing (add/edit/delete/reorder sections)
- GUI-based content management — all sections editable

### Appointment Booking
- Fetch booked slots from `check-availability` edge function
- Disable already-booked date/time combinations
- When admin deletes appointment, slot becomes available again

### Rescheduling
- On TrackRequest page, add "Reschedule" button for appointment requests
- User can only postpone (pick later date/time), only until day prior
- Admin can prepone/postpone freely from dashboard

### Tracking Code (What3Words Style)
- Generate 3-word tracking codes (e.g., "river-mountain-eagle") instead of PRU-XXXXXX
- After submission, show tracking code prominently with:
  - Copy button (copies full website URL, not just code)
  - Track Request button (navigates to /track/code)

### Content Pages (Mission, Expertise, Services, Portfolio)
- Fetch dynamic content from `site-content` edge function
- If no admin content exists, render existing placeholder/hardcoded content
- If admin content exists, replace placeholder with dynamic content

## Phase 5: Security Resolution
- Mark resolved security findings after fixes
- HTML injection finding resolved by removing email functions
- Rate limiting finding resolved by removing email functions
- admin_sessions exposure fixed by RLS
- requests exposure fixed by RLS

## Implementation Order
1. Database migration (single migration with all changes)
2. Delete email edge functions
3. Create/update edge functions
4. Update frontend components
5. Verify and resolve security findings
