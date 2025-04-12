# Etapa de build
FROM node:22.14.0-alpine AS builder

WORKDIR /app

# Copia configs e pacotes primeiro (melhora cache)
COPY package*.json ./
COPY tsconfig.json ./
COPY eslint.config.mjs ./
COPY .env ./

# Copia os arquivos do Prisma
COPY prisma ./prisma

# Instala dependências
RUN npm install
RUN npm install --save-dev @types/cookie

# Gera tipos do Prisma
RUN npx prisma generate

# Copia o restante do código do projeto
COPY . .


# Gera build de produção do Next.js
RUN npm run build


# Etapa final de produção
FROM node:22.14.0-alpine

WORKDIR /app

# Copia apenas os arquivos necessários da etapa de build
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/prisma ./prisma

EXPOSE 3000

CMD ["npm", "start"]
