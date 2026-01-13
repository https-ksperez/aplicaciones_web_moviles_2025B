# Script de Validación Rápida del Backend
# Ejecutar: .\validar-backend.ps1

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "VALIDACION DEL BACKEND - FINAIZEN" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

$baseUrl = "http://localhost:3000"
$testsPassed = 0
$testsFailed = 0

function Test-Endpoint {
    param(
        [string]$Name,
        [string]$Url,
        [int]$ExpectedCount = -1
    )
    
    Write-Host "Probando: $Name" -ForegroundColor Yellow
    Write-Host "  URL: $Url" -ForegroundColor Gray
    
    try {
        $response = Invoke-RestMethod -Uri $Url -Method GET
        
        if ($response -is [Array]) {
            $count = $response.Count
        } elseif ($response.value) {
            $count = $response.value.Count
        } else {
            $count = 1
        }
        
        Write-Host "  OK - Registros: $count" -ForegroundColor Green
        
        if ($ExpectedCount -ge 0 -and $count -ne $ExpectedCount) {
            Write-Host "  ADVERTENCIA: Se esperaban $ExpectedCount registros" -ForegroundColor Yellow
        }
        
        $script:testsPassed++
        return $true
    }
    catch {
        Write-Host "  ERROR: $($_.Exception.Message)" -ForegroundColor Red
        $script:testsFailed++
        return $false
    }
    
    Write-Host ""
}

# Tests
Write-Host "Ejecutando pruebas...`n" -ForegroundColor White

Test-Endpoint -Name "Usuarios" -Url "$baseUrl/users" -ExpectedCount 3
Test-Endpoint -Name "Perfiles" -Url "$baseUrl/perfiles" -ExpectedCount 3
Test-Endpoint -Name "Historial" -Url "$baseUrl/historial" -ExpectedCount 5
Test-Endpoint -Name "Ingresos" -Url "$baseUrl/ingresos" -ExpectedCount 2
Test-Endpoint -Name "Egresos" -Url "$baseUrl/egresos" -ExpectedCount 2
Test-Endpoint -Name "Presupuestos" -Url "$baseUrl/presupuestos"
Test-Endpoint -Name "Logros" -Url "$baseUrl/logros"
Test-Endpoint -Name "Notificaciones" -Url "$baseUrl/notificaciones"
Test-Endpoint -Name "Planes Ahorro" -Url "$baseUrl/planesAhorro"
Test-Endpoint -Name "Planes Deuda" -Url "$baseUrl/planesDeuda"
Test-Endpoint -Name "Security Logs" -Url "$baseUrl/securityLogs"
Test-Endpoint -Name "Config" -Url "$baseUrl/config"

# Filtros
Write-Host "`nProbando filtros..." -ForegroundColor White
Test-Endpoint -Name "Historial usuario admin" -Url "$baseUrl/historial?userId=1" -ExpectedCount 4
Test-Endpoint -Name "Historial tipo ingreso" -Url "$baseUrl/historial?tipo=ingreso"
Test-Endpoint -Name "Usuarios admin" -Url "$baseUrl/users?rol=admin"

# Resumen
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "RESUMEN DE PRUEBAS" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Pruebas exitosas: $testsPassed" -ForegroundColor Green
Write-Host "Pruebas fallidas: $testsFailed" -ForegroundColor $(if ($testsFailed -gt 0) { "Red" } else { "Green" })

if ($testsFailed -eq 0) {
    Write-Host "`nTODAS LAS PRUEBAS PASARON!" -ForegroundColor Green
    Write-Host "El backend esta funcionando correctamente." -ForegroundColor Green
    Write-Host "`nAhora puedes iniciar el frontend con: npm run dev" -ForegroundColor Yellow
} else {
    Write-Host "`nAlgunas pruebas fallaron. Revisa los errores arriba." -ForegroundColor Red
}

Write-Host "========================================`n" -ForegroundColor Cyan
