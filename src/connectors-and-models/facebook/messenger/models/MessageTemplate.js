class MessageTemplate {
  constructor({ connector }) {
    this.connector = connector;
  }
  send(template) {
    return this.connector.post(template);
  }
}

module.exports = MessageTemplate;
