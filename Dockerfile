FROM node:16

# Bundle app source.
COPY . .

# Install app dependencies.
RUN yarn install

# Generate ECDSA keys.
RUN script/gen_ecdsa_key.sh

EXPOSE 8080

CMD ["yarn", "start"]