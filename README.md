# Choosit!

## Instrucciones para ejecutar los servicios

Para levantar todos los servicios, ejecuta el siguiente comando desde la raíz del proyecto:

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