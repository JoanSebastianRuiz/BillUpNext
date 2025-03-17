CREATE OR REPLACE FUNCTION insertarCompra(
    _idTercero "Compra"."idTercero"%TYPE,
    _idUsuario "Compra"."idUsuario"%TYPE,
    _fechaCompra "Compra"."fechaCompra"%TYPE,
    _observacionCompra "Compra"."observacionCompra"%TYPE)
    RETURNS BOOLEAN AS
$$
DECLARE
    _idCompra "Compra"."idCompra"%TYPE;
BEGIN
    INSERT INTO "Compra" ("idTercero", "idUsuario", "fechaCompra", "observacionCompra")
    VALUES (_idTercero, _idUsuario, CURRENT_TIMESTAMP, _observacionCompra);

    IF FOUND THEN
        RAISE NOTICE 'Se insertó correctamente la compra';
        RETURN TRUE;
    ELSE
        RAISE EXCEPTION 'Ocurrió un error';
        RETURN FALSE;
    END IF;
END;
$$
LANGUAGE PLPGSQL;


CREATE OR REPLACE FUNCTION actualizarCompra(
    _idCompra "Compra"."idCompra"%TYPE,
    _idTercero "Compra"."idTercero"%TYPE,
    _idUsuario "Compra"."idUsuario"%TYPE,
    _observacionCompra "Compra"."observacionCompra"%TYPE)
    RETURNS BOOLEAN AS
$$
BEGIN
    UPDATE "Compra"
    SET "idTercero" = _idTercero,
        "idUsuario" = _idUsuario,
        "observacionCompra" = _observacionCompra
    WHERE "idCompra" = _idCompra;

    IF FOUND THEN
        RAISE NOTICE 'Se actualizó correctamente la compra';
        RETURN TRUE;
    ELSE
        RAISE NOTICE 'Ocurrió un error al actualizar la compra';
        RETURN FALSE;
    END IF;
END;
$$
LANGUAGE PLPGSQL;