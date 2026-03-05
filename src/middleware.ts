import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedPaths = [
  "/admin",
  "/upload",
  "/generate",
  "/explore",
];

const adminPaths = [
  "/admin/users",
  "/admin/billing",
  "/admin/settings",
];

const authPaths = ["/login", "/cadastro"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = await getToken({ req: request });

  // Se está numa rota de auth e JÁ está logado → redireciona pro admin
  if (authPaths.some((path) => pathname.startsWith(path))) {
    if (token) {
      return NextResponse.redirect(new URL("/admin", request.url));
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

  // Se está numa rota admin e NÃO é ADMIN → redireciona pro dashboard
  if (adminPaths.some((path) => pathname.startsWith(path))) {
    if (token && token.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|generated|api/auth).*)",
  ],
};
