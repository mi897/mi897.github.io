# === Stage 1: Build the Astro site ===
FROM node:20-alpine AS builder

# Install pnpm and a static file server globally
RUN npm install -g pnpm http-server

# Set working directory
WORKDIR /app

# Copy only lockfile and package files first (for better caching)
COPY pnpm-lock.yaml package.json ./

# Install dependencies
RUN pnpm install

# Copy the rest of your project files
COPY . .

# Build the site
RUN npm run build

# Expose port
EXPOSE 8080

# Serve the site
CMD ["http-server", "dist/"]
