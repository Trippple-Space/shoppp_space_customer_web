import axios from "axios";
import envConfig from "env";
import stagingConfig from "env/staging";
import { toast } from "sonner";


const http = axios.create({
    baseURL: envConfig.API_HOST
})

http.interceptors.request.use((config: any) => {
   
    if (envConfig.API_HOST === stagingConfig.API_HOST) {
        const originalUrl = config.url;
        config.url = `?route=${encodeURIComponent(originalUrl)}`;        
    }
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