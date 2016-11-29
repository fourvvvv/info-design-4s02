// This file contains all functions related to event controlers.

// built-in mousePressed event controler
function mousePressed() {
  clickBox(leftBox2);
  clickBox(leftBox3);
  clickBox(rightBox1);
  clickBox(rightBox2);
}

// clickable box: click -> change height (display details)
function clickBox(box) {
  if (isInsideBox(box)) {
    if (box.open) {
      box.height /= box.expand;
      box.open = 0;
    } else {
      box.height *= box.expand;
      box.open = 1;
    }
  }
}


// return true id mouse is inside the box
function isInsideBox(box) {
  return mouseX >= box.left
      && mouseX <= box.right
      && mouseY >= box.top
      && mouseY <= box.bottom;
}