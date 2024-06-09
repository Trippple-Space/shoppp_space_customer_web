import axios from "axios";
import config from "env";
import { toast } from "sonner";


const http = axios.create({
    baseURL: config.API_HOST
})

http.interceptors.request.use((config: any) => {
    const originalUrl = config.url;
    config.url = `?route=${encodeURIComponent(originalUrl)}`;
    config.headers['Content-Type'] = 'application/json'
    config.headers['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
    return config
})

http.interceptors.response.use((response: any) => {
    return response;
}, (error) => {
    
    if (error?.response?.status.toString().indexOf('4') == 0) {
        toast.error(error.response.data.message)
    }
    return Promise.reject(error);

});


export default http;