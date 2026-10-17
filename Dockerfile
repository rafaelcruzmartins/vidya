# Stage 1: Build frontend
FROM node:20-alpine AS frontend-builder
WORKDIR /src

COPY package.json package-lock.json* ./
COPY backend/package.json ./backend/
RUN npm ci

COPY public/ ./public/
COPY src/ ./src/
RUN npm run build

# Stage 2: Install backend production dependencies (standalone, no workspace)
FROM node:20-alpine AS backend-deps
WORKDIR /deps
COPY backend/package.json ./
RUN npm install --production

# Stage 3: Final runtime image
FROM node:20-alpine
WORKDIR /app

COPY --from=frontend-builder /src/build ./build
COPY backend/ ./backend/
COPY --from=backend-deps /deps/node_modules ./backend/node_modules
# O pacote instala o ffprobe com permissão 0744: sem isso, rodando como
# usuário comum (ex.: user: 1000:1000), toda duração de aula vira 0
RUN chmod 755 /app/backend/node_modules/@ffprobe-installer/linux-x64/ffprobe
COPY assets/ /app/defaults/
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Metadados usados quando a imagem é construída como add-on do Home Assistant
LABEL io.hass.type="addon" io.hass.arch="amd64"

EXPOSE 31415
ENV VIDYA_DATA_PATH=/data
ENV PORT=31415

VOLUME ["/data"]

ENTRYPOINT ["/entrypoint.sh"]
