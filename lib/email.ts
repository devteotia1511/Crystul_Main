import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: Number(process.env.SMTP_PORT) === 465, // true for 465, false for others
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function verifyEmailTransport(): Promise<void> {
  try {
    await transporter.verify();
    console.log('Email transport verified: SMTP connection successful');
  } catch (err) {
    console.error('Email transport verification failed:', err);
    throw err;
  }
}

export async function sendEmail({ to, subject, html, text, replyTo, fromName }: { to: string; subject: string; html?: string; text?: string; replyTo?: string; fromName?: string }) {
  const defaultFrom = process.env.SMTP_FROM || process.env.SMTP_USER || '';
  const friendlyFrom = fromName ? `${fromName} via Crystul <${defaultFrom}>` : defaultFrom;

  const mailOptions = {
    from: friendlyFrom,
    to,
    subject,
    text,
    html,
    replyTo,
  } as any;

  const info = await transporter.sendMail(mailOptions);
  console.log('Email sent:', { messageId: info.messageId, accepted: info.accepted, rejected: info.rejected });
  return info;
}