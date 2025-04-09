import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { z } from 'zod';

const contactSchema = z.object({
  firstName: z.string().min(2).max(50),
  lastName: z.string().min(2).max(50),
  email: z.string().email(),
  phone: z.string().optional(),
  subject: z.string().min(2).max(100),
  message: z.string().min(10).max(1000)
});

export async function POST(request: Request) {
  console.log('API route called:', request.method, request.url);

  if (!process.env.RESEND_API_KEY) {
    console.error('RESEND_API_KEY environment variable is not set!');
    return NextResponse.json(
      { error: 'Email service configuration error' },
      { status: 500 }
    );
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  
  try {
    const body = await request.json();
    console.log('Received body:', body);
    
    const result = contactSchema.safeParse(body);
    
    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid data', details: result.error.errors },
        { status: 400 }
      );
    }

    const { firstName, lastName, email, phone, subject, message } = result.data;

    const emailContent = `
      Name: ${firstName} ${lastName}
      Email: ${email}
      Phone: ${phone || 'Not provided'}
      Subject: ${subject}
      Message: ${message}
    `;
    
    console.log('Sending email with data:', {
      from: 'Fala Farm <onboarding@resend.dev>',
      to: process.env.CONTACT_EMAIL || 'website.contact.smtp@gmail.com',
      subject: `New Contact - ${firstName} ${lastName}`,
      text: emailContent,
      replyTo: email
    });

    const { data, error } = await resend.emails.send({
      from: 'Fala Farm <onboarding@resend.dev>',
      to: [process.env.CONTACT_EMAIL || 'website.contact.smtp@gmail.com'],
      subject: `New Contact - ${firstName} ${lastName}`,
      text: emailContent,
      replyTo: email
    });

    console.log('Resend response:', { data, error });

    if (error) {
      console.error('Email sending error:', error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, data },
      { status: 200 }
    );
    
  } catch (error) {
    console.error('API error details:', error);
    return NextResponse.json(
      { error: 'An error occurred while sending the email' },
      { status: 500 }
    );
  }
} 