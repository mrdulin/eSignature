const config = {
  adobe_sign: {
    auth_request_url: 'https://secure.na2.echosign.com/public/oauth',
    client_id: 'CBJCHBCAABAA9rzvVcanKyZcc1eMlnH3NSk2OmMXNZkT',
    client_secret: 'HcUvwIF0lQrhR4N9m272sZQ3utLrC05w',
    callback_url: 'https://localhost:18081/login' || 'https://www.github.com/mrdulin'
  },
  session: {
    secret: 'echo zhao'
  }
};

module.exports = config;
