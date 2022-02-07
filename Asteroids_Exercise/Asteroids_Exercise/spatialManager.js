/*

spatialManager.js

A module which handles spatial lookup, as required for...
e.g. general collision detection.

*/

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/

var spatialManager = {

// "PRIVATE" DATA

_nextSpatialID : 1, // make all valid IDs non-falsey (i.e. don't start at 0)

_entities : [],

// "PRIVATE" METHODS
//
// <none yet>


// PUBLIC METHODS

getNewSpatialID : function() {

    // TODO: YOUR STUFF HERE!
    
    this._nextSpatialID +=1;
    
    return this._nextSpatialID-1;

    

},

register: function(entity) {
    
    var pos = entity.getPos();
    var spatialID = entity.getSpatialID();
    // TODO: YOUR STUFF HERE!
    
    var radius = entity.getRadius();
    entity._entityProperty = true;

   /* var eh = new Entity({ 
        posX: pos.posX, 
        posY: pos.posY, 
        radius: radius
    });*/

    //ÞArf einhvern veginn að finna hvort þetta sé rock ship eða bullet því annars get ég ekki kallað á föllin sem bregst við take bullt hit
    var eh = new Entity();

    eh.posX = pos.posX;
    eh.posY = pos.posY;
    eh.radius = radius;

    
    //lifespan
    this._entities[spatialID] = eh;
    
},

unregister: function(entity) {
    //splice the position
    var spatialID = entity.getSpatialID();
    this._entities.splice(spatialID, 1);
},


findEntityInRange: function(posX, posY, radius) {

    // TODO: YOUR STUFF HERE!
   
   for(var ID in this._entities){
        var distanceBetween = Math.sqrt(Math.pow(posX - this._entities[ID].posX, 2) + Math.pow(posY - this._entities[ID].posY, 2));
        var radiusBetween = radius+ this._entities[ID].radius;
        if(distanceBetween<radiusBetween && this._entities[ID].radius>4){
              return this._entities[ID];      
        }
   }

},

render: function(ctx) {
    
    var oldStyle = ctx.strokeStyle;
    ctx.strokeStyle = "red";
    
    for (var ID in this._entities) {
        var e = this._entities[ID];
        
        util.strokeCircle(ctx, e.posX, e.posY, e.radius);
        
    }
    ctx.strokeStyle = oldStyle;
    
} 



}
