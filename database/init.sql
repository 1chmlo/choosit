CREATE TABLE usuario (
  id uuid PRIMARY KEY,
  nombre varchar(20),
  apellido varchar(20),
  username varchar(20),
  email varchar(30),
  contrasena varchar(30),
  reputacion int,
  activo bool,
  verificado bool,
  cod_verificacion int,
  anio_ingreso int
);

CREATE TABLE asignatura (
  id uuid PRIMARY KEY,
  codigo varchar(20),
  nombre varchar(20),
  descripcion varchar(250),
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

CREATE TABLE pregunta (
  id uuid PRIMARY KEY,
  id_tipo uuid,
  pregunta varchar(20),
  CONSTRAINT FK_pregunta_id_tipo
    FOREIGN KEY (id_tipo)
      REFERENCES tipo_pregunta(id)
      ON DELETE CASCADE
);

CREATE TABLE encuesta (
  id uuid PRIMARY KEY,
  id_profesor uuid,
  id_usuario uuid,
  id_asignatura uuid,
  CONSTRAINT FK_encuesta_id_usuario
    FOREIGN KEY (id_usuario)
      REFERENCES usuario(id)
      ON DELETE CASCADE,
  CONSTRAINT FK_encuesta_id_asignatura
    FOREIGN KEY (id_asignatura)
      REFERENCES asignatura(id)
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
      REFERENCES pregunta(id)
      ON DELETE CASCADE,
  CONSTRAINT FK_respuestas_id_encuesta
    FOREIGN KEY (id_encuesta)
      REFERENCES encuesta(id)
      ON DELETE CASCADE,
  CONSTRAINT FK_respuestas_id_usuario
    FOREIGN KEY (id_usuario)
      REFERENCES usuario(id)
      ON DELETE CASCADE
);

CREATE TABLE comentario (
  id uuid,
  id_usuario uuid,
  id_asignatura uuid,
  reputacion int,
  fecha date,
  texto varchar(250),
  CONSTRAINT FK_comentario_id_usuario
    FOREIGN KEY (id_usuario)
      REFERENCES usuario(id)
      ON DELETE CASCADE,
  CONSTRAINT FK_comentario_id_asignatura
    FOREIGN KEY (id_asignatura)
      REFERENCES asignatura(id)
      ON DELETE CASCADE
);

CREATE TABLE respuestas_ponderadas (
  id uuid PRIMARY KEY,
  id_asignatura uuid,
  id_pregunta uuid,
  respuesta_calculada int,
  CONSTRAINT FK_respuestas_ponderadas_id_asignatura
    FOREIGN KEY (id_asignatura)
      REFERENCES asignatura(id)
      ON DELETE CASCADE,
  CONSTRAINT FK_respuestas_ponderadas_id_pregunta
    FOREIGN KEY (id_pregunta)
      REFERENCES pregunta(id)
      ON DELETE CASCADE
);