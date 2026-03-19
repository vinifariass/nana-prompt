import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedPaths = [
  "/admin",
  "/upload",
  "/generate",
  "/explore",
  "/dashboard",
];

const adminPaths = ["/admin"];

const authPaths = ["/login", "/cadastro"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = await getToken({ req: request });

  // If a banned user tries to access anything (except /banned), redirect to /banned
  if (token && (token as any).banned === true) {
    if (!pathname.startsWith("/banned")) {
      return NextResponse.redirect(new URL("/banned", request.url));
    }
    return NextResponse.next();
  }

  // Se está numa rota de auth e JÁ está logado → admin vai pro /admin, usuário comum pro /dashboard
  if (authPaths.some((path) => pathname.startsWith(path))) {
    if (token) {
      const dest = token.role === "ADMIN" ? "/admin" : "/dashboard";
      return NextResponse.redirect(new URL(dest, request.url));
    }
    return NextResponse.next();
  }

  // Se está numa rota protegida e NÃO está logado → redireciona pro login
  if (protectedPaths.some((path) => pathname.startsWith(path))) {
    if (!token) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Se está numa rota admin e NÃO é ADMIN → redireciona pro dashboard de usuário
  if (adminPaths.some((path) => pathname.startsWith(path))) {
    if (token && token.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|generated|api/auth|api/webhooks).*)",
  ],
};
