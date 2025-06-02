CREATE EXTENSION IF NOT EXISTS unaccent;

CREATE TABLE usuarios (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY NOT NULL,
  nombre varchar(20),
  apellido varchar(20),
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
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY NOT NULL,
  tipo varchar(50) NOT NULL UNIQUE
);

CREATE TABLE preguntas (
  id uuid PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
  id_tipo_pregunta uuid NOT NULL,
  pregunta varchar(500) NOT NULL,
  CONSTRAINT FK_pregunta_id_tipo
    FOREIGN KEY (id_tipo_pregunta)
      REFERENCES tipo_pregunta(id)
      ON DELETE CASCADE
);

CREATE TABLE encuestas (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY NOT NULL,
  id_tipo_pregunta uuid NOT NULL, 
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
  id_asignatura uuid NOT NULL,
  id_usuario uuid NOT NULL,
  respuesta int NOT NULL,
  CONSTRAINT FK_respuestas_id_pregunta
    FOREIGN KEY (id_pregunta)
      REFERENCES preguntas(id),
      
  CONSTRAINT FK_respuestas_id_usuario
    FOREIGN KEY (id_usuario)
      REFERENCES usuarios(id),

  CONSTRAINT FK_respuestas_id_asignatura
    FOREIGN KEY (id_asignatura)
      REFERENCES asignaturas(id),
  
  CONSTRAINT respuesta_unica
    UNIQUE (id_pregunta, id_asignatura, id_usuario)
);

CREATE TABLE comentarios (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY NOT NULL,
  id_usuario uuid NOT NULL,
  id_asignatura uuid NOT NULL,
  reputacion int NOT NULL DEFAULT 0,
  fecha TIMESTAMPTZ DEFAULT now() NOT NULL,
  texto varchar(250) NOT NULL,
  likes_usuarios UUID[] DEFAULT '{}',
  CONSTRAINT FK_comentario_id_usuario
    FOREIGN KEY (id_usuario)
      REFERENCES usuarios(id)
      ON DELETE CASCADE,
  CONSTRAINT FK_comentario_id_asignatura
    FOREIGN KEY (id_asignatura)
      REFERENCES asignaturas(id)
      ON DELETE CASCADE
);

CREATE TABLE reportes_comentarios (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY NOT NULL,
  id_comentario uuid NOT NULL,
  id_usuario uuid NOT NULL,
  fecha TIMESTAMPTZ DEFAULT now() NOT NULL,
  motivo varchar(500) NOT NULL,
  CONSTRAINT FK_reporte_id_comentario
    FOREIGN KEY (id_comentario)
      REFERENCES comentarios(id)
      ON DELETE CASCADE,
  CONSTRAINT FK_reporte_id_usuario
    FOREIGN KEY (id_usuario)
      REFERENCES usuarios(id)
      ON DELETE CASCADE
);

CREATE TABLE respuestas_ponderadas (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY NOT NULL,
  id_asignatura uuid NOT NULL,
  id_pregunta uuid NOT NULL,
  respuesta_calculada numeric NOT NULL,
  CONSTRAINT FK_respuestas_ponderadas_id_asignatura
    FOREIGN KEY (id_asignatura)
      REFERENCES asignaturas(id)
      ON DELETE CASCADE,
  CONSTRAINT FK_respuestas_ponderadas_id_pregunta
    FOREIGN KEY (id_pregunta)
      REFERENCES preguntas(id)
      ON DELETE CASCADE,
  CONSTRAINT uniq_asig_preg
    UNIQUE (id_asignatura, id_pregunta)
);

--  Funcion para trigger
CREATE OR REPLACE FUNCTION recalcular_ponderaciones()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
  new_promedio numeric;
BEGIN
  --  Se calcula nuevo promedio
  SELECT COALESCE(AVG(e.respuesta), 0) INTO new_promedio
  FROM evaluacion e
  WHERE e.id_asignatura = NEW.id_asignatura
  AND e.id_pregunta = NEW.id_pregunta;
  --  Inserta en respuestas ponderadas, en caso de ya existir se actualiza
  INSERT INTO respuestas_ponderadas(id_asignatura, id_pregunta, respuesta_calculada)
  VALUES (NEW.id_asignatura, NEW.id_pregunta, new_promedio)
  ON CONFLICT (id_asignatura, id_pregunta)
  DO UPDATE
    SET respuesta_calculada = EXCLUDED.respuesta_calculada;
  
  RETURN NEW;
END;
$$;
--  Trigger
CREATE TRIGGER tr_recalcular_ponderaciones
AFTER INSERT OR UPDATE
ON evaluacion
FOR EACH ROW
EXECUTE FUNCTION recalcular_ponderaciones();

CREATE OR REPLACE FUNCTION insertar_encuestas()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
  col TEXT;
  tipo_id UUID;
BEGIN
  -- Siempre insertar encuesta para tipo 'general'
  SELECT id INTO tipo_id
  FROM tipo_pregunta
  WHERE unaccent(lower(tipo)) = 'general'
  LIMIT 1;

  IF tipo_id IS NOT NULL THEN
    INSERT INTO encuestas (id_asignatura, id_tipo_pregunta)
    VALUES (NEW.id, tipo_id);
  END IF;

  -- Para tipos condicionales (basados en columnas booleanas)
  FOR col IN SELECT unnest(ARRAY['lab', 'controles', 'proyecto', 'cfg']) LOOP
    IF to_jsonb(NEW) ->> col = 'true' THEN
      -- Buscar tipo_pregunta que coincida con el nombre del campo
      SELECT id INTO tipo_id
      FROM tipo_pregunta
      WHERE unaccent(lower(tipo)) = unaccent(lower(col))
      LIMIT 1;

      IF tipo_id IS NOT NULL THEN
        INSERT INTO encuestas (id_asignatura, id_tipo_pregunta)
        VALUES (NEW.id, tipo_id);
      END IF;
    END IF;
  END LOOP;

  RETURN NEW;
END;
$$;

--trigger
CREATE TRIGGER tr_insertar_encuestas
AFTER INSERT ON asignaturas
FOR EACH ROW
EXECUTE FUNCTION insertar_encuestas();
