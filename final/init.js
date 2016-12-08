function initYears() {
  years = data.getColumn("year");
  kingsImg = preProcessKings();

  for (var i = 0; i < years.length; i++) {
    if (yearIndex[years[i]]) {
      yearIndex[years[i]]++;
    } else {
      if (i === 0) {
        yearIndex[years[i]] = 1;
      } else {
        yearIndex[years[i]] = parseInt(yearIndex[years[i - 1]]) + 1;
      }
    }
  }
}

function initSlider(myWidth, left, top, playWidth) {
  sliderSize = {width: myWidth
          , left: left
          , top: top
          , play: {
              width: playWidth
            }
          };
  sliderSize.right = sliderSize.left + sliderSize.width;
  sliderSize.bottom = sliderSize.top + sliderSize.play.width*2;
  sliderSize.play.centerX = sliderSize.left - sliderSize.play.width;
  sliderSize.play.centerY = (sliderSize.top + sliderSize.bottom)/2;
  // sliderSize.play.centerY = sliderSize.top;
  sliderSize.play.left = sliderSize.play.centerX - sliderSize.play.width;
  sliderSize.play.right = sliderSize.play.centerX + sliderSize.play.width;
  sliderSize.play.top = sliderSize.play.centerY - sliderSize.play.width;
  sliderSize.play.bottom = sliderSize.play.centerY + sliderSize.play.width;
}
