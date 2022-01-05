#!/bin/bash
openssl req -x509 -newkey rsa:4096 -keyout ../keys/server/server_key.pem -out ../keys/server/server_cert.pem -nodes -days 365 -subj "/CN=INSA/O=FISA4"