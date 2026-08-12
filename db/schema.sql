-- ============================================
-- SYSCLIMA-WEB | Esquema MySQL
-- Importar en el hosting desde phpMyAdmin o:
--   mysql -u usuario -p sysclima < db/schema.sql
-- En desarrollo Docker se carga automáticamente al
-- primer arranque del contenedor db.
-- ============================================

CREATE DATABASE IF NOT EXISTS sysclima
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE sysclima;

CREATE TABLE IF NOT EXISTS mensajes (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(150) NOT NULL,
  email VARCHAR(255) NOT NULL,
  mensaje TEXT NOT NULL,
  fecha TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;
