// helpers
function initHousePosition() {
  houseList.forEach(function(entry, i){
    if (entry.getIsGreat()) {
      // entry.setPositon(width / 2 + (i - 4) * width/10, height / 2);
      entry.setPositon(circleCenterX + circleR * sin(TAU / 9 * i)
        , circleCenterY + circleR * cos(TAU / 9 * i));
    } else {
      entry.setPositon(circleCenterX + circleR*1.5 * sin(TAU / (24 - 9) * i)
        , circleCenterY + circleR*1.4 * cos(TAU / (24 - 9) * i));
    }
  });
}

function moveToBattlefield() {
  initHousePosition();

  this.myHeight = height*0.8;
  var housesInBattle = getHousesInBattle(time);
  var attackers = housesInBattle["attackers"];
  var defenders = housesInBattle["defenders"];

  attackers.forEach(function(name, i) {
    var att = findItemByValue(houseList, "name", name);
    att.setPositon(circleCenterX + circleR/5 * sin(TAU / attackers.length * i)
        , circleCenterY + circleR/5 * cos(TAU / attackers.length * i));
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

function myPrintMatrix(a) {
  for (var i = 0; i < a.length; i++) {
    var row = "";
    for (var j = 0; j < a[0].length; j++) {
      row += a[i][j]["enemy"] + ", ";
    }
    console.log(row);
  }
}

function updateMatrix() {
  initMatrix();

  for (var t = 0; t <= time; t++) {
    var housesInBattle = getHousesInBattle(t);
    var attackers = housesInBattle["attackers"];
    var defenders = housesInBattle["defenders"];

    // ally
    for (var i = 0; i < attackers.length; i++) {
      for (var j = i + 1; j < attackers.length; j++) {
        var h1 = houses[attackers[i]]["index"];
        var h2 = houses[attackers[j]]["index"];
        matrix[h1][h2]["ally"] += 1;
      }
    }

    for (var i = 0; i < defenders.length; i++) {
      for (var j = i + 1; j < defenders.length; j++) {
        var h1 = houses[defenders[i]]["index"];
        var h2 = houses[defenders[j]]["index"];
        matrix[h1][h2]["ally"] += 1;
      }
    }

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

// function updateIconPosition() {
//   houseList.forEach(function(house, i) {
//     house.setPositon(width * (i+1) / 34, height * 0.9);
//   });
//
//   this.myHeight = height*0.8;
//   var housesInBattle = getHousesInBattle(time);
//   var attackers = housesInBattle["attackers"];
//   var defenders = housesInBattle["defenders"];
//
//   attackers.forEach(function(name, i) {
//     findItemByValue(houseList, "name", name)
//       .setPositon(width*0.25
//         , (height-this.myHeight)/2 + this.myHeight/(attackers.length + 1)*(i+1));
//   });
//
//   defenders.forEach(function(name, i) {
//     findItemByValue(houseList, "name", name)
//       .setPositon(width*0.75
//         , (height-this.myHeight)/2 + this.myHeight/(defenders.length + 1)*(i+1));
//   });
// }

// TODO: change this stupid search...
function findItemByValue(json, col, value) {
  return json.filter(
        function(json){ return json[col] == value }
    )[0];
}

function fillInvoloved(index) {

  houseList.forEach(function(house) {
    house.setInvolved(0);
  });

  for (var i = 0; i <= index; i++) {
    var housesInBattle = getHousesInBattle(i);
    var attackers = housesInBattle["attackers"];
    var defenders = housesInBattle["defenders"];
    for (var j = 0; j < attackers.length; j++) {
      if (findItemByValue(houseList, "name", attackers[j])["involved"]) {
        findItemByValue(houseList, "name", attackers[j])["involved"] += 1;
      } else {
        findItemByValue(houseList, "name", attackers[j])["involved"] = 1;
      }
    }
    for (var j = 0; j < defenders.length; j++) {
      if (findItemByValue(houseList, "name", defenders[j])["involved"]) {
        findItemByValue(houseList, "name", defenders[j])["involved"] += 1;
      } else {
        findItemByValue(houseList, "name", defenders[j])["involved"] = 1;
      }
    }
  }
}

// function updateHousesInBattle(index) {
//   houseList.forEach(function(house) {
//     house.setCurrentInBattle(0);
//   });
//
//   var attackers = [];
//   var defenders = [];
//   for (var i = 5; i < 9; i++) {
//     var houseName = data.getString(index, i);
//     if (houseName) {
//       var house = findItemByValue(houseList, 'name', houseName);
//       house.setCurrentInBattle(1);
//     }
//   }
//   for (var i = 9; i < 13; i++) {
//     var houseName = data.getString(index, i);
//     if (houseName) {
//       var house = findItemByValue(houseList, 'name', houseName);
//       house.setCurrentInBattle(-1);
//     }
//   }
// }

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
