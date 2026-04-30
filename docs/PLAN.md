# Plan Maestro de Desarrollo — SMP Offline-First

---

## 1. Objetivo del sistema

Desarrollar una aplicación web offline-first para la captura, almacenamiento, sincronización y generación de reportes a partir de información operativa registrada mediante formularios.

El sistema deberá:

* Permitir captura de datos sin conexión a internet
* Guardar información en una base de datos local (SQLite)
* Sincronizar datos con una base central (PostgreSQL)
* Evitar duplicidad y pérdida de información
* Ser modular, escalable y replicable para otras empresas

---

## 2. Principios arquitectónicos

* Offline-first / local-first
* Fuente central en la nube
* Modularidad
* Escalabilidad funcional
* Trazabilidad completa
* Control de concurrencia mediante bloqueo de registros
* Separación de ambientes (dev, staging, prod)
* Seguridad desde el diseño
* Replicabilidad del sistema

---

## 3. Stack tecnológico

Frontend:

* Next.js
* TypeScript
* TailwindCSS
* TanStack Query
* TanStack Table

Base de datos local:

* SQLite

Sincronización:

* PowerSync

Backend:

* Supabase (PostgreSQL + Auth + Functions)

Deploy:

* Vercel

---

## 4. Arquitectura general

Flujo:

Usuario → Web App → SQLite (local) → Sync → PostgreSQL (nube) → Backend

Reglas:

* Toda escritura ocurre primero en local
* Posteriormente se sincroniza con la nube
* La nube es la fuente compartida

---

## 5. Flujo offline-first y sincronización

* Escritura local primero
* Uso de UUID como clave primaria
* Estados de sincronización:

  * pending_create
  * pending_update
  * pending_delete
  * synced
  * sync_error
* Eliminación lógica de registros
* Cola de cambios local
* Manejo de errores de sincronización

---

## 6. Ambientes

* Development
* Staging
* Production

Regla:

Nunca desarrollar directamente sobre producción.

---

## 7. Estructura del proyecto

Monorepo:

apps/web
packages/ui
packages/db
packages/sync
packages/types
supabase/
docs/

---

## 8. Modelo de datos base

Tablas principales:

* users
* forms
* form_fields
* records
* record_values
* record_locks
* audit_logs

Campos base:

* id (uuid)
* company_id (opcional para futuro multiempresa)
* created_at
* updated_at
* created_by
* updated_by
* is_deleted
* deleted_at
* deleted_by

Campos de sincronización:

* sync_status
* last_synced_at
* version

Campos de bloqueo:

* locked_by
* locked_at
* lock_expires_at

---

## 8.7 Estrategia de formularios

Modelo híbrido:

* Formularios definidos por código
* Renderizados dinámicamente
* Posibilidad de usar componentes personalizados

Se utilizará:

* Modelo dinámico (records / record_values)
* Tablas específicas para casos críticos

---

## 9. Módulos funcionales iniciales

* Autenticación
* Formularios
* Registros (CRUD)
* Sincronización
* Reportes
* Bloqueo de registros
* Auditoría

---

## 10. Sistema de formularios

* Definición por código
* Render dinámico
* Validación con Zod
* Soporte para componentes personalizados
* Guardado local + sincronización

---

## 11. Reportes

* Tablas con filtros y búsqueda
* Exportación a Excel
* Exportación a PDF (fase posterior)
* Dashboards en fases futuras

---

## 12. Seguridad

* Autenticación con Supabase
* Roles básicos (admin, editor, viewer)
* Row Level Security (RLS)
* Validación en frontend y backend
* Manejo seguro de variables

---

## 13. Estrategia de pruebas

* Pruebas unitarias
* Pruebas de integración
* Pruebas end-to-end

Prueba crítica:

* Crear registro offline
* Recuperar conexión
* Sincronizar correctamente
* Validar ausencia de duplicados

---

## 14. Roadmap

Fase 0 — Setup
Fase 1 — POC offline-first
Fase 2 — Sistema base funcional
Fase 3 — Robustez operativa
Fase 4 — Reportes y exportación
Fase 5 — Escalabilidad

Regla:

No avanzar sin validar completamente la fase anterior.

---

## 15. Instrucciones iniciales para desarrollo

Objetivo inmediato:

Construir un POC que permita:

* Crear un formulario simple
* Guardar datos en SQLite
* Sincronizar con PostgreSQL
* Mostrar datos en tabla
* Validar operación offline/online

Regla crítica:

No avanzar hasta validar completamente el flujo de sincronización.
