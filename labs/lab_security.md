# Laboratorio: Seguridad básica y firewalls

Objetivo: aprender a usar `ufw` o `iptables/nftables` para crear reglas básicas y probar autenticación 2FA con servicios en la nube o localmente.

Requisitos: privilegios de administrador.

Pasos (ejemplo con `ufw` en Ubuntu):

1. Habilitar `ufw` y permitir SSH:

```bash
sudo ufw allow ssh
sudo ufw enable
sudo ufw status verbose
```

2. Bloquear un puerto y comprobar:

```bash
sudo ufw deny 8080
sudo ufw status numbered
```

3. Prueba con `nmap` desde otra máquina para ver puertos abiertos:

```bash
nmap -Pn <IP_LOCAL>
```

4. Practica con 2FA: configura una cuenta en un servicio que soporte TOTP (Authy/Google Authenticator) y activa 2FA. Comprueba flujo de recuperación.

5. Revisa logs de autenticación (`/var/log/auth.log` en Debian/Ubuntu) para ver intentos y bloqueos.

Precaución: no bloquees tu propia conexión SSH sin recuperar acceso.
