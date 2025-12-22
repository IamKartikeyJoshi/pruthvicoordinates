import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
const ADMIN_EMAIL = "pruthvinay@gmail.com";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ContactEmailRequest {
  name: string;
  email: string;
  phone: string;
  projectType: string;
  message?: string;
  referenceCode: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const data: ContactEmailRequest = await req.json();
    console.log("Received contact form submission:", data);

    // Send notification to admin
    await resend.emails.send({
      from: "Pruthvi Survey <onboarding@resend.dev>",
      to: [ADMIN_EMAIL],
      subject: `New Inquiry from ${data.name}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${data.name}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Phone:</strong> ${data.phone}</p>
        <p><strong>Project Type:</strong> ${data.projectType}</p>
        <p><strong>Message:</strong> ${data.message || "No message provided"}</p>
        <p><strong>Reference Code:</strong> ${data.referenceCode}</p>
      `,
    });

    // Send confirmation to client
    await resend.emails.send({
      from: "Pruthvi Survey <onboarding@resend.dev>",
      to: [data.email],
      subject: "We received your inquiry - Pruthvi Survey",
      html: `
        <h2>Thank you for contacting us, ${data.name}!</h2>
        <p>We have received your inquiry and will get back to you shortly.</p>
        <p><strong>Reference Code:</strong> ${data.referenceCode}</p>
        <p>Best regards,<br>Pruthvi Survey Team</p>
      `,
    });

    console.log("Emails sent successfully");
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });

  } catch (error: any) {
    console.error("Error sending email:", error);
    return new Response(
      JSON.stringify({ error: "Failed to send email" }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
