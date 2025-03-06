import ContenedorNav from "./ContenedorNav";
import LinkNav from "./LinkNav";

const NavBarAdmin = () => {
    return (
        <ContenedorNav>
            <LinkNav href="/perfil" name="Perfil" />
            <LinkNav href="/dashboard" name="Dashboard" />
            <LinkNav href="/usuarios" name="Usuarios" />
            <LinkNav href="/empresas" name="Empresas" />
        </ContenedorNav>
    );
};

export default NavBarAdmin;
