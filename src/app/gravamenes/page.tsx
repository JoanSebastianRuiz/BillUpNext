"use client";

import axios from "axios";
import { useEffect, useState, useRef } from "react";
import { Pencil, Eye, PlusCircle, XCircle } from "lucide-react";

import { useGravamenContext } from "@/context/GravamenContext";

import { GravamenDTO } from "@/dto/GravamenDTO";

import ContenedorFiltros from "@/components/filtros/ContenedorFiltros";
import ContenedorBotonesFiltros from "@/components/filtros/ContenedorBotonesFiltros";
import BotonFiltro from "@/components/filtros/BotonFiltro";
import ContenedorSelectores from "@/components/filtros/ContenedorSelectores";
import InputFiltro from "@/components/filtros/InputFiltro";
import SelectFiltro from "@/components/filtros/SelectFiltro";
import GravamenCard from "@/components/gravamenes/GravamenCard";
import ContenedorBotonesAccionCard from "@/components/cards/ContenedorBotonesAccionCard";
import BotonAccionCard from "@/components/cards/BotonAccionCard";
import Modal from "@/components/modal/Modal";
import ContenedorPrincipal from "@/components/common/ContenedorPrincipal";
import RegistrarGravamen from "@/components/gravamenes/RegistrarGravamen";
import ControlesPaginacion from "@/components/common/ControlesPaginacion";

const GravamenesPage: React.FC = () => {
  const [modalInfo, setModalInfo] = useState(false);
  const [modalRegistrar, setModalRegistrar] = useState(false);
  const [modalActualizar, setModalActualizar] = useState(false);
  const [gravamenSeleccionado, setGravamenSeleccionado] =
    useState<GravamenDTO | null>(null);
  const { gravamenes, obtenerGravamenes } = useGravamenContext();
  const [gravamenesFiltrados, setGravamenesFiltrados] = useState<GravamenDTO[]>(
    []
  );

  const nombreGravamenRef = useRef<HTMLInputElement>(null);
  const estadoGravamenRef = useRef<HTMLSelectElement>(null);

  // Paginacion
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12); // Número de gravamenes por página
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
    filtrarGravamenes();
  };

  useEffect(() => {
    filtrarGravamenes();
  }, [gravamenes]);

  return (
    <ContenedorPrincipal>
      <ContenedorFiltros title="Gravamenes">
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

      {gravamenesActuales.length === 0 ? (
        <div className="text-center text-gray-500 mt-8">
          No se encontraron gravamenes
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-3">
          {gravamenesActuales.map((gravamen) => (
            <GravamenCard gravamen={gravamen} key={gravamen.idGravamen}>
              <ContenedorBotonesAccionCard>
                <BotonAccionCard
                  Symbol={Pencil}
                  onClick={() => {
                    setGravamenSeleccionado(gravamen);
                    setModalActualizar(true);
                  }}
                />
              </ContenedorBotonesAccionCard>
            </GravamenCard>
          ))}
        </div>
      )}

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
