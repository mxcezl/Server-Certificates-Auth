'use strict';

const express = require('express');
const fs = require('fs')
const https = require('https')
const nocache = require('nocache')

// Constants
const PORT = 4848;
const HOST = 'localhost';

const opts = {
    key: fs.readFileSync('./server-key.pem'),
    cert: fs.readFileSync('./server-crt.pem'),
    ca: fs.readFileSync('./ca-crt.pem'),
	crl: fs.readFileSync('./ca-crl.pem'),
    requestCert: true,
    rejectUnauthorized: true
}

// App
const app = express();
app.use(nocache())
app.set('etag', false)  
app.get('/', (req, res) => {
    res.send('<a href="authenticate">Log in using client certificate</a>')
});

app.get('/certificate', (req, res) => {
	const file = `./keys/server/server_cert.pem`;
	res.download(file, (err) => {
		if(err){
			console.log(err);
		}
	});
});

app.get('/key', (req, res) => {
	const file = `./keys/server/server_key.pem`;
	res.download(file, (err) => {
		if(err){
			console.log(err);
		}
	});
});

app.get('/authenticate', (req, res) => {
	const cert = req.socket.getPeerCertificate()

	if (req.client.authorized && cert.subject) {
		console.log(cert)
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