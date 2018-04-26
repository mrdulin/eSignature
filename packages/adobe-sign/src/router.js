const session = require('express-session');
const bodyParser = require('body-parser');
const rp = require('request-promise');
const AdobeSignSdk = require('adobe-sign-sdk');
const fs = require('fs');
const path = require('path');

const config = require('./config');

const context = new AdobeSignSdk.Context();

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
        <ul>
          <li><a href="/user/me">user info</a></li>
          <li><a href="/refreshToken">refresh token</a></li>
          <li><a href="/logout">logout</a></li>
          <li><a href="/transientDocuments">transientDocuments</a></li>
          <li><a href="/agreements">agreements</a></li>
        </ul>
      `);
    }
  });

  // https://secure.na2.echosign.com/public/oauth?redirect_uri=https://www.github.com/mrdulin&response_type=code&client_id=CBJCHBCAABAA9rzvVcanKyZcc1eMlnH3NSk2OmMXNZkT&scope=agreement_send
  app.get('/oauth', (req, res) => {
    const scopes = ['user_login', 'user_read', 'agreement_write', 'agreement_send', 'agreement_read'];
    const scope = scopes.join('+');
    const url = `${config.adobe_sign.auth_request_url}?redirect_uri=${
      config.adobe_sign.callback_url
    }&response_type=code&client_id=${config.adobe_sign.client_id}&scope=${scope}`;
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

  app.get('/refreshToken', (req, res) => {
    const { api_access_point, refresh_token } = req.session;
    const grant_type = 'refresh_token';
    const url = `${api_access_point}oauth/refresh`;
    rp
      .post(url, {
        json: true,
        form: {
          refresh_token,
          client_id: config.adobe_sign.client_id,
          client_secret: config.adobe_sign.client_secret,
          grant_type
        }
      })
      .then(json => {
        console.log('refresh token成功');
        req.session.access_token = json.access_token;
        req.expires_in = json.expires_in;
        res.redirect('/');
      })
      .catch(err => {
        console.log('refresh token失败');
        console.error(err);
      });
  });

  app.get('/logout', (req, res) => {
    const { api_access_point, access_token } = req.session;
    const url = `${api_access_point}oauth/revoke`;
    rp
      .post(url, {
        resolveWithFullResponse: true,
        form: {
          token: access_token
        }
      })
      .then(response => {
        if (response.statusCode === 200) {
          console.log('revoke token成功');
          req.session.destroy(err => {
            if (err) return console.error(err);
            return res.redirect('/');
          });
        } else {
          console.log(response);
          res.redirect('/');
        }
      })
      .catch(err => {
        console.log('revoke token失败');
        console.error(err);
      });
  });

  app.get('/transientDocuments', (req, res) => {
    const { access_token } = req.session;
    const headerParams = { accessToken: access_token };
    const filePath = path.resolve(__dirname, '../public/test.txt');
    const fileBytes = fs.readFileSync(filePath);
    const buffer = Buffer.from(fileBytes);
    const transientDocumentsApi = new AdobeSignSdk.TransientDocumentsApi(context);

    const opts = {};
    opts.mimeType = 'text/plain';

    transientDocumentsApi
      .createTransientDocument(headerParams, 'test.txt', buffer, opts)
      .then(transientDocumentCreationResponse => {
        const transientDocumentId = transientDocumentCreationResponse.getTransientDocumentId();
        console.log(`The Transient Id is ${transientDocumentId}`);
        return transientDocumentId;
      })
      .then(transientDocumentId => {
        const agreementsApi = new AdobeSignSdk.AgreementsApi(context);
        const agreementsModel = AdobeSignSdk.AgreementsModel;

        const recipientSetMemberInfos = [];
        const userEmails = ['novaline@qq.com'];

        for (let i = 0; i < userEmails.length; i += 1) {
          const recipientInfo = new agreementsModel.RecipientInfo();
          recipientInfo.setEmail(userEmails[i]);
          recipientSetMemberInfos.push(recipientInfo);
        }

        const recipientSetInfo = new agreementsModel.RecipientSetInfo();
        recipientSetInfo.setRecipientSetMemberInfos(recipientSetMemberInfos);
        recipientSetInfo.setRecipientSetRole(agreementsModel.RecipientSetInfo.RecipientSetRoleEnum.SIGNER);
        recipientSetInfo.setRecipientSetName('fjenning@adobe.com');

        const recipientSetInfos = [];
        recipientSetInfos.push(recipientSetInfo);

        const fileInfo = new agreementsModel.FileInfo();
        fileInfo.setTransientDocumentId(transientDocumentId);

        const fileInfos = [];
        fileInfos.push(fileInfo);

        const documentCreationInfo = new agreementsModel.DocumentCreationInfo();
        documentCreationInfo.setName('MyAgreement');
        documentCreationInfo.setFileInfos(fileInfos);
        documentCreationInfo.setRecipientSetInfos(recipientSetInfos);
        documentCreationInfo.setSignatureType(agreementsModel.DocumentCreationInfo.SignatureTypeEnum.ESIGN);
        documentCreationInfo.setSignatureFlow(
          agreementsModel.DocumentCreationInfo.SignatureFlowEnum.SENDER_SIGNATURE_NOT_REQUIRED
        );

        const agreementCreationInfo = new agreementsModel.AgreementCreationInfo();
        agreementCreationInfo.setDocumentCreationInfo(documentCreationInfo);

        agreementsApi
          .createAgreement(headerParams, agreementCreationInfo)
          .then(agreementCreationResponse => {
            const agreementId = agreementCreationResponse.getAgreementId();
            console.log(`Agreement created for Id ${agreementId}`);
            res.json({ agreementId });
          })
          .catch(apiError => {
            console.log('createAgreement failed');
            console.log(apiError);
          });
      })
      .catch(apiError => {
        console.log('上传失败');
        console.error(apiError);
      });
  });

  app.get('/agreements', (req, res) => {
    const { api_access_point, access_token } = req.session;
    const url = `${api_access_point}api/rest/v5/agreements`;
    rp
      .get(url, {
        json: true,
        headers: {
          'Access-Token': access_token
        }
      })
      .then(json => res.json(json))
      .catch(err => console.error(err));
  });
}

module.exports = router;
