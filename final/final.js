/*****
TODO:
1) arrow
3) Bolton betrayed
5) time slider not equally divided
6) change stupid drawing box -> put them into an array?
7) ?? major_death & major_capture
8) move house icons all the time
  - matrix, house m vs house n
  - Distance bewteen each other could be based on relationship (distant / close)
10) image
  - get rid of errors
  - size correctly
13) ??? whether use "currentInBattle"

DONE
2) lesser houses emerge after they first involved
  - if house involved a battle, set "involved" as 1
  - only display house whose "involved" == 1
  - houses' #battle -> color
4) crawler: get icon image for each house
8) move house icons all the time
  - at first, all Greater houses are shown in a row
  - move who's involved to the screen center, and move others to corner (and opacity)

9) hover box to explain info
11) format text size/align
12) change to Class

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
var boxList = [];
var houseList = [];
var time = 0;

function preload() {


  // put all House instance into houseList
  houses.forEach(function(entry, i){
    var item = new House(entry.name, entry.great == 1, 0, 0);

    var img;
    var path = "img/house/" + entry["name"] +".png";
    $.get(path)
    .done(function() {
      item.setImage(loadImage(path));
      // var thisSound = loadSound(path, storeSound);
    }).fail(function() {
      // do something with the error
    });
    houseList.push(item);
  });
}

function setup() {
  data = loadTable("data/battles.csv", "csv", "header");
  createCanvas(displayWidth, windowHeight);

  // init variables about sizes
  sliderWidth = width*0.6;
  sliderStartX = (width - sliderWidth)/2;
  sliderY = height*0.9;
  titleX = width*0.5;
  titleY = height*0.1;

  boxList.push(new Box("Battle Type"
              , width*0.2, height*0.05, width*0.05, height*0.15
              , ["battle_type"]
              , -1));
  boxList.push(new Box("Attackers vs Defenders"
              , width*0.2, height*0.05, width*0.05, height*0.25
              , ["attacker_king", "defender_king"
                ,	"attacker_1",	"attacker_2",	"attacker_3",	"attacker_4"
                ,	"defender_1",	"defender_2",	"defender_3",	"defender_4"]
              , 7));
  boxList.push(new Box("Houses involved in battles"
              , width*0.2, height*0.05, width*0.05, height*0.65
              , ["house"]
              , 7));
  boxList.push(new Box("Major Death"
              , width*0.2, height*0.05, width*0.75, height*0.25
              , ["major_death"]));
  boxList.push(new Box("Major Capture"
              , width*0.2, height*0.05, width*0.75, height*0.65
              , ["major_capture"]));

  slider = createSlider(1, 38, 1, 1);
  slider.position(sliderStartX, sliderY);
  slider.style("width", sliderWidth + "px");

  // setup Greater Houses' positions
  houseList.forEach(function(entry, i){
    if (entry.getIsGreat()) {
      entry.setPositon(width / 2 + (i - 4) * width/10, height / 2);
    }
  });


}

function draw() {
  if (slider.value() - 1 !== time) {
    time = slider.value() - 1;
    sliderChanged();
  }

  background(51);

  fill(238, 162, 173);
  rect(0, 0, width/2, height);

  fill(121, 129, 116);
  rect(width/2, 0, width/2, height);

  // draw title
  drawTitle();

  // draw time slider
  drawTimeSlider();

  // fill involoved
  if (data.getRowCount()) fillInvoloved(slider.value() - 1);

  // draw info
  // drawInfo(slider.value() - 1);

  // draw circle
  if (data.getRowCount()) drawCircle(slider.value()-1);

  // draw boxes
  // boxList.forEach(function(box) {
  //   drawBox(box);
  // });

}
