# 🚀 INICIO RÁPIDO - Finaizen con Backend JSON Server

## ⚡ Comandos Esenciales

### 1. Iniciar Backend
```powershell
cd backend
npm start
```
**URL:** http://localhost:3000

### 2. Iniciar Frontend
```powershell
# En otra terminal, desde la raíz del proyecto
npm run dev
```
**URL:** http://localhost:5173

---

## 📊 Estado del Proyecto

### ✅ Backend Implementado
- **Tecnología:** JSON Server
- **Puerto:** 3000
- **Base de datos:** `backend/db.json`
- **Endpoints:** 12 recursos REST completos

### ✅ Frontend Actualizado
- **Tecnología:** React + Vite
- **Puerto:** 5173
- **Servicio API:** `src/services/apiService.js`

### ⚠️ Componentes Migrados
- ✅ **Historial** - Migrado a usar API
- ⏳ **Otros componentes** - Pendientes de migración

---

## 🧪 Probar la API

### Navegador
- http://localhost:3000/users
- http://localhost:3000/ingresos
- http://localhost:3000/egresos

### PowerShell
```powershell
# Ver usuarios
Invoke-RestMethod http://localhost:3000/users | ConvertTo-Json

# Ver ingresos
Invoke-RestMethod http://localhost:3000/ingresos | ConvertTo-Json
```

---

## 📝 Usuarios de Prueba

| Usuario | Contraseña | Rol | Premium |
|---------|------------|-----|---------|
| admin | admin123 | admin | ✅ Sí |
| maria.gonzalez | maria123 | user | ✅ Sí |
| carlos.perez | carlos123 | user | ❌ No |

---

## 📚 Documentación

- **[MIGRACION_JSON_SERVER.md](./MIGRACION_JSON_SERVER.md)** - Guía completa de migración
- **[backend/README.md](./backend/README.md)** - Documentación del backend

---

## 🔧 Configuración

### Variables de Entorno (.env)
```env
VITE_API_URL=http://localhost:3000
```

### Cambiar Puerto del Backend
Editar `backend/package.json`:
```json
"start": "json-server --watch db.json --port 3001"
```

---

## ❗ Importante

1. **Servidor debe estar corriendo:** El frontend no funcionará sin el backend
2. **Dos terminales necesarias:** Una para backend, otra para frontend
3. **Puerto 3000 libre:** Asegúrate que no esté ocupado

---

## 🐛 Solución de Problemas

### Puerto 3000 ocupado
```powershell
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process -Force
```

### Backend no inicia
```powershell
cd backend
npm install
npm start
```

### Frontend no conecta
1. Verificar que backend esté corriendo
2. Revisar `.env` tenga `VITE_API_URL=http://localhost:3000`
3. Reiniciar frontend

---

**Actualizado:** Enero 13, 2026  
**Estado:** ✅ Funcionando
