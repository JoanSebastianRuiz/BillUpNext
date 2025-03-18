CREATE OR REPLACE FUNCTION actualizarCaja(
    _idCaja "Caja"."idCaja"%TYPE,
    _idEmpresa "Caja"."idEmpresa"%TYPE,
    _nombreCaja "Caja"."nombreCaja"%TYPE,
    _estadoCaja "Caja"."estadoCaja"%TYPE
)
RETURNS BOOLEAN AS
$$
BEGIN
    UPDATE "Caja" SET
        "idEmpresa" = COALESCE(_idEmpresa, "idEmpresa"),
        "nombreCaja" = COALESCE(_nombreCaja, "nombreCaja"),
        "estadoCaja" = COALESCE(_estadoCaja, "estadoCaja")
    WHERE "idCaja" = _idCaja;

    IF FOUND THEN
        RAISE NOTICE 'Se actualizó correctamente la caja';
        RETURN TRUE;
    ELSE
        RAISE NOTICE 'Ocurrió un error al eliminar la caja';
        RETURN FALSE;
    END IF;
END;
$$
LANGUAGE PLPGSQL;



CREATE OR REPLACE FUNCTION eliminarCaja(
    _idCaja "Caja"."idCaja"%TYPE  )
RETURNS BOOLEAN AS
$$
BEGIN
    DELETE FROM "Caja" WHERE "idCaja" = _idCaja;

    IF FOUND THEN
        RAISE NOTICE 'Se eliminó correctamente La caja';
    ELSE
        RAISE NOTICE 'Ocurrió un error al eliminar la CAJA';
    END IF;
END;
$$
LANGUAGE PLPGSQL;



CREATE OR REPLACE FUNCTION insertarCaja(
    _idEmpresa "Caja"."idEmpresa"%TYPE,
    _nombreCaja "Caja"."nombreCaja"%TYPE,
    _estadoCaja "Caja"."estadoCaja"%TYPE
)
RETURNS BOOLEAN AS
$$
DECLARE
    id INTEGER;
BEGIN
    INSERT INTO "Caja"(
        "idEmpresa",
        "nombreCaja",
        "estadoCaja"
    )
    VALUES (
        _idEmpresa,
        _nombreCaja,
        _estadoCaja
    )
    RETURNING "idCaja" INTO id;

    IF FOUND THEN
        RAISE NOTICE 'Se insertó correctamente la CAJA';
        RETURN TRUE;
    ELSE
        RAISE NOTICE 'Ocurrió un error al insertar la CAJA';
        RETURN FALSE;
    END IF;
END;
$$
LANGUAGE PLPGSQL;

CREATE OR REPLACE FUNCTION validarExistCajaNombre(
    _nombreCaja "Caja"."nombreCaja"%TYPE
)
RETURNS BOOLEAN AS
$$
BEGIN
    --validar si elnombre de la caja existe
    RETURN EXISTS(
        SELECT 3
        FROM "Caja"
        WHERE "nombreCaja" = _nombreCaja
    );
END;
$$
LANGUAGE PLPGSQL;







