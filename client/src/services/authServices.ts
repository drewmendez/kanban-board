import { AxiosError } from "axios";
import {
  ApiResponse,
  CurrentUser,
  SignInForm,
  SignUpForm,
} from "../types/types";
import { apiClient } from "./apiClient";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useSignUp = () => {
  return useMutation<ApiResponse, AxiosError<ApiResponse>, SignUpForm>({
    mutationFn: async (credentials) => {
      const { data } = await apiClient.post("/auth/sign-up", credentials);
      return data;
    },
  });
};

export const useSignIn = () => {
  return useMutation<ApiResponse, AxiosError<ApiResponse>, SignInForm>({
    mutationFn: async (credentials) => {
      const { data } = await apiClient.post("/auth/sign-in", credentials);
      return data;
    },
  });
};

export const useSignOut = () => {
  return useMutation<ApiResponse, AxiosError<ApiResponse>>({
    mutationFn: async () => {
      const { data } = await apiClient.delete("/auth/sign-out");
      return data;
    },
  });
};

export const useGetCurrentUser = () => {
  return useQuery<CurrentUser | null>({
    queryKey: ["current-user"],
    queryFn: async () => {
      try {
        const { data } = await apiClient.get("/auth/current-user");
        return data;
      } catch {
        return null;
      }
    },
    retry: false,
    refetchOnWindowFocus: false,
  });
};
