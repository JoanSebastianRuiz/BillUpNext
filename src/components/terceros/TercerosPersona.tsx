"use client";

import { useEffect, useState, useRef } from "react";
import { Pencil, Eye, PlusCircle, XCircle, PackageSearch, FileDown } from "lucide-react";

import { useUsuarioContext } from '@/context/UsuarioContext';
import { useTerceroContext } from "@/context/TerceroContext";

import { DepartamentoResponseDTO } from '@/dto/DepartamentoResponseDTO';
import { MunicipioResponseDTO } from '@/dto/MunicipioResponseDTO';
import { TerceroResponsePersonaDTO } from "@/dto/TerceroResponsePersonaDTO";

import ContenedorFiltros from "@/components/filtros/ContenedorFiltros";
import ContenedorBotonesFiltros from "@/components/filtros/ContenedorBotonesFiltros";
import BotonFiltro from "@/components/filtros/BotonFiltro";
import ContenedorSelectores from "@/components/filtros/ContenedorSelectores";
import InputFiltro from "@/components/filtros/InputFiltro";
import SelectFiltro from "@/components/filtros/SelectFiltro";
import TerceroPersonaCard from "@/components/terceros/TerceroPersonaCard";
import ContenedorBotonesAccionCard from "@/components/cards/ContenedorBotonesAccionCard";
import BotonAccionCard from "@/components/cards/BotonAccionCard";
import Modal from "@/components/modal/Modal";
import MostrarInfoTerceroPersona from "@/components/terceros/MostrarInfoTerceroPersona";
import RegistrarTerceroPersona from "@/components/terceros/RegistrarTerceroPersona";
import ControlesPaginacion from "@/components/common/ControlesPaginacion";
import SublistaProductos from "./proveedores/SublistaProductos";

import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { useEmpresaContext } from "@/context/EmpresaContext";




const TercerosPersona = ({ proveedorTerceroPersona, tipoPersonas }: { proveedorTerceroPersona: boolean, tipoPersonas: "clientes" | "proveedores" }) => {
    const [modalInfo, setModalInfo] = useState(false)
    const [modalRegistrar, setModalRegistrar] = useState(false)
    const [modalActualizar, setModalActualizar] = useState(false)
    const [modalProductos, setModalProductos] = useState(false)
    const [terceroSeleccionado, setTerceroSeleccionado] = useState<TerceroResponsePersonaDTO | null>(null)
    const { departamentos, municipios, tiposDocumento, usuario } = useUsuarioContext()
    const { empresas } = useEmpresaContext()

    const { clientesPersona, proveedoresPersona } = useTerceroContext()

    const personas = tipoPersonas === "clientes" ? clientesPersona : proveedoresPersona;
    const [personasFiltradas, setPersonasFiltradas] = useState<TerceroResponsePersonaDTO[]>([]);
    const [municipiosFiltrados, setMunicipiosFiltrados] = useState<MunicipioResponseDTO[]>([]);
    const [departamentosFiltrados, setDepartamentosFiltrados] = useState<DepartamentoResponseDTO[]>([]);

    const nombrePersonaRef = useRef<HTMLInputElement>(null)
    const idTipoDocumentoRef = useRef<HTMLSelectElement>(null)
    const numeroDocumentoPersonaRef = useRef<HTMLInputElement>(null)
    const idDepartamentoRef = useRef<HTMLSelectElement>(null)
    const idMunicipioRef = useRef<HTMLSelectElement>(null)
    const estadoPersonaRef = useRef<HTMLSelectElement>(null)


    // Paginacion
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(12); // Número de empresas por página
    const indexOfLastPersona = currentPage * itemsPerPage;
    const indexOfFirstPersona = indexOfLastPersona - itemsPerPage;
    const personasActuales = personasFiltradas.slice(indexOfFirstPersona, indexOfLastPersona);
    const totalPages = Math.ceil(personasFiltradas.length / itemsPerPage);


    const filtrarUsuarios = () => {
        const idTipoDocumento = idTipoDocumentoRef.current?.value;
        const nombrePersona = nombrePersonaRef.current?.value;
        const numeroDocumentoPersona = numeroDocumentoPersonaRef.current?.value;
        const estadoPersona = estadoPersonaRef.current?.value;
        const idDepartamento = idDepartamentoRef.current?.value;
        const idMunicipio = idMunicipioRef.current?.value;

        let personasFiltradas = [...personas];

        if (estadoPersona !== undefined && estadoPersona !== "") {
            personasFiltradas = personasFiltradas.filter((persona) => persona.estadoTercero === (estadoPersona === "true"));
        }

        if (idTipoDocumento && idTipoDocumento !== "0") {
            personasFiltradas = personasFiltradas.filter((persona) => persona.idTipoDocumento === Number(idTipoDocumento));
        }

        if (idDepartamento && idDepartamento !== "0") {
            personasFiltradas = personasFiltradas.filter((persona) => persona.idDepartamento === Number(idDepartamento));
        }

        if (idMunicipio && idMunicipio !== "0") {
            personasFiltradas = personasFiltradas.filter((persona) => persona.idMunicipio === Number(idMunicipio));
        }

        if (nombrePersona) {
            personasFiltradas = personasFiltradas.filter((persona) => {
                const nombreCompleto = `${persona.nombreTercero} ${persona.apellidoTercero}`;
                return nombreCompleto.toLowerCase().includes(nombrePersona.toLowerCase());
            });
        }

        if (numeroDocumentoPersona) {
            personasFiltradas = personasFiltradas.filter((persona) => persona.numeroDocumentoTercero.includes(numeroDocumentoPersona));
        }

        setPersonasFiltradas(personasFiltradas);
    };

    useEffect(() => {
        filtrarUsuarios();
    }, [clientesPersona, proveedoresPersona]);

    useEffect(() => {
        if (!departamentos.length || !municipios.length) return;

        setDepartamentosFiltrados(departamentos);

        const idDepartamento = idDepartamentoRef.current?.value;

        if (idDepartamento && idDepartamento !== "0") {
            setMunicipiosFiltrados(municipios.filter((municipio) => municipio.idDepartamento === Number(idDepartamento)));
        } else {
            setMunicipiosFiltrados(municipios); // Si no hay departamento seleccionado, mostrar todos los municipios
        }
    }, [departamentos, municipios, idDepartamentoRef.current?.value]);


    useEffect(() => {
        if (!municipios.length) return;

        const idMunicipio = idMunicipioRef.current?.value;
        if (idMunicipio && idMunicipio !== "0") {
            const departamentoEncontrado = municipios.find((municipio) => municipio.idMunicipio === Number(idMunicipio))?.idDepartamento;
            if (departamentoEncontrado && idDepartamentoRef.current) {
                idDepartamentoRef.current.value = departamentoEncontrado.toString();
                setMunicipiosFiltrados(municipios.filter((municipio) => municipio.idDepartamento === departamentoEncontrado));
            }
        }
    }, [municipios, idMunicipioRef.current?.value]);

    const limpiarFiltros = () => {
        if (idTipoDocumentoRef.current) idTipoDocumentoRef.current.value = "0";
        if (nombrePersonaRef.current) nombrePersonaRef.current.value = "";
        if (numeroDocumentoPersonaRef.current) numeroDocumentoPersonaRef.current.value = "";
        if (idDepartamentoRef.current) idDepartamentoRef.current.value = "0";
        if (idMunicipioRef.current) idMunicipioRef.current.value = "0";
        if (estadoPersonaRef.current) estadoPersonaRef.current.value = "true";
        filtrarUsuarios();
    }

    const exportarDatosPDF = () => {
        const empresa = empresas.find(empresa => empresa.idEmpresa === usuario.idEmpresa);

        const doc = new jsPDF({
            orientation: "landscape", // Orientación horizontal
        });

        const pageWidth = doc.internal.pageSize.getWidth();

        // Fecha alineada a la derecha
        doc.setFont("helvetica", "normal");
        doc.setFontSize(12);
        const fechaTexto = `Fecha: ${new Date().toLocaleString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        })}`;
        const paddingRight = 14;
        const fechaX = pageWidth - doc.getTextWidth(fechaTexto) - paddingRight;
        doc.text(fechaTexto, fechaX, 15); // Parte superior derecha

        // Título centrado
        doc.setFont("helvetica", "bold");
        doc.setFontSize(22);
        const titulo = `${proveedorTerceroPersona ? "Proveedores persona" : "Clientes persona"} - ${empresa?.nombreEmpresa}`;
        const titleX = (pageWidth - doc.getTextWidth(titulo)) / 2;
        doc.text(titulo, titleX, 25); // Bajamos a 25

        // Línea separadora
        doc.setLineWidth(0.5);
        doc.line(14, 30, pageWidth - 14, 30); // Línea horizontal

        // Tabla de usuarios
        autoTable(doc, {
            startY: 40, // comienza después de la línea
            head: [["Nombres", "Apellidos", "T.D.", "Documento", "Correo", "Telefono", "Departamento", "Municipio", "Dirección", "Estado"]],
            body: personasFiltradas.map((p) => [
                p.nombreTercero,
                p.apellidoTercero,
                tiposDocumento.find((tipo) => tipo.idTipoDocumento === p.idTipoDocumento)?.abreviaturaTipoDocumento || "N/A",
                p.numeroDocumentoTercero,
                p.correoTercero,
                p.telefonoTercero,
                departamentos.find((d) => d.idDepartamento === p.idDepartamento)?.nombreDepartamento || "N/A",
                municipios.find((m) => m.idMunicipio === p.idMunicipio)?.nombreMunicipio || "N/A",
                p.direccionTercero,
                p.estadoTercero ? "Activo" : "Inactivo",
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

        // Guardar PDF con fecha en el nombre
        const nombreArchivo = proveedorTerceroPersona
            ? `Reporte_proveedores_persona_${fechaNombre}.pdf`
            : `Reporte_clientes_persona_${fechaNombre}.pdf`;

        doc.save(nombreArchivo);
    };



    return (
        <section>
            <ContenedorFiltros title="">
                {/* Botones de filtros */}
                <ContenedorBotonesFiltros>
                    <BotonFiltro
                        onClick={() => setModalRegistrar(true)}
                        Symbol={PlusCircle}
                        name={proveedorTerceroPersona ? "Agregar proveedor" : "Agregar cliente"} />

                    <BotonFiltro
                        onClick={limpiarFiltros}
                        Symbol={XCircle}
                        name="Limpiar filtros" />

                    {usuario.idRol == 2 && <BotonFiltro
                        onClick={exportarDatosPDF}
                        Symbol={FileDown}
                        name="Exportar datos" />}

                </ContenedorBotonesFiltros>

                {/* Selectores de filtros */}
                <ContenedorSelectores>
                    {/* Nombre */}
                    <InputFiltro
                        id="nombrePersona"
                        name="Nombre"
                        ref={nombrePersonaRef}
                        onChange={filtrarUsuarios} />

                    {/* Tipo de Documento */}
                    <SelectFiltro
                        id="idTipoDocumento"
                        name="Tipo de documento"
                        onChange={filtrarUsuarios}
                        ref={idTipoDocumentoRef}
                    >
                        {tiposDocumento.map((tipo) => (
                            <option key={tipo.idTipoDocumento} value={tipo.idTipoDocumento.toString()}>
                                {tipo.nombreTipoDocumento}
                            </option>
                        ))}
                    </SelectFiltro>

                    {/* Número de documento */}
                    <InputFiltro
                        id="numeroDocumentoPersona"
                        name="Número de documento"
                        ref={numeroDocumentoPersonaRef}
                        onChange={filtrarUsuarios} />

                    {/* Departamento */}
                    <SelectFiltro
                        id="idDepartamento"
                        name="Departamento"
                        onChange={filtrarUsuarios}
                        ref={idDepartamentoRef}
                    >
                        {departamentosFiltrados.map((departamento) => (
                            <option key={departamento.idDepartamento} value={departamento.idDepartamento.toString()}>
                                {departamento.nombreDepartamento}
                            </option>
                        ))}
                    </SelectFiltro>

                    {/* Municipio */}
                    <SelectFiltro
                        id="idMunicipio"
                        name="Municipio"
                        onChange={filtrarUsuarios}
                        ref={idMunicipioRef}
                    >
                        {municipiosFiltrados.map((municipio) => (
                            <option key={municipio.idMunicipio} value={municipio.idMunicipio.toString()}>
                                {municipio.nombreMunicipio}
                            </option>
                        ))}
                    </SelectFiltro>

                    {/* Estado */}
                    <SelectFiltro
                        id="estadoPersona"
                        name="Estado"
                        onChange={filtrarUsuarios}
                        ref={estadoPersonaRef}
                        selectEstado={true}
                        defaultValue="true"
                    >
                        <option value="true">Activo</option>
                        <option value="false">Inactivo</option>
                    </SelectFiltro>
                </ContenedorSelectores>
            </ContenedorFiltros>

            {/* Grid de personas */}
            {personasActuales.length === 0 ?
                (<div className="text-center text-gray-500 mt-8">
                    No se encontraron personas
                </div>) :
                (< div className="grid gap-4 md:grid-cols-3" >
                    {personasActuales.map((persona) =>

                        <TerceroPersonaCard tercero={persona} key={persona.idTercero}>
                            <ContenedorBotonesAccionCard>
                                <BotonAccionCard
                                    Symbol={Pencil}
                                    onClick={() => {
                                        setTerceroSeleccionado(persona);
                                        setModalActualizar(true);
                                    }}
                                />
                                <BotonAccionCard
                                    Symbol={Eye}
                                    onClick={() => {
                                        setTerceroSeleccionado(persona);
                                        setModalInfo(true);
                                    }}
                                />

                                {proveedorTerceroPersona && (
                                    <BotonAccionCard
                                        Symbol={PackageSearch}
                                        onClick={() => {
                                            setTerceroSeleccionado(persona);
                                            setModalProductos(true);
                                        }}
                                    />
                                )}
                            </ContenedorBotonesAccionCard>
                        </TerceroPersonaCard>

                    )}

                </div >)}

            {/* Controles de paginación */}
            <ControlesPaginacion
                currentPage={currentPage}
                totalPages={totalPages}
                setCurrentPage={setCurrentPage}
            />

            {/* Modal para mostrar la información de un persona*/}
            <Modal isOpen={modalInfo} setIsOpen={() => setModalInfo(false)}>
                {terceroSeleccionado && <MostrarInfoTerceroPersona tercero={terceroSeleccionado} />}
            </Modal>


            {/* Modal para registrar un persona*/}
            <Modal isOpen={modalRegistrar} setIsOpen={() => setModalRegistrar(false)}>
                <RegistrarTerceroPersona setModalRegistrar={setModalRegistrar} proveedorTerceroPersona={proveedorTerceroPersona} />
            </Modal>


            {/* Modal para actualizar un persona*/}
            <Modal isOpen={modalActualizar} setIsOpen={() => setModalActualizar(false)}>
                <RegistrarTerceroPersona terceroSeleccionado={terceroSeleccionado} setModalActualizar={setModalActualizar} proveedorTerceroPersona={proveedorTerceroPersona} />
            </Modal>

            {/* Modal para gestionar los productos de un proveedor*/}
            <Modal isOpen={modalProductos} setIsOpen={() => setModalProductos(false)} size="large">
                <SublistaProductos tercero={terceroSeleccionado} />
            </Modal>

        </section >
    );
};

export default TercerosPersona;
