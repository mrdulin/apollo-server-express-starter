const start = require('./server');

const { expect } = require('chai');

const rp = require('../rp')();

let server;

before(done => {
  server = start(done);
});

after(done => {
  server.close(done);
});

describe('fileupload', () => {
  it('blob', async () => {});
});
