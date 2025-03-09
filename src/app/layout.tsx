import type { Metadata } from "next";
import "./globals.css";
import { UsuarioContextProvider } from "@/context/UsuarioContext";
import { EmpresaContextProvider } from "@/context/EmpresaContext";
import { TerceroContextProvider } from "@/context/TerceroContext";
import { ProductoContextProvider } from "@/context/ProductoContext";
import AuthProvider from "@/context/AuthProvider";
import { ThemeProvider } from "next-themes";

export const metadata: Metadata = {
  title: "Billup",
  description: "Aplicación de facturación",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class">
          <AuthProvider>
            <UsuarioContextProvider>
              <EmpresaContextProvider>
                <ProductoContextProvider>
                  <TerceroContextProvider>
                    {children}
                  </TerceroContextProvider>
                </ProductoContextProvider>
              </EmpresaContextProvider>
            </UsuarioContextProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
