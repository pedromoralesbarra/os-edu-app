#!/usr/bin/env bash
# Script de ayuda para publicar en GitHub (requiere gh CLI y git configurados)
# Uso: ./deploy.sh <owner/repo>
set -e
if [ -z "$1" ]; then
  echo "Uso: ./deploy.sh <owner/repo>"
  exit 1
fi
REPO="$1"
# inicializar repo local si no existe
if [ ! -d .git ]; then
  git init
  git add .
  git commit -m "Initial commit: OS Explorer"
fi
# crea el repo en GitHub (si no existe)
if ! gh repo view "$REPO" >/dev/null 2>&1; then
  gh repo create "$REPO" --public --source=. --remote=origin --push
else
  echo "Repositorio ya existe en GitHub: $REPO"
  git remote add origin "https://github.com/$REPO.git" 2>/dev/null || true
  git push -u origin HEAD
fi

echo "Listo. La acción de GitHub Pages en .github/workflows/gh-pages.yml debería publicar el sitio automáticamente."