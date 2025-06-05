import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import WelcomeEmail from '@/emails/WelcomeEmail';
import { render } from '@react-email/render';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { email, username } = await request.json();

    if (!email || !username) {
      return NextResponse.json(
        { error: 'Email and username are required' },
        { status: 400 }
      );
    }

    const emailHtml = await render(WelcomeEmail({ username }));

    const data = await resend.emails.send({
      from: 'DormParty <fredrickf@dormparty.live>',
      to: email,
      subject: 'Welcome to DormParty!',
      html: emailHtml,
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error sending welcome email:', error);
    return NextResponse.json(
      { error: 'Failed to send welcome email' },
      { status: 500 }
    );
  }
} 