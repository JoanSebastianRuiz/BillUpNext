import ContenedorNav from "./ContenedorNav";
import LinkNav from "./LinkNav";

const NavBarSupervisor = () => {
    return (
        <ContenedorNav>
            <LinkNav href="/perfil" name="Perfil" />
            <LinkNav href="/ventas" name="Ventas" />
        </ContenedorNav>
    );
};

export default NavBarSupervisor;