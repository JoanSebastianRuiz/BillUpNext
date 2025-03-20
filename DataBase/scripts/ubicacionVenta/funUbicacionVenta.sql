CREATE OR REPLACE FUNCTION actualizarUbicacionVenta(
    _idUbicacionVenta "UbicacionVenta"."idUbicacionVenta"%TYPE,
    _idEmpresa "UbicacionVenta"."idEmpresa"%TYPE,
    _nombreUbicacionVenta "UbicacionVenta"."nombreUbicacionVenta"%TYPE,
    _estadoUbicacionVenta "UbicacionVenta"."estadoUbicacionVenta"%TYPE)
RETURNS BOOLEAN AS
$$
BEGIN
    UPDATE  "UbicacionVenta" SET
        "idEmpresa" = COALESCE(_idEmpresa, "idEmpresa"),
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


CREATE OR REPLACE FUNCTION insertarUbicacionVenta(
    _idEmpresa "UbicacionVenta"."idEmpresa"%TYPE,
    _nombreUbicacionVenta "UbicacionVenta"."nombreUbicacionVenta"%TYPE,
    _estadoUbicacionVenta "UbicacionVenta"."estadoUbicacionVenta"%TYPE
)
RETURNS BOOLEAN AS
$$
DECLARE
    id INTEGER;
BEGIN
    INSERT INTO "UbicacionVenta" (
        "idEmpresa",
        "nombreUbicacionVenta",
        "estadoUbicacionVenta"
    )
    VALUES(
        _idEmpresa,
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



CREATE OR REPLACE FUNCTION existeUbicacionVentaNombre(
    _nombreUbicacionVenta "UbicacionVenta"."nombreUbicacionVenta"%TYPE,
    _idEmpresa "UbicacionVenta"."idEmpresa"%TYPE
)
RETURNS BOOLEAN AS
$BODY$
BEGIN
    RETURN EXISTS (
        SELECT 1
        FROM "UbicacionVenta"
        WHERE LOWER("nombreUbicacionVenta") = LOWER(_nombreUbicacionVenta)
        AND "idEmpresa" = _idEmpresa
    );
END;
$BODY$
LANGUAGE PLPGSQL;