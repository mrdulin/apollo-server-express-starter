const typeDefs: string = `
  enum ChannelNme {
    facebook
    google
    instagram
  }

  enum MediaType {
    image
    video
  }

  type GoogleChannel {
    channel_id: ID!
    channel_nme: ChannelNme!
    google_channel_dsc: String
    google_channel_keywords: [String]!
  }

  type FacebookChannel {
    channel_id: ID!
    channel_nme: ChannelNme!
    facebook_channel_url: String
    facebook_channel_ad_text: String
    facebook_channel_media_type: MediaType
  }

  type InstagramChannel {
    channel_id: ID!
    channel_nme: ChannelNme!
    instagram_channel_url: String
    instagram_channel_ad_text: String
    instagram_channel_media_type: MediaType
  }

  union Channel = GoogleChannel | FacebookChannel | InstagramChannel

  type Ad {
    ad_id: ID!
    ad_nme: String!
    channel_id: ID
    channel_nme: ChannelNme
    channel: Channel
  }

  type Query {
    ads: [Ad]!
  }
`;

export { typeDefs };
