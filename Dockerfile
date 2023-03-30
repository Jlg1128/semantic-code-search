FROM node:16

# We have to install nodemon globally before moving into the working directory
RUN npm install -g pnpm
RUN npm install -g nodemon

# Create app directory
WORKDIR /usr/src/semantic-code-search

# Install app dependencies
COPY . .

RUN pnpm install