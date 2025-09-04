const logicGates = [];
const wires = [];
let selectedInput = null;
let selectedGate = null;
let isWireOn = false;
let defaultGates = [
  new LogicGate("NOT", [0], [1]),
  new LogicGate("AND", [0, 1], [2]),
];

//Storing state in local storage and retrieving it
window.addEventListener("beforeunload", () => {
  localStorage.setItem("logicGates", JSON.stringify(logicGates, null, 2));
  localStorage.setItem("wires", JSON.stringify(wires, null, 3));
  console.log("saved");
});
window.addEventListener("load", () => {
  console.log("loaded");
  const loadedGates = JSON.parse(localStorage.getItem("logicGates")) || [];
  const loadedWires = JSON.parse(localStorage.getItem("wires")) || [];
  if (loadedGates && loadedGates.length > 0) {
    loadedGates.forEach((gate) => {
      logicGates.push(createLogicGate(gate));
    });
  } else logicGates.push(...defaultGates);

  if (loadedWires && loadedWires.length > 0) {
    loadedWires.forEach((wire) => {
      wires.push(createWire(wire));
    });
  }
  console.log(wires);
});

function setup() {
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
  logicGates.forEach((gate) => {
    gate.show();
  });
  for (const element of wires) {
    element.show();
  }
}
function canvasClicked() {
  if (isWireOn) {
    if (!selectedInput) {
      selectedInput = detectCollisionWithPins();
      console.log(selectedInput);

      showSelectedPin();
    } else {
      let secondInput = detectCollisionWithPins();
      if (secondInput && secondInput.gate == selectedInput.gate) return;

      if (secondInput) {
        wires.push(
          new Wire(
            selectedInput.gate,
            secondInput.gate,
            selectedInput.index,
            secondInput.index,
            selectedInput.input,
            secondInput.input
          )
        );
      }
      selectedInput = secondInput;
      showSelectedPin();
      selectedInput = null;
    }
    return;
  }
  if (selectedGate) selectedGate = null;
  else selectedGate = detectCollisionWithGates();
  showSelectedGate();
}

function detectCollisionWithGates() {
  let x = mouseX;
  let y = mouseY;
  for (let i = 0; i < logicGates.length; i++) {
    if (
      x > logicGates[i].mesh.x &&
      x < logicGates[i].mesh.x + logicGates[i].mesh.w &&
      y > logicGates[i].mesh.y &&
      y < logicGates[i].mesh.y + logicGates[i].mesh.h
    ) {
      return logicGates[i];
    }
  }
}
function detectCollisionWithPins() {
  let click = createVector(mouseX, mouseY);
  for (let i = 0; i < logicGates.length; i++) {
    let gate = logicGates[i];
    let inputPinPositions = gate.getInputPositions();

    for (let j = 0; j < inputPinPositions.length; j++) {
      let center = createVector(gate.mesh.x, inputPinPositions[j]);
      if (INPUT_SIZE > click.dist(center)) {
        return { gate: gate, index: j, input: true };
      }
    }
    let outputPinPositions = gate.getOutputPositions();
    for (let j = 0; j < outputPinPositions.length; j++) {
      let center = createVector(
        gate.mesh.x + gate.mesh.w,
        outputPinPositions[j]
      );
      if (OUTPUT_SIZE > click.dist(center)) {
        return { gate: gate, index: j, input: false };
      }
    }
  }
  return null;
}
function canvasDragged() {
  if (selectedGate) {
    selectedGate.mesh.x = mouseX - selectedGate.mesh.w / 2;
    selectedGate.mesh.y = mouseY - selectedGate.mesh.h / 2;
  }
  if (isWireOn) {
  }
}
function showSelectedGate() {
  if (selectedGate) {
    document.getElementById("selectedGate").innerText = selectedGate.name;
  }
}
function showSelectedPin() {
  if (selectedInput) {
    document.getElementById("selectedPin").innerText = pinToName(selectedInput);
  }
}
function pinToName(pin) {
  return pin.gate.name + " " + (pin.input ? "IN" : "OUT") + pin.index;
}

function setWire() {
  const button = select("#wireButton");
  if (isWireOn) {
    isWireOn = false;
    button.removeClass("on");
  } else {
    isWireOn = true;
    selectedGate = null;
    button.addClass("on");
  }
}
function createLogicGate(gate) {
  return new LogicGate(
    gate.name,
    gate.inputs,
    gate.outputs,
    new Mesh(gate.mesh.x, gate.mesh.y, gate.mesh.w, gate.mesh.h, gate.mesh.name)
  );
}
function getLogicGate(gate) {
  for (let i = 0; i < logicGates.length; i++) {
    let e = logicGates[i];
    if (
      e.name == gate.name &&
      e.mesh.x == gate.mesh.x &&
      e.mesh.y == gate.mesh.y
    )
      return e;
  }
}
function createWire(wire) {
  return new Wire(
    getLogicGate(wire.g1),
    getLogicGate(wire.g2),
    wire.g1Index,
    wire.g2Index,
    wire.g1Input,
    wire.g2Input
  );
}
