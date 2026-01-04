const PIN_SIZE = 6;
const GAP = 20;
const UNCONNECTED = "rgba(131, 131, 131, 1)";
const CONNECTED = "rgba(209, 230, 255, 1)";
const CONNECTED_ACTIVE = "rgba(255, 103, 103, 1)";
const INPUT = "input";
const OUTPUT = "output";

class Pin extends pCircle {
  constructor(parentId, x, y, r, color, type = "input") {
    super(x, y, r, color);
    this.parentId = parentId;
    this.state = null;
    this.type = type;
  }
  setState(state) {
    this.state = state;
    this.drawColor = state ? CONNECTED_ACTIVE : CONNECTED;
  }
}

class LogicGate extends pRect {
  constructor(x, y, name, inputs, outputs, color = "#277dfeff") {
    let larger = Math.max(inputs, outputs);
    let largerWidth = Math.max(textWidth(name), 50);
    super(
      x,
      y,
      largerWidth,
      larger * PIN_SIZE + (larger + 1) * GAP,
      color,
      name
    );
    this.name = name;
    this.input_count = inputs;
    this.outputs_count = outputs;
    this.create();
  }
  create() {
    this.input_pins = [];
    const offsetI = this.h / (this.input_count + 1);
    for (let i = 1; i <= this.input_count; i++) {
      this.input_pins.push(
        new Pin(
          this.id,
          this.x,
          this.y + i * offsetI,
          PIN_SIZE,
          UNCONNECTED,
          INPUT
        )
      );
    }
    this.output_pins = [];
    const offsetO = this.h / (this.outputs_count + 1);
    for (let i = 1; i <= this.outputs_count; i++) {
      this.output_pins.push(
        new Pin(
          this.id,
          this.x + this.w,
          this.y + i * offsetO,
          PIN_SIZE,
          UNCONNECTED,
          OUTPUT
        )
      );
    }
  }
  update() {
    const offsetI = this.h / (this.input_count + 1);
    for (const pin of this.input_pins) {
      pin.x = this.x;
      pin.y = this.y + (this.input_pins.indexOf(pin) + 1) * offsetI;
    }
    const offsetO = this.h / (this.outputs_count + 1);
    for (const pin of this.output_pins) {
      pin.x = this.x + this.w;
      pin.y = this.y + (this.output_pins.indexOf(pin) + 1) * offsetO;
    }
  }
  getComponents() {
    return [...this.input_pins, ...this.output_pins, this];
  }
  getPins() {
    return [...this.input_pins, ...this.output_pins];
  }
  show() {
    this.calculate();
    this.getPins().forEach((pin) => pin.show());
    super.show();
  }
  setX(x) {
    this.x = x;
    this.update();
  }
  setY(y) {
    this.y = y;
    this.update();
  }
  calculate() {}
}

class Wire {
  constructor(p1, p2) {
    this.p1 = p1.type === OUTPUT ? p1 : p2;
    this.p2 = p1.type === OUTPUT ? p2 : p1;
  }
  show() {
    this.calculate();
    strokeWeight(4);
    stroke(this.p1.state ? CONNECTED_ACTIVE : CONNECTED);
    line(this.p1.x, this.p1.y, this.p2.x, this.p2.y);
    strokeWeight(2);
    stroke("white");
  }
  calculate() {
    this.p2.setState(this.p1.state);
  }
}
function hydrate({ x, y, name, input_pins, output_pins }) {
  let gate = getGate(name);
  if (!gate) return null;
  gate.x = x;
  gate.y = y;
  gate.input_pins = hydratePins(input_pins);
  gate.output_pins = hydratePins(output_pins);
  return gate;
}
function hydratePins(pins) {
  return pins.map((pin) => hydratePin(pin));
}
function hydratePin(pin) {
  const newPin = new Pin(
    pin.parentId,
    pin.x,
    pin.y,
    PIN_SIZE,
    pin.state ? CONNECTED_ACTIVE : CONNECTED,
    pin.type
  );
  newPin.id = pin.id;
  return newPin;
}
function getPin(id, gates = logicGates) {
  for (const gate of gates) {
    for (const pin of gate.getPins()) {
      if (pin.id === id) return pin;
    }
  }
  return null;
}
