-- Insertar asignaturas
--1er semestre
INSERT INTO asignaturas (codigo, nombre,semestre,descripcion, n_encuestas, lab, controles, proyecto, cfg) VALUES
('CBQ1000','Química',1,'Curso que entrega entendimiento de cómo la química modela los fenómenos más importantes de transformaciones de la materia en la naturaleza y la ingeniería, cómo está confirmada la materia a nivel cuántico, y las implicancias de la química en diversos fenómenos como el efecto invernadero, su influencia en la sociedad, entro otros casos reales.',0 , false, true, false, false),
('CBM1001','Cálculo I',1,'Curso que entrega fundamentos matemáticos para futuros cursos de ingeniería. Aborda funciones, derivadas y aplicaciones en ingeniería y ciencias. Al finalizar podrás resolver inecuaciones, aplicar funciones, analizar límites y continuidad, comprender la derivada y sus aplicaciones, contenidos fundamentales para cuantificar una gran variedad de fenómenos naturales y en ingeniería.',0 , false, true, false, false),
('CIT1000','Programación',1,'Curso que entrega las herramientas básicas de programación, y desarrollo de los primeros programas. Además, aborda el diseño de soluciones para problemas ingenieriles simples, implementar algoritmos en C++, procesar datos básicos y trabajar en proyectos de procesamiento de datos, documentando sus soluciones.',0 , false, true, false, false),
('CBM-1000','Álgebra y Geometría',1,'Curso en el que se aprende sobre álgebra, geometría y números complejos. Se entregan herramientas para resolver problemas matemáticos aplicados y desarrollar habilidades lógicas y de demostración. Se incluye lógica proposicional, inducción matemática, sumatorias, trigonometría, geometría analítica y números complejos.',0 , false, true, false, false),
('FIC-1000','Comunicación Para La Ingeniería',1,'Curso que mejora la escritura, comprensión lectora y capacidad de redacción de textos. Esencial para poder comunicar ideas con precisión y fortalecer la formación profesional integral.',0 , false, true, false, false),
--2do semestre
('CBM-1003','Cálculo II',2,'Curso enfocado en la resolución de problemas en matemáticas e ingeniería a partir de integrales, por ejemplo: cómo calcular áreas y perímetros, analizar convergencia de integrales y series, y utilizar series de potencias para representar funciones.',0 , false, true, false, false),
('CBF-1000','Mecánica',2,'Curso sobre las leyes que rigen el funcionamiento de las cosas en el mundo físico. Conceptos como fuerza, movimiento, energía y cómo se aplican en la ingeniería. También se realizarán experimentos en laboratorio para ver estos principios en acción.',0 , false, true, false, false),
('CIT-1010','Programación Avanzada',2,'Curso que entrega los conocimientos en programación orientada a objetos y cómo almacenar y gestionar datos de manera eficiente junto con el diseño de programas. Además, cómo funcionan los materiales compuestos y las bases cuantificables y descriptivas de los materiales en general, para aplicarlos al mundo de la ingeniería.',0 , false, true, false, false),
('CBM-1002','Álgebra Lineal',2,'Curso que entrega herramientas matemáticas para la creación de productos y servicios de ingeniería: matrices, sistemas de ecuaciones, espacios vectoriales y transformaciones lineales, valores y vectores propios, entre otros.',0 , false, true, false, false),
--3er semestre
('CBM-1006','Cálculo III',3,'Curso en el que te enfocarás en aplicaciones ingenieriles y económicas. Aprenderás sobre derivación, integración, cálculo de volúmenes, áreas y operadores diferenciales, aplicados a ámbitos relevantes para tu futura carrera.',0 , false, true, false, false),
('CBF-1001','Calor y Ondas',3,'Curso en el que estudiarás fenómenos de calor y ondas desde una perspectiva científica, aplicándolos a la ingeniería. Aprenderás conceptos y a resolver problemas, respaldados por experimentos en laboratorio sobre termodinámica y ondas.',0 , false, true, false, false),
('CIT-2114','Redes de Datos',3,'Curso que se enfoca en la comprensión y diseño de sistemas de telecomunicaciones e internet, esencial para futuros ingenieros en informática y telecomunicaciones. Aprenderás a diseñar redes de datos, evaluar su rendimiento y configurar equipos de comunicación vía internet.',0 , false, true, false, false),
('CBM-1005','Ecuaciones Diferenciales',3,'Curso en el que aprenderás a resolver diferentes tipos de ecuaciones diferenciales, incluyendo las de primer y segundo orden. También estudiarás la transformada de Laplace y cómo aplicar estos conceptos a problemas físicos e ingenieriles.',0 , false, true, false, false),
('CIT-2006','Estructura de Datos y Algoritmos',3,'Curso que se centra en el análisis y diseño de algoritmos, esencial para el rendimiento de videojuegos, realidad virtual, y en general de la mayoría del software que usas en el día a día. Aprenderás a analizar la complejidad, seleccionar estructuras de datos adecuadas y crear algoritmos eficientes para resolver problemas.',0 , false, true, false, false),
--4to semestre
('CIT-2008','Desarrollo web y móvil',4,'Curso que se centra en la programación para el desarrollo de aplicaciones web y móviles, potenciando el trabajo grupal. Aprenderás a utilizar herramientas actuales de desarrollo, tomar decisiones de diseño y resolver problemas de la industria mediante aplicaciones web y móviles.',0 , false, true, false, false),
('CIT-2007','Bases de Datos',4,'Curso enfocado en el diseño, implementación y administración de bases de datos, la principal fuente de información de cualquier sistema informático. Aprenderás a desarrollar bases de datos para problemas de ingeniería, crear consultas SQL, optimizar consultas y documentar su rendimiento.',0 , false, true, false, false),
('CBF-1002','Electricidad y Magnetismo',4,'Curso que te proporcionará una sólida base en electricidad y magnetismo. Aprenderás a entender, resolver problemas, y realizar experimentos relacionados con estos fenómenos. Explorarás conceptos como electrostática, circuitos eléctricos y ondas electromagnéticas.',0 , false, true, false, false),
('CIT-2107','Electrónica y Electrotecnia',4,'Curso en el que aprenderás sobre electrónica y diseño de circuitos con componentes activos y pasivos. Realizarás mediciones, evaluarás el funcionamiento de circuitos en diversas configuraciones y aplicarás técnicas de estimación de potencia y energía en circuitos.',0 , false, true, false, false),
('CIT-2204','Probabilidad y Estadística',4,'Curso que te enseñará la teoría fundamental para analizar datos y desarrollar modelos probabilísticos. Aprenderás a realizar análisis descriptivos, formular y resolver problemas probabilísticos, aplicar pruebas de hipótesis y desarrollar modelos estadísticos basados en datos.',0 , false, true, false, false),
--5to semestre
('CIT-2009','Bases de Datos Avanzadas',5,'Curso que ampliará tu conocimiento en bases de datos, modelando sistemas que reciben millones de reportes por segundo. Aprenderás a administrar bases de datos, considerando la seguridad y privacidad de los datos, y a realizar proyectos relacionados con extracción, transformación y carga de datos, almacenamiento y acceso en entornos distribuidos.',0 , false, true, false, false),
('CIT-2205','Proyectos en TICS I',5,'Curso en el que consolidarás tus conocimientos y habilidades a través de un proyecto grupal que resuelve problemas reales utilizando tecnologías de la información y comunicación. Aprenderás a diseñar e implementar proyectos TIC, comunicar eficazmente el desarrollo de proyectos y trabajar en equipo.',0 , false, true, false, false),
('CIT-2108','Taller de Redes y Servicios',5,'Curso enfocado en la comprensión y aplicación de técnicas de configuración y análisis de redes de computadores e internet. Aprenderás a configurar servidores en la nube, diseñar, medir y configurar sistemas, evaluando su eficiencia y desempeño. Explorarás herramientas y tecnologías de sistemas operativos y redes, obteniendo una visión completa de las plataformas y aplicaciones.',0 , false, true, false, false),
('CII-2750','Optimización',5,'Curso de optimización matemática en el que aprenderás técnicas para resolver problemas de Ingeniería utilizando modelos matemáticos y algoritmos. Desarrollarás habilidades críticas y de modelado esenciales para la práctica de la ingeniería.',0 , false, true, false, false),
--6to semestre
('CIT-2010','Sistemas Operativos',6,'Curso que se centra en los Sistemas Operativos (SO) y abarca aspectos como la administración de recursos, la concurrencia de procesos y la sincronización. También explorarás temas relacionados con la administración del procesador y la memoria. Al final del curso, podrás analizar la eficiencia de los SO y aplicar principios y técnicas en áreas informáticas y computacionales.',0 , false, true, false, false),
('CIT-2110','Señales y Sistemas',6,'Curso en el que explorarás la comprensión y modelado de sistemas de telecomunicaciones. Aprenderás a diseñar sistemas de modulación y filtrado de señales, y a analizar la calidad de la transmisión. Trabajarás, por ejemplo, en radios AM, FM, entre otros.',0 , false, true, false, false),
('CIT-2109','Arquitectura y Organización de Computadores',6,'Curso en el que aprenderás sobre la arquitectura interna de las computadoras y a diseñar sistemas digitales, evaluar su rendimiento y documentar procesos de análisis. Explorarás temas como álgebra de Boole, sistemas numéricos, diseño de sistemas digitales y arquitectura de computadores.',0 , false, true, false, false),
('CII-1000','Contabilidad y Costos',6,'Curso en el que adquirirás habilidades para comprender y utilizar información financiera. Conocerás conceptos contables, construcción de estados financieros y toma de decisiones, desarrollando habilidades analíticas y éticas esenciales para tu desempeño profesional.',0 , false, true, false, false),
--7mo semestre
('CIT-2012','Ingeniería de Software',7,'Curso en el que aprenderás el proceso de concebir, diseñar y evaluar productos de software. Aplicarás métodos para análisis, diseño y comunicación efectiva en proyectos de tecnología de la información.',0 , false, true, false, false),
('CIT2111','Comunicaciones Digitales',7,'Curso enfocado en la transmisión digital y la gestión de errores en telecomunicaciones. Aprenderás a evaluar esquemas de modulación digital, diseñar sistemas basados en teoría de la información, aplicar codificación y medir calidad de enlace.',0 , false, true, false, false),
('CIT-2011','Sistemas Distribuidos',7,'Curso que explora sistemas distribuidos en el contexto de Internet y la Web 2.0. Aprenderás a identificar desafíos, implementar sistemas, analizar problemas de diseño, desarrollar soluciones eficientes y documentar proyectos.',0 , false, true, false, false),
('CIT-2206','Gestión Organizacional',7,'Curso que te enseñará sobre la teoría de sistemas y administración de empresas. Aprenderás a analizar organizaciones, planificar estratégicamente, administrar procesos, diseñar cambios y documentar casos de gestión.',0 , false, true, false, false),
--8vo semestre
('CIT-2207','Evaluación de Proyectos TIC',8,'Curso enfocado en la evaluación económica y de riesgos en proyectos de Tecnologías de la Información y Comunicaciones (TIC). Identificarás actividades para evaluar proyectos, aplicarás diferentes métodos de evaluación técnica y financiera para una toma de decisiones de inversión.',0 , false, true, false, false),
('CIT-2013','Inteligencia Artificial',8,'Curso en el que aprenderás Inteligencia Artificial, abarcando formulación de modelos, resolución de problemas, razonamiento y aprendizaje automático. Aprenderás a comunicar y construir sistemas avanzados.',0 , false, true, false, false),
('CIT-2113','Criptografía y Seguridad en Redes',8,'Curso en el que aprenderás a identificar y solucionar fallas de seguridad en sistemas y redes empresariales. Diseñaras medidas de protección, evaluarás protocolos de seguridad y aplicarás técnicas criptográficas.',0 , false, true, false, false),
('CIT-2112','Tecnologías Inalámbricas',8,'Curso enfocado en comprender y aplicar estándares de comunicación inalámbrica, modelar sistemas inalámbricos, predecir cobertura y evaluar el rendimiento de diferentes tecnologías inalámbricas. Incluye propagación, sistemas celulares y redes inalámbricas.',0 , false, true, false, false),
('CII-2100','Introducción a la Economía',8,'Curso que te introducirá al mundo de la economía. Identificarás problemas económicos, analizarás los efectos de cambios de contextos o políticas, y adquirirás una perspectiva empírica de la economía. Los temas por tratar incluyen demanda, oferta, competencia y macroeconomía, entre otros.',0 , false, true, false, false),
--9no semestre
('CIT-3202','Data Science',9,'Curso enfocado en cómo crear valor y resolver problemas a partir de datos. Diseñarás soluciones, realizarás análisis y visualización de datos, y aplicarás técnicas de ciencia de datos, abarcando matemáticas, estadísticas y proyectos grupales.',0 , false, true, false, false),
('CIT-3000','Arquitectura de Software',9,'Curso en el que podrás aprender a especificar y evolucionar arquitecturas de software de manera sistemática. Aplicarás métodos formales, modelar requisitos y estructuras, comunicar proyectos TIC y trabajar en equipo. Incluye diseño, estilos arquitecturales y propiedades no funcionales.',0 , false, true, false, false),
('CIT-3100','Arquitecturas Emergentes',9,'Curso en el que podrás explorar arquitecturas emergentes en sistemas y redes informáticas. Diseñar y evaluar redes complejas, incluyendo alta disponibilidad, resiliencia y tecnologías como FOG computing.',0 , false, true, false, false),
--10mo semestre
('CIT3203','Proyecto TICS II',10,'Curso en el que desarrollarás un proyecto real de tecnología de la información y comunicaciones. Aprenderás a planificar, gestionar y evaluar proyectos TI, considerando riesgos, calidad y contratos. Se fomentará el trabajo en equipo y la comunicación efectiva.',0 , false, true, false, false);
--11vo semestre


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