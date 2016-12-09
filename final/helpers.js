// helpers


function preProcessKings() {
  var kings = data.getColumn("attacker_king").concat(data.getColumn("defender_king"));
  var kingsHash = {};
  kings.forEach(function(k) {
    if (!kingsHash[k] && k) {
      // kingsHash[k] = null;
      var path;
      if (k == "Balon/Euron Greyjoy") {
        path = "img/people/BalonGreyjoy.jpg";
      } else if (k == "Joffrey/Tommen Baratheon") {
        path = "img/people/JoffreyBaratheon.jpg";
      } else {
        path = "img/people/" + k.replace(/ /g,"") +".jpg";
      }
      kingsHash[k] = loadImage(path);
    }
  });
  return kingsHash;
}
// TODO: should have more elegent way :(
// process time to be dot's position in the time slider/bar
function preProcessTimeBar() {
  var myYears = {};
  var temp = [];
  var out = [];

  for (var i = 0; i < years.length; i++) {
    if (myYears[years[i]]) {
      myYears[years[i]] += 1;
    } else {
      myYears[years[i]] = 1;
    }
  }

  for (var y in myYears) {
    for (var i = 0; i < myYears[y]; i++) {
      temp.push(parseInt(y) + i/myYears[y]);
    }
  }

  for (i = 0; i < temp.length; i++) {
    x = map(temp[i], min(temp), max(temp), sliderSize.left, sliderSize.right);
    out.push(round(x));
  }

  return out;
}

function initHousePosition() {
  houseList.forEach(function(entry, i){
    if (entry.getIsGreat()) {
      if (i % 2) {
        x = circleCenterX - width*0.35;
        y = height*0.12 + height*0.8/5 * i / 2;
      } else {
        x = circleCenterX + width*0.35;
        y = height*0.12 + height*0.8/5 * i / 2;
      }
      // entry.setPositon(width / 2 + (i - 4) * width/10, height / 2);
    } else {
      if (i % 2) {
        x = circleCenterX - width*0.4;
        y = height*0.15 + height*0.75/8 * (i-9) / 2;
      } else {
        x = circleCenterX + width*0.4;
        y = height*0.15 + height*0.75/8 * (i-9) / 2;
      }
    }
    entry.setPositon(x, y);
  });
}

function updateHousePosition() {
  houseList.forEach(function(house, i){
    house.updatePostion();
  });
}

function moveHousePositionToInit() {
  var x, y;
  houseList.forEach(function(entry, i){
    if (entry.getIsGreat()) {
      if (i % 2) {
        x = circleCenterX - width*0.35;
        y = height*0.15 + height*0.8/5 * i / 2;
      } else {
        x = circleCenterX + width*0.35;
        y = height*0.15 + height*0.8/5 * i / 2;
      }
      // entry.setPositon(width / 2 + (i - 4) * width/10, height / 2);
    } else {
      if (i % 2) {
        x = circleCenterX - width*0.4;
        y = height*0.2 + height*0.8/8 * (i-9) / 2;
      } else {
        x = circleCenterX + width*0.4;
        y = height*0.2 + height*0.8/8 * (i-9) / 2;
      }
      // entry.movetoPosition(circleCenterX + circleR*1.5 * sin(TAU / (24 - 9) * i)
      //   , circleCenterY + circleR*1.4 * cos(TAU / (24 - 9) * i));
    }
    entry.movetoPosition(x, y);
  });
}

function moveToBattlefield() {
  moveHousePositionToInit();
  var left = circleCenterX - shieldWidth/8*3 + 20;
  var right = circleCenterX + shieldWidth/8*3 - 20;
  var top = height*0.2;
  var myHeight = height*0.6;

  var housesInBattle = getHousesInBattle(time);
  var attackers = housesInBattle["attackers"];
  var defenders = housesInBattle["defenders"];

  attackers.forEach(function(name, i) {
    var att = findItemByValue(houseList, "name", name);
    // att.movetoPosition(circleCenterX + circleR/5 * sin(TAU / attackers.length * i)
    //     , circleCenterY + circleR/5 * cos(TAU / attackers.length * i));
    att.movetoPosition(left + (i%2) * shieldWidth/8 , top + myHeight / (attackers.length + 1) * (i+1) - 20);
  });

  defenders.forEach(function(name, i) {
    var def = findItemByValue(houseList, "name", name);
    def.movetoPosition(right - (i%2) * shieldWidth/8, top + myHeight / (defenders.length + 1) * (i+1) - 20);
  });
}

function initMatrix() {
  matrix = [];
  for (var i in houses) {
    matrix.push(0);
    matrix[houses[i].index] = [];
    for (var j in houses) {
      matrix[houses[i].index].push(0);
      matrix[houses[i].index][houses[j].index] = {enemy: 0, ally: 0};
    }
  }
}

// update "matrix"
function updateMatrix() {
  initMatrix();
  for (var t = 0; t < time; t++) {
    var housesInBattle = getHousesInBattle(t);
    var attackers = housesInBattle["attackers"];
    var defenders = housesInBattle["defenders"];
console.log(attackers);
    // ally
    for (var i = 0; i < attackers.length; i++) {
      for (var j = i + 1; j < attackers.length; j++) {
        var h1 = houses[attackers[i]]["index"];
        var h2 = houses[attackers[j]]["index"];
        console.log(h1, h2);
        matrix[h1][h2]["ally"] += 1;
      }
    }

    // for (var i = 0; i < defenders.length; i++) {
    //   for (var j = i + 1; j < defenders.length; j++) {
    //     var h1 = houses[defenders[i]]["index"];
    //     var h2 = houses[defenders[j]]["index"];
    //     matrix[h1][h2]["ally"] += 1;
    //   }
    // }

    // enemy
    for (var i = 0; i < attackers.length; i++) {
      for (var j = 0; j < defenders.length; j++) {
        var att = houses[attackers[i]]["index"];
        var def = houses[defenders[j]]["index"];
        matrix[att][def]["enemy"] += 1;
      }
    }
  }

}

// fill "involved" field of each House instance
function fillInvoloved(index) {
  houseList.forEach(function(house) {
    house.setInvolved(0);
  });

  for (var i = 0; i <= index; i++) {
    var housesInBattle = getHousesInBattle(i);
    var attackers = housesInBattle["attackers"];
    var defenders = housesInBattle["defenders"];
    for (var j = 0; j < attackers.length; j++) {
      var house = findItemByValue(houseList, "name", attackers[j]);
      if (house["involved"]) {
        house["involved"] += 1;
      } else {
        house["involved"] = 1;
      }
    }
    for (var j = 0; j < defenders.length; j++) {
      var house = findItemByValue(houseList, "name", defenders[j]);
      if (house["involved"]) {
        house["involved"] += 1;
      } else {
        house["involved"] = 1;
      }
    }
  }
}

function fillCurrentInBattle(i) {
  houseList.forEach(function(house) {
    house.setCurrentInBattle(0);
  });

  var housesInBattle = getHousesInBattle(i);
  var attackers = housesInBattle["attackers"];
  var defenders = housesInBattle["defenders"];
  for (var j = 0; j < attackers.length; j++) {
    var house = findItemByValue(houseList, "name", attackers[j]);
    house.setCurrentInBattle(1);
  }
  for (var j = 0; j < defenders.length; j++) {
    var house = findItemByValue(houseList, "name", defenders[j]);
    house.setCurrentInBattle(-1);
  }
}
// retrieve attackers and defenders
function getHousesInBattle(index) {
  var attackers = [];
  var defenders = [];
  for (var i = 5; i < 9; i++) {
    var houseName = data.getString(index, i);
    if (houseName) attackers.push(houseName);
  }
  for (var i = 9; i < 13; i++) {
    var houseName = data.getString(index, i);
    if (houseName) defenders.push(houseName);
  }
  return {"attackers": attackers
          ,"defenders": defenders}
}


// TODO: change this stupid search...
function findItemByValue(json, col, value) {
  return json.filter(
        function(json){ return json[col] == value }
    )[0];
}

// helper: print matrix - 2d array
function myPrintMatrix(a) {
  for (var i = 0; i < a.length; i++) {
    var row = "";
    for (var j = 0; j < a[0].length; j++) {
      row += a[i][j]["enemy"] + ", ";
    }
    console.log(row);
  }
}

function HEXtoRGB(hex) {
    var bigint = parseInt(hex.replace("#",""), 16);
    var r = (bigint >> 16) & 255;
    var g = (bigint >> 8) & 255;
    var b = bigint & 255;
    return {
      "r": r,
      "g": g,
      "b": b
    };
}
