import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { AxiosError } from "axios";
import {
  fetchPartnerProfile,
  loginPartner,
  logoutPartner,
  type LoginPayload,
} from "../application/Auth/api/authService";
import { AuthUser } from "../types/auth";
import { deleteCookie, getCookie, setCookie } from "../lib/cookies";

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isInitializing: boolean;
  signIn: (payload: LoginPayload) => Promise<void>;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const ACCESS_COOKIE = "partner_auth_token";
const REFRESH_COOKIE = "partner_refresh_token";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  const persistTokens = useCallback(
    (accessToken?: string, refreshToken?: string) => {
      if (accessToken) {
        setCookie(ACCESS_COOKIE, accessToken, 1);
        setCookie("accessToken", accessToken, 1);
      }
      if (refreshToken) {
        setCookie(REFRESH_COOKIE, refreshToken, 14);
        setCookie("refreshToken", refreshToken, 14);
      }
    },
    []
  );

  const clearTokens = useCallback(() => {
    [
      ACCESS_COOKIE,
      REFRESH_COOKIE,
      "accessToken",
      "refreshToken",
      "authToken",
    ].forEach(deleteCookie);
  }, []);

  const refreshSession = useCallback(async () => {
    const hasToken =
      getCookie(ACCESS_COOKIE) ||
      getCookie("accessToken") ||
      getCookie("authToken");

    if (!hasToken) {
      setUser(null);
      setIsInitializing(false);
      return;
    }

    try {
      const profile = await fetchPartnerProfile();
      setUser(profile);
    } catch (error) {
      clearTokens();
      setUser(null);
    } finally {
      setIsInitializing(false);
    }
  }, [clearTokens]);

  useEffect(() => {
    refreshSession();
  }, [refreshSession]);

  const signIn = useCallback(
    async (payload: LoginPayload) => {
      try {
        const data = await loginPartner(payload);

        persistTokens(
          data.partner_auth_token || data.accessToken,
          data.partner_refresh_token || data.refreshToken
        );

        setUser(data.user);
      } catch (error) {
        const message =
          (error as AxiosError<{ message?: string }>)?.response?.data?.message ??
          (error as Error).message ??
          "Unable to sign in. Please try again.";

        throw new Error(message);
      }
    },
    [persistTokens]
  );

  const signOut = useCallback(async () => {
    const refreshToken = getCookie(REFRESH_COOKIE) || getCookie("refreshToken");
    try {
      await logoutPartner(refreshToken ?? undefined);
    } catch (error) {
      // no-op – even if logout fails we still clear local session
      console.warn("Failed to revoke refresh token", error);
    } finally {
      clearTokens();
      setUser(null);
    }
  }, [clearTokens]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isInitializing,
      signIn,
      signOut,
      refreshSession,
    }),
    [user, isInitializing, signIn, signOut, refreshSession]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
