CREATE OR REPLACE FUNCTION desactivarUsuarios() RETURNS "trigger" AS
$$
BEGIN
    -- Propósito: Desactiva los usuarios asociados a una empresa cuando esta es desactivada.
    IF NEW."estadoEmpresa" = FALSE AND OLD."estadoEmpresa" = TRUE THEN 
        UPDATE "Usuario" SET "estadoUsuario" = FALSE WHERE "idEmpresa" = NEW."idEmpresa";

        IF NOT FOUND THEN
            RAISE NOTICE 'No se encontraron usuarios para desactivar';
        END IF;
    END IF;

    RETURN NEW;

EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Error al desactivar usuarios para la empresa %: %', NEW."idEmpresa", SQLERRM;
END;
$$
LANGUAGE PLPGSQL;

CREATE TRIGGER trgDesactivarUsuarios
AFTER UPDATE OF "estadoEmpresa" ON "Empresa"
FOR EACH ROW
EXECUTE FUNCTION desactivarUsuarios();