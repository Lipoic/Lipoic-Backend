FROM node:16

# Bundle app source.
COPY . .

# Install app dependencies.
RUN yarn install

# Generate ECDSA keys.
RUN chmod +x ./script/gen_ecdsa_key.sh
RUN ./script/gen_ecdsa_key.sh

EXPOSE 8080

CMD ["yarn", "start"]