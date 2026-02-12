import nodemailer from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import { env } from "./env";

const smtpOptions: SMTPTransport.Options = {
  host: env.smtpHost,
  port: Number(env.smtpPort),
  secure: env.smtpSecure, // false for 587
  auth: {
    user: env.smtpUser,
    pass: env.smtpPass,
  },
  connectionTimeout: 60_000,
  greetingTimeout: 30_000,
  socketTimeout: 60_000,
};

const transporter = nodemailer.createTransport(smtpOptions);

export default transporter;
