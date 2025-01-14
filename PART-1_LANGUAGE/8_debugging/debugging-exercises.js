class MultiplicatorUnitFailure extends Error {
  constructor(error) {
    super(error);
    this.errorMessage = error;
  }
}

function primitiveMultiply(a, b) {
  if (Math.random() < 0.2) {
    return a * b;
  } else {
    throw new MultiplicatorUnitFailure("Klunk");
  }
}

function reliableMultiply(a, b) {
  // Your code here.
  // for (;;) {
  //   try {
  //     let num = primitiveMultiply(a, b);
  //     return num;
  //   } catch (e) {
  //     if (e instanceof MultiplicatorUnitFailure) {
  //       // console.log(e);
  //       continue;
  //     } else {
  //       throw e;
  //     }
  //   }
  // }

  try {
    let num = primitiveMultiply(a, b);
    return num;
  } catch (e) {
    if (e instanceof MultiplicatorUnitFailure) {
      console.log(e.errorMessage);
      return reliableMultiply(a, b);
    } else {
      throw e;
    }
  }
}

// there solution
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
      if (!(e instanceof MultiplicatorUnitFailure)) throw e;
    }
  }
}

console.log(reliableMultiply(8, 8));
// → 64
// console.log(reliableMultiply(8, 8));
// → 64

const box = new (class {
  locked = true;
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

function performWithUnlockedBox(action) {
  try {
    box.unlock();
    action();
  } catch (error) {
    console.log("Error raised:", error.message);
  } finally {
    box.lock();
  }
}

// Example usage
performWithUnlockedBox(() => {
  box.content.push("gold piece");
});

try {
  performWithUnlockedBox(() => {
    throw new Error("Pirates on the horizon! Abort!");
  });
} catch (error) {
  console.log("Error raised:", error.message);
}
console.log(box.locked);
// → true
