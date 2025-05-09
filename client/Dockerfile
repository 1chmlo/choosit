FROM node:20-alpine

# Establecer directorio de trabajo
WORKDIR /app

# Copiar dependencias y luego instalar
COPY package*.json ./
RUN npm install

# Copiar el resto del código
COPY . .

# Exponer el puerto por defecto de React
EXPOSE 3000

# Comando por defecto
CMD ["npm", "start"]
