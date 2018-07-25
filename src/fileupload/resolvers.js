const shortid = require('shortid');
const mkdirp = require('mkdirp');
const path = require('path');
const fs = require('fs');
const { GraphQLUpload } = require('apollo-upload-server');

const uploadDir = path.resolve(__dirname, '../../uploads');
mkdirp(uploadDir);

function storeFS({ stream, filename }) {
  const id = shortid.generate();
  const filepath = `${uploadDir}/${id}-${filename}`;
  return new Promise((resolve, reject) => {
    stream.on('error', err => {
      if (stream.truncated) {
        // Delete the truncated file
        fs.unlinkSync(filepath);
      }
      reject(err);
    });

    stream
      .pipe(fs.createWriteStream(filepath))
      .on('error', err => reject(err))
      .on('finish', () => resolve({ id, filepath }));
  });
}

function storeDB(file, lowdb) {
  return lowdb
    .get('uploads')
    .push(file)
    .last()
    .write();
}

async function processUpload(upload, lowdb) {
  try {
    const { stream, filename, mimetype, encoding } = await upload;
    const { id, filepath } = await storeFS({ stream, filename });
    return storeDB({ id, filepath, mimetype, encoding, filename }, lowdb);
  } catch (err) {
    console.log('processUpload error');
    throw new Error(err);
  }
}

exports.resolvers = {
  Upload: GraphQLUpload,
  Query: {
    uploads: (root, args, ctx) => {
      const files = ctx.lowdb.get('uploads').value();
      return files;
    }
  },
  Mutation: {
    singleUpload: (root, args, ctx) => {
      const { file } = args;
      return processUpload(file, ctx.lowdb).then(data => {
        console.log(data);
        return data;
      });
    },
    mutipleUpload: (root, args) => {
      console.log(args);
      return 'mutiple upload';
    }
  }
};
