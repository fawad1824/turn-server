# Use the official Node.js image as the base image
FROM node:16

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json files
COPY package*.json ./

# Install the dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Copy .env.example to .env (if .env doesn't exist)
#RUN cp .env.example .env || true

# Expose the port that the application will run on

EXPOSE 3478
EXPOSE 3478/udp


# Start the application
CMD ["npm", "start"]

# Start the TURN server
#CMD [ "node", "server.js" ]
