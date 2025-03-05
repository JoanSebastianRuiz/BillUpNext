"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import ContenedorPrincipal from "@/components/common/ContenedorPrincipal";
import TercerosPersona from "@/components/terceros/TercerosPersona";
import TercerosEmpresa from "@/components/terceros/TercerosEmpresa";
import Titulo from "@/components/common/Titulo";
import BotonSeleccion from "@/components/common/BotonSeleccion";

const ProveedoresPage = () => {
  const [tercerosPersonaSeleccionado, setTercerosPersonaSeleccionado] = useState(true);

  return (
    <ContenedorPrincipal>
      <Titulo name="Proveedores" />

      {/* Botones de selección */}
      <div className="flex justify-center gap-4 mb-4">
        <BotonSeleccion seleccion={tercerosPersonaSeleccionado} name="Personas" onClick={() => setTercerosPersonaSeleccionado(true)} />
        <BotonSeleccion seleccion={!tercerosPersonaSeleccionado} name="Empresas" onClick={() => setTercerosPersonaSeleccionado(false)} />
      </div>

      {/* Contenedor con transición */}
      <div className="relative w-full overflow-hidden">
        <AnimatePresence mode="wait">
          {tercerosPersonaSeleccionado ? (
            <motion.div
              key="personas"
              layout
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="w-full"
            >
              <TercerosPersona proveedorTerceroPersona={true} tipoPersonas="proveedores" />
            </motion.div>
          ) : (
            <motion.div
              key="empresas"
              layout
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="w-full"
            >
              <TercerosEmpresa proveedorTerceroEmpresa={true} tipoEmpresas="proveedores" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </ContenedorPrincipal>
  );
};

export default ProveedoresPage;
