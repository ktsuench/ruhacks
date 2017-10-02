class Stack {
  constructor(...items) {
    this.s = [];

    if (items !== undefined) this.push(...items);
  }

  push(...items) {
    if (items !== undefined) {
      this.s.push(...items);
    }
  }

  pop() {
    const val = this.s.pop();

    if (this.empty) this.isEmpty();

    return val;
  }

  clear() {
    const vals = this.s;

    this.s = [];

    return vals;
  }

  get size() {
    return this.s.length;
  }

  get empty() {
    return this.size < 1;
  }

  get next() {
    return (this.empty ? null : this.s[this.size - 1]);
  }

  get list() {
    return this.s;
  }

  onEmpty(callback) {
    this.onEmptyRun = callback;
  }

  isEmpty() {
    if (this.empty) this.execEmptyEvent();
  }

  execEmptyEvent() {
    this.onEmptyRun();
  }
}

module.exports = Stack;
