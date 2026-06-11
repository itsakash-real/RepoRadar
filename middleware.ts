import { clerkMiddleware } from "@clerk/nextjs/server";
import type { NextRequest } from "next/server";

const clerkMw = clerkMiddleware();

export default async function middleware(request: NextRequest, event: any) {
  const pk = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  if (!pk || !pk.startsWith("pk_") || pk.includes("placeholder") || pk.length < 30) {
    return;
  }
  return clerkMw(request as any, event);
}

export const config = {
  matcher: ["/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)", "/(api|trpc)(.*)"],
};
