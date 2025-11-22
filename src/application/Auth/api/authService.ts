import apiClient from "../../../lib/apiClient";
import type { ApiResponse, AuthUser, PartnerLoginResponse } from "../types";

export interface LoginPayload {
  email: string;
  password: string;
}

export const loginPartner = async (payload: LoginPayload) => {
  const response = await apiClient.post<ApiResponse<PartnerLoginResponse>>(
    "/auth/login/partner",
    payload
  );

  return response.data.data;
};

export const fetchPartnerProfile = async () => {
  const response = await apiClient.get<ApiResponse<AuthUser>>("/auth/me");
  return response.data.data;
};

export const logoutPartner = async (refreshToken?: string) => {
  await apiClient.post("/auth/logout", {
    refreshToken,
  });
};
