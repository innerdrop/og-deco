# Guía de Actualización - OG Deco (Producción)

Este documento sirve como guía para actualizar la web en producción cada vez que hagas cambios locales.

---

## 🚀 Pasos para Actualizar

### 1. Subir cambios a GitHub (desde tu computadora)

```bash
cd "C:\Users\Mauro\Desktop\OG Deco"
git add .
git commit -m "Descripción breve del cambio"
git push origin main
```

### 2. Actualizar en el VPS (servidor Hostinger)

Conectate por SSH y ejecutá:

```bash
cd /var/www/og-deco
git pull origin main
npm install
npm run build
pm2 restart og-deco-site
```

---

## 🛠️ Comandos Útiles en el VPS

| Comando | Descripción |
|---------|-------------|
| `pm2 status` | Ver si la app está corriendo |
| `pm2 logs og-deco-site` | Ver logs en tiempo real |
| `pm2 restart og-deco-site` | Reiniciar la aplicación |

---

## ⚠️ Notas

- Si cambiaste la estructura de la base de datos (Prisma), ejecutá `npx prisma db push` antes del `npm run build`.
- El nombre del proceso en PM2 es `og-deco-site` (verificalo con `pm2 status`).
