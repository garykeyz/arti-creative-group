# ARTI Creative Group

Sitio corporativo bilingüe y demostración interactiva de ARTI. El contenido estático listo para publicar se encuentra en `dist/`. El proyecto no requiere Sites ni un servidor de aplicación: se sirve como archivos estáticos desde Cloudflare Pages.

## Desarrollo local

```sh
python3 -m http.server 8765 --directory dist
```

Abrir `http://localhost:8765/`. `python3 scripts/build-content.py` regenera `dist/index.html` a partir del contenido bilingüe. Los estilos y el comportamiento están en `dist/styles.css` y `dist/app.js`.

## Demo

`dist/demo/` contiene una adaptación independiente de la demo estática de [Artivo](https://github.com/garykeyz/artivo), revisión `3393b8145ee1af12af281ba6bd286705b27f71f5`. Utiliza un conjunto de muestra generado desde una base nueva e IndexedDB local. No hay cuentas, reservas, pagos, verificaciones ni cobertura reales. La versión pública no ofrece una perspectiva administrativa. La demo está en español; el sitio corporativo está disponible en español e inglés.

El código de producción y los datos locales de Artivo o Guest Star no forman parte de este sitio. Las imágenes de muestra de la demo pueden cargarse desde Unsplash; la imagen de Guest Star procede del sitio público del producto y se identifica como ilustración.

## Publicación

Cloudflare Pages sirve el contenido de `dist/`. Para una publicación manual desde una cuenta Cloudflare autorizada:

```sh
npx wrangler pages deploy dist --project-name arti-creative-group --branch main
```

El vínculo automático entre GitHub y Cloudflare requiere configurar una integración de Git o una credencial limitada de despliegue en el repositorio. No se incluyen credenciales en este proyecto. La conexión DNS requiere permisos sobre la zona correspondiente. El archivo `dist/_worker.js` redirige `www` al dominio principal y entrega los archivos mediante Cloudflare Pages.

## Identidad

El kit proporcionado está en `brand/kit/`, con indicaciones en `brand/IDENTIDAD.md`. Los archivos de clientes se facilitaron para este proyecto y se conservan con su transparencia y proporciones.
