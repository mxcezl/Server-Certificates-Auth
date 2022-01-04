#!/bin/bash
name="$1"
if [ ! -n "$name" ]
then
	echo "Error \$name not set or NULL"
else
    mkdir ../keys/client/"$name"
    openssl req -newkey rsa:4096 -keyout ../keys/client/"$name"/"$name"_key.pem -out ../keys/client/"$name"/"$name"_csr.pem -nodes -days 365 -subj "/CN='$name'"
    openssl x509 -req -in ../keys/client/"$name"/"$name"_csr.pem -signkey ../keys/client/"$name"/"$name"_key.pem -out ../keys/client/"$name"/"$name"_cert.pem -days 365
    openssl pkcs12 -export -in ../keys/client/"$name"/"$name"_cert.pem -inkey ../keys/client/"$name"/"$name"_key.pem -out ../keys/client/"$name"/"$name".p12
fi