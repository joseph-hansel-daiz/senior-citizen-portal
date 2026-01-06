# Stage 1: Build the Next.js application
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Stage 2: Production image
FROM node:18-alpine AS runner

WORKDIR /app

ENV NODE_ENV production
ENV PORT 3001
ENV HOSTNAME "0.0.0.0"

# Copy package files
COPY package.json package-lock.json* ./

# Install production dependencies only
RUN npm ci --only=production

# Copy built application from builder
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# Expose port 3001
EXPOSE 3001

# Start the application
CMD ["node", "server.js"]

