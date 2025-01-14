// Define a class for a linked list
class List {
  constructor(value, rest) {
    this.value = value;
    this.rest = rest;
  }

  get length() {
    return 1 + (this.rest ? this.rest.length : 0);
  }

  static fromArray(array) {
    let result = null;
    for (let i = array.length - 1; i >= 0; i--) {
      result = new this(array[i], result);
    }
    return result;
  }
}

// Define a class for the iterator
class ListIterator {
  constructor(list) {
    this.list = list;
  }

  next() {
    if (this.list == null) {
      return { done: true };
    }
    let value = this.list.value;
    this.list = this.list.rest;
    return { value, done: false };
  }
}

// Make the List class iterable
List.prototype[Symbol.iterator] = function () {
  return new ListIterator(this);
};

// Create a list from an array
let list = List.fromArray([1, 2, 3]);
let list2 = List.fromArray(["p", "e", "t", "e", "r"]);

// // Iterate over the list using for/of loop
// for (let element of list2) {
//   console.log(element);
// }
// // Output: 1, 2, 3

// // Using spread syntax with an iterable
// console.log([...list]); // Output: [1, 2, 3]
