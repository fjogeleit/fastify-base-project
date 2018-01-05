# Installation

## Configuration

* Copy and rename .env.default to .env
* Add your parameters

## Create your PEM files

Create your public and private key for the JWT signatur:

```
$ openssl genrsa -out config/jwt/private.pem -aes256 4096
$ openssl rsa -pubout -in config/jwt/private.pem -out config/jwt/public.pem
```

# Features

* JWT Authentification with PEM signature and passphrase
* Base User Model
* API Routes for registration and login
* Example for Authorized and Unauthorized API access