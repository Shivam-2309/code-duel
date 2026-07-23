import { auth } from "@/auth";
import { NextAuthRequest } from "next-auth";
import { NextResponse } from "next/server";

export default auth((req: NextAuthRequest) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  const publicRoutes = ["/login", "/register"];

  const isAuthApi = nextUrl.pathname.startsWith("/api/auth");
  const isPublicApi = nextUrl.pathname.startsWith("/api/register");

  if (isPublicApi || isAuthApi) {
    return NextResponse.next();
  }

  if (
    isLoggedIn &&
    (nextUrl.pathname === "/login" || nextUrl.pathname === "/register")
  ) {
    return NextResponse.redirect(new URL("/codeforces/verify", req.url));
  }

  if (!isLoggedIn && !publicRoutes.includes(nextUrl.pathname)) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // console.log("NEXT-URL", nextUrl);
  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
