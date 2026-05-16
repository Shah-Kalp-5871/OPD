export interface NotificationTemplate {
  subject: string;
  body: string;
}

export const TEMPLATES: Record<string, NotificationTemplate> = {
  APPOINTMENT_CONFIRMED: {
    subject: 'Appointment Confirmed - MedFlow',
    body: 'Dear {{patientName}}, your appointment with Dr. {{doctorName}} is confirmed for {{appointmentTime}}.',
  },
  APPOINTMENT_REMINDER: {
    subject: 'Appointment Reminder - MedFlow',
    body: 'Dear {{patientName}}, this is a reminder for your appointment tomorrow at {{appointmentTime}}.',
  },
  QUEUE_TOKEN_READY: {
    subject: 'Your Turn is Coming Up - MedFlow',
    body: 'Dear {{patientName}}, your token {{tokenNumber}} is now active. Please proceed to the waiting area.',
  },
  LAB_REPORT_READY: {
    subject: 'Lab Report Ready - MedFlow',
    body: 'Dear {{patientName}}, your lab reports are now ready. You can view them on the patient portal.',
  },
  BILL_PAYMENT_RECEIPT: {
    subject: 'Payment Receipt - MedFlow',
    body: 'Dear {{patientName}}, thank you for your payment of {{amount}}. Your bill ID is {{billNumber}}.',
  },
  PRESCRIPTION_READY: {
    subject: 'Prescription Ready - MedFlow',
    body: 'Dear {{patientName}}, your prescription is ready. You can collect your medicines from the pharmacy.',
  },
  OTP_LOGIN: {
    subject: 'Login OTP - MedFlow Patient Portal',
    body: 'Your OTP for MedFlow Patient Portal is {{otp}}. Valid for 10 minutes.',
  },
};

export function compileTemplate(templateName: string, data: Record<string, any>): NotificationTemplate {
  const template = TEMPLATES[templateName];
  if (!template) {
    throw new Error(`Template ${templateName} not found`);
  }

  let body = template.body;
  let subject = template.subject;

  Object.entries(data).forEach(([key, value]) => {
    const regex = new RegExp(`{{${key}}}`, 'g');
    body = body.replace(regex, String(value));
    subject = subject.replace(regex, String(value));
  });

  return { subject, body };
}
