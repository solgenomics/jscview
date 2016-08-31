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
  
