CREATE OR REPLACE FUNCTION insertarMovimiento(
    _idUsuario "Movimiento"."idUsuario"%TYPE,
    _idCaja "Movimiento"."idCaja"%TYPE,
    _descripcionMovimiento "Movimiento"."descripcionMovimiento"%TYPE,
    _valorMovimiento "Movimiento"."valorMovimiento")
    RETURN BOOLEAN AS
$$
DECLARE
    _idMovimiento "Movimiento"."idMovimiento"%TYPE;
BEGIN
    INSERT INTO "Movimiento" ("idUsuario", "idCaja", "descripcionMovimiento", "valorMovimiento")
    VALUES (_idUsuario, _idCaja, _descripcionMovimiento, _valorMovimiento);

    IF FOUND THEN
        RAISE NOTICE 'Se insertó correctamente el movimiento'
        RETURN TRUE;
    ELSE
        RAISE EXCEPTION 'Ocurrió un error';
        RETURN FALSE;
    END IF;
END;
$$
LANGUAGE PLPGSQL;


CREATE OR REPLACE FUNCTION actualizarMovimiento(
    _idMovimiento "Movimiento"."idMovimiento"%TYPE,
    _idUsuario "Movimiento"."idUsuario"%TYPE,
    _idCaja "Movimiento"."idCaja"%TYPE,
    _descripcionMovimiento "Movimiento"."descripcionMovimiento"%TYPE,
    _valorMovimiento "Movimiento"."valorMovimiento"%TYPE)
    RETURN BOOLEAN AS
$$
BEGIN
    UPDATE "Movimiento"
    SET "idUsuario" = _idUsuario,
        "idCaja" = _idCaja,
        "descripcionMovimiento" = _descripcionMovimiento,
        "valorMovimiento" = _valorMovimiento
    WHERE "idMovimiento" = _idMovimiento;

    IF FOUND THEN
        RAISE NOTICE 'Se actualizó correctamente el movimiento';
        RETURN TRUE;
    ELSE
        RAISE NOTICE 'Ocurrió un error al actualizar el movimiento';
        RETURN FALSE;
    END IF;
END;
$$
LANGUAGE PLPGSQL;