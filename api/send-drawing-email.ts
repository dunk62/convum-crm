import type { VercelRequest, VercelResponse } from '@vercel/node';
import nodemailer from 'nodemailer';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    // CORS headers
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { to, subject, body, modelNo, fileCount } = req.body;

        if (!to || !subject || !body) {
            return res.status(400).json({ error: 'Missing required fields: to, subject, body' });
        }

        // Email configuration
        const emailUser = process.env.EMAIL_USER;
        const emailPassword = process.env.EMAIL_APP_PASSWORD;

        if (!emailUser || !emailPassword) {
            return res.status(500).json({ error: 'Email configuration not set' });
        }

        // Create transporter for Gmail with explicit SMTP settings
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false, // use STARTTLS
            auth: {
                user: emailUser,
                pass: emailPassword,
            },
        });

        // Send email
        const mailOptions = {
            from: `"CONVUM 영업팀" <${emailUser}>`,
            to: to,
            subject: subject,
            text: body,
        };

        await transporter.sendMail(mailOptions);

        return res.status(200).json({
            success: true,
            message: `도면 패키지가 ${to}로 발송되었습니다.`,
            details: {
                modelNo,
                fileCount,
                sentAt: new Date().toISOString()
            }
        });

    } catch (error: any) {
        console.error('Email send error:', error);
        return res.status(500).json({
            error: 'Failed to send email',
            details: error.message,
            code: error.code,
            response: error.response
        });
    }
}
