"use client"

import ContenedorPrincipal from "@/components/common/ContenedorPrincipal";
import TercerosPersona from "@/components/terceros/TercerosPersona";

const ProveedoresPage = () => {
  return (
    <ContenedorPrincipal>
        <TercerosPersona proveedorTerceroPersona={true} tipoPersonas="proveedores" />
    </ContenedorPrincipal>
  )
};

export default ProveedoresPage;