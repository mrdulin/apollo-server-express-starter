import shortid from 'shortid';

const db = {
  links: [
    { id: shortid.generate(), url: 'http://github.com', description: 'github' },
    { id: shortid.generate(), url: 'http://google.com', description: 'google' }
  ]
};

export { db };
