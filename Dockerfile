FROM node:23.7.0
WORKDIR /app

COPY . .

# Install production dependencies
RUN npm install --omit=dev

# Expose the desired port
EXPOSE 3093

# Start the application
CMD ["npm", "start"]
