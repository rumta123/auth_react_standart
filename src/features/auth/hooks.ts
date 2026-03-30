import { useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { ApiError } from "../../lib/api";
import { useAuthStore } from "../../store/authStore";
import type { LoginPayload, RegisterPayload } from "../../types/auth";
import { getProfile, login, register } from "./api";

export function useLoginMutation() {
  const navigate = useNavigate();
  const setSession = useAuthStore((state) => state.setSession);

  return useMutation({
    mutationFn: async (payload: LoginPayload) => {
      const loginResponse = await login(payload);
      const profile = await getProfile(loginResponse.access_token);

      return { accessToken: loginResponse.access_token, user: profile };
    },
    onSuccess: ({ accessToken, user }) => {
      setSession({ accessToken, user });
      navigate("/account", { replace: true });
    },
    throwOnError: false,
  });
}

export function useRegisterMutation() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (payload: RegisterPayload) => register(payload),
    onSuccess: () => {
      navigate("/login", {
        replace: true,
        state: { registered: true },
      });
    },
    throwOnError: false,
  });
}

export function useProfileQuery() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const setUser = useAuthStore((state) => state.setUser);
  const logout = useAuthStore((state) => state.logout);

  const query = useQuery({
    queryKey: ["profile", accessToken],
    queryFn: () => getProfile(accessToken),
    enabled: Boolean(accessToken),
    staleTime: 60_000,
  });

  useEffect(() => {
    if (query.data) {
      setUser(query.data);
    }
  }, [query.data, setUser]);

  useEffect(() => {
    if (query.error instanceof ApiError && query.error.status === 401) {
      logout();
    }
  }, [query.error, logout]);

  return query;
}
