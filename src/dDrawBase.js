class pObject {
  constructor(x, y, color = "#000000") {
    this.id = Math.random().toString().slice(2);
    this.x = x;
    this.y = y;
    this.color = color;
  }
  setupDraw(color = this.color) {
    stroke(color);
    fill(color);
  }
}

class pRect extends pObject {
  constructor(x, y, w, h, color, name) {
    super(x, y, color);
    this.w = w;
    this.h = h;
    this.name = name;
  }
  show() {
    this.setupDraw(this.drawColor);
    rect(this.x, this.y, this.w, this.h, 10);
    fill("black");
    textSize(18);
    text(
      this.name,
      this.x + this.w / 2 - textWidth(this.name) / 2,
      this.y + this.h / 2 + 5
    );
  }
  right() {
    return this.x + this.w;
  }
  left() {
    return this.x;
  }
  top() {
    return this.y;
  }
  bottom() {
    return this.y + this.h;
  }
}

class pCircle extends pObject {
  constructor(x, y, r, color) {
    super(x, y, color);
    this.r = r;
  }
  show() {
    this.setupDraw(this.drawColor);
    circle(this.x, this.y, this.r * 2);
  }
  right() {
    return this.x + this.r;
  }
  left() {
    return this.x - this.r;
  }
  top() {
    return this.y - this.r;
  }
  bottom() {
    return this.y + this.r;
  }
}

const collision_engine = {
  checkCollision(o1, o2) {
    if (o1 instanceof pCircle) {
      if (o2 instanceof pCircle) {
        return collision_engine.circle_circle(o1, o2);
      } else if (o2 instanceof pRect) {
        return collision_engine.rect_circle(o2, o1);
      }
    } else if (o1 instanceof pRect) {
      if (o2 instanceof pCircle) {
        return collision_engine.rect_circle(o1, o2);
      } else if (o2 instanceof pRect) {
        return collision_engine.rect_rect(o1, o2);
      }
    }
  },
  rect_rect(pRect1, pRect2) {
    if (
      pRect2.right() < pRect1.left() ||
      pRect1.right() < pRect2.left() ||
      pRect2.bottom() < pRect1.top() ||
      pRect1.bottom() < pRect2.top()
    ) {
      return false;
    }
    return true;
  },
  circle_circle(pCircle1, pCircle2) {
    let distance = dist(pCircle1.x, pCircle1.y, pCircle2.x, pCircle2.y);
    if (distance < pCircle1.r + pCircle2.r) {
      return true;
    }
    return false;
  },
  rect_circle(pRect, pCircle) {
    let closest_point = createVector(
      constrain(pCircle.x, pRect.left(), pRect.right()),
      constrain(pCircle.y, pRect.top(), pRect.bottom())
    );
    if (
      dist(pCircle.x, pCircle.y, closest_point.x, closest_point.y) > pCircle.r
    ) {
      return false;
    }
    return true;
  },
};
