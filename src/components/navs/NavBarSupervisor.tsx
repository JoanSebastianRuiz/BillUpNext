import ContenedorNav from "./ContenedorNav";
import LinkNav from "./LinkNav";

const NavBarSupervisor = () => {
    return (
        <ContenedorNav>
            <LinkNav href="/dashboard" name="Dashboard" />
            <LinkNav href="/usuarios" name="Usuarios" />
            <LinkNav href="/productos" name="Productos" />
        </ContenedorNav>
    );
};

export default NavBarSupervisor;