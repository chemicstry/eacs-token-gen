# eacs-token-gen

A simple tool for generating JWTs that are used to authenticate controllers on EACS.

## Installation

`npm install -g eacs-token-gen`

## Usage

### genkeys
```
$ eacs-token-gen genkeys --help

  Usage: genkeys [options]

  Generates a new ES256 key pair for use in token creation

  Options:

    --pub_key [filename]   Public key output file (default: jwt.pem)
    --priv_key [filename]  Private key output file (default: jwt.key)
    -h, --help             output usage information
```

### token
```
$ eacs-token-gen token --help

  Usage: token [options] <identifier> [permissions...]

  Generates access token for EACS

  Options:

    --priv_key [filename]  Private key file (default: jwt.key)
    -h, --help             output usage information
```

## Example

Following example generates a new ECC secp256k1 keypair and then uses these keys to sign a token which has permission to initialize keys on empty RFID tags on eacs-tag-auth service. Generated `jwt.pem` must be copied to services that use JWT authentication.

```
$ eacs-token-gen genkeys
Generating key pair...
Writing private key to jwt.key
Writing public key to jwt.pem
Done.

$ eacs-token-gen token master eacs-tag-auth:initializekey
Token payload:
{ identifier: 'master',
  permissions: [ 'eacs-tag-auth:initializekey' ] }
Reading private key file...
Signing token...
Token:
eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZGVudGlmaWVyIjoibWFzdGVyIiwicGVybWlzc2lvbnMiOlsiZWFjcy10YWctYXV0aDppbml0aWFsaXpla2V5Il19.OaYcHka599NE2JT-b8aolQfOkArjatFmg4Z1-KwIkK-OqELR1w2DOVl6pglsd3OVphv7ZuK35Ar5aBkGUHkUQy_fZmohb8KvpZzgo_7Uqq1ed2Mn97pb_QiJ4W4_MfeUyspWG_Y-1xmuowkZ2ZnENY1UAnfqK_JpVuFBosCOt8cK1-EcKMLvTHwxQSKYYaViS22OOTXhekagvc_vho7fbKHQI43tUPg4h-zNsy07z_RvVSjqUmPc_vYuKJ4ZTVlLjjKknFbHMCYWL4L2fGeZIm58QDgcZdquGLbavxMej3_rvoHgyvj6-3gZdFj7NCwjTw19tfL8v4-aNv9i07mdIg
```
