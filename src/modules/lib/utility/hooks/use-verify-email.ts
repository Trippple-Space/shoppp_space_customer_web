import { useState } from "react";
import { authService } from "../services/auth.service";
import { toast } from "sonner";

export const useVerifyEmail = () => {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<{ exists: boolean; hasUserAccount: boolean } | null>(null);

    const verify = async (email: string) => {
        setLoading(true);
        try {
            const res = await authService.verifyEmail(email);
            setResult(res);
            return res;
        } catch (error) {
            toast.error("Failed to verify email");
            throw error;
        } finally {
            setLoading(false);
        }
    };

    return {
        verify,
        loading,
        result
    };
};
