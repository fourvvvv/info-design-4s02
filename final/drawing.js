// This file contains all functions drawing components

// called by "drawBox"
function drawHoverBox(content, w, h, x, y) {
  this.myWidth = 200;
  this.myHeight = 20;
  this.x = x + this.myWidth/2;
  this.y = y + this.myHeight/2;
  fill(0, 50);
  rect(x, y, this.myWidth, this.myHeight);
  textAlign(CENTER, CENTER);
  // textSize(20);
  fill(255);
  text(content, this.x, this.y);
}

function drawTitle() {
  textAlign(LEFT, CENTER);
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
    if (house.getIsGreat() || house["involved"]) {
      // if (house["involved"]) stroke(100 + house["involved"]/34 * 400);
      fill((house["involved"]) ? 150 + house["involved"]/34 * 100 : 150);
      if (house["img"]) {
        image(house["img"], house['x']-20-20*house.getIsGreat(), house['y']-20-20*house.getIsGreat(), 40 + 40*house.getIsGreat(), 40 + 40*house.getIsGreat());
      }
      // ellipse(house['x'], house['y'], 40);
      text(house['name'], house['x'], house['y']+30+20*house.getIsGreat());
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
  fill(255, 20);
  strokeWeight(.7);
  stroke(255, 50);
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

function drawText() {
  textAlign(LEFT, TOP);
  fill(255, 150);
  textSize(12);
  text("Untorem dolut que et ratiant isimaio nsecab\n" +
        "ceptu restia conet ab im fugitis ut auta s\n" +
        "renda dolum quia ventia provid mo- luptati\n" +
        "odici endestior mo et pero blabori o ctis \n" +
        "eum audae imoloris con restia delicid\n" +
        "ceptu restia conet ab im fugitis ut auta s\n" +
        "renda dolum quia ventia provid mo- luptati\n" +
        "odici endestior mo et pero blabori o ctis \n" +
        "eum audae imoloris con restia delicid\n" +
        "quam as dolendi berum nihitatum"
    , width*0.03
    , height*0.34);
}
