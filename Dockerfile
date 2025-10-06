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

# Remove dev dependencies and clean cache
RUN npm prune --production && npm cache clean --force

# Expose port (Railway will set PORT environment variable)
EXPOSE $PORT

# Start the application
CMD ["npm", "run", "start"]
