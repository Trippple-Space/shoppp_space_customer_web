import { useState } from 'react';
import { toast } from 'sonner';

type NewsletterMode = 'full' | 'email-only';

type UseNewsletterSubscribeOptions = {
  mode: NewsletterMode;
};

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const useNewsletterSubscribe = ({ mode }: UseNewsletterSubscribeOptions) => {
  const [loading, setLoading] = useState(false);
  const [newsletterError, setNewsletterError] = useState('');

  const clearNewsletterError = () => setNewsletterError('');

  const handleNewsletterSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    setNewsletterError('');
    setLoading(true);

    const form = e.currentTarget;
    const formData = new FormData(form);

    const firstName = formData.get('firstName');
    const lastName = formData.get('lastName');
    const email = formData.get('email');

    const firstNameValue =
      typeof firstName === 'string' ? firstName.trim() : '';
    const lastNameValue = typeof lastName === 'string' ? lastName.trim() : '';
    const emailValue = typeof email === 'string' ? email.trim() : '';

    if (!emailValue) {
      setNewsletterError('Email is required');
      setLoading(false);
      return;
    }

    if (mode === 'full' && (!firstNameValue || !lastNameValue)) {
      setNewsletterError('All fields are required');
      setLoading(false);
      return;
    }

    if (!emailRegex.test(emailValue)) {
      setNewsletterError('Please enter a valid email address');
      setLoading(false);
      return;
    }

    const fullName = `${firstNameValue} ${lastNameValue}`.trim();

    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: emailValue,
          ...(fullName ? { name: fullName } : {}),
        }),
      });

      if (res.ok) {
        toast.success('Subscribed successfully');
        form.reset();
      } else {
        toast.error('Something went wrong. Try again.');
      }
    } catch {
      toast.error('Something went wrong. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    newsletterError,
    clearNewsletterError,
    handleNewsletterSubmit,
  };
};

export default useNewsletterSubscribe;
