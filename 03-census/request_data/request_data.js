var dataYear = '2014';
var variableCodeList = ['B01003_001E'  // population
                      , 'B19301_001E'  // income_per_capita
                      , 'B19013_001E'  // Median_household_income
                      , 'B17001_002E'  // poverty
                  ];
var dataProcessedList = {};
var CountyDataProcessedList = {};
var ifInitStateList = false;
var ifInitConutyList;

var stateList = {};
var countyList = {};

var backgroundColor = 38;
var barColorList = {'B01003_001E': '#ffffff'
                  ,'B19301_001E': '#18759e'
                  , 'B19013_001E': '#FFE33D'
                  , 'B17001_002E': '#a00000'
                , };
var textColor = '#a2e0fc';

var foo = 0;
var bannerHeight = 40;
// y of baseline - income above, poverty below
var baselineY;
var barWidth;
var currentBarNum = 0;
var xOffset = 0;
var numBarPerPage = 52;
var stateCode = 0;
var yOffset = -20;
var ordering = 'B19301_001E';

function setup() {
    createCanvas(960, 540);
    // initializeCensus('');
    initializeCensus('85a09c0ef73873b4519d0b403dbbb90c8dadea83');
    baselineY = bannerHeight + (height - bannerHeight) / 3 * 2;
    barWidth = width / numBarPerPage;

    for (var i in variableCodeList){
      var variableCode = variableCodeList[i];
      dataProcessedList[variableCode] = false;
      requestUSData(dataYear, variableCode);
    }
}


function draw() {
  if (!ifInitStateList) {
    // stupid init of stateList!! TODO: change it
    if(USDataIsReady(dataYear, 'B01003_001E')) {
      var USData = getUSData(dataYear, 'B01003_001E');
      for (var stateName in USData) {
        stateList[stateName] = {name: stateName};
      }
      ifInitStateList = true;
    }
  } else {
    // process the data (find min and max) once
    if (!getMinInObj(dataProcessedList)) {
      for (var i in variableCodeList) {
        var variableCode = variableCodeList[i];
        if(USDataIsReady(dataYear, variableCode)) {
          var USData = getUSData(dataYear, variableCode);
          for (var stateName in USData) {
            stateList[stateName][variableCode] = USData[stateName];
          }
          dataProcessedList[variableCode] = true;
        }
      }
    }

    // once the data has been processed
    // start the TRUE DRAWING PROCESS
    else if (getMinInObj(dataProcessedList)) {

      background(backgroundColor);
      numBarPerPage = Object.keys(stateList).length;
      backgroudLine();
      hoverBackgroud();
      banner();

      // chart
      chartFOO();
      // baseline
      stroke(255);
      strokeWeight(2);
      line(0, baselineY, width, baselineY);
      strokeWeight(1);
      // filter boxX
      filterButtons();

      // mouse hover
      if (mouseY > bannerHeight) hoverBox();

    }
  }

}
var codeToLabel = {'B01003_001E': 'Population'
                  , 'B19301_001E': 'Income'
                  , 'B19013_001E': 'Household'
                  , 'B17001_002E': 'Poverty'
                };
function filterButtons() {
  var myY = bannerHeight / 4;
  var myX = barWidth;
  var buttonWidth = 80;
  var buttonHeight = bannerHeight / 2;
  if (mouseY >= myY
    && mouseY <= myY+ buttonHeight
    && mouseX <= myX + (buttonWidth+5)*4
    && mouseX >= myX
    && mouseIsPressed
  ){
    ordering = variableCodeList[Math.floor( (mouseX-myX) / (buttonWidth + 5) )];
    // console.log(orderingstateList);
  }
  for (var i in variableCodeList) {

    if (variableCodeList[i] === ordering) {
      fill(243, 134, 48, 200);
    } else {
      fill(255, 50);
    }
    stroke(0, 200);
    strokeWeight(0.5);
    rect(myX + (buttonWidth+5) * i, myY, buttonWidth, buttonHeight);

    noStroke();
    textAlign(CENTER, CENTER);
    fill(255);
    text(codeToLabel[variableCodeList[i]], myX + (buttonWidth+5) * i + buttonWidth / 2, buttonHeight);
  }
}

function backgroudLine() {
  for (var i = 0; i < numBarPerPage; i++) {
    noFill();
    stroke(255, 30);
    strokeWeight(0.5);
    rect(barWidth * i, bannerHeight, barWidth, height);
  }

}

// draw background bar when mouseover
function hoverBackgroud() {
  // assign current #bar
  if (Math.floor(mouseX/barWidth) < 0){
    currentBarNum = 0;
  } else if (Math.floor(mouseX/barWidth) >= numBarPerPage) {
    currentBarNum = numBarPerPage - 1;
  } else {
    currentBarNum = Math.floor(mouseX/barWidth);
  }

  // x of current bar
  var currentBarX = barWidth * currentBarNum;

  // draw background bar
  fill(20);
  noStroke();
  rect(currentBarX, bannerHeight, barWidth, height);

}

function hoverBox() {
  var boxWidth = 200;
  var boxHeight = 70;
  var boxX = mouseX + boxWidth < width ? mouseX : mouseX - boxWidth;
  var boxY = mouseY + boxHeight < height ? mouseY : mouseY - boxHeight;
  var item = getObjByIndex(stateList, currentBarNum);
  var name = item['name'];
  var poverty = item['B17001_002E'];
  var income = item['B19301_001E']
  var household = item['B19013_001E'];

  fill(0, 200);
  stroke(0);
  rect(boxX, boxY, boxWidth, boxHeight);
  textAlign(CENTER, CENTER);
  fill(255);
  textSize(14);
  text(name, boxX+boxWidth/2, boxY+10);
  textAlign(LEFT, CENTER)
  textSize(12);
  text("poverty: #" + nfc(poverty), boxX+10, boxY+30);
  text("Income mean: $" + nfc(income), boxX+10, boxY+45);
  text("Household median: $" + nfc(household), boxX+10, boxY+60);
  textAlign(CENTER, CENTER);
}


// TODO: undecided func name
function chartFOO() {
  var count = 0;
  for (var stateName in sortObjByFeature(stateList, ordering)) {
    var barX = map(count, 0, numBarPerPage, 0, width) - xOffset;
    var textX = barX + barWidth / 2;

    // poverty level
    var poverty_percent = stateList[stateName]['B17001_002E']/stateList[stateName]['B01003_001E'];
    var povertyHeight = map(poverty_percent, 0, 0.5, 0, height/3-20);
    fill(100);
    rect(barX, baselineY, barWidth, povertyHeight);
    fill(255,200);
    textSize(10);
    text(Number(poverty_percent*100).toFixed(0), textX, baselineY + 10);
    text("%", textX, baselineY + 20);
    textSize(12);

    // income mean
    var income = stateList[stateName]['B19301_001E']
    var incomeHeight = map(income, 10000, 80000, 10, (height - bannerHeight)/3*2-20);
    fill(255, 227, 61, 220);
    rect(barX, baselineY-incomeHeight, barWidth/2, incomeHeight);

    // household median
    var household = stateList[stateName]['B19013_001E'];
    var householdHeight = map(household, 10000, 80000, 10, (height - bannerHeight)/3*2-20);
    fill(255,244,230, 230);
    rect(barX+barWidth/2, baselineY-householdHeight, barWidth/2, householdHeight);

    // state name
    textSize(10);
    fill(255, 180);
    if (abb[stateName]) {
      text(abb[stateName], textX, bannerHeight+10);
    } else {
      text(stateName, textX, bannerHeight+10);
    }
    textSize(12);
    count += 1;
  }
}


// Draw title banner
function banner() {
  stroke(0);
  fill(backgroundColor-10);
  rect(0, 0, width, bannerHeight);
  noStroke();

  textAlign(CENTER, CENTER);
  fill(255);
  textSize(30);
  text("RICH vs POOR", width/2, bannerHeight/2);
  textSize(12);
}

function keyPressed() {
  if (keyCode === ESCAPE) {
    stateCode = 0;
  }
}

function mouseWheel(event) {
  print(event.delta);
  //move the square according to the vertical scroll amount
  if (yOffset > height + 550) {
    yOffset = height + 550;
  } else if (yOffset < -20) {
    yOffset = -20;
  } else {
    yOffset += event.delta;
  }
  //uncomment to block page scrolling
  return false;
  //uncomment to block page scrolling
  //return false;
}

/************ helpers ************/
// return min value in an object
function getMinInObj(obj) {
  var min;
  for (var k in obj) {
    if (min === undefined || obj[k] < min) {
      min = obj[k];
    }
  }
  return min;
}

// return max value in an object
function getMaxInObj(obj) {
  var max;
  for (var k in obj) {
    if (max === undefined || obj[k] > max) {
      max = obj[k];
    }
  }
  return max;
}

// sort object by feature
function sortObjByFeature(obj, feature) {
  var output = {};
  var key = Object.keys(obj)
    .sort(function(a,b) {
      return obj[a][feature]-obj[b][feature]
    });
  for (var i in key) {
    output[key[i]] = obj[key[i]];
  }
  stateList = output;
  return output;
}

function getObjByIndex(obj, index) {
  var count = 0;
  for (var item in obj) {
    if (index == count) {
      return obj[item];
    } else {
      count += 1;
    }
  }

}
