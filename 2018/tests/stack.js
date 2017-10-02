require('../config/test');
const mocha = require('mocha');
const chai = require('chai');
const Stack = require('../app/struct/stack');

chai.should();

let count = 0;

mocha.describe('Stack', () => {
  mocha.describe('Stack constructed with 1, 2, 3', () => {
    const stack = new Stack(1, 2, 3);

    mocha.it('Stack list', () => {
      chai.expect(stack.list).to.include(1, 2, 3).and.be.lengthOf(3);
    });

    mocha.it('Stack size', () => {
      chai.expect(stack.size).to.equal(3);
    });

    mocha.it('Stack next exists', () => {
      chai.expect(stack.next).to.equal(3);
    });

    mocha.it('Stack not empty', () => {
      chai.expect(stack.empty).to.be.equal(false);
    });

    mocha.it('Clear stack', () => {
      chai.expect(stack.clear()).to.include(1, 2, 3).and.be.lengthOf(3);
    });

    mocha.it('Stack next doesn\'t exist', () => {
      chai.expect(stack.next).to.equal(null);
    });

    mocha.it('Stack empty', () => {
      chai.expect(stack.empty).to.be.equal(true);
    });
  });

  mocha.describe('Initial Empty Stack', () => {
    const stack = new Stack();

    mocha.it('Adding to stack', () => {
      stack.push(1, 2);

      chai.expect(stack.list).to.include(1, 2);
    });

    mocha.it('Remove from stack', () => {
      chai.expect(stack.pop()).to.equal(2);
    });
  });

  mocha.describe('Empty Event', () => {
    const stack = new Stack();

    mocha.it('Set empty event', () => {
      function test() {
        stack.push(count);
        count += 1;
      }

      stack.onEmpty(test);

      chai.expect(stack.onEmptyRun).to.equal(test);
    });

    mocha.it('Check and run', () => {
      stack.isEmpty();

      chai.expect(stack.list).to.include(0).and.is.lengthOf(1);
    });

    mocha.it('Run event directly', () => {
      stack.execEmptyEvent();

      chai.expect(stack.list).to.include(0, 1).and.is.lengthOf(2);
    });

    mocha.it('Pop and don\'t run event', () => {
      stack.pop();

      chai.expect(stack.list).to.include(0).and.is.lengthOf(1);
    });

    mocha.it('Pop and run event', () => {
      stack.pop();

      chai.expect(stack.list).to.include(2).and.is.lengthOf(1);
    });
  });
});
