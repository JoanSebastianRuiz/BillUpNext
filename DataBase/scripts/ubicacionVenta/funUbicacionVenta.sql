CREATE OR REPLACE FUNCTION actualizarUbicacionVenta(
    _idUbicacionVenta "UbicacionVenta"."idUbicacionVenta"%TYPE,
    _nombreUbicacionVenta "UbicacionVenta"."nombreUbicacionVenta"%TYPE,
    _estadoUbicacionVenta "UbicacionVenta"."estadoUbicacionVenta"%TYPE)
RETURN BOOLEAN AS
$$
BEGIN
    UPDATE  "UbicacionVenta" SET
        "nombreUbicacionVenta" = COALESCE(_nombreUbicacionVenta, "nombreUbicacionVenta"),
         "estadoUbicacionVenta" = COALESCE(_estadoUbicacionVenta, "estadoUbicacionVenta")
    WHERE "idUbicacionVenta" = _idUbicacionVenta;

    IF FOUND THEN
        RAISE NOTICE 'Se actualizó correctamente la UBICACION VENTA';
        RETURN TRUE;
    ELSE
        RAISE NOTICE 'Ocurrió un error al actualizar la UBICACION VENTA';
        RETURN FALSE;
    END IF;

END;
$$
LANGUAGE PLPGSQL;



CREATE OR REPLACE FUNCTION eliminarUbicacionVenta(
    _idUbicacionVenta "UbicacionVenta"."idUbicacionVenta"%TYPE)
RETURN BOOLEAN AS
$$
BEGIN
    DELETE FROM "UbicacionVenta" WHERE "idUbicacionVenta" = _idUbicacionVenta;

    IF FOUND THEN
        RAISE NOTICE 'Se eliminó correctamente la UBICACION VENTA';
        RETURN TRUE;
    ELSE
        RAISE NOTICE 'Ocurrió un error al eliminar la UBICACION VENTA';
        RETURN FALSE;
    END IF;
END
$$
LANGUAGE PLPGSQL;



CREATE OR REPLACE FUNCTION insertarUbicacionVenta(
    _idUbicacionVenta "UbicacionVenta"."idUbicacionVenta"%TYPE,
    _nombreUbicacionVenta "UbicacionVenta"."nombreUbicacionVenta"%TYPE,
    _estadoUbicacionVenta "UbicacionVenta"."estadoUbicacionVenta"%TYPE
)
RETURN BOOLEAN AS
$$
DECLARE
    id INTEGER;
BEGIN
    INSERT INTO "UbicacionVenta" (
        "nombreUbicacionVenta",
        "estadoUbicacionVenta"
    )
    VALUES(
        _nombreUbicacionVenta,
        _estadoUbicacionVenta
    )
    RETURNING "idUbicacionVenta" INTO id;

    IF id IS NOT NULL THEN
        RAISE NOTICE 'Se insertó correctamente la UBICACION VENTA con ID %', id;
        RETURN TRUE;
    ELSE
        RAISE NOTICE 'Ocurrió un error al insertar la UBICACION VENTA';
        RETURN FALSE;
    END IF;
END;
$$
LANGUAGE PLPGSQL;