"use client";

import axios from "axios";

import { useEffect, useState, useRef } from "react";
import { Pencil, Eye, PlusCircle, XCircle } from "lucide-react";

import { CategoriaDTO } from "@/dto/CategoriaDTO";

import MostrarInfoCategoria from "@/components/categorias/MostrarInfoCategoria";
import RegistrarCategoria from "@/components/categorias/RegistrarCategoria";
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

const CategoriasPage: React.FC = () => {
    const [modalInfo, setModalInfo] = useState(false);
    const [modalRegistrar, setModalRegistrar] = useState(false);
    const [modalActualizar, setModalActualizar] = useState(false);
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<CategoriaDTO | null>(null);
    const [categorias, setCategorias] = useState<CategoriaDTO[]>([]);
    const [categoriasFiltradas, setCategoriasFiltradas] = useState<CategoriaDTO[]>([]);

    const nombreCategoriaRef = useRef<HTMLInputElement>(null);
    const estadoCategoriaRef = useRef<HTMLSelectElement>(null);

    const obtenerCategorias = async () => {
        try {
            const respuesta = await axios.get<CategoriaDTO[]>("/api/categorias");
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
        const estadoCategoria = estadoCategoriaRef.current?.value;

        let categoriasFiltradas = [...categorias];

        if (estadoCategoria && estadoCategoria !== "true") {
            categoriasFiltradas = categoriasFiltradas.filter((categoria) => categoria.estadoCategoria === (estadoCategoria === "true"));
        }

        if (nombreCategoria) {
            categoriasFiltradas = categoriasFiltradas.filter((categoria) => {
                return categoria.nombreCategoria.toLowerCase().includes(nombreCategoria.toLowerCase());
            });
        }

        setCategoriasFiltradas(categoriasFiltradas);
    };

    useEffect(() => {
        filtrarCategorias();
    }, [categorias]);

    const limpiarFiltros = () => {
        if (nombreCategoriaRef.current) nombreCategoriaRef.current.value = "";
        if (estadoCategoriaRef.current) estadoCategoriaRef.current.value = "true";
        filtrarCategorias();
    };

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
                        onChange={filtrarCategorias}
                    />
                    <SelectFiltro
                        id="estadoCategoria"
                        name="Estado"
                        onChange={filtrarCategorias}
                        ref={estadoCategoriaRef}
                        defaultValue="true"
                    >
                        <option value="true">Activo</option>
                        <option value="false">Inactivo</option>
                    </SelectFiltro>
                </ContenedorSelectores>
            </ContenedorFiltros>

            <div className="grid gap-4 md:grid-cols-3">
                {categoriasFiltradas.map((categoria) => (
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