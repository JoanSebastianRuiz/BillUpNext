CREATE OR REPLACE FUNCTION insertarCompra(
    _idUsuario "Compra"."idUsuario"%TYPE,
    _observacionCompra "Compra"."observacionCompra"%TYPE,
    _valorTotalCompra "Compra"."valorTotalCompra"%TYPE,
    p_productos JSONB -- Lista de productos en formato JSON
) RETURNS BOOLEAN AS $$
DECLARE
    v_compra_id INT;
BEGIN
    -- Iniciar la transacción
    BEGIN
        -- 1. Insertar la compra
        INSERT INTO "Compra" ("idUsuario", "fechaCompra", "observacionCompra", "valorTotalCompra", "estadoCompra")
        VALUES (_idUsuario, now(), _observacionCompra, _valorTotalCompra, TRUE)
        RETURNING "idCompra" INTO v_compra_id;

        -- 2. Insertar productos en DetalleCompra
        INSERT INTO "DetalleCompra" ("idCompra", "idTercero", "idProducto", "cantidadDetalleCompra", "valorDetalleCompra")
        SELECT 
            v_compra_id,
            (prod->>'idTercero')::INT,
            (prod->>'idProducto')::INT, 
            (prod->>'cantidadDetalleCompra')::INT, 
            (prod->>'valorDetalleCompra')::DECIMAL(10,2)
        FROM jsonb_array_elements(p_productos) AS prod;

        -- Confirmar la transacción
        RETURN TRUE;

EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Error en insertarCompra: %', SQLERRM USING ERRCODE = SQLSTATE;
        RETURN FALSE;
    END;
END;
$$ LANGUAGE plpgsql;



CREATE OR REPLACE FUNCTION cancelarCompra(
    _idCompra "Compra"."idCompra"%TYPE,
    _idUsuarioCancelacionCompra "Compra"."idUsuarioCancelacionCompra"%TYPE,
    _motivoCancelacionCompra "Compra"."motivoCancelacionCompra"%TYPE)
    RETURNS BOOLEAN AS
$$
BEGIN
    UPDATE "Compra"
    SET "idUsuarioCancelacionCompra" = _idUsuarioCancelacionCompra,
        "estadoCompra" = FALSE,
        "motivoCancelacionCompra" = _motivoCancelacionCompra,
        "fechaCancelacionCompra" = now()
    WHERE "idCompra" = _idCompra;

    IF FOUND THEN
        RAISE NOTICE 'Se cancelo correctamente la compra';
        RETURN TRUE;
    ELSE
        RAISE NOTICE 'Ocurrió un error al cancelar la compra';
        RETURN FALSE;
    END IF;
END;
$$
LANGUAGE PLPGSQL;