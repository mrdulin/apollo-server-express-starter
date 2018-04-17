const rp = require('request-promise');

const FACEBOOK_MESSENGER_API_ROOT = 'https://graph.facebook.com/v2.6/me/messages';

class MessengerConnector {
  constructor({ accessToken }) {
    this.accessToken = accessToken;
  }

  post(template) {
    return rp(`https://graph.facebook.com/v2.6/me/messages?access_token=${this.accessToken}`, {
      form: template,
      method: 'POST',
      json: true
    });
  }
}

module.exports = MessengerConnector;
