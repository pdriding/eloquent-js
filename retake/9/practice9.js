// Fill in the regular expressions

verify(/car|cat/, ["my car", "bad cats"], ["camper", "high art"]);

verify(/pr?op/, ["pop culture", "mad props"], ["plop", "prrrop"]);

verify(
  /^ferr(et|y|ari)$/,
  ["ferret", "ferry", "ferrari"],
  ["ferrum", "transfer A"]
);

verify(
  /\b\w+ious\b/,
  ["how delicious", "spacious room"],
  ["ruinous", "consciousness"]
);

verify(/\s[.,:;]/, ["bad punctuation ."], ["escape the period"]);

verify(
  /\b\w{7,}\b/,
  ["Siebentausenddreihundertzweiundzwanzig"],
  ["no", "three small words"]
);

verify(
  /\b[^eE\s\W\d_]{1,}\b/,
  ["red platypus", "wobbling nest"],
  ["earth bed", "bedrøvet abe", "BEET"]
);

function verify(regexp, yes, no) {
  // Ignore unfinished exercises
  if (regexp.source == "...") return;
  for (let str of yes)
    if (!regexp.test(str)) {
      console.log(`Failure to match '${str}'`);
    }
  for (let str of no)
    if (regexp.test(str)) {
      console.log(`Unexpected match for '${str}'`);
    }
}

//-------------------------------

let text = "'I'm the cook,' he said, 'it's my job.'";
// Change this call.
console.log(text.replace(/(?<=\W)'|'(?=\W)/g, '"'));
// → "I'm the cook," he said, "it's my job."

// ---------------------------

// Fill in this regular expression.
let number = /^[+-]?(\d+(\.\d*)?|\.\d+)([eE][+-]?\d+)?$/;

// Tests:
for (let str of [
  "1",
  "-1",
  "+15",
  "1.55",
  ".5",
  "5.",
  "1.3e2",
  "1E-4",
  "1e+12",
]) {
  if (!number.test(str)) {
    console.log(`Failed to match '${str}'`);
  }
}
for (let str of ["1a", "+-1", "1.2.3", "1+1", "1e4.5", ".5.", "1f5", "."]) {
  if (number.test(str)) {
    console.log(`Incorrectly accepted '${str}'`);
  }
}
