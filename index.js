#!/usr/bin/env node

var program = require('commander');
var fs = require('fs');
var crypto = require('crypto');
var jwt = require('jsonwebtoken');

program.version('1.0.0');

// Indicates wether any commands were executed
var executed = false;

function MakePEMPrivateKey(keyPair)
{
    return `-----BEGIN PRIVATE KEY-----\n${Buffer.from(`308184020100301006072a8648ce3d020106052b8104000a046d306b0201010420${keyPair.getPrivateKey('hex')}a144034200${keyPair.getPublicKey('hex')}`, 'hex').toString('base64')}\n-----END PRIVATE KEY-----`;
}

function MakePEMPublicKey(keyPair)
{
    return `-----BEGIN PUBLIC KEY-----\n${Buffer.from(`3056301006072a8648ce3d020106052b8104000a034200${keyPair.getPublicKey('hex')}`, 'hex').toString('base64')}\n-----END PUBLIC KEY-----`;
}

// Keypair generation
program
    .command('genkeys')
    .description('Generates a new ES256 key pair for use in token creation')
    .option('--pub_key [filename]', 'Public key output file', 'jwt_cert.pem')
    .option('--priv_key [filename]', 'Private key output file', 'jwt_key.pem')
    .action(function(options) {
        // Generate RS256 keypair
        var key = crypto.createECDH('secp256k1');
        console.log('Generating key pair...');
        key.generateKeys();

        // Write to files
        console.log(`Writing private key to ${options.priv_key}`);
        fs.writeFileSync(options.priv_key, MakePEMPrivateKey(key));
        console.log(`Writing public key to ${options.pub_key}`);
        fs.writeFileSync(options.pub_key, MakePEMPublicKey(key));

        console.log('Done.');
        executed = true;
    });

// Token generation
program
    .command('token <identifier> [permissions...]')
    .description('Generates access token for EACS')
    .option('--priv_key [filename]', 'Private key file', 'jwt_key.pem')
    .action(function(identifier, permissions, options) {
        executed = true;

        var payload = {
            identifier,
            permissions
        };

        console.log(`Token payload:`);
        console.log(payload);

        console.log('Reading private key file...');
        try {
            var key = fs.readFileSync(options.priv_key);
        } catch (e) {
            console.log(`Error reading private key file: ${e}`);
        }

        console.log('Signing token...')
        let token = jwt.sign(payload, key, {
            algorithm: 'ES256',
            noTimestamp: true
        }, function(err, token) {
            if (err)
                console.log(`Error signing token: ${err}`);
            else
                console.log(`Token:\n${token}`);
        });
    });

// Parse arguments
program.parse(process.argv);

// Print help if no command is executed
if (!executed) {
    program.help();
}
