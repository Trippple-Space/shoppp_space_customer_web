'use client';

import useContactForm from '@/modules/lib/utility/hooks/use-contact-us';
import React, { useState } from 'react';
import { toast } from 'sonner';

const BRAND_COLOR = '#0357EE';

const ContactUsPage = () => {
  const { form, errors, loading, btnDisabled, handleChange, handleSubmit } =
    useContactForm();

  return (
    <div className="flex justify-center bg-[#F9FAFB] md:px-[40px] sm:px-[24px] px-[10px] py-[80px]">
      <div className="w-full max-w-[720px] bg-white rounded-[12px] sm:px-[40px] px-[24px] sm:py-[40px] py-[24px] border border-[#00000014]">
        <div className="flex flex-col gap-[8px] mb-[32px]">
          <h1 className="text-[28px] leading-[36px] font-semibold text-[#000000E0]">
            Contact Us
          </h1>
          <p className="text-[16px] leading-[24px] text-[#00000099]">
            Have a question, feedback, or need help with an order? We’d love to
            hear from you.
          </p>
        </div>

        <form
          className="flex flex-col gap-[20px]"
          onSubmit={(e) => e.preventDefault()}
        >
          <div className="flex flex-col gap-[6px]">
            <label className="text-[14px] font-medium">Full Name</label>
            <input
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              placeholder="Your full name"
              className={`px-[14px] py-[12px] rounded-[6px] border outline-none ${
                errors.fullName ? 'border-[#D4280C]' : 'border-[#00000014]'
              }`}
            />
            {errors.fullName && (
              <p className="text-[13px] text-[#D4280C]">{errors.fullName}</p>
            )}
          </div>

          <div className="flex sm:flex-row flex-col gap-[20px]">
            <div className="flex flex-col gap-[6px] grow">
              <label className="text-[14px] font-medium">Email Address</label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className={`px-[14px] py-[12px] rounded-[6px] border outline-none ${
                  errors.email ? 'border-[#D4280C]' : 'border-[#00000014]'
                }`}
              />
              {errors.email && (
                <p className="text-[13px] text-[#D4280C]">{errors.email}</p>
              )}
            </div>

            <div className="flex flex-col gap-[6px] grow">
              <label className="text-[14px] font-medium">Phone (optional)</label>
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="0800 000 0000"
                className="px-[14px] py-[12px] rounded-[6px] border border-[#00000014] outline-none"
              />
            </div>
          </div>

          <div className="flex flex-col gap-[6px]">
            <label className="text-[14px] font-medium">Subject</label>
            <input
              name="subject"
              value={form.subject}
              onChange={handleChange}
              placeholder="What is this about?"
              className={`px-[14px] py-[12px] rounded-[6px] border outline-none ${
                errors.subject ? 'border-[#D4280C]' : 'border-[#00000014]'
              }`}
            />
            {errors.subject && (
              <p className="text-[13px] text-[#D4280C]">{errors.subject}</p>
            )}
          </div>

          <div className="flex flex-col gap-[6px]">
            <label className="text-[14px] font-medium">Message</label>
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              placeholder="Type your message here…"
              rows={5}
              className={`px-[14px] py-[12px] rounded-[6px] border outline-none resize-none ${
                errors.message ? 'border-[#D4280C]' : 'border-[#00000014]'
              }`}
            />
            {errors.message && (
              <p className="text-[13px] text-[#D4280C]">{errors.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={btnDisabled || loading}
            onClick={handleSubmit}
            className="mt-[10px] py-[14px] rounded-[8px] text-white font-medium cursor-pointer border-0 outline-0"
            style={{
              backgroundColor: BRAND_COLOR,
              opacity: btnDisabled || loading ? 0.7 : 1,
            }}
          >
            {loading ? 'Sending…' : 'Send Message'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ContactUsPage;
