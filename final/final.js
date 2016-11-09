// global variables
var if_data_print = 0;
var slider;
var data;

function setup() {
  data = loadTable("data/battles.csv", "csv", "header");
  createCanvas(windowWidth, windowHeight);

  slider = createSlider(1, 38, 1, 1);
  slider.position(windowWidth/10, windowHeight*0.9);
  slider.style("width", windowWidth/2 + "px");

  var circleCenterX = windowWidth*0.35;
  var circleCenterY = windowHeight*0.5;
  var circleR = windowHeight/5;
  // setup circles' positions
  for (var i = 0; i < houses.length; i++) {
    if (houses[i]['great']) {
      houses[i]['x'] = circleCenterX + circleR * sin(TAU / 9 * i);
      houses[i]['y'] = circleCenterY + circleR * cos(TAU / 9 * i);
    } else {
      houses[i]['x'] = circleCenterX + circleR*1.5 * sin(TAU / (houses.length - 9) * i);
      houses[i]['y'] = circleCenterY + circleR*1.5 * cos(TAU / (houses.length - 9) * i);
    }
  }

}

function draw() {
  background(51);
  // only run once
  if (data.getRowCount() && !if_data_print) {
    console.log(data);

    // for (var i = 0; i < data.getRowCount(); i++) {
    //   console.log(data.getColumn("name")[i]);
    // }

    if_data_print = 1;
  }


  // draw title
  drawTitle();

  // draw time slider
  drawTimeSlider();

  // draw info
  textAlign(LEFT);
  textSize(15);
  drawInfo(slider.value()-1);

  // draw circle
  if (data.getRowCount()) drawCircle(slider.value()-1);


}

function drawTitle() {
  textAlign(CENTER);
  textSize(20);
  fill(255);
  text("Battles in Game of Thromes", width/2, height/10);
}

function drawTimeSlider() {
  // TODO: change style to flat
  // slider.style("background-color", "#ff0000");
}

function drawInfo(index) {
  for (var i = 0; i < data.getColumnCount(); i++) {
    var key = data.columns[i];
    var value = data.getColumn(key)[index];
    text(key + ":", width/3*2, height/10*2 + 20*i);
    text(value + "", width/9*7.5, height/10*2 + 20*i);
  }
}

function drawCircle(index) {
  // draw all houses
  for (var i = 0; i < houses.length; i++) {
    fill(200);
    ellipse(houses[i]['x'], houses[i]['y'], (houses[i]['great'])?80:40);
    textAlign(CENTER, CENTER);
    fill(51);
    text(houses[i]['name'], houses[i]['x'], houses[i]['y']);
  }

  // identify who's involved in the battle
  var attackers = [];
  var defenders = [];
  for (var i = 5; i < 9; i++) {
    var houseName = data.getString(index, i);
    if (houseName) attackers.push(houseName);
  }
  for (var i = 9; i < 13; i++) {
    var houseName = data.getString(index, i);
    if (houseName) defenders.push(houseName);
  }

  // draw arrows
  stroke(255);
  strokeWeight(2);
  for (var i = 0; i < attackers.length; i++) {
      for (var j = 0; j < defenders.length; j++) {
        var att = findItemByValue(houses, 'name', attackers[i]);
        var def = findItemByValue(houses, 'name', defenders[j]);
        if (att && def) line(att['x'], att['y'], def['x'], def['y']);
      }
  }
  noStroke();
  strokeWeight(1);

}

// helpers
// TODO: change this stupid search...
function findItemByValue(json, col, value) {
  return json.filter(
        function(json){ return json[col] == value }
    )[0];
}