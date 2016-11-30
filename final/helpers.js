// helpers

// TODO: change this stupid search...
function findItemByValue(json, col, value) {
  return json.filter(
        function(json){ return json[col] == value }
    )[0];
}

function fillInvoloved(index) {
  houseList.forEach(function(entry) {
    entry.setInvolved(0);
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
