var MONTH_TEXT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];
var DAY_TEXT = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
//var data;
function setup() {
  createCanvas(375, 667);
  textAlign(CENTER, CENTER);

   //requestWeather("794232e0a3ed04d63225d8eacd3d7e66");
  requestWeather();

}

function draw() {
  background(51);

  var cGeo = latitude() + ", "+ longitude();
  var cSummary = summary();
  var cTemperature = temperature();
  var cApparentTemperatureMin = apparentTemperatureMin();
  var cApparentTemperatureMax = apparentTemperatureMax();
  var cWindSpeed = windSpeed();
  var cHumidity = humidity();
  var cVisibility = visibility();


  var cTime = valueGetter("currently", "time");
  var cDay = timeFormatterSingleValue(cTime, DAY);
  var cDate = timeFormatterSingleValue(cTime, DATE);
  var cMonth = MONTH_TEXT[timeFormatterSingleValue(cTime, MONTH)];
  if (cTime != null) {
    fill(255);
    textAlign(LEFT, CENTER);
    textSize(15);
    text(DAY_TEXT[cDay] + ", " + cMonth + " " + cDate, width*0.1, height*0.47);
  }

  fill(255);
  if (cGeo != null) {
    textAlign(CENTER, CENTER);
    textSize(12);
    text(cGeo, width/2, 15);
  }
  if (cSummary != null) {
    textAlign(CENTER, CENTER);
    textSize(20);
    text(cSummary.toUpperCase(), width/2, height*0.1);
  }
  drawIcon(icon());

  tempData(cTemperature, cApparentTemperatureMin, cApparentTemperatureMax);
  detailsData(cWindSpeed, cHumidity, cVisibility);

  stroke(255, 100);
  line(width*0.1, height*0.58, width*0.9, height*0.58);
  noStroke();

  // hourly prediction
  hourlyPre();

  stroke(255, 100);
  line(width*0.1, height*0.73, width*0.9, height*0.73);
  noStroke();

  // daily prediction
  dailyPre();
}

function dailyPre() {
  var dailyData = new Array();
  
  if (weatherData.daily) {
    var cDaily = weatherData.daily.data;
    for (var i = 0; i < cDaily.length; i++) {
      var item = cDaily[i];
      append(dailyData, {
        "time": item.time
      , "icon": item.icon
      , "temperatureMin": item.temperatureMin
      , "temperatureMax": item.temperatureMax
      , "precipProbability": item.precipProbability
      , "windSpeed": item.windSpeed
      });
    }

    for (var i = 0; i < dailyData.length; i++) {
      var item = dailyData[i];
      var day = timeFormatterSingleValue(item.time, DAY);
      var cx = width*0.1 + (i+0.5) * width*0.8/dailyData.length;
      var cy = height*0.78;
      stroke(255, 60);
      if (i) line(cx-19, cy-20, cx-19, cy+90);
      textAlign(CENTER, CENTER);
      noStroke();
      fill(244, 208, 63, 200);
      textSize(15);
      text(DAY_TEXT[day], cx, cy+10);
      // temperature
      fill(255, 200);
      textSize(10);
      text(nf(item.temperatureMin,0,1), cx, cy+30);
      text(nf(item.temperatureMax,0,1), cx, cy-10);
      // rain
      stroke(52, 152, 219, 200);
      noFill();
      rect(cx-10, cy+42, 20, 40);
      fill(52, 152, 219, 150)
      rect(cx-10, cy+42, 20, 40*item.precipProbability);
      noStroke();
      fill(255);
      textSize(8);
      text(nf(item.precipProbability*100,0,1)+"\n%", cx, cy+62);
    }

  }

  noStroke();
}

function hourlyPre() {
  var x = width*0.1;
  var y = height*0.7;

  var hourData = new Array();
  
  if (weatherData.hourly) {
    var cHourly = weatherData.hourly.data;
    for (var i = 0; i < cHourly.length; i++) {
      var item = cHourly[i];
      append(hourData, {
        "time": item.time
      , "temperature": item.temperature
      , "precipIntensity": item.precipIntensity
      , "precipProbability": item.precipProbability
      , "windSpeed": item.windSpeed
      , "windBearing": item.windBearing 
      });
    }

    // Chart: temperature, rain, wind
    for (var i = 0; i < hourData.length; i++) {
      var item = hourData[i];
      var hour = timeFormatterSingleValue(item.time, HOUR);
      var tempNum = map(item.temperature, 0, 120, 0, height*0.13);
      var precipNum = map(item.precipIntensity, 0, 0.5, 0, height*0.13);
      var windSpeedNum = map(item.windSpeed, 0, 20, 0, height*0.13);
      var cx = width*0.1 + i * width*0.8/hourData.length;
      var cy = height*0.46;
      // temperature
      strokeWeight(5);
      stroke(255, 50);
      line(cx, y, cx, y-tempNum);
      // rain
      strokeWeight(5);
      stroke(52, 152, 219, 100);
      line(cx, y, cx, y - precipNum);
      // wind
      strokeWeight(2);
      stroke(0, 100);
      line(cx, y, cx, y - windSpeedNum);
      if (i % 5 == 0) {
        textAlign(LEFT, TOP);
        fill(255, 200);
        textSize(8);
        text(nf(hour,2), cx, y+5);
      }
    }
  }

  strokeWeight(1);
  noStroke();
}

function tempData(temp, min, max) {
  fill(255);
  var x = width*0.1;
  var y = height*0.515;
  if (temp != null) {
    textAlign(LEFT, CENTER);
    textSize(40);
    text(nf(temp,0,1) + "°F", x, y);
    textSize(12);
    textAlign(LEFT, TOP);
    if (min!=null && max!=null){
      triangle(x, y+25, x+10, y+25, x+5, y+33.5);
      text(nf(Math.min.apply(null, min),0,1), x+12, y+25);
      triangle(x+42, y+33.5, x+52, y+33.5, x+47, y+25);
      text(nf(Math.max.apply(null, max),0,1), x+55, y+25);
    }
  }
}

function detailsData(cWindSpeed, cHumidity, cVisibility) {
  var x = width*0.5;
  var y = height*0.49;
  fill(255);
  textAlign(LEFT, TOP);
  textSize(12);

  if (cWindSpeed != null) {
    text("WIND", x, y);
    text(cWindSpeed + " mph", x+80, y);
  }
  if (cHumidity != null) {
    text("HUMIDITY", x, y+20);
    text(cHumidity*100 + "%", x+80, y+20);
  }
  if (cVisibility != null) {
    text("VISIBILITY", x, y+40);
    text(cVisibility + " mi.", x+80, y+40);
  }
}

function drawIcon(iconVal) {
  noStroke();

  var x = width*0.5;
  var y = height*0.3;
  var xl = 210;
  var yl = 210;
  var radius = 200;

  switch(iconVal) {
    case "clear-day":
      fill(244, 208, 63);
      ellipse(x, y, radius, radius);
      break;
    case "clear-night":
      strokeWeight(5);
      stroke(107, 185, 240, 200);
      fill(244, 208, 63, 100);
      ellipse(x, y, radius, radius);
      noStroke();
      strokeWeight(1);
      break;
    case "rain":
      var lineWeight = 10;

      fill(255);
      for (var i = 0; i < 4; i++) {
        var gap = y/8*i;
        quad(x-xl/2, y-yl/2+gap
          , x+xl/10, y-yl/2+gap
          , x+xl/10, y-yl/2+gap+lineWeight
          , x-xl/2, y-yl/2+gap+lineWeight);
      }
      fill(244, 208, 63);
      ellipse(x, y, radius, radius);

      fill(255);
      for (var i = 0; i < 4; i++) {
        var gap = y/8*i;
        quad(x-xl/8, y-yl/2+gap
          , x+xl/2, y-yl/2+gap
          , x+xl/2, y-yl/2+gap+lineWeight
          , x-xl/8, y-yl/2+gap+lineWeight);
      }

      // blue lines
      fill(52, 152, 219);
      for (var i = 0; i < 9; i++) {
        var gap = x/8*i;
        if (i % 3 == 1) {
          quad(x-xl/2+gap, y
          , x-xl/2+gap+lineWeight, y
          , x-xl/2+gap+lineWeight, y+yl*0.4
          , x-xl/2+gap, y+yl*0.4);
        } else {
          quad(x-xl/2+gap, y
          , x-xl/2+gap+lineWeight, y
          , x-xl/2+gap+lineWeight, y+yl*0.3
          , x-xl/2+gap, y+yl*0.3);
        }
      }

      break;
    case "snow":
      var lineWeight = 10;

      fill(255);
      for (var i = 0; i < 4; i++) {
        var gap = y/8*i;
        quad(x-xl/2, y-yl/2+gap
          , x+xl/10, y-yl/2+gap
          , x+xl/10, y-yl/2+gap+lineWeight
          , x-xl/2, y-yl/2+gap+lineWeight);
      }
      fill(244, 208, 63);
      ellipse(x, y, radius, radius);

      fill(255);
      for (var i = 0; i < 4; i++) {
        var gap = y/8*i;
        quad(x-xl/8, y-yl/2+gap
          , x+xl/2, y-yl/2+gap
          , x+xl/2, y-yl/2+gap+lineWeight
          , x-xl/8, y-yl/2+gap+lineWeight);
      }

      for (var i = 0; i < 8; i++) {
        for (var j = 0; j < 8; j++) {
          rect(x/2+x/8*i, y-yl/2+y/8*j, lineWeight, lineWeight);
        }
      }
      break;
    case "sleet":
      var lineWeight = 10;

      fill(255);
      for (var i = 0; i < 4; i++) {
        var gap = y/8*i;
        quad(x-xl/2, y-yl/2+gap
          , x+xl/10, y-yl/2+gap
          , x+xl/10, y-yl/2+gap+lineWeight
          , x-xl/2, y-yl/2+gap+lineWeight);
      }
      fill(244, 208, 63);
      ellipse(x, y, radius, radius);

      fill(255);
      for (var i = 0; i < 4; i++) {
        var gap = y/8*i;
        quad(x-xl/8, y-yl/2+gap
          , x+xl/2, y-yl/2+gap
          , x+xl/2, y-yl/2+gap+lineWeight
          , x-xl/8, y-yl/2+gap+lineWeight);
      }

      for (var i = 0; i < 8; i++) {
        var gap = x/8*i;
        if (i % 2 == 0 && i != 0) {
          quad(x-xl/2+gap, y
          , x-xl/2+gap+lineWeight, y
          , x-xl/2+gap+lineWeight, y+yl*0.4
          , x-xl/2+gap, y+yl*0.4);
        } else {
          for (var j = 0; j < 4; j++) {
            if (i) rect(x-xl/2+x/8*i, y+y/8*j, lineWeight, lineWeight);
         }
        }
      }
      break;
    case "wind":
      var lineWeight = 10;

      fill(244, 208, 63);
      ellipse(x, y, radius, radius);

      fill(255);
      for (var i = 0; i < 3; i++) {
        var gap = y/6 + y/6*i;
        quad(x-xl/2, y-yl/2+gap
          , x, y-yl*0.4+gap
          , x, y-yl*0.4+gap+lineWeight
          , x-xl/2, y-yl/2+gap+lineWeight);
      }

      break;
    case "fog":
      fill(255, 200);
      rect(x-xl/2, y-yl/2, 30, 30);
      rect(x-xl/2+20, y-yl/2+20, 30, 30);
      rect(x, y-yl/2, 50, 50);
      fill(244, 208, 63);
      ellipse(x, y, radius, radius);
      fill(255,200);
      rect(x, y, 60, 60);
      rect(x-40, y-60, 80, 80);
      rect(x-80, y+30, 40, 40);

      break;
    case "cloudy":
      var lineWeight = 10;

      fill(255);
      for (var i = 0; i < 8; i++) {
        var gap = y/8*i;
        quad(x-xl/2, y-yl/2+gap
          , x+xl/10, y-yl/2+gap
          , x+xl/10, y-yl/2+gap+lineWeight
          , x-xl/2, y-yl/2+gap+lineWeight);
      }
      fill(244, 208, 63);
      ellipse(x, y, radius, radius);

      fill(255);
      for (var i = 0; i < 8; i++) {
        var gap = y/8*i;
        quad(x-xl/10, y-yl/2+gap
          , x+xl/2, y-yl/2+gap
          , x+xl/2, y-yl/2+gap+lineWeight
          , x-xl/10, y-yl/2+gap+lineWeight);
      }
      break;
    case "partly-cloudy-day":
      var lineWeight = 10;

      fill(255);
      for (var i = 0; i < 4; i++) {
        var gap = y/8*i;
        quad(x-xl/2, y-yl/2+gap
          , x+xl/10, y-yl/2+gap
          , x+xl/10, y-yl/2+gap+lineWeight
          , x-xl/2, y-yl/2+gap+lineWeight);
      }
      fill(244, 208, 63);
      ellipse(x, y, radius, radius);

      fill(255);
      for (var i = 0; i < 4; i++) {
        var gap = y/8*i;
        quad(x-xl/10, y+gap
          , x+xl/2, y+gap
          , x+xl/2, y+gap+lineWeight
          , x-xl/10, y+gap+lineWeight);
      }
      break;
    case "partly-cloudy-night":
      var lineWeight = 10;

      fill(255);
      for (var i = 0; i < 4; i++) {
        var gap = y/8*i;
        quad(x-xl/2, y-yl/2+gap
          , x+xl/10, y-yl/2+gap
          , x+xl/10, y-yl/2+gap+lineWeight
          , x-xl/2, y-yl/2+gap+lineWeight);
      }

      strokeWeight(5);
      stroke(107, 185, 240, 200);
      fill(244, 208, 63, 100);
      ellipse(x, y, radius, radius);
      noStroke();
      strokeWeight(1);

      fill(255);
      for (var i = 0; i < 4; i++) {
        var gap = y/8*i;
        quad(x-xl/10, y+gap
          , x+xl/2, y+gap
          , x+xl/2, y+gap+lineWeight
          , x-xl/10, y+gap+lineWeight);
      }
      break;
    default:
      fill(244, 208, 63);
      ellipse(x, y, radius, radius);
  }

}