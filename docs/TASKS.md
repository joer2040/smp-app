# TASKS - SMP Offline-First

## Fase 0 - Setup del proyecto

- [x] Validar entorno local
- [x] Inicializar monorepo con pnpm workspaces
- [x] Crear app Next.js en apps/web
- [x] Configurar TypeScript
- [x] Configurar TailwindCSS
- [x] Configurar ESLint
- [x] Crear estructura base de carpetas
- [x] Validar ejecucion local
- [x] Crear primer commit

## Task 02 - Base module structure

- [x] Crear estructura `apps/web/src`
- [x] Crear carpetas base para components, lib, hooks y types
- [x] Verificar paquetes `ui`, `types`, `db` y `sync`
- [x] Agregar placeholders sin logica de negocio

## Task 03 - Basic form engine

- [x] Crear definicion config-driven para formulario de gastos
- [x] Crear renderer de formularios con estado local
- [x] Validar campos requeridos sin persistencia
- [x] Mostrar JSON enviado en pantalla

## Task 04 - Temporary local persistence

- [x] Crear utilidad de almacenamiento con localStorage
- [x] Guardar registros por formId
- [x] Cargar registros al abrir formulario
- [x] Mostrar registros guardados en pantalla

## Task 05 - Record model for local persistence

- [x] Crear modelo `AppRecord`
- [x] Guardar valores dentro de `values`
- [x] Agregar metadata `id`, `createdAt`, `updatedAt` y `syncStatus`
- [x] Mantener persistencia por `formId`

## Task 06 - Normalize form values

- [x] Normalizar valores por tipo de campo antes de guardar
- [x] Convertir `number` a numero
- [x] Mantener `text` y `date` como string
- [x] Guardar numeros invalidos como `null`

## Task 07 - Saved records table

- [x] Crear tabla simple para registros guardados
- [x] Mostrar fecha de creacion, estado sync y valores principales
- [x] Reemplazar JSON guardado por tabla legible

## Task 08 - Local record editing

- [x] Agregar actualizacion de registros en localStorage
- [x] Agregar accion Edit en tabla
- [x] Cargar valores existentes en el formulario
- [x] Actualizar registro conservando `id` y `createdAt`
- [x] Marcar registros editados como `pending_update`

## Task 09 - Local logical deletion

- [x] Agregar metadata de borrado logico
- [x] Marcar registros como eliminados sin removerlos
- [x] Agregar accion Delete en tabla
- [x] Ocultar registros eliminados de la vista principal

## Task 10 - Toggle deleted records

- [x] Agregar toggle para mostrar registros eliminados
- [x] Agregar columna `Deleted`
- [x] Marcar registros eliminados como `Yes`
- [x] Mantener registros eliminados ocultos por defecto

## Task 11 - Pending sync selector

- [x] Crear selector de registros pendientes de sync
- [x] Filtrar pendientes por `formId`
- [x] Agregar selector opcional por `syncStatus`
- [x] Mostrar contador `Pending Sync`

## Task 12 - Simulated sync

- [x] Agregar simulacion de sync local
- [x] Marcar registros pendientes como `synced`
- [x] Agregar boton `Sync Now`
- [x] Refrescar contador de pendientes tras sync

## Task 13 - Sync contract

- [x] Definir `SyncRequest`
- [x] Definir `SyncResponse`
- [x] Documentar reglas create/update/delete
- [x] Documentar manejo de fallos por registro

## Task 14 - Simulated sync failures

- [x] Agregar `syncError` en `AppRecord`
- [x] Persistir errores simulados de sync
- [x] Mostrar columna `Sync Error`
- [x] Agregar accion `Simulate Sync Error`

## Task 15 - Supabase client config

- [x] Instalar `@supabase/supabase-js`
- [x] Crear cliente browser de Supabase
- [x] Validar variables publicas de entorno
- [x] Mostrar estado de configuracion en `/forms/expense`

## Task 16 - Supabase records migration

- [x] Crear migracion inicial para `public.records`
- [x] Definir columnas para `AppRecord`
- [x] Agregar constraint para `sync_status`
- [x] Agregar indices base
- [x] Habilitar RLS sin politicas

## Task 18 - Insert pending creates

- [x] Crear helper para insertar `pending_create`
- [x] Enviar solo altas pendientes
- [x] Manejar errores sin cambiar estado local
- [x] Agregar boton `Send Pending Creates`

## Task 20 - Mark inserted creates as synced

- [x] Marcar registros insertados correctamente como `synced`
- [x] Mantener fallidos como `pending_create`
- [x] Refrescar lista y contador despues de enviar creates

## Task 21 - Sync pending updates

- [x] Enviar registros `pending_update` a Supabase
- [x] Marcar updates exitosos como `synced`
- [x] Mantener updates fallidos como `pending_update`
- [x] Agregar boton `Send Pending Updates`

## Task 22 - Sync pending deletes

- [x] Enviar registros `pending_delete` a Supabase como borrado logico
- [x] Marcar deletes exitosos como `synced`
- [x] Mantener deletes fallidos como `pending_delete`
- [x] Agregar boton `Send Pending Deletes`

## Task 23 - Sync all

- [x] Crear orquestador `syncAll`
- [x] Sincronizar creates, updates y deletes en orden seguro
- [x] Agregar boton `Sync All`
- [x] Mantener botones individuales

## Task 24 - Retry sync errors by action

- [x] Agregar `syncAction` al modelo local
- [x] Asignar accion en create, update y delete
- [x] Reintentar `sync_error` segun `syncAction`
- [x] Limpiar `syncAction` despues de sync exitoso
- [x] Mostrar columna `Sync Action`

## Task 25 - IndexedDB local persistence

- [x] Instalar `idb`
- [x] Crear base IndexedDB `smp-offline-db`
- [x] Crear object store `records` con indices base
- [x] Migrar persistencia local de registros a IndexedDB
- [x] Mantener aislamiento local por usuario
- [x] Dejar keys antiguas de localStorage sin migracion automatica

## Task 26 - Auth foundation and auth RLS

- [x] Agregar pagina `/login` con login y sign up
- [x] Reutilizar cliente Supabase del browser
- [x] Mostrar sesion y logout en `/forms/expense`
- [x] Crear migracion para reemplazar policies POC por auth-only
- [x] Enviar `created_by` y `updated_by` en sync cuando hay usuario

## Task 27 - Owner-based records RLS

- [x] Crear migracion RLS por owner usando `created_by`
- [x] Remover policies authenticated globales
- [x] Permitir select, insert y update solo si `auth.uid() = created_by`
- [x] Mantener sin policy de delete fisico

## Task 28 - User-scoped local storage

- [x] Cambiar keys locales a `smp:forms:{userId}:{formId}`
- [x] Ignorar keys antiguas sin `userId`
- [x] Pasar `userId` a operaciones locales y sync
- [x] Bloquear gestion de registros sin login
- [x] Mantener registros locales separados por usuario

## Task 29 - Zero affected sync failures

- [x] Validar fila afectada al sincronizar updates
- [x] Validar fila afectada al sincronizar deletes
- [x] Marcar update/delete sin fila remota como `sync_error`
- [x] Mantener visible `syncError` en la tabla existente
- [x] Conservar RLS, schema y formato de localStorage sin cambios

## Task 30 - Offline-first architecture documentation

- [x] Crear `docs/ARCHITECTURE.md`
- [x] Documentar modelo de datos local y remoto
- [x] Documentar IndexedDB y aislamiento por usuario
- [x] Documentar sync engine, retry y errores
- [x] Documentar Supabase, RLS y limitaciones conocidas

## Task 31 - Advanced architecture refinement

- [x] Documentar Supabase como source of truth e IndexedDB como replica local
- [x] Agregar modelo de consistencia eventual
- [x] Explicar orden de sync y estrategia de retry
- [x] Documentar manejo de 0 filas afectadas
- [x] Documentar comportamiento actual de conflictos y mejoras futuras

## Task 32 - Version conflict detection

- [x] Agregar `conflict` a `SyncStatus`
- [x] Guardar `remoteVersion` en registros locales
- [x] Usar optimistic concurrency en updates por `version`
- [x] Marcar conflictos de version como `conflict`
- [x] Evitar retry automatico de conflictos en `Sync All`

## Task 33 - Conflict records UI

- [x] Resaltar registros en `conflict` dentro de la tabla
- [x] Mostrar badge `Conflict` separado de `sync_error`
- [x] Mostrar mensaje claro de conflicto y `syncError`
- [x] Mostrar `remoteVersion` y version local cuando exista
- [x] Agregar filtro `Show conflicts only`
- [x] Mantener sin resolucion, merge ni retry automatico de conflictos

## Task 34 - Basic conflict resolution actions

- [x] Mostrar acciones `Use my version` y `Use remote version` en conflictos
- [x] Permitir sobrescribir remoto usando la version local contra `remoteVersion`
- [x] Permitir reemplazar valores locales con la version remota
- [x] Limpiar `syncStatus`, `syncAction` y `syncError` al resolver
- [x] Mantener sin auto-resolucion, merge ni cambios de schema

## Task 35 - Controlled background sync

- [x] Crear hook `useBackgroundSync`
- [x] Escuchar eventos `online` y `offline`
- [x] Ejecutar `syncAll` al recuperar conectividad si hay pendientes
- [x] Evitar ejecuciones duplicadas con `isSyncing`
- [x] Agregar delay de 500ms antes de sincronizar
- [x] Mostrar estado `Syncing`, `Synced` o `Sync failed` en la UI
- [x] Mantener conflictos fuera del retry automatico

## Task 36 - Reusable template preparation

- [x] Actualizar README con setup, Supabase, migraciones y uso como template
- [x] Crear `docs/TEMPLATE_STRATEGY.md`
- [x] Crear `.env.example` sin secretos
- [x] Verificar `.gitignore` para env, dependencias, build artifacts y `supabase/.temp`
- [x] Referenciar docs principales del template
- [x] Mantener sin cambios de comportamiento ni schema

## Fase 1 - POC Offline-First

- [x] Crear formulario simple por codigo
- [x] Guardar datos localmente
- [x] Mostrar registros en tabla
- [x] Integrar Supabase PostgreSQL
- [x] Integrar sincronizacion
- [x] Probar modo offline/online
- [x] Validar que no existan duplicados en el flujo E2E probado

Evidencia: `docs/VALIDATION_TASK03_E2E.md`.

Nota: queda recomendada una prueba dedicada de idempotencia para doble click, retry repetido y re-sync manual.
