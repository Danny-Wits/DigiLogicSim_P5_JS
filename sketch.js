function setup() {
  const menu = document.getElementById("menu");
  const canvas = createCanvas(
    windowWidth - menu.getBoundingClientRect().width,
    windowHeight
  );
  canvas.mouseClicked(canvasClicked);
}
function windowResized() {
  const menu = document.getElementById("menu");
  resizeCanvas(windowWidth - menu.getBoundingClientRect().width, windowHeight);
}

function draw() {
  background(255);
}
function canvasClicked() {
  
}
