CREATE OR REPLACE FUNCTION actualizarDetalleCaja(
    _idDetalleCaja "DetalleCaja"."idDetalleCaja"%TYPE,
    _idCaja "DetalleCaja"."idCaja"%TYPE,
    _idUsuario "DetalleCaja"."idUsuario"%TYPE,
    _fechaAperturaDetalleCaja "DetalleCaja"."fechaAperturaDetalleCaja"%TYPE,
    _fechaCierreDetalleCaja "DetalleCaja"."fechaCierreDetalleCaja"%TYPE,
    _dineroAperturaDetalleCaja "DetalleCaja"."dineroAperturaDetalleCaja"%TYPE,
    _dineroCierreDetalleCaja "DetalleCaja"."dineroCierreDetalleCaja"%TYPE,
    _dineroCierreSistemaDetalleCaja "DetalleCaja"."dineroCierreSistemaDetalleCaja"%TYPE
)
RETURNS BOOLEAN AS
$$
BEGIN
    UPDATE "DetalleCaja" SET
        "idCaja" = COALESCE(_idCaja, "idCaja"),
        "idUsuario" = COALESCE(_idUsuario, "idUsuario"),
        "fechaAperturaDetalleCaja"= COALESCE(_fechaAperturaDetalleCaja, "fechaAperturaDetalleCaja"),
        "fechaCierreDetalleCaja" = COALESCE(_fechaCierreDetalleCaja, "fechaCierreDetalleCaja"),
        "dineroAperturaDetalleCaja" = COALESCE(_dineroAperturaDetalleCaja, "dineroAperturaDetalleCaja"),
        "dineroCierreDetalleCaja"= COALESCE(_dineroCierreDetalleCaja, "dineroCierreDetalleCaja"),
        "dineroCierreSistemaDetalleCaja"= COALESCE(_dineroCierreSistemaDetalleCaja, "dineroCierreSistemaDetalleCaja")
    WHERE "idDetalleCaja" = _idDetalleCaja;

    IF FOUND THEN
        RAISE NOTICE 'Se actualizó correctamente el detalle de la caja';
        RETURN TRUE;
    ELSE
        RAISE NOTICE 'Ocurrió un error al actualizar el detalle de la caja';
        RETURN FALSE;
    END IF;
END;
$$
LANGUAGE PLPGSQL;


CREATE OR REPLACE FUNCTION eliminarDetalleCaja(
    _idDetalleCaja "DetalleCaja"."idDetalleCaja"%TYPE )
RETURNS BOOLEAN AS
$$
BEGIN

    DELETE FROM "DetalleCaja" WHERE "idDetalleCaja" = _idDetalleCaja;

    IF FOUND THEN
        RAISE NOTICE 'Se eliminó correctamente el detalle de la caja';
        RETURN TRUE;
    ELSE
        RAISE NOTICE 'Ocurrió un error al eliminar el detalle de la caja';
        RETURN FALSE;
    END IF;
END;
$$
LANGUAGE PLPGSQL; 


CREATE OR REPLACE FUNCTION insertarDetalleCaja(
    _idCaja "DetalleCaja"."idCaja"%TYPE,
    _idUsuario "DetalleCaja"."idUsuario"%TYPE,
    _fechaAperturaDetalleCaja "DetalleCaja"."fechaAperturaDetalleCaja"%TYPE,
    _fechaCierreDetalleCaja "DetalleCaja"."fechaCierreDetalleCaja"%TYPE,
    _dineroAperturaDetalleCaja "DetalleCaja"."dineroAperturaDetalleCaja"%TYPE,
    _dineroCierreDetalleCaja "DetalleCaja"."dineroCierreDetalleCaja"%TYPE,
    _dineroCierreSistemaDetalleCaja "DetalleCaja"."dineroCierreSistemaDetalleCaja"%TYPE
)
RETURNS BOOLEAN AS
$$
DECLARE
    id INTEGER;
BEGIN
    INSERT INTO "DetalleCaja"(
        "idCaja",
        "idUsuario",
        "fechaAperturaDetalleCaja",
        "fechaCierreDetalleCaja",
        "dineroAperturaDetalleCaja",
        "dineroCierreDetalleCaja",
        "dineroCierreSistemaDetalleCaja"
    )
    VALUES(
        _idCaja,
        _idUsuario,
        _fechaAperturaDetalleCaja,
        _fechaCierreDetalleCaja,
        _dineroAperturaDetalleCaja,
        _dineroCierreDetalleCaja,
        _dineroCierreSistemaDetalleCaja
    )
    RETURNING "idDetalleCaja" INTO id;

    IF FOUND THEN
        RAISE NOTICE 'Se insertó correctamente el detalle de la caja';
        RETURN TRUE;
    ELSE
        RAISE NOTICE 'Ocurrió un error al insertar el detalle de la caja';
        RETURN FALSE;
    END IF;
END;
$$
LANGUAGE PLPGSQL;
