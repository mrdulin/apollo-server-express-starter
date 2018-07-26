const mongoose = require('mongoose');

function mongooseConnect() {
  const uri = 'mongodb://localhost:27017/apollo-server-express-starter';
  return mongoose
    .connect(
      uri,
      { useNewUrlParser: true }
    )
    .then(() => {
      console.log('Mongoose default connection open to ', uri);
    })
    .catch(err => {
      console.log('Mongoose connection error:', err);
    });
}

module.exports = {
  mongooseConnect
};
