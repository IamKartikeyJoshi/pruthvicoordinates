// WhatsApp message templates for appointment and contact confirmations

interface AppointmentDetails {
  clientName: string;
  clientPhone: string;
  surveyType: string;
  date?: string;
  time?: string;
  location?: string;
  meetingLink?: string;
}

interface ContactDetails {
  clientName: string;
  clientPhone: string;
  surveyType: string;
}

export function generateAppointmentWhatsAppMessage(details: AppointmentDetails): string {
  const {
    clientName,
    surveyType,
    date,
    time,
    location,
    meetingLink,
  } = details;

  let message = `Namaste ${clientName},

This is to confirm your appointment for ${surveyType} with Pruthvi Coordinates.

Appointment Details:
Date: ${date || 'To be confirmed'}
Time: ${time || 'To be confirmed'}
Location: ${location || 'To be confirmed'}`;

  if (meetingLink) {
    message += `

Meeting Link:
${meetingLink}`;
  }

  message += `

We appreciate the opportunity to be of service. Should you have any questions or need to reschedule, please do not hesitate to contact us.

Warm regards,
Pruthvi Coordinates
Government Approved Surveyors`;

  return message;
}

export function generateContactWhatsAppMessage(details: ContactDetails): string {
  const { clientName, surveyType } = details;

  return `Namaste ${clientName},

Thank you for contacting Pruthvi Coordinates.

We have received your enquiry regarding ${surveyType}, and our team will review it shortly.

Our representative will get in touch with you soon to discuss your requirements in detail.

We appreciate the opportunity to be of service. If you have any additional information to share, please feel free to reply.

Warm regards,
Pruthvi Coordinates
Government Approved Surveyors`;
}

export function createWhatsAppLink(phone: string, message: string): string {
  // Clean phone number - remove spaces, dashes, parentheses
  const cleanPhone = phone.replace(/[\s\-()]/g, '');
  // Encode message for URL
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
}
