/**
 * Generate a professional WhatsApp message for appointment confirmations
 * Uses wa.me click-to-chat method (no API required)
 */

interface AppointmentDetails {
  clientName: string;
  clientPhone: string;
  projectType: string;
  appointmentDate: string;
  appointmentTime: string;
  location?: string | null;
  meetingLink?: string | null;
}

// Format phone number for WhatsApp (remove spaces, dashes, and ensure country code)
const formatPhoneForWhatsApp = (phone: string): string => {
  // Remove all non-numeric characters
  let cleaned = phone.replace(/\D/g, '');
  
  // If starts with 0, assume India and replace with 91
  if (cleaned.startsWith('0')) {
    cleaned = '91' + cleaned.substring(1);
  }
  
  // If no country code (less than 12 digits), assume India (+91)
  if (cleaned.length === 10) {
    cleaned = '91' + cleaned;
  }
  
  return cleaned;
};

// Format date for display
const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};

// Format time for display (convert 24h to 12h)
const formatTime = (timeStr: string): string => {
  const [hours, minutes] = timeStr.split(':');
  const hour = parseInt(hours, 10);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 || 12;
  return `${hour12}:${minutes} ${ampm}`;
};

// Get survey type label
const getSurveyLabel = (type: string): string => {
  const labels: Record<string, string> = {
    'topographical': 'Topographical Survey',
    'boundary': 'Boundary Demarcation Survey',
    'dgps': 'DGPS Control Survey',
    'asbuilt': 'As-Built Survey',
    'contour': 'Contour Mapping',
    'lidar': 'LiDAR Survey',
    'drone': 'Drone Aerial Survey',
    'bathymetry': 'Bathymetry Survey',
    'route': 'Route Survey',
    'other': 'Consultation',
  };
  return labels[type.toLowerCase()] || type;
};

export const generateWhatsAppMessage = (details: AppointmentDetails): string => {
  const surveyLabel = getSurveyLabel(details.projectType);
  const formattedDate = formatDate(details.appointmentDate);
  const formattedTime = formatTime(details.appointmentTime);

  let message = `Namaste ${details.clientName},

This is to confirm your appointment for ${surveyLabel} with Pruthvi Coordinates.

Appointment Details:
Date: ${formattedDate}
Time: ${formattedTime}`;

  if (details.location) {
    message += `\nLocation: ${details.location}`;
  }

  if (details.meetingLink) {
    message += `\n\nMeeting Link: ${details.meetingLink}`;
  }

  message += `

We appreciate the opportunity to be of service. Should you have any questions or need to reschedule, please do not hesitate to contact us.

Warm regards,
Pruthvi Coordinates
Government Approved Surveyors`;

  return message;
};

export const generateWhatsAppLink = (details: AppointmentDetails): string => {
  const phone = formatPhoneForWhatsApp(details.clientPhone);
  const message = generateWhatsAppMessage(details);
  const encodedMessage = encodeURIComponent(message);
  
  return `https://wa.me/${phone}?text=${encodedMessage}`;
};
