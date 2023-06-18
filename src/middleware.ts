import { authMiddleware } from "@clerk/nextjs";
import { NextResponse } from "next/server";

// export default authMiddleware();

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};

const privateRoutes = ["/foo", "/bar"];
export default authMiddleware({
  afterAuth(auth, req, evt) {
    if (!auth.userId && privateRoutes.includes(req.nextUrl.pathname)) {
      const signInUrl = new URL("/sign-in", req.url);
      signInUrl.searchParams.set("redirect_url", req.url);
      return NextResponse.redirect(signInUrl);
    }
  },
});
