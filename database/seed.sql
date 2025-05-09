-- Insertar usuarios
INSERT INTO usuarios (id, nombre, apellido, username, email, contrasena, reputacion, activo, verificado, cod_verificacion, anio_ingreso) VALUES
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Juan', 'Pérez', 'juanperez', 'juan@example.com', 'password123', 100, true, true, 123456, 2020),
('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'María', 'Gómez', 'mariag', 'maria@example.com', 'securepass', 85, true, true, 654321, 2019),
('c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', 'Carlos', 'López', 'carlosl', 'carlos@example.com', 'mypassword', 50, true, false, 987654, 2021);

-- Insertar asignaturas
INSERT INTO asignaturas (id, codigo, nombre, n_encuestas, lab, controles, proyecto, cfg) VALUES
('d3eebc99-9c0b-4ef8-bb6d-6bb9bd380a14', 'MAT101', 'Matemáticas I', 15, false, true, false, false),
('e4eebc99-9c0b-4ef8-bb6d-6bb9bd380a15', 'PROG202', 'Programación', 20, true, true, true, false),
('f5eebc99-9c0b-4ef8-bb6d-6bb9bd380a16', 'FIS301', 'Física', 10, true, false, false, true);

-- Insertar tipos de pregunta
INSERT INTO tipo_pregunta (id, tipo) VALUES
('g6eebc99-9c0b-4ef8-bb6d-6bb9bd380a17', NULL), -- Tipo raíz
('h7eebc99-9c0b-4ef8-bb6d-6bb9bd380a18', 'g6eebc99-9c0b-4ef8-bb6d-6bb9bd380a17'), -- Sub-tipo
('i8eebc99-9c0b-4ef8-bb6d-6bb9bd380a19', 'g6eebc99-9c0b-4ef8-bb6d-6bb9bd380a17'); -- Sub-tipo

-- Insertar preguntas
INSERT INTO preguntas (id, id_tipo, pregunta) VALUES
('j9eebc99-9c0b-4ef8-bb6d-6bb9bd380a20', 'h7eebc99-9c0b-4ef8-bb6d-6bb9bd380a18', 'Claridad explicación'),
('k0eebc99-9c0b-4ef8-bb6d-6bb9bd380a21', 'h7eebc99-9c0b-4ef8-bb6d-6bb9bd380a18', 'Dificultad'),
('l1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'i8eebc99-9c0b-4ef8-bb6d-6bb9bd380a19', 'Utilidad laboratorios');

-- Insertar encuestas
INSERT INTO encuestas (id, id_profesor, id_usuario, id_asignatura) VALUES
('m2eebc99-9c0b-4ef8-bb6d-6bb9bd380a23', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'e4eebc99-9c0b-4ef8-bb6d-6bb9bd380a15'),
('n3eebc99-9c0b-4ef8-bb6d-6bb9bd380a24', 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', 'd3eebc99-9c0b-4ef8-bb6d-6bb9bd380a14'),
('o4eebc99-9c0b-4ef8-bb6d-6bb9bd380a25', 'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'f5eebc99-9c0b-4ef8-bb6d-6bb9bd380a16');

-- Insertar respuestas
INSERT INTO respuestas (id, id_encuesta, id_pregunta, id_usuario, respuesta) VALUES
('p5eebc99-9c0b-4ef8-bb6d-6bb9bd380a26', 'm2eebc99-9c0b-4ef8-bb6d-6bb9bd380a23', 'j9eebc99-9c0b-4ef8-bb6d-6bb9bd380a20', 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 4),
('q6eebc99-9c0b-4ef8-bb6d-6bb9bd380a27', 'm2eebc99-9c0b-4ef8-bb6d-6bb9bd380a23', 'k0eebc99-9c0b-4ef8-bb6d-6bb9bd380a21', 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 3),
('r7eebc99-9c0b-4ef8-bb6d-6bb9bd380a28', 'n3eebc99-9c0b-4ef8-bb6d-6bb9bd380a24', 'j9eebc99-9c0b-4ef8-bb6d-6bb9bd380a20', 'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', 5);

-- Insertar comentarios
INSERT INTO comentarios (id, id_usuario, id_asignatura, reputacion, fecha, texto) VALUES
('s8eebc99-9c0b-4ef8-bb6d-6bb9bd380a29', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'e4eebc99-9c0b-4ef8-bb6d-6bb9bd380a15', 1, '2023-05-15', 'Excelente curso, muy bien explicado'),
('t9eebc99-9c0b-4ef8-bb6d-6bb9bd380a30', 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'd3eebc99-9c0b-4ef8-bb6d-6bb9bd380a14', 14, '2023-06-20', 'Demasiado difícil para ser introductorio'),
('u0eebc99-9c0b-4ef8-bb6d-6bb9bd380a31', 'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', 'f5eebc99-9c0b-4ef8-bb6d-6bb9bd380a16', 1, '2023-04-10', 'Los laboratorios son muy prácticos');

-- Insertar respuestas ponderadas
INSERT INTO respuestas_ponderadas (id, id_asignatura, id_pregunta, respuesta_calculada) VALUES
('v1eebc99-9c0b-4ef8-bb6d-6bb9bd380a32', 'e4eebc99-9c0b-4ef8-bb6d-6bb9bd380a15', 'j9eebc99-9c0b-4ef8-bb6d-6bb9bd380a20', 4),
('w2eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'd3eebc99-9c0b-4ef8-bb6d-6bb9bd380a14', 'k0eebc99-9c0b-4ef8-bb6d-6bb9bd380a21', 3),
('x3eebc99-9c0b-4ef8-bb6d-6bb9bd380a34', 'f5eebc99-9c0b-4ef8-bb6d-6bb9bd380a16', 'l1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 5);