// This file contains all functions drawing components

// called by "drawBox"
function drawHoverBox(content, w, h, x, y) {
  this.width = 200;
  this.height = 20;
  this.x = x + this.width/2;
  this.y = y + this.height/2;
  fill(0, 50);
  rect(x, y, this.width, this.height);
  textAlign(CENTER, CENTER);
  // textSize(20);
  fill(255);
  text(content, this.x, this.y);
}

function drawTitle() {
  textAlign(CENTER, CENTER);
  textSize(20);
  fill(255);
  text("Battles in Game of Thromes", titleX, titleY);
}

function drawTimeSlider() {
  // TODO: change style to flat
  // slider.style("background-color", "#ff0000");
}

function drawInfo(index) {
  textAlign(LEFT);
  textSize(15);
  var xKey = width/3*2;
  var xValue = width/9*7.5;
  var y = height/10*2;
  for (var i = 0; i < data.getColumnCount(); i++) {
    var key = data.columns[i];
    var value = data.getColumn(key)[index];
    text(key + ":", xKey, y + 20*i);
    text(value + "", xValue, y + 20*i);
  }
}

function drawCircle(index) {
  textSize(15);
  noStroke();
  // draw all houses
  houseList.forEach(function(house, i) {
    textAlign(CENTER, CENTER);
    if (house["img"]) {
      if (house["great"] || house["involved"]) {
        fill(100 + house["involved"]/34 * 400);
        image(house["img"], house['x']-40, house['y']-40, 80, 80);
        text(house['name'], house['x'], house['y']+40);
      }
    } else {
      noFill();
      if (house["involved"]) stroke(100 + houses[i]["involved"]/34 * 400);
      ellipse(house['x'], house['y'], 40);
      if (house["involved"]) fill(100 + house["involved"]/34 * 400);
      textSize(10);
      noStroke();
      text(house['name'], house['x'], house['y']);
    }
  });

  // identify who's involved in the battle
  var housesInBattle = getHousesInBattle(index);
  var attackers = housesInBattle["attackers"];
  var defenders = housesInBattle["defenders"];

  // draw line (and arrows)
  stroke(255);
  strokeWeight(2);
  for (var i = 0; i < attackers.length; i++) {
      for (var j = 0; j < defenders.length; j++) {
        var att = findItemByValue(houseList, 'name', attackers[i]);
        var def = findItemByValue(houseList, 'name', defenders[j]);
        if (att && def) line(att['x'], att['y'], def['x'], def['y']);
      }
  }
  noStroke();
  strokeWeight(1);
}

function drawBox(box) {
  fill(255, 50);
  strokeWeight(1);
  stroke(255);
  rect(box.left, box.top, box.width, box.height);
  textAlign(CENTER, TOP);
  fill(255);
  noStroke();
  // if the box is not clickable: always display info
  if (!box.clickable) {
    var info = box.title + ": " + data.getColumn(box.feature[0])[slider.value() - 1];
    text(info, box.left + box.width / 2, box.top + 5);
  } else {
    // if clickable: display title
    text(box.title, box.left + box.width / 2, box.top + 5);
    // if the box is open: display details
    if (box.open && box.feature) {
      textAlign(LEFT, TOP);
      // console.log(data.getColumn(box.feature));
      var info = "";
      if (box.feature[0] == "house") {
        houseList.forEach(function(house) {
          if (house.involved) info += house.name + ": " + house.involved + "\n";
        });
      } else {
        for (var i = 0; i < box.feature.length; i++) {
          info += data.getColumn(box.feature[i])[slider.value() - 1] + "\n";
        }
      }
      text(info, box.left+5, box.top+30);
    }
  }
  // hover: display details
  if (isInsideBox(box)) {
    drawHoverBox(box.title, box.width, box.height, mouseX, mouseY);
  }
}
