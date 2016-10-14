var USMap; // variable for holding map object
var mapCreated = false;
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
var barColorList = {'B19301_001E': '#18759e'
                  , 'B17001_002E': '#a00000'
                , 'B01003_001E': '#ffffff'};
var backgroundColor = 38;
var hiliteColor = '#a2e0fc';

var transparency = 100;
  // counties are partially transparent unless they are
  // hovered

function setup() {
    createCanvas(960, 540);
    initializeCensus('85a09c0ef73873b4519d0b403dbbb90c8dadea83');

    for (var i in variableCodeList){
      var variableCode = variableCodeList[i];
      dataProcessedList[variableCode] = false;
      requestUSData(dataYear, variableCode);
    }
    requestUSMap();
      // hexidecimal form of fill color
      // for counties
}

function draw() {
    background(backgroundColor);
    overMap.clear();
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
      // once the data has been processed, draw map
      else if (getMinInObj(dataProcessedList)) {
        if (!mapCreated && USMapIsReady()) {
          USMap = createUSMap(0, 0, width, height);

          // var countyList = USMap.getStateNames();
          for (var stateName in stateList) {
            var population = map(stateList[stateName]['B01003_001E'], dataMin, dataMax, 0, 255);
            var income_per_capita = stateList[stateName]['B19301_001E']
            var poverty = stateList[stateName]['B17001_002E']
            USMap.fill(stateName, color(244,189,73, population));
            USMap.stroke(stateName, color(backgroundColor));
          }
          USMap.show();
          mapCreated = true;
        }
    }
    //if (mapCreated) {
    //  var xy = USMap.latLonToXY(41.1, -104.8);
    //    // lat-lon coordinates of cheyenne
    //  overMap.noStroke();
    //  overMap.fill(hiliteColor);
    //  overMap.ellipse(xy.x, xy.y, 5, 5);
    //  overMap.textAlign(RIGHT, BOTTOM);
    //  overMap.text("Cheyenne", xy.x, xy.y-5);
    //}
  }
}

// callbacks for hover functionality
function mouseEnter(county) {
  USMap.fill(county, countyColor);
}

function mouseLeave(county) {
  USMap.fill(county,
    color(red(countyColor), green(countyColor), blue(countyColor), transparency));
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
