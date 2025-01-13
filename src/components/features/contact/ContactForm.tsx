'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

interface ContactFormProps {
  translations: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    subject: string;
    message: string;
    submit: string;
    success: string;
    error: string;
  };
}

export function ContactForm({ translations: t }: ContactFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData(e.currentTarget);
      const data = {
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        subject: formData.get('subject'),
        message: formData.get('message'),
      };
      
      console.log('Sending request to:', '/api/contact');
      console.log('Request data:', data);

      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(data),
      });

      console.log('Response:', response);
      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers));
      const responseData = await response.json();
      console.log('Response data:', responseData);
      
      if (Error || !response.ok) {
        console.error('Hiba részletek:', responseData);
        throw new Error(responseData.error || 'Ismeretlen hiba történt');
      }

      toast({
        title: t.success,
      });
      
      (e.target as HTMLFormElement).reset();
    } catch (error) {
      toast({
        title: t.error,
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          type="text"
          name="firstName"
          placeholder={t.firstName}
          required
          disabled={isSubmitting}
        />
        <Input
          type="text"
          name="lastName"
          placeholder={t.lastName}
          required
          disabled={isSubmitting}
        />
      </div>
      <Input
        type="email"
        name='email'
        placeholder={t.email}
        required
        disabled={isSubmitting}
      />
      <Input
        type="tel"
        name="phone"
        placeholder={t.phone}
        disabled={isSubmitting}
      />
      <Input
        type="text"
        name='subject'
        placeholder={t.subject}
        required
        disabled={isSubmitting}
      />
      <Textarea
        name='message'
        placeholder={t.message}
        required
        disabled={isSubmitting}
        className="min-h-[150px]"
      />
      <Button 
        type="submit" 
        disabled={isSubmitting}
        className="shadow hover:shadow-md transition-shadow"
      >
        {t.submit}
      </Button>
    </form>
  );
}