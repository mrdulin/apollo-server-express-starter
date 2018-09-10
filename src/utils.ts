import requestPromise from 'request-promise';
import { createLogger, transports, format, Logger } from 'winston';

import { config } from './config';

function request() {
  function post(body) {
    return requestPromise(config.GRAPHQL_ENDPOINT, {
      method: 'POST',
      body,
      json: true,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  function get(qs) {
    return requestPromise(config.GRAPHQL_ENDPOINT, {
      method: 'GET',
      qs,
      json: true
    });
  }

  return {
    post,
    get
  };
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

function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const intersection = (arr1, arr2) => arr1.filter(value => arr2.indexOf(value) !== -1);

function toJson(obj) {
  if (typeof obj === 'string') {
    return obj;
  }
  try {
    return JSON.stringify(obj);
  } catch (error) {
    throw new Error(error);
  }
}

function log(err: any) {
  let msg: string;
  if (err instanceof Error) {
    msg = err.message;
  } else {
    msg = err;
  }
  logger.error(msg);
}

type Base64String = string;

function base64(i: string): Base64String {
  return Buffer.from(i, 'utf8').toString('base64');
}

function unbase64(i: Base64String): string {
  return Buffer.from(i, 'base64').toString('utf8');
}

export { request, logger, log, getRandomInt, intersection, toJson, base64, unbase64, Base64String };
