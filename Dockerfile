# Estágio 1: Build da aplicação Vite / React
FROM node:20-alpine AS build
WORKDIR /app

# Copiar dependências e instalar
COPY package*.json ./
RUN npm ci

# Copiar código fonte
COPY . .

# Declarar os ARGs de build passados pelo Coolify
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_ANON_KEY
ARG VITE_GEMINI_API_KEY
ARG VITE_GEMINI_MODEL=gemini-2.5-pro
ARG VITE_OPENAI_API_KEY
ARG VITE_META_APP_ID
ARG VITE_META_APP_SECRET
ARG VITE_EVOLUTION_API_URL
ARG VITE_EVOLUTION_API_KEY
ARG VITE_EVOLUTION_INSTANCE=afiliado-ai

# Criar o arquivo .env explicitamente para garantir que o Vite encontre as variáveis
# (Vite lê o .env no processo de build — ENV do Docker sozinho não é suficiente)
RUN echo "VITE_SUPABASE_URL=${VITE_SUPABASE_URL}" > .env && \
    echo "VITE_SUPABASE_ANON_KEY=${VITE_SUPABASE_ANON_KEY}" >> .env && \
    echo "VITE_GEMINI_API_KEY=${VITE_GEMINI_API_KEY}" >> .env && \
    echo "VITE_GEMINI_MODEL=${VITE_GEMINI_MODEL}" >> .env && \
    echo "VITE_OPENAI_API_KEY=${VITE_OPENAI_API_KEY}" >> .env && \
    echo "VITE_META_APP_ID=${VITE_META_APP_ID}" >> .env && \
    echo "VITE_META_APP_SECRET=${VITE_META_APP_SECRET}" >> .env && \
    echo "VITE_EVOLUTION_API_URL=${VITE_EVOLUTION_API_URL}" >> .env && \
    echo "VITE_EVOLUTION_API_KEY=${VITE_EVOLUTION_API_KEY}" >> .env && \
    echo "VITE_EVOLUTION_INSTANCE=${VITE_EVOLUTION_INSTANCE}" >> .env

# Build da aplicação — o Vite irá ler o .env criado acima
RUN npm run build

# Estágio 2: Servidor Nginx para a SPA
FROM nginx:alpine AS runner
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
