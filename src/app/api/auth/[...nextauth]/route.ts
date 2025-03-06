import NextAuth, { User, DefaultSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { UsuarioServiceImpl } from "@/services/Impl/UsuarioServiceImpl";
import { UsuarioRequestDTO } from "@/dto/UsuarioRequestDTO";
import { UsuarioAutenticacionDTO } from "@/dto/UsuarioAutenticacionDTO";

declare module "next-auth" {
    interface User {
        idUsuario: number;
        idRol: number;
        idEmpresa: number;
        numeroDocumentoUsuario: string;
    }

    interface Session {
        user: {
            idUsuario: number;
            idRol: number;
            idEmpresa: number;
            numeroDocumentoUsuario: string;
        } & DefaultSession["user"];
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        idUsuario: number;
        idRol: number;
        idEmpresa: number;
        numeroDocumentoUsuario: string;
    }
}

const handler = NextAuth({
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                numeroDocumentoUsuario: { label: "Numero de documento", type: "text" },
                claveUsuario: { label: "Contraseña", type: "password" }
            },
            async authorize(credentials, req) {
                try {
                    const usuarioService = UsuarioServiceImpl.getInstance();
                    if (!credentials) {
                        return null;
                    }
                    const { numeroDocumentoUsuario, claveUsuario } = credentials;
                    const respuesta = await usuarioService.autenticarUsuario(numeroDocumentoUsuario, claveUsuario);

                    if (respuesta != null) {
                        const usuario = respuesta as UsuarioAutenticacionDTO;
                        if (!usuario) {
                            throw new Error("Usuario o contraseña incorrectos");
                        }
                        return {
                            id:usuario.idUsuario.toString(),
                            idUsuario: usuario.idUsuario,
                            idRol: usuario.idRol,
                            idEmpresa: usuario.idEmpresa,
                            numeroDocumentoUsuario: usuario.numeroDocumentoUsuario
                        };
                    } else {
                        throw new Error("Usuario o contraseña incorrectos");
                    }
                } catch (error) {
                    console.error("Error inesperado:", error);
                    throw new Error("Usuario o contraseña incorrectos");
                }
            }
        })
    ],
    callbacks: {
        jwt({ token, user }) {
            if (user) {
                token.idUsuario = user.idUsuario;
                token.idRol = user.idRol;
                token.idEmpresa = user.idEmpresa;
                token.numeroDocumentoUsuario = user.numeroDocumentoUsuario;
            }
            return token;
        },

        session({ session, token }) {
            if (token) {
                session.user.idUsuario = token.idUsuario as number;
                session.user.idRol = token.idRol as number;
                session.user.idEmpresa = token.idEmpresa as number;
                session.user.numeroDocumentoUsuario = token.numeroDocumentoUsuario as string;
            }
            return session;
        }
    },
    pages: {
        signIn: "/",
        error: "/"
    }
});

export { handler as GET, handler as POST };