"use client";

import dynamic from "next/dynamic";
import React from "react";

const UserButtonFallback = () => null;
const SignInButtonFallback = ({ children }: { children?: React.ReactNode }) =>
  React.createElement("span", null, children || "Sign in");

const ClerkComponents = {
  UserButton: dynamic(
    () =>
      import("@clerk/nextjs").then((mod) => ({
        default: (props: any) => <mod.UserButton {...props} />,
      })),
    { ssr: false, loading: () => null }
  ),
  SignInButton: dynamic(
    () =>
      import("@clerk/nextjs").then((mod) => ({
        default: (props: any) => {
          const { children, ...rest } = props;
          return <mod.SignInButton {...rest}>{children}</mod.SignInButton>;
        },
      })),
    { ssr: false, loading: () => null }
  ),
  useUser: () => {
    try {
      const mod = require("@clerk/nextjs");
      return mod.useUser();
    } catch {
      return { user: null, isLoaded: true, isSignedIn: false };
    }
  },
  useClerk: () => {
    try {
      const mod = require("@clerk/nextjs");
      return mod.useClerk();
    } catch {
      return { openSignIn: () => {} };
    }
  },
};

export const SafeUserButton = (props: any) => <ClerkComponents.UserButton {...props} />;
export const SafeSignInButton = (props: any) => <ClerkComponents.SignInButton {...props} />;
export const safeUseUser = () => ClerkComponents.useUser();
export const safeUseClerk = () => ClerkComponents.useClerk();
