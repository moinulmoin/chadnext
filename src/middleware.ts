import { getToken } from "next-auth/jwt";
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  async function middleware(req) {
    const token = await getToken({ req });
    const isAuth = !!token;

    if (req.nextUrl.pathname === "/signin") {
      if (isAuth) {
        return NextResponse.redirect(new URL(`/dashboard`, req.url));
      }
      return null;
    }

    if (!isAuth) {
      return NextResponse.redirect(new URL(`/`, req.url));
    }

    if (req.nextUrl.pathname.startsWith("/dashboard")) {
      if (!isAuth) {
        return NextResponse.redirect(new URL(`/signin`, req.url));
      }

      return null;
    }
  },
  {
    callbacks: {
      authorized() {
        return true;
      },
    },
  }
);

export const config = {
  matcher: ["/dashboard/:path*", "/signin", "/api/webhooks/stripe"],
};
