"use client";

import { useEffect, useState, useRef } from "react";
import { Pencil, PlusCircle, XCircle } from "lucide-react";
import { useProductoContext } from "@/context/ProductoContext";

import { CategoriaDTO } from "@/dto/CategoriaDTO";

import ContenedorFiltros from "@/components/filtros/ContenedorFiltros";
import ContenedorBotonesFiltros from "@/components/filtros/ContenedorBotonesFiltros";
import BotonFiltro from "@/components/filtros/BotonFiltro";
import ContenedorSelectores from "@/components/filtros/ContenedorSelectores";
import InputFiltro from "@/components/filtros/InputFiltro";
import SelectFiltro from "@/components/filtros/SelectFiltro";
import BotonAccionCard from "@/components/cards/BotonAccionCard";
import Modal from "@/components/modal/Modal";
import ContenedorPrincipal from "@/components/common/ContenedorPrincipal";
import RegistrarCategoria from "@/components/categorias/RegistrarCategoria";
import ControlesPaginacion from "@/components/common/ControlesPaginacion";
import Table from "@/components/common/Table";


const CategoriasPage: React.FC = () => {
    const [modalRegistrar, setModalRegistrar] = useState(false);
    const [modalActualizar, setModalActualizar] = useState(false);
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<CategoriaDTO | null>(null);
    const { categorias } = useProductoContext()
    const [categoriasFiltradas, setCategoriasFiltradas] = useState<CategoriaDTO[]>([]);

    const nombreCategoriaRef = useRef<HTMLInputElement>(null);
    const estadoCategoriaRef = useRef<HTMLSelectElement>(null);

    // Paginacion
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(6); // Número de categorias por página
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
        if (estadoCategoriaRef.current) estadoCategoriaRef.current.value = "true";
        filtrarCategorias();
    };

    useEffect(() => {
        filtrarCategorias();
    }, [categorias]);

    const titulosTabla = [
        { titulo: "Nombre", center: false },
        { titulo: "Acciones", center: true }
    ]



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

            <div className="w-1/2 mx-auto">
                <Table titulos={titulosTabla}>
                    {categoriasActuales.length > 0 ? (
                        categoriasActuales.map((categoria) => (
                            <tr key={categoria.idCategoria} className="hover:bg-gray-100 dark:hover:bg-gray-700">
                                <td className="px-4 py-3">{categoria.nombreCategoria}</td>
                                <td className="px-4 py-3 text-center">
                                    <BotonAccionCard
                                        Symbol={Pencil}
                                        onClick={() => {
                                            setCategoriaSeleccionada(categoria);
                                            setModalActualizar(true);
                                        }}
                                        h={5}
                                    />
                                </td>
                            </tr>
                        ))) : (

                        <tr>
                            <td colSpan={3} className="text-center py-4 text-gray-500 dark:text-gray-400">
                                No se encontraron categorías
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
                <RegistrarCategoria setModalRegistrar={setModalRegistrar} />
            </Modal>

            <Modal isOpen={modalActualizar} setIsOpen={() => setModalActualizar(false)}>
                <RegistrarCategoria categoriaSeleccionada={categoriaSeleccionada} setModalActualizar={setModalActualizar} />
            </Modal>
        </ContenedorPrincipal>
    );
};

export default CategoriasPage;