# Use standard Node.js 18 image for better compatibility
FROM node:18-slim

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies with legacy peer deps to avoid conflicts
RUN npm install --legacy-peer-deps

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Remove dev dependencies but keep serve
RUN npm prune --production && npm cache clean --force

# Expose port (Railway will set PORT environment variable)
EXPOSE $PORT

# Start the application with serve
CMD ["npm", "run", "start"]
