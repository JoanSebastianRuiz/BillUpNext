import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

// Configura el middleware para proteger rutas específicas
export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token; // Obtiene el token de la sesión

    if (!token) {
      return NextResponse.redirect(new URL("/", req.url)); // Si no está autenticado, redirigir al login
    }

    const userRole = token.idRol; // Extraer el rol del token

    // Definir rutas según el rol
    const adminRoutes = ["/dashboard", "/usuarios"];
    if (adminRoutes.some((route) => req.nextUrl.pathname.startsWith(route)) && userRole !== 1 && userRole !== 2) {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }

    const supervisorRoutes = ["/productos"];
    if (supervisorRoutes.some((route) => req.nextUrl.pathname.startsWith(route)) && userRole !== 2) {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }

    return NextResponse.next();
  },
  {
    pages: {
      signIn: "/", // Página de login
    },
  }
);

// Definir en qué rutas se aplica el middleware
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/usuarios/:path*",
    "/api/:path*",
    "/productos/:path*"
  ], // Protege estas rutas
};