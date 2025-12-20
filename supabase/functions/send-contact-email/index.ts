import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

// Configurable admin email - change this to update recipient
const ADMIN_EMAIL = "pruthvinay@gmail.com";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ContactEmailRequest {
  name: string;
  email: string;
  phone: string;
  projectType: string;
  location?: string;
  message?: string;
  referenceCode: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const data: ContactEmailRequest = await req.json();

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
        subject: `New Project Inquiry: ${data.projectType} - ${data.name}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #1a1a1a; border-bottom: 2px solid #ff3333; padding-bottom: 10px;">
              New Project Inquiry
            </h1>
            
            <div style="background: #f4f1ea; padding: 20px; margin: 20px 0;">
              <p style="margin: 0; color: #666; font-size: 12px;">REFERENCE CODE</p>
              <p style="margin: 5px 0 0; font-family: monospace; font-size: 18px; color: #1a1a1a;">${data.referenceCode}</p>
            </div>

            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #666;">Name</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-weight: bold;">${data.name}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #666;">Email</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee;"><a href="mailto:${data.email}">${data.email}</a></td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #666;">Phone</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee;"><a href="tel:${data.phone}">${data.phone}</a></td>
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

            ${data.message ? `
            <div style="margin-top: 20px;">
              <p style="color: #666; font-size: 12px; margin-bottom: 5px;">MESSAGE</p>
              <p style="background: #fff; padding: 15px; border-left: 3px solid #ff3333; margin: 0;">${data.message}</p>
            </div>
            ` : ''}

            <p style="color: #999; font-size: 12px; margin-top: 30px; text-align: center;">
              This email was sent from the Pruthvi Survey website contact form.
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
        to: [data.email],
        subject: `We received your inquiry - ${data.referenceCode}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #1a1a1a; border-bottom: 2px solid #ff3333; padding-bottom: 10px;">
              Thank You, ${data.name}!
            </h1>
            
            <p style="font-size: 16px; line-height: 1.6; color: #333;">
              We have received your project inquiry and our team will review your requirements within 24 hours.
            </p>

            <div style="background: #f4f1ea; padding: 20px; margin: 20px 0; text-align: center;">
              <p style="margin: 0; color: #666; font-size: 12px;">YOUR REFERENCE CODE</p>
              <p style="margin: 5px 0 0; font-family: monospace; font-size: 24px; color: #1a1a1a; letter-spacing: 2px;">${data.referenceCode}</p>
            </div>

            <h3 style="color: #1a1a1a;">Your Inquiry Summary</h3>
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

    console.log("Emails sent:", { adminResult, clientResult });

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error in send-contact-email function:", error);
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
