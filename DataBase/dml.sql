INSERT INTO "Pais" ("nombrePais", "isoAlfa2Pais", "isoNumericoPais") VALUES 
('Colombia','CO','1');

INSERT INTO "Departamento" ("idPais", "nombreDepartamento", "codigoDepartamento")
VALUES
(1,'Santander','1'), 
(1,'Cundinamarca','2'),
(1,'Antioquia','3');

INSERT INTO "Municipio" ("idDepartamento", "nombreMunicipio", "codigoMunicipio")
VALUES 
(1,'Floridablanca','1'),
(1,'Bucaramanga','2'),
(1,'Giron','3'),
(2,'Bogota','1'),
(2,'Chia','2'),
(2,'Cajica','3'),
(3,'Medelin','1'),
(3,'Envigado','2'),
(3,'Itagui','3');

INSERT INTO "TipoDocumento" ("nombreTipoDocumento", "abreviaturaTipoDocumento", "estadoTipoDocumento")
VALUES
('Cedula de ciudadania','CC', TRUE),
('Cedula de extranjeria','CE', TRUE),
('Permiso de permanencia','PP', TRUE);

INSERT INTO "TipoPersona"  ("nombreTipoPersona")
VALUES
('Persona Natural'),
('Persona Jurídica'),
('Sociedad Colectiva');

INSERT INTO "RegimenContribuyente" ("nombreRegimenContribuyente", "responsabilidadRegimenContribuyente")
VALUES
('Régimen Simplificado', 'N/A'),
('Régimen Común', 'IVA'),
('Régimen Especial', 'ICA');

INSERT INTO "Empresa" ("idTipoPersona", "idRegimenContribuyente", "idMunicipio", "nitEmpresa", "digitoVerificacionEmpresa", "nombreEmpresa", "razonSocialEmpresa", "direccionEmpresa", "codigoPostalEmpresa", "telefonoEmpresa", "correoEmpresa", "estadoEmpresa")
VALUES
(1,1,2,'111111111','1','BillUp','BillUp','Calle 1','111111','1111111111','billup@gmail.com','TRUE'),
(1, 2, 1, '900123456', '5', 'AgroIndustria del Valle', 'AgroIndustria del Valle S.A.S.',
 'Cra 50 # 15-30', '760001', '3001234567', 'contacto@agrovalle.com', TRUE),
(2, 1, 1, '800765432', '3', 'Transportes Unidos', 'Transportes Unidos Ltda.', 
 'Calle 45 # 9-67', '110011', '3001122334', 'info@transunidos.com', TRUE),
(3, 3, 1, '900987654', '8', 'Servicios Globales', 'Servicios Globales S.A.', 
 'Av. Central # 123', '120012', '3112223344', 'servicios@globales.com', TRUE);

INSERT INTO "Rol" ("nombreRol", "estadoRol")
VALUES 
('Administrador', TRUE),
('Supervisor', TRUE),
('Cajero', TRUE);

INSERT INTO "Usuario" ("idEmpresa", "idTipoDocumento", "idMunicipio", "idRol", "numeroDocumentoUsuario", "nombreUsuario", "apellidoUsuario", "correoUsuario", "telefonoUsuario", "direccionUsuario", "claveUsuario", "estadoUsuario")
VALUES 
(1,1,1,1,'11111111','Joan','Ruiz','joan@gmail.com','3053724777','Calle 100#44A-14','11111111',TRUE),
(2,2,7,2,'66666666','Rosalba','Angarita','rosalba@gmail.com','3053888007','Calle 178#33A-13','66666666',TRUE),
(2,2,7,3,'77777777','Juan','Torres','juant@gmail.com','3053888008','Calle 178#33A-13','77777777',TRUE);

INSERT INTO "Categoria" ("idEmpresa", "nombreCategoria", "estadoCategoria")
VALUES 
(1,'Frutas', TRUE),
(1,'Verduras', TRUE),
(1,'Carnes', TRUE),
(2,'Lacteos', TRUE),
(2,'Aseo', TRUE),
(2,'Hogar', TRUE);

INSERT INTO "Producto" ("idEmpresa", "idCategoria", "nombreProducto", "descripcionProducto", "precioVentaProducto", "porcentajeDescuentoProducto", "stockMinimoProducto", "stockMaximoProducto", "stockProducto", "estadoProducto")
VALUES 
(1,1,'Manzana','Manzana verde', 2000, 0, 10, 100, 0, TRUE),
(1,1,'Pera','Pera verde', 1500, 0, 10, 100, 0, TRUE),
(1,1,'Banano','Banano maduro', 1000, 0, 10, 100, 0, TRUE),
(1,2,'Lechuga','Lechuga crespa', 2000, 0, 10, 100, 0, TRUE),
(1,2,'Tomate','Tomate chonto', 1500, 0, 10, 100, 0, TRUE),
(1,2,'Zanahoria','Zanahoria', 1000, 0, 10, 100, 0, TRUE),
(1,3,'Res','Carne de res', 20000, 0, 10, 100, 0, TRUE),
(1,3,'Pollo','Carne de pollo', 15000, 0, 10, 100, 0, TRUE),
(1,3,'Cerdo','Carne de cerdo', 10000, 0, 10, 100, 0, TRUE),
(2,4,'Leche','Leche deslactosada', 3000, 0, 10, 100, 0, TRUE),
(2,4,'Queso','Queso campesino', 5000, 0, 10, 100, 0, TRUE),
(2,4,'Yogurt','Yogurt natural', 2000, 0, 10, 100, 0, TRUE),
(2,5,'Jabon','Jabon en barra', 2000, 0, 10, 100, 0, TRUE),
(2,5,'Detergente','Detergente en polvo', 5000, 0, 10, 100, 0, TRUE),
(2,5,'Desinfectante','Desinfectante', 3000, 0, 10, 100, 0, TRUE),
(2,6,'Escoba','Escoba de palma', 2000, 0, 10, 100, 0, TRUE),
(2,6,'Recogedor','Recogedor de plastico', 5000, 0, 10, 100, 0, TRUE),
(2,6,'Cubeta','Cubeta de plastico', 3000, 0, 10, 100, 0, TRUE);


-- clientes persona
INSERT INTO "Tercero" ("idEmpresa", "idTipoDocumento", "idMunicipio", "numeroDocumentoTercero", "nombreTercero", "apellidoTercero", "telefonoTercero", "direccionTercero", "correoTercero", "proveedorTercero", "estadoTercero")
VALUES
(2, 1, 1, '22222222', 'Carlos', 'Perez', '3053724777', 'Calle 100#44A-14', 'carlos@gmail.com', FALSE, TRUE),
(2, 1, 1, '33333333', 'Maria', 'Gomez', '3053724777', 'Calle 100#44A-14', 'maria@gmail.com', FALSE, TRUE);


-- clientes empresa
INSERT INTO "Tercero" ("idEmpresa", "idTipoPersona", "idMunicipio", "idRegimenContribuyente", "nitTercero", "digitoVerificacionTercero", "razonSocialTercero", "nombreTercero", "telefonoTercero", "direccionTercero", "correoTercero", "codigoPostalTercero", "proveedorTercero", "estadoTercero")
VALUES
(2, 2, 1, 1, '444444444', '4', 'Empresa de Prueba', 'Empresa de Prueba', '3053724777', 'Calle 100#44A-14', 'empresaprueba@gmail.com', '111111', FALSE, TRUE),
(2, 2, 1, 1, '555555555', '5', 'Empresa de Prueba 2', 'Empresa de Prueba 2', '3053724777', 'Calle 100#44A-14', 'empresaprueba2@gmail.com', '222222', FALSE, TRUE);


-- proveedores persona
INSERT INTO "Tercero" ("idEmpresa", "idTipoDocumento", "idMunicipio", "numeroDocumentoTercero", "nombreTercero", "apellidoTercero", "telefonoTercero", "direccionTercero", "correoTercero", "proveedorTercero", "estadoTercero")
VALUES
(2, 1, 1, '77777778', 'Angelica', 'Angarita', '3053724777', 'Calle 100#44A-14', 'angelica@gmail.com', TRUE, TRUE),
(2, 1, 1, '88888888', 'Luis', 'Ruiz', '3053724777', 'Calle 100#44A-14', 'luis@gmail.com', TRUE, TRUE);


-- proveedores empresa
INSERT INTO "Tercero" ("idEmpresa", "idTipoPersona", "idMunicipio", "idRegimenContribuyente", "nitTercero", "digitoVerificacionTercero", "razonSocialTercero", "nombreTercero", "telefonoTercero", "direccionTercero", "correoTercero", "codigoPostalTercero", "proveedorTercero", "estadoTercero")
VALUES
(2, 2, 1, 1, '999999999', '9', 'Empresa de Prueba 3', 'Empresa de Prueba 3', '3053724777', 'Calle 100#44A-14', 'empresaprueba3@gmail.com', '333333', TRUE, TRUE),
(2, 2, 1, 1, '101010101', '0', 'Empresa de Prueba 4', 'Empresa de Prueba 4', '3053724777', 'Calle 100#44A-14', 'empresaprueba4@gmail.com', '444444', TRUE, TRUE);


-- Tercero Producto
INSERT INTO "TerceroProducto" ("idTercero", "idProducto", "precioCompraTerceroProducto", "estadoTerceroProducto")
VALUES
(5, 13, 2000, TRUE),
(5, 14, 5000, TRUE),
(5, 15, 3000, TRUE),
(6, 16, 2000, TRUE),
(6, 17, 5000, TRUE),
(6, 18, 3000, TRUE),
(7, 13, 2000, TRUE),
(7, 14, 5000, TRUE),
(7, 15, 3000, TRUE),
(8, 16, 2000, TRUE),
(8, 17, 5000, TRUE),
(8, 18, 3000, TRUE);


INSERT INTO "Gravamen" ("nombreGravamen", "estadoGravamen")
VALUES
('IVA', TRUE),
('ICA', TRUE),
('ReteIVA', TRUE),
('ReteICA', TRUE);


INSERT INTO "TipoMedioPago" ("nombreTipoMedioPago", "estadoTipoMedioPago")
VALUES
('Efectivo', TRUE);


INSERT INTO "Caja" ("idEmpresa", "nombreCaja", "estadoCaja", "openCaja")
VALUES
(2, 'Caja 1', TRUE, FALSE),
(2, 'Caja 2', TRUE, FALSE),
(2, 'Caja 3', TRUE, FALSE);


INSERT INTO "UbicacionVenta" ("idEmpresa", "nombreUbicacionVenta", "estadoUbicacionVenta")
VALUES
(2, 'Ubicacion 1', TRUE),
(2, 'Ubicacion 2', TRUE),
(2, 'Ubicacion 3', TRUE);
