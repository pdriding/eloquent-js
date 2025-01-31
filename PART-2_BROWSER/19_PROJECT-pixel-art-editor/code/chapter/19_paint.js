var Picture = class Picture {
  constructor(width, height, pixels) {
    this.width = width;
    this.height = height;
    this.pixels = pixels;
  }
  static empty(width, height, color) {
    let pixels = new Array(width * height).fill(color);
    return new Picture(width, height, pixels);
  }
  pixel(x, y) {
    return this.pixels[x + y * this.width];
  }
  draw(pixels) {
    let copy = this.pixels.slice();
    for (let { x, y, color } of pixels) {
      copy[x + y * this.width] = color;
    }
    return new Picture(this.width, this.height, copy);
  }
};

function updateState(state, action) {
  return { ...state, ...action };
}

function elt(type, props, ...children) {
  let dom = document.createElement(type);
  if (props) Object.assign(dom, props);
  for (let child of children) {
    if (typeof child != "string") dom.appendChild(child);
    else dom.appendChild(document.createTextNode(child));
  }
  return dom;
}

var scale = 10;

var PictureCanvas = class PictureCanvas {
  constructor(picture, pointerDown) {
    this.dom = elt("canvas", {
      onmousedown: (event) => this.mouse(event, pointerDown),
      ontouchstart: (event) => this.touch(event, pointerDown),
    });
    this.syncState(picture);
  }
  syncState(picture) {
    if (this.picture == picture) return;

    let oldPicture = this.picture;
    this.picture = picture;

    drawPicture(oldPicture, this.picture, this.dom, scale);
  }
};

function updatePicture(prevPicture, newPicture) {}

function drawPicture(previous, picture, canvas, scale) {
  if (
    previous == null ||
    previous.width != picture.width ||
    previous.height != picture.height
  ) {
    canvas.width = picture.width * scale;
    canvas.height = picture.height * scale;
    previous = null;
  }
  let cx = canvas.getContext("2d");

  let counter = 0;
  for (let y = 0; y < picture.height; y++) {
    for (let x = 0; x < picture.width; x++) {
      if (
        previous == null ||
        previous.pixels[counter] !== picture.pixels[counter]
      ) {
        cx.fillStyle = picture.pixel(x, y);
        cx.fillRect(x * scale, y * scale, scale, scale);
      }
      counter++;
    }
  }
}

PictureCanvas.prototype.mouse = function (downEvent, onDown) {
  if (downEvent.button != 0) return;
  let pos = pointerPosition(downEvent, this.dom);
  let onMove = onDown(pos);
  if (!onMove) return;
  let move = (moveEvent) => {
    if (moveEvent.buttons == 0) {
      this.dom.removeEventListener("mousemove", move);
    } else {
      let newPos = pointerPosition(moveEvent, this.dom);
      if (newPos.x == pos.x && newPos.y == pos.y) return;
      pos = newPos;
      onMove(newPos);
    }
  };
  this.dom.addEventListener("mousemove", move);
};

function pointerPosition(pos, domNode) {
  let rect = domNode.getBoundingClientRect();
  return {
    x: Math.floor((pos.clientX - rect.left) / scale),
    y: Math.floor((pos.clientY - rect.top) / scale),
  };
}

PictureCanvas.prototype.touch = function (startEvent, onDown) {
  let pos = pointerPosition(startEvent.touches[0], this.dom);
  let onMove = onDown(pos);
  startEvent.preventDefault();
  if (!onMove) return;
  let move = (moveEvent) => {
    let newPos = pointerPosition(moveEvent.touches[0], this.dom);
    if (newPos.x == pos.x && newPos.y == pos.y) return;
    pos = newPos;
    onMove(newPos);
  };
  let end = () => {
    this.dom.removeEventListener("touchmove", move);
    this.dom.removeEventListener("touchend", end);
  };
  this.dom.addEventListener("touchmove", move);
  this.dom.addEventListener("touchend", end);
};

var PixelEditor = class PixelEditor {
  constructor(state, config) {
    let { tools, controls, dispatch } = config;
    this.state = state;

    this.toolKeys = Object.keys(tools).map((t) => {
      return { letter: t[0], toolV: t };
    });

    this.canvas = new PictureCanvas(state.picture, (pos) => {
      let tool = tools[this.state.tool];
      let onMove = tool(pos, this.state, dispatch);
      if (onMove) return (pos) => onMove(pos, this.state);
    });
    this.controls = controls.map((Control) => new Control(state, config));
    this.dom = elt(
      "div",
      {
        tabIndex: 0,
        onkeydown: (event) => {
          this.keyDown(event, config);
        },
      },
      this.canvas.dom,
      elt("br"),
      ...this.controls.reduce((a, c) => a.concat(" ", c.dom), [])
    );
  }
  keyDown(event, config) {
    // Undo
    if (event.ctrlKey && event.key === "z") {
      config.dispatch({ undo: true });
      // Key shortcuts
    } else if (!event.ctrlKey && !event.metaKey && !event.altKey) {
      for (let tool of Object.keys(config.tools)) {
        if (tool[0] === event.key) {
          event.preventDefault();
          config.dispatch({ tool });
        }
      }
    }
  }
  syncState(state) {
    this.state = state;
    this.canvas.syncState(state.picture);
    for (let ctrl of this.controls) ctrl.syncState(state);
  }
};

var ToolSelect = class ToolSelect {
  constructor(state, { tools, dispatch }) {
    this.select = elt(
      "select",
      {
        onchange: () => dispatch({ tool: this.select.value }),
      },
      ...Object.keys(tools).map((name) =>
        elt(
          "option",
          {
            selected: name == state.tool,
          },
          name
        )
      )
    );
    this.dom = elt("label", null, "🖌 Tool: ", this.select);
  }
  syncState(state) {
    this.select.value = state.tool;
  }
};

var ColorSelect = class ColorSelect {
  constructor(state, { dispatch }) {
    this.input = elt("input", {
      type: "color",
      value: state.color,
      onchange: () => dispatch({ color: this.input.value }),
    });
    this.dom = elt("label", null, "🎨 Color: ", this.input);
  }
  syncState(state) {
    this.input.value = state.color;
  }
};

function draw(pos, state, dispatch) {
  function drawPixel({ x, y }, state) {
    let drawn = { x, y, color: state.color };
    dispatch({ picture: state.picture.draw([drawn]) });
  }
  drawPixel(pos, state);
  return drawPixel;
}

function slopeRound(num) {
  return Math.round(num * 10);
}

// function line(start, state, dispatch) {
//   console.log("line");
//   function drawLine(pos) {
//     let xStart = Math.min(start.x, pos.x);
//     let yStart = Math.min(start.y, pos.y);
//     let xEnd = Math.max(start.x, pos.x);
//     let yEnd = Math.max(start.y, pos.y);

//     // Difference
//     let xDif = Math.abs(xEnd - xStart);
//     let yDif = Math.abs(yEnd - yStart);
//     let begin = xDif > yDif ? xStart : yStart;
//     let extra = xDif > yDif ? Math.abs(yEnd - yStart) : Math.abs(xEnd - xStart);

//     let end = xDif > yDif ? xEnd : yEnd;

//     let slope = xDif > yDif ? yDif / xDif : xDif / yDif;

//     let drawn = [];

//     let i;
//     let z;
//     let x;

//     let num = Math.round(end / 3);
//     let counter = 0;

//     for (i = begin; i < 20 + begin; i++) {
//       for (z = 0; z <= 5; z++) {
//         console.log(Math.round(slope));
//         y = start.y + z;
//         x = i;

//         drawn.push({ x, y, color: state.color });
//         if (z === 5) {
//           console.log(1);
//         }
//       }
//     }

//     dispatch({ picture: state.picture.draw(drawn) });
//   }
//   drawLine(start);
//   return drawLine;
// }

//  ---- LATEST -----

// function line(start, state, dispatch) {
//   console.log("line");
//   function drawLine(pos) {
//     let xStart = Math.min(start.x, pos.x);
//     let yStart = Math.min(start.y, pos.y);
//     let xEnd = Math.max(start.x, pos.x);
//     let yEnd = Math.max(start.y, pos.y);

//     // Difference
//     let xDif = Math.abs(xEnd - xStart);
//     let yDif = Math.abs(yEnd - yStart);
//     let begin = xDif > yDif ? xStart : yStart;
//     let extra = xDif > yDif ? Math.abs(yEnd - yStart) : Math.abs(xEnd - xStart);

//     let end = xDif > yDif ? xEnd : yEnd;

//     let slope = xDif > yDif ? yDif / xDif : xDif / yDif;

//     let drawn = [];

//     let i;
//     let z;
//     let x;

//     let counter = 0;
//     let counter2 = 1;
//     let slopeTimesAxis = Math.round(slope * end);
//     let divide = Math.round(end / slopeTimesAxis);

//     for (i = begin; i < end; i++) {
//       if (counter === divide) {
//         counter = 0;
//         counter2++;
//       }
//       for (z = 0; z < slopeTimesAxis; z++) {
//         console.log(slopeTimesAxis, slope);
//         if (z === counter2) {
//           y = start.y + z;
//           x = i;
//           drawn.push({ x, y, color: state.color });
//           counter++;
//         }
//       }
//     }

//     dispatch({ picture: state.picture.draw(drawn) });
//   }
//   drawLine(start);
//   return drawLine;
// }

function line(start, state, dispatch) {
  function drawLine(pos) {
    let xStart = Math.min(start.x, pos.x);
    let yStart = Math.min(start.y, pos.y);
    let xEnd = Math.max(start.x, pos.x);
    let yEnd = Math.max(start.y, pos.y);

    // Difference
    let xDif = Math.abs(xEnd - xStart);
    let yDif = Math.abs(yEnd - yStart);
    let begin = xDif > yDif ? xStart : yStart;
    let extra = xDif > yDif ? Math.abs(yEnd - yStart) : Math.abs(xEnd - xStart);

    let end = xDif > yDif ? xEnd : yEnd;

    let slope = xDif > yDif ? yDif / xDif : xDif / yDif;

    let drawn = [];

    let i;
    let z;
    let x;

    let counter = 0;
    let counter2 = 1;
    let slopeTimesAxis = Math.round(slope * end);
    let divide = Math.round(end / slopeTimesAxis);

    for (i = begin; i < end; i++) {
      if (counter === divide) {
        counter = 0;
        counter2++;
      }
      for (z = 0; z < slopeTimesAxis; z++) {
        console.log(slopeTimesAxis, slope);
        if (z === counter2) {
          y = start.y + z;
          x = i;
          drawn.push({ x, y, color: state.color });
          counter++;
        }
      }
    }

    dispatch({ picture: state.picture.draw(drawn) });
  }
  drawLine(start);
  return drawLine;
}

// function line(start, state, dispatch) {
//   console.log("line");
//   function drawLine(pos) {
//     let xStart = Math.min(start.x, pos.x);
//     let yStart = Math.min(start.y, pos.y);
//     let xEnd = Math.max(start.x, pos.x);
//     let yEnd = Math.max(start.y, pos.y);

//     // Difference
//     let xDif = Math.abs(xEnd - xStart);
//     let yDif = Math.abs(yEnd - yStart);
//     let begin = xDif > yDif ? xStart : yStart;
//     let extra = xDif > yDif ? Math.abs(yEnd - yStart) : Math.abs(xEnd - xStart);

//     let end = xDif > yDif ? xEnd : yEnd;

//     let slope = xDif > yDif ? yDif / xDif : xDif / yDif;

//     let drawn = [];

//     let i;
//     let z;
//     let x;

//     let num = Math.round(end / 3);

//     let counter = 0;
//     let counter2 = 0;
//     let test = 20 / 5;

//     for (i = begin; i < 20 + begin; i++) {
//       if (counter === test) {
//         counter = 0;
//         counter2++;
//       }
//       for (z = 0; z < 5; z++) {
//         if (z === counter2) {
//           y = start.y + z;
//           x = i;
//           console.log(999, extra);
//           drawn.push({ x, y, color: state.color });
//           counter++;
//         }
//       }
//     }

//     dispatch({ picture: state.picture.draw(drawn) });
//   }
//   drawLine(start);
//   return drawLine;
// }

function rectangle(start, state, dispatch) {
  function drawRectangle(pos) {
    let xStart = Math.min(start.x, pos.x);
    let yStart = Math.min(start.y, pos.y);
    let xEnd = Math.max(start.x, pos.x);
    let yEnd = Math.max(start.y, pos.y);
    let drawn = [];
    for (let y = yStart; y <= yEnd; y++) {
      for (let x = xStart; x <= xEnd; x++) {
        drawn.push({ x, y, color: state.color });
      }
    }
    dispatch({ picture: state.picture.draw(drawn) });
  }
  drawRectangle(start);
  return drawRectangle;
}

function calculateDistance(startX, startY, currentX, currentY) {
  // Calculate the differences in the coordinates
  const dx = currentX - startX;
  const dy = currentY - startY;

  // Calculate the distance using the Pythagorean theorem
  const distance = Math.sqrt(dx ** 2 + dy ** 2);

  return distance;
}

function makeOdd(number) {
  if (number === 0) return 0;
  if (number % 2 === 0) {
    // If the number is even, add 1 to make it odd
    return number + 1;
  }
  return number; // If the number is already odd, return it unchanged
}

// function circle(start, state, dispatch) {
//   // Your code here
//   function drawCircle(pos) {
//     // console.log(pos, state);
//     let xStart = Math.min(start.x, pos.x);
//     let yStart = Math.min(start.y, pos.y);
//     let xEnd = Math.max(start.x, pos.x);
//     let yEnd = Math.max(start.y, pos.y);
//     let drawn = [];
//     let distance = makeOdd(
//       Math.round(calculateDistance(xStart, yStart, xEnd, yEnd))
//     );

//     let x = 0;
//     let y = 0;

//     for (let y1 = start.y; y1 < distance * 2 + start.y + 1; y1++) {
//       for (let x1 = start.x; x1 < distance * 2 + start.x + 1; x1++) {
//         let test = distance * 2;
//         let centre = Math.ceil((test - 1) / 2);

//         x = x1 - centre;
//         y = y1 - centre;

//         console.log(calculateDistance(start.x, start.y, x, y), distance);
//         if (calculateDistance(start.x, start.y, x, y) <= distance) {
//           drawn.push({ x, y, color: state.color });
//         }
//       }
//     }
//     console.log(drawn);
//     dispatch({ picture: state.picture.draw(drawn) });
//   }
//   drawCircle(start);
//   return drawCircle;
// }

function circle(start, state, dispatch) {
  // Your code here
  function drawCircle(pos) {
    // console.log(pos, state);

    let drawn = [];
    let radius = Math.sqrt((pos.x - start.x) ** 2 + (pos.y - start.y) ** 2);
    let radiusC = Math.ceil(radius);

    for (let y1 = -radiusC; y1 <= radiusC; y1++) {
      for (let x1 = -radiusC; x1 <= radiusC; x1++) {
        const dist = Math.sqrt(x1 ** 2 + y1 ** 2);
        if (dist > radius) continue;
        let y = start.y + y1,
          x = start.x + x1;
        if (
          y < 0 ||
          y >= state.picture.height ||
          x < 0 ||
          x >= state.picture.width
        )
          continue;
        drawn.push({ x, y, color: state.color });
      }
    }

    console.log(drawn);
    dispatch({ picture: state.picture.draw(drawn) });
  }
  drawCircle(start);
  return drawCircle;
}

var around = [
  { dx: -1, dy: 0 },
  { dx: 1, dy: 0 },
  { dx: 0, dy: -1 },
  { dx: 0, dy: 1 },
];

function fill({ x, y }, state, dispatch) {
  let targetColor = state.picture.pixel(x, y);
  let drawn = [{ x, y, color: state.color }];
  let visited = new Set();
  for (let done = 0; done < drawn.length; done++) {
    for (let { dx, dy } of around) {
      let x = drawn[done].x + dx,
        y = drawn[done].y + dy;
      if (
        x >= 0 &&
        x < state.picture.width &&
        y >= 0 &&
        y < state.picture.height &&
        !visited.has(x + "," + y) &&
        state.picture.pixel(x, y) == targetColor
      ) {
        drawn.push({ x, y, color: state.color });
        visited.add(x + "," + y);
      }
    }
  }
  dispatch({ picture: state.picture.draw(drawn) });
}

function pick(pos, state, dispatch) {
  dispatch({ color: state.picture.pixel(pos.x, pos.y) });
}

var SaveButton = class SaveButton {
  constructor(state) {
    this.picture = state.picture;
    this.dom = elt(
      "button",
      {
        onclick: () => this.save(),
      },
      "💾 Save"
    );
  }
  save() {
    let canvas = elt("canvas");
    drawPicture(this.picture, canvas, 1);
    let link = elt("a", {
      href: canvas.toDataURL(),
      download: "pixelart.png",
    });
    document.body.appendChild(link);
    link.click();
    link.remove();
  }
  syncState(state) {
    this.picture = state.picture;
  }
};

var LoadButton = class LoadButton {
  constructor(_, { dispatch }) {
    this.dom = elt(
      "button",
      {
        onclick: () => startLoad(dispatch),
      },
      "📁 Load"
    );
  }
  syncState() {}
};

function startLoad(dispatch) {
  let input = elt("input", {
    type: "file",
    onchange: () => finishLoad(input.files[0], dispatch),
  });
  document.body.appendChild(input);
  input.click();
  input.remove();
}

function finishLoad(file, dispatch) {
  if (file == null) return;
  let reader = new FileReader();
  reader.addEventListener("load", () => {
    let image = elt("img", {
      onload: () =>
        dispatch({
          picture: pictureFromImage(image),
        }),
      src: reader.result,
    });
  });
  reader.readAsDataURL(file);
}

function pictureFromImage(image) {
  let width = Math.min(100, image.width);
  let height = Math.min(100, image.height);
  let canvas = elt("canvas", { width, height });
  let cx = canvas.getContext("2d");
  cx.drawImage(image, 0, 0);
  let pixels = [];
  let { data } = cx.getImageData(0, 0, width, height);

  function hex(n) {
    return n.toString(16).padStart(2, "0");
  }
  for (let i = 0; i < data.length; i += 4) {
    let [r, g, b] = data.slice(i, i + 3);
    pixels.push("#" + hex(r) + hex(g) + hex(b));
  }
  return new Picture(width, height, pixels);
}

function historyUpdateState(state, action) {
  if (action.undo == true) {
    if (state.done.length == 0) return state;
    return {
      ...state,
      picture: state.done[0],
      done: state.done.slice(1),
      doneAt: 0,
    };
  } else if (action.picture && state.doneAt < Date.now() - 1000) {
    return {
      ...state,
      ...action,
      done: [state.picture, ...state.done],
      doneAt: Date.now(),
    };
  } else {
    return { ...state, ...action };
  }
}

var UndoButton = class UndoButton {
  constructor(state, { dispatch }) {
    this.dom = elt(
      "button",
      {
        onclick: () => dispatch({ undo: true }),
        disabled: state.done.length == 0,
      },
      "⮪ Undo"
    );
  }
  syncState(state) {
    this.dom.disabled = state.done.length == 0;
  }
};

var startState = {
  tool: "draw",
  color: "#000000",
  picture: Picture.empty(60, 30, "#f0f0f0"),
  done: [],
  doneAt: 0,
};

var baseTools = { draw, fill, rectangle, pick, circle, line };

var baseControls = [
  ToolSelect,
  ColorSelect,
  SaveButton,
  LoadButton,
  UndoButton,
];

function startPixelEditor({
  state = startState,
  tools = baseTools,
  controls = baseControls,
}) {
  let app = new PixelEditor(state, {
    tools,
    controls,
    dispatch(action) {
      state = historyUpdateState(state, action);
      app.syncState(state);
    },
  });
  return app.dom;
}

let dom = startPixelEditor({
  tools: { ...baseTools, circle, line },
});

// -------- EXERCISE ----------

// ------ KEYBOARD BINDINGS ------
