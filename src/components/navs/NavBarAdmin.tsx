import ContenedorNav from "./ContenedorNav";
import LinkNav from "./LinkNav";

const NavBarAdmin = () => {
    return (
        <ContenedorNav>
            <LinkNav href="/dashboard" name="Dashboard" />
            <LinkNav href="/usuarios" name="Usuarios" />
        </ContenedorNav>
    );
};

export default NavBarAdmin;
