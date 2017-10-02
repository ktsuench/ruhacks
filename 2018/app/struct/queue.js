class Queue {
  constructor(...items) {
    this.q = [];

    if (items !== undefined) this.enqueue(...items);
  }

  enqueue(...items) {
    if (items !== undefined) {
      this.q.push(...items);
    }
  }

  dequeue() {
    const val = this.q.shift();

    if (this.empty) this.isEmpty();

    return val;
  }

  clear() {
    const vals = this.q;

    this.q = [];

    return vals;
  }

  get size() {
    return this.q.length;
  }

  get empty() {
    return this.size < 1;
  }

  get next() {
    return (this.empty ? null : this.q[0]);
  }

  get list() {
    return this.q;
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

module.exports = Queue;
