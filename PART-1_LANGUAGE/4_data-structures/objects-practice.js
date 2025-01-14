function range(start, end, step = 1) {
  let result = [];
  if (step > 0) {
    for (let i = start; i <= end; i += step) {
      result.push(i);
    }
  } else {
    for (let i = start; i >= end; i += step) {
      result.push(i);
    }
  }
  return result;
}

function sum(numbers) {
  return numbers.reduce((total, num) => total + num, 0);
}

// console.log(range(1, 10, 3));
// // → [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
// console.log(range(5, 2, -1));
// // → [5, 4, 3, 2]
// console.log(sum(range(1, 10)));
// → 55

// -------------------

const reverseArray = function (arr) {
  let length = arr.length;
  let newArr = [];
  for (let i = 0; i < length; i++) {
    newArr.push(arr.pop());
  }
  return newArr;
};

const reverseArrayInPlace = function (array) {
  for (let i = 0; i < Math.floor(array.length / 2); i++) {
    let temp = array[i];
    array[i] = array[array.length - 1 - i];
    array[array.length - 1 - i] = temp;
  }
};

// let myArray = ["A", "B", "C", "D"];
// console.log(reverseArray(myArray));
// → ["C", "B", "A"];
// console.log(myArray);
// // → ["A", "B", "C"];
// let arrayValue = [1, 2, 3, 4, 5];
// reverseArrayInPlace(arrayValue);
// console.log(arrayValue);
// → [5, 4, 3, 2, 1]

const arrayToList = function (array) {
  if (array.length === 0) {
    return null;
  } else {
    let obby = {
      value: array[0],
      rest: arrayToList(array.slice(1)),
    };
    return obby;
  }
};

const listToArray = function (list) {
  if (!list) {
    return [];
  } else {
    return [list.value].concat(listToArray(list.rest));
  }
};

const prepend = function (...prep) {
  let obj = {
    value: prep[0],
    rest: prep[1],
  };
  return obj;
};

function nth(list, n) {
  if (!list) return undefined;
  else if (n == 0) return list.value;
  else return nth(list.rest, n - 1);
}

// console.log(arrayToList([10, 20, 30]));
// // → {value: 10, rest: {value: 20, rest: null}}
// console.log(listToArray(arrayToList([10, 20, 30])));
// // // → [10, 20, 30]
// console.log(prepend(10, prepend(20, null)));
// // → {value: 10, rest: {value: 20, rest: null}}
// console.log(nth(arrayToList([10, 20, 30]), 2));
// // → 20

// function deepEqual(val1, val2) {
//   if (Object.keys(val1).length == 1 && Object.keys(val2).length == 1) {
//     if (JSON.stringify(val1) === JSON.stringify(val2)) return true;
//   }

//   if (Object.keys(val1).length == Object.keys(val2).length) {
//     for (a in val1) {
//       if (typeof val1[a] == "object") {
//         if (!deepEqual(val1[a], val2[a])) {
//           return false;
//         } else {
//           break;
//         }
//       } else {
//         if (val1[a] !== val2[a]) {
//           return false;
//         } else {
//           break;
//         }
//       }
//     }
//     return true;
//   } else {
//     return false;
//   }
// }

function deepEqual(a, b) {
  if (a === b) return true;

  if (a == null || typeof a != "object" || b == null || typeof b != "object")
    return false;

  let keysA = Object.keys(a),
    keysB = Object.keys(b);

  if (keysA.length != keysB.length) return false;

  for (let key of keysA) {
    if (!keysB.includes(key) || !deepEqual(a[key], b[key])) return false;
  }

  return true;
}

let obj = { here: { is: "an" }, object: 2 };
console.log(deepEqual(obj, obj));
// → true
console.log(deepEqual(obj, { here: 1, object: 2 }));
// → false
console.log(deepEqual(obj, { here: { is: "an" }, object: 2 }));
// → true
