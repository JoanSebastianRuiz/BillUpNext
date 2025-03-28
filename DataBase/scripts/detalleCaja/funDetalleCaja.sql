CREATE OR REPLACE FUNCTION actualizarDetalleCaja(
    _idDetalleCaja "DetalleCaja"."idDetalleCaja"%TYPE,
    _dineroCierreDetalleCaja "DetalleCaja"."dineroCierreDetalleCaja"%TYPE
)
RETURNS BOOLEAN AS
$$
DECLARE
    _idCaja INT;
    _fechaApertura TIMESTAMP;
    _dineroApertura DOUBLE PRECISION;
    _dineroCierreSistemaDetalleCaja DOUBLE PRECISION;
    _totalVentas DOUBLE PRECISION := 0;
    _totalIngresos DOUBLE PRECISION := 0;
    _totalEgresos DOUBLE PRECISION := 0;
    row_count INT;
BEGIN
    -- Obtener datos de la caja
    SELECT "idCaja", "fechaAperturaDetalleCaja", "dineroAperturaDetalleCaja"
    INTO _idCaja, _fechaApertura, _dineroApertura
    FROM "DetalleCaja"
    WHERE "idDetalleCaja" = _idDetalleCaja;

    -- Calcular total de ventas en la caja
    SELECT COALESCE(SUM("valorTotalVenta"), 0)
    INTO _totalVentas
    FROM "Venta"
    WHERE "idCaja" = _idCaja
    AND "fechaVenta" >= _fechaApertura;

    -- Calcular ingresos en la caja (tipoMovimiento = TRUE)
    SELECT COALESCE(SUM("valorMovimiento"), 0)
    INTO _totalIngresos
    FROM "Movimiento"
    WHERE "idCaja" = _idCaja
    AND "tipoMovimiento" = TRUE
    AND "fechaMovimiento" >= _fechaApertura;

    -- Calcular egresos en la caja (tipoMovimiento = FALSE)
    SELECT COALESCE(SUM("valorMovimiento"), 0)
    INTO _totalEgresos
    FROM "Movimiento"
    WHERE "idCaja" = _idCaja
    AND "tipoMovimiento" = FALSE
    AND "fechaMovimiento" >= _fechaApertura;

    -- Calcular el dinero de cierre del sistema
    _dineroCierreSistemaDetalleCaja := _dineroApertura + _totalVentas + _totalIngresos - _totalEgresos;

    -- Actualizar el detalle de la caja
    UPDATE "DetalleCaja" SET
        "fechaCierreDetalleCaja" = NOW(),
        "dineroCierreDetalleCaja" = COALESCE(_dineroCierreDetalleCaja, "dineroCierreDetalleCaja"),
        "dineroCierreSistemaDetalleCaja" = _dineroCierreSistemaDetalleCaja
    WHERE "idDetalleCaja" = _idDetalleCaja;

    GET DIAGNOSTICS row_count = ROW_COUNT;
    
    -- Actualizar el estado de la caja
    IF row_count > 0 THEN
        UPDATE "Caja" SET "openCaja" = FALSE WHERE "idCaja" = _idCaja;
        RAISE NOTICE 'Se actualizó correctamente el detalle de la caja. Dinero cierre sistema: %', _dineroCierreSistemaDetalleCaja;
        RETURN TRUE;
    ELSE
        RAISE NOTICE 'No se encontró la caja para actualizar';
        RETURN FALSE;
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Error al actualizar detalle de caja: %', SQLERRM;
        RETURN FALSE;
END;
$$
LANGUAGE PLPGSQL;



CREATE OR REPLACE FUNCTION insertarDetalleCaja(
    _idCaja "DetalleCaja"."idCaja"%TYPE,
    _idUsuario "DetalleCaja"."idUsuario"%TYPE,
    _dineroAperturaDetalleCaja "DetalleCaja"."dineroAperturaDetalleCaja"%TYPE
)
RETURNS BOOLEAN AS
$$
DECLARE
    row_count INT;
BEGIN
    INSERT INTO "DetalleCaja"(
        "idCaja",
        "idUsuario",
        "fechaAperturaDetalleCaja",
        "dineroAperturaDetalleCaja"
    )
    VALUES(
        _idCaja,
        _idUsuario,
        NOW(),
        _dineroAperturaDetalleCaja
    );

    -- Actualizar el estado de la caja
    UPDATE "Caja" SET "openCaja" = TRUE WHERE "idCaja" = _idCaja;

    -- Verificar si el UPDATE afectó filas
    GET DIAGNOSTICS row_count = ROW_COUNT;

    IF row_count > 0 THEN
        RAISE NOTICE 'Se insertó correctamente el detalle de la caja y se actualizó la caja';
        RETURN TRUE;
    ELSE
        RAISE NOTICE 'Se insertó el detalle, pero no se encontró la caja para actualizar';
        RETURN FALSE;
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Error al insertar detalle de caja: %', SQLERRM;
        RETURN FALSE;
END;
$$
LANGUAGE PLPGSQL;
