import axios, { AxiosError } from "axios";
import envConfig from "env";
import { toast } from "sonner";


const http = axios.create({
    baseURL: envConfig.API_HOST
})

const isAxiosTimeout = (error: AxiosError) => {
    return error.code === 'ECONNABORTED' && error.message.includes('timeout')
}

export const getFullUrlAsCacheKey = (config: { baseURL: string, url: string, params: { [key: string]: any } }) => {
    const url = new URL(config.baseURL + '/' + config.url);

    const params = new URLSearchParams();

    if (config.params) {
        Object.keys(config.params).forEach(key => {
            const value = config.params[key];
            if (typeof value === 'object') {
                params.append(key, JSON.stringify(value));
            } else {
                params.append(key, value);
            }
        });
    }

    url.search = params.toString();
    return url.toString();
};

// Cache to track retry counts for requests
const retryCountCache: { [key: string]: number } = {};



http.interceptors.request.use((config: any) => {
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
    else if (error.config.method === 'get' && (error?.response?.status == 504 || isAxiosTimeout(error))) {

        const fullUrl = getFullUrlAsCacheKey(error.config)

        const retryCount = retryCountCache[fullUrl] || 0;

        error.config.timeout = 4000
        if (retryCount < 5) {
            retryCountCache[fullUrl] = retryCount + 1;
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    http.request(error.config).then(resolve).catch(reject);
                }, 1000);
            });
        } else {
            // If the retry count is 5 or more, clear the cache entry and stop retrying
            delete retryCountCache[fullUrl];
        }
    }
    return Promise.reject(error);

});

export default http;