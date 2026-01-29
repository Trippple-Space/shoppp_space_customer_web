'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { contactUsService } from '../services/contact-us.service';
import { buildContactSlackMessage } from '../utility';

const initialState = {
    fullName: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
};

const useContactForm = () => {
    const [form, setForm] = useState(initialState);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);

    const validate = () => {
        const newErrors: Record<string, string> = {};

        if (!form.fullName.trim()) newErrors.fullName = 'Full name is required';

        if (!form.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
            newErrors.email = 'Invalid email address';
        }

        if (!form.subject.trim()) newErrors.subject = 'Subject is required';

        if (!form.message.trim()) {
            newErrors.message = 'Message is required';
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
        if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
    };

    const handleSubmit = async () => {
        if (!validate()) return;

        const payload = buildContactSlackMessage(form);

        try {
            setLoading(true);
            await contactUsService.submitContactForm(payload);
            toast.success('Message sent successfully. We’ll get back to you soon!');
            setForm(initialState);
        } catch (error: any) {
            toast.error(
                error?.response?.data?.message || 'Failed to send message'
            );
        } finally {
            setLoading(false);
        }
    };

    const btnDisabled =
        loading ||
        Object.values(form).some((v) => !v.trim()) ||
        Object.keys(errors).length > 0;

    return {
        form,
        errors,
        loading,
        btnDisabled,
        handleChange,
        handleSubmit,
    };
};

export default useContactForm;
