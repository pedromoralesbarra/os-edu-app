# Laboratorio: Conceptos básicos de redes

Objetivo: practicar con `ping`, `traceroute`, `ip`, `ss` y `tcpdump` para entender conectividad y análisis de paquetes.

Requisitos: un equipo Linux (o WSL) y privilegios para ejecutar `tcpdump`.

Pasos:

1. Obtén la IP de tu máquina:

```bash
ip addr show
```

2. Haz ping a un host público (ej. `8.8.8.8`):

```bash
ping -c 4 8.8.8.8
```

Observa tiempos y pérdida de paquetes.

3. Usa `traceroute` para ver la ruta:

```bash
traceroute 8.8.8.8
```

4. Lista conexiones y escucha de puertos:

```bash
ss -tuln
```

5. Captura paquetes con `tcpdump` (requiere sudo):

```bash
sudo tcpdump -i any icmp -c 20 -w ping_capture.pcap
```

Abre `ping_capture.pcap` con Wireshark o inspección con `tcpdump -r`.

6. Observa ARP en la LAN:

```bash
arp -a
```

Resultados esperados: entender RTT, saltos intermedios, puertos en escucha y ver paquetes ICMP en la captura.

Precaución: no captures tráfico de terceros sin permiso.
