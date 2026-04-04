import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-admin-token',
}

async function verifyAdminSession(supabase: any, sessionToken: string): Promise<boolean> {
  if (!sessionToken) return false
  const { data, error } = await supabase
    .from('admin_sessions')
    .select('expires_at')
    .eq('session_token', sessionToken)
    .single()
  if (error || !data) return false
  return new Date(data.expires_at) > new Date()
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    const body = await req.json()
    const { trackingCode, newDate, newTime } = body
    const sessionToken = req.headers.get('x-admin-token')
    const isAdmin = sessionToken ? await verifyAdminSession(supabase, sessionToken) : false

    if (!trackingCode || !newDate || !newTime) {
      return new Response(
        JSON.stringify({ error: 'trackingCode, newDate, and newTime are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Fetch the request
    const { data: request, error: fetchError } = await supabase
      .from('requests')
      .select('*')
      .eq('tracking_code', trackingCode)
      .eq('type', 'appointment')
      .single()

    if (fetchError || !request) {
      return new Response(
        JSON.stringify({ error: 'Appointment not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (request.status === 'cancelled') {
      return new Response(
        JSON.stringify({ error: 'Cannot reschedule a cancelled appointment' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const now = new Date()
    const currentAppointmentDate = new Date(request.appointment_date + 'T00:00:00')
    const newAppointmentDate = new Date(newDate + 'T00:00:00')

    if (!isAdmin) {
      // User restrictions:
      // 1. Can only reschedule until day prior
      const dayPrior = new Date(currentAppointmentDate)
      dayPrior.setDate(dayPrior.getDate() - 1)
      dayPrior.setHours(23, 59, 59, 999)

      if (now > dayPrior) {
        return new Response(
          JSON.stringify({ error: 'Rescheduling is only allowed until the day before the appointment' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      // 2. User can only postpone (new date must be after current date)
      if (newAppointmentDate < currentAppointmentDate) {
        return new Response(
          JSON.stringify({ error: 'You can only postpone appointments to a later date' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      if (newAppointmentDate.getTime() === currentAppointmentDate.getTime()) {
        // Same date - new time must be later
        if (newTime <= request.appointment_time) {
          return new Response(
            JSON.stringify({ error: 'You can only postpone to a later time' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }
      }
    }

    // Check if new slot is available
    const { data: existing } = await supabase
      .from('requests')
      .select('id')
      .eq('type', 'appointment')
      .eq('appointment_date', newDate)
      .eq('appointment_time', newTime)
      .neq('status', 'cancelled')
      .neq('id', request.id)

    if (existing && existing.length > 0) {
      return new Response(
        JSON.stringify({ error: 'The selected time slot is already booked' }),
        { status: 409, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Update the appointment
    const { error: updateError } = await supabase
      .from('requests')
      .update({
        appointment_date: newDate,
        appointment_time: newTime,
      })
      .eq('id', request.id)

    if (updateError) {
      return new Response(
        JSON.stringify({ error: 'Failed to reschedule appointment' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (err) {
    console.error('Error:', err)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
