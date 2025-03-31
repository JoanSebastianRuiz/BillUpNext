"use client";

import axios from "axios";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";

import { GravamenDTO } from "@/dto/GravamenDTO";

import InputForm from "@/components/form/InputForm";
import SelectForm from "@/components/form/SelectForm";
import Notificacion from "@/components/form/Notificacion";
import ContenedorRegistrar from "../modal/ContenedorRegistrar";
import ButtonForm from "../form/ButtonForm";
import { useGravamenContext } from "@/context/GravamenContext";

const RegistrarGravamen = ({
  gravamenSeleccionado,
  setModalActualizar,
  setModalRegistrar,
}: {
  gravamenSeleccionado?: GravamenDTO | null;
  setModalActualizar?: (value: boolean) => void;
  setModalRegistrar?: (value: boolean) => void;
}) => {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<GravamenDTO>();
  const { obtenerGravamenes } = useGravamenContext();

  useEffect(() => {
    if (gravamenSeleccionado) {
      setValue("nombreGravamen", gravamenSeleccionado.nombreGravamen || '');
      setValue(
        "estadoGravamen",
        gravamenSeleccionado.estadoGravamen ? "true" : "false");
    }

  }, [gravamenSeleccionado, setValue]);

  const onSubmit = async (data: GravamenDTO) => {
    try {
      if (gravamenSeleccionado) {
        const datosModificados = { ...data, estadoGravamen: String(data.estadoGravamen) === "true" };
        const respuesta = await axios.put(`/api/gravamen/${gravamenSeleccionado?.idGravamen}`, datosModificados);
        setError(null);
        setSuccess(respuesta.data.message);
        obtenerGravamenes();
        setModalActualizar?.(false);
      } else {
        const datosModificados = { ...data, estadoGravamen: true };
        const respuesta = await axios.post("/api/gravamen", datosModificados);
        setError(null);
        setSuccess(respuesta.data.message);
        obtenerGravamenes();
        setModalRegistrar?.(false);
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        const mensajeError = error.response.data?.message;
        setSuccess(null);
        setError(mensajeError);
        console.error("Error de Axios:", mensajeError, error);
      } else {
        setError("Ocurrió un error inesperado");
        console.error("Error desconocido:", error);
      }
    }
  };

  return (
    <ContenedorRegistrar
      name={gravamenSeleccionado ? "Actualizar gravamen" : "Registrar gravamen"}
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 sm:grid-cols-1 gap-x-6 gap-y-4"
      >
        <InputForm
          label="Nombre"
          register={register}
          name="nombreGravamen"
          type="text"
          validationRules={{
            required: { value: true, message: "Este campo es obligatorio" },
            maxLength: { value: 50, message: "Máximo 50 caracteres" },
          }}
          errors={errors}
        />

        {gravamenSeleccionado && (
          <SelectForm
            label="Estado"
            register={register}
            name="estadoGravamen"
            validationRules={{
              required: { value: true, message: "Este campo es obligatorio" },
            }}
            errors={errors}
          >
            <option value="" disabled>
              Seleccione un estado
            </option>
            <option value="true">Activo</option>
            <option value="false">Inactivo</option>
          </SelectForm>
        )}

        <div className="col-span-1 sm:col-span-1 flex justify-center mt-4">
          <ButtonForm
            name={gravamenSeleccionado ? "Actualizar" : "Registrar"}
            type="submit"
          />
        </div>
      </form>

      {error && <Notificacion type="error" message={error} />}
      {success && <Notificacion type="success" message={success} />}
    </ContenedorRegistrar>
  );
};

export default RegistrarGravamen;
