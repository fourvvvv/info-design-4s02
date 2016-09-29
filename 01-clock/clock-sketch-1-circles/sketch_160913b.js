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
  background(255);

  bgCircle(0, height/2, width*0.38*2*1.02, 255, 'rgba(0,100,200,0.6)');
  bgCircle(0, height/2, width*0.38*2, 255, 'rgba(255,200,0,0.5)');
  bgCircle(0, height/2, width*0.38*2*0.98, 255, 'rgba(0,100,200,0.4)');
  bgCircle(width, height/2, width*0.5*2*1.07, 255, 'rgba(255,204,0,0.6)');
  bgCircle(width, height/2, width*0.38*2*1.11, 255, 'rgba(230,204,0,0.6)');
  bgCircle(width, height/2, width*0.38*2*1.1, 255, 'rgba(230,204,0,0.7)');
  
  clockNumbers(0, height/2, width*0.38*2, 24, h, 15, 0);
  clockNumbers(width, height/2, width*0.5*2, 60, m, 12, 1);
  clockNumbers(width, height/2, width*0.38*2, 60, s, 8, 1);
}

// background circle strokes
function bgCircle(x,y,d,c,s) {
  fill(c);
  stroke(s);
  ellipse(x, y, d);
}

// display number on the clock
function clockNumbers(x,y,d,unit,s,textS,dir) {
  var startAngle = radians(90);
  var stopAngle = radians(450);
  var theta = map(s, 0, unit, startAngle, stopAngle);
  var num, cx, cy;
  noStroke();
  for (var i = 0; i < unit; i++) {
    if (dir){
      num = i;
      cx = x + d/2 * sin(TAU / unit * num - theta);
      cy = y + d/2 * cos(TAU / unit * num - theta);
      
    } else {
      num = i + 1;
      cx = x - d/2 * sin(TAU / unit * num - theta);
      cy = y - d/2 * cos(TAU / unit * num - theta);
      fill(255);
      ellipse(cx, cy, textS*1.5);
    }
    
    if (num == s) {
      textSize(22);
      fill(51);
    } else {
      fill('rgba(0,0,0,0.3)');
      textSize(textS);
    }
    text(nf(num, 2), cx, cy);
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
