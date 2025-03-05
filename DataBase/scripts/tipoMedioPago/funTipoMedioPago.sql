CREATE OR REPLACE FUNCTION actualizarTipoMedioPago(
    _idTipoMedioPago "TipoMedioPago"."idTipoMedioPago"%TYPE,
    _nombreTipoMedioPago "TipoMedioPago"."nombreTipoMedioPago"%TYPE,
    _estadoTipoMedioPago "TipoMedioPago"."estadoTipoMedioPago"%TYPE
)
RETURNS BOOLEAN AS
$$
BEGIN
    UPDATE "TipoMedioPago" SET
        "nombreTipoMedioPago" = COALESCE(_nombreTipoMedioPago, "nombreTipoMedioPago"),
        "estadoTipoMedioPago" = COALESCE(_estadoTipoMedioPago, "estadoTipoMedioPago")
    WHERE "idTipoMedioPago" = _idTipoMedioPago;

    IF FOUND THEN
        RAISE NOTICE 'Se actualizó correctamente el TIPO MEDIO DE PAGO';
        RETURN TRUE;
    ELSE
        RAISE NOTICE 'Ocurrió un error al actualizar  el TIPO MEDIO DE PAGO';
        RETURN FALSE;
    END IF;
END;
$$
LANGUAGE PLPGSQL;



CREATE OR REPLACE FUNCTION eliminarTipoMedioPago(
    _idTipoMedioPago "TipoMedioPago"."idTipoMedioPago"%TYPE)
RETURNS BOOLEAN AS
$$
BEGIN
    DELETE FROM "TipoMedioPago" WHERE "idTipoMedioPago" = _idTipoMedioPago;

    IF FOUND THEN
        RAISE NOTICE 'Se eliminó correctamente el TIPO MEDIO DE PAGO';
    RETURN TRUE;
    ELSE
        RAISE NOTICE 'Ocurrió un error al eliminar el TIPO MEDIO DE PAGO';
        RETURN FALSE;
    END IF;
END;
$$
LANGUAGE PLPGSQL;



CREATE OR REPLACE FUNCTION insertarTipoMedioPago(
    _nombreTipoMedioPago "TipoMedioPago"."nombreTipoMedioPago"%TYPE,
    _estadoTipoMedioPago "TipoMedioPago"."estadoTipoMedioPago"%TYPE
)
RETURNS BOOLEAN AS
$$
DECLARE
    id INTEGER;
BEGIN
    INSERT INTO "TipoMedioPago"(
        "nombreTipoMedioPago",
        "estadoTipoMedioPago"
    )
    VALUES (
        _nombreTipoMedioPago,
        _estadoTipoMedioPago
    )
    RETURNING "idTipoMedioPago" INTO id;

    IF FOUND THEN
        RAISE NOTICE 'Se insertó correctamente el TIPO MEDIO DE PAGO';
        RETURN TRUE;
    ELSE
        RAISE NOTICE 'Ocurrió un error al insertar el TIPO MEDIO DE PAGO';
    END IF;
END;
$$
LANGUAGE PLPGSQL;