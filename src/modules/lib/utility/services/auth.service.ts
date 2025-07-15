import { AxiosResponse } from "axios";
import { LoginCredentials, RegistrationDetails } from "../types/auth.interface";
import { User } from "../types/user.interface";
import endpoints from "../endpoints";
import http from "../http"
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import router from "next/router";
import { paths } from "../paths";

class AuthService {

    signIn(credentials: LoginCredentials): Promise<{ token: string; user: User }> {
      return http.post(endpoints.SIGN_IN, credentials)
        .then((response: AxiosResponse) => {
          this.storeAuthCredentials({ token: response.data.token })
          return response.data
        }).catch((error) => {
          return toast.error(error.response.data.message)
        });
    }

    signOut() {
        localStorage.removeItem('token')
        localStorage.removeItem("variantId");
        localStorage.removeItem("variantIdMinimumPurchase");
        window.location.replace(paths.login)
        
    }

    validateAuth(): Promise<User> {
        return http.post(`${endpoints.VALIDATE_TOKEN}`)
            .then((response: AxiosResponse) => {
                this.storeAuthCredentials({ token: response.data.token })
                return response.data.user
            })
            .catch((error) => {
                return null
            })
    }

    storeAuthCredentials({ token }: { token: string }) {
        localStorage.setItem('token', token)
    }

    getAuthCredentials() {
        return localStorage.getItem('token')
    }

    signUp(registrationDetails: RegistrationDetails): Promise<User> {
        return http.post(endpoints.SIGN_UP, registrationDetails)
            .then((response: AxiosResponse) => {
                return response.data
            })
    }

    signUpInitial(details: { fullname: string; email: string }): Promise<any> {
      return http.post(endpoints.SIGN_UP_DETAILS, details)
        .then((response: AxiosResponse) => {
          return response.data;
        })
        .catch((error) => {
          const message =
            error.response?.data?.message || error.message || "An unknown error occurred.";
          toast.error(message);
          throw error;
        });
    }

    
  verifyOtp(payload: { token: string; otp: string }): Promise<any> {
      return http.post(endpoints.SIGN_UP_VERIFY_OTP, payload).then((response: AxiosResponse) => response.data).catch((error) => {
        const message =  
        error.response?.data?.message || error.message || "An unknown error occurred.";
        toast.error(message);
        throw error;
    });
  }


  setPassword(payload: { token: string, password: string }): Promise<any> {
    return http.post(endpoints.SIGN_UP_CREATE_PASSWORD, payload).then((response: AxiosResponse) => response.data).catch((error) => 
    {
    return  toast.error(error.response.data.message)
    }).catch((error) => 
      {
      return  toast.error(error.response.data.message)
      });
  }
    
resendOtp(email: string) {
    return http.post(endpoints.RESEND_OTP, { email })
        .then((response) => {
            toast.success("An OTP has been sent to your email for verification");
            return response.data; // Return response so component can handle it
        }).catch((error) => 
          {
          return  toast.error(error.response.data.message)
          });
}

}

export const authService = new AuthService()
