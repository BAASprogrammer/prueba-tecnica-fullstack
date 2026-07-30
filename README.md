# Sistema de Gestión de Solicitudes

Aplicación full-stack para administrar solicitudes de atención de clientes.

## Tecnologías

### Backend
- **Express 5** — Framework HTTP
- **Prisma 5** — ORM con queries raw (`$queryRaw` / `$executeRaw`)
- **PostgreSQL 16** — Base de datos relacional
- **JWT + bcryptjs** — Autenticación
- **Swagger** — Documentación interactiva de API
- **Jest + ts-jest** — Tests unitarios
- **TypeScript 5**

### Frontend
- **React 19** — UI
- **Vite 8** — Build tool
- **Tailwind CSS 4** — Estilos
- **Axios** — HTTP client
- **lucide-react** — Iconos
- **Vitest** — Tests unitarios
- **TypeScript 6**

---

## Cómo instalar

### Requisitos
- Node.js 20+
- PostgreSQL 16 (o Docker)
- npm

### 1. Clonar e instalar dependencias

```bash
git clone https://github.com/BAASprogrammer/prueba-tecnica-fullstack.git
cd prueba-tecnica-fullstack

# Backend
cd backend
cp .env.example .env   # editar DATABASE_URL según tu configuración
npm install
npx prisma migrate deploy
npx ts-node prisma/seed.ts   # o: docker-compose up -d postgres (ejecuta seed.sql automático)

# Frontend
cd ../frontend
npm install
```

### 2. Variables de entorno

Hay dos archivos `.env`:

**Raíz del proyecto** (usado por Docker Compose: `docker-compose.yml` lee estas vars para configurar PostgreSQL)
```
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=solicitudes_db
DB_PORT=5432
```
- Estas variables las usa Docker Compose al levantar el contenedor de PostgreSQL
- El backend en Docker usa `DATABASE_URL` construida internamente con estos mismos valores

**backend/.env** (usado por Express, Prisma y JWT)
```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/solicitudes_db"
PORT=4000
JWT_SECRET=mi_clave_secreta_para_jwt
```
- `DATABASE_URL` la lee Prisma automáticamente del archivo `.env` para migraciones y conexión en runtime
- `PORT` lo usa Express para el servidor
- `JWT_SECRET` lo usa jsonwebtoken para firmar/verificar tokens

El frontend no necesita `.env` porque usa el proxy de Vite hacia `localhost:4000`.

---

## Cómo ejecutar

### Opción 1: Solo backend local + Docker para BD (Recomendada)

```bash
# 1. Configurar variables si aún no lo has hecho (según punto 2)
# Puedes correr los comando o crear los archivos .env manualmente
cp .env.example .env                    # variables para Docker (raíz)
cp backend/.env.example backend/.env    # variables para backend
# Editar backend/.env si es necesario (DATABASE_URL, JWT_SECRET)

# 2. Levantar PostgreSQL con Docker (Tener cuidado de no tener otro contenedor con el mismo nombre, ya que tomará la configuración antigua y arrojará error con las credenciales en punto 3 de más abajo)
docker-compose up -d postgres

# 3. Ejecutar migraciones y seed (Si ya existe la base de datos, no se ejecutará la migración, si se desea ejecutar la migración se debe eliminar la base de datos, o crear una nueva)
cd backend
npm install
npx prisma migrate deploy
npx ts-node prisma/seed.ts

# 4. Iniciar backend
npm run dev    # http://localhost:4000

# 5. En otra terminal, iniciar frontend
cd frontend
npm install
npm run dev    # http://localhost:5173
```

### Opción 2: Todo con Docker (excepto frontend)

```bash
cp .env.example .env
docker-compose up -d
# PostgreSQL → :5432, Backend → :4000
# Frontend debe ejecutarse localmente:
cd frontend && npm install && npm run dev
```

### Opción 3: Todo local (sin Docker)

```bash
# Requiere PostgreSQL instalado y corriendo localmente
cp backend/.env.example backend/.env
# Editar DATABASE_URL en backend/.env con tu conexión local
cd backend
npm install
npx prisma migrate deploy
npx ts-node prisma/seed.ts
npm run dev

# En otra terminal:
cd frontend && npm install && npm run dev
```

> **Alternativa sin Prisma:** También puedes ejecutar `init.sql` (raíz del proyecto) directamente en tu PostgreSQL para crear las tablas y cargar los datos de seed, sin necesidad de migraciones Prisma:
> ```bash
> psql -U postgres -d solicitudes_db -f ../init.sql
> ```

> **Explorar la BD con Prisma Studio:** Para ver tablas, relaciones y datos de forma visual:
> ```bash
> cd backend && npx prisma studio
> ```

### Tests

```bash
cd backend && npm test    # 7 tests (Jest)
cd frontend && npm test   # 10 tests (Vitest)
```

### Documentación Swagger

Una vez corriendo el backend: http://localhost:4000/api-docs

### Usuario semilla

| Email | Password |
|---|---|
| `admin@correo.cl` | `123456` |

---

## Decisiones técnicas

### Arquitectura
- **Backend**: capas route → controller → service → repository. Cada capa tiene una responsabilidad clara. Repository centraliza las queries SQL, service contiene la lógica de negocio, controller maneja request/response.
- **Frontend**: capas types → services → hooks → components. Types define interfaces, services hacen llamadas HTTP, hooks gestionan estado y lógica, components solo renderizan.

### Por qué Prisma con queries raw
Se eligió Prisma por su generador de tipos y migraciones, pero todas las consultas se escriben en SQL plano (`$queryRaw`/`$executeRaw`) para tener control total sobre las queries, incluyendo JOINs, FILTER y agregaciones que Prisma Query Engine no optimiza bien.

### Por qué `SERIAL` y no `UUID`
Los IDs autoincrementales son más simples para este dominio y permiten joins más rápidos. El número de solicitud (`REQ-2026-001`) se genera por separado como identificador de negocio.

### Separación de datos del cliente
Email y teléfono viven en la tabla `Clientes`, no en `Solicitudes`. Se relacionan por FK. Esto evita redundancia y permite actualizar datos del cliente en un solo lugar.

### Sin `react-router-dom`
La app solo tiene dos vistas (login y dashboard) protegidas por autenticación. La conmutación condicional en `App.tsx` es suficiente y evita una dependencia innecesaria.

### BroadcastChannel para bloqueo entre pestañas
Se usó la API nativa `BroadcastChannel` en lugar de WebSockets o polling al servidor, porque el problema es puramente del lado del cliente y no requiere estado en el backend.

---

## Mejoras futuras

- [ ] **Dockerizar frontend** — Agregar servicio al `docker-compose.yml` para tener el stack completo containerizado
- [ ] **Pipeline CI/CD** — GitHub Actions para correr tests, lint y build en cada PR
- [ ] **Auth en todas las rutas** — Middleware `authenticate` ya está en las rutas de negocio, pero faltaría un manejo global de 401 en el frontend (interceptor axios)
- [ ] **Manejo de errores mejorado** — Unificar el patrón de errores (usar `AppError`/`NotFoundError` de forma consistente en todos los controladores)
- [ ] **Caché de estadísticas** — El endpoint `/dashboard` se consulta en cada mutación; un caché simple (Redis o en memoria) reduciría carga en BD
- [ ] **Filtros avanzados** — Agregar filtro por rango de fechas, por cliente, exportación a CSV
- [ ] **Componente de confirmación reutilizable** — Extraer los modales de confirmación (eliminar, cerrar) a un solo componente `ConfirmModal`
- [ ] **Modo oscuro** — Usar clases de Tailwind y contexto para persistir preferencia
- [ ] **Paginación en frontend sin perder filtros** — Actualmente al cambiar página se pierde el scroll; se podría sincronizar filtros con URL search params
- [ ] **Rate limiting** — Agregar `express-rate-limit` para proteger endpoints de creación/edición
