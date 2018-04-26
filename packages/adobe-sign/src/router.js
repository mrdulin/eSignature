const session = require('express-session');
const bodyParser = require('body-parser');
const rp = require('request-promise');

const config = require('./config');

function router(app) {
  app.use(
    bodyParser.urlencoded({ extended: false }),
    bodyParser.json(),
    session({
      secret: config.session.secret,
      resave: true,
      saveUninitialized: false
    })
  );

  app.get('/', (req, res) => {
    if (!req.session.access_token) {
      res.send(`
        <h2>adobe sign demo</h2>
        <a href='/oauth'>Login</a>
      `);
    } else {
      res.send(`
        <p>Successfully authenticated</p>
        <p>Your oauth access_token: ${req.session.access_token}</p>
        <a href="/user/me">获取用户信息</a>
      `);
    }
  });

  // https://secure.na2.echosign.com/public/oauth?redirect_uri=https://www.github.com/mrdulin&response_type=code&client_id=CBJCHBCAABAA9rzvVcanKyZcc1eMlnH3NSk2OmMXNZkT&scope=agreement_send
  app.get('/oauth', (req, res) => {
    const url = `${config.adobe_sign.auth_request_url}?redirect_uri=${
      config.adobe_sign.callback_url
    }&response_type=code&client_id=${config.adobe_sign.client_id}&scope=user_login+user_read`;
    console.log(url);
    res.redirect(url);
  });

  app.get('/login', (req, res) => {
    const { code, api_access_point } = req.query;
    const url = `${api_access_point}oauth/token`;

    rp
      .post(url, {
        json: true,
        form: {
          code,
          grant_type: 'authorization_code',
          client_id: config.adobe_sign.client_id,
          client_secret: config.adobe_sign.client_secret,
          redirect_uri: config.adobe_sign.callback_url
        }
      })
      .then(json => {
        console.log('获取access token成功');
        req.session.api_access_point = api_access_point;
        req.session.access_token = json.access_token;
        req.session.refresh_token = json.refresh_token;
        req.session.expires_in = json.expires_in;
        res.redirect('/');
      })
      .catch(err => {
        console.log('获取access token失败');
        console.error(err);
      });
  });

  app.get('/user/:id', (req, res) => {
    const { api_access_point, access_token } = req.session;
    const { id } = req.params;
    const url = `${api_access_point}api/rest/v5/users/${id}`;
    console.log(url);
    rp
      .get(url, {
        json: true,
        headers: {
          'Access-Token': access_token
        }
      })
      .then(user => {
        res.json(user);
      })
      .catch(err => {
        console.log('获取user信息失败');
        console.error(err);
      });
  });
}

module.exports = router;
