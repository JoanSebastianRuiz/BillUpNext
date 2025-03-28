import type { Metadata } from "next";
import "./globals.css";
import { UsuarioContextProvider } from "@/context/UsuarioContext";
import { EmpresaContextProvider } from "@/context/EmpresaContext";
import { TerceroContextProvider } from "@/context/TerceroContext";
import { ProductoContextProvider } from "@/context/ProductoContext";
import { GravamenContextProvider } from "@/context/GravamenContext";
import AuthProvider from "@/context/AuthProvider";
import { ThemeProvider } from "next-themes";
import { CajaContextProvider } from "@/context/CajaContext";
import { CompraContextProvider } from "@/context/CompraContext";
import { VentaContextProvider } from "@/context/VentaContext";


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
                    <GravamenContextProvider>
                      <CajaContextProvider>
                          <CompraContextProvider>
                            <VentaContextProvider>
                              {children}
                            </VentaContextProvider>
                          </CompraContextProvider>
                      </CajaContextProvider>
                    </GravamenContextProvider>
                  </TerceroContextProvider>
                </ProductoContextProvider>
              </EmpresaContextProvider>
            </UsuarioContextProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html >
  );
}
