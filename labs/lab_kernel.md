# Laboratorio: Explorando el kernel (lectura y experimentación segura)

Objetivo: entender internals del kernel sin modificarlo; usar `/proc`, `dmesg`, y herramientas de profiling.

Requisitos: acceso local a Linux.

Pasos:

1. Explora `/proc` y archivos relevantes:

```bash
ls -la /proc | head
cat /proc/cpuinfo
cat /proc/meminfo
```

2. Revisa mensajes del kernel:

```bash
dmesg | tail -n 50
```

3. Usa `perf` para perfilar un proceso simple (instala `linux-tools-common`):

```bash
sudo perf record -F 99 -a -- sleep 5
sudo perf report
```

4. (Opcional, avanzado) Compilar e inspeccionar un módulo kernel de ejemplo: solo si sabes lo que haces. Evita cargar módulos no confiables en sistemas críticos.

5. Observa scheduling y procesos:

```bash
ps aux --sort=-%cpu | head
cat /proc/<PID>/status
```

Resultados esperados: comprender cómo el kernel expone información y cómo recoger métricas básicas sin riesgo.
