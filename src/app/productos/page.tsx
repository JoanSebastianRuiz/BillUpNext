"use client";

import axios from "axios";

import { useEffect, useState, useRef } from "react";
import { Pencil, Eye, PlusCircle, XCircle, ReceiptText, FileDown } from "lucide-react";

import { useProductoContext } from "@/context/ProductoContext";

import { ProductoResponseDTO } from "@/dto/ProductoResponseDTO";

import MostrarInfoProducto from "@/components/productos/MostrarInfoProducto";
import RegistrarProducto from "@/components/productos/RegistrarProducto";
import ContenedorFiltros from "@/components/filtros/ContenedorFiltros";
import ContenedorBotonesFiltros from "@/components/filtros/ContenedorBotonesFiltros";
import BotonFiltro from "@/components/filtros/BotonFiltro";
import ContenedorSelectores from "@/components/filtros/ContenedorSelectores";
import InputFiltro from "@/components/filtros/InputFiltro";
import SelectFiltro from "@/components/filtros/SelectFiltro";
import ProductoCard from "@/components/productos/ProductoCard";
import ContenedorBotonesAccionCard from "@/components/cards/ContenedorBotonesAccionCard";
import BotonAccionCard from "@/components/cards/BotonAccionCard";
import Modal from "@/components/modal/Modal";
import ContenedorPrincipal from "@/components/common/ContenedorPrincipal";
import ControlesPaginacion from "@/components/common/ControlesPaginacion";
import SublistaGravamenes from "@/components/productos/gravamenes/SublistaGravamenProducto";

import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { useEmpresaContext } from "@/context/EmpresaContext";
import { useUsuarioContext } from "@/context/UsuarioContext";

const ProductosPage: React.FC = (gravamenProducto) => {
  const [modalInfo, setModalInfo] = useState(false);
  const [modalRegistrar, setModalRegistrar] = useState(false);
  const [modalActualizar, setModalActualizar] = useState(false);
  const [modalGravamenes, setModalGravamenes] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] =
    useState<ProductoResponseDTO | null>(null);
  const [productosFiltrados, setProductosFiltrados] = useState<
    ProductoResponseDTO[]
  >([]);
  const { productos, categorias } = useProductoContext();
  const { empresas } = useEmpresaContext();
  const { usuario } = useUsuarioContext();

  const nombreProductoRef = useRef<HTMLInputElement>(null);
  const idCategoriaRef = useRef<HTMLSelectElement>(null);
  const estadoProductoRef = useRef<HTMLSelectElement>(null);

  // Paginacion
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12); // Número de productos por página
  const indexOfLastProducto = currentPage * itemsPerPage;
  const indexOfFirstProducto = indexOfLastProducto - itemsPerPage;
  const productosActuales = productosFiltrados.slice(
    indexOfFirstProducto,
    indexOfLastProducto
  );
  const totalPages = Math.ceil(productosFiltrados.length / itemsPerPage);

  const filtrarProductos = () => {
    const nombreProducto = nombreProductoRef.current?.value;
    const idCategoria = idCategoriaRef.current?.value;
    const estadoProducto = estadoProductoRef.current?.value;

    let productosFiltrados = [...productos];

    if (estadoProducto !== undefined && estadoProducto !== "") {
      productosFiltrados = productosFiltrados.filter(
        (producto) => producto.estadoProducto === (estadoProducto === "true")
      );
    }

    if (nombreProducto) {
      productosFiltrados = productosFiltrados.filter((producto) => {
        return producto.nombreProducto
          .toLowerCase()
          .includes(nombreProducto.toLowerCase());
      });
    }

    if (idCategoria && idCategoria !== "0") {
      productosFiltrados = productosFiltrados.filter(
        (producto) => producto.idCategoria === Number(idCategoria)
      );
    }

    setProductosFiltrados(productosFiltrados);
  };

  useEffect(() => {
    filtrarProductos();
  }, [productos]);

  const limpiarFiltros = () => {
    if (nombreProductoRef.current) nombreProductoRef.current.value = "";
    if (idCategoriaRef.current) idCategoriaRef.current.value = "0";
    if (estadoProductoRef.current) estadoProductoRef.current.value = "true";
    filtrarProductos();
  };

  const exportarDatosPDF = () => {
    const empresa = empresas.find(empresa => empresa.idEmpresa === usuario.idEmpresa);

    const doc = new jsPDF({
      orientation: "landscape", //  Orientación horizontal
    });

    const pageWidth = doc.internal.pageSize.getWidth();

    // Fecha alineada a la derecha
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    const fechaTexto = `Fecha: ${new Date().toLocaleString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })}`;
    const paddingRight = 14;
    const fechaX = pageWidth - doc.getTextWidth(fechaTexto) - paddingRight;
    doc.text(fechaTexto, fechaX, 15); // Parte superior derecha

    // Título centrado
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    const titulo = `Productos - ${empresa?.nombreEmpresa}`;
    const titleX = (pageWidth - doc.getTextWidth(titulo)) / 2;
    doc.text(titulo, titleX, 20);

    // Línea separadora
    doc.setLineWidth(0.5);
    doc.line(14, 30, pageWidth - 14, 30); // ajustado a landscape

    // Tabla de productos
    autoTable(doc, {
      startY: 40, // ajustado por la línea separadora
      head: [["Producto", "Categoría", "Precio base", "Descuento", "Impuestos", "Precio de venta", "Stock mínimo", "Stock máximo", "Stock actual", "Estado"]],
      body: productosFiltrados.map((p) => {
        const categoria = categorias.find(c => c.idCategoria === p.idCategoria)?.nombreCategoria || "N/A";

        return [
          p.nombreProducto,
          categoria,
          p.precioVentaProducto,
          `${p.porcentajeDescuentoProducto || 0}%`,
          p.valorImpuestoProducto,
          p.valorTotalProducto,
          p.stockMinimoProducto,
          p.stockMaximoProducto,
          p.stockProducto,
          p.estadoProducto ? "Activo" : "Inactivo",
        ]
      }),
      theme: "striped",
      styles: {
        fontSize: 10,
        halign: "center",
        valign: "middle",
      },
      headStyles: {
        fillColor: [44, 62, 80],
        textColor: [255, 255, 255],
        fontSize: 11,
      },
      alternateRowStyles: {
        fillColor: [240, 240, 240],
      },
    });

    // Fecha actual para el nombre del archivo
    const fechaActual = new Date();
    const dia = String(fechaActual.getDate()).padStart(2, '0');
    const mes = String(fechaActual.getMonth() + 1).padStart(2, '0');
    const año = fechaActual.getFullYear();
    const fechaNombre = `${dia}_${mes}_${año}`;

    doc.save(`Reporte_productos_${fechaNombre}.pdf`);
  };

  return (
    <ContenedorPrincipal>
      <ContenedorFiltros title="Productos">
        {/* Botones de filtros */}
        <ContenedorBotonesFiltros>
          <BotonFiltro
            onClick={() => setModalRegistrar(true)}
            Symbol={PlusCircle}
            name="Agregar producto"
          />
          <BotonFiltro
            onClick={limpiarFiltros}
            Symbol={XCircle}
            name="Limpiar filtros"
          />
          <BotonFiltro
            onClick={exportarDatosPDF}
            Symbol={FileDown}
            name="Exportar datos" />
        </ContenedorBotonesFiltros>

        {/* Selectores de filtros */}
        <ContenedorSelectores>
          <InputFiltro
            id="nombreProducto"
            name="Nombre"
            ref={nombreProductoRef}
            onChange={filtrarProductos}
          />
          <SelectFiltro
            id="idCategoria"
            name="Categoría"
            onChange={filtrarProductos}
            ref={idCategoriaRef}
          >
            {categorias.map((categoria) => (
              <option key={categoria.idCategoria} value={categoria.idCategoria}>
                {categoria.nombreCategoria}
              </option>
            ))}
          </SelectFiltro>
          <SelectFiltro
            id="estadoProducto"
            name="Estado"
            onChange={filtrarProductos}
            ref={estadoProductoRef}
            defaultValue="true"
            selectEstado={true}
          >
            <option value="true">Activo</option>
            <option value="false">Inactivo</option>
          </SelectFiltro>
        </ContenedorSelectores>
      </ContenedorFiltros>

      {/* Grid de empresas */}
      {productosActuales.length === 0 ? (
        <div className="text-center text-gray-500 mt-8">
          No se encontraron productos
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-3">
          {productosActuales.map((producto) => (
            <ProductoCard producto={producto} key={producto.idProducto}>
              <ContenedorBotonesAccionCard>
                <BotonAccionCard
                  Symbol={Pencil}
                  onClick={() => {
                    setProductoSeleccionado(producto);
                    setModalActualizar(true);
                  }}
                />
                <BotonAccionCard
                  Symbol={Eye}
                  onClick={() => {
                    setProductoSeleccionado(producto);
                    setModalInfo(true);
                  }}
                />

                {gravamenProducto && (
                  <BotonAccionCard
                    Symbol={ReceiptText}
                    onClick={() => {
                      setProductoSeleccionado(producto);
                      setModalGravamenes(true);
                    }}
                  />
                )}
              </ContenedorBotonesAccionCard>
            </ProductoCard>
          ))}
        </div>
      )}

      {/* Controles de paginación */}
      <ControlesPaginacion
        currentPage={currentPage}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
      />

      {/* Modal para mostrar la información de un producto*/}
      <Modal isOpen={modalInfo} setIsOpen={() => setModalInfo(false)}>
        {productoSeleccionado && (
          <MostrarInfoProducto producto={productoSeleccionado} />
        )}
      </Modal>

      {/* Modal para registrar un producto*/}
      <Modal isOpen={modalRegistrar} setIsOpen={() => setModalRegistrar(false)}>
        <RegistrarProducto setModalRegistrar={setModalRegistrar} />
      </Modal>

      {/* Modal para actualizar un producto */}
      <Modal
        isOpen={modalActualizar}
        setIsOpen={() => setModalActualizar(false)}
      >
        <RegistrarProducto
          productoSeleccionado={productoSeleccionado}
          setModalActualizar={setModalActualizar}
        />
      </Modal>

      {/* Modal para gestionar los gravamenes de un producto*/}
      <Modal
        isOpen={modalGravamenes}
        setIsOpen={() => setModalGravamenes(false)}
        size="large"
      >
        <SublistaGravamenes producto={productoSeleccionado} />
      </Modal>
    </ContenedorPrincipal>
  );
};

export default ProductosPage;
