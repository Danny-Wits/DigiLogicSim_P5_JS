let logicGates = [];
let wires = [];
let selectedGate = null;
let selectedPin = null;
let wireMode = false;
let defaultGates;

//Storing state in local storage and retrieving it
// window.addEventListener("beforeunload", () => {
//   localStorage.setItem("logicGates", JSON.stringify(logicGates, null, 2));
//   localStorage.setItem("wires", JSON.stringify(wires, null, 3));
//   console.log("saved");
// });
// window.addEventListener("load", () => {
//   console.log("loaded");
//   const loadedGates = JSON.parse(localStorage.getItem("logicGates")) || [];
//   const loadedWires = JSON.parse(localStorage.getItem("wires")) || [];
//   if (loadedGates && loadedGates.length > 0) {
//     loadedGates.forEach((gate) => {
//       logicGates.push(createLogicGate(gate));
//     });
//   } else logicGates.push(...defaultGates);

//   if (loadedWires && loadedWires.length > 0) {
//     loadedWires.forEach((wire) => {
//       wires.push(createWire(wire));
//     });
//   }
//   console.log(wires);
// });

function setup() {
  defaultGates = [
    new Not(50, 50),
    new Not(50, 50),
    new Not(50, 50),
    new AND(500, 500),
    new InputSwitch(100, 100),
    new InputSwitch(100, 100),
    new OutputSwitch(500, 500),
  ];
  logicGates.push(...defaultGates);
  const menu = document.getElementById("menu");
  const canvas = createCanvas(
    windowWidth - menu.getBoundingClientRect().width,
    windowHeight
  );
  canvas.mouseClicked(canvasClicked);
  canvas.mouseMoved(canvasDragged);
}
function windowResized() {
  const menu = document.getElementById("menu");
  resizeCanvas(windowWidth - menu.getBoundingClientRect().width, windowHeight);
}

function draw() {
  background(10);
  wires.forEach((wire) => {
    wire.show();
  });
  logicGates.forEach((gate) => {
    gate.show();
  });
}
function getCollidingComponent(mouseX, mouseY) {
  const x = mouseX;
  const y = mouseY;
  const mouse = new pCircle(x, y, 2, "#000000ff");
  for (const gate of logicGates) {
    for (const component of gate.getComponents()) {
      if (collision_engine.checkCollision(mouse, component)) {
        return component;
      }
    }
  }
}

function deleteWire(pin) {
  let didDelete = false;
  wires = wires.filter((wire) => {
    if (wire.p1 === pin || wire.p2 === pin) {
      wire.p2.setState(null);
      didDelete = true;
      return false;
    }
    return true;
  });
  return didDelete;
}
function canvasClicked() {
  const component = getCollidingComponent(mouseX, mouseY);
  if (selectedPin && wireMode && component instanceof Pin) {
    if (selectedPin === component) return;
    if (selectedPin.parent === component.parent) return;
    if (selectedPin.type === component.type) return;
    wires.push(new Wire(selectedPin, component));
    selectedPin = null;
    wireMode = false;
  } else if (component instanceof Pin) {
    if (deleteWire(component)) {
      selectedPin = null;
      wireMode = false;
    } else {
      selectedPin = component;
      wireMode = true;
    }
  } else {
    selectedPin = null;
    wireMode = false;
  }
  console.log(selectedPin, wireMode);

  if (component instanceof InputSwitch) {
    component.toggle();
  }
}

function canvasDragged() {
  if (mouseIsPressed) {
    const component = getCollidingComponent(mouseX, mouseY);
    if (component instanceof LogicGate) {
      selectedGate = component;
    }
    if (selectedGate) {
      selectedGate.setX(mouseX - selectedGate.w / 2);
      selectedGate.setY(mouseY - selectedGate.h / 2);
    }
  }
}
