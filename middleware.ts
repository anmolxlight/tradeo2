import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
  publicRoutes: ["/", "/sign-in(.*)", "/sign-up(.*)", "/api/search", "/api/chat"],
});

export const config = {
  matcher: ["/((?!_next|.*\\..*).*)"],
};