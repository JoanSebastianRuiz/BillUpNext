import ContenedorNav from "./ContenedorNav";
import LinkNav from "./LinkNav";

const NavBarSupervisor = () => {
    return (
        <ContenedorNav>
            <LinkNav href="/perfil" name="Perfil" />
            <LinkNav href="/dashboard" name="Dashboard" />
            <LinkNav href="/usuarios" name="Usuarios" />
            <LinkNav href="/productos" name="Productos" />
            <LinkNav href="/categorias" name="Categorías" />
            <LinkNav href="/proveedores" name="Proveedores" />
            <LinkNav href="/clientes" name="Clientes" />
            <LinkNav href="cajas" name="Cajas" />
            <LinkNav href="/ubicacion-venta" name="Ubicaciones" />
            <LinkNav href="/compras" name="Compras" />
        </ContenedorNav>
    );
};

export default NavBarSupervisor;