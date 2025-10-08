# 1. Base image (Node.js official image)
FROM node:20-alpine AS base

# 2. Create a non-root user and working directory
RUN addgroup --system nodejs && adduser --system express
WORKDIR /app

# 3. Copy only package files first for caching
COPY package*.json ./

# 4. Install production dependencies
RUN npm ci --only=production

# 5. Copy the rest of the application
COPY . .

# 6. Change ownership and switch user
RUN chown -R express:nodejs /app
USER express

# 7. Expose port (Cloud Run listens on $PORT, so use it)
EXPOSE 8080

# 8. Start the app
CMD ["node", "server.js"]
