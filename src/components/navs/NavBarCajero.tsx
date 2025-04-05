import ContenedorNav from "./ContenedorNav";
import LinkNav from "./LinkNav";

const NavBarSupervisor = () => {
    return (
        <ContenedorNav>
            <LinkNav href="/perfil" name="Perfil" />
            <LinkNav href="/ventas" name="Ventas" />
            <LinkNav href="/clientes" name="Clientes" />
            <LinkNav href="/balance-cajas" name="Balance Cajas" />
            <LinkNav href="/movimientos" name="Movimientos" />
        </ContenedorNav>
    );
};

export default NavBarSupervisor;