-- Crear tipos de preguntas
INSERT INTO tipo_pregunta (tipo) VALUES
('proyecto'),
('controles'),
('solemnes'),
('laboratorio'),
('general'),
('electivo');

-- Insertar asignaturas
--1er semestre
INSERT INTO asignaturas (codigo, nombre,semestre,descripcion, n_encuestas, laboratorio, controles, proyecto, electivo) VALUES
('CBQ-1000','Química',1,'Curso que entrega entendimiento de cómo la química modela los fenómenos más importantes de transformaciones de la materia en la naturaleza y la ingeniería, cómo está confirmada la materia a nivel cuántico, y las implicancias de la química en diversos fenómenos como el efecto invernadero, su influencia en la sociedad, entro otros casos reales.',0 , false, true, false, false),
('CBM-1001','Cálculo I',1,'Curso que entrega fundamentos matemáticos para futuros cursos de ingeniería. Aborda funciones, derivadas y aplicaciones en ingeniería y ciencias. Al finalizar podrás resolver inecuaciones, aplicar funciones, analizar límites y continuidad, comprender la derivada y sus aplicaciones, contenidos fundamentales para cuantificar una gran variedad de fenómenos naturales y en ingeniería.',0 , false, true, false, false),
('CIT-1000','Programación',1,'Curso que entrega las herramientas básicas de programación, y desarrollo de los primeros programas. Además, aborda el diseño de soluciones para problemas ingenieriles simples, implementar algoritmos en C++, procesar datos básicos y trabajar en proyectos de procesamiento de datos, documentando sus soluciones.',0 , false, true, false, false),
('CBM-1000','Álgebra y Geometría',1,'Curso en el que se aprende sobre álgebra, geometría y números complejos. Se entregan herramientas para resolver problemas matemáticos aplicados y desarrollar habilidades lógicas y de demostración. Se incluye lógica proposicional, inducción matemática, sumatorias, trigonometría, geometría analítica y números complejos.',0 , false, true, false, false),
('FIC-1000','Comunicación Para La Ingeniería',1,'Curso que mejora la escritura, comprensión lectora y capacidad de redacción de textos. Esencial para poder comunicar ideas con precisión y fortalecer la formación profesional integral.',0 , false, true, false, false),
--2do semestre
('CBM-1003','Cálculo II',2,'Curso enfocado en la resolución de problemas en matemáticas e ingeniería a partir de integrales, por ejemplo: cómo calcular áreas y perímetros, analizar convergencia de integrales y series, y utilizar series de potencias para representar funciones.',0 , false, true, false, false),
('CBF-1000','Mecánica',2,'Curso sobre las leyes que rigen el funcionamiento de las cosas en el mundo físico. Conceptos como fuerza, movimiento, energía y cómo se aplican en la ingeniería. También se realizarán experimentos en laboratorio para ver estos principios en acción.',0 , true, true, false, false),
('CIT-1010','Programación Avanzada',2,'Curso que entrega los conocimientos en programación orientada a objetos y cómo almacenar y gestionar datos de manera eficiente junto con el diseño de programas. Además, cómo funcionan los materiales compuestos y las bases cuantificables y descriptivas de los materiales en general, para aplicarlos al mundo de la ingeniería.',0 , false, true, false, false),
('CBM-1002','Álgebra Lineal',2,'Curso que entrega herramientas matemáticas para la creación de productos y servicios de ingeniería: matrices, sistemas de ecuaciones, espacios vectoriales y transformaciones lineales, valores y vectores propios, entre otros.',0 , false, true, false, false),
--3er semestre
('CBM-1006','Cálculo III',3,'Curso en el que te enfocarás en aplicaciones ingenieriles y económicas. Aprenderás sobre derivación, integración, cálculo de volúmenes, áreas y operadores diferenciales, aplicados a ámbitos relevantes para tu futura carrera.',0 , false, true, false, false),
('CBF-1001','Calor y Ondas',3,'Curso en el que estudiarás fenómenos de calor y ondas desde una perspectiva científica, aplicándolos a la ingeniería. Aprenderás conceptos y a resolver problemas, respaldados por experimentos en laboratorio sobre termodinámica y ondas.',0 , true, true, false, false),
('CIT-2114','Redes de Datos',3,'Curso que se enfoca en la comprensión y diseño de sistemas de telecomunicaciones e internet, esencial para futuros ingenieros en informática y telecomunicaciones. Aprenderás a diseñar redes de datos, evaluar su rendimiento y configurar equipos de comunicación vía internet.',0 , false, true, false, false),
('CBM-1005','Ecuaciones Diferenciales',3,'Curso en el que aprenderás a resolver diferentes tipos de ecuaciones diferenciales, incluyendo las de primer y segundo orden. También estudiarás la transformada de Laplace y cómo aplicar estos conceptos a problemas físicos e ingenieriles.',0 , false, true, false, false),
('CIT-2006','Estructura de Datos y Algoritmos',3,'Curso que se centra en el análisis y diseño de algoritmos, esencial para el rendimiento de videojuegos, realidad virtual, y en general de la mayoría del software que usas en el día a día. Aprenderás a analizar la complejidad, seleccionar estructuras de datos adecuadas y crear algoritmos eficientes para resolver problemas.',0 , true, true, false, false),
--4to semestre
('CIT-2008','Desarrollo web y móvil',4,'Curso que se centra en la programación para el desarrollo de aplicaciones web y móviles, potenciando el trabajo grupal. Aprenderás a utilizar herramientas actuales de desarrollo, tomar decisiones de diseño y resolver problemas de la industria mediante aplicaciones web y móviles.',0 , false, false, true, false),
('CIT-2007','Bases de Datos',4,'Curso enfocado en el diseño, implementación y administración de bases de datos, la principal fuente de información de cualquier sistema informático. Aprenderás a desarrollar bases de datos para problemas de ingeniería, crear consultas SQL, optimizar consultas y documentar su rendimiento.',0 , false, true, true, false),
('CBF-1002','Electricidad y Magnetismo',4,'Curso que te proporcionará una sólida base en electricidad y magnetismo. Aprenderás a entender, resolver problemas, y realizar experimentos relacionados con estos fenómenos. Explorarás conceptos como electrostática, circuitos eléctricos y ondas electromagnéticas.',0 , true, true, false, false),
('CIT-2107','Electrónica y Electrotecnia',4,'Curso en el que aprenderás sobre electrónica y diseño de circuitos con componentes activos y pasivos. Realizarás mediciones, evaluarás el funcionamiento de circuitos en diversas configuraciones y aplicarás técnicas de estimación de potencia y energía en circuitos.',0 , false, true, false, false),
('CIT-2204','Probabilidad y Estadística',4,'Curso que te enseñará la teoría fundamental para analizar datos y desarrollar modelos probabilísticos. Aprenderás a realizar análisis descriptivos, formular y resolver problemas probabilísticos, aplicar pruebas de hipótesis y desarrollar modelos estadísticos basados en datos.',0 , false, true, false, false),
--5to semestre
('CIT-2009','Bases de Datos Avanzadas',5,'Curso que ampliará tu conocimiento en bases de datos, modelando sistemas que reciben millones de reportes por segundo. Aprenderás a administrar bases de datos, considerando la seguridad y privacidad de los datos, y a realizar proyectos relacionados con extracción, transformación y carga de datos, almacenamiento y acceso en entornos distribuidos.',0 , false, true, false, false),
('CIT-2205','Proyectos en TICS I',5,'Curso en el que consolidarás tus conocimientos y habilidades a través de un proyecto grupal que resuelve problemas reales utilizando tecnologías de la información y comunicación. Aprenderás a diseñar e implementar proyectos TIC, comunicar eficazmente el desarrollo de proyectos y trabajar en equipo.',0 , false, false, true, false),
('CIT-2108','Taller de Redes y Servicios',5,'Curso enfocado en la comprensión y aplicación de técnicas de configuración y análisis de redes de computadores e internet. Aprenderás a configurar servidores en la nube, diseñar, medir y configurar sistemas, evaluando su eficiencia y desempeño. Explorarás herramientas y tecnologías de sistemas operativos y redes, obteniendo una visión completa de las plataformas y aplicaciones.',0 , false, false, false, false),
('CII-2750','Optimización',5,'Curso de optimización matemática en el que aprenderás técnicas para resolver problemas de Ingeniería utilizando modelos matemáticos y algoritmos. Desarrollarás habilidades críticas y de modelado esenciales para la práctica de la ingeniería.',0 , false, true, false, false),
--6to semestre
('CIT-2010','Sistemas Operativos',6,'Curso que se centra en los Sistemas Operativos (SO) y abarca aspectos como la administración de recursos, la concurrencia de procesos y la sincronización. También explorarás temas relacionados con la administración del procesador y la memoria. Al final del curso, podrás analizar la eficiencia de los SO y aplicar principios y técnicas en áreas informáticas y computacionales.',0 , false, true, false, false),
('CIT-2110','Señales y Sistemas',6,'Curso en el que explorarás la comprensión y modelado de sistemas de telecomunicaciones. Aprenderás a diseñar sistemas de modulación y filtrado de señales, y a analizar la calidad de la transmisión. Trabajarás, por ejemplo, en radios AM, FM, entre otros.',0 , true, false, false, false),
('CIT-2109','Arquitectura y Organización de Computadores',6,'Curso en el que aprenderás sobre la arquitectura interna de las computadoras y a diseñar sistemas digitales, evaluar su rendimiento y documentar procesos de análisis. Explorarás temas como álgebra de Boole, sistemas numéricos, diseño de sistemas digitales y arquitectura de computadores.',0 , true, true, false, false),
('CII-1000','Contabilidad y Costos',6,'Curso en el que adquirirás habilidades para comprender y utilizar información financiera. Conocerás conceptos contables, construcción de estados financieros y toma de decisiones, desarrollando habilidades analíticas y éticas esenciales para tu desempeño profesional.',0 , false, true, false, false),
--7mo semestre
('CIT-2012','Ingeniería de Software',7,'Curso en el que aprenderás el proceso de concebir, diseñar y evaluar productos de software. Aplicarás métodos para análisis, diseño y comunicación efectiva en proyectos de tecnología de la información.',0 , true, false, false, false),
('CIT2111','Comunicaciones Digitales',7,'Curso enfocado en la transmisión digital y la gestión de errores en telecomunicaciones. Aprenderás a evaluar esquemas de modulación digital, diseñar sistemas basados en teoría de la información, aplicar codificación y medir calidad de enlace.',0 , true, false, false, false),
('CIT-2011','Sistemas Distribuidos',7,'Curso que explora sistemas distribuidos en el contexto de Internet y la Web 2.0. Aprenderás a identificar desafíos, implementar sistemas, analizar problemas de diseño, desarrollar soluciones eficientes y documentar proyectos.',0 , false, false, false, false),
('CIT-2206','Gestión Organizacional',7,'Curso que te enseñará sobre la teoría de sistemas y administración de empresas. Aprenderás a analizar organizaciones, planificar estratégicamente, administrar procesos, diseñar cambios y documentar casos de gestión.',0 , false, true, true, false),
--8vo semestre
('CIT-2207','Evaluación de Proyectos TIC',8,'Curso enfocado en la evaluación económica y de riesgos en proyectos de Tecnologías de la Información y Comunicaciones (TIC). Identificarás actividades para evaluar proyectos, aplicarás diferentes métodos de evaluación técnica y financiera para una toma de decisiones de inversión.',0 , false, true, false, false),
('CIT-2013','Inteligencia Artificial',8,'Curso en el que aprenderás Inteligencia Artificial, abarcando formulación de modelos, resolución de problemas, razonamiento y aprendizaje automático. Aprenderás a comunicar y construir sistemas avanzados.',0 , false, true, false, false),
('CIT-2113','Criptografía y Seguridad en Redes',8,'Curso en el que aprenderás a identificar y solucionar fallas de seguridad en sistemas y redes empresariales. Diseñaras medidas de protección, evaluarás protocolos de seguridad y aplicarás técnicas criptográficas.',0 , true, true, false, false),
('CIT-2112','Tecnologías Inalámbricas',8,'Curso enfocado en comprender y aplicar estándares de comunicación inalámbrica, modelar sistemas inalámbricos, predecir cobertura y evaluar el rendimiento de diferentes tecnologías inalámbricas. Incluye propagación, sistemas celulares y redes inalámbricas.',0 , true, true, false, false),
('CII-2100','Introducción a la Economía',8,'Curso que te introducirá al mundo de la economía. Identificarás problemas económicos, analizarás los efectos de cambios de contextos o políticas, y adquirirás una perspectiva empírica de la economía. Los temas por tratar incluyen demanda, oferta, competencia y macroeconomía, entre otros.',0 , false, true, false, false),
--9no semestre
('CIT-3202','Data Science',9,'Curso enfocado en cómo crear valor y resolver problemas a partir de datos. Diseñarás soluciones, realizarás análisis y visualización de datos, y aplicarás técnicas de ciencia de datos, abarcando matemáticas, estadísticas y proyectos grupales.',0 , false, true, false, false),
('CIT-3000','Arquitectura de Software',9,'Curso en el que podrás aprender a especificar y evolucionar arquitecturas de software de manera sistemática. Aplicarás métodos formales, modelar requisitos y estructuras, comunicar proyectos TIC y trabajar en equipo. Incluye diseño, estilos arquitecturales y propiedades no funcionales.',0 , false, true, false, false),
('CIT-3100','Arquitecturas Emergentes',9,'Curso en el que podrás explorar arquitecturas emergentes en sistemas y redes informáticas. Diseñar y evaluar redes complejas, incluyendo alta disponibilidad, resiliencia y tecnologías como FOG computing.',0 , false, true, false, false),
--10mo semestre
('CIT-3203','Proyecto TICS II',10,'Curso en el que desarrollarás un proyecto real de tecnología de la información y comunicaciones. Aprenderás a planificar, gestionar y evaluar proyectos TI, considerando riesgos, calidad y contratos. Se fomentará el trabajo en equipo y la comunicación efectiva.',0 , false, true, true, false);
--11vo semestre


--CREATE TABLE usuarios (
--  id UUID DEFAULT gen_random_uuid() PRIMARY KEY NOT NULL,
  --nombre varchar(20) NOT NULL,
  --apellido varchar(20) NOT NULL,
  --username varchar(20) UNIQUE NOT NULL,
  --email varchar(100) UNIQUE NOT NULL,
  --contrasena varchar(100) NOT NULL,
  --reputacion int NOT NULL DEFAULT 0,
  --activo bool NOT NULL DEFAULT true,
  --verificado bool NOT NULL DEFAULT false,
  --anio_ingreso int NOT NULL,
  --created_at TIMESTAMPTZ DEFAULT now() NOT NULL
--);
INSERT INTO usuarios (nombre, apellido, username, email, contrasena, anio_ingreso, verificado) VALUES
--contrasena = juanperez99
('Juan', 'Pérez', 'juan.perez', 'juan.perez99@mail.udp.cl', '$2b$10$NU69LPp/A57JL/A.U5Brhuae7nhl6184a4EcVByfFE4Z/qJBJzkuS', 2022, true),
--contrasena = ana.gomez123
('Ana', 'Gómez', 'ana.gomez', 'ana.gomez@mail.udp.cl', '$2b$10$CPKV7v.Wqn8NaCth1xRfreEYMy.LHUPxPV.ggVSqL7USblbBfikH2', 2021, true),
--contrasena = luis.martinez456
('Luis', 'Martínez', 'luis.martinez', 'luis.martinez@mail.udp.cl', '$2b$10$bjyGA8bXGuJKvLzFvrFWvebSJ/Gb7xu3guvPlKHeQJ/BsUZSItcVC', 2020, true);

-- GENERAL
INSERT INTO preguntas (id_tipo_pregunta, pregunta) VALUES
((SELECT id FROM tipo_pregunta WHERE tipo = 'general'), '¿Qué nivel de dificultad general consideras que tuvo la asignatura, donde 1 es muy fácil y 5 muy difícil?'),
((SELECT id FROM tipo_pregunta WHERE tipo = 'general'), '¿Cómo evaluarias en nivel de carga de trabajo general de la asignatura, donde 1 es muy baja y 5 muy alta?');

-- LABORATORIO
INSERT INTO preguntas (id_tipo_pregunta, pregunta) VALUES
((SELECT id FROM tipo_pregunta WHERE tipo = 'laboratorio'), '¿Qué nivel de dificultad tuviste al realizar el laboratorio, donde 1 es muy fácil y 5 muy difícil?'),
((SELECT id FROM tipo_pregunta WHERE tipo = 'laboratorio'), '¿Cómo valorarías el tiempo disponible para completar el laboratorio, donde 1 es muy insuficiente y 5 más que suficiente?'),
((SELECT id FROM tipo_pregunta WHERE tipo = 'laboratorio'), '¿Qué tan útiles fueron los materiales o guías proporcionadas para el laboratorio, donde 1 es nada útiles y 5 muy útiles?'),
((SELECT id FROM tipo_pregunta WHERE tipo = 'laboratorio'), '¿Cómo valorarías las instrucciones dadas para el laboratorio, donde 1 es nada claro y 5 muy claro?'),
((SELECT id FROM tipo_pregunta WHERE tipo = 'laboratorio'), '¿Qué tan satisfecho/a estás con el resultado que obtuviste en el laboratorio, donde 1 es nada satisfactorio y 5 muy satisfactorio?');

-- CONTROLES
INSERT INTO preguntas (id_tipo_pregunta, pregunta) VALUES
((SELECT id FROM tipo_pregunta WHERE tipo = 'controles'), '¿Qué nivel de dificultad tuviste al realizar los controles, donde 1 es muy fácil y 5 muy difícil?'),
((SELECT id FROM tipo_pregunta WHERE tipo = 'controles'), '¿Cómo valorarías la claridad de las instrucciones de los controles, donde 1 es muy claro y 5 muy confuso?'),
((SELECT id FROM tipo_pregunta WHERE tipo = 'controles'), '¿Cómo valorarías la preparación previa que recibiste para hacer los controles, donde 1 es nada útil y 5 muy útil?'),
((SELECT id FROM tipo_pregunta WHERE tipo = 'controles'), '¿Qué tan adecuado fue el nivel de dificultad del control respecto a lo enseñado, donde 1 es nada adecuado y 5 muy adecuado?'),
((SELECT id FROM tipo_pregunta WHERE tipo = 'controles'), '¿Cómo valorarías la relación entre el tiempo disponible y la cantidad de preguntas del control, donde 1 es nada justo y 5 muy justo?');

-- PROYECTO
INSERT INTO preguntas (id_tipo_pregunta, pregunta) VALUES
((SELECT id FROM tipo_pregunta WHERE tipo = 'proyecto'), '¿Cómo calificarías la dificultad del proyecto, donde 1 es muy fácil y 5 muy difícil?'),
((SELECT id FROM tipo_pregunta WHERE tipo = 'proyecto'), '¿Cómo calificarías la claridad de los requisitos del proyecto, donde 1 es muy claro y 5 muy confuso?'),
((SELECT id FROM tipo_pregunta WHERE tipo = 'proyecto'), '¿Qué tan útiles fueron los ejemplos o recursos entregados para desarrollar el proyecto, donde 1 es nada útiles y 5 muy útiles?'),
((SELECT id FROM tipo_pregunta WHERE tipo = 'proyecto'), '¿Qué tan exigente es el proyecto que el curso exige? Donde 1 es muy poco exigente, y 5 es muy exigente'),
((SELECT id FROM tipo_pregunta WHERE tipo = 'proyecto'), '¿Qué tan realista te pareció la carga de trabajo del proyecto en relación al tiempo disponible, donde 1 es nada realista y 5 muy realista?');



-- Insertar comentarios usando SELECTs para obtener los UUIDs
INSERT INTO comentarios (id_usuario, id_asignatura, texto) VALUES
(
  (SELECT id FROM usuarios WHERE username = 'juan.perez'),
  (SELECT id FROM asignaturas WHERE codigo = 'CBQ-1000'),
  'El profesor explica muy bien.'
),
(
  (SELECT id FROM usuarios WHERE username = 'juan.perez'),
  (SELECT id FROM asignaturas WHERE codigo = 'CIT-1000'),
  'Demasiado material en poco tiempo.'
);

-- Insertar reportes
INSERT INTO reportes_comentarios (id_comentario, id_usuario, motivo) VALUES
(
  (SELECT id FROM comentarios LIMIT 1),
  (SELECT id FROM usuarios WHERE username = 'juan.perez'),
  'Me cae mal juan perez'
)