// This file contains all functions related to event controlers.

// built-in mouseMoved event controler
function mouseMoved() {
    timeMouseOver = mouseInSlider();
}

// built-in mouseDragged event controler
function mouseDragged() {
  if (mouseInSlider() !== -1 && mouseInSlider() !== time) {
    timeMouseOver = mouseInSlider();
    time = timeMouseOver;
    changing = 1;
  }
}

// built-in mousePressed event controler
function mousePressed() {
  boxList.forEach(function(box) {
    clickBox(box);
  });
  if (mouseInSlider() !== -1 && mouseInSlider() !== time) {
    time = mouseInSlider();
    changing = 1;
  }
  if (isInsideBox(sliderSize.play)) {
    animating = !animating;
  }
}

// auto move time cursor
function moveTimeCursor() {
  if (animating) {
    if (frameCount%speed == 0) {
      if (time < TimeBarXs.length - 1) {
        time++;
      } else {
        animating = false;
      }
    }
  }
}

// if mouse is in slider, return cureent cursor
// otherwise, return -1
function mouseInSlider() {
  if (isInsideBox(sliderSize)) {
    for (var i = 0; i < TimeBarXs.length; i++) {
      if (i == 0) {
        if ( mouseX < (TimeBarXs[0] + TimeBarXs[1])/2 ) {
          return 0
        }
      } else if (i == TimeBarXs.length - 1) {
        if ( mouseX >= (TimeBarXs[TimeBarXs.length - 2] + TimeBarXs[TimeBarXs.length - 1])/2 ) {
          return (TimeBarXs.length - 1);
        }
      }
      else {
        if ( mouseX >= (TimeBarXs[i-1] + TimeBarXs[i])/2
          && mouseX < (TimeBarXs[i] + TimeBarXs[i+1])/2
          ) {
            return i;
          }
      }
    }
  } else {
    return -1;
  }

}

function sliderChanged() {
  moveToBattlefield();
  updateMatrix();
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

// return true if mouse is inside the box
function isInsideBox(box) {
  return mouseX >= box.left
      && mouseX <= box.right
      && mouseY >= box.top
      && mouseY <= box.bottom;
}
