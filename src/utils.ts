import requestPromise, { RequestPromise } from 'request-promise';
import { createLogger, transports, format, Logger } from 'winston';

import { config } from './config';

function rp(body: object): RequestPromise {
  const options = {
    uri: config.GRAPHQL_ENDPOINT,
    method: 'POST',
    json: true,
    body
  };

  return requestPromise(options);
}

function createAppLogger(): Logger {
  const { combine, timestamp, printf, colorize } = format;

  return createLogger({
    format: combine(
      colorize(),
      timestamp(),
      printf(
        (info): string => {
          const label: string = info.label ? ' ' + info.label + ' ' : '';
          return `${info.timestamp}${label}[${info.level}] : ${JSON.stringify(info.message)}`;
        }
      )
    ),
    transports: [new transports.Console()]
  });
}

const logger: Logger = createAppLogger();

export { rp, logger };
