FROM node:slim
RUN apt-get update && apt-get install -y texlive-latex-extra 

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files to the container
COPY . .

# Expose a port
EXPOSE 3000

# Define the command to start the server
CMD ["npm", "start"]
