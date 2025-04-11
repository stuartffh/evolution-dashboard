# Etapa 1 – Build da aplicação
FROM node:22.14.0-alpine AS builder

# Diretório de trabalho dentro do container
WORKDIR /app

# Copia apenas os arquivos de dependência
COPY package*.json ./

# Instala as dependências
RUN npm install

# Copia o restante dos arquivos
COPY . .

# Desativa ESLint no build (caso use regras rigorosas)
ENV NEXT_DISABLE_ESLINT=true

# Gera o build de produção
RUN npm run build

# Etapa 2 – Container final para rodar a aplicação
FROM node:22.14.0-alpine

WORKDIR /app

# Copia arquivos essenciais da build anterior
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/next.config.js ./next.config.js

# Define a porta padrão da aplicação
EXPOSE 3000

# Comando de inicialização
CMD ["npm", "start"]
