var weatherData = {};

var CURRENTLY = "currently";
var MINUTELY = "minutely";
var HOURLY = "hourly";
var DAILY = "daily";

var DEFAULT = "utc";
var HOUR = "hour";
var MINUTE = "minute";
var SECOND = "second";
var YEAR = "year";
var MONTH = "month";
var DAY = "dayOfWeek";
var DATE = "dayOfMonth";
var STRING = "string";

function requestWeather(apiKey, lat, lon) {
  if (apiKey == null) {
    console.log("Enter an api key for current forecast.");
    loadJSON("data/forecast.json", loadCallback);
  } else {
    lat = lat || 42.359050; // MIT Student Center
    lon = lon || -71.094775;
    loadJSON("https://api.forecast.io/forecast/" + apiKey + "/" + lat + "," + lon, 
      loadCallback, "jsonp");
  }
}

function loadCallback(data) {
  weatherData = data;
}

function latitude() {
  return weatherData.latitude;
}

function longitude() {
  return weatherData.longitude;
}

function time(when, how) {
  when = when || CURRENTLY;
  how = how || STRING;

  var time = valueGetter(when, "time");
  return timeFormatter(time, how);
}

function summary(when) {
  when = when || CURRENTLY;
  return valueGetter(when, "summary");
}

function icon(when) {
  when = when || CURRENTLY;
  return valueGetter(when, "icon");
}

function sunriseTime(when, how) {
  when = when || DAILY;
  how = how || STRING;
  if (when != DAILY) {
    throw TypeError("The sunriseTime value is only defined \"daily\".");
  }
  var time = valueGetter(when, "sunriseTime");
  return timeFormatter(time, how);
} 

function sunsetTime(when, how) {
  when = when || DAILY;
  how = how || STRING;
  if (when != DAILY) {
    throw TypeError("The sunsetTime value is only defined \"daily\".");
  }
  var time = valueGetter(when, "sunsetTime");
  return timeFormatter(time, how);
} 

function moonPhase(when) {
  when = when || DAILY;
  if (when != DAILY) {
    throw TypeError("The moonPhase value is only defined \"daily\".");
  }
  return valueGetter(DAILY, "moonPhase");
}

function nearestStormDistance(when) {
  when = when || CURRENTLY;
  if (when != CURRENTLY) {
    throw TypeError("The nearestStormDistance value is only defined \"currently\".");
  }
  return valueGetter(CURRENTLY, "nearestStormDistance");
}

function nearestStormBearing(when) {
  when = when || CURRENTLY;
  if (when != CURRENTLY) {
    throw TypeError("The nearestStormBearing value is only defined \"currently\".");
  }
  return valueGetter(CURRENTLY, "nearestStormBearing");
}

function precipIntensity(when) {
  when = when || CURRENTLY;
  return valueGetter(when, "precipIntensity");
}

function precipProbability(when) {
  when = when || CURRENTLY;
  return valueGetter(when, "precipProbability");
}

function precipType(when) {
  when = when || CURRENTLY;
  return valueGetter(when, "precipType");
}

function precipAccumulation(when) {
  when = when || DAILY;
  if (when != DAILY && when != HOURLY) {
    throw TypeError("The precipAccumulation value is only defined \"daily\" and \"hourly\".");
  }
  return valueGetter(when, "precipAccumulation");
}

function temperature(when) {
  when = when || CURRENTLY;
  if (when == DAILY) {
    throw TypeError("The temperature value is not defined \"daily\".");
  }
  return valueGetter(when, "temperature");
}

function temperatureMin(when) {
  when = when || DAILY;
  if (when != DAILY) {
    throw TypeError("The temperatureMin value is only defined \"daily\".");
  }
  return valueGetter(DAILY, "temperatureMin");
}

function temperatureMinTime(when, how) {
  when = when || DAILY;
  how = how || STRING;
  if (when != DAILY) {
    throw TypeError("The temperatureMinTime value is only defined \"daily\".");
  }
  var time = valueGetter(when, "temperatureMinTime");
  return timeFormatter(time, how);
} 

function temperatureMax(when) {
  when = when || DAILY;
  if (when != DAILY) {
    throw TypeError("The temperatureMax value is only defined \"daily\".");
  }
  return valueGetter(DAILY, "temperatureMax");
}

function temperatureMaxTime(when, how) {
  when = when || DAILY;
  how = how || STRING;
  if (when != DAILY) {
    throw TypeError("The temperatureMaxTime value is only defined \"daily\".");
  }
  var time = valueGetter(when, "temperatureMaxTime");
  return timeFormatter(time, how);
} 

function apparentTemperature(when) {
  when = when || CURRENTLY;
  if (when == DAILY) {
    throw TypeError("The apparentTemperature value is not defined \"daily\".");
  }
  return valueGetter(when, "apparentTemperature");
}

function apparentTemperatureMin(when) {
  when = when || DAILY;
  if (when != DAILY) {
    throw TypeError("The apparentTemperatureMin value is only defined \"daily\".");
  }
  return valueGetter(DAILY, "apparentTemperatureMin");
}

function apparentTemperatureMinTime(when, how) {
  when = when || DAILY;
  how = how || STRING;
  if (when != DAILY) {
    throw TypeError("The apparentTemperatureMinTime value is only defined \"daily\".");
  }
  var time = valueGetter(when, "apparentTemperatureMinTime");
  return timeFormatter(time, how);
} 

function apparentTemperatureMax(when) {
  when = when || DAILY;
  if (when != DAILY) {
    throw TypeError("The apparentTemperatureMax value is only defined \"daily\".");
  }
  return valueGetter(DAILY, "apparentTemperatureMax");
}

function apparentTemperatureMaxTime(when, how) {
  when = when || DAILY;
  how = how || STRING;
  if (when != DAILY) {
    throw TypeError("The apparentTemperatureMaxTime value is only defined \"daily\".");
  }
  var time = valueGetter(when, "apparentTemperatureMaxTime");
  return timeFormatter(time, how);
} 

function dewPoint(when) {
  when = when || CURRENTLY;
  return valueGetter(when, "dewPoint");
}

function windSpeed(when) {
  when = when || CURRENTLY;
  return valueGetter(when, "windSpeed");
}

function windBearing(when) {
  when = when || CURRENTLY;
  return valueGetter(when, "windBearing");
}

function cloudCover(when) {
  when = when || CURRENTLY;
  return valueGetter(when, "cloudCover");
}

function humidity(when) {
  when = when || CURRENTLY;
  return valueGetter(when, "humidity");
}

function pressure(when) {
  when = when || CURRENTLY;
  return valueGetter(when, "pressure");
}

function visibility(when) {
  when = when || CURRENTLY;
  return valueGetter(when, "visibility");
}

function ozone(when) {
  when = when || CURRENTLY;
  return valueGetter(when, "ozone");
}

function valueGetter(when, what) {
  if (weatherData[when]) {
    if (when == CURRENTLY) {
      return weatherData[when][what];
    } else {
      if (weatherData[when].data) {
        valueArray = [];
        for (var idx in weatherData[when].data) {
          valueArray[idx] = weatherData[when].data[idx][what];
        }
        return valueArray;
      }
    }
  }
  return null;
}

function timeFormatter(time, how) {
  if (time) {
    if (how == DEFAULT) {
      return time;
    }

    if (Array.isArray(time)) {
      time.forEach(function(value, index, array) {
        time[index] = timeFormatterSingleValue(value, how);
      });
    } else {
      time = timeFormatterSingleValue(time, how);
    }
  }

  return time;
}

function timeFormatterSingleValue(value, how) {
  if (value) {
    if (how == HOUR) {
      return new Date(value*1000).getHours();
    }
    if (how == MINUTE) {
      return new Date(value*1000).getMinutes();
    }
    if (how == SECOND) {
      return new Date(value*1000).getSeconds();
    }
    if (how == DATE) {
       return new Date(value*1000).getDate(); 
    }
    if (how == DAY) {
      return new Date(value*1000).getDay();
    }
    if (how == MONTH) {
      return new Date(value*1000).getMonth();
    }
    if (how == YEAR) {
      return new Date(value*1000).getFullYear();
    }
    if (how == STRING) {
      return new Date(value*1000).toLocaleString();
    }
  }
  return value;
}