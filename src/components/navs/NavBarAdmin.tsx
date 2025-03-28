import ContenedorNav from "./ContenedorNav";
import LinkNav from "./LinkNav";

const NavBarAdmin = () => {
    return (
        <ContenedorNav>
            <LinkNav href="/perfil" name="Perfil" />
            <LinkNav href="/usuarios" name="Usuarios" />
            <LinkNav href="/empresas" name="Empresas" />
            <LinkNav href="/gravamenes" name="Gravámenes" />
        </ContenedorNav>
    );
};

export default NavBarAdmin;
