import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { email, name, orderId } = await request.json();

    if (!email || !name || !orderId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL as string || 'Health Action Journey <hello@yourdomain.com>',
      to: [email],
      subject: 'Welcome to the 21-Day Health Action Journey!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
          <h2 style="color: #2563eb;">Payment Confirmed!</h2>
          <p>Hi ${name},</p>
          <p>Your enrollment in the 21-Day Health Action Journey is confirmed. We are thrilled to have you on board!</p>
          <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0;"><strong>Amount Paid:</strong> ₹2</p>
            <p style="margin: 5px 0 0 0;"><strong>Order ID:</strong> ${orderId}</p>
          </div>
          <p>If you haven't already, please join our official WhatsApp group for all important updates regarding the cohort.</p>
          <p>Best regards,<br/>The Health Action Journey Team</p>
        </div>
      `,
    });

    if (error) {
      return NextResponse.json({ error }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error sending receipt:', error);
    return NextResponse.json({ error: 'Error sending receipt' }, { status: 500 });
  }
}
