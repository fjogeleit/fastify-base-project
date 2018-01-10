# Installation

```
npm install
```

## Configuration

* Copy and rename .env.default to .env
* Add your parameters

## Create your PEM files

Create your public and private key for the JWT signature:

```
$ openssl genrsa -out config/jwt/private.pem -aes256 4096
$ openssl rsa -pubout -in config/jwt/private.pem -out config/jwt/public.pem
```

## Start

Use nodemon to restart the application after any change (includes the .env file)

```
npm start
```

# Swagger UI

Overview of all existing routes via Swagger UI. Port 3000 is the default, it could be different from your .env Configuration

```
http://localhost:3000/documentation
``

# Features

* JWT Authentification with PEM file based signature and passphrase
* Base User Model
* API Routes for registration and login
* Example for Authorized and Unauthorized API access
* Swagger UI
* Mongoose as ODM