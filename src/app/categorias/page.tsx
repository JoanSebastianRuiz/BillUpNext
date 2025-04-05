"use client";

import { useEffect, useState, useRef } from "react";
import { Pencil, PlusCircle, XCircle, FileDown } from "lucide-react";
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

import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { useEmpresaContext } from "@/context/EmpresaContext";
import { useUsuarioContext } from "@/context/UsuarioContext";


const CategoriasPage: React.FC = () => {
    const [modalRegistrar, setModalRegistrar] = useState(false);
    const [modalActualizar, setModalActualizar] = useState(false);
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<CategoriaDTO | null>(null);
    const { categorias } = useProductoContext()
    const { empresas } = useEmpresaContext()
    const { usuario } = useUsuarioContext()
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
        const titulo = `Categorías - ${empresa?.nombreEmpresa}`;
        const titleX = (pageWidth - doc.getTextWidth(titulo)) / 2;
        doc.text(titulo, titleX, 20);

        // Línea separadora
        doc.setLineWidth(0.5);
        doc.line(14, 30, pageWidth - 14, 30); // línea horizontal justo debajo del título

        // Tabla de categorías
        autoTable(doc, {
            startY: 40, // espacio después de la línea
            head: [["Categoría", "Estado"]],
            body: categoriasFiltradas.map((c) => [
                c.nombreCategoria,
                c.estadoCategoria ? "Activa" : "Inactiva",
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

        doc.save(`Reporte_categorias_${fechaNombre}.pdf`);
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
                    <BotonFiltro
                        onClick={exportarDatosPDF}
                        Symbol={FileDown}
                        name="Exportar datos" />
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
                        <option value="true">Activa</option>
                        <option value="false">Inactiva</option>
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
                            <td colSpan={2} className="text-center py-4 text-gray-500 dark:text-gray-400">
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

            <Modal isOpen={modalRegistrar} setIsOpen={() => setModalRegistrar(false)} size="small">
                <RegistrarCategoria setModalRegistrar={setModalRegistrar} />
            </Modal>

            <Modal isOpen={modalActualizar} setIsOpen={() => setModalActualizar(false)} size="small">
                <RegistrarCategoria categoriaSeleccionada={categoriaSeleccionada} setModalActualizar={setModalActualizar} />
            </Modal>
        </ContenedorPrincipal>
    );
};

export default CategoriasPage;