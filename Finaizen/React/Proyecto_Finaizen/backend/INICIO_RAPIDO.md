# 🚀 GUÍA RÁPIDA - Backend Finaizen

## Inicio Rápido (3 pasos)

### 1️⃣ Navegar a la carpeta backend
```powershell
cd "c:\Users\perez\Documents\Kevin EPN\Septimo\Aplicaciones web y moviles\Github\aplicaciones_web_moviles_2025B\Finaizen\React\Proyecto_Finaizen\backend"
```

### 2️⃣ Iniciar el servidor
```powershell
npm start
```

### 3️⃣ Abrir en el navegador
```
http://localhost:3000
```

¡Listo! El servidor está funcionando.

---

## 🧪 Probar los Endpoints

### Opción 1: Navegador (solo GET)
- http://localhost:3000/
- http://localhost:3000/items
- http://localhost:3000/items/2

### Opción 2: PowerShell
```powershell
# Ver todos los items
Invoke-RestMethod -Uri "http://localhost:3000/items" | ConvertTo-Json

# Crear nuevo item
$body = @{ name = "Mi Item"; description = "Descripción" } | ConvertTo-Json
Invoke-RestMethod -Uri "http://localhost:3000/items" -Method POST -Body $body -ContentType "application/json"

# Eliminar item
Invoke-RestMethod -Uri "http://localhost:3000/items/1" -Method DELETE
```

### Opción 3: Thunder Client (VS Code)
1. Instalar extensión "Thunder Client"
2. New Request → GET → http://localhost:3000/items
3. Send

---

## 📝 Endpoints Disponibles

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/` | Info de la API |
| GET | `/items` | Obtener todos |
| GET | `/items/:id` | Obtener por ID |
| POST | `/items` | Crear nuevo |
| PUT | `/items/:id` | Actualizar |
| DELETE | `/items/:id` | Eliminar |

---

## 🔧 Configuración

### Cambiar puerto:
Editar `backend/.env`:
```env
PORT=4000
```

### Reiniciar servidor:
Presionar `Ctrl + C` en la terminal y ejecutar `npm start` nuevamente.

---

## 📚 Documentación Completa

- [README.md](./README.md) - Documentación detallada
- [VALIDACION_REQUISITOS.md](./VALIDACION_REQUISITOS.md) - Validación completa

---

## ⚡ Modo Desarrollo (auto-reinicio)

```powershell
npm run dev
```

El servidor se reiniciará automáticamente al guardar cambios.
