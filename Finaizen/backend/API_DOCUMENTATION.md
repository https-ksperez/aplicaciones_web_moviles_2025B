# 📚 Documentación Completa de Endpoints

## Base URL
```
http://localhost:5000/api
```

---

## 🔐 Autenticación

### 1. Registro de Usuario

**POST** `/auth/register`

**Body:**
```json
{
  "nombre": "Juan",
  "apellido": "Pérez",
  "correo": "juan@example.com",
  "nombreUsuario": "juanperez",
  "contraseña": "password123",
  "pais": "Ecuador",
  "ciudad": "Quito",
  "fechaNacimiento": "1990-05-15",
  "genero": "masculino"
}
```

**Response 201:**
```json
{
  "success": true,
  "message": "Usuario registrado exitosamente",
  "data": {
    "user": {
      "id": "uuid-here",
      "nombre": "Juan",
      "apellido": "Pérez",
      "correo": "juan@example.com",
      "nombreUsuario": "juanperez",
      "pais": "Ecuador",
      "rol": "user",
      "isPremium": false
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 2. Inicio de Sesión

**POST** `/auth/login`

**Body:**
```json
{
  "correo": "juan@example.com",
  "contraseña": "password123"
}
```

**Response 200:**
```json
{
  "success": true,
  "message": "Inicio de sesión exitoso",
  "data": {
    "user": { ... },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 3. Obtener Perfil

**GET** `/auth/profile`

**Headers:**
```
Authorization: Bearer {token}
```

**Response 200:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "nombre": "Juan",
    "apellido": "Pérez",
    "correo": "juan@example.com",
    "perfiles": [...]
  }
}
```

---

## 👤 Perfiles

### 1. Listar Perfiles

**GET** `/perfiles`

**Headers:**
```
Authorization: Bearer {token}
```

**Response 200:**
```json
{
  "success": true,
  "data": [
    {
      "id": "perfil-uuid",
      "nombre": "Personal",
      "moneda": "USD",
      "simboloMoneda": "$",
      "ingresos": [...],
      "egresos": [...],
      "presupuestos": [...]
    }
  ]
}
```

### 2. Crear Perfil

**POST** `/perfiles`

**Headers:**
```
Authorization: Bearer {token}
```

**Body:**
```json
{
  "nombre": "Personal",
  "moneda": "USD",
  "simboloMoneda": "$",
  "configuracion": {
    "notificaciones": true,
    "tema": "claro"
  }
}
```

### 3. Resumen Financiero

**GET** `/perfiles/{perfilId}/resumen`

**Response 200:**
```json
{
  "success": true,
  "data": {
    "periodo": {
      "mes": 1,
      "anio": 2026
    },
    "ingresos": 1500.00,
    "egresos": 850.50,
    "balance": 649.50,
    "presupuestos": 5,
    "planesAhorro": 2,
    "planesDeuda": 1,
    "transacciones": 23
  }
}
```

---

## 💰 Ingresos

### 1. Listar Ingresos

**GET** `/perfiles/{perfilId}/ingresos`

**Response 200:**
```json
{
  "success": true,
  "data": [
    {
      "id": "ingreso-uuid",
      "monto": "1500.00",
      "descripcion": "Salario Mensual",
      "categoria": "Salario",
      "frecuencia": "mensual",
      "diaMes": 1,
      "activo": true,
      "proximaEjecucion": "2026-02-01T00:00:00.000Z"
    }
  ]
}
```

### 2. Crear Ingreso

**POST** `/perfiles/{perfilId}/ingresos`

**Body:**
```json
{
  "monto": 1500.00,
  "descripcion": "Salario Mensual",
  "categoria": "Salario",
  "frecuencia": "mensual",
  "diaMes": 1,
  "delay": "09:00",
  "notificacionActiva": true,
  "activo": true
}
```

### 3. Actualizar Ingreso

**PUT** `/perfiles/{perfilId}/ingresos/{id}`

**Body:**
```json
{
  "monto": 1600.00,
  "activo": false
}
```

### 4. Eliminar Ingreso

**DELETE** `/perfiles/{perfilId}/ingresos/{id}`

**Response 200:**
```json
{
  "success": true,
  "message": "Ingreso eliminado exitosamente"
}
```

---

## 💸 Egresos

### 1. Crear Egreso

**POST** `/perfiles/{perfilId}/egresos`

**Body:**
```json
{
  "monto": 50.00,
  "descripcion": "Supermercado",
  "categoria": "Alimentación",
  "frecuencia": "ocasional",
  "fechaEspecifica": "2026-01-18",
  "clasificacionIA": "Supermercado - Alimentos básicos"
}
```

---

## 📊 Presupuestos

### 1. Crear Presupuesto

**POST** `/perfiles/{perfilId}/presupuestos`

**Body:**
```json
{
  "categoria": "Alimentación",
  "montoLimite": 300.00,
  "montoGastado": 0,
  "periodo": "mensual",
  "alertaEn": 80,
  "activo": true,
  "mes": 1,
  "anio": 2026
}
```

**Response 201:**
```json
{
  "success": true,
  "message": "Presupuesto creado exitosamente",
  "data": {
    "id": "presupuesto-uuid",
    "categoria": "Alimentación",
    "montoLimite": "300.00",
    "montoGastado": "0.00",
    "periodo": "mensual"
  }
}
```

---

## 🎯 Planes de Ahorro

### 1. Crear Plan de Ahorro

**POST** `/perfiles/{perfilId}/planes-ahorro`

**Body:**
```json
{
  "nombre": "Vacaciones 2026",
  "descripcion": "Viaje a la playa en diciembre",
  "objetivo": "Disfrutar vacaciones familiares",
  "montoActual": 0,
  "montoMeta": 2000.00,
  "montoAhorrarMensual": 200.00,
  "categoria": "Viajes",
  "fechaInicio": "2026-01-01",
  "fechaMeta": "2026-12-01",
  "estado": "activo",
  "prioridad": "alta",
  "icono": "✈️",
  "color": "#4CAF50",
  "estrategia": "consistente",
  "notificacionActiva": true,
  "tipoNotificacion": "mensual"
}
```

### 2. Actualizar Progreso

**PUT** `/perfiles/{perfilId}/planes-ahorro/{id}`

**Body:**
```json
{
  "montoActual": 400.00,
  "depositosRealizados": 2,
  "historialAhorros": [
    {
      "fecha": "2026-01-01",
      "monto": 200.00,
      "nota": "Primer depósito"
    },
    {
      "fecha": "2026-02-01",
      "monto": 200.00,
      "nota": "Segundo depósito"
    }
  ]
}
```

---

## 💳 Planes de Deuda

### 1. Crear Plan de Deuda

**POST** `/perfiles/{perfilId}/planes-deuda`

**Body:**
```json
{
  "nombre": "Tarjeta Visa",
  "descripcion": "Deuda de tarjeta de crédito",
  "categoria": "Tarjeta de Crédito",
  "montoDeuda": 5000.00,
  "montoPagado": 0,
  "tasaInteres": 18.5,
  "cuotaMensual": 250.00,
  "fechaPago": "2026-02-15",
  "estado": "activo",
  "prioridad": "alta",
  "estrategia": "avalancha",
  "acreedor": "Banco Pichincha",
  "numeroContrato": "VISA-12345",
  "icono": "💳",
  "color": "#FF6B6B"
}
```

---

## 🏆 Logros

### 1. Crear Logro

**POST** `/perfiles/{perfilId}/logros`

**Body:**
```json
{
  "nombre": "Primer Ahorro",
  "descripcion": "Completar tu primer mes de ahorro",
  "icono": "🎉",
  "tipo": "ahorro",
  "condicion": "Ahorrar durante 30 días consecutivos",
  "desbloqueado": false,
  "progreso": 0,
  "meta": 30,
  "empresa": "McDonald's",
  "logoEmpresa": "https://example.com/mcdonalds-logo.png",
  "recompensa": "$10 USD en productos McDonald's",
  "valorRecompensa": 10.00,
  "requiereComprobante": true
}
```

### 2. Actualizar Progreso de Logro

**PUT** `/perfiles/{perfilId}/logros/{id}`

**Body:**
```json
{
  "progreso": 15,
  "desbloqueado": false
}
```

### 3. Desbloquear Logro

**PUT** `/perfiles/{perfilId}/logros/{id}`

**Body:**
```json
{
  "desbloqueado": true,
  "fechaDesbloqueo": "2026-01-31T10:30:00.000Z",
  "progreso": 30
}
```

---

## 📜 Historial de Transacciones

### 1. Crear Registro en Historial

**POST** `/perfiles/{perfilId}/historial`

**Body:**
```json
{
  "tipo": "ingreso",
  "monto": 1500.00,
  "descripcion": "Salario Enero",
  "categoria": "Salario",
  "transaccionOrigenId": "ingreso-uuid",
  "fechaEjecucion": "2026-01-01T09:00:00.000Z"
}
```

### 2. Listar Historial (con filtros)

**GET** `/perfiles/{perfilId}/historial?tipo=egreso&mes=1&anio=2026`

**Response 200:**
```json
{
  "success": true,
  "data": [
    {
      "id": "registro-uuid",
      "tipo": "egreso",
      "monto": "50.00",
      "descripcion": "Supermercado",
      "categoria": "Alimentación",
      "fechaEjecucion": "2026-01-18T14:30:00.000Z",
      "mes": 1,
      "anio": 2026
    }
  ]
}
```

---

## 🔔 Notificaciones

### 1. Listar Notificaciones

**GET** `/notificaciones?leidas=false`

**Response 200:**
```json
{
  "success": true,
  "data": [
    {
      "id": "notif-uuid",
      "tipo": "presupuesto",
      "titulo": "¡Presupuesto Cerca del Límite!",
      "mensaje": "Tu presupuesto de Alimentación está al 85%",
      "icono": "🔔",
      "leida": false,
      "accionUrl": "/presupuestos",
      "createdAt": "2026-01-18T10:00:00.000Z"
    }
  ]
}
```

### 2. Marcar como Leída

**PUT** `/notificaciones/{id}/leer`

**Response 200:**
```json
{
  "success": true,
  "message": "Notificación marcada como leída"
}
```

### 3. Marcar Todas como Leídas

**PUT** `/notificaciones/leer-todas`

**Response 200:**
```json
{
  "success": true,
  "message": "Todas las notificaciones marcadas como leídas"
}
```

---

## ❌ Códigos de Error

| Código | Descripción |
|--------|-------------|
| 400 | Bad Request - Datos inválidos |
| 401 | Unauthorized - Token inválido o expirado |
| 403 | Forbidden - Sin permisos |
| 404 | Not Found - Recurso no encontrado |
| 409 | Conflict - Recurso ya existe |
| 500 | Internal Server Error |

### Ejemplo de Error:

```json
{
  "success": false,
  "message": "Error de validación",
  "errors": [
    {
      "field": "correo",
      "message": "Correo inválido",
      "value": "invalid-email"
    }
  ]
}
```

---

## 🔑 Autenticación en Headers

Todos los endpoints protegidos requieren:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

---

## 📊 Paginación (Futura implementación)

```
GET /api/perfiles/{perfilId}/historial?page=1&limit=20&sort=-createdAt
```

---

## 🎯 Consejos para Usar el API

1. **Guarda el token** después del login
2. **Incluye el token** en todas las peticiones autenticadas
3. **Maneja los errores** apropiadamente en tu frontend
4. **Verifica los códigos de estado** HTTP
5. **Usa UUIDs** correctos en los parámetros de URL

---

## 🧪 Probar con cURL

```bash
# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"correo":"juan@example.com","contraseña":"password123"}'

# Obtener perfiles (con token)
curl -X GET http://localhost:5000/api/perfiles \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

Para más información, consulta el [README.md](./README.md) principal.
