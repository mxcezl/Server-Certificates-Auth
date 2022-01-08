# Liste des commandes pour créer les clés, certificats et autres documents pour l'application

- [Liste des commandes pour créer les clés, certificats et autres documents pour l'application](#liste-des-commandes-pour-créer-les-clés-certificats-et-autres-documents-pour-lapplication)
  - [Côté serveur](#côté-serveur)
    - [Creation clé et certificat d'autorité](#creation-clé-et-certificat-dautorité)
    - [Création de la clé privée du serveur](#création-de-la-clé-privée-du-serveur)
    - [Génération de la demande de signature du certificat (Certificat Signin Request)](#génération-de-la-demande-de-signature-du-certificat-certificat-signin-request)
    - [Signature de la demande en utilisant le certificat d'autorité](#signature-de-la-demande-en-utilisant-le-certificat-dautorité)
  - [Côté client](#côté-client)
    - [Génération des certificats](#génération-des-certificats)
    - [Création d'une paire de demande de signatures de certificats pour les clients](#création-dune-paire-de-demande-de-signatures-de-certificats-pour-les-clients)
    - [Signature des certificats clients avec la certificat d'autorité](#signature-des-certificats-clients-avec-la-certificat-dautorité)
    - [Vérification des certificats](#vérification-des-certificats)
  - [Création du CRL (Certificate Revoke List)](#création-du-crl-certificate-revoke-list)
    - [Création de la base de données des certificats révoqués](#création-de-la-base-de-données-des-certificats-révoqués)
    - [Révocation d'un certificat](#révocation-dun-certificat)
    - [Mise à jour de la liste des certificats révoqués (CRL)](#mise-à-jour-de-la-liste-des-certificats-révoqués-crl)

Ici vous trouverez toutes les commandes que nous avons utilisé pour générer les certificats, aussi bien côté serveur, que côté client. Mais également les commandes utiles à la création et au maintient des certificats révoqués par le serveur.

La partie sur le serveur est présente uniquement à titre informative et peut être ignorée.

**Toutes les commandes sont à lancer depuis le répertoire principal.**

## Côté serveur

### Creation clé et certificat d'autorité

> **openssl req -new -x509 -days 9999 -config openssl.cnf -keyout ./ca/ca-key.pem -out ./ca/ca-crt.pem**

### Création de la clé privée du serveur

> **openssl genrsa -out ./server_keys/server-key.pem 4096**

### Génération de la demande de signature du certificat (Certificat Signin Request)

> **openssl req -new -config ./server_keys/server.cnf -key ./server_keys/server-key.pem -out ./server_keys/server-csr.pem**

### Signature de la demande en utilisant le certificat d'autorité

> **openssl x509 -req -extfile ./server_keys/server.cnf -days 999 -passin "pass:password" -in ./server_keys/server-csr.pem -CA ./ca/ca-crt.pem -CAkey ./ca/ca-key.pem -CAcreateserial -out ./server_keys/server-crt.pem**

## Côté client

Nous allons générer les fichiers nécessaires permetant de simuler deux clients.
Parmi ces clients :

- Client 1 : Autorisé à accéder au serveur
- Client 2 : Son accès est révoqué

### Génération des certificats

> **openssl genrsa -out ./clients/client1/client1-key.pem 4096**

> **openssl genrsa -out ./clients/client2/client2-key.pem 4096**

### Création d'une paire de demande de signatures de certificats pour les clients

> **openssl req -new -config ./clients/client1/client1.cnf -key ./clients/client1/client1-key.pem -out ./clients/client1/client1-csr.pem**

> **openssl req -new -config ./clients/client2/client2.cnf -key ./clients/client2/client2-key.pem -out ./clients/client2/client2-csr.pem**

### Signature des certificats clients avec la certificat d'autorité

> **openssl x509 -req -extfile ./clients/client1/client1.cnf -days 999 -passin "pass:password" -in ./clients/client1/client1-csr.pem -CA ./ca/ca-crt.pem -CAkey ./ca/ca-key.pem -CAcreateserial -out ./clients/client1/client1-crt.pem**

> **openssl x509 -req -extfile ./clients/client2/client2.cnf -days 999 -passin "pass:password" -in ./clients/client2/client2-csr.pem -CA ./ca/ca-crt.pem -CAkey ./ca/ca-key.pem -CAcreateserial -out ./clients/client2/client2-crt.pem**

### Vérification des certificats

> **openssl verify -CAfile ./ca/ca-crt.pem ./clients/client1/client1-crt.pem**

> **openssl verify -CAfile ./ca/ca-crt.pem ./clients/client2/client2-crt.pem**

Vous devriez avoir : **client1-crt.pem: OK**

## Création du CRL (Certificate Revoke List)

### Création de la base de données des certificats révoqués

Si le fichier **ca-database.txt** n'existe pas dans le dossier **cert_database** :
> **touch ./cert_database/ca-database.txt**

### Révocation d'un certificat

> **openssl ca -revoke ./clients/client2/client2-crt.pem -keyfile ./ca/ca-key.pem -config openssl.cnf -cert ./ca/ca-crt.pem -passin 'pass:password'**

### Mise à jour de la liste des certificats révoqués (CRL)

> **openssl ca -keyfile ./ca/ca-key.pem -cert ./ca/ca-crt.pem -config openssl.cnf -gencrl -out ./ca/ca-crl.pem -passin 'pass:password'**

Il faut ensuite redémarrer le serveur pour que la base de données des certificats soit rechargée.
