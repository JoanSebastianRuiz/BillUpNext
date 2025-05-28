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
    _idDetalleCaja INT;
    _fechaApertura TIMESTAMP;
    _dineroApertura DOUBLE PRECISION;
    _dineroCierreSistemaDetalleCaja DOUBLE PRECISION;
    _totalVentas DOUBLE PRECISION := 0;
    _totalIngresos DOUBLE PRECISION := 0;
    _totalEgresos DOUBLE PRECISION := 0;
    row_count INT;
BEGIN
    -- Verificar si la caja está abierta
    IF NOT EXISTS (SELECT 1 FROM "Caja" WHERE "idCaja" = _idCaja AND "openCaja" = TRUE) THEN
        RAISE NOTICE 'La caja ya está cerrada o no existe.';
        RETURN FALSE;
    END IF;

    -- Obtener el idDetalleCaja más reciente asociado a la caja
    SELECT "idDetalleCaja", "fechaAperturaDetalleCaja", "dineroAperturaDetalleCaja"
    INTO _idDetalleCaja, _fechaApertura, _dineroApertura
    FROM "DetalleCaja"
    WHERE "idCaja" = _idCaja
    ORDER BY "fechaAperturaDetalleCaja" DESC
    LIMIT 1;

    IF _idDetalleCaja IS NULL THEN
        RAISE NOTICE 'No se encontró un detalle de caja asociado a la caja %.', _idCaja;
        RETURN FALSE;
    END IF;

    -- Calcular total de ventas en la caja
    SELECT COALESCE(SUM("valorTotalVenta"), 0)
    INTO _totalVentas
    FROM "Venta"
    WHERE "idCaja" = _idCaja
    AND "estadoVenta" = TRUE
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

    -- Cerrar la caja y actualizar detalle de caja
    UPDATE "Caja" SET "openCaja" = FALSE WHERE "idCaja" = _idCaja;

    UPDATE "DetalleCaja" SET
        "fechaCierreDetalleCaja" = NOW(),
        "dineroCierreSistemaDetalleCaja" = _dineroCierreSistemaDetalleCaja
    WHERE "idDetalleCaja" = _idDetalleCaja;

    -- Verificar si la actualización fue exitosa
    GET DIAGNOSTICS row_count = ROW_COUNT;

    IF row_count > 0 THEN
        RAISE NOTICE 'La caja % ha sido cerrada correctamente. Dinero cierre sistema: %', _idCaja, _dineroCierreSistemaDetalleCaja;
        RETURN TRUE;
    ELSE
        RAISE NOTICE 'No se pudo cerrar la caja.';
        RETURN FALSE;
    END IF;
END;
$$
LANGUAGE PLPGSQL;


CREATE OR REPLACE FUNCTION obtenerCajaAbiertaPorUsuario(
    _idUsuario INT
)
RETURNS INT AS
$$
DECLARE
    _idCaja INT := 0;
BEGIN
    SELECT dc."idCaja"
    INTO _idCaja
    FROM "DetalleCaja" dc
    JOIN "Caja" c ON dc."idCaja" = c."idCaja"
    WHERE dc."idUsuario" = _idUsuario
      AND c."openCaja" = TRUE
    ORDER BY dc."fechaAperturaDetalleCaja" DESC
    LIMIT 1;

    RETURN COALESCE(_idCaja, 0);
END;
$$
LANGUAGE PLPGSQL;



