// create a "Box" class
function Box(title, w, h, left, top, feature, expand) {
  this.title = title;
  // dimension and position
  this.width = w;
  this.height = h;
  this.left = left;
  this.top = top;
  this.right = this.left + this.width;
  this.bottom = this.top + this.height;
  // other data
  this.feature = feature;
  this.expand = (expand) ? expand : 4;
  this.clickable = (expand !== -1) ? 1 : 0;
  this.open = 0;
}
