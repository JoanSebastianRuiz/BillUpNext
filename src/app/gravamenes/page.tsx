"use client";

import { useEffect, useState, useRef } from "react";
import { Pencil, PlusCircle, XCircle } from "lucide-react";

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

const GravamenesPage: React.FC = () => {
  const [modalRegistrar, setModalRegistrar] = useState(false);
  const [modalActualizar, setModalActualizar] = useState(false);
  const [gravamenSeleccionado, setGravamenSeleccionado] = useState<GravamenDTO | null>(null);
  const { gravamenes } = useGravamenContext();

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
              <td colSpan={3} className="text-center py-4 text-gray-500 dark:text-gray-400">
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

      <Modal isOpen={modalRegistrar} setIsOpen={() => setModalRegistrar(false)}>
        <RegistrarGravamen
          setModalRegistrar={setModalRegistrar}
        />
      </Modal>

      <Modal
        isOpen={modalActualizar}
        setIsOpen={() => setModalActualizar(false)}
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
