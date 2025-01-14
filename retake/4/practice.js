// const range = function (start, end, step = 0) {
//   let final = [];

//   for (i = start; start < end ? i <= end : i >= end; start < end ? i++ : i--) {
//     if (i % step !== 0 && step !== -1 && step !== 1) {
//       final.push(i);
//     } else {
//       final.push(i);
//     }
//   }
//   return final;
// };

// const sum = function (arr) {
//   result = 0;
//   for (i of arr) {
//     result += i;
//   }
//   return result;
// };

// // Your code here.

// // console.log(range(1, 10, 2));
// // // → [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
// // console.log(range(5, 2, -1));
// // // → [5, 4, 3, 2]
// // console.log(sum(range(1, 10)));
// // // → 55

// const reverseArray = function (arr) {
//   const rev = [];

//   for (const [i, n] of arr.entries()) {
//     rev.push(arr[arr.length - i - 1]);
//   }

//   return rev;
// };

// const reverseArrayInPlace = function (arr) {
//   for (i = 0; i < Math.floor(arr.length / 2); i++) {
//     let old = arr[i];
//     arr[i] = arr[arr.length - 1 - i];
//     arr[arr.length - 1 - i] = old;
//   }
//   return arr;
// };

// // let myArray = ["A", "B", "C"];
// // console.log(reverseArray(myArray));
// // // → ["C", "B", "A"];
// // console.log(myArray);
// // // → ["A", "B", "C"];
// // let arrayValue = [1, 2, 3, 4, 5];
// // reverseArrayInPlace(arrayValue);
// // console.log(arrayValue);
// // → [5, 4, 3, 2, 1]

// const arrayToList = function (values) {
//   let obj = {};
//   for (i = values.length - 1; i >= 0; i--) {
//     if (i === values.length - 1) {
//       obj = { value: values[i], rest: null };
//     } else {
//       obj = { value: values[i], rest: obj };
//     }
//   }
//   return obj;
// };

// const listToArray = function (values) {
//   let arr = [];
//   do {
//     arr.push(values.value);
//     values = values.rest;
//     if (values.rest === null) {
//       arr.push(values.value);
//     }
//   } while (values.rest !== null);

//   return arr;
// };

// const prepend = function (...values) {
//   const obj = {
//     value: values[0],
//     rest: values[1],
//   };
//   return obj;
// };

// // const nth = function (val, pos) {
// //   const newVal = listToArray(val);
// //   return newVal[pos];
// // };

// const nth = function (val, pos) {
//   let counter = 0;

//   function recur(val, counter) {
//     if (counter === pos) {
//       return val.value;
//     }
//     val = val.rest;
//     counter++;
//     return recur(val, counter);
//   }
//   return recur(val, counter);
// };

// // console.log(arrayToList([10, 20, 30]));
// // → {value: 10, rest: {value: 20, rest: null}}
// // console.log(1, listToArray(arrayToList([10, 20, 30])));
// // // // → [10, 20, 30]
// // console.log(2, prepend(5, prepend(10, prepend(20, null))));
// // // // → {value: 10, rest: {value: 20, rest: null}}
// // console.log(3, nth(arrayToList([10, 20, 30]), 2));
// // → 20

// const deepEqual1 = function (obj1, obj2) {
//   const keys1 = Object.keys(obj1);
//   const keys2 = Object.keys(obj2);

//   const recur = function (val1, val2) {
//     let test1 = Object.keys(val1);
//     let test2 = Object.keys(val2);
//     return val1[test1] === val2[test2];
//   };

//   for ([i, a] of keys1.entries()) {
//     if (keys1[i] !== keys2[i]) return false;

//     if (typeof obj1[keys1[i]] == "object") {
//       if (!recur(obj1[keys1[i]], obj2[keys2[i]])) {
//         return false;
//       }
//       break;
//     }
//     if (obj1[keys1[i]] !== obj2[keys2[i]]) {
//       return false;
//     }
//   }
//   return true;
// };

// function deepEqual(a, b) {
//   console.log(44, a === b, a, b);
//   if (a === b) return true;

//   if (a == null || typeof a != "object" || b == null || typeof b != "object")
//     return false;

//   let keysA = Object.keys(a),
//     keysB = Object.keys(b);
//   console.log(55, keysA, keysB, keysA.includes(keysB[0]));
//   // return keysA === keysB || deepEqual(keysA, keysB);
// }

// let obj = { here: { is: "an" }, object: 2 };
// console.log(deepEqual(obj, obj));
// // → true
// console.log(deepEqual(obj, { here: 1, object: 2 }));
// // // → false
// console.log(deepEqual(obj, { here: { is: "an" }, object: 2 }));
// // → true

const range = function (s, e, i = 1) {
  let test = [];
  let x = s < e ? s : e;
  let p = s > e ? s : e;
  for (x; x <= p; x += Math.abs(i)) {
    i == true ? test.push(x) : test.unshift(x);
  }
  return test;
};

const sum = function (test) {
  let f = 0;
  for (i of test) {
    f += i;
  }
  return f;
};

// console.log(range(1, 10, 1));
// // → [1, 2, 3, 4, 5, 6, 7 8, 9, 10]
// console.log(range(5, 2, -1));
// → [5, 4, 3, 2]
// console.log(sum(range(1, 10)));
// → 55

const reverseArray = function (arr) {
  let empt = [];

  for (i of arr) {
    empt.unshift(i);
  }
  return empt;
};

// const reverseArrayInPlace = function (arr) {
//   let newArr = [];
//   let counter = 0;
//   for (let i = arr.length - 1; i >= 0; i--) {
//     newArr[counter] = arr[i];
//     counter++;
//   }
//   arrayValue = newArr;
// };

const reverseArrayInPlace = function (arr) {
  for (let i = 0; i < Math.floor(arr.length) / 2; i++) {
    let b = arr[i];
    arr[i] = arr[arr.length - 1 - i];
    arr[arr.length - 1 - i] = b;
  }
};

// let myArray = ["A", "B", "C"];
// console.log(reverseArray(myArray));
// // → ["C", "B", "A"];
// console.log(myArray);
// // → ["A", "B", "C"];
// let arrayValue = [1, 2, 3, 4, 5];
// reverseArrayInPlace(arrayValue);
// console.log(arrayValue);
// // → [5, 4, 3, 2, 1]

// Your code here.

const arrayToList = function (arr) {
  let list = {};
  arr.reverse();
  for (let i = 0; i < arr.length; i++) {
    list = {
      value: arr[i],
      rest: i == 0 ? null : list,
    };
  }
  return list;
};

// const listToArray = function (obj) {
//   let arr = [];

//   const recur = function (obj1) {
//     arr.push(obj1.value);
//     if (obj1.rest == null) {
//       return arr;
//     } else {
//       recur(obj1.rest);
//     }
//   };
//   recur(obj);
//   return arr;
// };

const listToArray = function (list) {
  let arr = [];
  for (let node = list; node; node = node.rest) {
    arr.push(node.value);
  }
  return arr;
};

const prepend = function (v, r) {
  let list = {
    value: v,
    rest: r,
  };
  return list;
};

const nth = function (func, pos) {
  counter = 0;
  const recur = function (func1) {
    if (counter == pos) {
      return func1.value;
    } else {
      counter++;
      return recur(func1.rest);
    }
  };
  return recur(func);
};

// console.log(arrayToList([10, 20, 30]));
// → {value: 10, rest: {value: 20, rest: null}}
// console.log(listToArray(arrayToList([10, 20, 30])));
// // → [10, 20, 30]
// console.log(prepend(10, prepend(20, null)));
// // → {value: 10, rest: {value: 20, rest: null}}
// console.log(nth(arrayToList([10, 20, 30]), 1));
// // → 20

// const deepEqual = function (obj1, obj2) {
//   const keys1 = Object.keys(obj1);
//   console.log(obj1[keys1[0]]);
//   console.log(Object.keys(obj1).length);
//   for (let i = 0; i < Object.keys(obj1).length; i++) {
//     console.log(111, obj1[keys1[0]] === obj2[keys1[0]]);
//     console.log(555555555, typeof obj1[keys1[i]], obj1[keys1[i]]);
//   }
// };

const deepEqual = function (obj1, obj2) {
  // Quick reference equality check
  if (obj1 === obj2) return true;

  if (
    obj1 == null ||
    typeof obj1 != "object" ||
    obj2 == null ||
    typeof obj2 != "object"
  )
    return false;

  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  // Ensure both objects have the same number of keys
  if (keys1.length !== keys2.length) return false;

  for (const i of keys1) {
    if (!keys2.includes(i)) return false;

    if (!deepEqual(obj1[i], obj2[i])) {
      return false;
    }
  }

  return true;
};

let obj = { here: { is: "an" }, object: 2 };
console.log(deepEqual(obj, obj));
// → true
console.log(deepEqual(obj, { here: 1, object: 2 }));
// → false
console.log(deepEqual(obj, { here: { is: "an" }, object: 2 }));
// → true `
