# 🧪 GUÍA DE VALIDACIÓN - FINAIZEN CON BACKEND

## ✅ Checklist de Validación

### 1️⃣ Backend Funcionando
- [x] JSON Server instalado
- [x] Puerto 3000 disponible
- [x] Datos de ejemplo cargados
- [x] 5 registros de historial disponibles
- [x] 2 ingresos de ejemplo
- [x] 2 egresos de ejemplo

### 2️⃣ Frontend Configurado
- [x] API Service creado
- [x] Variables de entorno (.env)
- [x] Componente Historial migrado

---

## 🚀 PASOS PARA VALIDAR

### PASO 1: Verificar Backend

El backend ya está corriendo. Prueba estos endpoints:

#### A. Ver todos los usuarios
```powershell
Invoke-RestMethod http://localhost:3000/users | ConvertTo-Json
```

**Resultado esperado:** 3 usuarios (admin, maria.gonzalez, carlos.perez)

#### B. Ver historial
```powershell
Invoke-RestMethod http://localhost:3000/historial | ConvertTo-Json
```

**Resultado esperado:** 5 transacciones de ejemplo

#### C. Filtrar historial por usuario
```powershell
Invoke-RestMethod "http://localhost:3000/historial?userId=1" | ConvertTo-Json
```

**Resultado esperado:** 4 transacciones del usuario admin

---

### PASO 2: Iniciar el Frontend

Abre una **NUEVA TERMINAL** (mantén el backend corriendo) y ejecuta:

```powershell
npm run dev
```

**URL del frontend:** http://localhost:5173

---

### PASO 3: Validar en el Navegador

#### 1. Acceder a la aplicación
Abre: **http://localhost:5173**

#### 2. Login con usuario de prueba
```
Usuario: admin
Contraseña: admin123
```

#### 3. Navegar al Historial
Ir a la sección **"Historial"** o **"Transacciones"**

#### 4. Verificar que se muestren los datos
Deberías ver **4 transacciones** del usuario admin:
- ✅ Salario mensual - $2,500 (Ingreso)
- ✅ Compra supermercado - $150 (Egreso)
- ✅ Proyecto freelance - $800 (Ingreso)
- ✅ Pago Netflix - $15.99 (Egreso)

---

## 🧪 PRUEBAS FUNCIONALES

### Prueba 1: Ver Historial ✅
1. Login como `admin`
2. Ir a Historial
3. **Verificar:** Se cargan los 4 registros del backend

### Prueba 2: Filtrar por Tipo
1. Seleccionar filtro "Ingresos"
2. **Verificar:** Se muestran solo 2 registros (Salario y Freelance)
3. Seleccionar filtro "Egresos"
4. **Verificar:** Se muestran solo 2 registros (Supermercado y Netflix)

### Prueba 3: Buscar por Texto
1. Escribir "Netflix" en el buscador
2. **Verificar:** Se muestra solo el registro de Netflix

### Prueba 4: Eliminar Registro (si está implementado)
1. Seleccionar un registro
2. Click en "Eliminar"
3. Confirmar eliminación
4. **Verificar:** El registro desaparece
5. Recargar página
6. **Verificar:** El registro sigue eliminado (persistencia en backend)

### Prueba 5: Editar Registro (si está implementado)
1. Seleccionar un registro
2. Click en "Editar"
3. Modificar el monto
4. Guardar
5. **Verificar:** El monto se actualiza
6. Recargar página
7. **Verificar:** El cambio persiste

---

## 🔍 VALIDAR LA CONSOLA DEL NAVEGADOR

Abre las **DevTools** (F12) y revisa:

### Consola (Console)
✅ No debe haber errores rojos
✅ Debe verse: "✓ MockDatabaseAdapter inicializado desde API" (si usas el adapter)
✅ Mensajes de carga de datos exitosos

### Network (Red)
1. Ir a la pestaña "Network"
2. Recargar la página del Historial
3. **Verificar peticiones HTTP:**
   - ✅ GET `http://localhost:3000/historial?userId=1` → Status 200
   - ✅ Response muestra los datos JSON

---

## 🧪 PRUEBAS DE API CON POSTMAN/THUNDER CLIENT

Si tienes Thunder Client o Postman:

### GET - Obtener Historial
```
GET http://localhost:3000/historial
```
**Resultado:** 5 registros

### GET - Filtrar por Usuario
```
GET http://localhost:3000/historial?userId=1
```
**Resultado:** 4 registros del usuario admin

### GET - Filtrar por Tipo
```
GET http://localhost:3000/historial?tipo=ingreso
```
**Resultado:** 3 registros de ingresos

### POST - Crear Nuevo Registro
```http
POST http://localhost:3000/historial
Content-Type: application/json

{
  "userId": 1,
  "perfilId": 1,
  "tipo": "egreso",
  "descripcion": "Gasolina",
  "monto": 45,
  "categoria": "Transporte",
  "fechaEjecucion": "2026-01-13T14:00:00.000Z",
  "mes": 1,
  "anio": 2026
}
```
**Resultado:** Se crea el registro con ID 6

### DELETE - Eliminar Registro
```http
DELETE http://localhost:3000/historial/6
```
**Resultado:** Registro eliminado

### PUT - Actualizar Registro
```http
PUT http://localhost:3000/historial/1
Content-Type: application/json

{
  "id": 1,
  "userId": 1,
  "perfilId": 1,
  "tipo": "ingreso",
  "descripcion": "Salario mensual ACTUALIZADO",
  "monto": 2800,
  "categoria": "Salario",
  "fechaEjecucion": "2026-01-05T10:30:00.000Z",
  "mes": 1,
  "anio": 2026
}
```
**Resultado:** Registro actualizado

---

## 📊 DATOS DE PRUEBA DISPONIBLES

### Usuarios
| ID | Usuario | Contraseña | Rol |
|----|---------|------------|-----|
| 1 | admin | admin123 | admin |
| 2 | maria.gonzalez | maria123 | user |
| 3 | carlos.perez | carlos123 | user |

### Historial (5 registros)
| ID | Usuario | Tipo | Descripción | Monto |
|----|---------|------|-------------|-------|
| 1 | admin (1) | Ingreso | Salario mensual | $2,500 |
| 2 | admin (1) | Egreso | Compra supermercado | $150 |
| 3 | admin (1) | Ingreso | Proyecto freelance | $800 |
| 4 | admin (1) | Egreso | Pago Netflix | $15.99 |
| 5 | maria (2) | Ingreso | Venta producto | $450 |

### Ingresos (2 registros)
- Salario mensual: $2,500 (recurrente)
- Proyecto freelance: $800

### Egresos (2 registros)
- Compra supermercado: $150
- Pago Netflix: $15.99

---

## 🎯 CRITERIOS DE ÉXITO

### ✅ Backend
- [x] Servidor corriendo en puerto 3000
- [x] Responde a peticiones HTTP
- [x] Devuelve datos en formato JSON
- [x] CRUD funciona correctamente

### ✅ Frontend
- [ ] Se inicia sin errores
- [ ] Login funciona
- [ ] Historial carga datos del backend
- [ ] Filtros funcionan
- [ ] No hay errores en consola

### ✅ Integración
- [ ] Frontend consume API correctamente
- [ ] Datos se muestran en la interfaz
- [ ] Cambios persisten en el backend
- [ ] Sincronización funciona

---

## 🐛 SOLUCIÓN DE PROBLEMAS

### Error: "Cannot connect to backend"
```powershell
# Verificar que el backend esté corriendo
# Debe ver el mensaje de JSON Server
```

### No se muestran datos en el frontend
1. Abrir DevTools (F12)
2. Ir a Console
3. Revisar errores
4. Verificar que la petición HTTP se haga correctamente en Network

### Error 404 en peticiones
- Verificar que la URL sea `http://localhost:3000`
- Revisar el archivo `.env`

### Datos no persisten
- Asegurarse que el backend esté corriendo
- Verificar permisos de escritura en `db.json`

---

## 📝 VALIDACIÓN COMPLETADA

Marca cada item cuando lo valides:

### Backend
- [ ] GET /users funciona
- [ ] GET /historial funciona
- [ ] GET /historial?userId=1 funciona
- [ ] POST /historial funciona
- [ ] DELETE /historial/:id funciona
- [ ] PUT /historial/:id funciona

### Frontend
- [ ] Aplicación inicia correctamente
- [ ] Login exitoso con usuario admin
- [ ] Página Historial carga
- [ ] Se muestran 4 transacciones
- [ ] Filtros funcionan
- [ ] Búsqueda funciona

### Integración
- [ ] Datos del backend se muestran en frontend
- [ ] Crear registro desde frontend funciona
- [ ] Eliminar registro desde frontend funciona
- [ ] Editar registro desde frontend funciona
- [ ] Los cambios persisten al recargar

---

## 🎉 RESULTADO ESPERADO

Si todo funciona correctamente:

1. ✅ Backend responde en http://localhost:3000
2. ✅ Frontend carga en http://localhost:5173
3. ✅ Login exitoso con `admin / admin123`
4. ✅ Historial muestra 4 transacciones del usuario admin
5. ✅ Filtros permiten buscar por tipo, mes, año
6. ✅ Operaciones CRUD funcionan y persisten

---

## 📞 SIGUIENTE PASO

Una vez validado el Historial, puedes:
1. Migrar otros componentes usando el mismo patrón
2. Agregar más datos de ejemplo en `db.json`
3. Implementar nuevas funcionalidades
4. Conectar a una base de datos real

---

**Fecha de validación:** Enero 13, 2026  
**Estado:** ✅ Listo para probar
