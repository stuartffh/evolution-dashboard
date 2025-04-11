# Etapa 1 - Build da aplicação
FROM node:18-alpine AS builder

# Diretório de trabalho dentro do container
WORKDIR /app

# Copia os arquivos de dependências
COPY package*.json ./

# Instala dependências (sem devDependencies por enquanto)
RUN npm install

# Copia o restante da aplicação
COPY . .

# Build do Next.js
RUN npm run build

# Etapa 2 - Executar com Next.js Production
FROM node:18-alpine

# Diretório de trabalho
WORKDIR /app

# Copia apenas o necessário da build anterior
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/next.config.js ./next.config.js

# Expõe a porta padrão do Next.js
EXPOSE 3000

# Comando para iniciar o Next.js
CMD ["npm", "start"]
