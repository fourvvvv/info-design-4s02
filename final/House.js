// create a "House" class
var houseMoveSpeed = 20;
function House(name, isGreat) {
  this.name = name;
  this.isGreat = isGreat;
}

House.prototype.setImage = function(img) {
  this.img = img;
}

House.prototype.setPositon = function(x, y) {
  this.x = round(x);
  this.y = round(y);
  this.targetX = this.x;
  this.targetY = this.y;
}

House.prototype.setInvolved = function(i) {
  this.involved = i;
}

House.prototype.setCurrentInBattle = function(side) {
  // side = 1 -> attacker, -1 -> defender
  this.currentInBattle = side;
}

House.prototype.getCurrentInBattle = function(side) {
  return this.currentInBattle;
}

House.prototype.getIsGreat = function() {
  return this.isGreat;
}

// House.prototype.getBox = function(width){
//   this.left = this.x - width;
//   this.right = this.x + width;
//   this.top = this.y - width;
//   this.bottom = this.y + width;
// }

House.prototype.movetoPosition = function(x, y){
  this.targetX = x;
  this.targetY = y;
}

var easing = 0.05;

House.prototype.updatePostion = function(){
  // this.setPositon(targetX, targetY);
  // console.log(this.name, targetX, this.x);
  dx = this.targetX - this.x;
  this.x += dx * easing;

  dy = this.targetY - this.y;
  this.y += dy * easing;
}
