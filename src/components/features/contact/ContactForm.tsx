'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, Loader2 } from 'lucide-react';

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

    // Show loading toast
    const loadingToast = toast({
      title: 'Küldés folyamatban...',
      description: <Loader2 className="h-5 w-5 animate-spin text-primary" />,
    });

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
      
      // Use absolute URL to bypass any routing/middleware issues
      const apiUrl = window.location.origin + '/api/contact';
      console.log('Sending request to:', apiUrl);

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(data),
      });

      console.log('Response status:', response.status);
      
      let responseData;
      const contentType = response.headers.get('content-type');
      
      if (contentType && contentType.includes('application/json')) {
        responseData = await response.json();
        console.log('Response data:', responseData);
      } else {
        const text = await response.text();
        console.error('Non-JSON response:', text);
        throw new Error('Server returned invalid response');
      }
      
      if (!response.ok) {
        throw new Error(responseData?.error || 'Unknown error occurred');
      }

      // Dismiss loading toast
      loadingToast.dismiss();

      // Show success toast
      toast({
        title: t.success,
        variant: 'success',
        description: <CheckCircle className="h-5 w-5 text-green-600" />,
      });
      
      (e.target as HTMLFormElement).reset();
    } catch (error) {
      console.error('Form submission error:', error);
      
      // Dismiss loading toast
      loadingToast.dismiss();
      
      toast({
        title: t.error,
        variant: 'destructive',
        description: <span className="text-sm">Kérjük próbálja újra később.</span>,
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