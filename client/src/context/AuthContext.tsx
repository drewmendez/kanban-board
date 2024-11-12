import { createContext, ReactNode, useContext } from "react";
import {
  ApiResponse,
  CurrentUser,
  SignInForm,
  SignUpForm,
} from "../types/types";
import { QueryObserverResult, UseMutateFunction } from "@tanstack/react-query";
import { AxiosError } from "axios";

import {
  useGetCurrentUser,
  useSignIn,
  useSignOut,
  useSignUp,
} from "../services/authServices";

interface Auth {
  signUp: UseMutateFunction<ApiResponse, AxiosError<ApiResponse>, SignUpForm>;
  signIn: UseMutateFunction<ApiResponse, AxiosError<ApiResponse>, SignInForm>;
  signOut: UseMutateFunction<ApiResponse, AxiosError<ApiResponse>>;
  currentUser: CurrentUser | undefined | null;
  getCurrentUser: () => Promise<QueryObserverResult<CurrentUser | null, Error>>;
}

export const AuthContext = createContext<Auth | null>(null);

export default function AuthContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const { mutate: signUp } = useSignUp();
  const { mutate: signIn } = useSignIn();
  const { mutate: signOut } = useSignOut();
  const { data: currentUser, refetch: getCurrentUser } = useGetCurrentUser();

  console.log(currentUser);

  return (
    <AuthContext.Provider
      value={{
        signUp,
        signIn,
        signOut,
        currentUser,
        getCurrentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthContextProvider");
  }
  return context;
};
