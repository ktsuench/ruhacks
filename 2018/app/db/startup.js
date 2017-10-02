const mongoose = require('mongoose');
const schema = require('./schema');
const error = require('../../config/error');

mongoose.Promise = global.Promise;

function getConnection(dbUrl) {
  const connectionOptions = { useMongoClient: true };
  let connection = null;

  if (dbUrl) {
    connection = mongoose.createConnection(dbUrl, connectionOptions, (err) => {
      if (err) {
        console.error(`[${err.name} ${err.code}]: ${err.message}\n${err.stack}`);
      } else {
        console.log('Connected to Mongoose DB');
      }
    });
  } else {
    throw new Error(error.noDbUrlProvided);
  }

  return connection;
}

function getModels(db) {
  const Subscriber = db.model('Subscriber', schema.subscriber);
  const Hacker = db.model('Hacker', schema.hacker);
  const Volunteer = db.model('Volunteer', schema.volunteer);

  return {
    Subscriber,
    Hacker,
    Volunteer,
  };
}

function closeConnection(connection) {
  connection.close((err) => {
    if (err) {
      console.error(`[${err.name} ${err.code}]: ${err.message}\n${err.stack}`);
    } else {
      console.log('Closed connection to Mongoose DB');
    }
  });
}

module.exports = {
  getConnection,
  getModels,
  closeConnection,
};
