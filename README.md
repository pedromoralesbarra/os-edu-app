# OS & Computer Explorer

Pequeña aplicación educativa para aprender sobre hardware, software y sistemas operativos.

Cómo ejecutar:

1. Abrir `c:/Users/Admin/Desktop/aprendiendo/os-edu-app/index.html` en tu navegador.
2. Navegar por las secciones y probar el quiz.

Abrir desde el celular (opciones):

- Servicio local (recomendado para pruebas): abre una terminal en la carpeta `os-edu-app` y ejecuta:

```bash
python -m http.server 8000
```

Desde tu celular conectado a la misma red, abre `http://<TU_IP_LOCAL>:8000/` (reemplaza `<TU_IP_LOCAL>` por la IP de tu PC, p.ej. `192.168.1.10`).

- Usar Live Server (VS Code): instala la extensión `Live Server`, abre el proyecto y pulsa `Go Live`. Luego abre la URL en tu celular.

- Publicar en GitHub Pages: sube este repositorio a GitHub y activa Pages para servir `index.html` públicamente.

Instalación en la pantalla de inicio (PWA):

- En Android/Chrome: al servir la app vía HTTP(S) verás la opción “Añadir a pantalla de inicio” o el navegador mostrará el banner si cumples requisitos. Selecciona y la app se abrirá en modo standalone.
- En iOS/Safari: abre la URL, toca el botón de compartir y elige "Agregar a pantalla de inicio" (no usa el manifest por completo pero funciona como acceso directo).

Nota: para que el modo offline / instalación funcionen, sirve el sitio mediante HTTP(S) (no `file://`) y asegúrate de que `service-worker.js` esté accesible en la misma ruta.

Despliegue automático en GitHub Pages:

1. Crea un repositorio en GitHub y sube todo el contenido de `os-edu-app`.
2. Asegúrate de que la rama principal se llame `main` (o ajusta la acción en `.github/workflows/gh-pages.yml`).
3. La acción `gh-pages.yml` está incluida y subirá el contenido del repositorio a GitHub Pages automáticamente al hacer push.
4. Tras el primer push, en la pestaña "Pages" del repositorio aparecerá la URL pública donde tu app estará disponible; esa URL puede instalarse en móviles como PWA.

Consejo de pruebas local: usa `python -m http.server` para servir localmente y prueba la instalación desde el móvil antes de publicar.

Publicar desde tu equipo (automatizado):

- Opción 1 — usando `gh` (GitHub CLI): instala https://cli.github.com/ y luego ejecuta (reemplaza `usuario/repo`):

```bash
./deploy.sh usuario/repo
```

- Opción 2 — PowerShell (Windows):

```powershell
.\deploy.ps1 -Repo "usuario/repo"
```

Ambos scripts crearán el repositorio (si no existe) y subirán el contenido. La acción en `.github/workflows/gh-pages.yml` desplegará el sitio en Pages automáticamente.

Si no quieres usar `gh`, puedes crear el repositorio manualmente en GitHub, añadir el remoto y hacer `git push origin main`.

Pruebas y empaquetado
--------------------

Validar datos de lecciones:

```bash
python tests/validate_lessons.py
```

Esto comprueba la integridad básica de `data/lessons.js` (presencia de quizzes, ids únicos, etc.).

Empaquetar para distribución (genera `os-edu-app.zip`):

```bash
./package.sh    # Unix / WSL
powershell .\package.ps1  # Windows PowerShell
```

Notas de pruebas: `tests/validate_lessons.py` es un script sencillo; puedes integrarlo en un pipeline de CI si quieres validación automática al hacer push.

Labs prácticos
--------------

He añadido laboratorios en la carpeta `labs/` con ejercicios guiados sobre redes, seguridad y exploración del kernel:

- `labs/lab_networking.md` — comandos `ping`, `traceroute`, `tcpdump`, `ss`.
- `labs/lab_security.md` — reglas de firewall (`ufw`), 2FA y revisión de logs.
- `labs/lab_kernel.md` — inspección de `/proc`, `dmesg`, y profiling con `perf`.

Estos labs están pensados para ser ejecutados en entornos de prueba o máquinas personales; evita ejecutarlos en sistemas de producción sin respaldo.

Siguientes mejoras sugeridas:
- Añadir más quizzes y ejercicios interactivos por sección.
- Diagramas interactivos (canvas/SVG) para explicar buses, memoria y llamadas al sistema.
- Modo de estudio guiado y seguimiento del progreso.

Si quieres, implemento las mejoras y preparo un servidor local con `npm` o `python -m http.server`.
