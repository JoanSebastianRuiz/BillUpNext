CREATE OR REPLACE FUNCTION insertarDetalleCompra(
    _idCompra "DetalleCompra"."idCompra"%TYPE,
    _idProducto "DetalleCompra"."idProducto"%TYPE,
    _cantidadDetalleCompra "DetalleCompra"."cantidadDetalleCompra"%TYPE,
    _valorDetalleCompra "DetalleCompra"."valorDetalleCompra"%TYPE,
    _fechaVencimientoDetalleCompra "DetalleCompra"."fechaVencimientoDetalleCompra"%TYPE)
    RETURNS BOOLEAN AS
$$
DECLARE
    _idDetalleCompra "DetalleCompra"."idDetalleCompra"%TYPE;
BEGIN
    INSERT INTO "DetalleCompra" ("idCompra", "idProducto", "cantidadDetalleCompra", "valorDetalleCompra", "fechaVencimientoDetalleCompra")
    VALUES (_idCompra, _idProducto, _cantidadDetalleCompra, _valorDetalleCompra, _fechaVencimientoDetalleCompra);

    IF FOUND THEN
        RAISE NOTICE 'Se insertó correctamente el detalle de la compra';
        RETURN TRUE;
    ELSE
        RAISE EXCEPTION 'Ocurrió un error';
        RETURN FALSE;
    END IF;
END;
$$
LANGUAGE PLPGSQL;


CREATE OR REPLACE FUNCTION actualizarDetalleCompra(
    _idDetalleCompra "DetalleCompra"."idDetalleCompra"%TYPE,
    _idCompra "DetalleCompra"."idCompra"%TYPE,
    _idProducto "DetalleCompra"."idProducto"%TYPE,
    _cantidadDetalleCompra "DetalleCompra"."cantidadDetalleCompra"%TYPE,
    _valorDetalleCompra "DetalleCompra"."valorDetalleCompra"%TYPE,
    _fechaVencimientoDetalleCompra "DetalleCompra"."fechaVencimientoDetalleCompra"%TYPE)
    RETURNS BOOLEAN AS
$$
BEGIN
    UPDATE "DetalleCompra"
    SET "idCompra" = _idCompra,
        "idProducto" = _idProducto,
        "cantidadDetalleCompra" = _cantidadDetalleCompra,
        "valorDetalleCompra" = _valorDetalleCompra,
        "fechaVencimientoDetalleCompra" = _fechaVencimientoDetalleCompra
    WHERE "idDetalleCompra" = _idDetalleCompra;

    IF FOUND THEN
        RAISE NOTICE 'Se actualizó correctamente el detalle de la compra';
        RETURN TRUE;
    ELSE
        RAISE NOTICE 'Ocurrió un error al actualizar el detalle de la compra';
        RETURN FALSE;
    END IF;
END;
$$
LANGUAGE PLPGSQL;    