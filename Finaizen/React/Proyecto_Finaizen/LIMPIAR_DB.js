/**
 * SCRIPT PARA LIMPIAR LOCALSTORAGE Y RECARGAR DATOS
 * 
 * Ejecutar en la consola del navegador:
 * 
 * localStorage.removeItem('finaizen_mockdb');
 * location.reload();
 * 
 * Esto forzará la recarga de todos los datos con los logros actualizados
 */

console.log('%c🔧 LIMPIAR Y RECARGAR BASE DE DATOS', 'color: #ff6b6b; font-size: 16px; font-weight: bold;');
console.log('%c=================================', 'color: #ff6b6b;');
console.log('\n📋 Ejecuta estos comandos en orden:\n');
console.log('%c1. localStorage.removeItem("finaizen_mockdb");', 'color: #10b981; font-family: monospace;');
console.log('%c2. location.reload();', 'color: #10b981; font-family: monospace;');
console.log('\n💡 O ejecuta todo de una vez:\n');
console.log('%clocalStorage.removeItem("finaizen_mockdb"); location.reload();', 'color: #667eea; font-weight: bold; font-family: monospace; background: #f0f0f0; padding: 5px;');
// Opción 2: Limpiar todo el localStorage
localStorage.clear();
location.reload();

sessionStorage.clear();
localStorage.clear();
location.reload();