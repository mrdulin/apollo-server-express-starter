import { IResolvers } from 'graphql-tools';

import { IAd, ChannelNme } from './types';

const resolvers: IResolvers = {
  Channel: {
    __resolveType: obj => {
      switch (obj.channel_nme) {
        case ChannelNme.FACEBOOK:
          return 'FacebookChannel';
        case ChannelNme.GOOGLE:
          return 'GoogleChannel';
        case ChannelNme.INSTAGRAM:
          return 'InstagramChannel';
      }
      return null;
    }
  },
  Ad: {
    channel: async (parent, args, { lowdb }) => {
      let tableName: string = '';
      switch (parent.channel_nme) {
        case ChannelNme.FACEBOOK:
          tableName = 'facebookChannels';
          break;
        case ChannelNme.GOOGLE:
          tableName = 'googleChannels';
          break;
        case ChannelNme.INSTAGRAM:
          tableName = 'instagramChannels';
          break;
      }

      if (!tableName) {
        return null;
      }

      return lowdb
        .get(tableName)
        .find({ channel_id: parent.channel_id })
        .value();
    }
  },
  Query: {
    ads: async (_, args, { lowdb }): Promise<IAd[]> => {
      return lowdb.get('ads').value();
    }
  }
};

export { resolvers };
