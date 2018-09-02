class MessageTemplate {
  public connector;

  constructor({ connector }) {
    this.connector = connector;
  }

  public send(template) {
    if (this.connector) {
      return this.connector.post(template);
    }
  }
}

export { MessageTemplate };
