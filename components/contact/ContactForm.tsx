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
      // Add your form submission logic here
      toast({
        title: t.success,
      });
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
          placeholder={t.firstName}
          required
          disabled={isSubmitting}
        />
        <Input
          type="text"
          placeholder={t.lastName}
          required
          disabled={isSubmitting}
        />
      </div>
      <Input
        type="email"
        placeholder={t.email}
        required
        disabled={isSubmitting}
      />
      <Input
        type="tel"
        placeholder={t.phone}
        disabled={isSubmitting}
      />
      <Input
        type="text"
        placeholder={t.subject}
        required
        disabled={isSubmitting}
      />
      <Textarea
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