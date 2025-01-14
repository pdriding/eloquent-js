class Vec {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  plus(other) {
    return new Vec(this.x + other.x, this.y + other.y);
  }

  minus(other) {
    return new Vec(this.x - other.x, this.y - other.y);
  }

  get length() {
    return Math.sqrt(this.x ** 2 + this.y ** 2);
  }
}

// console.log(new Vec(10, 11).plus(new Vec(6, 2)));
// console.log(new Vec(1, 2).minus(new Vec(2, 3)));
// console.log(new Vec(3, 4).length);

class Group {
  #members = [];

  get members() {
    return this.#members;
  }

  add(value) {
    if (!this.has(value)) {
      this.#members.push(value);
    }
  }

  delete(value) {
    this.#members = this.#members.filter((a) => a != value);
  }

  has(value) {
    return this.#members.includes(value);
  }

  static from(collection) {
    let group = new Group();
    for (let value of collection) {
      group.add(value);
    }
    return group;
  }

  [Symbol.iterator]() {
    return new GroupIterator(this.#members);
  }
}

class GroupIterator {
  index = 0;
  constructor(members) {
    this.members = members;
  }

  thi;

  next() {
    if (this.index >= this.members.length) {
      return { done: true };
    }
    return { value: this.members[this.index++], done: false };
  }
}

let group = Group.from([10, 20]);

// for (let a of group) {
//   console.log(a);
// }

for (let value of Group.from(["a", "b", "c"])) {
  console.log(value);
}

console.log(group.has(10));
// → true
console.log(group.has(30));
// → false
group.add(10);
group.delete(10);
console.log(group.has(10));
// → false
