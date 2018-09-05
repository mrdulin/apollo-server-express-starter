#!/bin/bash
openssl req \
    -newkey rsa:2048 \
    -x509 \
    -nodes \
    -keyout ./ssl/key.pem \
    -new \
    -out ./ssl/cert.pem \
    -subj /CN=apollo-server-express-starter \
    -reqexts SAN \
    -extensions SAN \
    -config <(cat /System/Library/OpenSSL/openssl.cnf \
        <(printf '[SAN]\nsubjectAltName=DNS:localhost')) \
    -sha256 \
    -days 3650
