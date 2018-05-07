#!/usr/bin/env node

var program = require('commander');
var fs = require('fs');
var NodeRSA = require('node-rsa');
var jwt = require('jsonwebtoken');

program.version('1.0.0');

// Indicates wether any commands were executed
var executed = false;

// Keypair generation
program
    .command('genkeys')
    .description('Generates a new RS256 key pair for use in token creation')
    .option('--pub_key [filename]', 'Public key output file', 'jwt.pem')
    .option('--priv_key [filename]', 'Private key output file', 'jwt.key')
    .action(function(options) {
        // Generate RS256 keypair
        var key = new NodeRSA();
        console.log('Generating key pair...');
        key.generateKeyPair();

        // Write to files
        console.log(`Writing private key to ${options.priv_key}`);
        fs.writeFileSync(options.priv_key, key.exportKey('private'));
        console.log(`Writing public key to ${options.pub_key}`);
        fs.writeFileSync(options.pub_key, key.exportKey('public'));

        console.log('Done.');
        executed = true;
    });

// Token generation
program
    .command('token <identifier> [permissions...]')
    .description('Generates access token for EACS')
    .option('--priv_key [filename]', 'Private key file', 'jwt.key')
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
            algorithm: 'RS256',
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
