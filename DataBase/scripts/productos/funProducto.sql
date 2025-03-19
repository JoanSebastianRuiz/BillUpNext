CREATE OR REPLACE FUNCTION insertarProducto(
    _idEmpresa "Producto"."idEmpresa"%TYPE,
    _idCategoria "Producto"."idCategoria"%TYPE,
    _nombreProducto "Producto"."nombreProducto"%TYPE,
    _descripcionProducto "Producto"."descripcionProducto"%TYPE,
    _precioVentaProducto "Producto"."precioVentaProducto"%TYPE,
    _porcentajeDescuentoProducto "Producto"."porcentajeDescuentoProducto"%TYPE,
    _stockMinimoProducto "Producto"."stockMinimoProducto"%TYPE,
    _stockMaximoProducto "Producto"."stockMaximoProducto"%TYPE,
    _estadoProducto "Producto"."estadoProducto"%TYPE) 
    RETURNS BOOLEAN AS
$$
DECLARE
    _idProducto "Producto"."idProducto"%TYPE;
BEGIN
        INSERT INTO "Producto" ("idEmpresa","idCategoria","nombreProducto","descripcionProducto","precioVentaProducto", "porcentajeDescuentoProducto","stockMinimoProducto","stockMaximoProducto","stockProducto","estadoProducto")
        VALUES (_idEmpresa,_idCategoria,_nombreProducto,_descripcionProducto,_precioVentaProducto, COALESCE (_porcentajeDescuentoProducto, 0),_stockMinimoProducto,_stockMaximoProducto,0,_estadoProducto);

        IF FOUND THEN
            RAISE NOTICE 'Se insertó correctamente el producto';
            RETURN TRUE;
		ELSE
            RAISE NOTICE 'Ocurrió un error';
            RETURN FALSE;
        END IF;
END;
$$
LANGUAGE PLPGSQL;


CREATE OR REPLACE FUNCTION actualizarProducto(
    _idProducto "Producto"."idProducto"%TYPE,
    _idEmpresa "Producto"."idEmpresa"%TYPE,
    _idCategoria "Producto"."idCategoria"%TYPE,
    _nombreProducto "Producto"."nombreProducto"%TYPE,
    _descripcionProducto "Producto"."descripcionProducto"%TYPE,
    _precioVentaProducto "Producto"."precioVentaProducto"%TYPE,
    _porcentajeDescuentoProducto "Producto"."porcentajeDescuentoProducto"%TYPE,
    _stockMinimoProducto "Producto"."stockMinimoProducto"%TYPE,
    _stockMaximoProducto "Producto"."stockMaximoProducto"%TYPE,
    _estadoProducto "Producto"."estadoProducto"%TYPE) 
    RETURNS BOOLEAN AS
$$
BEGIN
    UPDATE "Producto"
    SET "idEmpresa" = _idEmpresa,
        "idCategoria" = _idCategoria,
        "nombreProducto" = _nombreProducto,
        "descripcionProducto" = _descripcionProducto,
        "precioVentaProducto" = _precioVentaProducto,
        "porcentajeDescuentoProducto" = _porcentajeDescuentoProducto,
        "stockMinimoProducto" = _stockMinimoProducto,
        "stockMaximoProducto" = _stockMaximoProducto,
        "estadoProducto" = _estadoProducto
    WHERE "idProducto" = _idProducto;

    IF FOUND THEN
        RAISE NOTICE 'Se actualizó correctamente el producto';
        RETURN TRUE;
    ELSE
        RAISE NOTICE 'Ocurrió un error al actualizar el producto';
        RETURN FALSE;
    END IF;
END;
$$
LANGUAGE PLPGSQL;


CREATE OR REPLACE FUNCTION existeProductoNombre(
    _nombreProducto "Producto"."nombreProducto"%TYPE,
    _idEmpresa "Producto"."idEmpresa"%TYPE,    
    _idCategoria "Producto"."idCategoria"%TYPE,
    _idProducto "Producto"."idProducto"%TYPE DEFAULT NULL
)
RETURNS BOOLEAN AS
$$
BEGIN
    RETURN EXISTS (
        SELECT 1
        FROM "Producto"
        WHERE LOWER("nombreProducto") = LOWER(_nombreProducto)
            AND "idCategoria" = _idCategoria
            AND "idEmpresa" = _idEmpresa
            AND (_idProducto IS NULL OR "idProducto" != _idProducto)
    );
END;
$$ 
LANGUAGE PLPGSQL;


CREATE OR REPLACE FUNCTION validarStockProducto(
    _stockMinimoProducto "Producto"."stockMinimoProducto"%TYPE,
    _stockMaximoProducto "Producto"."stockMaximoProducto"%TYPE
)
RETURNS BOOLEAN AS
$$
BEGIN
    RETURN NOT (
        _stockMinimoProducto <= 0
        OR _stockMaximoProducto <= 0
        OR _stockMinimoProducto > _stockMaximoProducto
    );
END;
$$ LANGUAGE PLPGSQL;


CREATE OR REPLACE FUNCTION validarPrecioVentaProducto(
    _precioVentaProducto "Producto"."precioVentaProducto"%TYPE
)
RETURNS BOOLEAN AS
$$
BEGIN
    RETURN _precioVentaProducto > 0;
END;
LANGUAGE PLPGSQL;


CREATE OR REPLACE FUNCTION validarPorcentajeDescuentoProducto(
    _porcentajeDescuentoProducto "Producto"."porcentajeDescuentoProducto"%TYPE
)
RETURNS BOOLEAN AS
$$
BEGIN
    RETURN _porcentajeDescuentoProducto > 0;
END;
LANGUAGE PLPGSQL;