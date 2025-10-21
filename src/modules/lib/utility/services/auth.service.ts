import { AxiosResponse } from "axios";
import { LoginCredentials, RegistrationDetails } from "../types/auth.interface";
import { NewUser, User } from "../types/user.interface";
import endpoints from "../endpoints";
import http from "../http"
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
// import router from "next/navigation"; 
import { paths } from "../paths";
    import envConfig from "env";
import { convertUserResponse } from "../utility";


class AuthService {

    signIn(credentials: LoginCredentials): Promise<{ token: string; user: User }> {
      return http.post(endpoints.SIGN_IN, credentials)
        .then((response: AxiosResponse) => {
          localStorage.removeItem("signup-email")
          this.storeAuthCredentials({ token: response.data.token })

          return {token: response.data.token, user: convertUserResponse(response.data.user)}
        }).catch((error) => {
          toast.error(error.response.data.message);
          return Promise.reject(error);
        });
    }

  signOut() {
    localStorage.removeItem('token')
    localStorage.removeItem("variantId");
    localStorage.removeItem("variantIdMinimumPurchase");
    // window.location.reload()
    // router.redirect(paths.homepage);
    }

  validateAuth(): Promise<User | null> {
      
        return http.post(`${endpoints.VALIDATE_TOKEN}`)
            .then((response: AxiosResponse) => {
              this.storeAuthCredentials({ token: response.data.token })
      

              console.log('Validated user:', response.data.user);
                return  convertUserResponse(response.data.user)
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
          toast.success("OTP sent. Please check your email.");
          return response.data;
        })
        .catch((error) => {
          const message =
            error.response?.data?.message || error.message || "An unknown error occurred.";
          toast.error(message);
          // throw error;
        });
    }

    
  verifyOtp(payload: { token: string; otp: string }): Promise<any> {
    return http.post(endpoints.SIGN_UP_VERIFY_OTP, payload).then((response: AxiosResponse) =>
    {
      toast.success("OTP verified successfully.");

      return response.data;
      
    }).catch((error) => {
        const message =  
        error.response?.data?.message || error.message || "An unknown error occurred.";
        toast.error(message);
        throw error;
    });
  }


  setPassword(payload: { token: string, password: string }): Promise<any> {
    return http.post(endpoints.SIGN_UP_CREATE_PASSWORD, payload).then(async (response: AxiosResponse) => {
   toast.success(`Thank you for signing up with Asoebi.Africa. Have a wonderful time shopping`);
     return response.data
    }).catch((error) => 
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
        
            return response.data; 
        }).catch((error) => 
          {
          // return  toast.error(error.response.data.message)
          });
}
  
forgotPassword(email: string) {
    return http.post(endpoints.FORGOT_PASSWORD, { email })
        .then((response) => {
          toast.success("A reset link has been sent to your email");
        
            return response.data; 
        }).catch((error) => 
          {
          return  toast.error(error.response.data.message)
          });
}
resetPassword({ token, password, confirmPassword }: { token: string; password: string; confirmPassword: string }) {
    return http.post(endpoints.RESET_PASSWORD, { token, password, confirmPassword })
        .then((response) => {
          toast.success("Your password has been reset successfully. Login to continue.");
        
            return response.data; 
        }).catch((error) => 
          {
          return  toast.error(error.response.data.message)
          });
}
  
  googleOauth() {
    window.open(`${envConfig.API_HOST}/${endpoints.GOOGLE_OAUTH_INITIALIZER}?source=${window.location.href}`, '_blank', 'noopener,noreferrer')

  }

}

export const authService = new AuthService()
