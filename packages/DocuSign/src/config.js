const config = {
  docu_sign: {
    iss: '559e08ad-0486-4ea2-ad7a-f775a980e4d9',
    sub: '14007713-8344-4e34-8fc0-79080515d630',
    aud: 'account-d.docusign.com',
    scope: ['signature', 'impersonation'],
    callback_url: 'https://localhost:18081'
  },
  session: {
    secret: 'echo zhao'
  }
};

module.exports = config;
