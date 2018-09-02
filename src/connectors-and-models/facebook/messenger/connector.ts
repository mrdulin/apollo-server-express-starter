import rp from 'request-promise';

const FACEBOOK_MESSENGER_API_ROOT: string = 'https://graph.facebook.com/v2.6/me/messages';

class MessengerConnector {
  public accessToken: string = '';

  constructor({ accessToken }) {
    this.accessToken = accessToken;
  }

  public post(template) {
    return rp(`https://graph.facebook.com/v2.6/me/messages?access_token=${this.accessToken}`, {
      form: template,
      method: 'POST',
      json: true
    });
  }
}

export { MessengerConnector };
