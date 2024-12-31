import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { z } from 'zod';

const resend = new Resend(process.env.RESEND_API_KEY);

// Validációs séma definiálása
const contactSchema = z.object({
  firstName: z.string().min(2).max(50),
  lastName: z.string().min(2).max(50),
  email: z.string().email(),
  phone: z.string().optional(),
  subject: z.string().min(2).max(100),
  message: z.string().min(10).max(1000)
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validáció
    const result = contactSchema.safeParse(body);
    
    if (!result.success) {
      return NextResponse.json(
        { error: 'Érvénytelen adatok' },
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
    
    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: process.env.CONTACT_EMAIL || '',
      subject: `${firstName} ${lastName} - ${subject}`,
      text: emailContent,
      replyTo: email,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Hiba történt az üzenet küldésekor' },
      { status: 500 }
    );
  }
}