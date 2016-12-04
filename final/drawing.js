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
  push();
  textAlign(LEFT, CENTER);
  textSize(20);
  fill(255);
  textFont(fontGOT);
  text("GAME  OF  THRONES  BATTLES", titleX, titleY);
  pop();
}

function drawTimeSlider() {
  var grayColor = color(200);
  push();
  translate(sliderSize.play.centerX, sliderSize.play.centerY);
  noFill();
  stroke(grayColor);
  ellipse(0, 0, sliderSize.play.width, sliderSize.play.width);
  noStroke();
  fill(grayColor);
  if (animating) {
    // pause icon
    rect(-4, -5, 3, 10);
    rect(1, -5, 3, 10);
  } else {
    // play icon
    triangle(-3, -5, 5, 0, -3, 6);
  }
  pop();

  // play bar
  stroke(grayColor);
  line(sliderSize.left, (sliderSize.top + sliderSize.bottom) / 2, sliderSize.right, (sliderSize.top + sliderSize.bottom) / 2);
  for (i = 0; i < TimeBarXs.length; i++) {
    if (i == time) {
      fill(241, 188, 48);
      noStroke();
      ellipse(TimeBarXs[i], (sliderSize.top + sliderSize.bottom) / 2, 8, 8);
    } else if (i == timeMouseOver) {
      stroke(0, 50);
      fill(255);
      // strokeWeight(3);
      ellipse(TimeBarXs[i], (sliderSize.top + sliderSize.bottom) / 2, 6, 6);
    } else {
      fill(grayColor);
      stroke(grayColor);
      strokeWeight(1);
      ellipse(TimeBarXs[i], (sliderSize.top + sliderSize.bottom) / 2, 3, 3);
    }
  }

  // current time label
  fill(255, 200);
  noStroke();
  text("#" + (time+1) + " "+ data.getColumn("name")[time], sliderSize.left, sliderSize.top - 8);

  // year label
  var temp;
  for (var i = 0; i < years.length; i++) {
    if (temp !== years[i]) {
      temp = years[i];
      stroke(255, 100);
      line(TimeBarXs[i], (sliderSize.top + sliderSize.bottom) / 2, TimeBarXs[i], sliderSize.bottom - sliderSize.play.width/3);
      noStroke();
      if (temp == years[time]) {
        fill(241, 188, 48);
      } else {
        fill(grayColor);
      }
      text(temp, TimeBarXs[i], sliderSize.bottom);
    }
  }
  // scrubber
  // var x = map(yrIdx, 0, years.length-1, timelineX, timelineX + timelineW);
  // ellipse(x, timelineY, 10, 10);
  // noStroke();
  // textAlign(CENTER, TOP);
  // textFont(adelleRegular);
  // textSize(littleFontSize);
  // text(years[0], timelineX, timelineY + 10);
  // var xmid = map(ceil((years.length - 1)/2), 0, years.length - 1,
  //   timelineX, timelineX + timelineW);
  // text(years[ceil((years.length - 1)/2)], xmid, timelineY + 10);
  // text(years[years.length - 1], timelineX + timelineW, timelineY + 10);
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

  // draw battlefield
  fill(157, 121, 90, 50);
  ellipse(circleCenterX, circleCenterY, circleR*1.2, circleR*1.2);
  noFill();
  stroke(255, 50);
  ellipse(circleCenterX, circleCenterY, circleR*1.2, circleR*1.2);
  noStroke();
  fill(255, 20);
  textFont("Impact");
  textSize(50);
  textAlign(CENTER, CENTER);
  text("BATTLEFIELD", circleCenterX, circleCenterY);
  textFont("Georgia");
  // identify who's involved in the battle
  var housesInBattle = getHousesInBattle(index);
  var attackers = housesInBattle["attackers"];
  var defenders = housesInBattle["defenders"];

  // only display names of houses in the current battle

  // draw all houses
  houseList.forEach(function(house, i) {
    textAlign(CENTER, CENTER);
    if (house.getIsGreat() || house["involved"]) {
      // if (house["involved"]) stroke(100 + house["involved"]/34 * 400);
      fill((house["involved"]) ? 150 + house["involved"]/34 * 100 : 150);
      if (house["img"]) {
        image(house["img"], house['x']-20-20*house.getIsGreat(), house['y']-20-20*house.getIsGreat(), 40 + 40*house.getIsGreat(), 40 + 40*house.getIsGreat());
      }

      if (house.getCurrentInBattle() === 1) {
        fill(253, 201, 68);
        textSize(15);
        text(house['name'], house['x'], house['y']+30+20*house.getIsGreat());
      } else if (house.getCurrentInBattle() === -1) {
        fill(255);
        textSize(15);
        text(house['name'], house['x'], house['y']+30+20*house.getIsGreat());
      } else {
        textSize(10);
        fill(255, 100);
        text(house['name'], house['x'], house['y']+30+20*house.getIsGreat());

        fill(51, 150);
        rect(house['x']-20-20*house.getIsGreat(), house['y']-20-20*house.getIsGreat(), 40 + 40*house.getIsGreat(), 40 + 40*house.getIsGreat());
      }
      // ellipse(house['x'], house['y'], 40);
    }
  });

  // draw line (and arrows)
  stroke(255);
  strokeWeight(2);
  for (var i = 0; i < attackers.length; i++) {
    for (var j = 0; j < defenders.length; j++) {
      noFill();
      var att = findItemByValue(houseList, 'name', attackers[i]);
      var def = findItemByValue(houseList, 'name', defenders[j]);
      // if (att && def) line(att['x'], att['y'], def['x'], def['y']);
      if (att && def) {
        var dx = def['x'] - att['x'];
        var dy = def['y'] - att['y'];
        bezier(att['x'], att['y']
              , att['x'] + dx/10, att['y'] + dy/3
              , att['x'] + dx/3*2, att['y'] + dy/10*9
              , def['x'], def['y']);
        line(def['x'], def['y'], (dx > 0) ? def['x']-10 : def['x']+10, def['y']);
        line(def['x'], def['y'], def['x'], (dy > 0) ? def['y']-10 : def['y']+10);
      }
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
    var info = box.title + ": " + data.getColumn(box.feature[0])[time];
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
          info += data.getColumn(box.feature[i])[time] + "\n";
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
