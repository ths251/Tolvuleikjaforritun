/*

entityManager.js

A module which handles arbitrary entity-management for "Asteroids"


We create this module as a single global object, and initialise it
with suitable 'data' and 'methods'.

"Private" properties are denoted by an underscore prefix convention.

*/


"use strict";


// Tell jslint not to complain about my use of underscore prefixes (nomen),
// my flattening of some indentation (white), or my use of incr/decr ops 
// (plusplus).
//
/*jslint nomen: true, white: true, plusplus: true*/


var entityManager = {

// "PRIVATE" DATA

_rocks   : [],
_bullets : [],
_ships   : [],

_bShowRocks : false,

// "PRIVATE" METHODS

_generateRocks : function() {
    var i,
	NUM_ROCKS = 4;
    
    // TODO: Make `NUM_ROCKS` Rocks!
    for(i = 0; i<NUM_ROCKS; i++){
        var rock = new Rock();
        this._rocks[i] = rock; 
    }
    console.log(this._rocks);
    
},

_findNearestShip : function(posX, posY) {

    // TODO: Implement this

    // NB: Use this technique to let you return "multiple values"
    //     from a function. It's pretty useful!
    //
    var distance = 10000;
    
    for(var i = 0; i<this._ships.length; i++){
        var distanceBetween = util.wrappedDistSq(posX, posY, this._ships[i].cx, this._ships[i].cy,
            this._ships[i].cx,
            this._ships[i].cy);
            
            

        if( distanceBetween< distance){
            distance = distanceBetween;
            var closestShip =  this._ships[i];
            var closestIndex = i;
        }
    }

    return {
	//theShip : closestShip,   // the object itself
	//theIndex: closestIndex   // the array index where it lives
    closestShip, closestIndex
    };
},

_forEachOf: function(aCategory, fn) {
    for (var i = 0; i < aCategory.length; ++i) {
	fn.call(aCategory[i]);
    }
},

// PUBLIC METHODS

// A special return value, used by other objects,
// to request the blessed release of death!
//
KILL_ME_NOW : -1,

// Some things must be deferred until after initial construction
// i.e. thing which need `this` to be defined.
//
deferredSetup : function () {
    this._categories = [this._rocks, this._bullets, this._ships];
},

init: function() {
    this._generateRocks();

    // I could have made some ships here too, but decided not to.
    //this._generateShip();
},

fireBullet: function(cx, cy, velX, velY, rotation) {


    var bullet = new Bullet({
        cx: cx,
        cy: cy,
        velX: velX,
        velY: velY, 
        rotation: rotation
    })

    this._bullets.push(bullet)
},

generateShip : function(descr) {
    // TODO: Implement this
    this._ships.push(new Ship(descr));
},

killNearestShip : function(xPos, yPos) {
    // TODO: Implement this

    // NB: Don't forget the "edge cases"
    var ship = this._findNearestShip(xPos, yPos);
    var shipIndex = ship.closestIndex;
    //Did not figure out the KILL_ME_NOW so i spliced the array instead
    this._ships.splice(shipIndex, 1);
},

yoinkNearestShip : function(xPos, yPos) {
    // TODO: Implement this

    // NB: Don't forget the "edge cases"
    var ship = this._findNearestShip(xPos, yPos);
    var shipObject = ship.closestShip;
    

    shipObject.cx = xPos;
    shipObject.cy = yPos;
},

resetShips: function() {
    this._forEachOf(this._ships, Ship.prototype.reset);
},

haltShips: function() {
    this._forEachOf(this._ships, Ship.prototype.halt);
},	

toggleRocks: function() {
    this._bShowRocks = !this._bShowRocks;
},

update: function(du) {

    // TODO: Implement this

    // NB: Remember to handle the "KILL_ME_NOW" return value!
    //     and to properly update the array in that case.
    for(var i = 0; i<this._categories.length; ++i){
        var aCategory = this._categories[i];
        for(var j =0; j<aCategory.length; ++j){
            aCategory[j].update(du);   
        }
    }  
},

render: function(ctx) {

    // TODO: Implement this

    // NB: Remember to implement the ._bShowRocks toggle!
    // (Either here, or if you prefer, in the Rock objects)

    for(var i = 0; i<this._categories.length; ++i){
        var aCategory = this._categories[i];
        for(var j =0; j<aCategory.length; ++j){
            if(this._bShowRocks === true && aCategory === this._rocks){
                aCategory[j].render(ctx);
            }
            else if(aCategory != this._rocks){
                aCategory[j].render(ctx);
            }
        }
    }
}
    

}



// Some deferred setup which needs the object to have been created first
entityManager.deferredSetup();

entityManager.init();
