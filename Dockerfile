# 1. Base image (Node.js official image)
FROM node:20

# 2. Create a non-root user and set up the working directory
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 express
WORKDIR /app

# 3. Copy package.json and package-lock.json first (for caching)
COPY package*.json ./

# 4. Install dependencies (only production ones for smaller image)
RUN npm install --production

# 5. Copy the rest of your source code and set ownership
COPY . .
RUN chown -R express:nodejs /app

# 6. Switch to the non-root user
USER express

# 7. Expose the backend port
EXPOSE 8080

# 8. Start your app
CMD [ "node", "server.js" ]