CREATE TABLE usuarios (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre varchar(20),
  apellido varchar(20),
  username varchar(20) UNIQUE,
  email varchar(100) UNIQUE,
  contrasena varchar(100),
  reputacion int,
  activo bool,
  verificado bool,
  anio_ingreso int
);

CREATE TABLE asignaturas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  codigo varchar(20) UNIQUE,
  nombre varchar(50),
  semestre int,
  descripcion varchar(500),
  n_encuestas int,
  lab bool,
  controles bool,
  proyecto bool,
  cfg bool
);

CREATE TABLE tipo_pregunta (
  id uuid PRIMARY KEY,
  tipo varchar(50)
);

CREATE TABLE preguntas (
  id uuid PRIMARY KEY,
  id_tipo uuid,
  pregunta varchar(20),
  CONSTRAINT FK_pregunta_id_tipo
    FOREIGN KEY (id_tipo)
      REFERENCES tipo_pregunta(id)
      ON DELETE CASCADE
);

CREATE TABLE encuestas (
  id uuid PRIMARY KEY,
  id_profesor uuid,
  id_usuario uuid,
  id_asignatura uuid,
  CONSTRAINT FK_encuesta_id_usuario
    FOREIGN KEY (id_usuario)
      REFERENCES usuarios(id)
      ON DELETE CASCADE,
  CONSTRAINT FK_encuesta_id_asignatura
    FOREIGN KEY (id_asignatura)
      REFERENCES asignaturas(id)
      ON DELETE CASCADE
);

CREATE TABLE respuestas (
  id uuid,
  id_encuesta uuid,
  id_pregunta uuid,
  id_usuario uuid,
  respuesta int,
  CONSTRAINT FK_respuestas_id_pregunta
    FOREIGN KEY (id_pregunta)
      REFERENCES preguntas(id)
      ON DELETE CASCADE,
  CONSTRAINT FK_respuestas_id_encuesta
    FOREIGN KEY (id_encuesta)
      REFERENCES encuestas(id)
      ON DELETE CASCADE,
  CONSTRAINT FK_respuestas_id_usuario
    FOREIGN KEY (id_usuario)
      REFERENCES usuarios(id)
      ON DELETE CASCADE
);

CREATE TABLE comentarios (
  id uuid,
  id_usuario uuid,
  id_asignatura uuid,
  reputacion int,
  fecha date,
  texto varchar(250),
  CONSTRAINT FK_comentario_id_usuario
    FOREIGN KEY (id_usuario)
      REFERENCES usuarios(id)
      ON DELETE CASCADE,
  CONSTRAINT FK_comentario_id_asignatura
    FOREIGN KEY (id_asignatura)
      REFERENCES asignaturas(id)
      ON DELETE CASCADE
);

CREATE TABLE respuestas_ponderadas (
  id uuid PRIMARY KEY,
  id_asignatura uuid,
  id_pregunta uuid,
  respuesta_calculada int,
  CONSTRAINT FK_respuestas_ponderadas_id_asignatura
    FOREIGN KEY (id_asignatura)
      REFERENCES asignaturas(id)
      ON DELETE CASCADE,
  CONSTRAINT FK_respuestas_ponderadas_id_pregunta
    FOREIGN KEY (id_pregunta)
      REFERENCES preguntas(id)
      ON DELETE CASCADE
);