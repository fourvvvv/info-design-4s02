var stateCode = 'WY';
var dataYear = '2014';
var variableCodeList = ['B01003_001E'  // population
                      , 'B19301_001E'  // income_per_capita
                      , 'B19013_001E'  // Median_household_income
                      , 'B17001_002E'  // poverty
                  ];
var dataProcessedList = {};
var ifInitStateList = false;

var stateList = {};
var dataMin, dataMax;
var dataMin1, dataMax1;
var dataMin2, dataMax2;
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
var currentBarNum;
var xOffset = 0;
var numBarPerPage = 52;

function setup() {
    createCanvas(960, 540);
    initializeCensus('');
    // initializeCensus('85a09c0ef73873b4519d0b403dbbb90c8dadea83');
    baselineY = bannerHeight + (height - bannerHeight) / 3 * 2;
    barWidth = width / numBarPerPage;

    for (var i in variableCodeList){
      var variableCode = variableCodeList[i];
      dataProcessedList[variableCode] = false;
      requestUSData(dataYear, variableCode);
    }
}


function draw() {
    background(backgroundColor);

    if (!ifInitStateList) {
      // stupid init of stateList!! TODO: change it
      if(USDataIsReady(dataYear, 'B01003_001E')) {
        var USData = getUSData(dataYear, 'B01003_001E');
        for (var stateName in USData) {
          stateList[stateName] = {name: stateName};
          // stateList['key'] = function(n) {
          //   return this[Object.keys(this)[n]];
          // }

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
            // set min and max based on population
            if (variableCode === 'B01003_001E') {
              dataMin = getMinInObj(USData);
              dataMax = getMaxInObj(USData);
            }
            // set min and max based on income_per_capita
            if (variableCode === 'B19301_001E') {
              dataMin1 = getMinInObj(USData);
              dataMax1 = getMaxInObj(USData);
            }
            // set min and max based on Median_household_income
            if (variableCode === 'B19013_001E') {
              dataMin2 = getMinInObj(USData);
              dataMax2 = getMaxInObj(USData);
            }
            dataProcessedList[variableCode] = true;
          }
        }
      }

      // once the data has been processed
      // start the TRUE DRAWING PROCESS
      else if (getMinInObj(dataProcessedList)) {
        numBarPerPage = Object.keys(stateList).length;
        hoverBackgroud();
        banner();

        // chart
        chartFOO();
        // baseline
        stroke(255);
        strokeWeight(2);
        line(0, baselineY, width, baselineY);
        strokeWeight(1);

        hoverBox();

      }
    }

    if (mouseIsPressed) {
      if (mouseButton == LEFT) {
        foo = 0;
      }
      if (mouseButton == RIGHT) {
        foo = 1;
      }
    }

}

// draw background bar when mouseover
function hoverBackgroud() {
  // current #bar
  if (Math.floor(mouseX/barWidth) < 0){
    currentBarNum = 0;
  } else if (Math.floor(mouseX/barWidth) >= numBarPerPage) {
    currentBarNum = numBarPerPage - 1;
  } else {
    currentBarNum = Math.floor(mouseX/barWidth);
  }
  console.log(currentBarNum);
  // x of current bar
  var currentBarX = barWidth * currentBarNum;
  // draw background bar
  fill(20);
  noStroke();
  rect(currentBarX, bannerHeight, barWidth, height);

  // call mouse event: press on a single bar
  if (mouseIsPressed) {
    mousePressedOnBar(currentBarNum);
  }
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

// mouse event: press on a single bar
function mousePressedOnBar(currentBarNum) {

}

// TODO: undecided func name
function chartFOO() {
  var count = 0;
  for (var stateName in sortObjByFeature(stateList,'B19301_001E')) {
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
    if (abb[stateName]) {
      text(abb[stateName], textX, baselineY-20);
    } else {
      text(stateName, textX, baselineY-20);
    }
    textSize(12);
    count += 1;
  }
}



function drawFilter() {
  fill(255);
  stroke(backgroundColor);
  rect(width/3-1.5, 0, 3, height);

  fill(255, 80);
  stroke(255, 227, 61);
  rect(width*0.85, height*0.05, width*0.13, height*0.2);
  fill(255);
  noStroke();
  textSize(15);
  textAlign(CENTER, CENTER);
  text("SORT BY", width*0.91, height*0.05 + 10);
}

// Draw title banner
function banner() {
  noStroke();
  fill(backgroundColor);
  rect(0, 0, width, bannerHeight);

  textAlign(CENTER, CENTER);
  fill(255);
  textSize(30);
  text("RICH vs POOR", width/2, bannerHeight/2);
  textSize(12);
}

function mousePressed() {
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
