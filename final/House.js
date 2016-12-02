// create a "House" class
function House(name, isGreat) {
  this.name = name;
  this.isGreat = isGreat;
}

House.prototype.setImage = function(img) {
  this.img = img;
}

House.prototype.setPositon = function(x, y) {
  this.x = x;
  this.y = y;
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

House.prototype.moveto = function(x, y){
  this.targetX = x;
  this.targetY = y;
}

House.prototype.update = function(){
  // var dx = this.targetX - this.x;
  // if (dx) {
  //   this.x += dx * 0.05;
  //   if (Math.abs(dx) < 0.5) {
  //       this.x = this.targetX;
  //   }
  // }
}
