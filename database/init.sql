CREATE EXTENSION IF NOT EXISTS unaccent;




CREATE TABLE usuarios (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY NOT NULL,
  nombre varchar(20) NOT NULL,
  apellido varchar(20) NOT NULL,
  username varchar(20) UNIQUE NOT NULL,
  email varchar(100) UNIQUE NOT NULL,
  contrasena varchar(100) NOT NULL,
  reputacion int NOT NULL DEFAULT 0,
  activo bool NOT NULL DEFAULT true,
  verificado bool NOT NULL DEFAULT false,
  anio_ingreso int NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE TABLE asignaturas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY NOT NULL,
  codigo varchar(20) UNIQUE NOT NULL,
  nombre varchar(50) NOT NULL,
  semestre int NOT NULL,
  descripcion varchar(500) NOT NULL,
  n_encuestas int NOT NULL DEFAULT 0,
  lab bool NOT NULL,
  controles bool NOT NULL,
  proyecto bool NOT NULL,
  cfg bool NOT NULL
);

CREATE TABLE tipo_pregunta (
  id uuid PRIMARY KEY NOT NULL,
  tipo varchar(50) NOT NULL
);

CREATE TABLE preguntas (
  id uuid PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
  id_tipo uuid NOT NULL,
  pregunta varchar(20) NOT NULL,
  CONSTRAINT FK_pregunta_id_tipo
    FOREIGN KEY (id_tipo)
      REFERENCES tipo_pregunta(id)
      ON DELETE CASCADE
);

CREATE TABLE encuestas (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY NOT NULL,
  id_tipo_pregunta NOT NULL, 
  id_asignatura uuid NOT NULL,
  CONSTRAINT FK_encuesta_id_tipo_pregunta
    FOREIGN KEY (id_tipo_pregunta)
      REFERENCES tipo_pregunta(id),
  CONSTRAINT FK_encuesta_id_asignatura
    FOREIGN KEY (id_asignatura)
      REFERENCES asignaturas(id)
);

CREATE TABLE evaluacion (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY NOT NULL,
  id_pregunta uuid NOT NULL,
  id_usuario uuid NOT NULL,
  respuesta int NOT NULL,
  CONSTRAINT FK_respuestas_id_pregunta
    FOREIGN KEY (id_pregunta)
      REFERENCES preguntas(id),
      
  CONSTRAINT FK_respuestas_id_usuario
    FOREIGN KEY (id_usuario)
      REFERENCES usuarios(id)
);

CREATE TABLE comentarios (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY NOT NULL,
  id_usuario uuid NOT NULL,
  id_asignatura uuid NOT NULL,
  reputacion int NOT NULL DEFAULT 0,
  fecha TIMESTAMPTZ DEFAULT now() NOT NULL,
  texto varchar(250) NOT NULL,
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
  id uuid PRIMARY KEY NOT NULL,
  id_asignatura uuid NOT NULL,
  id_pregunta uuid NOT NULL,
  respuesta_calculada int NOT NULL,
  CONSTRAINT FK_respuestas_ponderadas_id_asignatura
    FOREIGN KEY (id_asignatura)
      REFERENCES asignaturas(id)
      ON DELETE CASCADE,
  CONSTRAINT FK_respuestas_ponderadas_id_pregunta
    FOREIGN KEY (id_pregunta)
      REFERENCES preguntas(id)
      ON DELETE CASCADE
);