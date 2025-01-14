let protoDog = {
  speak(line) {
    console.log(`${this.type} dog says ${line}`);
  },
};

const dog = Object.create(protoDog);

// dog.type = "Black";
// dog.speak("woof");

// console.log(Object.getPrototypeOf(protoDog));

class Rabbit {
  constructor(type) {
    this.type = type;
  }

  #getSecret(secret) {
    return (secret += secret);
  }

  speak(sound) {
    console.log(`${this.type} rabbit says ${this.#getSecret(sound)}`);
  }
}

const killerRabbit = new Rabbit("Black");

Rabbit.prototype.teeth = "small";
// console.log(111, blackRabbit.teeth);

// blackRabbit.speak("woof");

let ages = new Map();

ages.set("Bob", 39);

// console.log(ages.get("Bob"));

Rabbit.prototype.toString = function () {
  return `a ${this.type} rabbit`;
};

// console.log(String(killerRabbit));
// → a killer rabbit

class Temparature {
  constructor(celcius) {
    this.celcius = celcius;
  }
  get farenheight() {
    return this.celcius / 3;
  }
  set farenheight(value) {
    this.celcius = value * 3;
  }
  static fromFarenheight(value) {
    return new Temparature(value / 3);
  }
}

let temp = new Temparature(22);

// console.log(temp.farenheight);
// console.log((temp.farenheight = 30));
// console.log(temp.celcius);

// let boil = Temparature.fromFarenheight(100);
// console.log(boil.celcius);

const length = Symbol("length");

const myTrip = {
  length: 2,
  A: 100,
  B: 200,
  [length]: 300,
};

// console.log(myTrip.length);
// console.log(myTrip[length]);

class List {
  constructor(value, rest) {
    this.value = value;
    this.rest = rest;
  }
  get length() {
    return 1 + (this.rest ? this.rest.length : 0);
  }
  static fromArray(arr) {
    let result = null;
    for (let i = arr.length - 1; i >= 0; i--) {
      result = new this(arr[i], result);
    }
    return result;
  }
}

// class ListIterator {
//   constructor(list) {
//     this.list = list;
//   }
//   next() {
//     if (this.list == null) {
//       return { done: true };
//     }

//     let value = this.list.value;
//     this.list = this.list.rest;
//     return { value, done: false };
//   }
// }

List.prototype[Symbol.iterator] = function () {
  return new ListIterator(this);
};

// let list = List.fromArray([1, 2, 3]);
// for (let element of list) {
//   console.log(element);
// }
// console.log(list.length);

class ListLength extends List {
  #length;
  constructor(value, rest) {
    super(value, rest);
    this.#length = super.length;
  }
  get length() {
    return this.#length;
  }
}

// console.log(ListLength.fromArray([1, 2, 3, 4]).length);

// Your code here.

class Vec {
  constructor(a, b) {
    this.x = a;
    this.y = b;
  }
  plus(a) {
    return new Vec(this.x + a.x, this.y + a.y);
  }

  minus(other) {
    return new Vec(this.x - other.x, this.y - other.y);
  }

  get length() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }
}

// console.log(new Vec(1, 2).plus(new Vec(2, 3)));
// // → Vec{x: 3, y: 5}
// console.log(new Vec(1, 2).minus(new Vec(2, 3)));
// // → Vec{x: -1, y: -1}
// console.log(new Vec(3, 4).length);
// // → 5

// class Group {
//   constructor() {
//     this.array = [];
//   }
//   add(v) {
//     if (!this.has(v)) {
//       this.array.push(v);
//       return new Group(this.array);
//     }
//   }
//   delete(v) {
//     if (this.has(v)) {
//       const pos = this.array.indexOf(v);
//       this.array.splice(pos, 1);
//       return new Group(this.array);
//     }
//   }
//   has(v) {
//     return this.array.includes(v);
//   }
//   static from(arr) {
//     let group = new Group();
//     for (let a of arr) {
//       group.add(a);
//     }
//     return group;
//   }
// }

// let group = Group.from([10, 20]);
// console.log(group.has(10));
// // → true
// console.log(group.has(30));
// // → false
// group.add(10);

// group.delete(10);
// console.log(group.has(10));
// // // → false

class Group {
  #members = [];

  add(value) {
    if (!this.has(value)) {
      this.#members.push(value);
    }
  }

  delete(value) {
    this.#members = this.#members.filter((v) => v !== value);
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
    return new ListIterator(this.#members);
  }
}

class ListIterator {
  #members;
  #position;
  constructor(members) {
    this.#members = members;
    this.#position = 0;
  }

  next() {
    if (this.#position === this.#members.length) {
      return { done: true };
    } else {
      let value = this.#members[this.#position];
      this.#position++;
      return { value, done: false };
    }
  }
}

for (let value of Group.from(["a", "b", "c"])) {
  console.log(value);
}
// → a
// → b
// → c
