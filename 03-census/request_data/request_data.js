var stateCode = 'WY';
var dataYear = '2014';
var variableCodeList = ['B01003_001E'  // population
                      , 'B19301_001E'  // income_per_capita
                      , 'B17001_002E'  // poverty
                  ];
var dataProcessedList = {};
var ifInitStateList = false;
// var dataProcessedList = {'B19301_001E': false
//                        , 'B17001_002E': false
//                        , 'B01003_001E': false};
var stateList = {};
var dataMin, dataMax;
var backgroundColor = 38;
var barColorList = {'B19301_001E': '#18759e'
                  , 'B17001_002E': '#a00000'
                , 'B01003_001E': '#ffffff'};
var textColor = '#a2e0fc';

function setup() {
    createCanvas(960, 540);
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
          var len = Object.keys(stateList).length;
          for (var stateName in stateList) {
            count += 1;
            var barWidth = height/(len + 1)/3;
            var y = map(count, 0, len, 10, height - 10);
            // 2 bars
            for (var variableCode in stateList[stateName]){
              var w = map(stateList[stateName][variableCode], dataMin, dataMax, 10, width - 100);
              fill(color(barColorList[variableCode]));
              rect(0, y, w, barWidth);
              fill(color(textColor));
              if (variableCode === 'B01003_001E'){
                text(stateName, w+5, y-barWidth*1.5);
              }
            }
            // 1 bar with percentage
            // var poverty_percent = stateList[stateName]['B17001_002E']/stateList[stateName]['B01003_001E'];
            // var w = map(poverty_percent, 0, 1, 10, width - 100);
            // fill(color('#fff'));
            // rect(0, y, w, barWidth);
            // fill(color(textColor));
            // text(stateName + "   " + nf(poverty_percent,0,2)*100 + "%", w+5, y-barWidth*1.5);

          // }
        }
      }
    }


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

// // return sum of values in an object
// function getSumInObj(obj) {
//   var sum = 0;
//   for (var k in obj) {
//       sum += obj[k];
//   }
//   return sum;
// }
