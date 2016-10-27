var stateCode = 'WY';
var dataYear = '2014';
var variableCodeList = ['B01003_001E'  // population
                      , 'B19301_001E'  // income_per_capita
                      , 'B19013_001E'  // Median_household_income
                      , 'B17001_002E'  // poverty
                  ];
var dataProcessedList = {};
var ifInitStateList = false;
// var dataProcessedList = {'B19301_001E': false
//                        , 'B17001_002E': false
//                        , 'B01003_001E': false};
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
var yOffset = -20;
function setup() {
    createCanvas(960, 540);
    // initializeCensus('');
    initializeCensus('85a09c0ef73873b4519d0b403dbbb90c8dadea83');

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
          stateList[stateName] = {};
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

      // once the data has been processed, draw the bar chart
      else if (getMinInObj(dataProcessedList)) {
        // for (var i in USDataList) {
        //   var USData = USDataList[i];
        //   var countyNames = Object.keys(USData);

        noStroke();
        textAlign(LEFT, TOP);
        var count = 0;
        var len = Object.keys(stateList).length / 3;

        for (var stateName in sortObjByFeature(stateList,'B19301_001E')) {
          count += 1;
          var barWidth = height/(len + 1)/2.5;
          var y = map(count, 0, len, 10, height - 10) - yOffset;

          (count % 2) ? fill(255) : fill("#FFE33D");
          textSize(15);
          text(stateName, 5, y+2);

          var poverty_percent = stateList[stateName]['B17001_002E']/stateList[stateName]['B01003_001E'];
          var w = map(poverty_percent, 0, 0.5, 0, width/3-60);
          fill(100);
          rect(width/3-w, y, w, barWidth*2);
          fill(255,200);
          textAlign(RIGHT, TOP);
          text(Number(poverty_percent*100).toFixed(1)+ "%", width/3-2, y);

          textAlign(LEFT, TOP);
          var y1 = map(count, 0, len, 10, height - 10) - yOffset;
          var w1 = map(stateList[stateName]['B19301_001E'], 10000, 80000, 10, width/3*2-40);
          var w2 = map(stateList[stateName]['B19013_001E'], 10000, 80000, 10, width/3*2-40);
          // textSize(8);
          fill(255, 227, 61, 220);
          rect(width/3, y1, w1, barWidth);
          text(stateList[stateName]['B19301_001E'], width/3+w1+10, y1);
          fill(255,244,230, 230);
          rect(width/3, y1+barWidth, w2, barWidth);
          text(stateList[stateName]['B19013_001E'], width/3+w2+5, y1+barWidth);
        }

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

        fill(backgroundColor);
        rect(0, 0, width, 45);

        textAlign(CENTER, TOP);
        fill(255);
        textSize(20);
        text("Rich v.s Poor", width/2, 2);

        textSize(12);
        textAlign(RIGHT, BOTTOM);
        fill(200);
        text("Below the poverty line", width/3-5, 40);
        textAlign(LEFT, BOTTOM);
        fill(255, 227, 61, 220);
        text("Mean per person,", width/3+5, 40);
        fill(255,244,230, 230);
        text("Median household", width/3+100, 40);
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

function mouseWheel(event) {
  print(event.delta);
  //move the square according to the vertical scroll amount
  console.log(yOffset);
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

function sortObjByFeature(obj, feature) {
  var output = {};
  var key = Object.keys(obj)
    .sort(function(a,b) {
      return obj[a][feature]-obj[b][feature]
    });
  for (var i in key) {
    output[key[i]] = obj[key[i]];
  }
  return output;
}

// // return sum of values in an object
// function getSumInObj(obj) {
//   var sum = 0;
//   for (var k in obj) {
//       sum += obj[k];
//   }
//   return sum;
// }
