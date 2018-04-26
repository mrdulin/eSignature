const fs = require('fs');
const http = require('http');
const https = require('https');
const path = require('path');
const express = require('express');

const router = require('./router');

const app = express();

router(app);

const SSL_PATH = path.resolve(__dirname, 'ssl');

const privateKey = fs.readFileSync(path.join(SSL_PATH, 'private.pem'), 'utf8');
const certificate = fs.readFileSync(path.join(SSL_PATH, 'file.crt'), 'utf8');
const credentials = { key: privateKey, cert: certificate };

const httpServer = http.createServer(app);
const httpsServer = https.createServer(credentials, app);
const PORT = 18080;
const SSLPORT = 18081;

httpServer.listen(PORT, () => {
  console.log('HTTP Server is running on: http://localhost:%s', PORT);
});
httpsServer.listen(SSLPORT, () => {
  console.log('HTTPS Server is running on: https://localhost:%s', SSLPORT);
});
