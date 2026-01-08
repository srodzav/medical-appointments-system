<?php
/**
 * SCRIPT DE EMERGENCIA - Limpia TODO el cache
 * 1. Sube este archivo a la raíz del backend
 * 2. Accede desde el navegador: https://demo-api.sebastianrdz.com/clear-all-cache.php
 * 3. BÓRRALO inmediatamente después
 */

echo "<pre>";
echo "🧹 LIMPIEZA COMPLETA DE CACHE\n";
echo str_repeat("=", 50) . "\n\n";

$basePath = __DIR__;
$cleared = 0;
$errors = 0;

// 1. Bootstrap cache
echo "📦 Limpiando bootstrap/cache...\n";
$files = glob($basePath . '/bootstrap/cache/*.php');
foreach ($files as $file) {
    if (basename($file) !== '.gitignore') {
        if (unlink($file)) {
            echo "  ✓ Eliminado: " . basename($file) . "\n";
            $cleared++;
        } else {
            echo "  ✗ Error: " . basename($file) . "\n";
            $errors++;
        }
    }
}

// 2. Framework views
echo "\n👁️  Limpiando storage/framework/views...\n";
$files = glob($basePath . '/storage/framework/views/*.php');
foreach ($files as $file) {
    if (basename($file) !== '.gitignore') {
        if (unlink($file)) {
            echo "  ✓ Eliminado: " . basename($file) . "\n";
            $cleared++;
        } else {
            echo "  ✗ Error: " . basename($file) . "\n";
            $errors++;
        }
    }
}

// 3. Framework cache
echo "\n💾 Limpiando storage/framework/cache...\n";
$cacheFiles = [];
if (is_dir($basePath . '/storage/framework/cache/data')) {
    $cacheFiles = glob($basePath . '/storage/framework/cache/data/*');
}
foreach ($cacheFiles as $file) {
    if (is_file($file) && basename($file) !== '.gitignore') {
        if (unlink($file)) {
            $cleared++;
        } else {
            $errors++;
        }
    }
}
echo "  ✓ Cache data limpiado\n";

// 4. Framework sessions
echo "\n🔐 Limpiando storage/framework/sessions...\n";
$sessionFiles = glob($basePath . '/storage/framework/sessions/*');
foreach ($sessionFiles as $file) {
    if (is_file($file) && basename($file) !== '.gitignore') {
        if (unlink($file)) {
            $cleared++;
        }
    }
}
echo "  ✓ Sessions limpiadas\n";

// 5. Composer autoload
echo "\n🎵 Regenerando autoload...\n";
if (file_exists($basePath . '/vendor/composer/installed.php')) {
    echo "  ✓ Composer está instalado\n";
}

echo "\n" . str_repeat("=", 50) . "\n";
echo "✅ Archivos eliminados: $cleared\n";
echo "❌ Errores: $errors\n";
echo "\n⚠️  IMPORTANTE: Ahora ejecuta estos comandos por SSH:\n";
echo "   composer dump-autoload --optimize\n";
echo "   php artisan config:cache\n";
echo "   php artisan route:cache\n";
echo "\n🔥 BORRA ESTE ARCHIVO INMEDIATAMENTE\n";
echo "</pre>";
