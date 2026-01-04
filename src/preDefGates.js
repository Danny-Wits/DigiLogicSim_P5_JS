class InputSwitch extends LogicGate {
  constructor(x, y) {
    super(x, y, "I", 0, 1, CONNECTED_ACTIVE);
    this.output_pins[0].setState(true);
  }
  toggle() {
    this.color = !this.output_pins[0].state ? CONNECTED_ACTIVE : CONNECTED;
    this.output_pins[0].setState(!this.output_pins[0].state);
  }
  getState() {
    return this.output_pins[0].state;
  }
}

class OutputSwitch extends LogicGate {
  constructor(x, y) {
    super(x, y, "O", 1, 0, "#ff6b6b");
  }
  show() {
    this.color = this.input_pins[0].state ? CONNECTED_ACTIVE : CONNECTED;
    super.show();
  }
  getState() {
    return this.input_pins[0].state;
  }
}
class NOT extends LogicGate {
  constructor(x, y) {
    super(x, y, "NOT", 1, 1, "#ff6b6b");
  }
  calculate() {
    this.output_pins[0].setState(!this.input_pins[0].state);
  }
}
class AND extends LogicGate {
  constructor(x, y) {
    super(x, y, "AND", 2, 1, "#277dfe");
  }
  calculate() {
    this.output_pins[0].setState(
      this.input_pins[0].state && this.input_pins[1].state
    );
  }
}
