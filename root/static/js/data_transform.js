  function toMarker(data, ang, width, originX, x, y, height) {

  	var i = 0,
  		dataT = [];
  	var cos = Math.cos(ang),
  		sin = Math.sin(ang);

    //to adjust to chromosome  
  	var borderY = width / 2 * sin,
  		borderX = width /2 * cos;
  	var max = d3.max(data, function(d) {
  		return +d.position;
  	});
  //	var yLinear = d3.scaleLinear().range([y1.range()[0]-height/2 , y1.range()[1]-height/2]).domain([0, max]);
    var yLinear = d3.scaleLinear().range(y1.range()).domain([0, max]);
//   var yLinear = d3.scaleLinear().range([0, height]).domain([0, max]);

  	for (i; i < data.length; i++) {

  		dataT.push({
  			x1: (yLinear(+data[i].position) * cos) - borderY,
  			x2: (yLinear(+data[i].position) * cos) + borderY,
  			y1: (yLinear(+data[i].position) * sin) + borderX,//-(height/2* sin),
  			y2: (yLinear(+data[i].position) * sin) - borderX,//-(height/2* sin),
  			markerName: data[i].markerName,
			  markerDbId: data[i].markerDbId
  		});
  	}
  	return dataT;
  }

  function toMarkerZoom(data, ang, width, originX, x, y, height) {

  	var i = 0,
  		dataT = [];

  	for (i; i < data.length; i++) {

  		dataT.push({
  			y: data[i].position,
  			markerName: data[i].markerName,
			markerDbId: data[i].markerDbId
  		});
  	}
  	return dataT;
  }

  function preTransfLinkData(data, ang, x1, x2,chrWdt,chrHgt) {

  	var angSource, angTarget,
  		  dataT = [];
  	var maxs = d3.max(data, function(d) { return +d.s; 	});
    var maxt = d3.max(data, function(d) { return +d.t;  });

/*  var yLinears = d3.scaleLinear().range([0, chrHgt+chrWdt]).domain([0, maxs]);
    var yLineart = d3.scaleLinear().range([0, chrHgt]).domain([0, maxt]);*/
    var yLinears = d3.scaleLinear().range(y1.range()).domain([0, maxs]);
    var yLineart = d3.scaleLinear().range(y1.range()).domain([0, maxt]);


  	for (var i = 0; i < data.length; i++) {

  	/*	 angSource = radians(ang * data[i].chrs + 90);
  		 angTarget = radians(ang * data[i].chrt + 90);    */     ///corregir que no afecte a los chr <90
        angSource = radians(ang * data[i].chrs + 90);
       angTarget = radians(ang * data[i].chrt + 90);    
   /*   angSource = (ang * (data[i].chrs) + 157); //90
      angTarget = (ang * data[i].chrt)+347;  //270*/
  /*    angSource = (ang * (data[i].chrs) + 67); //90
      angTarget = (ang * data[i].chrt)+257;  //270*/
      //(ang * (data[i].chrt+12))+90;
//      angTarget = (ang * data[i].chrt + 90);

      if (angSource >180 && angSource < 360) { angSource = angSource -180}
      if (angTarget >180 && angTarget < 360) { angTarget = angTarget -180}
//console.log(ang + ":" + angSource * 180 / Math.PI + "-"); 
      angSource = radians(angSource);
      angTarget = radians(angTarget);

  		dataT.push({
  			sx: (yLinears(data[i].s) * Math.cos(angSource)),
  			sy: (yLinears(data[i].s) * Math.sin(angSource)),
  			tx: (yLineart(data[i].t) * Math.cos(angTarget)),
  			ty: (yLineart(data[i].t) * Math.sin(angTarget)),
  			chrs: data[i].chrs,
  			chrt: data[i].chrt,
        markerDbId: data[i].markerDbId
  		});
  	}
  	return dataT;
  }

  function transfLinkData(data, ang, width, radius, x1, x2) {
//long distance
  	var dataT = [];

  	var angSource, angTarget, angSourceT, angTargetT;

  	for (var i = 0; i < data.length; i++) {

  		angSource = radians(ang * (data[i].chrs-1));
  		angTarget = radians((ang * (data[i].chrt-1)) + 180); 
  		angSourceT = radians((ang * (data[i].chrs-1)) + 90);
  		angTargetT = radians((ang * (data[i].chrt-1)) + 270); //radians((ang * (data[i].chrt+12)) + 90);
    /*  angSource = radians(ang * (data[i].chrs-1) -90);
      angTarget = radians((ang * (data[i].chrt-1)) + 90); 
      angSourceT = radians((ang * (data[i].chrs-1)) + 0);
      angTargetT = radians((ang * (data[i].chrt-1)) + 0); //radians((ang * (data[i].chrt+12)) + 90);*/
// console.log(ang + ":" + angSource * 180 / Math.PI + "-" +angSourceT * 180 / Math.PI); 
  		dataT.push({
  			sx: data[i].sx - (width / 2 * Math.sin(angSourceT)) + (radius * Math.cos(angSource)),
  			sy: data[i].sy + (width / 2 * Math.cos(angSourceT)) + (radius * Math.sin(angSource)),
  			tx: data[i].tx - (width / 2 * Math.sin(angTargetT)) + (radius * Math.cos(angTarget)),
  			ty: data[i].ty + (width / 2 * Math.cos(angTargetT)) + (radius * Math.sin(angTarget)),
        markerDbId: data[i].markerDbId
  		});
  	} 
  	return dataT; 
  }
   function transfLinkData1(data, ang, width, radius, x1, x2) {
//long distance
    var dataT = [];
    var maxs = d3.max(data, function(d) { return +d.s;  });
    var maxt = d3.max(data, function(d) { return +d.t;  });
    var yLinears = d3.scaleLinear().range(y1.range()).domain([0, maxs]); // sacar de aqui el rango como codigos anteriores
    var yLineart = d3.scaleLinear().range(y1.range()).domain([0, maxt]);
console.log(maxs);
    var angSource, angTarget, angSourceT, angTargetT;

    for (var i = 0; i < data.length; i++) {

      angSource = radians((ang * (data[i].chrs-1)-90)%360);
      angTarget = radians((ang * (data[i].chrt-1)) + 90); 
      angTargetT = radians((ang * (data[i].chrt-1)) + 270); //radians((ang * (data[i].chrt+12)) + 90);

      dataT.push({
        sx:   (width / 2 * Math.sin(angSource +180)) + (radius * Math.cos(angSource)) - (yLinears(data[i].s) * Math.sin(angSource)),
        sy: - (width / 2 * Math.cos(angSource +180)) +  (radius * Math.sin(angSource)) + (yLinears(data[i].s) * Math.cos(angSource)),
        tx: (width / 2 * Math.sin(angTarget +180)) + (radius * Math.cos(angTarget)) - (yLineart(data[i].t) * Math.sin(angTarget)) , //- (width / 2 * Math.sin(ang)) + (radius * Math.cos(angTarget)),
        ty: - (width / 2 * Math.cos(angTarget +180)) +  (radius * Math.sin(angTarget)) + (yLineart(data[i].t) * Math.cos(angTarget)), //+ (width / 2 * Math.cos(ang)) + (radius * Math.sin(angTarget)),
        markerDbId: data[i].markerDbId
      });
    } 
    return dataT; 
  }

 function fillArray(myArr){

    var data = [], list= [];
      for (var i = 0; i < myArr.result.data.length; i++) {
        data.push({
          linkageGroup: myArr.result.data[i].linkageGroup,
          position: myArr.result.data[i].position,
          markerName: myArr.result.data[i].markerName,
          markerDbId: myArr.result.data[i].markerDbId  //to link solgenomics 
        });
        list.push(myArr.result.data[i].linkageGroup);
      }
      return { data: data, list: list } ;
}

 function fillFilterArray(myArr,chr){

    var data = [], list= [];
      for (var i = 0; i < myArr.result.data.length; i++) {
        if(myArr.result.data[i].linkageGroup == chr){
          data.push({
            linkageGroup: myArr.result.data[i].linkageGroup,
            position: myArr.result.data[i].position,
            markerName: myArr.result.data[i].markerName,
	          markerDbId: myArr.result.data[i].markerDbId
          });
          list.push(myArr.result.data[i].linkageGroup);
        }
      }
      return { data: data, list: list } ;
}
