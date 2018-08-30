import { GooglePubSub } from '@axelspringer/graphql-google-pubsub';

const topic2SubName = (topicName: string) => `${topicName}-sub`;

const commonMessageHandler = ({ data }) => {
  return JSON.parse(data.toString());
};

const pubsub: GooglePubSub = new GooglePubSub({}, topic2SubName, commonMessageHandler);

export { pubsub };
