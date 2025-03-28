CREATE OR REPLACE FUNCTION insertarVenta(
    _idUsuario "Venta"."idUsuario"%TYPE,
    _idTercero "Venta"."idTercero"%TYPE,
    _idCaja "Venta"."idCaja"%TYPE,
    _idUbicacionVenta "Venta"."idUbicacionVenta"%TYPE,
    _idTipoMedioPago "Venta"."idTipoMedioPago"%TYPE,
    _observacionVenta "Venta"."observacionVenta"%TYPE,
    _valorTotalVenta "Venta"."valorTotalVenta"%TYPE,
    p_productos JSONB -- Lista de productos en formato JSON
) RETURNS BOOLEAN AS $$
DECLARE
    v_venta_id INT;
BEGIN
    -- Iniciar la transacción
    BEGIN
        -- 1. Insertar la venta
        INSERT INTO "Venta" ("idUsuario", "idTercero", "idCaja", "idUbicacionVenta", "fechaVenta", "observacionVenta", "idTipoMedioPago", "valorTotalVenta", "estadoVenta")
        VALUES (_idUsuario, _idTercero, _idCaja, _idUbicacionVenta, _idTipoMedioPago, now(), _observacionVenta, _valorTotalVenta, TRUE)
        RETURNING "idVenta" INTO v_venta_id;

        -- 2. Insertar productos en DetalleVenta
        INSERT INTO "DetalleVenta" ("idVenta", "idProducto", "cantidadDetalleVenta", "valorDescuentoDetalleVenta", "valorImpuestosDetalleVenta", "valorTotalDetalleVenta")
        SELECT 
            v_venta_id,
            (prod->>'idProducto')::INT, 
            (prod->>'cantidadDetalleVenta')::INT, 
            (prod->>'valorDescuentoDetalleVenta')::DECIMAL(10,2),
            (prod->>'valorImpuestosDetalleVenta')::DECIMAL(10,2),
            (prod->>'valorTotalDetalleVenta')::DECIMAL(10,2)
        FROM jsonb_array_elements(p_productos) AS prod;

        -- Confirmar la transacción
        RETURN TRUE;

EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Error en insertarVenta: %', SQLERRM USING ERRCODE = SQLSTATE;
        RETURN FALSE;
    END;
END;
$$ LANGUAGE plpgsql;



CREATE OR REPLACE FUNCTION cancelarVenta(
    _idVenta "Venta"."idVenta"%TYPE,
    _idUsuarioCancelacionVenta "Venta"."idUsuarioCancelacionVenta"%TYPE,
    _motivoCancelacionVenta "Venta"."motivoCancelacionVenta"%TYPE)
    RETURNS BOOLEAN AS
$$
BEGIN
    UPDATE "Venta"
    SET "idUsuarioCancelacionVenta" = _idUsuarioCancelacionVenta,
        "estadoVenta" = FALSE,
        "motivoCancelacionVenta" = _motivoCancelacionVenta,
        "fechaCancelacionVenta" = now()
    WHERE "idVenta" = _idVenta;

    IF FOUND THEN
        RAISE NOTICE 'Se cancelo correctamente la venta';
        RETURN TRUE;
    ELSE
        RAISE NOTICE 'Ocurrió un error al cancelar la venta';
        RETURN FALSE;
    END IF;
END;
$$
LANGUAGE PLPGSQL;