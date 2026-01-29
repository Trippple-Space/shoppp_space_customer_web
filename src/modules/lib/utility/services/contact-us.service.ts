import { AxiosResponse } from "axios";
import endpoints from "../endpoints";
import http from "../http";

class ContactUsService {
    submitContactForm(data: { blocks: object[] }): Promise<any> {
        return http
            .post(endpoints.CONTACT_FORM, data)
            .then((response: AxiosResponse) => {
                return response.data;
            });
    }
}

export const contactUsService = new ContactUsService();