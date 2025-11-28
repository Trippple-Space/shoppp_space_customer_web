import { useState } from "react";
import { authService } from "../services/auth.service";

export const useRequestOtp = () => {
    const [loading, setLoading] = useState(false);
    const [otpToken, setOtpToken] = useState<string | null>(null);

    const requestOtp = async (email: string) => {
        setLoading(true);
        try {
            const res = await authService.requestOtp(email);
            setOtpToken(res.token || null); 
            return res;
        } finally {
            setLoading(false);
        }
    };

    return { requestOtp, loading, otpToken };
};
