require('../config/test');
const mongoose = require('mongoose');
const mocha = require('mocha');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const constants = require('../app/constants');
const error = require('../config/error');
const dbConfig = require('../config/db');
const db = require('../app/db/startup');

chai.should();
chai.use(chaiAsPromised);

/**
 * Note on managing MongoDB Connections
 *
 * There's no need to close connections since connections are reused.
 * A slightly outdated StackOverflow reference, but probably still
 * relevant: http://bit.ly/2xMuGh8
 *
 */

mocha.describe('Database', () => {
  mocha.describe('Connection Test', () => {
    mocha.it('No DB Url provided', () => {
      db.getConnection.should.throw(error.noDbUrlProvided);
    });

    let connection = null;

    mocha.it('DB Url provided', () => {
      connection = db.getConnection(dbConfig.url);

      connection.should.be.an.instanceof(mongoose.Connection);
    });

    mocha.it('DB Close Connection', () => {
      db.closeConnection(connection);
    });
  });

  const connection = db.getConnection(dbConfig.default_url);
  const models = db.getModels(connection);

  connection.dropDatabase();

  mocha.describe('Subscriber Model', () => {
    mocha.it('Integrity Check', () => {
      Object.getPrototypeOf(models.Subscriber).should.equal(mongoose.Model);
    });

    const subscriberBob = {
      name: {
        first: 'Bob',
        last: 'Williams',
      },
      email: 'this.is@fake.email.addr',
      gender: constants.gender[0],
    };

    mocha.it('Insert Bob', () => {
      const subscriber = new models.Subscriber(subscriberBob);

      return subscriber.save((err) => {
        if (err) {
          console.error(`[${err.name} ${err.code}]: ${err.message}\n${err.stack}`);
          return false;
        }

        return true;
      });
    });

    mocha.it('Get Bob', () => {
      return models.Subscriber.find({
        email: subscriberBob.email,
      }, (err, data) => {
        if (err) {
          console.error(`[${err.name} ${err.code}]: ${err.message}\n${err.stack}`);
          return false;
        }

        if (data[0].email === subscriberBob.email &&
            data[0].name.first === subscriberBob.name.first &&
            data[0].name.last === subscriberBob.name.last &&
            data[0].gender === subscriberBob.gender) {
          return true;
        }
      });
    });
  });

  mocha.describe('Hacker Model', () => {
    mocha.it('Integrity Check', () => {
      Object.getPrototypeOf(models.Subscriber).should.equal(mongoose.Model);
    });
  });

  mocha.describe('Volunteer Model', () => {
    mocha.it('Integrity Check', () => {
      Object.getPrototypeOf(models.Volunteer).should.equal(mongoose.Model);
    });
  });
});
