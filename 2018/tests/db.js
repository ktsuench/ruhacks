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

mocha.describe('Database', () => {
  mocha.describe('Connection Test', () => {
    mocha.it('No DB Url provided', () => {
      db.getDbConnection.should.throw(error.noDbUrlProvided);
    });
    mocha.it('DB Url provided', () => {
      const connection = db.getDbConnection(dbConfig.url);

      connection.should.be.an.instanceof(mongoose.Connection);
    });
  });

  const models = db.getModels(db.getDbConnection(dbConfig.default_url));

  Object.keys(models).forEach((model) => {
    models[model].remove({}, (err) => {
      if (err) {
        console.error(`[${err.name} ${err.code}]: ${err.message}\n${err.stack}`);
      } else {
        // console.log(`Emptied ${model} collection.`);
      }
    });
  });

  mocha.describe('Subscriber Model', () => {
    mocha.it('Integrity Check', () => {
      Object.getPrototypeOf(models.Subscriber).should.equal(mongoose.Model);
    });
    mocha.it('Insert Bob', () => {
      const subscriber = new models.Subscriber({
        name: {
          first: 'Bob',
          last: 'Williams',
        },
        email: 'this.is@fake.email.addr',
        gender: constants.gender[0],
      });

      return subscriber.save((err) => {
        if (err) {
          // console.error(`[${err.name} ${err.code}]: ${err.message}\n${err.stack}`);
          return false;
        }

        return true;
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
      Object.getPrototypeOf(models.Subscriber).should.equal(mongoose.Model);
    });
  });
});
