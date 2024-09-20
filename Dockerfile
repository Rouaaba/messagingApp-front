# Use a base image with Node.js
FROM node:14

# Set the working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application
COPY . .

# Build the app (adjust this if needed)
RUN npm run build

# Expose the port the app runs on (adjust if different)
EXPOSE 3000

# Command to run the app
CMD ["npm", "start"]

