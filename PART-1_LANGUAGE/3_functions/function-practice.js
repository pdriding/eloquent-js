// ---- MINIMUM -----

const min = function (a, b) {
  return a < b ? a : b;
};

// console.log(min(0, 10));
// // → 0
// console.log(min(0, -10));
// → -10

// ---- RESCUSRSION -----
function isEven(n) {
  if (n < 0) {
    return isEven(-n); // Convert negative numbers to positive
  } else if (n === 0) {
    return true; // Zero is even
  } else if (n === 1) {
    return false; // One is odd
  } else {
    return isEven(n - 2); // Recursively check for evenness
  }
}

// console.log(isEven(50));
// // → true
// console.log(isEven(75));
// // → false
// console.log(isEven(-1));
// → ??

// --- BEAN COUNTING ---

const countBs = function (word) {
  // let counter = 0;
  // for (let i = 0; i < word.length; i++) {
  //   // if (word[i] < "a") counter += 1;
  //   if (word[i] === "B") counter++;
  // }
  // return counter;
  return countChar(word, "B");
};

const countChar = function (word, char) {
  let counter = 0;
  for (a of word) {
    if (a === char) counter++;
  }
  return counter;
};

console.log(countBs("BOB"));
// → 2
console.log(countChar("kakkerlak", "k"));
// → 4
