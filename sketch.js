let logicGates = [];
let wires = [];
let customGates = [];
let selectedGate = null;
let selectedPin = null;
let deployableGate = null;

function saveState() {
  localStorage.setItem("logicGates", JSON.stringify(logicGates, null, 2));
  localStorage.setItem("wires", JSON.stringify(wires, null, 3));
  console.log(logicGates);
  console.log(wires);
}
function clearSave() {
  localStorage.removeItem("logicGates");
  localStorage.removeItem("wires");
}
function clearSim() {
  clearSave();
  logicGates = [];
  wires = [];
}
window.addEventListener("beforeunload", saveState);
function load() {
  const loadedGates = JSON.parse(localStorage.getItem("logicGates")) || [];
  const loadedWires = JSON.parse(localStorage.getItem("wires")) || [];
  if (loadedGates && loadedGates.length > 0) {
    loadedGates.forEach((gate) => {
      const newGate = hydrate(gate);
      if (!newGate) return;
      logicGates.push(newGate);
    });
  }
  if (loadedWires && loadedWires.length > 0) {
    loadedWires.forEach((wire) => {
      const p1 = getPin(wire.p1.id);
      const p2 = getPin(wire.p2.id);
      if (!p1 || !p2) return;
      wires.push(new Wire(p1, p2));
    });
  }
  logicGates.forEach((gate) => gate.update());
}

function setup() {
  const menu = document.getElementById("menu");
  const canvas = createCanvas(
    windowWidth - menu.getBoundingClientRect().width,
    windowHeight
  );
  canvas.mouseClicked(canvasClicked);
  canvas.mouseMoved(canvasDragged);
  load();
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
function canvasClicked() {
  const component = getCollidingComponent(mouseX, mouseY);
  if (deployableGate) {
    deployableGate.setX(mouseX - deployableGate.w / 2);
    deployableGate.setY(mouseY - deployableGate.h / 2);
    logicGates.push(deployableGate);
    deployableGate = null;
    saveState();
  } else if (selectedPin && component instanceof Pin) {
    if (selectedPin === component) return;
    if (selectedPin.parentId === component.parentId) return;
    if (selectedPin.type === component.type) return;
    wires.push(new Wire(selectedPin, component));
    saveState();
    selectedPin = null;
  } else if (component instanceof Pin) {
    selectedPin = component;
  }

  if (component instanceof InputSwitch) {
    component.toggle();
  }
  if (component instanceof LogicGate) {
    selectedGate = component;
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

function keyPressed() {
  if (key === "s") {
    saveState();
  }
  if (!selectedGate) return;
  if (key === "d") {
    if (selectedPin) {
      deleteWire(selectedPin);
      selectedPin = null;
      wireMode = false;
    } else {
      deleteGate(selectedGate);
    }
  }
}

function addGate(name) {
  deployableGate = getGate(name);
  if (!deployableGate) return;
  document.getElementById("selectedGate").innerHTML = name;
  document.getElementById(
    "selectedGate"
  ).style = `background-color:${deployableGate.color};`;
}
function getGate(name) {
  switch (name) {
    case "AND":
      return new AND(0, 0);
    case "NOT":
      return new NOT(0, 0);
    case "I":
      return new InputSwitch(0, 0);
    case "O":
      return new OutputSwitch(0, 0);
  }
  return null;
}

function deleteGate(gate) {
  logicGates = logicGates.filter((g) => g !== gate);
  gate.getPins().forEach((pin) => deleteWire(pin));
  saveState();
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
function wrapToGate() {
  const name = prompt("Enter gate name:");
  let inputCount = 0;
  let outputCount = 0;
  for (const gate of logicGates) {
    if (gate instanceof InputSwitch) inputCount++;
    if (gate instanceof OutputSwitch) outputCount++;
  }
  const gate = new LogicGate(0, 0, name, inputCount, outputCount);
  gate.circuit = {
    gates: logicGates,
    wires: wires,
  };
  console.log(gate);
  gate.calculate = () => {
    let i = 0;
    for (const g of gate.circuit.gates) {
      if (g instanceof InputSwitch) {
        g.output_pins[0].setState(gate.input_pins[i].state);
        i++;
      }
    }
    gate.circuit.wires.forEach((w) => w.calculate());
    gate.circuit.gates.forEach((g) => g.calculate());
    i = 0;
    for (const g of gate.circuit.gates) {
      if (g instanceof OutputSwitch) {
        gate.output_pins[i].setState(g.getState());
        i++;
      }
    }
  };
  console.log(gate);
  logicGates = [];
  wires = [];
  logicGates.push(gate);
}
