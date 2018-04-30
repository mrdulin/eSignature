const express = require('express');
const passport = require('passport');
const bodyParser = require('body-parser');
const session = require('express-session');
const docusign = require('docusign-esign');
const cookieParser = require('cookie-parser');

const router = express.Router();
const config = require('../config');

router.use(
  bodyParser.urlencoded({ extended: false }),
  bodyParser.json(),
  session({
    secret: config.session.secret,
    resave: true,
    saveUninitialized: false,
    cookie: {
      maxAge: 60 * 1000,
      httpOnly: true
    }
  }),
  passport.initialize(),
  passport.session()
);

const oauthClient = new docusign.OAuthClient(
  {
    sandbox: true,
    clientID: config.docu_sign.iss,
    clientSecret: config.docu_sign.secret_key,
    callbackURL: `${config.docu_sign.callback_url}/passport/auth/callback`
  },
  (accessToken, refreshToken, user, done) => {
    const userWithToken = Object.assign({}, user, { accessToken, refreshToken });
    return done(null, userWithToken);
  }
);

passport.use(oauthClient);

router.get('/', (req, res) => {
  if (!req.session.user) {
    res.send(`
      <a href="/passport/auth">login</a>
    `);
  } else {
    const { user } = req.session;
    res.send(`
      <p>username: ${user}</p>
    `);
  }
});

router.get('/auth', (req, res) => {
  passport.authenticate('docusign')(req, res);
});

router.get('/auth/callback', (req, res) => {
  passport.authenticate('docusign', (err, user) => {
    if (err) {
      return res.send(err);
    }
    if (!user) {
      return res.redirect('/passport/auth');
    }

    // getting the API client ready
    const apiClient = new docusign.ApiClient();
    // for production environment update to "www.docusign.net/restapi"
    const BaseUrl = 'https://demo.docusign.net/restapi';
    apiClient.setBasePath(BaseUrl);
    apiClient.addDefaultHeader('Authorization', `Bearer ${user.accessToken}`);

    // creating an instance of the authentication API
    const authApi = new docusign.AuthenticationApi(apiClient);
    const loginOps = {
      apiPassword: 'true',
      includeAccountIdGuid: 'true'
    };
    // making login call. we could also use DocuSign OAuth userinfo call
    authApi.login(loginOps, (error, loginInfo, response) => {
      if (error) {
        return res.send(error);
      }
      if (loginInfo) {
        // list of user account(s)
        // note that a given user may be a member of multiple accounts
        const { loginAccounts } = loginInfo;
        const loginAccount = loginAccounts[0];
        const { baseUrl } = loginAccount;
        const accountDomain = baseUrl.split('/v2');

        // below code required for production, no effect in demo (same domain)
        apiClient.setBasePath(accountDomain[0]);
        docusign.Configuration.default.setDefaultApiClient(apiClient);

        // return the list of accounts to the browser
        return res.send(loginAccounts);
      }
    });
  })(req, res);
});

module.exports = router;
