# Family Fish (MVP)

Proyecto MVP para objeto físico en madera + árbol familiar online con peces estilo **koinobori**.

---

## 🧩 Estructura

```
family-fish/
├─ backend/           # Node + Express + Prisma (SQLite en local)
└─ frontend/          # React + Vite (TypeScript)
```

---

## 🚀 Puesta en marcha

### 1) Backend

1. Variables de entorno (crear `backend/.env`):

   ```env
   DATABASE_URL="file:./dev.db"
   JWT_SECRET="cambia-esto"
   PUBLIC_APP_URL="http://localhost:5173"
   ```
2. Instalar & Prisma:

   ```bash
   cd backend
   npm i
   npx prisma generate
   npm run prisma:dev
   ```
3. Ejecutar API:

   ```bash
   npm run dev
   # API en http://localhost:3001
   ```

### 2) Frontend

```bash
cd frontend
cp .env.example .env   # o crea VITE_API_URL="http://localhost:3001"
npm i
npm run dev
# App en http://localhost:5173
```

---

## 🔑 Crear una familia (y obtener enlaces)

**cURL** (desde otra terminal):

```bash
curl -s -X POST http://localhost:3001/api/family \
  -H "Content-Type: application/json" \
  -d '{"label":"Familia Demo","initialFishCount":3}'
```

Respuesta JSON típica:

```json
{
  "familyId": "...",
  "claimUrl": "http://localhost:5173/claim?token=...",
  "publicUrl": "http://localhost:5173/v/..."
}
```

* `claimUrl`: enlace **privado** para **reclamar** y editar el árbol.
* `publicUrl`: enlace **público (solo lectura)** para compartir.

### Acceso privado (edición)

1. Abre `claimUrl` en el navegador → guarda **session** y redirige a `/family/:familyId`.
2. Si ya tienes sesión guardada, puedes ir directo a `/family/:id`.

### Crear invitaciones para familiares

En la vista privada, botón **“Crear enlace de invitación”**. O API:

```bash
curl -s -X POST http://localhost:3001/api/family/FAMILY_ID/invite \
  -H "Authorization: Bearer SESSION_JWT"
```

---

## 👀 Prisma Studio (ver/editar datos)

Abrir Studio:

```bash
cd backend
npx prisma studio --schema=./prisma/schema.prisma
# Suele abrir en http://localhost:5555
```

### ¿Qué mirar?

* **Family**: campos `id`, `publicId` (enlace público), `label`, etc.
* **ClaimToken**: copia el `token` si necesitas volver a generar un enlace `/claim?token=...`.
* **Fish**: `name`, `role`, etc.

### Problema común: “No default workspace found”

Lánzalo siempre desde `backend/` y/o especifica el schema:

```bash
npx prisma studio --schema=./prisma/schema.prisma
```

---

## 🌐 Vista pública (solo lectura)

* Cada familia tiene `publicId`. Si creaste familias **antes** de añadir ese campo y aparece `null`:

  * **Rápido**: en **Family** (Studio), edita `publicId` y pon algo único (p. ej. `pub_` + cadena larga).
  * **Automático**: ejecuta el backfill si está disponible:

    ```bash
    cd backend
    npm run backfill:public
    ```
* Enlace: `http://localhost:5173/v/<publicId>`.

---

## 🐟 Roles y edición rápida

En `/family/:id` puedes:

* **Añadir pez**.
* **Renombrar**.
* **Cambiar rol** con un selector (p. ej. `padre`, `madre`, `hija`, `hijo`, `abuelo`, …).

Los colores/tamaños se ajustan automáticamente:

* **Padre** (más grande)
* **Madre** (mediano)
* **Hijos** (pequeños)
* Otros (intermedio)

---

## 🧵 Koinobori (layout)

* Raíz/mástil a la **izquierda**.
* Peces **alineados a la derecha** mirando hacia la **izquierda** (hacia el mástil).
* La **longitud de la cuerda** se controla con la constante `fishX` en `frontend/src/components/FishTree.tsx`. Para acercar/alejar los peces, ajusta `fishX`.

> Ejemplo: `const fishX = 420` coloca los peces más cerca del mástil que `const fishX = 720`.

---

## 🖌️ Sustituir el diseño de los peces (Illustrator)

Puedes reemplazar el diseño por tu SVG exportado de Illustrator.

### Opción A (rápida): pegar tu SVG dentro del componente del pez

1. Abre `frontend/src/components/FishTree.tsx`.
2. Localiza el componente `Koi` (definición por defecto del pez).
3. **Reemplaza** las figuras (`<ellipse>`, `<polygon>`, etc.) por tu SVG (paths y grupos) *mantenidos dentro de un `<g>`*.
4. Mantén la **orientación hacia la IZQUIERDA** y que la **boca** esté en el eje **x = -rx** (línea de boca). De este modo la cuerda seguirá llegando a la boca.
5. Si tu pez tiene otras dimensiones, ajusta el mapa de tamaños por rol `SIZE` (valores `rx`, `ry`).

### Opción B (limpia): componente `CustomFish`

1. Crea `frontend/src/components/CustomFish.tsx` con tu SVG escalable en un `viewBox` conocido.
2. Expón una prop `{ kind }` e internamente rescalea según `SIZE[kind]`.
3. En `FishTree`, pasa una prop `renderFish={(kind)=> <CustomFish kind={kind} />}`.

> Consejo: en Illustrator, centra el pez pensando en un `viewBox` horizontal (por ejemplo 200×80), con la **boca** en el borde izquierdo del `viewBox`. Así, al situarlo en `(0,0)` y desplazarlo a `(-rx,-ry)` quedará perfectamente anclado a la cuerda.

---

## 🧪 Endpoints de referencia

* `POST /api/family` → crear familia (devuelve `claimUrl` y `publicUrl`).
* `POST /api/auth/consume` → consumir token (`claim?token=...`) y obtener sesión.
* `GET /api/family/:id` → obtener familia (privado, requiere `Authorization: Bearer <session>`).
* `POST /api/family/:id/fish` → crear pez (privado).
* `PATCH /api/fish/:id` → actualizar pez (nombre, rol, `angle`, `radius`) (privado).
* `POST /api/family/:id/invite` → crear invitación (privado).
* `GET /api/public/:publicId` → vista pública (solo lectura).

---

## 🩹 Errores comunes

* **`Cannot read properties of null (reading 'publicId')`**: asegura en `Family.tsx` estos guardas antes de usar `data`:

  ```tsx
  if (!session) return <main>Accede desde tu enlace (QR).</main>;
  if (!data)    return <main>Cargando…</main>;
  ```
* **Studio: `No default workspace found`**: ejecuta `npx prisma studio --schema=./prisma/schema.prisma` desde `backend/`.
* **Sesión corrupta**: limpia en DevTools → Console: `localStorage.removeItem('session')` y refresca.

---

## 📦 Despliegue (pistas rápidas)

* Frontend: Vercel/Netlify.
* Backend: Railway/Render/Fly.io.
* Base de datos (prod): Supabase/Neon (Postgres). Ajusta `DATABASE_URL`.

---

## 📄 Licencia

MVP interno para validación. Define la licencia que prefieras (MIT, etc.).
