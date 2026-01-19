# ====================================================
# Script de Setup Automático - Finaizen
# ====================================================
# Este script configura todo el entorno automáticamente

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "   FINAIZEN - Setup Automático" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# Verificar que estamos en la carpeta correcta
if (-not (Test-Path "backend\package.json")) {
    Write-Host "ERROR: Ejecuta este script desde la carpeta Finaizen" -ForegroundColor Red
    exit 1
}

# ====================================================
# PASO 1: Setup Backend
# ====================================================

Write-Host "[1/6] Instalando dependencias del backend..." -ForegroundColor Yellow
cd backend
npm install

if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Falló la instalación de dependencias" -ForegroundColor Red
    exit 1
}

Write-Host "✓ Dependencias instaladas" -ForegroundColor Green

# ====================================================
# PASO 2: Configurar Base de Datos
# ====================================================

Write-Host "`n[2/6] Configurando base de datos PostgreSQL..." -ForegroundColor Yellow

$dbPassword = Read-Host "Ingresa la contraseña de PostgreSQL (usuario: postgres)"

# Crear base de datos
Write-Host "Creando base de datos finaizen_db..." -ForegroundColor Yellow

$env:PGPASSWORD = $dbPassword
$createDbCommand = "CREATE DATABASE finaizen_db;"

# Intentar crear la base de datos
try {
    $result = & "psql" -U postgres -c $createDbCommand 2>&1
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ Base de datos creada exitosamente" -ForegroundColor Green
    } else {
        if ($result -match "already exists") {
            Write-Host "✓ Base de datos ya existe" -ForegroundColor Green
        } else {
            Write-Host "ADVERTENCIA: No se pudo crear la base de datos automáticamente" -ForegroundColor Yellow
            Write-Host "Créala manualmente con: CREATE DATABASE finaizen_db;" -ForegroundColor Yellow
            $continue = Read-Host "¿Continuar de todas formas? (s/n)"
            if ($continue -ne "s") { exit 1 }
        }
    }
} catch {
    Write-Host "ADVERTENCIA: psql no encontrado en PATH" -ForegroundColor Yellow
    Write-Host "Asegúrate de crear la base de datos manualmente:" -ForegroundColor Yellow
    Write-Host "  1. Abre pgAdmin o psql" -ForegroundColor White
    Write-Host "  2. Ejecuta: CREATE DATABASE finaizen_db;" -ForegroundColor White
    $continue = Read-Host "`n¿Ya creaste la base de datos? (s/n)"
    if ($continue -ne "s") { exit 1 }
}

# Actualizar .env con la contraseña
Write-Host "`nActualizando archivo .env..." -ForegroundColor Yellow

$envContent = Get-Content .env -Raw
$envContent = $envContent -replace 'DB_PASSWORD=.*', "DB_PASSWORD=$dbPassword"
Set-Content .env -Value $envContent

Write-Host "✓ Archivo .env actualizado" -ForegroundColor Green

# ====================================================
# PASO 3: Ejecutar Migraciones
# ====================================================

Write-Host "`n[3/6] Ejecutando migraciones..." -ForegroundColor Yellow
npm run migrate

if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Falló la ejecución de migraciones" -ForegroundColor Red
    Write-Host "Revisa la configuración de PostgreSQL en .env" -ForegroundColor Yellow
    exit 1
}

Write-Host "✓ Migraciones ejecutadas (11 tablas creadas)" -ForegroundColor Green

# ====================================================
# PASO 4: Cargar Datos de Prueba
# ====================================================

Write-Host "`n[4/6] Cargando datos de prueba..." -ForegroundColor Yellow
npm run seed

if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Falló la carga de datos de prueba" -ForegroundColor Red
    exit 1
}

Write-Host "✓ Datos de prueba cargados (3 usuarios, múltiples registros)" -ForegroundColor Green

# ====================================================
# PASO 5: Configurar Frontend
# ====================================================

Write-Host "`n[5/6] Configurando frontend..." -ForegroundColor Yellow
cd ..\React\Proyecto_Finaizen

# Verificar que .env tiene la variable correcta
if (-not (Select-String -Path ".env" -Pattern "VITE_API_URL" -Quiet)) {
    Write-Host "Agregando VITE_API_URL al .env del frontend..." -ForegroundColor Yellow
    Add-Content .env "`nVITE_API_URL=http://localhost:5000/api"
}

Write-Host "✓ Frontend configurado" -ForegroundColor Green

# ====================================================
# PASO 6: Resumen Final
# ====================================================

cd ..\..\..\..

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "   ✓ SETUP COMPLETADO EXITOSAMENTE" -ForegroundColor Green
Write-Host "========================================`n" -ForegroundColor Cyan

Write-Host "📦 Backend configurado:" -ForegroundColor White
Write-Host "   • Base de datos: finaizen_db" -ForegroundColor Gray
Write-Host "   • 11 tablas creadas" -ForegroundColor Gray
Write-Host "   • 3 usuarios de prueba" -ForegroundColor Gray
Write-Host "   • ~50 registros de ejemplo" -ForegroundColor Gray

Write-Host "`n🔐 Usuarios de prueba:" -ForegroundColor White
Write-Host "   Admin:  admin@finaizen.com  / admin123" -ForegroundColor Gray
Write-Host "   María:  maria@example.com   / maria123" -ForegroundColor Gray
Write-Host "   Carlos: carlos@example.com  / carlos123" -ForegroundColor Gray

Write-Host "`n🚀 Para iniciar los servidores:" -ForegroundColor White
Write-Host "   Terminal 1 (Backend):" -ForegroundColor Yellow
Write-Host "     cd backend" -ForegroundColor Gray
Write-Host "     npm run dev" -ForegroundColor Gray

Write-Host "`n   Terminal 2 (Frontend):" -ForegroundColor Yellow
Write-Host "     cd React\Proyecto_Finaizen" -ForegroundColor Gray
Write-Host "     npm run dev" -ForegroundColor Gray

Write-Host "`n📚 Documentación:" -ForegroundColor White
Write-Host "   • CONEXION_FRONTEND_BACKEND.md - Resumen completo" -ForegroundColor Gray
Write-Host "   • backend/API_DOCUMENTATION.md - Todos los endpoints" -ForegroundColor Gray
Write-Host "   • React/Proyecto_Finaizen/GUIA_MIGRACION_API.md - Guía paso a paso" -ForegroundColor Gray

Write-Host "`n¿Quieres iniciar los servidores ahora? (s/n): " -ForegroundColor Yellow -NoNewline
$startServers = Read-Host

if ($startServers -eq "s") {
    Write-Host "`nIniciando backend..." -ForegroundColor Yellow
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\backend'; npm run dev"
    
    Start-Sleep -Seconds 3
    
    Write-Host "Iniciando frontend..." -ForegroundColor Yellow
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\React\Proyecto_Finaizen'; npm run dev"
    
    Write-Host "`n✓ Servidores iniciados en nuevas ventanas" -ForegroundColor Green
    Write-Host "• Backend: http://localhost:5000" -ForegroundColor Gray
    Write-Host "• Frontend: http://localhost:5173" -ForegroundColor Gray
}

Write-Host "`n¡Listo para desarrollar! 🎉`n" -ForegroundColor Green
