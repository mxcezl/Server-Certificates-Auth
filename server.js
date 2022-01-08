'use strict';

const express = require('express');
const fs = require('fs')
const https = require('https')
const nocache = require('nocache')

const PORT = 4848;
const HOST = 'localhost';

const opts = {
    key: fs.readFileSync('./server_keys/server-key.pem'),
    cert: fs.readFileSync('./server_keys/server-crt.pem'),
    ca: fs.readFileSync('./ca/ca-crt.pem'),
	crl: fs.readFileSync('./ca/ca-crl.pem'),
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

app.get('/ca-cert', (req, res) => {
	const file = `./ca/ca-crt.pem`;
	res.download(file, (err) => {
		if(err){
			console.log(err);
		}
	});
});

app.get('/ca-key', (req, res) => {
	const file = `./ca/ca-key.pem`;
	res.download(file, (err) => {
		if(err){
			console.log(err);
		}
	});
});

app.get('/authenticate', (req, res) => {
	const cert = req.socket.getPeerCertificate()

	console.log(cert)
	if (req.client.authorized && cert.subject) {
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