const size = 8;
let f = "";
for (let i = 0; i < size; i++) {
  for (let n = 0; n < size; n++) {
    if (n == 0 && i % 2 == 0) f += " ";
    if (n % 2 == 0) {
      f += "#";
    }
    if (n % 2 != 0) {
      f += " ";
    }
  }
  f += "\n";
}
console.log(f);

// function generateChessboard(size) {
//   let chessboard = "";

//   for (let row = 0; row < size; row++) {
//     for (let col = 0; col < size; col++) {
//       if ((row + col) % 2 === 0) {
//         chessboard += " ";
//       } else {
//         chessboard += "#";
//       }
//     }
//     chessboard += "\n"; // Add newline character after each row
//   }

//   return chessboard;
// }

// const size = 8;
// const chessboardString = generateChessboard(size);
// console.log(chessboardString);
