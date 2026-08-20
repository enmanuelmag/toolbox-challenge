# File Viewer Challenge

Para completar este reto deicidí hacer uso de YARN, el cual me permite trabajar con workspaces y asi poder mantener un proyecto web y api dentro de `apps/`, con sus versiones de NodeJs mencionadas en el `package.json` de la raíz del proyecto.

> Mi laptop es una macbook con apple silicon, por loq ue para API si bien en Docker si uso NodeJs 14, en el package.json esta permitido usar NodeJs 16 para poder ejecutar el proyecto en mi máquina local. Pero en el api.Dockerfile si se hace uso de NodeJs 14, tal como se solicita en el reto.

Los workspaces son:

- apps/:
  - api: API que levanta un servidor express y expone los endpoints
  - web: la App en react que hace uso de los endpoints, la configuracion de webpack permite hacer fetch directamente con `/api/...` y no con `http://localhost:3000/api`. Esto tambien se configura dentro del Docker usando nginx para que haga de proxy y redireccione las peticiones a la api.
- packages/:
  - files-core: contiene la "logica" de negocio, y es consumida por el api. En un proyecto mas agrande aqui se usuarian agregando mas y mas casos de usos, que luego pueden ser reutilizados por diferentes interfaces; https como es est el caso o incluso MCP server como tambien me ha pasado en otros proyectos.

Normalmente siempre prefiero para mis proyectos usar Clean Architecture, es por esto que a pesar de que aqui no hay type (Typscript) aun asi decidio usar ese enfoque para simular y definir la arquitectura del proyecto.

Por otro lado, aunque no se puede usar tipado, en algunos lugares use JsDoc para documentar y dar un poco de types a ciertas funciones, ya que me gusta tener doc y algo de typing a pesar de estar en Js.

## Test

El proyecto cuenta con test unitarios y de integracion, para ejecutarlos se puede hacer uso de:

```bash
yarn test
```

## Evidencias

![Grabación](./Screen%20Recording%202026-08-19%20at%2021.23.54.mov)

## Instrucciones de uso

Para levantar el proyecto, primero se debe instalar las dependencias con:

```bash
yarn install
```

Luego se puede el api localmente con:

```bash
yarn start:api
```

Para levantar la app web localmente con:

```bash
yarn start:web
```

## Docker

Para levantar el proyecto completo con docker-compose:

```bash
docker compose up --build -d
```
