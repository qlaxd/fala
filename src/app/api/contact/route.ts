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
  // API kulcs ellenőrzése
  if (!process.env.RESEND_API_KEY) {
    console.error('RESEND_API_KEY környezeti változó nincs beállítva!');
    return NextResponse.json(
      { error: 'Email szolgáltatás konfigurációs hiba' },
      { status: 500 }
    );
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  
  console.log('API route called:', request.method, request.url);
  console.log('Request headers:', Object.fromEntries(request.headers));
  
  try {
    const body = await request.json();
    console.log('Received body:', body);
    
    const result = contactSchema.safeParse(body);
    
    if (!result.success) {
      console.error('Validation error:', result.error);
      return Response.json(
        { error: 'Érvénytelen adatok', details: result.error.errors },
        { status: 400 }
      );
    }

    const { firstName, lastName, email, phone, subject, message } = result.data;

    const emailContent = `
      Név: ${firstName} ${lastName}
      Email: ${email}
      Telefon: ${phone || 'Telefon nincs megadva'}
      Tárgy: ${subject}
      Üzenet: ${message}
    `;
    
    const { data, error } = await resend.emails.send({ // Valahol itt lehet szar de nem tudom hogy miért
      from: 'Fala Farm <onboarding@resend.dev>',
      to: [process.env.CONTACT_EMAIL || 'website.contact.smtp@gmail.com'],
      subject: `Új kapcsolatfelvétel - ${firstName} ${lastName}`,
      text: emailContent,
      replyTo: email
    });

    console.log('Resend válasz:', { data, error });

    if (error) {
      console.error('Email küldési hiba:', error);
      throw new Error(error.message);
    }

    return Response.json({ success: true, data });
    
  } catch (error) {
    console.error('Részletes hiba:', error);
    return Response.json(
      { error: 'Hiba történt az email küldése során' },
      { status: 500 }
    );
  }
}