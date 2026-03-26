#!/usr/bin/env bash
# Empaqueta la app en un zip listo para distribuir
set -e
OUT=os-edu-app.zip
echo "Creando $OUT..."
zip -r "$OUT" . -x "*.git*" -x "node_modules/*" -x "*.DS_Store"
echo "Paquete creado: $OUT"
