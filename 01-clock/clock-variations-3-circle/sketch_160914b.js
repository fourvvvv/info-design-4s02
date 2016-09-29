function setup() {
  createCanvas(400, 400);
  textAlign(CENTER, CENTER);
  rectMode(CENTER);
}

function draw() {
  background(255);
  var h = hour();
  var m = minute();
  var s = second();
  var myString = nf(h,2) + ":" + nf(m,2) + ":" + nf(s,2);
  
  clockNumbers(width/2, height/2, 150, 12);
  clock60(width/2, height/2, 200, minute(),10);
  clock60(width/2, height/2, 220, second(),5);
}

// numbers on clock
function clockNumbers(x,y,d,unit) {
  var startAngle = radians(90);
  var stopAngle = radians(450);
  var num, cx, cy;
  noStroke();
  for (var i = 1; i <= unit; i++) {
      cx = x + d/2 * sin(TAU / unit * i);
      cy = y - d/2 * cos(TAU / unit * i);
    
    if (i == twelveHour(hour())) {
      textSize(25);
      fill(51);
    } else {
      fill('rgba(0,0,0,0.3)');
      textSize(20);
    }
    text(nf(i, 2), cx, cy);
  }
}

// minutes and seconds
function clock60(x,y,d,time,size) {
  var unit = 60;
  var startAngle = radians(90);
  var stopAngle = radians(450);
  var num, cx, cy;
  noStroke();
  for (var i = 0; i < time; i++) {
      cx = x + d/2 * sin(TAU / unit * i);
      cy = y - d/2 * cos(TAU / unit * i);
    if (i+1 == time) {
      textSize(25);
      fill(200);
    } else {
      fill(20);
      textSize(20);
    }
    ellipse(cx, cy,size,size);
  }
}

// return hours that read 1 through 12 rather than 0 through 23
function twelveHour() {
  var h = hour() % 12;
  if (h === 0) {
    h = 12;
  }
  return h;
}