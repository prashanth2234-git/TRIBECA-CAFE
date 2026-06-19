import nodemailer from "nodemailer";
import { env } from "../config/env.js";

export function createTransport() {
  if (!env.smtpHost || !env.smtpUser || !env.smtpPass) return null;
  return nodemailer.createTransport({
    host: env.smtpHost,
    port: env.smtpPort,
    secure: env.smtpPort === 465,
    auth: { user: env.smtpUser, pass: env.smtpPass }
  });
}

export async function sendAdminNotification(subject, html) {
  const transport = createTransport();
  if (!transport || !env.adminEmail) return false;
  await transport.sendMail({
    from: env.mailFrom,
    to: env.adminEmail,
    subject,
    html
  });
  return true;
}
