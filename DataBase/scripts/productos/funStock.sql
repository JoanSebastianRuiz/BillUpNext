CREATE OR REPLACE FUNCTION actualizarStockCompra() RETURNS "trigger" AS 
$$
DECLARE
    _stockProducto "Producto"."stockProducto"%TYPE;
    diferenciaStock INTEGER;
    detalle RECORD;
BEGIN
    -- Manejar la inserción de una nueva compra
    IF TG_OP = 'INSERT' THEN
        FOR detalle IN SELECT "idProducto", "cantidadDetalleCompra" FROM "detalleCompra" WHERE "idCompra" = NEW."idCompra" LOOP
            SELECT "stockProducto" INTO _stockProducto FROM "Producto" WHERE "idProducto" = detalle."idProducto";
            IF FOUND THEN
                diferenciaStock = detalle."cantidadDetalleCompra";
                UPDATE "Producto" SET "stockProducto" = _stockProducto + diferenciaStock WHERE "idProducto" = detalle."idProducto";
                IF NOT FOUND THEN
                    RAISE NOTICE 'Error al actualizar el stock del producto';
                END IF;
            ELSE
                RAISE NOTICE 'Producto no encontrado';
            END IF;
        END LOOP;
    -- Manejar la actualización del estado a inactivo
    ELSIF TG_OP = 'UPDATE' AND NEW."estadoCompra" = FALSE AND OLD."estadoCompra" = TRUE THEN
        FOR detalle IN SELECT "idProducto", "cantidadDetalleCompra" FROM "DetalleCompra" WHERE "idCompra" = NEW."idCompra" LOOP
            SELECT "stockProducto" INTO _stockProducto FROM "Producto" WHERE "idProducto" = detalle."idProducto";
            IF FOUND THEN
                    diferenciaStock = -detalle."cantidadDetalleCompra";
                    UPDATE "Producto" SET "stockProducto" = _stockProducto + diferenciaStock WHERE "idProducto" = detalle."idProducto";
                    IF NOT FOUND THEN
                        RAISE NOTICE 'Error al actualizar el stock del producto';
                    END IF;
                ELSE
                    RAISE NOTICE 'Producto no encontrado';
                END IF;
            END LOOP;
        END IF;

        RETURN NEW;
END;
$$
LANGUAGE PLPGSQL;

CREATE TRIGGER trgActualizarStockCompra
AFTER INSERT OR UPDATE OF "estadoCompra" ON "Compra"
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
