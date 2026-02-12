
# ===============================
# Stage 1: Build
# ===============================
FROM node:20-alpine AS build

WORKDIR /app
ARG DB_HOST
ENV DB_HOST=$DB_HOST

ARG DB_USER
ENV DB_USER=$DB_USER

ARG DB_PASSWORD
ENV DB_PASSWORD=$DB_PASSWORD

ARG DB_NAME
ENV DB_NAME=$DB_NAME

ARG PORT
ENV PORT=$PORT

ARG JWT_SECRET
ENV JWT_SECRET=$JWT_SECRET

ARG SMTP_HOST
ENV SMTP_HOST=$SMTP_HOST

ARG SMTP_PORT
ENV SMTP_PORT=$SMTP_PORT

ARG SMTP_SECURE
ENV SMTP_SECURE=$SMTP_SECURE

ARG SMTP_USER
ENV SMTP_USER=$SMTP_USER

ARG SMTP_PASS
ENV SMTP_PASS=$SMTP_PASS

ARG SMTP_FROM
ENV SMTP_FROM=$SMTP_FROM

# Copy dependency manifests first (better caching)
COPY package.json package-lock.json ./

# Install all dependencies (including dev for TypeScript)
RUN npm ci

# Copy source code
COPY . .

# Compile TypeScript → dist/
RUN npm run build


# ===============================
# Stage 2: Production Runtime
# ===============================
FROM node:20-alpine

WORKDIR /app

# Set production environment
ENV NODE_ENV=production

# Copy only dependency manifests
COPY package.json package-lock.json ./

# Install ONLY production dependencies
RUN npm ci --omit=dev

# Copy compiled JS from build stage
COPY --from=build /app/dist ./dist

# Backend port (must match app.listen)
EXPOSE 5000

# Start backend
CMD ["node", "dist/server.js"]



