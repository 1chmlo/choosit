# Choosit!

## ¿Qué es Choosit?

Choosit es una plataforma diseñada específicamente para estudiantes de la carrera de Ingeniería en Informática y Telecomunicaciones de la Universidad Diego Portales (UDP). La plataforma permite a los estudiantes:

- Realizar evaluaciones de los ramos cursados
- Visualizar resúmenes estadísticos informativos sobre cada asignatura
- Consultar métricas clave como nivel de dificultad, carga académica y calidad de la enseñanza
- Acceder a opiniones y experiencias de otros estudiantes para tomar decisiones informadas sobre su planificación académica

El objetivo principal de Choosit es proporcionar información valiosa basada en experiencias reales que ayude a los estudiantes a tomar mejores decisiones en su trayectoria universitaria.

## Instalación del proyecto

Para instalar y ejecutar Choosit en tu máquina local, sigue estos pasos:

1. Clona el repositorio:
   ```bash
   git clone https://github.com/tu-usuario/choosit.git
   cd choosit
   ```

## Instrucciones para ejecutar los servicios

> **Warning**
> Para ejecutar Choosit es necesario tener Docker y Docker Compose instalados en tu sistema.

Para levantar todos los servicios, ejecuta el siguiente comando desde la raíz del proyecto (/choosit):

```bash
docker-compose up --build
```

Este comando construirá las imágenes Docker del cliente y el servidor, ademas de levantar una base de datos postgres.

## Puertos y acceso a los servicios

Una vez iniciados los servicios, podrás acceder a ellos a través de los siguientes puertos:

- **API**: http://localhost:3000
- **Frontend**: http://localhost:5000
- **Visualizador de base de datos**: http://localhost:8080

## Credenciales de la base de datos

Para acceder al visualizador de la base de datos, usa las siguientes credenciales:

- **Servidor**: postgres
- **Usuario**: choosit
- **Contraseña**: choosit
- **Base de datos**: choosit