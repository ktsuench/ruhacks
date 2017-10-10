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

    mocha.it('Insert Bob', (done) => {
      const subscriber = new models.Subscriber(subscriberBob);

      subscriber.save((err) => {
        if (err) {
          console.error(`[${err.name} ${err.code}]: ${err.message}\n${err.stack}`);
          done(err);
        }

        // test passes if there is no run time error
        done();
      });
    });

    // relies on previous test passing
    mocha.it('Get Bob', (done) => {
      models.Subscriber.find({
        email: subscriberBob.email,
      }, (err, data) => {
        if (err) {
          console.error(`[${err.name} ${err.code}]: ${err.message}\n${err.stack}`);
        }

        // check that inserted doc is the same as the original doc
        chai.expect(data[0].email).to.equal(subscriberBob.email);
        chai.expect(data[0].name.first).to.equal(subscriberBob.name.first);
        chai.expect(data[0].name.last).to.equal(subscriberBob.name.last);
        chai.expect(data[0].gender).to.equal(subscriberBob.gender);
        done();
      });
    });

    /**
     * make an update and then query for the doc to check that the update has been made
     */
    mocha.it('Update Bob', (done) => {
      const newLastName = { name: { first: subscriberBob.name.first, last: 'Williamson' } };

      // make the update
      models.Subscriber.update({ email: subscriberBob.email }, newLastName, (err, res) => {
        if (err) {
          console.error(`[${err.name} ${err.code}]: ${err.message}\n${err.stack}`);
          done(err);
        }

        // console.log(`Mongo response from update: ${res}`);

        // querying for doc to check that update has been made
        models.Subscriber.find({
          email: subscriberBob.email,
        }, (err2, data) => {
          if (err2) {
            console.error(`[${err2.name} ${err2.code}]: ${err2.message}\n${err2.stack}`);
            done(err2);
          }

          chai.expect(data[0].email).to.equal(subscriberBob.email);
          chai.expect(data[0].name.first).to.equal(subscriberBob.name.first);
          // check that the update is made
          chai.expect(data[0].name.last).to.equal(newLastName.name.last);
          chai.expect(data[0].gender).to.equal(subscriberBob.gender);
          done();
        });
      });
    });

    // remove the doc and query for it to see that it is removed
    mocha.it('Remove Bob', (done) => {
      // remove doc
      models.Subscriber.deleteOne({ email: subscriberBob.email }, (err) => {
        if (err) {
          console.error(`[${err.name} ${err.code}]: ${err.message}\n${err.stack}`);
          done(err);
        }

        // query for doc to check that it does not exist
        models.Subscriber.find({
          email: subscriberBob.email,
        }, (err2, data) => {
          if (err2) {
            console.error(`[${err2.name} ${err2.code}]: ${err2.message}\n${err2.stack}`);
            done(err2);
          }

          chai.expect(data).to.be.lengthOf(0);
          done();
        });
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
