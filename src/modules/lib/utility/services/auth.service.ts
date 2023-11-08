import { AxiosResponse } from "axios";
import { LoginCredentials, RegistrationDetails } from "../types/auth";
import { User } from "../types/user";
import endpoints from "../endpoints";
import http from "../http"

class AuthService {

    signIn(credentials: LoginCredentials): Promise<{ token: string; user: User }> {
        return new Promise((resolve, reject) => {
            http.post(endpoints.SIGN_IN, credentials)
                .then((response: AxiosResponse) => {
                    this.storeAuthCredentials({ token: response.data.token })
                    resolve(response.data)
                })
        })
    }

    storeAuthCredentials({ token }: { token: string }) {
        localStorage.setItem('token', token)
    }

    signUp(registrationDetails: RegistrationDetails): Promise<User> {
        return new Promise((resolve) => {
            http.post(endpoints.SIGN_UP, registrationDetails)
                .then((response: AxiosResponse) => {
                    resolve(response.data)
                })
        })
    }



}

export const authService = new AuthService()
