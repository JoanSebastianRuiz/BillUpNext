"use client";

import axios from "axios";
import { useEffect, useState, useRef } from "react";
import { Pencil, Eye, PlusCircle, XCircle } from "lucide-react";

import { useEmpresaContext } from "@/context/EmpresaContext";

import { CategoriaDTO } from "@/dto/CategoriaDTO";

import ContenedorFiltros from "@/components/filtros/ContenedorFiltros";
import ContenedorBotonesFiltros from "@/components/filtros/ContenedorBotonesFiltros";
import BotonFiltro from "@/components/filtros/BotonFiltro";
import ContenedorSelectores from "@/components/filtros/ContenedorSelectores";
import InputFiltro from "@/components/filtros/InputFiltro";
import SelectFiltro from "@/components/filtros/SelectFiltro";
import CategoriaCard from "@/components/categorias/CategoriaCard";
import ContenedorBotonesAccionCard from "@/components/cards/ContenedorBotonesAccionCard";
import BotonAccionCard from "@/components/cards/BotonAccionCard";
import Modal from "@/components/modal/Modal";
import ContenedorPrincipal from "@/components/common/ContenedorPrincipal";
import RegistrarCategoria from "@/components/categorias/RegistrarCategoria";
import ControlesPaginacion from "@/components/common/ControlesPaginacion";
import { useProductoContext } from "@/context/ProductoContext";

const CategoriasPage: React.FC = () => {
    const [modalInfo, setModalInfo] = useState(false);
    const [modalRegistrar, setModalRegistrar] = useState(false);
    const [modalActualizar, setModalActualizar] = useState(false);
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<CategoriaDTO | null>(null);
    const { categorias, obtenerCategorias } = useProductoContext()
    const { empresas } = useEmpresaContext();
    const [categoriasFiltradas, setCategoriasFiltradas] = useState<CategoriaDTO[]>([]);

    const nombreCategoriaRef = useRef<HTMLInputElement>(null);
    const idEmpresaRef = useRef<HTMLSelectElement>(null);
    const estadoCategoriaRef = useRef<HTMLSelectElement>(null);

    // Paginacion
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(12); // Número de categorias por página
    const indexOfLastCategoria = currentPage * itemsPerPage;
    const indexOfFirstCategoria = indexOfLastCategoria - itemsPerPage;
    const categoriasActuales = categoriasFiltradas.slice(indexOfFirstCategoria, indexOfLastCategoria);
    const totalPages = Math.ceil(categoriasFiltradas.length / itemsPerPage);

    const filtrarCategorias = () => {
        const nombreCategoria = nombreCategoriaRef.current?.value;
        const estadoCategoria = estadoCategoriaRef.current?.value;

        let categoriasFiltradas = [...categorias];

        if (estadoCategoria !== undefined && estadoCategoria !== "") {
            categoriasFiltradas = categoriasFiltradas.filter((categoria) => categoria.estadoCategoria === (estadoCategoria === "true"));
        }

        if (nombreCategoria) {
            categoriasFiltradas = categoriasFiltradas.filter((categoria) => {
                return categoria.nombreCategoria.toLowerCase().includes(nombreCategoria.toLowerCase());
            });
        }

        setCategoriasFiltradas(categoriasFiltradas);
    };

    const limpiarFiltros = () => {
        if (nombreCategoriaRef.current) nombreCategoriaRef.current.value = "";
        filtrarCategorias();
    };

    useEffect(() => {
        filtrarCategorias();
    }, [categorias]);



    return (
        <ContenedorPrincipal>
            <ContenedorFiltros title="Categorías">
                <ContenedorBotonesFiltros>
                    <BotonFiltro
                        onClick={() => setModalRegistrar(true)}
                        Symbol={PlusCircle}
                        name="Agregar categoría"
                    />
                    <BotonFiltro
                        onClick={limpiarFiltros}
                        Symbol={XCircle}
                        name="Limpiar filtros"
                    />
                </ContenedorBotonesFiltros>

                <ContenedorSelectores>

                    <InputFiltro
                        id="nombreCategoria"
                        name="Nombre"
                        ref={nombreCategoriaRef}
                        onChange={filtrarCategorias} />

                    <SelectFiltro
                        id="estadoCategoria"
                        name="Estado"
                        onChange={filtrarCategorias}
                        ref={estadoCategoriaRef}
                        selectEstado={true}
                        defaultValue="true"
                    >
                        <option value="true">Activo</option>
                        <option value="false">Inactivo</option>
                    </SelectFiltro>
                </ContenedorSelectores>
            </ContenedorFiltros>

            {categoriasActuales.length === 0 ? (
                <div className="text-center text-gray-500 mt-8">
                    No se encontraron categorías
                </div>
            ) : (
                <div className="grid gap-4 md:grid-cols-3">
                    {categoriasActuales.map((categoria) => (
                        <CategoriaCard categoria={categoria} key={categoria.idCategoria}>
                            <ContenedorBotonesAccionCard>
                                <BotonAccionCard
                                    Symbol={Pencil}
                                    onClick={() => {
                                        setCategoriaSeleccionada(categoria);
                                        setModalActualizar(true);
                                    }}
                                />
                            </ContenedorBotonesAccionCard>
                        </CategoriaCard>
                    ))}
                </div>
            )}
            <ControlesPaginacion
                currentPage={currentPage}
                totalPages={totalPages}
                setCurrentPage={setCurrentPage}
            />

            <Modal isOpen={modalRegistrar} setIsOpen={() => setModalRegistrar(false)}>
                <RegistrarCategoria setModalRegistrar={setModalRegistrar} />
            </Modal>

            <Modal isOpen={modalActualizar} setIsOpen={() => setModalActualizar(false)}>
                <RegistrarCategoria categoriaSeleccionada={categoriaSeleccionada} setModalActualizar={setModalActualizar} />
            </Modal>
        </ContenedorPrincipal>
    );
};

export default CategoriasPage;