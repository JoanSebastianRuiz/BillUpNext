"use client"

import InputForm from "@/components/form/InputForm";
import { useForm } from "react-hook-form";
import { isValidDocument } from "@/util/validators/validators";
import ButtonForm from "@/components/form/ButtonForm";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Notificacion from "@/components/form/Notificacion";
import ThemeSwitcher from "@/components/common/ThemeSwitcher";


export default function Home() {
  const { register, handleSubmit, formState: { errors } } = useForm<{ numeroDocumentoUsuario: string; claveUsuario: string }>();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data: { numeroDocumentoUsuario: string, claveUsuario: string }) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await signIn("credentials", {
        numeroDocumentoUsuario: data.numeroDocumentoUsuario,
        claveUsuario: data.claveUsuario,
        redirect: false
      });

      if (response?.ok) {
        router.push("/dashboard");
      } else {
        setError(response?.error || "Usuario o contraseña incorrectos");
      }
    } catch (err) {
      setError("Error al intentar iniciar sesión");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
      {/* ThemeSwitcher mejor posicionado */}
      <div className="absolute top-6 right-6">
        <ThemeSwitcher />
      </div>

      {/* Contenedor del formulario con más espacio y diseño mejorado */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md bg-white dark:bg-gray-800 shadow-2xl rounded-2xl border border-gray-200 dark:border-gray-700 p-10 space-y-8 transition-all"
      >
        {/* Título centrado con un poco más de separación */}
        <h1 className="text-4xl font-extrabold text-center text-gray-900 dark:text-gray-200">
          Billup
        </h1>

        {/* Inputs con más espacio entre ellos */}
        <div className="space-y-6">
          <InputForm
            label="Número de documento"
            type="number"
            name="numeroDocumentoUsuario"
            register={register}
            errors={errors}
            validationRules={{
              required: { value: true, message: "Este campo es obligatorio" },
              minLength: { value: 8, message: "El documento debe tener al menos 8 caracteres" },
              maxLength: { value: 10, message: "El documento debe tener máximo 10 caracteres" },
              validate: (value: string) => isValidDocument(value) || "Documento inválido"
            }}
          />

          <InputForm
            label="Contraseña"
            type="password"
            name="claveUsuario"
            register={register}
            errors={errors}
            validationRules={{
              required: { value: true, message: "Este campo es obligatorio" }
            }}
          />
        </div>

        {/* Botón con mayor tamaño y espaciado */}
        <div className="flex justify-center">
          <ButtonForm name="Ingresar" type="submit" />
        </div>
      </form>

      {/* Notificación si hay error */}
      {error && <Notificacion type="error" message={error} />}
    </div>

  );
}