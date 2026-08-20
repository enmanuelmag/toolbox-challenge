FROM node:14.21.3-alpine AS dependencies

WORKDIR /app

RUN corepack enable && corepack prepare yarn@1.22.22 --activate

COPY package.json yarn.lock .yarnrc ./
COPY apps/api/package.json apps/api/package.json
COPY apps/web/package.json apps/web/package.json
COPY packages/files-core/package.json packages/files-core/package.json

RUN yarn install --frozen-lockfile --ignore-engines

FROM node:14.21.3-alpine AS runtime

WORKDIR /app

ENV NODE_ENV=production

COPY --from=dependencies /app/node_modules ./node_modules
COPY apps/api ./apps/api
COPY packages/files-core ./packages/files-core

EXPOSE 3000

CMD ["node", "apps/api/src/server.js"]
