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
        "estadoCaja",
        "openCaja"
    )
    VALUES (
        _idEmpresa,
        _nombreCaja,
        _estadoCaja,
        FALSE
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
    _nombreCaja "Caja"."nombreCaja"%TYPE,
    _idEmpresa "Caja"."idEmpresa"%TYPE
)
RETURNS BOOLEAN AS
$$
BEGIN
    --validar si elnombre de la caja existe
    RETURN EXISTS(
        SELECT 1
        FROM "Caja"
        WHERE "nombreCaja" = _nombreCaja AND "idEmpresa" = _idEmpresa
    );
END;
$$
LANGUAGE PLPGSQL;



CREATE OR REPLACE FUNCTION cerrarCaja(
    _idCaja "Caja"."idCaja"%TYPE
)
RETURNS BOOLEAN AS
$$
DECLARE
    row_count INT;
BEGIN
    -- Verificar si la caja está abierta
    IF NOT EXISTS (SELECT 1 FROM "Caja" WHERE "idCaja" = _idCaja AND "openCaja" = TRUE) THEN
        RAISE NOTICE 'La caja ya está cerrada o no existe.';
        RETURN FALSE;
    END IF;

    -- Cerrar la caja
    UPDATE "Caja" SET "openCaja" = FALSE WHERE "idCaja" = _idCaja;
    
    -- Verificar si la actualización fue exitosa
    GET DIAGNOSTICS row_count = ROW_COUNT;

    IF row_count > 0 THEN
        RAISE NOTICE 'La caja % ha sido cerrada correctamente.', _idCaja;
        RETURN TRUE;
    ELSE
        RAISE NOTICE 'No se pudo cerrar la caja.';
        RETURN FALSE;
    END IF;
END;
$$
LANGUAGE PLPGSQL;




