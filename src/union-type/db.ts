import low from 'lowdb';
import FileSync from 'lowdb/adapters/FileSync';
import { AdapterSync } from 'lowdb';
import path from 'path';
import casual from 'casual';
import shortid from 'shortid';

import {
  IAd,
  IFacebookChannel,
  IGoogleChannel,
  IInstagramChannel,
  ChannelNme,
  MediaType
} from './types';

const adapter: AdapterSync = new FileSync(
  path.resolve(__dirname, './lowdb.json')
);
const lowdb = low(adapter);

lowdb
  .defaults({
    ads: [],
    googleChannels: [],
    facebookChannels: [],
    instagramChannels: []
  })
  .write();

const googleChannels: IGoogleChannel[] = [
  {
    channel_id: '1',
    channel_nme: ChannelNme.GOOGLE,
    google_channel_dsc: casual.description,
    google_channel_keywords: casual.array_of_words()
  }
];

const facebookChannels: IFacebookChannel[] = [
  {
    channel_id: '1',
    channel_nme: ChannelNme.FACEBOOK,
    facebook_channel_ad_text: casual.text,
    facebook_channel_media_type: MediaType.IMAGE,
    facebook_channel_url: casual.url
  }
];

const instagramChannels: IInstagramChannel[] = [
  {
    channel_id: '1',
    channel_nme: ChannelNme.INSTAGRAM,
    instagram_channel_ad_text: casual.text,
    instagram_channel_media_type: MediaType.VIDEO,
    instagram_channel_url: casual.url
  }
];

const ads: IAd[] = [
  {
    ad_id: shortid.generate(),
    ad_nme: casual.text,
    channel_id: '1',
    channel_nme: ChannelNme.GOOGLE
  }
];

lowdb.set('googleChannels', googleChannels).write();
lowdb.set('facebookChannels', facebookChannels).write();
lowdb.set('instagramChannels', instagramChannels).write();

lowdb.set('ads', ads).write();

export { lowdb };
