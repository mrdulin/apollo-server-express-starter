import { IResolvers } from 'graphql-tools';

const resolvers: IResolvers = {
  Query: {
    sendMessage: (root, args, ctx) => {
      return ctx.MessageTemplate.send(args).then(body => {
        return body;
      });
    }
  }
};

export { resolvers };
