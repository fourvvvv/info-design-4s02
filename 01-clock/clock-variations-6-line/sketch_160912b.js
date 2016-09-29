function setup() {
  createCanvas(400, 400);
}

function draw() {
  var h = hour();
  var m = minute();
  var s = second();
  var startAngle = radians(-90);
  var stopAngle = radians(270);

  var myString = nf(h,2) + ":" + nf(m,2) + ":" + nf(s,2);
  var thetaH = map(twelveHour(h), 0, 24, startAngle, stopAngle);
  var thetaM = map(m, 0, 60, startAngle, stopAngle);
  var thetaS = map(s, 0, 60, startAngle, stopAngle);
  
  background(51);
  stroke(255);
  strokeWeight(1);
  noFill();
  arc(width/2, height/2, 240, 240, startAngle, thetaH); 
  arc(width/2, height/2, 200, 200, startAngle, thetaM);
  arc(width/2, height/2, 160, 160, startAngle, thetaS);

  strokeWeight(1);
  line(width/2, height/2 - 80, width/2, height/2 - 120);
  strokeWeight(1);

  textAlign(CENTER, CENTER);
  textSize(30);
  fill(255);
  text(myString, width/2, height*0.9);
}

function twelveHour() {
  var h = hour() % 12;
  if (h === 0) {
    h = 12;
  }
  return h;
}