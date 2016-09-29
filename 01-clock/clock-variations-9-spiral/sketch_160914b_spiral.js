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
  noFill();
  strokeWeight(1);
  spirals(width/2, height/2, 300, s, 60);
  spiralm(width/2, height/2, 180, m, 60);
  strokeWeight(4);
  spiralh(width/2, height/2, 300, h, 24);
}

// seconds
function spirals(x,y,d,t,unit) {
  for (var i = 1; i <= t; i++) {
      cx = x + d/2 * sin(TAU / unit * i);
      cy = y - d/2 * cos(TAU / unit * i);
    ellipse(cx,cy,i*2,i*2);
  }
}

// minutes
function spiralm(x,y,d,t,unit) {
  for (var i = 1; i <= t; i++) {
    cx = x - d/2 * sin(TAU / unit * i);
    cy = y - d/2 * cos(TAU / unit * i);
    stroke('rgba(0,0,0,'+i/t+')');
    ellipse(cx,cy,i*2,i*2);
  }
}

// hours
function spiralh(x,y,d,t,unit) {
  fill(51);
  ellipse(x,y,10,10);
  var cx = x + d/2 * sin(TAU / unit * t);
  var cy = y - d/2 * cos(TAU / unit * t);
  line(x,y,cx,cy);
}
