require('../config/test');
const mocha = require('mocha');
const chai = require('chai');
const Queue = require('../app/struct/queue');

chai.should();

let count = 0;

mocha.describe('Queue', () => {
  mocha.describe('Queue constructed with 1, 2, 3', () => {
    const queue = new Queue(1, 2, 3);

    mocha.it('Queue list', () => {
      chai.expect(queue.list).to.include(1, 2, 3).and.be.lengthOf(3);
    });

    mocha.it('Queue size', () => {
      chai.expect(queue.size).to.equal(3);
    });

    mocha.it('Queue next exists', () => {
      chai.expect(queue.next).to.equal(1);
    });

    mocha.it('Queue not empty', () => {
      chai.expect(queue.empty).to.be.equal(false);
    });

    mocha.it('Clear queue', () => {
      chai.expect(queue.clear()).to.include(1, 2, 3).and.be.lengthOf(3);
    });

    mocha.it('Queue next doesn\'t exist', () => {
      chai.expect(queue.next).to.equal(null);
    });

    mocha.it('Queue empty', () => {
      chai.expect(queue.empty).to.be.equal(true);
    });
  });

  mocha.describe('Initial Empty Queue', () => {
    const queue = new Queue();

    mocha.it('Adding to queue', () => {
      queue.enqueue(1, 2);

      chai.expect(queue.list).to.include(1, 2);
    });

    mocha.it('Remove from queue', () => {
      chai.expect(queue.dequeue()).to.equal(1);
    });
  });

  mocha.describe('Empty Event', () => {
    const queue = new Queue();

    mocha.it('Set empty event', () => {
      function test() {
        queue.enqueue(count);
        count += 1;
      }

      queue.onEmpty(test);

      chai.expect(queue.onEmptyRun).to.equal(test);
    });

    mocha.it('Check and run', () => {
      queue.isEmpty();

      chai.expect(queue.list).to.include(0).and.is.lengthOf(1);
    });

    mocha.it('Run event directly', () => {
      queue.execEmptyEvent();

      chai.expect(queue.list).to.include(0, 1).and.is.lengthOf(2);
    });

    mocha.it('Dequeue and don\'t run event', () => {
      queue.dequeue();

      chai.expect(queue.list).to.include(1).and.is.lengthOf(1);
    });

    mocha.it('Dequeue and run event', () => {
      queue.dequeue();

      chai.expect(queue.list).to.include(2).and.is.lengthOf(1);
    });
  });
});
