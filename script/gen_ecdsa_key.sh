openssl ecparam -genkey -name secp256k1 -noout -out jwt_private_key.pem
openssl ec -in jwt_private_key.pem -pubout -out jwt_public_key.pem