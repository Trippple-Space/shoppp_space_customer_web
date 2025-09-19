import { authService } from "../services/auth.service"

export const useGoogleOauth = () => {


  const googleOauthInitializer = async () => {
   try {
     const oauth = await authService.googleOauth();
    //  if (oauth) {
    //   //  console.lo
    //  }

 } catch (error) {
  
 }
}

return { googleOauthInitializer }
}

