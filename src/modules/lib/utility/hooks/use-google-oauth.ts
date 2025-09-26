import { authService } from "../services/auth.service"

export const useGoogleOauth = () => {


  const googleOauthInitializer = async () => {
   try {
      authService.googleOauth();
 } catch (error) {
  
 }
}

return { googleOauthInitializer }
}

