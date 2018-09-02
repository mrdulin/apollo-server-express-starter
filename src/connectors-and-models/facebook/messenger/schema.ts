const schema: string = `
  type MessageResponse {
    recipient_id: String!
    message_id: String!
  }

  input Button {
    type: String!
    title: String!
    url: String!
    webview_height_ratio: String
    messenger_extensions: Boolean
    fallback_url: String
    webview_share_button: String
  }

  input Element {
    title: String!
    subtitle: String
    image_url: String
    default_action: String
    buttons: [Button]
  }

  input Payload {
    template_type: String!
    text: String
    buttons: [Button]
    elements: [Element]
  }

  input Attachment {
    type: String!
    payload: Payload
  }

  input MessageInput {
    attachment: Attachment
  }

  input RecipientInput {
    id: String!
    phone_number: String
    user_ref: String
    name: String
  }
`;

export { schema };
