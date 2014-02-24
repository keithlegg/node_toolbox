	
if (!klmt.core)        klmt.core = {} ;

klmt.core.data_graph = klmt.Class ({

    __init__ :function (name) {
	  this.name = name; //NAME IS ID 
	  this._NODES = new Array();
	  
      this.reset_walk(); //CLEAR WALK BUFFERS 
    },

    reset_nodes : function(){
	  this._NODES = new Array();
    },

    reset_walk : function(){
	  this.last_walked_node = '';
	  this.walk_output = new Array();
    },

    get_root : function(){
	 return this._NODES[0];
	
    },
	
    exists : function ( nodeobj ) {
      for (w=0;w<this._NODES.length;w++){
	    if (this._NODES[w]==nodeobj||this._NODES[w]===nodeobj)
		{
		 return 1;
		}
	  };
	  return 0;
    },
	
    /****/

	create : function (name,type) {
	  var nnod = new klmt.core.node_base(); 
	  nnod.__init__(name,type);
      this._NODES.push(nnod);
	  return nnod;
	},
    /****/	
	create_xy : function (name,type,xcoord,ycoord) {
	  var nnod = new klmt.core.node_base(); 
	  nnod.__init__(name,type);
	  
	  nnod.XFORM[0]=xcoord;
	  nnod.XFORM[1]=ycoord;
	  nnod.XFORM[2]='0';
	  
      this._NODES.push(nnod);
	  return nnod;
	},
	
    /****/	
	create_spatial_cache : function (name,type,layer,fid,wkt,bbox) {
	  var nnod = new klmt.core.node_base(); 
	  nnod.__init__(name,type);

          nnod.CACHE_LYR  = layer;
          nnod.CACHE_FID  = fid;
          nnod.CACHE_WKT  = wkt;
          nnod.CACHE_BBX  = bbox;
	  
	  nnod.is_spatial_cached = true;
	  
      this._NODES.push(nnod);
	  return nnod;
	},	
	
    /****/
	//OBJECT NOT NAME 
	add : function (nodeobj) {
	  if(!this.exists(nodeobj) ){
       this._NODES.push(nodeobj);
	  }
	},
    /****/	
	//ARGS ARE OBJECTS 
	parent  : function(cobj,pobj){
	   if (cobj==pobj) {return 0;}
	   cobj.PARENTS[0]  = pobj.name;
	   pobj.CHILDREN.push(cobj.name);
	   //pobj.CHILDREN[0] = cobj.name;
	   pobj.haschildren =1;
	   cobj.hasparents  =1;
	   
	},
	/****/
	//made as a  test for the graph tool GUI
	hack_parent : function(pname,chname){
       pobj = this.find_name(pname);
	   if(pobj!=0){
	     //alert(pobj);
         pobj.CHILDREN.push(chname);
       }
   
	},
	
    /****/	
	//ARGS ARE OBJECTS 
	parent_name : function(cnode,pnode){
	   if (cnode==pnode) {return 0;}
	   cobj = this.find_name(cnode);
	   pobj = this.find_name(pnode);
  
	   if (cobj&&pobj) {
		 if (pobj.name!=cobj.name){	  
	       //debug need to check exists 
           cobj.PARENTS[0]  = pobj.name;
           pobj.CHILDREN.push(cobj.name);
		   //.haschildren  //??
		   //pobj.CHILDREN[0] = cobj.name;
         }
	   }//if objects exist

	},
	
    /****/
	find_name : function(nametoget){
		for (x=0;x<this._NODES.length;x++){

			if (this._NODES[x].name ==nametoget){
			  //alert('debug '+this._NODES[x].name+' '+ nametoget);
						
			  return this._NODES[x];
			}
		}
		return 0;
	},
    /****/	
	//use instanceof ??
	find_obj : function(instance){
		for (x=0;x<this._NODES.length;x++){
			if (this._NODES[x]===instance||this._NODES[x]==instance){
			  return this._NODES[x];
			}
		}
		return 0;
	},
	

    /****/	
	oldwalk : function (node){
	  if (!this.exists(node) ){return 0;} 
	  this.last_walked_node = node;
	  this.walk_output.push(node);
      var children = node.get_children();
	  for (x=0;x<children.length;x++){
	     var cobj = this.find_name(children[x]);
         if(cobj){
            this.walk(cobj);
		 };
      }
	},
	
    /****/
    walk : function (node){
	  if (!this.exists(node) ){return 0;} 
  
	  this.walk_output.push(node);
	  this.last_walked_node = node;

      /***/

      var walkchlds = node.CHILDREN;
  
	  if (walkchlds.length==0){ return 0;} //if node has no children go back 
	  
	  for (xw=0;xw<walkchlds.length;xw++){
	 
	     var cobjtmp = this.find_name(walkchlds[xw]);
		 this.walk(cobjtmp);

      }
	 

	},
	show : function(){
	
		num = this._NODES.length;

		out = '';
		for (x=0;x<num;x++){
			 out = out+'# '; 
			 out = out+(this._NODES[x].name + ' ');
			 /****/
			 //PARENTS
			 out = out+('P ');
			 //tmp_par = this._NODES[x].get_parents();
			 tmp_par = this._NODES[x].PARENTS[0];
			 if (tmp_par){
			  if (tmp_par){out = out+(tmp_par + ' ');}		 
                         }
			 /****/
			 //CHILDREN
			 out = out+('C ');
			 //tmp_chld =this._NODES[x].get_children();
			 for (c=0;c<this._NODES[x].CHILDREN.length;c++){
			  tmp_chld =this._NODES[x].CHILDREN[c];
			  if (tmp_chld) {out = out+(tmp_chld  + ' ');}
			 }

		     /****/		 
			 //XFORM
			 out = out+('X ');
			 tmp_xfm =this._NODES[x].XFORM;
			 if (tmp_xfm) {out = out+ (tmp_xfm[0]+ ' '+tmp_xfm[1]+' '+tmp_xfm[2]+' ' );}
			 
		     /****/		 
			 //Spatial Chache 
			 out = out+('SC ');
			 if ( this._NODES[x].is_spatial_cached == true  ){
			 
			   var has_cache =this._NODES[x].is_spatial_cached;
			   
			   if (has_cache) {
			      if (this._NODES[x].CACHE_LYR!=undefined){  out = out+ ('SCL'+ this._NODES[x].CACHE_LYR ) };
			      if (this._NODES[x].CACHE_FID!=undefined){  out = out+ ('SCF'+this._NODES[x].CACHE_FID ) };
			      if (this._NODES[x].CACHE_WKT!=undefined){  out = out+ ('SCW'+this._NODES[x].CACHE_WKT ) };
			      if (this._NODES[x].CACHE_BBX!=undefined){  out = out+ ('SCB'+this._NODES[x].CACHE_BBX ) };
 
			   }	
			   //
			   
			 
			 }
			 
		     /****/				 
			 out = out+'|'; 		 
		}
		//alert (out);
		return out;
	},
        /****/ //SAME AS SHOW BUT TO RENDERS AS TEXT 	
	render_html : function(){
		num = this._NODES.length;
		out = '';
		for (x=0;x<num;x++){
			 document.write( 'NAME: '+this._NODES[x].name); 
			 document.write('<p>');
			 
			 out = out+('PARENTS: ');
			 //tmp_par = this._NODES[x].get_parents();
			 tmp_par = this._NODES[x].PARENTS[0];
			 
			 if (tmp_par){out = out+(tmp_par + ' ');}		 
			 /****/
			 //out = out+('CHILDREN: ');
			 //tmp_chld =this._NODES[x].get_children();
			 //alert(tmp_chld);
			 //if (tmp_chld) {out = out+(tmp_chld.name + ' ');}
		     /****/		 
			 out = out+'|_| '; 		 
		}
	},
	/*********/
	//encodes graph into a URL string to send over teh interwebz 
	
	//returns an array for more control - be sure to stringify 
    get_as_url : function(){
 		var num = this._NODES.length;
		var BOUT = new Array(); //we will stringify later 
		var out = '';
		for (x=0;x<num;x++){
			 BOUT.push (';#N;'+this._NODES[x].name); 
			 if (this._NODES[x].PARENTS[0]!=undefined){
			   BOUT.push(';P;'+this._NODES[x].PARENTS[0] );
			 }
			 
	 
		}
		
		return BOUT;
		
	},
	


    /****/
	
   CLASS_NAME : 'klmt.core.data_graph'
});


klmt.core.node_base = klmt.Class ({

    __init__ : function ( name,type) {
	  this.name               = name;
	  this.type               = type;
	  this.haschildren        = false;
	  this.hasparents         = false;
	  this.is_spatial_cached  = false;
	  
	  this.XFORM              = new Array();
	  this.XFORM.push(0);this.XFORM.push(0);this.XFORM.push(0);//XYZ
	  
          this.CACHE_LYR  = '';
          this.CACHE_FID  = '';
          this.CACHE_WKT  = '';
          this.CACHE_BBX  = '';
	  /****/
	  this.PARENTS            = new Array();
	  this.CHILDREN           = new Array();
	  this.ATTR_NAMES         = new Array();
	  this.ATTR_VALUES        = new Array();

	},

	
    /*******/
    show : function () {
      var newar=new Array();
      newar.push(this.name);
	  newar.push(this.type);
	  
	  newar.push(this.XFORM[0]);
	  newar.push(this.XFORM[1]);	  
	  newar.push(this.XFORM[2]);
	  /****/
	  alert(newar);
	  
    },
    /*******/
	get_parents  :function (){
	  return this.PARENTS;
	},
	
    /*******/	
	get_children  :function (){
	  return this.CHILDREN;
	},
    /*******/
	//DEBUG WIP 
    setxform :function (XYZARR) {
	  this.XFORM = new Array();
	
      for (var test in XYZARR)
      {
        this.XFORM[test] = (XYZARR[test]);
      }
    },	
    /*******/
    getxform :function () {
      var newar=new Array()
      var self_xform=this.XFORM;
      //this spits out an INDEX (numeric) for var test
      for (var test in self_xform)
      {
        newar[test] = test ;
      }
      alert(newar);	
    },
    /*******/	
	// object 
	add_parent_obj : function(pobj){
	  this.PARENTS[0]=(pobj.name);
	  //pobj.CHILDREN.push(this.name);
	  this.hasparents  = true;		  
	},
	// object 	
	add_child_obj : function (cobj){
	  this.CHILDREN.push(cobj.name);
	  //cobj.PARENTS[0] =(this.name);
	  this.haschildren = true;	  
	},
    /*******/	
	//link_attr
	//unlink_attr
    /*******/	
    //WIP DEBUG 
	add_attr : function (name,type){
	  this.ATTR_NAMES.push(name);
	  this.ATTR_VALUES.push(type);
	},
    /*******/	
	//debug WIP
	get_attr : function (attrname){
	  var output = '';
	  for (x=0;x<this.ATTR_NAMES;x++){
	     alert(this.ATTR_NAMES[x]);
	     if (this.ATTR_NAMES[x]==attrname){
		   output = (this.ATTR_VALUES[x]);
		 }
		 
	  }
	  return output;	  
    },
    /*******/
    //WIP DEBUG 	
	set_attr : function (name,type){
	  //this.ATTRIBUTES.push()
    },	  

    CLASS_NAME: 'klmt.core.node_base'
});


 
 
 
 
