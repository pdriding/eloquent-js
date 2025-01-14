const SCRIPTS = require("./scripts.js");

function flatten(arr) {
  let array = [];
  for (a of arr) {
    array = array.concat(a);
  }
  return array;
}

let arrays = [[1, 2, 3], [4, 5], [6]];
// console.log(flatten(arrays));
// Your code here.
// → [1, 2, 3, 4, 5, 6]

function loop(num, func1, func2, conlog) {
  while (func1(num)) {
    conlog(num);
    num = func2(num);
  }
}

// loop(
//   3,
//   (n) => n > 0,
//   (n) => n - 1,
//   console.log
// );
// → 3
// → 2
// → 1

// function every(array, test) {
//   let answer = true;
//   for (a of array) {
//     if (!test(a)) {
//       answer = false;
//       break;
//     }
//   }
//   return answer;
// }

function every(array, test) {
  return !array.some((a) => {
    return !test(a);
  });
}

// console.log(every([1, 3, 5], (n) => n < 10));
// // → true
// console.log(every([2, 4, 16], (n) => n < 10));
// // → false
// console.log(every([], (n) => n < 10));
// → true

function characterScript(code) {
  for (let script of SCRIPTS) {
    if (
      script.ranges.some(([from, to]) => {
        return code >= from && code < to;
      })
    ) {
      console.log(script);
      return script;
    }
  }
  return null;
}

function countBy(items, groupName) {
  let counts = [];
  for (let item of items) {
    let direction = groupName(item);
    let known = counts.find((c) => c.direction == direction);
    if (!known) {
      counts.push({ direction, count: 1 });
    } else {
      known.count++;
    }
  }
  console.log(counts);
  return counts;
}

function dominantDirection(text) {
  let scripts = countBy(text, (char) => {
    let script = characterScript(char.codePointAt(0));
    return script ? script.direction : "none";
  }).filter(({ direction }) => direction != "none");
  if (scripts.length == 0) return "ltr";

  return scripts.reduce((a, b) => (a.count > b.count ? a : b)).direction;
}

console.log(dominantDirection("Hello!"));
// → ltr
console.log(dominantDirection("Hey, مساء الخير"));
// → rtl
