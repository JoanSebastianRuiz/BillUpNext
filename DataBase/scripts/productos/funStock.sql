CREATE OR REPLACE FUNCTION actualizarStockCompra() RETURNS "trigger" AS 
$$
DECLARE
    _stockProducto "Producto"."stockProducto"%TYPE;
    diferenciaStock INTEGER;
    detalle RECORD;
BEGIN
    -- Manejar la inserción en DetalleCompra
    IF TG_TABLE_NAME = 'DetalleCompra' AND TG_OP = 'INSERT' THEN 
        SELECT "stockProducto" INTO _stockProducto FROM "Producto" WHERE "idProducto" = NEW."idProducto";
        IF FOUND THEN
            diferenciaStock = NEW."cantidadDetalleCompra";
            UPDATE "Producto" SET "stockProducto" = _stockProducto + diferenciaStock WHERE "idProducto" = NEW."idProducto";
            IF NOT FOUND THEN
                RAISE NOTICE 'Error al actualizar el stock del producto';
            END IF;
        ELSE
            RAISE NOTICE 'Producto no encontrado';
        END IF;

    -- Manejar la actualización del estado de compra a false
    ELSIF TG_TABLE_NAME = 'Compra' AND TG_OP = 'UPDATE' AND NEW."estadoCompra" = FALSE AND OLD."estadoCompra" =TRUE THEN
        FOR detalle IN SELECT "idProducto", "cantidadDetalleCompra" FROM  "DetalleCompra" WHERE "idCompra" = NEW."idCompra" LOOP
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

CREATE TRIGGER trgActualizarStockCompraDetalle
AFTER INSERT ON "DetalleCompra"
FOR EACH ROW
EXECUTE FUNCTION actualizarStockCompra();

CREATE TRIGGER trgActualizarStockCompraEstado
AFTER UPDATE OF "estadoCompra" ON "Compra"
FOR EACH ROW
EXECUTE FUNCTION actualizarStockCompra();


CREATE OR REPLACE FUNCTION actualizarStockVenta() RETURNS "trigger" AS
$$
DECLARE
    _stockProducto "Producto"."stockProducto"%TYPE;
    diferenciaStock INTEGER;
    detalle RECORD;
BEGIN
    -- Manejar la inserción en DetalleVenta
    IF TG_TABLE_NAME = 'DetalleVenta' AND TG_OP = 'INSERT' THEN
        SELECT "stockProducto" INTO _stockProducto FROM "Producto" WHERE "idProducto" = NEW."idProducto";
        IF FOUND THEN
            diferenciaStock = -NEW."cantidadDetalleVenta";
            UPDATE "Producto" SET "stockProducto" = _stockProducto + diferenciaStock WHERE "idProducto" = NEW."idProducto";
            IF NOT FOUND THEN
                RAISE NOTICE 'Error al actualizar el stock del producto';
            END IF;
        ELSE
            RAISE NOTICE 'Producto no encontrado';
        END IF;

    -- Manejar la actualización del estado de venta a false 
    ELSIF TG_TABLE_NAME = 'Venta' AND TG_OP = 'UPDATE' AND NEW."estadoVenta" = FALSE AND OLD."estadoVenta" = TRUE THEN
        FOR detalle IN SELECT "idProducto", "cantidadDetalleVenta" FROM "DetalleVenta" WHERE "idVenta" = NEW."idVenta" LOOP
            SELECT "stockProducto" INTO _stockProducto FROM "Producto"
            WHERE "idProducto" = detalle."idProducto";
            IF FOUND THEN
                diferenciaStock = detalle."cantidadDetalleVenta";
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

CREATE TRIGGER trgActualizarStockVentaDetalle
AFTER INSERT ON "DetalleVenta"
FOR EACH ROW
EXECUTE FUNCTION actualizarStockVenta();

CREATE TRIGGER trgActualizarStockVentaEstado
AFTER UPDATE OF "estadoVenta" ON "Venta"
FOR EACH ROW
EXECUTE FUNCTION actualizarStockVenta();
            
    
