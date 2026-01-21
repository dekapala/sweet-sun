# Sweet Sun Deco - Cotizador Web

Este proyecto ha sido organizado como una aplicación moderna de React + Vite.

## Cómo empezar

1.  Abre una terminal en esta carpeta.
2.  Instala las dependencias:
    ```bash
    npm install
    ```
3.  Inicia el servidor de desarrollo:
    ```bash
    npm run dev
    ```

## Estructura de Archivos

-   **src/**: Contiene todo el código fuente.
    -   **components/**: Componentes de React (el formulario principal).
    -   **App.jsx**: Componente principal.
    -   **main.jsx**: Punto de entrada.
-   **public/**: Archivos estáticos como el logo.
-   **legacy/**: Archivos antiguos (backup).

## Despliegue en Cloudflare Pages

1.  Ejecuta el comando de construcción:
    ```bash
    npm run build
    ```
2.  Esto generará una carpeta `dist`.
3.  Sube la carpeta `dist` a Cloudflare Pages, o conecta tu repositorio de GitHub y Cloudflare detectará automáticamente la configuración de Vite.

## Cambios Realizados

-   Se eliminó la opción "Lino natural".
-   Se eliminó la opción "Con ollaos".
-   La opción "Lisa" solo aparece si el sistema NO es Riel (es decir, Barral o sistema existente).
-   Se eliminó "Arrastre completo".
-   Colores: Se cambió a selección entre "Blanco Tiza" y "Crudo".
-   Se eliminó la sección de Presupuesto.
-   Funcionalidad de WhatsApp: Se agregó un botón al finalizar para enviar la info al cliente.
-   Funcionalidad de Email: Se genera un enlace `mailto` con toda la información precargada.
