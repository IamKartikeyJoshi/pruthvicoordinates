import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
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

    const { date } = await req.json()

    if (!date) {
      return new Response(
        JSON.stringify({ error: 'Date is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get all booked time slots for the given date (only non-cancelled appointments)
    const { data, error } = await supabase
      .from('requests')
      .select('appointment_time')
      .eq('type', 'appointment')
      .eq('appointment_date', date)
      .neq('status', 'cancelled')

    if (error) {
      return new Response(
        JSON.stringify({ error: 'Failed to check availability' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const bookedTimes = (data || []).map((r: any) => r.appointment_time)

    return new Response(
      JSON.stringify({ bookedTimes }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (err) {
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
