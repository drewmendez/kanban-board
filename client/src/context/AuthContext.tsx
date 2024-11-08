import { createContext, ReactNode, useContext } from "react";
import { SignInForm, SignUpForm } from "../types/types";
import { UseMutateFunction } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { useSignIn, useSignUp } from "../services/authServices";

interface DecodedToken {
  user_id: number;
  user: string;
}

interface Auth {
  signUp: UseMutateFunction<
    AxiosResponse<any, any>,
    Error,
    SignUpForm,
    unknown
  >;
  signIn: UseMutateFunction<
    AxiosResponse<any, any>,
    Error,
    SignInForm,
    unknown
  >;
  signOut: () => void;
  isAuthenticated: () => boolean;
  currentUser: DecodedToken | null;
}

export const AuthContext = createContext<Auth | null>(null);

export default function AuthContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const { mutate: signUp } = useSignUp();
  const { mutate: signIn } = useSignIn();

  const signOut = () => {
    Cookies.remove("access_token");
  };

  const isAuthenticated = () => {
    return !!Cookies.get("access_token");
  };

  const token = Cookies.get("access_token");
  const currentUser = token ? jwtDecode<DecodedToken>(token) : null;

  return (
    <AuthContext.Provider
      value={{ signUp, signIn, signOut, isAuthenticated, currentUser }}
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
