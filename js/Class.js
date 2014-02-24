
/*
Usage:

klmt.node = klmt.Class({
      x: null,
      y: null,	 
      z: null,	  
      parent: null,
      child: null,	
      set_x: function(x) {
         this.x=x;
      },
      set_y: function(y) {
         this.y=y;
      },	  
      get_x: function() {
         return [this.x,this.y,this.z];
      }
	});
	

	
rabbit = new klmt.node(); 	
rabbit.set_x( 33.89);
rabbit.set_y( 22.445);
//alert( rabbit.get_x() );

//inherit a class 
klmt.mayanode = klmt.Class(klmt.node,{});
maya = new klmt.mayanode();
maya.set_x(45.88)
//alert( maya.get_x() );

*/
		
var klmt;
if (!klmt) klmt = {} ;

klmt.extend = function(destination,source){
    destination = destination || {};
    if(source) {
        for(var property in source) {
            var value = source[property];
            if(value !== undefined) {
                destination[property] = value;
            }
        }
    }
    return destination;
}

klmt.Class = function(){
    var Class = function() {
	};
    var extended = {};
    var parent,Type;
    for(var i=0, len=arguments.length; i<len; ++i) {
        Type = arguments[i]; 
        if(typeof Type == "function") {
            parent = Type.prototype;
        } else {
            parent = Type;
        }
        klmt.extend(extended, parent);
    }
    Class.prototype = extended;
    return Class;		
}



