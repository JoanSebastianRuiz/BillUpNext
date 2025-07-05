"use client";

import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";

import InputForm from "@/components/form/InputForm";
import SelectForm from "@/components/form/SelectForm";
import Notificacion from "@/components/form/Notificacion";
import ContenedorRegistrar from "../modal/ContenedorRegistrar";
import ButtonForm from "../form/ButtonForm";
import { useProductoContext } from "@/context/ProductoContext";
import { DetalleVentaDTO } from "@/dto/DetalleVentaDTO";

interface RegistrarDetalleVentaProps {
  detalleVenta?: DetalleVentaDTO | null;
  setModal: (value: boolean) => void;
  detallesVenta: DetalleVentaDTO[];
  setDetallesVenta: (detalles: DetalleVentaDTO[]) => void;
  contadorDetalles: number;
  setContadorDetalles: (numero: number) => void;
}

const RegistrarDetalleVenta = ({
  detalleVenta,
  detallesVenta,
  setDetallesVenta,
  setModal,
  contadorDetalles,
  setContadorDetalles,
}: RegistrarDetalleVentaProps) => {
  const { productos } = useProductoContext();
  const [productosFiltrados, setProductosFiltrados] = useState(productos.filter((producto) => producto.stockProducto > 0));
  const [success, setSuccess] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    reset,
    setError,//añadido para manejar errores para la verificación de stock
  } = useForm<DetalleVentaDTO>();

  const idProducto = watch("idProducto");
  const cantidadDetalleVenta = watch("cantidadDetalleVenta");

  useEffect(() => {
    let filtrados = [...productos.filter((producto) => producto.stockProducto > 0)];
    for (const detalle of detallesVenta) {
      filtrados = filtrados.filter(
        (producto) => producto.idProducto !== detalle.idProducto
      );
    }
    setProductosFiltrados(filtrados);

    const valor =
      cantidadDetalleVenta *
      (productos.find((producto) => producto.idProducto == idProducto)
        ?.valorTotalProducto || 0);
    setValue("valorTotalDetalleVenta", valor);
  }, [productos, idProducto, cantidadDetalleVenta, detallesVenta, setValue]);

  useEffect(() => {
    if (detalleVenta) {
      setValue("idProducto", detalleVenta.idProducto);
      setValue("cantidadDetalleVenta", detalleVenta.cantidadDetalleVenta);
      setValue("valorTotalDetalleVenta", detalleVenta.valorTotalDetalleVenta);
    }
  }, [detalleVenta, setValue]);

  //  Función para verificar el stock usando el API
  const verificarStockAntesDeAgregar = async (
    idProducto: number,
    cantidadDetalleVenta: number
  ): Promise<boolean> => {
    try {
      const response = await fetch("/api/verificar-stock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idProducto, cantidadDetalleVenta }),
      });

      const data = await response.json();
      return data.tieneStock;
    } catch (error) {
      console.error("Error al verificar stock:", error);
      return false;
    }
  };

  const onSubmit = async (data: DetalleVentaDTO) => {
    const producto = productos.find(
      (producto) => producto.idProducto === parseInt(data.idProducto.toString())
    );
    const valorDescuentoDetalleVenta =
      (producto?.valorDescuentoProducto ?? 0) * data.cantidadDetalleVenta;
    const valorImpuestosDetalleVenta =
      (producto?.valorImpuestoProducto ?? 0) * data.cantidadDetalleVenta;

    if (detalleVenta) {
      const dataModificada = {
        ...data,
        idDetalleVenta: detalleVenta.idDetalleVenta,
        idProducto: parseInt(data.idProducto.toString()),
        cantidadDetalleVenta: parseInt(data.cantidadDetalleVenta.toString()),
        valorDescuentoDetalleVenta,
        valorImpuestosDetalleVenta,
      };

      const detallesVentaActualizados = detallesVenta.map((detalle) =>
        detalle.idDetalleVenta === detalleVenta.idDetalleVenta
          ? dataModificada
          : detalle
      );
      setDetallesVenta(detallesVentaActualizados);
      setSuccess("Producto actualizado");
      setModal(false);
    } else {
      // Verificación de stock antes de agregar el producto
      const idProducto = parseInt(data.idProducto.toString());
      const cantidad = parseInt(data.cantidadDetalleVenta.toString());

      const tieneStock = await verificarStockAntesDeAgregar(
        idProducto,
        cantidad
      );
      if (!tieneStock) {
        setSuccess(null);
        setError("cantidadDetalleVenta", {
          type: "manual",
          message: "No hay suficiente stock disponible para este producto.",
        });
        return;
      }// Fin de la verificación de stock
      const dataModificada = {
        ...data,
        idDetalleVenta: contadorDetalles + 1,
        idProducto: parseInt(data.idProducto.toString()),
        cantidadDetalleVenta: parseInt(data.cantidadDetalleVenta.toString()),
        valorDescuentoDetalleVenta,
        valorImpuestosDetalleVenta,
      };
      setContadorDetalles(contadorDetalles + 1);
      const detallesVentaActualizados: DetalleVentaDTO[] = [
        ...detallesVenta,
        dataModificada,
      ];
      setDetallesVenta(detallesVentaActualizados);
      setSuccess("Producto agregado");
      setModal(false);
      reset();
    }
  };

  return (
    <ContenedorRegistrar
      name={detalleVenta ? "Actualizar producto" : "Registrar producto"}
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4"
      >
        <SelectForm
          label="Producto"
          register={register}
          name="idProducto"
          validationRules={{
            required: { value: true, message: "Este campo es obligatorio" },
          }}
          errors={errors}
        >
          <option value="" disabled>
            {productosFiltrados.length > 0 ? 'Seleccione un producto' : 'No hay productos disponibles'}
          </option>
          {productosFiltrados.map((producto) => (
            <option key={producto.idProducto} value={producto.idProducto}>
              {producto.nombreProducto}
            </option>
          ))}
        </SelectForm>

        <InputForm
          label="Cantidad"
          register={register}
          name="cantidadDetalleVenta"
          type="number"
          validationRules={{
            required: { value: true, message: "Este campo es obligatorio" },
            min: { value: 1, message: "Mínimo 1" },
          }}
          errors={errors}
        />

        <InputForm
          label="Valor"
          register={register}
          name="valorTotalDetalleVenta"
          type="number"
          disabled={true}
          dinero={true}
          validationRules={{
            required: { value: true, message: "Este campo es obligatorio" },
          }}
          errors={errors}
        />

        <div className="col-span-1 sm:col-span-2 flex justify-center mt-4">
          <ButtonForm
            name={detalleVenta ? "Actualizar" : "Registrar"}
            type="submit"
          />
        </div>
      </form>

      {/* Notificaciones */}
      {success && <Notificacion type="success" message={success} />}
    </ContenedorRegistrar>
  );
};

export default RegistrarDetalleVenta;