export interface AuthUser {
  id: string;
  fullName: string | null;
  email: string;
  role: string;
  isVerified: boolean;
  phoneNumber?: string | null;
  lastLogin?: string | null;
}

export interface PartnerLoginResponse {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
  partner_auth_token?: string;
  partner_refresh_token?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
