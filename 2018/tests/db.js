require('../config/test');
const mongoose = require('mongoose');
const mocha = require('mocha');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const constants = require('../app/constants');
const error = require('../config/error');
const dbConfig = require('../config/db');
const db = require('../app/db/startup');
const Stack = require('../app/struct/stack.js');

chai.should();
chai.use(chaiAsPromised);

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
  const startEvent = 'start test';
  const eventQueue = new Stack(startEvent);

  eventQueue.onEmpty(() => {
    db.closeConnection(connection);
  });

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
      const event = 'subscriber model check';
      eventQueue.push(event);

      Object.getPrototypeOf(models.Subscriber).should.equal(mongoose.Model);

      chai.expect(eventQueue.pop()).to.equal(event);
    });

    mocha.it('Insert Bob', () => {
      const event = 'subscriber add';
      eventQueue.push(event);

      const subscriber = new models.Subscriber({
        name: {
          first: 'Bob',
          last: 'Williams',
        },
        email: 'this.is@fake.email.addr',
        gender: constants.gender[0],
      });

      return subscriber.save((err) => {
        chai.expect(eventQueue.pop()).to.equal(event);

        if (err) {
          console.error(`[${err.name} ${err.code}]: ${err.message}\n${err.stack}`);
          return false;
        }

        return true;
      });
    });
  });

  mocha.describe('Hacker Model', () => {
    mocha.it('Integrity Check', () => {
      const event = 'hacker model check';
      eventQueue.push(event);

      Object.getPrototypeOf(models.Subscriber).should.equal(mongoose.Model);

      chai.expect(eventQueue.pop()).to.equal(event);
    });
  });

  mocha.describe('Volunteer Model', () => {
    mocha.it('Integrity Check', () => {
      const event = 'volunteer model check';
      eventQueue.push(event);

      Object.getPrototypeOf(models.Volunteer).should.equal(mongoose.Model);

      chai.expect(eventQueue.pop()).to.equal(event);
    });
  });

  // test failing
  mocha.describe('Close DB Connection', () => {
    mocha.it('after all events', () => {
      // expecting the add subscriber event to be in stack still
      chai.expect(eventQueue.list).to.be.lengthOf(2);

      /**
       * @todo event queue should be part of db script
       */
      chai.expect(eventQueue.pop()).to.equal(startEvent);
    });
  });
});
