# Convenciones del proyecto

Este documento es una propuesta inicial. Describe lo que el código ya hace en su mayoría y deja marcado lo que falta decidir. Si cambia una regla, se cambia acá primero.

## Estructura de `src/`

- `pages/`: rutas del sitio. Cada archivo es una URL.
- `layouts/` y `components/`: piezas de interfaz reutilizables.
- `scripts/`: código de cliente que lee y escribe el DOM de una página (los `render*`).
- `services/`: lógica de la aplicación que coordina varias piezas.
- `lib/`: el motor contable (`LedgerManager`) y las guardas, sin nada de interfaz.
- `repositories/`: acceso a los datos (IndexedDB). Es el único lugar que sabe cómo se guardan.
- `utils/`: funciones genéricas que no dependen del resto (`url`, `crypto`, `delay`).
- `types/`: tipos compartidos.
- `constants/` y `data/`: valores fijos y datos de ejemplo.

## Nombres

- Archivos que exportan una clase, un tipo o un componente: PascalCase (`LedgerManager.ts`, `IndexedDBRepository.ts`, `Button.astro`).
- Archivos que exportan funciones: camelCase (`authGuard.ts`, `url.ts`).
- Archivos dentro de `src/pages/`: minúsculas con guiones (`mi-pagina.astro`), porque el nombre forma parte de la URL.
- Tipos e interfaces: PascalCase, sin prefijos ni guiones bajos (`BuildUrlOptions`, no `a_target`).
- Tests: junto al archivo que prueban, con el sufijo `.test.ts` (`url.test.ts`).

## Idioma

Falta decidir una regla única (ver "Por decidir"). Mientras tanto, en un archivo que ya existe se sigue el idioma que ese archivo usa, y los textos que ve la persona usuaria van siempre en español.

## Importaciones

- Se usan los alias de `tsconfig.json` (`@lib/`, `@utils/`, ...) en lugar de rutas relativas largas.
- Los tipos se importan con `import type`.

## Dirección de las dependencias

Cada capa solo puede usar las que están por debajo:

1. `pages`, `components`, `layouts`, `scripts`
2. `services`
3. `lib`
4. `repositories`
5. `utils`, `types`, `constants`

Por ejemplo, un repositorio nunca importa un servicio ni un componente.

## Cómo se controla

- Formato: `pnpm format` (Prettier). El CI corre `pnpm format:check`.
- Tipos: `pnpm check`.
- Nombres de archivo: `pnpm lint` (regla `unicorn/filename-case` en `.oxlintrc.json`).
- Tests: `pnpm test`.
- El resto (idioma, dirección de las dependencias) se revisa a mano en cada PR hasta que exista una regla automática.

## Flujo de trabajo

- Se trabaja en `dev` y se integra a `principal` con un pull request.
- El CI tiene que pasar antes de integrar.

## Por decidir

- Idioma de los identificadores: todo en inglés (con los textos de interfaz en español) o español para el vocabulario contable.
- Si los `render*` reciben el motor contable por parámetro o lo importan directamente.
- Nombres de las carpetas dentro de `components/`: hoy están en PascalCase y el resto de `src/` en minúscula.
