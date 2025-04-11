# Etapa de build
FROM node:22.14.0-alpine AS builder

WORKDIR /app

# Copia arquivos de dependência
COPY package*.json ./
COPY prisma ./prisma

# Instala dependências
RUN npm install

# Gera tipos do Prisma
RUN npx prisma generate

# Copia o restante do código
COPY . .

# Desativa lint no build (evita falhas com ESLint)
ENV NEXT_DISABLE_ESLINT=true

# Gera build de produção do Next.js
RUN npm run build


# Etapa final de produção
FROM node:22.14.0-alpine

WORKDIR /app

# Copia apenas o necessário da etapa de build
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/next.config.js ./next.config.js
COPY --from=builder /app/prisma ./prisma

EXPOSE 3000

CMD ["npm", "start"]
