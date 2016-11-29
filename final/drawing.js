// This file contains all functions drawing components

// called by "drawBox"
function drawHoverBox(content, w, h, x, y) {
  this.width = w;
  this.height = h/2;
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
  textAlign(CENTER);
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
  for (var i = 0; i < houses.length; i++) {
    // if (houses[i]["great"] || houses[i]["involved"]) {
    //   console.log(i);
    //   fill(100 + houses[i]["involved"]/34 * 400);
    // }
    textAlign(CENTER, CENTER);
    if (houses[i]["img"]) {
      if (houses[i]["great"]||houses[i]["involved"]) {
        fill(100 + houses[i]["involved"]/34 * 400);
        // ellipse(houses[i]['x'], houses[i]['y'], 80);
        image(houses[i]["img"], houses[i]['x']-40, houses[i]['y']-40, 80, 80);
        // fill(255);
        text(houses[i]['name'], houses[i]['x'], houses[i]['y']+40);
      }
    } else {
      noFill();
      if (houses[i]["involved"]) {
        stroke(100 + houses[i]["involved"]/34 * 400);
      }
      ellipse(houses[i]['x'], houses[i]['y'], 40);
      if (houses[i]["involved"]) {
        fill(100 + houses[i]["involved"]/34 * 400);
      }
      textSize(10);
      noStroke();
      text(houses[i]['name'], houses[i]['x'], houses[i]['y']);
    }
  }

  // identify who's involved in the battle
  var housesInBattle = getHousesInBattle(index);
  var attackers = housesInBattle["attackers"];
  var defenders = housesInBattle["defenders"];

  // draw arrows
  stroke(255);
  strokeWeight(2);
  for (var i = 0; i < attackers.length; i++) {
      for (var j = 0; j < defenders.length; j++) {
        var att = findItemByValue(houses, 'name', attackers[i]);
        var def = findItemByValue(houses, 'name', defenders[j]);
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
        for (var i = 0; i < houses.length; i++) {
          if (houses[i]["involved"]) info += houses[i]["name"] + ": " + houses[i]["involved"] + "\n";
        }
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
