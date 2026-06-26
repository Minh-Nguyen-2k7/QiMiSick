import axios from "axios";
import type { AxiosInstance, InternalAxiosRequestConfig } from "axios";

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
    _retry?: boolean;
}

interface FailedRequestObject {
    resolve: (token: string) => void;
    reject: (error: any) => void;
}

const api: AxiosInstance = axios.create({
    baseURL: "http://localhost:8080"
});

let isRefreshing = false;
let failedQueue: FailedRequestObject[] = [];

const processQueue = (error: any | null, token: string | null = null): void => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            if (token) prom.resolve(token);
        }
    });
    failedQueue = [];
};

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config as CustomAxiosRequestConfig;

        if ((error.response?.status === 401 || error.response?.status === 403) && originalRequest && !originalRequest._retry) {

            if (isRefreshing) {
                return new Promise<string>((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then((token) => {
                        originalRequest.headers = originalRequest.headers || {};
                        originalRequest.headers["Authorization"] = `Bearer ${token}`;
                        return api(originalRequest);
                    })
                    .catch((err) => Promise.reject(err));
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const refreshToken = localStorage.getItem("refreshToken");
                console.log("🔄 Access token expired! Silently refreshing behind the scenes...");

                const response = await axios.post<{ accessToken: string }>("http://localhost:8080/auth/token", {
                    refreshToken
                });

                const newAccessToken = response.data.accessToken;
                localStorage.setItem("accessToken", newAccessToken);

                originalRequest.headers = originalRequest.headers || {};
                originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

                processQueue(null, newAccessToken);
                isRefreshing = false;

                return api(originalRequest);

            } catch (refreshError: any) {
                processQueue(refreshError, null);
                isRefreshing = false;

                localStorage.removeItem("accessToken");
                localStorage.removeItem("refreshToken");

                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("accessToken");
    if (token && config.headers) {
        config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
});

export default api;