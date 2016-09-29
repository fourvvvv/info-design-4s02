function setup() {
  createCanvas(400, 400);
  textAlign(CENTER, CENTER);
  rectMode(CENTER);
}

function draw() {
  var h = hour();
  var m = minute();
  var s = second();
  var myString = nf(h,2) + ":" + nf(m,2) + ":" + nf(s,2);
  var thetaS = map(s, 0, 60, 0, TAU);
  
  background(255);

  strokeWeight(0.5);

  push();
  translate(width/2, height/2);
  bgPolygon(0, 0, 100, 12); 
  strokeWeight(4);
  minutePolygon(0, 0, 100, 12); 
  pop();

  fill(255);
  arc(width/2, height/2, 202, 202, -PI/2,thetaS-PI/2); 
  
  push();
  translate(width/2, height/2);
  polygon(0, 0, 100, 12);
  pop();
  
  clockNumbers(width/2, height/2, 180, 12)
}

function polygon(x, y, radius, npoints) {
  var px1,py1,px2,py2;
  var h = 0;
  var angle = TWO_PI / npoints;
  beginShape();
  fill(255);
  for (var a = 0; a < TWO_PI; a += angle) {
    h += 1;
    var sx = x + cos(a) * radius;
    var sy = y + sin(a) * radius;
    vertex(sx, sy);
    if (h == twelveHour(hour())) {
      px1 = sx;
      py1 = sy;
    } else if(h - 1 == twelveHour(hour())) {
      px2 = sx;
      py2 = sy;
    } 
  }
  fill(255);
  endShape(CLOSE);

}

// Minute arc
function minutePolygon(x, y, radius, npoints) {
  var angle = TWO_PI / npoints;
  noFill();
  var h = 0;
  for (var a = PI/2; a < TWO_PI+PI/2; a += angle) {
    //a = 0;
    var sx = x + cos(a) * radius;
    var sy = y + sin(a) * radius;
    stroke('rgba(255,255,255,'+second()/240+')');
    beginShape();
    var m = 0;
    for (var i = a; i < a+PI/2; i+= PI/120) {
      m += 1
      if (h == twelveHour(hour()) && 60-m <= minute()) {
        stroke(
          hour()*255/24*0.5+120
          ,minute()*25/60*0.5+120
          ,second()*255/60*0.5+12
        );
        fill(51);
      }
      arc(sx, sy, radius*4, radius*4, i+PI/2, i+PI/2+PI/120, OPEN);
    }
    endShape(CLOSE);
    h += 1;
  }
}

// background circles
function bgPolygon(x, y, radius, npoints) {
  var angle = TWO_PI / npoints;
  noFill();
  for (var a = 0; a < TWO_PI; a += angle) {
    var sx = x + cos(a) * radius;
    var sy = y + sin(a) * radius;

    stroke(
      hour()*255/24*0.5+120
      ,minute()*25/60*0.5+120
      ,second()*255/60*0.5+12);

    beginShape();
    for (var i = a; i < a+PI/2; i+= PI/120) {
      arc(sx, sy, radius*4, radius*4, i+PI/2, i+PI/2+PI/120, PIE);
    }
    endShape(CLOSE);

  }
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
      textSize(15);
      fill(
      hour()*255/24*0.5+120
      ,minute()*25/60*0.5+120
      ,second()*255/60*0.5+12);
    } else {
      fill('rgba(0,0,0,0.3)');
      textSize(10);
    }
    text(nf(i, 2), cx, cy);
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