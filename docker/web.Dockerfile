FROM node:16.20.2-alpine AS build

WORKDIR /app

RUN corepack enable && corepack prepare yarn@1.22.22 --activate

COPY package.json yarn.lock .yarnrc ./
COPY apps/api/package.json apps/api/package.json
COPY apps/web/package.json apps/web/package.json
COPY packages/files-core/package.json packages/files-core/package.json

RUN yarn install --frozen-lockfile --ignore-engines

COPY apps/web ./apps/web

RUN yarn workspace @toolbox/web build

FROM nginx:1.27-alpine AS runtime

COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/apps/web/dist /usr/share/nginx/html

EXPOSE 80
