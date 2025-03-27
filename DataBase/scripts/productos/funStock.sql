CREATE OR REPLACE FUNCTION actualizarStockCompra() RETURNS "trigger" AS 
$$
DECLARE
    _stockProducto "Producto"."stockProducto"%TYPE;
    diferenciaStock INTEGER;
BEGIN
-- Obtener el stock actual
    SELECT "stockProducto" INTO _stockProducto FROM "Producto" WHERE "idProducto" = NEW."idProducto";

    IF FOUND THEN
        -- Calcular la diferencia de stock segun la operación 
        IF TG_OP = 'INSERT' THEN
            --Si es un insert, suma la cantidad comprada
            diferenciaStock = NEW."cantidadDetalleCompra";
        ELSIF TG_OP = 'UPDATE' THEN
            --Si es un update, calcula la diferencia entre la nueva y antigua cantidad 
            diferenciaStock = NEW."cantidadDetalleCompra" - OLD."cantidadDetalleCompra";
        END IF;

        -- Actualizar el stock en la tabla producto
        UPDATE "Producto" SET "stockProducto" = _stockProducto + diferenciaStock WHERE "idProducto" = NEW."idProducto";

        IF NOT FOUND THEN
            RAISE NOTICE 'Error al actualizar el stock del producto';
        END IF;
    ELSE
        RAISE NOTICE 'Producto no encontrado';
    END IF;

    RETURN NEW;
END;
$$
LANGUAGE PLPGSQL;

CREATE TRIGGER trgActualizarStockCompra
AFTER INSERT OR UPDATE ON "DetalleCompra"
FOR EACH ROW
EXECUTE FUNCTION actualizarStockCompra();


CREATE OR REPLACE FUNCTION actualizarStockVenta() RETURNS "trigger" AS
$$
DECLARE
    _stockProducto "Producto"."stockProducto"%TYPE;
BEGIN
    --obtener el stock actual 
    SELECT "stockProducto" INTO _stockProducto FROM "Producto" WHERE "idProducto" = NEW."idProducto";

    IF FOUND THEN
        -- Verificar si hay suficiente stock para la venta
        IF _stockProducto >= NEW."cantidadDetalleVenta" THEN
            UPDATE "Producto" SET "stockProducto" = _stockProducto - NEW."cantidadDetalleVenta" WHERE "idProducto" = NEW."idProducto";

            IF NOT FOUND THEN
                RAISE NOTICE 'Error al actualizar el stock';
            END IF;
        ELSE
            RAISE NOTICE 'stock insuficiente para el producto';
        END IF;
    ELSE
        RAISE NOTICE 'Producto no encontrado';
    END IF;

    RETURN NEW;
END;
$$
LANGUAGE PLPGSQL;

CREATE TRIGGER trgActualizarStockVenta
AFTER INSERT ON "DetalleVenta"
FOR EACH ROW
EXECUTE FUNCTION actualizarStockVenta();
