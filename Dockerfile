# 1. Base image (Node.js official image)
FROM node:20

# 2. Set working directory inside the container
WORKDIR /app

# 3. Copy package.json and package-lock.json first (for caching)
COPY package*.json ./

# 4. Install dependencies (only production ones for smaller image)
RUN npm install --production

# 5. Copy the rest of your source code into the container
COPY . .

# 6. Expose the backend port (Cloud Run expects 8080)
EXPOSE 5000

# 7. Start your app
CMD ["npm", "start"]

