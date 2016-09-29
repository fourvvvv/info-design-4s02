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

  strokeWeight(0.5);
  stroke(51);

  // seconds
  push();
  translate(width/2, height/2);
  for (var i = 0; i < s; i++){
    if (s % 1 == 0) {
      rotate(-TAU/60);
      }
  }  
  gears(0, 0, 20, 160, 12);
  timeGear(260,290,60,s,'#FFEE3E');
  pop();

  // minutes
  push();
  translate(width/2, height/2);
  for (var i = 0; i < m; i++){
    if (m % 1 == 0) {
      rotate(-TAU/60);
      }
  }
  timeGear(210,230,60,m,'#FFCD03');
  pop();

  // hours
  push();
  translate(width/2, height/2);
  for (var i = 0; i < h; i++){
    if (m % 1 == 0) {
      rotate(-TAU/24);
      }
  }
  timeGear(175,190,24,h,'#E59D04');
  pop();

  fill(255);
  ellipse(width/2, height/2, 160, 160);

  // pointer
  fill(s*2+50);
  noStroke();
  triangle(width/2-10, height/2
        ,width/2+10, height/2
        ,width/2, height/2-80);
  ellipse(width/2, height/2, 20, 20);

}

function timeGear(r1,r2,unit,s,c) {
  var startAngle = radians(-90);
  var stopAngle = radians(450);

  for( var i = 0; i < unit; i++ ) {
    if (i == s) {
      fill(c);
    } else {
      fill(i*2+50);
    }
    arc(0, 0, r2, r2, startAngle+TAU/unit * i, startAngle+TAU/unit * (i+1));
  }

  var px = 0 + r1/2 * sin(TAU);
  var py = 0 - r1/2 * cos(TAU);
  for( var i = 0; i < unit; i++ ) {
    if (i == s) {
      fill(0);
    } else {
      fill(200);
    }
    var cx = 0 + r1/2 * sin(TAU / unit * (i+1));
    var cy = 0 - r1/2 * cos(TAU / unit * (i+1));
    textSize(8);
    text(nf(i,2), (cx+px)/2, (cy+py)/2);
    px = cx;
    py = cy;
  }
}

// outer gear
function gears(x, y, side, radius, npoints) {
  var angle = TAU / npoints;
  //noFill();
  for (var a = PI/2; a < TWO_PI+PI/2; a += angle) {
    var sx1 = x + cos(a) * radius;
    var sy1 = y + sin(a) * radius;
    var sx2 = x - cos(a) * radius;
    var sy2 = y - sin(a) * radius;
    
    fill(a/PI*90);

    quad(sx1-sin(a)*side, sy1+cos(a)*side
    , sx1+sin(a)*side, sy1-cos(a)*side
    , sx2+sin(a)*side, sy2-cos(a)*side
    , sx2-sin(a)*side, sy2+cos(a)*side
    );
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