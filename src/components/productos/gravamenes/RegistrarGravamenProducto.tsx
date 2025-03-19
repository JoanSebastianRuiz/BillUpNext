"use client";

import axios from "axios";

import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { useProductoContext } from "@/context/ProductoContext";

import InputForm from "@/components/form/InputForm";
import SelectForm from "@/components/form/SelectForm";
import Notificacion from "@/components/form/Notificacion";
import ContenedorRegistrar from "../../modal/ContenedorRegistrar";
import ButtonForm from "../../form/ButtonForm";
import { GravamenProductoDTO } from "@/dto/GravamenProductoDTO";
import { useGravamenContext } from "@/context/GravamenContext";

const RegistrarGravamenProducto = ({
  idGravamenProductoSeleccionado,
  setModalActualizar,
  setModalRegistrar,
  idProducto,
}: {
  idGravamenProductoSeleccionado?: number;
  setModalActualizar?: (value: boolean) => void;
  setModalRegistrar?: (value: boolean) => void;
  idProducto?: number;
}) => {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    reset,
  } = useForm<GravamenProductoDTO>();

  const { obtenerGravamenesProducto, gravamenesProducto } =
    useProductoContext();
  const gravamenesProductoSeleccionado = gravamenesProducto.find(
    (p) => p.idGravamenProducto === idGravamenProductoSeleccionado
  );
  const { gravamenes } = useGravamenContext();

  const gravamenesFiltrados = gravamenes.filter(
    (g) =>
      !gravamenesProducto.some(
        (gp) => gp.idGravamen === g.idGravamen && gp.idProducto === idProducto
      )
  );

  useEffect(() => {
    if (gravamenesProductoSeleccionado) {
      setValue(
        "porcentajeGravamenProducto",
        gravamenesProductoSeleccionado?.porcentajeGravamenProducto ?? 0
      );
    }
  }, [gravamenesProductoSeleccionado, setValue]);

  const onSubmit = async (data: GravamenProductoDTO) => {
    try {
      if (gravamenesProductoSeleccionado) {
        const datosModificados = {
          ...data,
          idProducto: idProducto ? parseInt(idProducto.toString()) : undefined,
          idGravamen: gravamenesProductoSeleccionado.idGravamen,
          porcentajeGravamenProducto: parseFloat(
            data.porcentajeGravamenProducto.toString()
          ),
        };

        const respuesta = await axios.put(
          `/api/gravamenProducto/${gravamenesProductoSeleccionado.idGravamenProducto}`,
          datosModificados
        );
        setError(null);
        setSuccess(respuesta.data.message);
        obtenerGravamenesProducto();
        setModalActualizar?.(false);
      } else {
        const datosModificados = {
          ...data,
          idProducto: idProducto ? parseInt(idProducto.toString()) : undefined,
          porcentajeGravamenProducto: parseFloat(
            data.porcentajeGravamenProducto.toString()
          ),
        };

        const respuesta = await axios.post(
          "/api/gravamenProducto",
          datosModificados
        );
        setError(null);
        setSuccess(respuesta.data.message);
        obtenerGravamenesProducto();
        setModalRegistrar?.(false);
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        const mensajeError = error.response.data?.message;
        setSuccess(null);
        setError(mensajeError);
        console.error("Error de axios:", mensajeError, error);
      } else {
        setError("Ocurrió un error inesperado");
        console.error("Error desconocido:", error);
      }
    }
  };

  return (
    <ContenedorRegistrar
      name={
        gravamenesProductoSeleccionado
          ? "Actualizar información"
          : "Registrar gravamen"
      }
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4"
      >
        {!gravamenesProductoSeleccionado && (
          <SelectForm
            label="Gravamen"
            register={register}
            name="idGravamen"
            validationRules={{
              required: { value: true, message: "Este campo es obligatorio" },
            }}
            errors={errors}
          >
            <option value="" disabled>
              Seleccione un gravamen
            </option>
            {gravamenesFiltrados.length > 0 ? (
              gravamenesFiltrados.map((gravamenesProducto) => {
                const gravamen = gravamenes.find(
                  (g) => g.idGravamen === gravamenesProducto.idGravamen
                );
                return (
                  <option
                    key={gravamenesProducto.idGravamen}
                    value={gravamenesProducto.idGravamen}
                  >
                    {gravamen?.nombreGravamen}
                  </option>
                );
              })
            ) : (
              <option value="" disabled>
                {" "}
                No hay gravamenes disponibles
              </option>
            )}
          </SelectForm>
        )}

        <InputForm
          label="Porcentaje gravamen"
          type="number"
          register={register}
          name="porcentajeGravamenProducto"
          validationRules={{
            requerid: { value: true, message: "Este campo es obligatorio" },
            min: {
              value: 0,
              message: "El porcentaje del  gravamen debe ser mayor a 0",
            },
          }}
          errors={errors}
        />

        <div className="col-span-1 sm:col-span-2 flex justify-center mt-4">
          <ButtonForm
            name={gravamenesProductoSeleccionado ? "Actualizar" : "Registrar"}
            type="submit"
          />
        </div>
      </form>

      {error && <Notificacion type="error" message={error} />}
      {success && <Notificacion type="success" message={success} />}
    </ContenedorRegistrar>
  );
};

export default RegistrarGravamenProducto;
