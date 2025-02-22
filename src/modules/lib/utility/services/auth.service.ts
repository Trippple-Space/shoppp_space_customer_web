import { AxiosResponse } from "axios";
import { LoginCredentials, RegistrationDetails } from "../types/auth.interface";
import { User } from "../types/user.interface";
import endpoints from "../endpoints";
import http from "../http"

class AuthService {

    signIn(credentials: LoginCredentials): Promise<{ token: string; user: User }> {
        return http.post(endpoints.SIGN_IN, credentials)
            .then((response: AxiosResponse) => {
                this.storeAuthCredentials({ token: response.data.token })
                return response.data
            })
    }

    signOut() {
        localStorage.removeItem('token')
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
}

export const authService = new AuthService()
