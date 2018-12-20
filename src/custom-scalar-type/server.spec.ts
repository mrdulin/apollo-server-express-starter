import { expect } from 'chai';
import http from 'http';

import { start } from './server';
import { request, logger } from '../utils';
import { lowdb } from './db';

const rp = request();
let server: http.Server;
before(async () => {
  server = await start();
});

after(done => {
  server.close(done);
});

describe('custom-scalar-type sample test suites', () => {
  it('should __serialize custom scalar Date correctly', async () => {
    const body = {
      query: `
        query {
          books{
            id
            title
            author
            updatedAt
          }
        }
      `
    };

    const actualValue = await rp.post(body).then(res => res.data.books);
    // logger.info(actualValue);
    expect(actualValue).to.have.lengthOf(
      lowdb
        .get('books')
        .size()
        .value()
    );
    expect(actualValue[0].updatedAt).to.be.a('number');
  });

  it('should __parseValue correcly', async () => {
    const body = {
      query: `
        query booksByDate($min: Date, $max: Date) {
          booksByDate(min: $min, max: $max) {
            id
            title
            author
            updatedAt
          }
        }
      `,
      variables: {
        min: new Date('2018/8/12')
      }
    };

    const actualValue = await rp.post(body).then(res => res.data.booksByDate);
    // logger.info(actualValue);
    expect(actualValue).to.have.lengthOf(1);
  });

  it('should __parseLiteral correcly when min parameter is an int timestamp', async () => {
    const min = new Date('2018/8/12').getTime();
    const body = {
      query: `
        query {
          booksByDate(min: ${min}) {
            id
            title
            author
            updatedAt
          }
        }
      `
    };

    const actualValue = await rp.get(body).then(res => res.data.booksByDate);
    expect(actualValue).to.have.lengthOf(1);
  });

  it('should __parseLiteral correcly when min parameter is an string timestamp', async () => {
    const body = {
      query: `
        query {
          booksByDate(min: "'1534003200000'") {
            id
            title
            author
            updatedAt
          }
        }
      `
    };

    const actualValue = await rp.get(body).then(res => res.data.booksByDate);
    expect(actualValue).to.have.lengthOf(1);
  });

  it('should get json data correctly', async () => {
    const body = {
      query: `
        query {
          books {
            id
            title
            author
            updatedAt
            websites
          }
        }
      `
    };

    const actualValue = await rp.post(body).then(res => res.data.books);
    expect(actualValue[0].websites).to.be.a('string');
    expect(JSON.parse(actualValue[0].websites)).to.be.an('array');
    expect(actualValue[1].websites).to.be.an('array');
  });

  it('should throw an error when there are subfields at json scalar type', async () => {
    const body = {
      query: `
        query {
          books {
            id
            title
            author
            updatedAt
            websites {
              url
              description
            }
          }
        }
      `
    };

    try {
      await rp.post(body);
    } catch (error) {
      expect(error.message).to.match(
        /Field \\"websites\\" must not have a selection since type \\"JSON\\" has no subfields./
      );
    }
  });
});
