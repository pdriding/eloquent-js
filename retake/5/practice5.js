const SCRIPTS = require("./scripts.js");

const returnfunc = function (max) {
  return (...args) => {
    const test = max(...args);
    return (a) => {
      console.log(test + a);
    };
  };
};

// returnfunc(Math.max)(1, 9, 8)(1);

function repeat(n, action) {
  for (let i = 0; i < n; i++) {
    action(i);
  }
}

function unless(test, then) {
  if (!test) then();
}

// repeat(10, (f) => {
//   unless(f < 5, () => {
//     console.log(f);
//   });
// });

let arrays = [[1, 2, 3], [4, 5], [6]];
// Your code here.
// → [1, 2, 3, 4, 5, 6]

const reduced = arrays.reduce((a, b) => {
  return a.concat(b);
});

// console.log(reduced);

function loop(val, test, update, func) {
  for (let start = val; test(start); start = update(start)) {
    func(start);
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
//   for (let i = 0; i < array.length; i++) {
//     if (!test(array[i])) return false;
//   }
//   return true;
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
// // → true

function characterScript(code) {
  for (let script of SCRIPTS) {
    if (
      script.ranges.some(([from, to]) => {
        return code >= from && code < to;
      })
    ) {
      return script;
    }
  }
  return null;
}

function countBy(items, groupName) {
  let counts = [];
  for (let item of items) {
    let name = groupName(item);
    let known = counts.find((c) => c.name == name);
    if (!known) {
      counts.push({ name, count: 1 });
    } else {
      known.count++;
    }
  }
  return counts;
}

function dominantDirection(text) {
  // Your code here.
  // let direction = [];
  // for (a of text) {
  //   let scripts = characterScript(a.charCodeAt(0));
  //   if (scripts) direction.push(scripts);
  // }

  // return countBy(direction, (a) => a.name);

  let counted = countBy(text, (a) => {
    let test = characterScript(a.charCodeAt(0));
    // console.log(55555, test);
    if (test) return test.direction;
  }).filter((a) => a.name);

  // console.log(7777777, counted);

  return counted.reduce((a, b) => {
    return a.count < b.count ? b : a;
  }).name;
}

console.log(dominantDirection("Hello!"));
// → ltr
console.log(dominantDirection("Hey, مساء الخير"));
// → rtl
