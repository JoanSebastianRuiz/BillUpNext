"use client";

import { useEffect, useState, useRef } from "react";
import { Pencil, PlusCircle, XCircle, FileDown } from "lucide-react";

import { useGravamenContext } from "@/context/GravamenContext";

import { GravamenDTO } from "@/dto/GravamenDTO";

import ContenedorFiltros from "@/components/filtros/ContenedorFiltros";
import ContenedorBotonesFiltros from "@/components/filtros/ContenedorBotonesFiltros";
import BotonFiltro from "@/components/filtros/BotonFiltro";
import ContenedorSelectores from "@/components/filtros/ContenedorSelectores";
import InputFiltro from "@/components/filtros/InputFiltro";
import SelectFiltro from "@/components/filtros/SelectFiltro";
import BotonAccionCard from "@/components/cards/BotonAccionCard";
import Modal from "@/components/modal/Modal";
import ContenedorPrincipal from "@/components/common/ContenedorPrincipal";
import RegistrarGravamen from "@/components/gravamenes/RegistrarGravamen";
import ControlesPaginacion from "@/components/common/ControlesPaginacion";
import Table from "@/components/common/Table";

import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { useEmpresaContext } from "@/context/EmpresaContext";
import { useUsuarioContext } from "@/context/UsuarioContext";

const GravamenesPage: React.FC = () => {
  const [modalRegistrar, setModalRegistrar] = useState(false);
  const [modalActualizar, setModalActualizar] = useState(false);
  const [gravamenSeleccionado, setGravamenSeleccionado] = useState<GravamenDTO | null>(null);
  const { gravamenes } = useGravamenContext();
  const { empresas } = useEmpresaContext();
  const { usuario } = useUsuarioContext();

  const [gravamenesFiltrados, setGravamenesFiltrados] = useState<GravamenDTO[]>([]);

  const nombreGravamenRef = useRef<HTMLInputElement>(null);
  const estadoGravamenRef = useRef<HTMLSelectElement>(null);

  // Paginacion
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6); // Número de gravamenes por página
  const indexOfLastGravamen = currentPage * itemsPerPage;
  const indexOfFirstGravamen = indexOfLastGravamen - itemsPerPage;
  const gravamenesActuales = gravamenesFiltrados.slice(
    indexOfFirstGravamen,
    indexOfLastGravamen
  );
  const totalPages = Math.ceil(gravamenesFiltrados.length / itemsPerPage);

  const filtrarGravamenes = () => {
    const nombreGravamen = nombreGravamenRef.current?.value;
    const estadoGravamen = estadoGravamenRef.current?.value;

    let gravamenesFiltrados = [...gravamenes];

    if (estadoGravamen !== undefined && estadoGravamen !== "") {
      gravamenesFiltrados = gravamenesFiltrados.filter(
        (gravamen) => gravamen.estadoGravamen === (estadoGravamen === "true")
      );
    }

    if (nombreGravamen) {
      gravamenesFiltrados = gravamenesFiltrados.filter((gravamen) => {
        return gravamen.nombreGravamen
          .toLowerCase()
          .includes(nombreGravamen.toLowerCase());
      });
    }

    setGravamenesFiltrados(gravamenesFiltrados);
  };

  const limpiarFiltros = () => {
    if (nombreGravamenRef.current) nombreGravamenRef.current.value = "";
    if (estadoGravamenRef.current) estadoGravamenRef.current.value = "true";
    filtrarGravamenes();
  };

  useEffect(() => {
    filtrarGravamenes();
  }, [gravamenes]);

  const titulosTabla = [
    { titulo: "Nombre", center: false },
    { titulo: "Acciones", center: true },
  ];

  const exportarDatosPDF = () => {
    const empresa = empresas.find(empresa => empresa.idEmpresa === usuario.idEmpresa);

    const doc = new jsPDF(); // orientación vertical por defecto

    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 14;

    // Fecha alineada a la derecha (mejor alineación)
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    const fechaTexto = `Fecha: ${new Date().toLocaleString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })}`;
    const fechaX = pageWidth - margin; // posición base en el borde derecho
    doc.text(fechaTexto, fechaX, 10, { align: "right" }); // 'align: right' hace que el texto termine en X

    // Título centrado
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    const titulo = `Gravámenes - ${empresa?.nombreEmpresa}`;
    const titleX = (pageWidth - doc.getTextWidth(titulo)) / 2;
    doc.text(titulo, titleX, 20);

    // Línea separadora
    doc.setLineWidth(0.5);
    doc.line(14, 30, pageWidth - 14, 30); // línea horizontal justo debajo del título

    // Tabla de gravámenes
    autoTable(doc, {
      startY: 40, // espacio después de la línea
      head: [["Gravámen", "Estado"]],
      body: gravamenesFiltrados.map((c) => [
        c.nombreGravamen,
        c.estadoGravamen ? "Activa" : "Inactiva",
      ]),
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

    doc.save(`Reporte_gravamenes_${fechaNombre}.pdf`);
  };

  return (
    <ContenedorPrincipal>
      <ContenedorFiltros title="Gravámenes">
        <ContenedorBotonesFiltros>
          <BotonFiltro
            onClick={() => setModalRegistrar(true)}
            Symbol={PlusCircle}
            name="Agregar gravamen"
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

        <ContenedorSelectores>

          <InputFiltro
            id="nombreGravamen"
            name="Nombre"
            ref={nombreGravamenRef}
            onChange={filtrarGravamenes}
          />

          <SelectFiltro
            id="estadoGravamen"
            name="Estado"
            onChange={filtrarGravamenes}
            ref={estadoGravamenRef}
            selectEstado={true}
            defaultValue="true"
          >
            <option value="true">Activo</option>
            <option value="false">Inactivo</option>
          </SelectFiltro>
        </ContenedorSelectores>
      </ContenedorFiltros>

      {/* Gravamenes */}

      <div className="w-1/2 mx-auto">
        <Table titulos={titulosTabla}>
          {gravamenesActuales.length > 0 ? (
            gravamenesActuales.map((gravamen) => (
              <tr className="hover:bg-gray-100 dark:hover:bg-gray-700" key={gravamen.idGravamen}>
                <td className="px-4 py-3">{gravamen.nombreGravamen}</td>
                <td className="text-center px-4 py-3">
                  <BotonAccionCard
                    Symbol={Pencil}
                    onClick={() => {
                      setGravamenSeleccionado(gravamen);
                      setModalActualizar(true);
                    }}
                  />
                </td>
              </tr>
            ))) : (

            <tr>
              <td colSpan={2} className="text-center py-4 text-gray-500 dark:text-gray-400">
                No se encontraron gravámenes
              </td>
            </tr>
          )}
        </Table>
      </div>


      <ControlesPaginacion
        currentPage={currentPage}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
      />

      <Modal isOpen={modalRegistrar} setIsOpen={() => setModalRegistrar(false)} size="small">
        <RegistrarGravamen
          setModalRegistrar={setModalRegistrar}
        />
      </Modal>

      <Modal
        isOpen={modalActualizar}
        setIsOpen={() => setModalActualizar(false)}
        size="small"
      >
        <RegistrarGravamen
          gravamenSeleccionado={gravamenSeleccionado}
          setModalActualizar={setModalActualizar}
        />
      </Modal>
    </ContenedorPrincipal>
  );
};

export default GravamenesPage;
