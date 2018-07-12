  var getChrJSON = function(url) {
    return new Promise(function(resolve, reject) {
      var xhr = new XMLHttpRequest();
      xhr.open('get', url, true);
      xhr.responseType = 'json';
      xhr.onload = function() {
        var status = xhr.status;
        if (status == 200) {
          resolve(xhr.response.result);

        } else {
          reject(status);
        }
      };
      xhr.send();
    });
  };

  function distToZoom(){
      return  chrWdt * 3 + isLinear*200; 
  }
  
  function yAxisSide(axisSide){
      if (axisSide==1) return  yAxisR;
      else return  yAxisL;
  }

  function yAxisZoomSide(axisSide){
      if (axisSide==-1) return  yAxisZoomR;
      else return  yAxisZoomL;
  }

  function getid() {

  	var name = d3.select(this).attr('id');
  	name = name.replace("brushid", "");
  	return name;
  }

  function randomColor() {

  	var golden_ratio_conjugate = 0.618033988749895;
  	var h = Math.random();

  	var hslToRgb = function(h, s, l) {
  		var r, g, b;

  		if (s == 0) {
  			r = g = b = l; // achromatic
  		} else {
  			function hue2rgb(p, q, t) {
  				if (t < 0) t += 1;
  				if (t > 1) t -= 1;
  				if (t < 1 / 6) return p + (q - p) * 6 * t;
  				if (t < 1 / 2) return q;
  				if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
  				return p;
  			}

  			var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  			var p = 2 * l - q;
  			r = hue2rgb(p, q, h + 1 / 3);
  			g = hue2rgb(p, q, h);
  			b = hue2rgb(p, q, h - 1 / 3);
  		}

  		return '#' + Math.round(r * 255).toString(16) + Math.round(g * 255).toString(16) + Math.round(b * 255).toString(16);
  	};

  	h += golden_ratio_conjugate;
  	h %= 1;
  	return hslToRgb(h, 0.5, 0.60);

  };


  function radians(degrees) {

  	return degrees * Math.PI / 180;
  }


  function unique(list) {

  	var result = [];

  	$.each(list, function(i, e) {
  		if ($.inArray(e, result) == -1) result.push(e);
  	});
  	return result;
  }
  

  function getColumnJSON(array,column){

    //To get specific column list in an array
    var element=[]; 

    for(x in array)
     element.push(array[x][column]);

    return element;
  }


  function getCommonColumn(array1,array2,column){

    //To get intersection list in a column in 2 arrays
    var arr1 = getColumnJSON(array1,column);
    var arr2 = getColumnJSON(array2,column);
    var arrays = [arr1,arr2]

    var result = arrays.shift().filter(function(v) {
        return arrays.every(function(a) {
            return a.indexOf(v) !== -1;
        });
    });
    return result;
  }
