import { expect } from 'chai';
import http from 'http';
import { Done } from 'mocha';

import { start } from './server';
import { request, logger } from '../utils';

let server: http.Server;
before(async () => {
  server = await start();
});

after((done: Done) => {
  server.close(done);
});

describe('fileupload test suites', () => {
  // it('single file', async () => {});
});
