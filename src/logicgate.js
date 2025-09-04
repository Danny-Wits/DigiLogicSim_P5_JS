const COLOR = { inactive: "red", active: "lime" };
const INPUT_SIZE = 15;
const OUTPUT_SIZE = 15;
class LogicGate {
  constructor(name, inputs, outputs, mesh = null) {
    this.name = name;
    this.inputs = inputs;
    this.outputs = outputs;
    if (mesh) {
      this.mesh = mesh;
    } else {
      this.createMesh();
    }
  }

  createMesh() {
    let larger = Math.max(this.inputs.length, this.outputs.length);
    this.mesh = new Mesh(0, 0, 100, Math.max(50, larger * 25), this.name);
  }
  show() {
    this.calculate();
    this.mesh.show(this.inputs, this.outputs);
  }
  getInputPositions() {
    return this.mesh.getPositionsFromArray(this.inputs);
  }
  getOutputPositions() {
    return this.mesh.getPositionsFromArray(this.outputs);
  }
  calculate() {}
}

class Mesh {
  constructor(x, y, w = 50, h = 50, name) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.name = name;
  }

  show(inputs, outputs) {
    fill(255);
    rect(this.x, this.y, this.w, this.h, 6);
    fill(0);
    textSize(18);
    text(
      this.name,
      this.x + this.w / 2 - textWidth(this.name) / 2,
      this.y + this.h / 2 + 5
    );
    stroke(255);
    const input_positions = this.getPositionsFromArray(inputs);
    for (let i = 0; i < inputs.length; i++) {
      fill(inputs[i] == 0 ? COLOR["inactive"] : COLOR["active"]);
      circle(this.x, input_positions[i], INPUT_SIZE);
    }

    const output_positions = this.getPositionsFromArray(outputs);
    for (let i = 0; i < outputs.length; i++) {
      fill(outputs[i] == 0 ? COLOR["inactive"] : COLOR["active"]);
      circle(this.x + this.w, output_positions[i], OUTPUT_SIZE);
    }
  }
  getPositionsFromArray(arr) {
    const positions = [];
    const increment = this.h / (arr.length + 1);
    for (let i = 0; i < arr.length; i++) {
      positions.push(this.y + increment * (i + 1));
    }
    return positions;
  }
}
class Wire {
  constructor(g1, g2, g1Index, g2Index, g1Input, g2Input) {
    this.g1 = g1;
    this.g2 = g2;
    this.g1Index = g1Index;
    this.g2Index = g2Index;
    this.g1Input = g1Input;
    this.g2Input = g2Input;
  }
  show() {
    strokeWeight(8);
    stroke("red");
    line(
      this.g1.mesh.x + (this.g1Input ? 0 : this.g1.mesh.w),
      this.g1Input
        ? this.g1.getInputPositions()[this.g1Index]
        : this.g1.getOutputPositions()[this.g1Index],
      this.g2.mesh.x + (this.g2Input ? 0 : this.g2.mesh.w),
      this.g2Input
        ? this.g2.getInputPositions()[this.g2Index]
        : this.g2.getOutputPositions()[this.g2Index]
    );
    strokeWeight(2);
    stroke("white");
  }
}
