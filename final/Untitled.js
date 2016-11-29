function House(name, isGreat, initX, initY, otherData) {
  this.name = name;
  this.isGreat = isGreat;
  this.x = initX;
}

House.prototype.moveto = function(x,y){
  this.targetX = x;

}

House.prototype.update = function(){
  var dx = this.targetX - this.x;
  if (dx !== 0 ) {
    this.x += dx * .05;
    if (Math.abs(dx) < .5) {
        this.x = this.targetX;
    }
  }
}





var houselist = [];

houses.forEach(function(entry){
  houselist.push(new House(entry.name, entry.great == 1, 0, 0, {} ))
})
