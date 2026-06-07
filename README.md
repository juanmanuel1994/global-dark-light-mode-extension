# Dark / White Mode

Activa el modo oscuro o claro en cualquier página web con un solo click.

## Instalación (2 minutos)

1. Abre Chrome y ve a `chrome://extensions/`
2. Activa **Modo desarrollador** (interruptor en la esquina superior derecha)
3. Click en **Cargar extensión sin empaquetar**
4. Selecciona la carpeta `dark-white-mode`
5. Verás el icono 🌙 en la barra de herramientas

## Cómo usar

- **Toggle global** — activa/desactiva el modo oscuro en todas las webs
- **Automático** — la web sigue la configuración global
- **☀️ Claro** — fuerza modo claro solo en esta web
- **🌙 Oscuro** — fuerza modo oscuro solo en esta web

Los ajustes se sincronizan entre dispositivos con tu cuenta de Chrome.

## Cómo funciona

Aplica un filtro CSS `invert + hue-rotate` sobre toda la página y re-invierte imágenes y vídeos para que se vean naturales.
