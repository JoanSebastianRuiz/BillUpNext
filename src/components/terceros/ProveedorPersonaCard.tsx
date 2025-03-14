import axios from "axios";

import { useUsuarioContext } from "@/context/UsuarioContext";
import { useTerceroContext } from "@/context/TerceroContext";
import { useProductoContext } from "@/context/ProductoContext";
import { ReactNode } from "react";
import { Minus, Pencil, Plus } from "lucide-react";
import { useState } from "react";

import { TerceroResponsePersonaDTO } from "@/dto/TerceroResponsePersonaDTO";
import { TerceroProductoDTO } from "@/dto/TerceroProductoDTO";

import ContenedorCardLista from "../modal/ContenedorCardLista";
import ParrafoCard from "../modal/ParrafoCard";
import BotonAccionCard from "../cards/BotonAccionCard";
import Modal from "../modal/Modal";




const ProveedorPersonaCard = ({ tercero, children }: { tercero: TerceroResponsePersonaDTO, children: ReactNode }) => {
    const { tiposDocumento } = useUsuarioContext();
    const { proveedoresProducto, obtenerProveedoresProducto } = useTerceroContext();
    const { productos } = useProductoContext();
    const productosProveedor = proveedoresProducto.filter(p => p.idTercero === tercero.idTercero);
    const [modalActualizar, setModalActualizar] = useState(false);
    const [modalAgregar, setModalAgregar] = useState(false);
    const [terceroProductoSeleccionado, setTerceroProductoSeleccionado] = useState<TerceroProductoDTO | null>(null);

    const handleCambiarEstado = async (terceroProducto: TerceroProductoDTO) => {
        try {
            const estado = terceroProducto.estadoTerceroProducto ? false : true 
            const datos = { ...terceroProducto, estadoTerceroProducto: estado }
            const respuesta = axios.put(`api/tercero-producto/${terceroProducto.idTerceroProducto}`, datos)
            if ((await respuesta).status == 200) {
                obtenerProveedoresProducto()
            } else {
                console.log(`Error al cambiar el estado de tercero producto}`)
            }
        } catch (error) {
            console.log(`Error al cambiar el estado de tercero producto: ${error}`)
        }
    }

    return (
        <ContenedorCardLista>
            <div className="flex items-center justify-between gap-4">
                <h2 className="text-xl font-bold tracking-wide">
                    {`${tercero.nombreTercero} ${tercero.apellidoTercero}`}
                </h2>
                <div className="flex gap-2">{children}</div>
            </div>

            <ParrafoCard subtitle="Tipo de documento" text={tiposDocumento.find(t => t.idTipoDocumento === tercero.idTipoDocumento)?.nombreTipoDocumento || "N/A"} />

            <ParrafoCard subtitle="Número de documento" text={tercero.numeroDocumentoTercero} />

            <ParrafoCard subtitle="Teléfono" text={tercero.telefonoTercero} />

            <ParrafoCard subtitle="Correo" text={tercero.correoTercero} />

            <div>
                <div className="flex items-center justify-between gap-4">
                    <h2 className="text-lg font-bold tracking-wide">Productos</h2>
                    <BotonAccionCard
                        Symbol={Plus}
                        onClick={() => {
                            setModalAgregar(true);
                        }}
                        h={3}
                    />
                </div>

                {productosProveedor.map(p => {
                    const producto = productos.find(pr => pr.idProducto === p.idProducto);
                    return (
                        <div key={p.idTerceroProducto} className="flex items-center justify-between gap-4">
                            <div className="flex items-center justify-between gap-2">
                                <p>{producto?.nombreProducto}</p>
                                <div className="flex gap-2">
                                    <BotonAccionCard
                                        Symbol={Pencil}
                                        onClick={() => {
                                            setTerceroProductoSeleccionado(p);
                                            setModalActualizar(true);
                                        }}
                                        h={3}
                                    />

                                    <BotonAccionCard
                                        Symbol={Minus}
                                        onClick={() => handleCambiarEstado(p)}
                                        h={3}
                                    />
                                </div>
                            </div>
                            <p><span className="font-bold">Precio compra: $</span>{p.precioCompraTerceroProducto}</p>
                        </div>
                    );
                })}
            </div>
            
            {/* Modal para aagregar un tercero producto*/}
            <Modal isOpen={modalAgregar} setIsOpen={() => setModalAgregar(false)}>
                <RegistrarTerceroPersona setModalRegistrar={setModalRegistrar} proveedorTerceroPersona={proveedorTerceroPersona} />
            </Modal>


            {/* Modal para actualizar un tercero producto*/}
            <Modal isOpen={modalActualizar} setIsOpen={() => setModalActualizar(false)}>
                <RegistrarTerceroPersona idTercero={terceroSeleccionado?.idTercero} setModalActualizar={setModalActualizar} proveedorTerceroPersona={proveedorTerceroPersona} />
            </Modal>

        </ContenedorCardLista>
    );
};

export default ProveedorPersonaCard;