import nodemailer from "npm:nodemailer";

const ADMIN_EMAIL = "luciferofof@gmail.com";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: process.env.GMAIL_USER,
    clientId: process.env.GMAIL_CLIENT_ID,
    clientSecret: process.env.GMAIL_CLIENT_SECRET,
    refreshToken: process.env.GMAIL_REFRESH_TOKEN,
  },
});

export async function POST(req: Request) {
  try {
    const data = await req.json();

    // send mail to admin
    await transporter.sendMail({
      from: `Pruthvi Survey <${process.env.GMAIL_USER}>`,
      to: ADMIN_EMAIL,
      replyTo: data.email,
      subject: `New Inquiry from ${data.name}`,
      html: `
        <p><b>Name:</b> ${data.name}</p>
        <p><b>Email:</b> ${data.email}</p>
        <p><b>Phone:</b> ${data.phone}</p>
        <p><b>Project:</b> ${data.projectType}</p>
        <p>${data.message || ""}</p>
      `,
    });

    // send confirmation to user
    await transporter.sendMail({
      from: `Pruthvi Survey <${process.env.GMAIL_USER}>`,
      to: data.email,
      subject: "We received your inquiry",
      html: `
        <p>Hi ${data.name},</p>
        <p>We have received your inquiry. We will contact you soon.</p>
        <p><b>Reference:</b> ${data.referenceCode}</p>
        <p>– Pruthvi Survey</p>
      `,
    });

    return new Response(JSON.stringify({ success: true }), { status: 200 });

  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Email failed" }), { status: 500 });
  }
}
