function promptDirection(question) {
  let result = prompt(question);
  if (result === "L") return true;
  if (result === "R") return false;
  throw new Error("hmmm");
}

function look() {
  if (promptDirection("Left or Right?")) {
    return "happy";
  } else {
    return "run";
  }
}

// try {
//   console.log("You see", look());
// } catch (error) {
//   console.log("Something went wrong: " + error);
// }

// ------------------------------------

class MultiplicatorUnitFailure extends Error {}

function primitiveMultiply(a, b) {
  if (Math.random() < 0.2) {
    return a * b;
  } else {
    throw new MultiplicatorUnitFailure("Klunk");
  }
}

function reliableMultiply(a, b) {
  for (;;) {
    try {
      return primitiveMultiply(a, b);
    } catch (e) {
      console.log("hmmmm", e);
    }
  }
}

// console.log(reliableMultiply(8, 8));
// → 64

//---------------------------------------

const box = new (class {
  locked = false;
  #content = [];

  unlock() {
    this.locked = false;
  }
  lock() {
    this.locked = true;
  }
  get content() {
    if (this.locked) throw new Error("Locked!");
    return this.#content;
  }
})();

function withBoxUnlocked(body) {
  let alreadyUnLocked = false;
  try {
    if (box.locked === false) alreadyUnLocked = true;
    box.unlock();
    body();
    console.log(333, box.content);
  } finally {
    if (alreadyUnLocked) box.lock();
  }
}

withBoxUnlocked(() => {
  box.content.push("gold piece");
});

try {
  withBoxUnlocked(() => {
    throw new Error("Pirates on the horizon! Abort!");
  });
} catch (e) {
  console.log("Error raised: " + e);
}
console.log(box.locked);
// → true
