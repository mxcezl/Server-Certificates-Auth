# Côté serveur
## Creation clé et certificat d'autorité
**openssl req -new -x509 -days 9999 -config openssl.cnf -keyout ca-key.pem -out ca-crt.pem**

## Création de la clé privée du serveur
**openssl genrsa -out server-key.pem 4096**

## Génération de la demande de signature du certificat (Certificat Signin Request)
**openssl req -new -config server.cnf -key server-key.pem -out server-csr.pem**

## Signature de la demande en utilisant le certificat d'autorité
**openssl x509 -req -extfile server.cnf -days 999 -passin "pass:password" -in server-csr.pem -CA ca-crt.pem -CAkey ca-key.pem -CAcreateserial -out server-crt.pem**

# Côté client
## Génération des certificats
**openssl genrsa -out client1-key.pem 4096**
**openssl genrsa -out client2-key.pem 4096**

## Création d'une paire de demande de signatures de certificats pour les clients
**openssl req -new -config client1.cnf -key client1-key.pem -out client1-csr.pem**
**openssl req -new -config client2.cnf -key client2-key.pem -out client2-csr.pem**

## Signature des certificats clients avec la certificat d'autorité
**openssl x509 -req -extfile client1.cnf -days 999 -passin "pass:password" -in client1-csr.pem -CA ca-crt.pem -CAkey ca-key.pem -CAcreateserial -out client1-crt.pem**
**openssl x509 -req -extfile client2.cnf -days 999 -passin "pass:password" -in client2-csr.pem -CA ca-crt.pem -CAkey ca-key.pem -CAcreateserial -out client2-crt.pem**

## Vérification des certificats
**openssl verify -CAfile ca-crt.pem client1-crt.pem**
**openssl verify -CAfile ca-crt.pem client2-crt.pem**

Vous devriez avoir :
> client1-crt.pem: OK

# Création du CRL (Certificate Revoke List)

## Création de la base de données des certificats révoqués
**touch ca-database.txt**

## Révocation d'un certificat
**openssl ca -revoke client2-crt.pem -keyfile ca-key.pem -config openssl.cnf -cert ca-crt.pem -passin 'pass:password'**

## Mise à jour de la liste des certificats révoqués (CRL)
**openssl ca -keyfile ca-key.pem -cert ca-crt.pem -config openssl.cnf -gencrl -out ca-crl.pem -passin 'pass:password'**