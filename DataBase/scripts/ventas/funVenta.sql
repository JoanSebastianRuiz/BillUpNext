CREATE OR REPLACE FUNCTION insertarVenta(
    _idTercero "Venta"."idTercero"%TYPE,
    _idCaja "Venta"."idCaja"%TYPE,
    _idUsuario "Venta"."idUsuario"%TYPE,
    _idUbicacionVenta "Venta"."idUbicacionVenta"%TYPE,
    _idTipoMedioPago "Venta"."idTipoMedioPago"%TYPE,
    _observacioVenta "Venta"."observacionVenta"%TYPE,
    _valorTotalVenta "Venta"."valorTotalVenta"%TYPE) 
    RETURNS BOOLEAN AS
$$
DECLARE
    idVenta "Venta"."idVenta"%TYPE;
BEGIN
    INSERT INTO "Venta" ("idTercero", "idCaja", "idUsuario", "idUbicacionVenta", "idTipoMedioPago", "observacionVenta", "valorTotalVenta")
    VALUES ( _idTercero, _idCaja, _idUsuario, _idUbicacionVenta, _idTipoMedioPago, _observacioVenta, _valorTotalVenta);

    IF FOUND THEN
        RAISE NOTICE 'Se insertó correctamente la venta';
        RETURN TRUE;
    ELSE
        RAISE EXCEPTION 'Ocurrió un error';
        RETURN FALSE;
    END IF;
END;
$$
LANGUAGE PLPGSQL;


CREATE OR REPLACE FUNCTION validarValorVenta(
    _valorTotalVenta "Venta"."valorTotalVenta"%TYPE
)
RETURNS BOOLEAN AS
$$
BEGIN 
    RETURN _valorTotalVenta > 0;
END;
$$
LANGUAGE PLPGSQL;
