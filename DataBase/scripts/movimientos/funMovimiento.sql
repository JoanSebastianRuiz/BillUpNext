CREATE OR REPLACE FUNCTION insertarMovimiento(
    _idUsuario "Movimiento"."idUsuario"%TYPE,
    _idCaja "Movimiento"."idCaja"%TYPE,
    _tipoMovimiento "Movimiento"."tipoMovimiento"%TYPE,
    _descripcionMovimiento "Movimiento"."descripcionMovimiento"%TYPE,
    _valorMovimiento "Movimiento"."valorMovimiento"%TYPE)
    RETURNS BOOLEAN AS
$$
DECLARE
    _idMovimiento "Movimiento"."idMovimiento"%TYPE;
BEGIN
    INSERT INTO "Movimiento" ("idUsuario", "idCaja", "tipoMovimiento", "descripcionMovimiento", "fechaMovimiento", "valorMovimiento")
    VALUES (_idUsuario, _idCaja, _tipoMovimiento, _descripcionMovimiento, CURRENT_TIMESTAMP, _valorMovimiento);

    IF FOUND THEN
        RAISE NOTICE 'Se insertó correctamente el movimiento';
        RETURN TRUE;
    ELSE
        RAISE EXCEPTION 'Ocurrió un error';
        RETURN FALSE;
    END IF;
END;
$$
LANGUAGE PLPGSQL;