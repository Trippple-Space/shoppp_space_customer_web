'use client';

import React, { useState } from 'react';
import { toast } from 'sonner';

const BRAND_COLOR = '#0B9378';

const ContactUsPage = () => {
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!form.fullName.trim()) newErrors.fullName = 'Full name is required';

    if (!form.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = 'Enter a valid email address';
    }

    if (!form.subject.trim()) newErrors.subject = 'Subject is required';

    if (!form.message.trim()) {
      newErrors.message = 'Message cannot be empty';
    } else if (form.message.length < 10) {
      newErrors.message = 'Message is too short';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setIsSubmitting(true);

    try {
      const payload = {
        ...form,
      };

      console.log('Contact form payload:', payload);

      toast.success('Message sent successfully. We’ll get back to you soon!');
      setForm({ fullName: '', email: '', phone: '', subject: '', message: '' });
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex j-content-center bg-#F9FAFB md:px-40 sm:px-24 px-10 py-80">
      <div className="w-full max-w-720 bg-white radius-12 sm:px-40 px-24 sm:py-40 py-24 border border-#00000014">
        <div className="flex flex-col gap-8 mb-32">
          <h1 className="text-28 line-height-36 weight-600 color-#000000E0">
            Contact Us
          </h1>
          <p className="text-16 line-height-24 color-#00000099">
            Have a question, feedback, or need help with an order? We’d love to
            hear from you.
          </p>
        </div>

        <form className="flex flex-col gap-20" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-6">
            <label className="text-14 weight-500">Full Name</label>
            <input
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              placeholder="Your full name"
              className={`px-14 py-12 radius-6 border outline-none ${
                errors.fullName ? 'border-#D4280C' : 'border-#00000014'
              }`}
            />
            {errors.fullName && (
              <p className="text-13 color-#D4280C">{errors.fullName}</p>
            )}
          </div>

          <div className="flex sm:flex-row flex-col gap-20">
            <div className="flex flex-col gap-6 flex-grow-1">
              <label className="text-14 weight-500">Email Address</label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className={`px-14 py-12 radius-6 border outline-none ${
                  errors.email ? 'border-#D4280C' : 'border-#00000014'
                }`}
              />
              {errors.email && (
                <p className="text-13 color-#D4280C">{errors.email}</p>
              )}
            </div>

            <div className="flex flex-col gap-6 flex-grow-1">
              <label className="text-14 weight-500">Phone (optional)</label>
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="0800 000 0000"
                className="px-14 py-12 radius-6 border border-#00000014 outline-none"
              />
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <label className="text-14 weight-500">Subject</label>
            <input
              name="subject"
              value={form.subject}
              onChange={handleChange}
              placeholder="What is this about?"
              className={`px-14 py-12 radius-6 border outline-none ${
                errors.subject ? 'border-#D4280C' : 'border-#00000014'
              }`}
            />
            {errors.subject && (
              <p className="text-13 color-#D4280C">{errors.subject}</p>
            )}
          </div>

          <div className="flex flex-col gap-6">
            <label className="text-14 weight-500">Message</label>
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              placeholder="Type your message here…"
              rows={5}
              className={`px-14 py-12 radius-6 border outline-none resize-none ${
                errors.message ? 'border-#D4280C' : 'border-#00000014'
              }`}
            />
            {errors.message && (
              <p className="text-13 color-#D4280C">{errors.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-10 py-14 radius-8 text-white weight-500 pointer border-0 outline-0"
            style={{
              backgroundColor: BRAND_COLOR,
              opacity: isSubmitting ? 0.7 : 1,
            }}
          >
            {isSubmitting ? 'Sending…' : 'Send Message'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ContactUsPage;
