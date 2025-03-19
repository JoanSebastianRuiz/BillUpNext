"use client"

import { useProductoContext } from "@/context/ProductoContext";
import { useGravamenContext } from "@/context/GravamenContext";
import { ReactNode } from "react";
import { Pencil, PlusCircle, XCircle } from "lucide-react";
import { useState, useEffect, useRef } from "react";

import { ProductoResponseDTO } from "@/dto/ProductoResponseDTO";

import ContenedorRegistrar from "../../modal/ContenedorRegistrar";
import Modal from "../../modal/Modal";
import RegistrarGravamenProducto from "./RegistrarGravamenProducto";
import ContenedorFiltros from "../../filtros/ContenedorFiltros";
import ContenedorBotonesFiltros from "../../filtros/ContenedorBotonesFiltros";
import BotonFiltro from "../../filtros/BotonFiltro";
import ContenedorSelectores from "../../filtros/ContenedorSelectores";
import InputFiltro from "../../filtros/InputFiltro";
import SelectFiltro from "../../filtros/SelectFiltro";
import BotonAccionCard from "../../cards/BotonAccionCard";
import ControlesPaginacion from "../../common/ControlesPaginacion";
import Table from "@/components/common/Table";

interface GravamenMostrar {
    idGravamenProducto: number;
    nombreGravamen: string;
    porcentajeGravamenProducto: number;
}

const SublistaGravamenes = ({ producto}: { producto: ProductoResponseDTO | ProductoResponseDTO | null }) => {
    const { gravamenesProducto } = useProductoContext();
    const { gravamenes } = useGravamenContext();

    const productosGravamen = gravamenesProducto.filter(p => p.idProducto === producto?.idProducto);
    const gravamenesMostrar = productosGravamen.map(p => {
        const gravamen = gravamenes.find(pg => pg.idGravamen === p.idGravamen);
        return {
            ...p,
            nombreGravamen: gravamen?.nombreGravamen ?? "",
            idGravamenProducto: p.idGravamenProducto ?? 0
        };
    })

    const [gravamenesFiltrados, setGravamenesFiltrados] = useState<GravamenMostrar[]>(gravamenesMostrar);

    const [modalActualizar, setModalActualizar] = useState(false);
    const [modalRegistar, setModalRegistrar] = useState(false);
    const [idGravamenProductoSeleccionado, setIdGravamenProductoSeleccionado] = useState<number>(0);

    const nombreGravamenRef = useRef<HTMLInputElement>(null);

     // Paginacion
     const [currentPage, setCurrentPage] = useState(1);
     const [itemsPerPage] = useState(6); // Número de gravamenes por página
     const indexOfLastGravamen = currentPage * itemsPerPage;
     const indexOfFirstGravamen = indexOfLastGravamen - itemsPerPage;
     const gravamenesActuales = gravamenesFiltrados.slice(indexOfFirstGravamen, indexOfLastGravamen);
     const totalPages = Math.ceil(gravamenesFiltrados.length / itemsPerPage);

    const filtrarProductosGravamen = () => {
        const nombreGravamen = nombreGravamenRef.current?.value;

        let gravamenesFiltrados = [ ...gravamenesMostrar];

        if (nombreGravamen) {
            gravamenesFiltrados = gravamenesFiltrados.filter((gravamen) => {
                return gravamen && gravamen.nombreGravamen && gravamen.nombreGravamen
                .toLowerCase()
                .includes(nombreGravamen.toLowerCase());
            });
        }

        setGravamenesFiltrados(gravamenesFiltrados);
    };

    useEffect(() => {
        filtrarProductosGravamen();
    }, [gravamenes, gravamenesProducto]);

    const limpiarFiltros = () => {
        if (nombreGravamenRef.current) nombreGravamenRef.current.value = "";
    };

    const titulosTabla= [
        { titulo: "Nombre", center: false },
        { titulo: "Porcentaje", center: false },
        { titulo: "Acciones", center: true }
    ];

    return (
        <ContenedorRegistrar name="">
            <ContenedorFiltros title="Gravamenes">
                {/* Botones de filtros */}
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

                {/* Selectores de filtros */}
                <ContenedorSelectores>
                    <InputFiltro
                        id="nombreGravamen"
                        name="Nombre"
                        ref={nombreGravamenRef}
                        onChange={filtrarProductosGravamen}
                    />
                </ContenedorSelectores>
            </ContenedorFiltros>

            {/* Tabla de gravamenes */}
            <Table titulos={titulosTabla}>
                {gravamenesActuales.length === 0 ? (
                    <tr>
                        <td colSpan={3} className="text-center py-4 text-gray-500 dark:text-gray-400">
                            No se encontraron gravamenes relacionados
                        </td>
                    </tr>
                ) : (
                    gravamenesActuales.map((g) => (
                        <tr key={g.idGravamenProducto} className="hover:bg-gray-100 dark:hover:bg-gray-700">
                            <td className="px-4 py-3">{g.nombreGravamen}</td>
                            <td className="px-4 py-3">$ {g.porcentajeGravamenProducto}</td>
                            <td className="px-4 py-3 text-center">
                                <BotonAccionCard
                                    Symbol={Pencil}
                                    onClick={() => {
                                        setIdGravamenProductoSeleccionado(g.idGravamenProducto);
                                        setModalActualizar(true);
                                    }}
                                    h={5}
                                />
                            </td>
                        </tr>
                    ))
                )}
            </Table>

            {/* Controles de paginación */}
            <ControlesPaginacion
                currentPage={currentPage}
                totalPages={totalPages}
                setCurrentPage={setCurrentPage}
            />


            {/* Modal para aagregar un gravamen producto*/}
            <Modal isOpen={modalRegistar} setIsOpen={() => setModalRegistrar(false)}>
                <RegistrarGravamenProducto idProducto={producto?.idProducto} setModalRegistrar={setModalRegistrar} />
            </Modal>


            {/* Modal para actualizar un gravamen producto*/}
            <Modal isOpen={modalActualizar} setIsOpen={() => setModalActualizar(false)}>
                <RegistrarGravamenProducto idProducto={producto?.idProducto} idGravamenProductoSeleccionado={idGravamenProductoSeleccionado} setModalActualizar={setModalActualizar} />
            </Modal>

        </ContenedorRegistrar>
    );
};

export default SublistaGravamenes;