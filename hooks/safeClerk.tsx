"use client";

import React from "react";
import {
  UserButton as ClerkUserButton,
  SignInButton as ClerkSignInButton,
  useUser as clerkUseUser,
  useClerk as clerkUseClerk,
} from "@clerk/nextjs";

export function hasValidClerkKey(): boolean {
  const pk = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  if (!pk || !pk.startsWith("pk_")) return false;
  if (pk.includes("placeholder")) return false;
  if (pk.length < 30) return false;
  return true;
}

const UserButtonFallback = () => null;

const SignInButtonFallback = ({ children, onClick }: { children?: React.ReactNode, onClick?: any }) => {
  const handleClick = (e: any) => {
    if (onClick) onClick(e);
    alert(
      "Authentication is not configured. Please add NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY and CLERK_SECRET_KEY to your .env.local file to enable sign-in."
    );
  };
  if (children && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<{ onClick?: any }>, {
      onClick: handleClick,
    });
  }
  return (
    <button
      onClick={handleClick}
      className="text-xs tracking-[2px] uppercase text-[#999999] hover:text-white transition-colors font-mono"
    >
      {children || "Sign in"}
    </button>
  );
};

export const SafeUserButton = (props: any) => {
  if (!hasValidClerkKey()) {
    return <UserButtonFallback />;
  }
  return <ClerkUserButton {...props} />;
};

export const SafeSignInButton = (props: any) => {
  if (!hasValidClerkKey()) {
    const { children, onClick } = props;
    return <SignInButtonFallback onClick={onClick}>{children}</SignInButtonFallback>;
  }
  return <ClerkSignInButton {...props} />;
};

export const safeUseUser = () => {
  if (!hasValidClerkKey()) {
    return { user: null, isLoaded: true, isSignedIn: false };
  }
  try {
    return clerkUseUser();
  } catch {
    return { user: null, isLoaded: true, isSignedIn: false };
  }
};

export const safeUseClerk = () => {
  if (!hasValidClerkKey()) {
    return {
      openSignIn: () =>
        alert(
          "Authentication is not configured. Please add NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY and CLERK_SECRET_KEY to your .env.local file to enable sign-in."
        ),
    };
  }
  try {
    return clerkUseClerk();
  } catch {
    return {
      openSignIn: () => {},
    };
  }
};
