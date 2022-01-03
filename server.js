'use strict';

const express = require('express');
const fs = require('fs')
const https = require('https')

// Constants
const PORT = 4848;
const HOST = 'localhost';

// openssl req -x509 -newkey rsa:4096 -keyout server_key.pem -out server_cert.pem -nodes -days 365 -subj "/CN=localhost/O=INSA"
// Creation de server_key.pem et de server_cert.pem
const opts = {
    key: fs.readFileSync('/keys/server/server_key.pem'),
    cert: fs.readFileSync('/keys/server/server_cert.pem'),
    requestCert: true,
    rejectUnauthorized: false,
    ca: [
        fs.readFileSync('/keys/server/server_cert.pem')
    ]
}
// Creation de cle et certificat pour un utilisateur
// openssl req -newkey rsa:4096 -keyout maxence_key.pem -out maxence_csr.pem -nodes -days 365 -subj "/CN=Maxence"

// Signature du certificat avec la cle du server
// openssl x509 -req -in maxence_csr.pem -CA server_cert.pem -CAkey server_key.pem -out maxence_cert.pem -set_serial 01 -days 365

// App
const app = express();
app.get('/', (req, res) => {
    res.send('<a href="authenticate">Log in using client certificate</a>')
});

app.get('/authenticate', (req, res) => {
	const cert = req.connection.getPeerCertificate()

	if (req.client.authorized) {
		res.send(`Hello ${cert.subject.CN}, your certificate was issued by ${cert.issuer.CN}!`)
	} else if (cert.subject) {
		res.status(403)
		   .send(`Sorry ${cert.subject.CN}, certificates from ${cert.issuer.CN} are not welcome here.`)
	} else {
		res.status(401)
		   .send(`Sorry, but you need to provide a client certificate to continue.`)
	}
})

https.createServer(opts, app).listen(PORT);
console.log(`Running on https://${HOST}:${PORT}`);