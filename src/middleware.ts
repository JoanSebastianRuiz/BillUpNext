import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

// Configura el middleware para proteger rutas específicas
export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token; // Obtiene el token de la sesión

    if (!token) {
      const response = NextResponse.redirect(new URL("/", req.url));
      response.cookies.set("next-auth.session-token", "", { expires: new Date(0) });
      response.cookies.set("__Secure-next-auth.session-token", "", { expires: new Date(0) });
      response.cookies.set("__Host-next-auth.csrf-token", "", { expires: new Date(0) });
      return response;
    }

    const userRole = token.idRol; // Extraer el rol del token

    // Definir rutas según el rol
    const adminRoutes = ["/empresas"];
    if (adminRoutes.some((route) => req.nextUrl.pathname.startsWith(route)) && userRole !== 1) {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }

    const supervisorRoutes = ["/productos", "/proveedores", "/categorias", "/cajas", "/ubicacion-venta", "/compras"];
    if (supervisorRoutes.some((route) => req.nextUrl.pathname.startsWith(route)) && userRole !== 2) {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }

    const adminSupervisorRoutes = ["/usuarios", "/gravamenes"];
    if (adminSupervisorRoutes.some((route) => req.nextUrl.pathname.startsWith(route)) && userRole !== 1 && userRole !== 2) {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }

    const supervisorCajeroRoutes = ["/ventas", "/balance-cajas", "/movimientos", "/clientes"];
    if (supervisorCajeroRoutes.some((route) => req.nextUrl.pathname.startsWith(route)) && userRole !== 2 && userRole !== 3) {
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
    "/usuarios/:path*",
    "/api/:path*",
    "/productos/:path*",
    "/empresas/:path*",
    "/categorias/:path*",
    "/proveedores/:path*",
    "/clientes/:path*",
    "/gravamenes/:path*",
    "/cajas/:path*",
    "/ubicacion-venta/:path*",
    "/perfil/:path*",
    "/compras/:path*",
    "/ventas/:path*",
    "/balance-cajas/:path*",
    "/movimientos/:path*",
  ], // Protege estas rutas
};