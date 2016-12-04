/*****
TODO:
3) Bolton betrayed
6) change stupid drawing box -> put them into an array?
7) ?? major_death & major_capture
8) move house icons all the time
  - Distance bewteen each other could be based on relationship (distant / close)
10) image
  - get rid of errors
  - size correctly
13) ??? whether use "currentInBattle"
14) (maybe not) change houses to be not hard coding in "data.js"
16) formatting
  - sheild mask
17) att vs def

DONE
1) arrow - bezier() & line
2) lesser houses emerge after they first involved
  - if house involved a battle, set "involved" as 1
  - only display house whose "involved" == 1
  - houses' #battle -> color
4) crawler: get icon image for each house
5) time slider not equally divided
8) move house icons all the time
  - at first, all Greater houses are shown in a row
  - move who's involved to the screen center, and move others to corner (and opacity)
  - matrix, house m vs house n
9) hover box to explain info
11) format text size/align
12) change to Class
15) animation
16) formatting
  - not show all labels
  - team together
  - non-battle ones stepback/smaller -> transparency
17) time - display year and current time

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
  , titleX, titleY;
var boxList = [];
var houseList = [];
var time = 0;
var pTime = time;

var matrix = [];
var animating = false;
var TimeBarXs;
var sliderSize;
var timeMouseOver = 0;
var speed = 40;
var years;
var yearIndex = {};

function preload() {
  data = loadTable("data/battles.csv", "csv", "header");
  font28 = loadFont('fonts/28DaysLater.ttf');
  fontGOT = loadFont('fonts/GameOfThrones.ttf');
}

function setup() {
  createCanvas(displayWidth, windowHeight);

  // put all House instance into houseList
  var counter = 0;
  for (var key in houses) {
    houses[key]["index"] = counter;
    houseList.push(new House(key, houses[key]["great"] == 1, 0, 0));
  }

  houseList.forEach(function(house, i) {
    var img;
    var path = "img/house/" + house.name +".png";
    $.get(path)
    .done(function() {
      house.setImage(loadImage(path));
    }).fail(function() {
      house.setImage(loadImage("img/house/NA.png"));
    });
  });

  // build a [m x n] matrix of relations, m = n = #houses
  // cell (x, y) = {enemy: #times houseX and houseY were against each other
  //              , ally: #times houseX and houseY were at the same side}
  initMatrix();

  years = data.getColumn("year");

  for (var i = 0; i < years.length; i++) {
    if (yearIndex[years[i]]) {
      yearIndex[years[i]]++;
    } else {
      if (i === 0) {
        yearIndex[years[i]] = 1;
      } else {
        yearIndex[years[i]] = parseInt(yearIndex[years[i - 1]]) + 1;
      }
    }
  }
  // init variables about sizes
  sliderSize = {width: width*0.28
          , left: width*0.03
          , top: height*0.8
          , play: {
              width: 20
            }
          };
  sliderSize.right = sliderSize.left + sliderSize.width;
  sliderSize.bottom = sliderSize.top + sliderSize.play.width*2;
  sliderSize.play.centerX = sliderSize.left - sliderSize.play.width;
  sliderSize.play.centerY = (sliderSize.top + sliderSize.bottom)/2;
  // sliderSize.play.centerY = sliderSize.top;
  sliderSize.play.left = sliderSize.play.centerX - sliderSize.play.width;
  sliderSize.play.right = sliderSize.play.centerX + sliderSize.play.width;
  sliderSize.play.top = sliderSize.play.centerY - sliderSize.play.width;
  sliderSize.play.bottom = sliderSize.play.centerY + sliderSize.play.width;

  titleX = width*0.03;
  titleY = height*0.3;

  TimeBarXs = preProcessTimeBar();

  boxList.push(new Box("Battle Type"
              , width*0.2, height*0.04, width*0.78, height*0.15
              , ["battle_type"]
              , -1));
  boxList.push(new Box("Attackers vs Defenders"
              , width*0.2, height*0.04, width*0.78, height*0.2
              , ["attacker_king", "defender_king"
                ,	"attacker_1",	"attacker_2",	"attacker_3",	"attacker_4"
                ,	"defender_1",	"defender_2",	"defender_3",	"defender_4"]
              , 6.5));
  // boxList.push(new Box("Houses involved in battles"
  //             , width*0.2, height*0.05, width*0.05, height*0.65
  //             , ["house"]
  //             , 7));
  // boxList.push(new Box("Major Death"
  //             , width*0.2, height*0.05, width*0.75, height*0.25
  //             , ["major_death"]));
  // boxList.push(new Box("Major Capture"
  //             , width*0.2, height*0.05, width*0.75, height*0.65
  //             , ["major_capture"]));

  circleCenterX = width*0.5;
  circleCenterY = height*0.5;
  circleR = height*0.3;
  // setup Greater Houses' positions
  initHousePosition();

}
function draw() {
  if (pTime !== time) {
    // move once
    moveToBattlefield();
    fillCurrentInBattle(time);
    pTime = time;
  }

  // keep tracking updating
  updateHousePosition();

  background(51);
  moveTimeCursor();
  // fill(238, 162, 173);
  // rect(0, 0, width, height);

  // fill(121, 129, 116);
  // rect(width/2, 0, width/2, height);

  // draw title
  drawText();

  // draw time slider
  drawTimeSlider();

  // fill involoved
  if (data.getRowCount()) fillInvoloved(time);

  // draw info
  // drawInfo(slider.value() - 1);

  // draw circle
  if (data.getRowCount()) drawCircle(time);

  // draw boxes
  boxList.forEach(function(box) {
    drawBox(box);
  });
  drawTitle();
  // textSize(10);


}
