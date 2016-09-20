  function toMarker(data, ang, width, originX, x, y, height) {

  	var i = 0,
  		dataT = [];
  	var cos = Math.cos(ang),
  		sin = Math.sin(ang);
  	var borderY = width / 2 * sin,
  		borderX = width / 2 * cos;
  	var max = d3.max(data, function(d) {
  		return +d.position;
  	});
  	var yLinear = d3.scaleLinear().range([0, height]).domain([0, max]);

  	for (i; i < data.length; i++) {

  		dataT.push({
  			x1: (yLinear(+data[i].position) * cos) - borderY,
  			x2: (yLinear(+data[i].position) * cos) + borderY,
  			y1: (yLinear(+data[i].position) * sin) + borderX,
  			y2: (yLinear(+data[i].position) * sin) - borderX,
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

  function preTransfLinkData(data, ang, x1, x2) {

  	var i = 0,
  		angSource, angTarget,
  		dataT = [];
  	var max = d3.max(data, function(d) {
  		return +d.s;
  	});
  	var yLinear = d3.scaleLinear().range([0, chrHgt]).domain([0, max]);

  	for (i; i < data.length; i++) {

  		angSource = radians(ang * data[i].chrs + 90);
  		angTarget = radians(ang * data[i].chrt + 90);

  		dataT.push({
  			sx: (yLinear(data[i].s) * Math.cos(angSource)),
  			sy: (yLinear(data[i].s) * Math.sin(angSource)),
  			tx: (yLinear(data[i].t) * Math.cos(angTarget)),
  			ty: (yLinear(data[i].t) * Math.sin(angTarget)),
  			chrs: data[i].chrs,
  			chrt: data[i].chrt
  		});
  	}
  	return dataT;
  }

  function transfLinkData(data, ang, width, radius, x1, x2) {

  	var i = 0,
  		dataT = [];

  	var angSource, angTarget, angSourceT, angTargetT;

  	for (i; i < data.length; i++) {

  		angSource = radians(ang * data[i].chrs);
  		angTarget = radians(ang * data[i].chrt);
  		angSourceT = radians(ang * data[i].chrs + 90);
  		angTargetT = radians(ang * data[i].chrt + 90);

  		dataT.push({
  			sx: data[i].sx - (width / 2 * Math.sin(angSourceT)) + (radius * Math.cos(angSource)),
  			sy: data[i].sy + (width / 2 * Math.cos(angSourceT)) + (radius * Math.sin(angSource)),
  			tx: data[i].tx - (width / 2 * Math.sin(angTargetT)) + (radius * Math.cos(angTarget)),
  			ty: data[i].ty + (width / 2 * Math.cos(angTargetT)) + (radius * Math.sin(angTarget))
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
          markerName: myArr.result.data[i].markerName
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
