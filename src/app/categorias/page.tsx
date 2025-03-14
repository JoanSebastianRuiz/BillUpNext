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
import MostrarInfoCategoria from "@/components/categorias/MostrarInfoCategoria";
import RegistrarCategoria from "@/components/categorias/RegistrarCategoria";
import ControlesPaginacion from "@/components/common/ControlesPaginacion";

const CategoriasPage: React.FC = () => {
    const [modalInfo, setModalInfo] = useState(false);
    const [modalRegistrar, setModalRegistrar] = useState(false);
    const [modalActualizar, setModalActualizar] = useState(false);
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<CategoriaDTO | null>(null);
    const [categorias, setCategorias] = useState<CategoriaDTO[]>([]);
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

    const obtenerCategorias = async () => {
        try {
            const respuesta = await axios.get<CategoriaDTO[]>("/api/empresas/[idEmpresa]/categorias");
            if (respuesta.status === 200) {
                setCategorias(respuesta.data);
                setCategoriasFiltradas(respuesta.data);
            }
        } catch (error) {
            console.error("Error obteniendo categorías", error);
        }
    };

    useEffect(() => {
        if (!categorias.length) {
            obtenerCategorias();
        }
    }, [categorias.length]);

    const filtrarCategorias = () => {
        const nombreCategoria = nombreCategoriaRef.current?.value;
        const idEmpresa = idEmpresaRef.current?.value;
        const estadoCategoria = estadoCategoriaRef.current?.value;

        let categoriasFiltradas = [...categorias];

        if (estadoCategoria !== undefined && estadoCategoria !== "") {
            categoriasFiltradas = categoriasFiltradas.filter((categoria) => categoria.estadoCategoria === (estadoCategoria === "true"));
        }

        if (idEmpresa && idEmpresa !== "0") {
            categoriasFiltradas = categoriasFiltradas.filter((categoria) => categoria.idEmpresa === Number(idEmpresa));

            if (nombreCategoria) {
                categoriasFiltradas = categoriasFiltradas.filter((categoria) => {
                    return categoria.nombreCategoria.toLowerCase().includes(nombreCategoria.toLowerCase());
                });
            }
        }
    
        setCategoriasFiltradas(categoriasFiltradas);
    };

    const limpiarFiltros = () => {
        if (nombreCategoriaRef.current) nombreCategoriaRef.current.value = "";
        if (idEmpresaRef.current) idEmpresaRef.current.value = "0";
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
                        id="idEmpresa"
                        name="Empresa"
                        onChange={filtrarCategorias}
                        ref={idEmpresaRef}
                    >
                        {empresas.map((emp) => (
                            <option key={emp.idEmpresa} value={emp.idEmpresa.toString()}>
                                {emp.nombreEmpresa}
                            </option>
                        ))}
                    </SelectFiltro>
    
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
                            <BotonAccionCard
                                Symbol={Eye}
                                onClick={() => {
                                    setCategoriaSeleccionada(categoria);
                                    setModalInfo(true);
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

            <Modal isOpen={modalInfo} setIsOpen={() => setModalInfo(false)}>
                {categoriaSeleccionada && <MostrarInfoCategoria categoria={categoriaSeleccionada} />}
            </Modal>

            <Modal isOpen={modalRegistrar} setIsOpen={() => setModalRegistrar(false)}>
                <RegistrarCategoria obtenerCategorias={obtenerCategorias} setModalRegistrar={setModalRegistrar} />
            </Modal>

            <Modal isOpen={modalActualizar} setIsOpen={() => setModalActualizar(false)}>
                <RegistrarCategoria idCategoria={categoriaSeleccionada?.idCategoria} obtenerCategorias={obtenerCategorias} setModalActualizar={setModalActualizar} />
            </Modal>
        </ContenedorPrincipal>
    );
};

export default CategoriasPage;