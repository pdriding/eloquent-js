import { reverse } from "./reverse.mjs";
const { parse } = require("ini");

console.log(parse("x = 1\ny = 2"));
// Output: { x: '1', y: '2' }

// Index 2 holds the first actual command line argument
let argument = process.argv[2];

console.log(reverse(argument));
