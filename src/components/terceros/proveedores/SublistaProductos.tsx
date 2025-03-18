"use client"

import { useTerceroContext } from "@/context/TerceroContext";
import { useProductoContext } from "@/context/ProductoContext";
import { ReactNode } from "react";
import { Pencil, PlusCircle, XCircle } from "lucide-react";
import { useState, useEffect, useRef } from "react";

import { TerceroResponsePersonaDTO } from "@/dto/TerceroResponsePersonaDTO";

import ContenedorRegistrar from "../../modal/ContenedorRegistrar";
import Modal from "../../modal/Modal";
import RegistrarTerceroProducto from "./RegistrarTerceroProducto";
import ContenedorFiltros from "../../filtros/ContenedorFiltros";
import ContenedorBotonesFiltros from "../../filtros/ContenedorBotonesFiltros";
import BotonFiltro from "../../filtros/BotonFiltro";
import ContenedorSelectores from "../../filtros/ContenedorSelectores";
import InputFiltro from "../../filtros/InputFiltro";
import SelectFiltro from "../../filtros/SelectFiltro";
import BotonAccionCard from "../../cards/BotonAccionCard";
import ControlesPaginacion from "../../common/ControlesPaginacion";
import { TerceroResponseEmpresaDTO } from "@/dto/TerceroResponseEmpresaDTO";
import Table from "@/components/common/Table";

interface ProductoMostrar {
    idTerceroProducto: number;
    nombreProducto: string;
    precioCompraTerceroProducto: number;
    estadoTerceroProducto: boolean;
}


const SublistaProductos = ({ tercero}: { tercero: TerceroResponsePersonaDTO | TerceroResponseEmpresaDTO | null }) => {
    const { proveedoresProducto } = useTerceroContext();
    const { productos } = useProductoContext();

    const productosProveedor = proveedoresProducto.filter(p => p.idTercero === tercero?.idTercero);
    const productosMostrar = productosProveedor.map(p => {
        const producto = productos.find(pr => pr.idProducto === p.idProducto);
        return {
            ...p,
            nombreProducto: producto?.nombreProducto ?? "",
            idTerceroProducto: p.idTerceroProducto ?? 0
        };
    })

    const [productosFiltrados, setProductosFiltrados] = useState<ProductoMostrar[]>(productosMostrar);

    const [modalActualizar, setModalActualizar] = useState(false);
    const [modalRegistar, setModalRegistrar] = useState(false);
    const [idTerceroProductoSeleccionado, setIdTerceroProductoSeleccionado] = useState<number>(0);

    const nombreProductoRef = useRef<HTMLInputElement>(null);
    const estadoTerceroProductoRef = useRef<HTMLSelectElement>(null);

    // Paginacion
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(6); // Número de productos por página
    const indexOfLastProducto = currentPage * itemsPerPage;
    const indexOfFirstProducto = indexOfLastProducto - itemsPerPage;
    const productosActuales = productosFiltrados.slice(indexOfFirstProducto, indexOfLastProducto);
    const totalPages = Math.ceil(productosFiltrados.length / itemsPerPage);

    const filtrarProductosProveedor = () => {
        const nombreProducto = nombreProductoRef.current?.value;
        const estadoTerceroProducto = estadoTerceroProductoRef.current?.value;

        let productosFiltrados = [...productosMostrar];

        if (estadoTerceroProducto !== undefined && estadoTerceroProducto !== "") {
            productosFiltrados = productosFiltrados.filter(
                (producto) => producto.estadoTerceroProducto === (estadoTerceroProducto === "true")
            );
        }

        if (nombreProducto) {
            productosFiltrados = productosFiltrados.filter((producto) => {
                return producto && producto.nombreProducto && producto.nombreProducto
                    .toLowerCase()
                    .includes(nombreProducto.toLowerCase());
            });
        }

        setProductosFiltrados(productosFiltrados);
    };

    useEffect(() => {
        filtrarProductosProveedor();
    }, [productos, proveedoresProducto]);

    const limpiarFiltros = () => {
        if (nombreProductoRef.current) nombreProductoRef.current.value = "";
        if (estadoTerceroProductoRef.current) estadoTerceroProductoRef.current.value = "true";
        filtrarProductosProveedor();
    };

    const titulosTabla= [
        { titulo: "Nombre", center: false },
        { titulo: "Precio de compra", center: false },
        { titulo: "Acciones", center: true }
    ];


    return (
        <ContenedorRegistrar name="">
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
                </ContenedorBotonesFiltros>

                {/* Selectores de filtros */}
                <ContenedorSelectores>
                    <InputFiltro
                        id="nombreProducto"
                        name="Nombre"
                        ref={nombreProductoRef}
                        onChange={filtrarProductosProveedor}
                    />
                    <SelectFiltro
                        id="estadoTerceroProducto"
                        name="Estado"
                        onChange={filtrarProductosProveedor}
                        ref={estadoTerceroProductoRef}
                        defaultValue="true"
                        selectEstado={true}
                    >
                        <option value="true">Activo</option>
                        <option value="false">Inactivo</option>
                    </SelectFiltro>
                </ContenedorSelectores>
            </ContenedorFiltros>

            {/* Tabla de productos */}
            <Table titulos={titulosTabla}>
                {productosActuales.length === 0 ? (
                    <tr>
                        <td colSpan={3} className="text-center py-4 text-gray-500 dark:text-gray-400">
                            No se encontraron productos relacionados
                        </td>
                    </tr>
                ) : (
                    productosActuales.map((p) => (
                        <tr key={p.idTerceroProducto} className="hover:bg-gray-100 dark:hover:bg-gray-700">
                            <td className="px-4 py-3">{p.nombreProducto}</td>
                            <td className="px-4 py-3">$ {p.precioCompraTerceroProducto}</td>
                            <td className="px-4 py-3 text-center">
                                <BotonAccionCard
                                    Symbol={Pencil}
                                    onClick={() => {
                                        setIdTerceroProductoSeleccionado(p.idTerceroProducto);
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


            {/* Modal para aagregar un tercero producto*/}
            <Modal isOpen={modalRegistar} setIsOpen={() => setModalRegistrar(false)}>
                <RegistrarTerceroProducto idTercero={tercero?.idTercero} setModalRegistrar={setModalRegistrar} />
            </Modal>


            {/* Modal para actualizar un tercero producto*/}
            <Modal isOpen={modalActualizar} setIsOpen={() => setModalActualizar(false)}>
                <RegistrarTerceroProducto idTercero={tercero?.idTercero} idTerceroProductoSeleccionado={idTerceroProductoSeleccionado} setModalActualizar={setModalActualizar} />
            </Modal>

        </ContenedorRegistrar>
    );
};

export default SublistaProductos;