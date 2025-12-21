import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const ADMIN_EMAIL = "pruthvinay@gmail.com";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface AppointmentEmailRequest {
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  projectType: string;
  location?: string;
  appointmentDate: string;
  appointmentTime: string;
  notes?: string;
}

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-IN', { 
    weekday: 'long', 
    year: 'numeric',
    month: 'long', 
    day: 'numeric' 
  });
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const data: AppointmentEmailRequest = await req.json();
    console.log("Received appointment request:", data);

    // Send notification to admin
    const adminEmailRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Pruthvi Survey <onboarding@resend.dev>",
        to: [ADMIN_EMAIL],
        subject: `New Appointment Request: ${data.projectType} - ${data.clientName}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #1a1a1a; border-bottom: 2px solid #ff3333; padding-bottom: 10px;">
              New Appointment Request
            </h1>
            
            <div style="background: #f4f1ea; padding: 20px; margin: 20px 0;">
              <p style="margin: 0; color: #666; font-size: 12px;">REQUESTED DATE & TIME</p>
              <p style="margin: 5px 0 0; font-size: 18px; color: #1a1a1a; font-weight: bold;">
                ${formatDate(data.appointmentDate)} at ${data.appointmentTime}
              </p>
            </div>

            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #666;">Client Name</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-weight: bold;">${data.clientName}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #666;">Email</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee;"><a href="mailto:${data.clientEmail}">${data.clientEmail}</a></td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #666;">Phone</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee;"><a href="tel:${data.clientPhone}">${data.clientPhone}</a></td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #666;">Project Type</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #ff3333; font-weight: bold;">${data.projectType}</td>
              </tr>
              ${data.location ? `
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #666;">Location</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee;">${data.location}</td>
              </tr>
              ` : ''}
            </table>

            ${data.notes ? `
            <div style="margin-top: 20px;">
              <p style="color: #666; font-size: 12px; margin-bottom: 5px;">CLIENT NOTES</p>
              <p style="background: #fff; padding: 15px; border-left: 3px solid #ff3333; margin: 0;">${data.notes}</p>
            </div>
            ` : ''}

            <p style="color: #999; font-size: 12px; margin-top: 30px; text-align: center;">
              Please confirm this appointment within 24 hours.
            </p>
          </div>
        `,
      }),
    });

    // Send confirmation to client
    const clientEmailRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Pruthvi Survey <onboarding@resend.dev>",
        to: [data.clientEmail],
        subject: `Appointment Request Received - ${formatDate(data.appointmentDate)}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #1a1a1a; border-bottom: 2px solid #ff3333; padding-bottom: 10px;">
              Thank You, ${data.clientName}!
            </h1>
            
            <p style="font-size: 16px; line-height: 1.6; color: #333;">
              Your appointment request has been received. Our team will review your request and confirm within 24 hours.
            </p>

            <div style="background: #f4f1ea; padding: 20px; margin: 20px 0; text-align: center;">
              <p style="margin: 0; color: #666; font-size: 12px;">REQUESTED APPOINTMENT</p>
              <p style="margin: 5px 0 0; font-size: 20px; color: #1a1a1a; font-weight: bold;">
                ${formatDate(data.appointmentDate)}
              </p>
              <p style="margin: 5px 0 0; font-size: 16px; color: #ff3333;">
                at ${data.appointmentTime}
              </p>
            </div>

            <h3 style="color: #1a1a1a;">Appointment Details</h3>
            <ul style="color: #666; line-height: 1.8;">
              <li><strong>Project Type:</strong> ${data.projectType}</li>
              ${data.location ? `<li><strong>Location:</strong> ${data.location}</li>` : ''}
            </ul>

            <p style="font-size: 14px; color: #666; margin-top: 30px;">
              If you have any urgent questions, please call us at <strong>+91 98765 43210</strong>
            </p>

            <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; text-align: center; color: #999; font-size: 12px;">
              <p>Pruthvi Survey</p>
              <p>402, Titanium City Center, Ahmedabad</p>
            </div>
          </div>
        `,
      }),
    });

    const adminResult = await adminEmailRes.json();
    const clientResult = await clientEmailRes.json();

    console.log("Appointment emails sent:", { adminResult, clientResult });

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error in send-appointment-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
