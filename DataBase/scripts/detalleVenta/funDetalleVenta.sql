CREATE OR REPLACE FUNCTION insertarDetalleVenta(
    _idVenta "DetalleVenta"."idVenta"%TYPE,
    _idProducto "DetalleVenta"."idProducto"%TYPE,
    _cantidadDetalleVenta "DetalleVenta"."cantidadDetalleVenta"%TYPE,
    _valorDescuentoDetalleVenta "DetalleVenta"."valorDescuentoDetalleVenta"%TYPE,
    _valorTotalDetalleVenta "DetalleVenta"."valorTotalDetalleVenta"%TYPE)
    RETURNS BOOLEAN AS
$$
DECLARE
    _idDetalleVenta "DetalleVenta"."idDetalleVenta"%TYPE;
BEGIN
    INSERT INTO "DetalleVenta" ("idVenta", "idProducto", "cantidadDetalleVenta", "valorDescuentoDetalleVenta", "valorTotalDetalleVenta")
    VALUES (_idVenta, _idProducto, _cantidadDetalleVenta, _valorDescuentoDetalleVenta, _valorTotalDetalleVenta);

    IF FOUND THEN
        RAISE NOTICE 'Se insertó correctamente el detalle de la venta';
        RETURN TRUE;
    ELSE
        RAISE EXCEPTION 'Ocurrió un error';
        RETURN FALSE;
    END IF;
END;
$$
LANGUAGE PLPGSQL;


CREATE OR REPLACE FUNCTION validarCantidadDetalleVenta(
    _cantidadDetalleVenta "DetalleVenta"."cantidadDetalleVenta"%TYPE
)
RETURNS BOOLEAN AS
$$
BEGIN
    RETURN _cantidadDetalleVenta > 0;
END;
$$
LANGUAGE PLPGSQL;


CREATE OR REPLACE FUNCTION validarValorDescuentoDetalleVenta(
    _valorDescuentoDetalleVenta "DetalleVenta"."valorDescuentoDetalleVenta"%TYPE
)
RETURNS BOOLEAN AS
$$
BEGIN
    RETURN _valorDescuentoDetalleVenta > 0;
END;
$$
LANGUAGE PLPGSQL;


CREATE OR REPLACE FUNCTION validarValorTotalDetalleVenta(
    _valorTotalDetalleVenta "DetalleVenta"."valorTotalDetalleVenta"%TYPE
)
RETURNS BOOLEAN AS
$$
BEGIN
    RETURN _valorTotalDetalleVenta > 0;
END;
$$
LANGUAGE PLPGSQL;