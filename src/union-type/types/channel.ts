enum MediaType {
  IMAGE = 'image',
  VIDEO = 'video'
}

enum ChannelNme {
  FACEBOOK = 'facebook',
  GOOGLE = 'google',
  INSTAGRAM = 'instagram'
}

interface IGoogleChannel {
  channel_id: string;
  channel_nme: ChannelNme;
  google_channel_dsc: string;
  google_channel_keywords: string[];
}

interface IFacebookChannel {
  channel_id: string;
  channel_nme: ChannelNme;
  facebook_channel_url: string;
  facebook_channel_ad_text: string;
  facebook_channel_media_type: MediaType;
}

interface IInstagramChannel {
  channel_id: string;
  channel_nme: ChannelNme;
  instagram_channel_url: string;
  instagram_channel_ad_text: string;
  instagram_channel_media_type: MediaType;
}

type Channel = IGoogleChannel | IFacebookChannel | IInstagramChannel;

export {
  MediaType,
  IFacebookChannel,
  IGoogleChannel,
  IInstagramChannel,
  Channel,
  ChannelNme
};
