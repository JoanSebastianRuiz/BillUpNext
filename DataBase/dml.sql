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
(2,2,7,2,'66666666','Rosalba','Angarita','rosalba@gmail.com','3053888007','Calle 178#33A-13','66666666',TRUE);

