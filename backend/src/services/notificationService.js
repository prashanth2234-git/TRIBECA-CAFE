import nodemailer from "nodemailer";
import twilio from "twilio";
import Notification from "../models/Notification.js";

function emailTransport() {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) return null;
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
}

function twilioClient() {
  if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN) return null;
  return twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
}

export async function createInAppNotification({ user, patient, type, subject, message }) {
  return Notification.create({
    user,
    patient,
    channel: "in-app",
    type,
    subject,
    message,
    status: "sent",
    sentAt: new Date()
  });
}

export async function sendEmail({ user, patient, to, type, subject, message }) {
  const record = await Notification.create({ user, patient, channel: "email", type, subject, message });
  const transport = emailTransport();

  if (!transport || !to) {
    record.status = "pending";
    record.error = "Email provider is not configured";
    await record.save();
    return record;
  }

  try {
    await transport.sendMail({
      from: process.env.EMAIL_FROM || "ClinicFlow AI <no-reply@clinicflow.local>",
      to,
      subject,
      text: message
    });
    record.status = "sent";
    record.sentAt = new Date();
  } catch (error) {
    record.status = "failed";
    record.error = error.message;
  }

  await record.save();
  return record;
}

export async function sendWhatsApp({ user, patient, to, type, subject, message }) {
  const record = await Notification.create({ user, patient, channel: "whatsapp", type, subject, message });
  const client = twilioClient();

  if (!client || !to || !process.env.TWILIO_WHATSAPP_FROM) {
    record.status = "pending";
    record.error = "Twilio WhatsApp is not configured";
    await record.save();
    return record;
  }

  try {
    await client.messages.create({
      from: process.env.TWILIO_WHATSAPP_FROM,
      to: to.startsWith("whatsapp:") ? to : `whatsapp:${to}`,
      body: `${subject ? `${subject}\n` : ""}${message}`
    });
    record.status = "sent";
    record.sentAt = new Date();
  } catch (error) {
    record.status = "failed";
    record.error = error.message;
  }

  await record.save();
  return record;
}

export async function notifyAppointmentConfirmation({ user, patient, appointment, doctor }) {
  const subject = "Appointment confirmed";
  const message = `Your appointment ${appointment.appointmentId} with ${doctor.name} is confirmed for ${appointment.date} at ${appointment.timeSlot}.`;
  await createInAppNotification({ user, patient: patient._id, type: "appointment-confirmation", subject, message });
  await sendEmail({ user, patient: patient._id, to: patient.email, type: "appointment-confirmation", subject, message });
}

export async function notifyToken({ user, patient, appointment }) {
  const subject = "Clinic token generated";
  const message = `Your token number is ${appointment.tokenNumber}. Please watch the live queue for updates.`;
  await createInAppNotification({ user, patient: patient._id, type: "token-alert", subject, message });
  await sendWhatsApp({ user, patient: patient._id, to: patient.phone, type: "token-alert", subject, message });
}
