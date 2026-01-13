# Script de pruebas para la API REST
# Ejecutar con: .\test-api.ps1

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "PRUEBAS DE API REST - FINAIZEN" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$baseUrl = "http://localhost:3000"

# Función para hacer peticiones y mostrar resultados
function Test-Endpoint {
    param(
        [string]$Method,
        [string]$Url,
        [string]$Description,
        [object]$Body = $null
    )
    
    Write-Host "$Description" -ForegroundColor Yellow
Write-Host "Metodo: $Method" -ForegroundColor Gray
    Write-Host "   URL: $Url" -ForegroundColor Gray
    
    try {
        $params = @{
            Uri = $Url
            Method = $Method
            ContentType = "application/json"
        }
        
        if ($Body) {
            $params.Body = ($Body | ConvertTo-Json)
            Write-Host "   Body: $($params.Body)" -ForegroundColor Gray
        }
        
        $response = Invoke-RestMethod @params
        Write-Host "   OK Status: OK" -ForegroundColor Green
        Write-Host "   Respuesta:" -ForegroundColor Green
        Write-Host ($response | ConvertTo-Json -Depth 5) -ForegroundColor White
    }
    catch {
        Write-Host "   ERROR: $($_.Exception.Message)" -ForegroundColor Red
    }
    
    Write-Host ""
    Start-Sleep -Milliseconds 500
}

# TEST 1: Informacion de la API
Test-Endpoint -Method "GET" -Url "$baseUrl/" -Description "Informacion general de la API"

# TEST 2: Obtener todos los items
Test-Endpoint -Method "GET" -Url "$baseUrl/items" -Description "Obtener todos los items (GET /items)"

# TEST 3: Obtener item por ID
Test-Endpoint -Method "GET" -Url "$baseUrl/items/1" -Description "Obtener item por ID (GET /items/1)"

# TEST 4: Crear nuevo item
$newItem = @{
    name = "Item de Prueba PowerShell"
    description = "Creado desde script de pruebas"
}
Test-Endpoint -Method "POST" -Url "$baseUrl/items" -Description "Crear nuevo item (POST /items)" -Body $newItem

# TEST 5: Verificar creación
Test-Endpoint -Method "GET" -Url "$baseUrl/items" -Description "Verificar que se creó el nuevo item"

# TEST 6: Actualizar item
$updateItem = @{
    name = "Item Actualizado desde PowerShell"
    description = "Descripción modificada"
}
Test-Endpoint -Method "PUT" -Url "$baseUrl/items/2" -Description "Actualizar item (PUT /items/2)" -Body $updateItem

# TEST 7: Eliminar item
Test-Endpoint -Method "DELETE" -Url "$baseUrl/items/1" -Description "Eliminar item (DELETE /items/1)"

# TEST 8: Verificar eliminación
Test-Endpoint -Method "GET" -Url "$baseUrl/items" -Description "Verificar que se eliminó el item"

# TEST 9: Intentar obtener item inexistente (debe dar 404)
Test-Endpoint -Method "GET" -Url "$baseUrl/items/999" -Description "Buscar item inexistente (debe dar 404)"

# TEST 10: Intentar crear item sin nombre (debe dar 400)
$invalidItem = @{
    description = "Item sin nombre"
}
Test-Endpoint -Method "POST" -Url "$baseUrl/items" -Description "Crear item inválido sin nombre (debe dar 400)" -Body $invalidItem

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "PRUEBAS COMPLETADAS" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
