FROM postgres:15

# Set environment variables
ENV POSTGRES_USER=choosit
ENV POSTGRES_PASSWORD=choosit
ENV POSTGRES_DB=choosit

# Copy initialization scripts
COPY init.sql /docker-entrypoint-initdb.d/01-init.sql
COPY seed.sql /docker-entrypoint-initdb.d/02-seed.sql

# Expose PostgreSQL port
EXPOSE 5432