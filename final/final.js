/*****
TODO:
1) arrow
3) Bolton betrayed
5) time slider not equally divided
6) change stupid drawing box -> put them into an array?
7) ?? major_death & major_capture
8) move house icons all the time.
    Distance bewteen each other could be based on relationship (distant / close)
10) image
  - get rid of errors
  - size correctly
11) format text size/align


DONE
2) lesser houses emerge after they first involved
  - if house involved a battle, set "involved" as 1
  - only display house whose "involved" == 1
  - houses' #battle -> color
4) crawler: get icon image for each house
9) hover box to explain info
*****/

/***
NOTE:
1) current_index = slider.value() - 1
***/

// global variables
var if_data_print = 0;
var slider;
var data;
var img = [];
var circleCenterX, circleCenterY, circleR
  , sliderStartX, sliderY, sliderWidth
  , titleX, titleY;
var leftBox1, leftBox2;

function preload() {
  houses.forEach(function(entry){
    var path = "img/house/" + entry["name"] +".png";

    $.get(path)
    .done(function() {
      entry["img"] = loadImage(path);
      // var thisSound = loadSound(path, storeSound);
    }).fail(function() {
      // do something with the error
    });
  });
}

function setup() {
  data = loadTable("data/battles.csv", "csv", "header");
  createCanvas(displayWidth, windowHeight);

  // init variables about sizes
  circleCenterX = width*0.5;
  circleCenterY = height*0.5;
  circleR = height*0.2;
  sliderWidth = width*0.6;
  sliderStartX = (width - sliderWidth)/2;
  sliderY = height*0.9;
  titleX = width*0.5;
  titleY = height*0.1;
  // TODO: elegant this
  leftBox1 = initBox("Battle Type"
                    , width*0.2, height*0.05, width*0.05, height*0.15
                    , ["battle_type"]
                    , -1);
  leftBox2 = initBox("Attackers vs Defenders"
                    , width*0.2, height*0.05, width*0.05, height*0.25
                    , ["attacker_king", "defender_king"
                      ,	"attacker_1",	"attacker_2",	"attacker_3",	"attacker_4"
                      ,	"defender_1",	"defender_2",	"defender_3",	"defender_4"]
                    , 7);
  leftBox3 = initBox("Houses involved in battles"
                    , width*0.2, height*0.05, width*0.05, height*0.65
                    , ["house"]
                    , 7);
  rightBox1 = initBox("Major Death"
                    , width*0.2, height*0.05, width*0.75, height*0.25
                    , ["major_death"]);
  rightBox2 = initBox("Major Capture"
                    , width*0.2, height*0.05, width*0.75, height*0.65
                    , ["major_capture"]);

  slider = createSlider(1, 38, 1, 1);
  slider.position(sliderStartX, sliderY);
  slider.style("width", sliderWidth + "px");

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

  // for (var i=0, L = houseList.length;i<L;i++){
  //   houseList[i].update();
  // }

  // FOR TESTING - only run once
  // if (data.getRowCount() && !if_data_print) {
  //   console.log(data);
  //   // for (var i = 0; i < data.getRowCount(); i++) {
  //   //   console.log(data.getColumn("name")[i]);
  //   // }
  //   if_data_print = 1;

  // draw title
  drawTitle();

  // draw time slider
  drawTimeSlider();

  // fill involoved
  if (data.getRowCount()) fillInvoloved(slider.value() - 1)

  // draw info
  // drawInfo(slider.value() - 1);

  // draw circle
  if (data.getRowCount()) drawCircle(slider.value()-1);

  // draw boxes
  drawBox(leftBox1);
  drawBox(leftBox2);
  drawBox(leftBox3);
  drawBox(rightBox1);
  drawBox(rightBox2);

}
