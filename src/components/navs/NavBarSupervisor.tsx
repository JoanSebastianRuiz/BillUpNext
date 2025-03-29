import ContenedorNav from "./ContenedorNav";
import LinkNav from "./LinkNav";

const NavBarSupervisor = () => {
    return (
        <ContenedorNav>
            {/* Perfil y gestión de usuarios */}
            <LinkNav href="/perfil" name="Perfil" />
            <LinkNav href="/usuarios" name="Usuarios" />
            <LinkNav href="/clientes" name="Clientes" />

            {/* Gestión de productos y proveedores */}
            <LinkNav href="/productos" name="Productos" />
            <LinkNav href="/categorias" name="Categorías" />
            <LinkNav href="/proveedores" name="Proveedores" />

            {/* Gestión de ventas y compras */}
            <LinkNav href="/compras" name="Compras" />
            <LinkNav href="/ventas" name="Ventas" />
            <LinkNav href="/ubicacion-venta" name="Ubicaciones" />

            {/* Control de cajas y finanzas */}
            <LinkNav href="/cajas" name="Cajas" />
            <LinkNav href="/balance-cajas" name="Balance Cajas" />
            <LinkNav href="/movimientos" name="Movimientos" />
        </ContenedorNav>
    );
};

export default NavBarSupervisor;
