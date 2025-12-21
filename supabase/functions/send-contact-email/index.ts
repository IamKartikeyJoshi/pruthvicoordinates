import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const ADMIN_EMAIL = "luciferofof@gmail.com";
const FROM_EMAIL = "Pruthvi Survey <onboarding@resend.dev>";

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
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const data: ContactEmailRequest = await req.json();

    // Validation
    if (!data.name || !data.email || !data.phone || !data.projectType || !data.referenceCode) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      return new Response(
        JSON.stringify({ error: "Invalid email format" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    console.log("Sending emails for:", data.email);

    // SEND BOTH EMAILS TOGETHER
    const [adminRes, clientRes] = await Promise.all([
      // ADMIN EMAIL
      fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: FROM_EMAIL,
          to: [ADMIN_EMAIL],
          reply_to: data.email,
          subject: `New Project Inquiry: ${data.projectType} - ${data.name}`,
          html: `
            <h2>New Project Inquiry</h2>
            <p><strong>Reference:</strong> ${data.referenceCode}</p>
            <p><strong>Name:</strong> ${data.name}</p>
            <p><strong>Email:</strong> ${data.email}</p>
            <p><strong>Phone:</strong> ${data.phone}</p>
            <p><strong>Project Type:</strong> ${data.projectType}</p>
            ${data.location ? `<p><strong>Location:</strong> ${data.location}</p>` : ""}
            ${data.message ? `<p><strong>Message:</strong><br/>${data.message}</p>` : ""}
          `,
        }),
      }),

      // USER CONFIRMATION EMAIL
      fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: FROM_EMAIL,
          to: [data.email],
          subject: `We received your inquiry – ${data.referenceCode}`,
          html: `
            <h2>Thank you, ${data.name}!</h2>
            <p>We have received your inquiry. Our team will contact you shortly.</p>
            <p><strong>Reference Code:</strong> ${data.referenceCode}</p>
            <p><strong>Project Type:</strong> ${data.projectType}</p>
            ${data.location ? `<p><strong>Location:</strong> ${data.location}</p>` : ""}
            <p>Regards,<br/>Pruthvi Survey</p>
          `,
        }),
      }),
    ]);

    if (!adminRes.ok || !clientRes.ok) {
      console.error("Email failed");
      return new Response(
        JSON.stringify({ error: "Email delivery failed" }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });

  } catch (error) {
    console.error("Send email error:", error);
    return new Response(
      JSON.stringify({ error: "Server error" }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
