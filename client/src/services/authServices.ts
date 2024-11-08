import { SignInForm, SignUpForm } from "../types/types";
import { apiClient } from "./apiClient";
import { useMutation } from "@tanstack/react-query";

export const useSignUp = () => {
  return useMutation({
    mutationFn: async (credentials: SignUpForm) => {
      const { data } = await apiClient.post("/auth/sign-up", credentials);
      return data;
    },
  });
};

export const useSignIn = () => {
  return useMutation({
    mutationFn: async (credentials: SignInForm) => {
      const { data } = await apiClient.post("/auth/sign-in", credentials);
      return data;
    },
  });
};
