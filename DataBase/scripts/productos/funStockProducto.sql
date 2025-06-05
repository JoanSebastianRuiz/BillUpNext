CREATE OR REPLACE FUNCTION verificarStockProducto(
    _idProducto INT,
    _cantidadSolicitada INT 
) RETURNS BOOLEAN AS 
$$
DECLARE 
    _stock INT;
BEGIN
    SELECT "stockProducto" INTO _stock
    FROM "Producto"
    WHERE "idProducto" = _idProducto;

    IF NOT FOUND THEN
        RETURN FALSE; 
    END IF;

    IF _stock < _cantidadSolicitada THEN
        RETURN FALSE;
    END IF;

    RETURN TRUE;
END;
$$ 
LANGUAGE plpgsql;