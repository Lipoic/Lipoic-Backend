FROM node:16

# Create app directory.
WORKDIR /usr/src/app

# Bundle app source.
COPY . .

# Install app dependencies.
RUN yarn install

# Generate the swagger file.
RUN yarn swagger

EXPOSE 8080

CMD ["yarn", "start"]