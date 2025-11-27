import axios from "axios";
import { getCookie, deleteCookie } from "./cookies";
import { API_BASE_URL } from "../constant";
 

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
});
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
});

apiClient.interceptors.request.use((config) => {
  const token =
    getCookie("partner_auth_token") ||
    getCookie("accessToken") ||
    getCookie("authToken");

  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      deleteCookie("partner_auth_token");
      deleteCookie("partner_refresh_token");
      deleteCookie("accessToken");
      deleteCookie("refreshToken");
    }
    return Promise.reject(error);
  }
);

export default apiClient;
