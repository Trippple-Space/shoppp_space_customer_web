'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { contactUsService } from '../services/contact-us.service';
import { buildSuggestionSlackMessage } from '../utility';

const MIN_MESSAGE_LENGTH = 5;

export default function useSuggestion() {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    const trimmed = message.trim();

    if (!trimmed) {
      toast.error('Please enter your suggestion');
      return;
    }

    if (trimmed.length < MIN_MESSAGE_LENGTH) {
      toast.error(`Suggestion must be at least ${MIN_MESSAGE_LENGTH} characters`);
      return;
    }

    const payload = buildSuggestionSlackMessage({
      message: trimmed,
      pageUrl: typeof window !== 'undefined' ? window.location.href : undefined,
    });

    try {
      setLoading(true);
      await contactUsService.submitContactForm(payload);
      toast.success('Thanks for your suggestion!');
      setMessage('');
      return true;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err?.response?.data?.message || 'Failed to send suggestion');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    message,
    setMessage,
    loading,
    handleSubmit,
    canSubmit: message.trim().length >= MIN_MESSAGE_LENGTH && !loading,
  };
}
