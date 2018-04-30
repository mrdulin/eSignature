const session = require('express-session');
const bodyParser = require('body-parser');
const rp = require('request-promise');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const express = require('express');

const router = express.Router();
const config = require('../config');

const API_HOST = `https://${config.docu_sign.aud}`;
console.log('API_HOST: ', API_HOST);

const certFilePath = path.resolve(__dirname, '../cert/private.pem');
const cert = fs.readFileSync(certFilePath);
const iat = new Date().getTime();
const exp = iat + 3600;

// console.log('cert: ', cert.toString());
const scope = config.docu_sign.scope.join(' ');

const payload = {
  iss: config.docu_sign.iss,
  sub: config.docu_sign.sub,
  iat,
  exp,
  aud: config.docu_sign.aud,
  scope
};
console.log(payload);
const token = jwt.sign(payload, cert, {
  algorithm: 'RS256',
  header: {
    typ: 'JWT',
    alg: 'RS256'
  }
});

console.log('token: ', token);

router.use(
  bodyParser.urlencoded({ extended: false }),
  bodyParser.json(),
  session({
    secret: config.session.secret,
    resave: true,
    saveUninitialized: false
  })
);

/**
 * Service Integration Authentication
 * User consent
 */
router.get('/', (req, res) => {
  const url = `${API_HOST}/oauth/token`;
  rp
    .post(url, {
      json: true,
      form: {
        grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
        assertion: token
      },
      followAllRedirects: true
    })
    .then(json => {
      res.json(json);
    })
    .catch(err => {
      if (err.error.error === 'consent_required') {
        const encodeScope = encodeURIComponent(scope);
        const consentUrl = `${API_HOST}/oauth/auth?response_type=code&scope=${encodeScope}&client_id=${
          config.docu_sign.iss
        }&redirect_uri=${config.docu_sign.callback_url}`;

        res.redirect(consentUrl);
      }
    });
});

module.exports = router;
