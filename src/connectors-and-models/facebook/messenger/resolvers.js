const resolvers = {
  Query: {
    sendMessage: (root, args, ctx) => {
      return ctx.MessageTemplate.send(args).then(body => {
        console.log(body);
        return body;
      });
      // .catch(error => {
      //   logger.info(error);
      // });
    }
  }
};

exports.resolvers = resolvers;
