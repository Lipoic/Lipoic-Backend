FROM node:16

# Create app directory
WORKDIR /usr/src/app

# Copy app dependencies
COPY package.json ./
COPY yarn.lock ./
COPY tsconfig.json ./
COPY .env ./

RUN yarn install

# Bundle app source
COPY . .

EXPOSE 8080

CMD ["yarn", "start"]