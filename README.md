# Web Server Using Certificates

- [Web Server Using Certificates](#web-server-using-certificates)
  - [Introduction](#introduction)
  - [Comment démarrer le serveur HTTPS](#comment-démarrer-le-serveur-https)
  - [Installation de Node.js](#installation-de-nodejs)
    - [Linux](#linux)
    - [Windows](#windows)
  - [Solution de déploiement : Node.js](#solution-de-déploiement--nodejs)
  - [Solution de déploiement : Docker](#solution-de-déploiement--docker)
    - [Installation de Docker](#installation-de-docker)
    - [Démarrer le serveur avec Docker](#démarrer-le-serveur-avec-docker)
  - [Accès au site](#accès-au-site)
    - [Génération des certificats PKCS#12](#génération-des-certificats-pkcs12)
    - [Via CURL](#via-curl)
      - [Sans certificat](#sans-certificat)
      - [Avec certificat](#avec-certificat)
    - [Avec un navigateur](#avec-un-navigateur)
  - [Erreurs possibles](#erreurs-possibles)

## Introduction

Ce projet à été réalisé dans le cadre du module *Fondements de la Cybersécurité* à l'*INSA Hauts-de-France* encadré par D. Gantsou Engoua. A travers ce projet, nous démontrons l'utilisation des certificats x.509 permettant d'authentifier les clients sur les serveurs. Nous avons utilisé **openssl** pour la création des certificats, nous détaillons les commandes dans la section approprié.

## Comment démarrer le serveur HTTPS

Afin de lancer le serveur, qui est conçu en Node.js, il vous faudra installer diverses applications. Nous vous proposons deux possibilités :

 1. Utilisation de **Docker** pour déployer le serveur de façon automatique avec les certificats embarqués.
 2. Démarrage manuel du serveur avec **Node.js** et création des certificats à l'aide de scripts que nous avons réalisés

## Installation de Node.js

Voici comment installer Node.js sur Linux et sur Windows.

### Linux

Dans le terminal, lancez la commande suivante :
> **sudo apt install nodejs**

Ensuite vérifiez l'installation avec la commande :
> **node -v** ou **node --version**

Il est également recommandé d'installer NPM qui est un gestionnaire de paquets pour Node.js :
> **sudo apt install npm**  
>
> **npm -v** or **npm –version**

### Windows

Pour l'installation sur Windows, cela est plus concis. Il vous suffit de vous rendre sur le site officiel de la page de téléchargement de Node.js à l'URL : <https://nodejs.org/en/download/>

En suivant l'utilitaire d'installation, Node.js sera installé sur votre poste avec NPM. Vous pouvez vérifier l'installation de ces deux programmes avec les commandes :
> **node -v** ou **node --version**
>
> **npm -v** or **npm –version**

## Solution de déploiement : Node.js

Cette solution est la plus rapide et la plus simple. Elle vous permet de démarrer le serveur directement sur votre machine (contrairement à Docker qui lance l'application dans un environnement virtuel), si votre environnement vous le permet.

Pour cela, il faut ouvrir un terminal et aller jusqu'au dossier contenant les fichiers **server.js** et **packages.json** et taper la commande :
> **node server.js**

Si vous avez une erreur avec une dépendance manquante, entrez la commande suivante :
> **npm install NOM_DEPENDANCE**
>
> exemple : **npm install express**

Puis réessayez de lancer le serveur Node.js avec la commande précédente.

## Solution de déploiement : Docker

Docker est un logiciel permettant de conteneuriser des application dans un environnement applicatif qui lui est propre. Docker permet, entre autres, de lancer une application sans se soucier de l'environnement dans lequel elle est déployée et évite des problèmes de compatibilité. Cet environnement est configurable via un fichier appelé **DockerFile** qui se trouve à la racine de notre répertoire GitHub.

### Installation de Docker

Premièrement il nous faut installer Docker. Si vous vous trouvez sur Windows, vous devrez suivre la procédure d'installation disponible via cet URL : <https://docs.docker.com/desktop/windows/install/> et veillez à avoir la version 2 de Windows Subsystem Linux (WSL) d'installée sur votre poste.

Sur Linux, tapez les commandes suivantes dans un terminal :
> **sudo apt-get update**
>
> **sudo apt-get install docker-ce docker-ce-cli containerd.io**

Vérifiez l'installation de docker, sur Linux ou Windows avec la commande :
> **docker -v** ou **docker --version**

Sur Linux, il faut ensuite démarrer **Docker** avec la commande :
> **sudo systemctl start docker**

### Démarrer le serveur avec Docker

Allez à la racine des fichiers, où se trouve le fichier **DockerFile**. Ensuite tapez la commande :
> **sudo docker build --tag tp:latest .**
>
> **sudo docker run -p 4848:4848 tp**

Le serveur va ensuite démarrer et sera exposé via l'URL : <https://localhost:4848>
Veillez à bien utiliser le protocole HTTPS pour y accéder.

## Accès au site

Le serveur est paramétré de telle sorte que seul les utilisateurs fournissant un certificat x.509 signé avec celui du serveur et la clé du serveur, pourront y accéder. Il vous faut donc générer un certificat pour le client.

### Génération des certificats PKCS#12

Afin d'ajouter un certificat client dans un navigateur tel que Firefox, il faut que celui-ci soit au format PKCS#12.
Ce format de certificat regroupe deux fichier :

- Le certificat **clientX-crt.pem**
- La clé du client **clientN-key.pem**

Afin de générer ce type de certificat, il faut lancer cette commande, en remplaçant X par le numéro du client :
> **openssl pkcs12 -export -out client1.p12 -inkey ./clients/client1/client1-key.pem -in ./clients/client1/client1-crt.pem**

Il est également possible d'utiliser ce type de certificat avec CURL, il faut cependant préciser le type de certificat envoyé.

### Via CURL

#### Sans certificat

> curl <https://localhost:4848/authenticate> --insecure -i

```bash
$ curl https://localhost:4848/authenticate --insecure -i
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100    64  100    64    0     0   3118      0 --:--:-- --:--:-- --:--:--  3368HTTP/1.1 401 Unauthorized
X-Powered-By: Express
Surrogate-Control: no-store
Cache-Control: no-store, no-cache, must-revalidate, proxy-revalidate
Pragma: no-cache
Expires: 0
Content-Type: text/html; charset=utf-8
Content-Length: 64
Date: Thu, 06 Jan 2022 21:27:18 GMT
Connection: keep-alive
Keep-Alive: timeout=5

Sorry, but you need to provide a client certificate to continue.
```

#### Avec certificat

Vous pouvez utiliser les deux fichiers : key et crt
> curl <https://localhost:4848/authenticate> --insecure --cert ./clients/client1/client1-crt.pem --key ./clients/client1/client1-key.pem -i

Ou bien depuis le fichier .p12 en précisant la nature de celui-ci (PCKS#12) :
> curl <https://localhost:4848/authenticate> --insecure --cert ./clients/client1/client1.p12 --cert-type p12 -i

```bash
$ curl https://localhost:4848/authenticate --insecure -i --cert ./clients/client1/client1-crt.pem --key ./clients/client1/client1-key.pem
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100    48  100    48    0     0   1813      0 --:--:-- --:--:-- --:--:--  1920HTTP/1.1 200 OK
X-Powered-By: Express
Surrogate-Control: no-store
Cache-Control: no-store, no-cache, must-revalidate, proxy-revalidate
Pragma: no-cache
Expires: 0
Content-Type: text/html; charset=utf-8
Content-Length: 48
Date: Thu, 06 Jan 2022 21:30:28 GMT
Connection: keep-alive
Keep-Alive: timeout=5

Hello client1, your certificate was issued by ca!
```

### Avec un navigateur

Pour ajouter un certificat dans votre navigateur, il faut aller dans les paramètres, ensuite dans les paramètres de certificat. Désactivez l'interrogation au répondeur OCSP. Ajoutez un certificat dans l'onglet "Vos certificats" ou "Certificats utilisateurs".
Entrez le mot de passe que vous avez définit pour le certificat lors de sa création.

[![N|Solid](https://i.imgur.com/TloEHoR.png)](https://i.imgur.com/TloEHoR.png)

Vous pouvez ensuite visiter <https://localhost:4848/authenticate> et le navigateur vous demandera de sélectionner un certificats parmi ceux enregistrés.

[![N|Solid](https://i.imgur.com/CZFDA5D.png)](https://i.imgur.com/CZFDA5D.png)

Choisissez celui récemment ajouté et cliquez Entrer.

[![N|Solid](https://i.imgur.com/g7xoc0t.png)](https://i.imgur.com/g7xoc0t.png)

Vous devrez avoir une réponse semblable à :
> Hello VOTRE_NOM, your certificate was issued by ORGANISATION!

## Erreurs possibles

Si votre navigateur ne vous demande pas de sélectionner votre certificat et vous affiche :
>Sorry, but you need to provide a client certificate to continue.

Dans ce cas, ouvrez une fenêtre en navigation privée et ressaisissez l'URL.
Si le problème persiste, retournez dans vos paramètres de certificats et dans l'onglet "Décisions", supprimez toutes les entrées et essayez de vider votre cache, puis réessayez.

[![N|Solid](https://i.imgur.com/x4LqjlH.png)](https://i.imgur.com/x4LqjlH.png)
