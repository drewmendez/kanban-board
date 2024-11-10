import { createContext, ReactNode, useContext } from "react";
import { SignInForm, SignUpForm } from "../types/types";
import { QueryObserverResult, UseMutateFunction } from "@tanstack/react-query";
import { AxiosResponse } from "axios";

import {
  useGetCurrentUser,
  useSignIn,
  useSignOut,
  useSignUp,
} from "../services/authServices";

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
  signOut: UseMutateFunction<any, Error, void, unknown>;
  currentUser: DecodedToken | undefined;
  getCurrentUser: () => Promise<QueryObserverResult<any, Error>>;
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
