
  function chromosome(data, svg0, width, height, ang0, x, y, i, forZoom, isLinear,n) {

    //isLinear
    if (isLinear == 0 ) {
        var a = 2;
    }
    else var a = n + forZoom + 1;

    var originX = window.innerWidth/a,
      originY =  window.innerHeight/4,
      heightZoom = height + width*2;

    var svg = svg0.append("g").attr("id", "svg" + i)
              .attr("transform", " translate(" + (originX + x) + "," + (originY + y) + ") rotate(" + ang0 + ") ");
    var ang = radians(ang0 + 90);
    var max = d3.max(data.map(function(d) {
      return +d.location;
    }));

    var dataT = toMarker(data, ang, width, originX, '', '', height);
    var dataZoom = toMarkerZoom(data, ang, width, originX, '', '', heightZoom);
    window["max" + i] = max;

    // Define kind domains for axis
    y1.domain([0, d3.max(data.map(function(d) {
      return +d.location;
    }))]);
    y2.domain(y1.domain());

    // Start drawing objects

    svg.append("text")
      .attr("dx", 0)
      .attr("dy", -width)
      .text(i)
      .attr("fill", "#B75CA1");

    svg.append("rect")
      .data(dataT)
      .attr("id", "rect" + i)
      .attr("x", -width / 2)
      .attr("y", -width)
      .attr("rx", width)
      .attr("ry", width)
      .attr("width", width)
      .attr("height", height + width * 2)
      .attr("fill", 'transparent')
      .attr("stroke", "black")
      .style("stroke-width", 1)
      .on('click', onclick);

    svg.selectAll("line.horizontal")
      .attr("id", "lines" + i)
      .data(dataT)
      .enter().append("svg:line")
      .attr("x1", function(d) {
        return d.x1;
      })
      .attr("y1", function(d) {
        return d.y1;
      })
      .attr("x2", function(d) {
        return d.x2;
      })
      .attr("y2", function(d) {
        return d.y2;
      })
      .style("stroke", randomColor)
      .style("stroke-width", 2)
    .on("mouseover", mouseover)
    .on("mouseout", mouseout)
      .attr("transform", "rotate(" + -ang0 + ") ");


    if (forZoom == 1) {

      svg.append("g")
        .attr("id", "brushid" + i)
        .attr("class", "brush")
        .attr("transform", "rotate(" + -ang0 + ")  translate(" + (-(Math.sin(ang) * width / 2)) + "," + ((Math.cos(ang) * width / 2)) + ")  rotate(" + ang0 + ") ")
        .call(vbrush);
        // .call(vbrush.move, y1.range())


      svg.append("g")
        .attr("id", "yaxis" + i )
        .attr("class", "y axis")
        .attr("width", 10)
        .attr("height", 10)
        .attr("transform", "rotate(" + -ang0 + ") translate(" + (Math.sin(ang) * width / 2) + "," + (-(Math.cos(ang) * width / 2)) + ")  rotate(" + ang0 + ") ")
        .call(yAxis);

      svg.append("polygon")
        .data(dataT)
        .attr("fill", "lightcoral")
        .attr('opacity', 0.125)
        .style("stroke-width", 2);

      var zoom = svg0.append("g").attr("id", "zoom" + i).attr("transform", " translate(" + (originX + x ) + "," + (originY + y) + ")  rotate(" + (ang0) + ") ");
      //+ (isLinear*x)
      zoom.append("rect")
        .attr("id", "rectx" + i)
        .attr("x", width * 3 + isLinear*200)
        .attr("y", -width)
        .attr("width", width)
        .attr("height", heightZoom)
        .attr("fill", 'transparent')
        .attr("stroke", "black");

      zoom.selectAll("text")
        .attr("id", "text" + i)
        .data(dataZoom)
        .enter().append("text")
        .attr("dx", width * 4  + isLinear * 200);

      zoom.selectAll("line")
        .attr("id", "line" + i)
        .data(dataZoom)
        .enter().append("line")
        .attr("class", "line")
        .style("stroke", "green")
        .style("stroke-width", 2)
        .on("mouseover", mouseoverZ)
        .on("mouseout", mouseoutZ)
        .on("mousemove", mousemoveZ);

      zoom.append("polygon")
        .data(dataT)
        .attr("fill", "lightcoral")
        .attr('opacity', 0.125)
        .style("stroke-width", 2);

      zoom.append("g")
        .attr("class", "yaxis")
        .attr("width", 10)
        .attr("height", 10)
        .attr("transform", " rotate(" + (-ang0) + ") translate(" + ((Math.sin(ang) * width * 3 + isLinear * 200)) + "," + ((-Math.cos(ang) * width * 3)) + ")  rotate(" + ang0 + ") ")
        .call(yAxisZoom);

      svg.selectAll("#zoom" + i).attr("visibility", "hidden");

    } else {

      svg.append("g")
        .attr("id", "yaxis")
        .attr("class", "axis")
        .attr("width", 10)
        .attr("height", 10)
        .attr("y", -35)
        .style("stroke-width", 0)
        .attr("transform", " rotate(" + -ang0 + ")  translate(" + (-(Math.sin(ang) * width / 2)) + "," + (-(Math.cos(ang) * width / 2)) + ")  rotate(" + ang0 + ") ")
        .call(yAxis);

      svg.append("g").attr("id", "svgo" + i).selectAll("text.horizontal")
        .attr("id", "textx" + i)
        .data(dataT)
        .enter().append("text")
        .attr("dx", width * 1.5)
        .on("mouseover", mouseovertxt)
        .on("mouseout", mouseouttxt);

      // for lines names
      svg.append("g").attr("id", "svgol" + i).selectAll("line.l")
        .attr("id", "lname" + i)
        .data(dataT)
        .enter().append("line")
        .style("stroke", randomColor);


    }
  }

  function brush() {

    var  chrHgtZoom = chrHgt + chrWdt*2;
    var name = d3.select(this).attr('id');
    var maxpos = name.replace("brushid", "max");
    var s = d3.event.selection || y2.range();

    name = name.replace("brushid", "");

    y1.domain([0, eval(maxpos)]);

    y2.domain(s.map(y1.invert, y1));

    svg.selectAll("#zoom" + name).attr("visibility", "unhidden");
/*
    svg.selectAll("#zoom" + name).selectAll("text")
      .filter(function (d) {return y2(d.y) > -chrWdt  & y2(d.y) < chrHgtZoom - chrWdt  })
      .attr("dy", function(d) { return y2(d.y); })
      .text(function(d) { return d.markerId; }); */

      function filterByRange(d, a) {
      return a > i - 6 & a < i + 6;
    };

    var pos = chrHgt / 10;

  var t = svg.transition().duration(950);


 brushRange= y2.domain()[1] - y2.domain()[0]/10;

  svg.selectAll("#zoom" + name).selectAll("text").attr("dy",-1000);

    svg.select("#zoom" + name).selectAll("text")
      .filter(function (d) { return y2(d.y) > -chrWdt  & y2(d.y) < chrHgtZoom - chrWdt  })
   //   .attr("dy", function(d, m) { return pos * m; })
      .attr("dy", function(d, m) { if (y2(d.y) , brushRange*m) return y2(d.y); })
 .text(function(d) { return d.markerId; });


/*
    svg.select("#zoom" + name).selectAll("line").filter(filterByRange)
      .attr("x1", function(d) {  if ((d.y1) > 0 & (d.y1) < chrHgt) return d.x2 })
      .attr("x2", function(d) { if ((d.y1) > 0 & (d.y1) < chrHgt) return chrWdt * 1.5})
      .attr("y1", function(d) {  if ((d.y1) > 0 & (d.y1) < chrHgt) return d.y1;})
      .attr("y2", function(d, m) { if ((d.y1) > 0 & (d.y1) < chrHgt) return pos * m; }); */


  svg.selectAll("#zoom" + name).selectAll("line").attr("x1",0) .attr("x2",0);


    svg.selectAll("#zoom" + name).selectAll("line").transition(t)
      .filter(function(d) { return y2(d.y) > -chrWdt -1  & y2(d.y) < chrHgtZoom - chrWdt + 1 })
      .attr("x1", function(d) {  return chrWdt * 3 + isLinear * 200; })
      .attr("x2", function(d) {  return chrWdt * 4 + isLinear * 200; })
      .attr("y1", function(d) {  return y2(d.y); })
      .attr("y2", function(d) {  return y2(d.y); });

    svg.selectAll("#zoom" + name).select(".yaxis").call(yAxisZoom);

    svg.selectAll("#zoom" + name).selectAll("polygon")
      .attr("points", chrWdt/2 + "," + d3.brushSelection(this)[0] + " " 
        + chrWdt/2 + " ," + d3.brushSelection(this)[1]  + " " 
        + (chrWdt * 3 + isLinear * 200) + "," + (chrHgt + chrWdt)  + " " 
        + (chrWdt * 3 + isLinear * 200) + "," + -chrWdt);


  }

  function mouseoverZ(d) {

    var name = d3.select(this.parentNode).attr('id');
    name = name.replace("zoom", "");

    d3.select(this).style("stroke", "red");

    svg.selectAll("#zoom" + name).selectAll("text").style("font-size", "18px");
    // svg.selectAll("#zoom"+ name).selectAll("line").style("stroke","red"); 

  }

  function mousemoveZ(d) {
    //svg.selectAll("#zoom" + d).selectAll("text").style("fill", "green");
    // d3.select(this).style("fill", "red");
    // zoom.selectAll("text").classed("inactive", function(p) { return p !== d; });
    //    svg.filter(function(p) { return p === d; }).each(moveToFront);
    /*svg.selectAll("#zoom" + d ).transition()
    .duration(500)
    .style("opacity", 1);*/
    //  svg.selectAll("#zoom" + d ).selectAll("text").style("font-size","34px");

  }

  function mouseoutZ(d) {
    /*svg.selectAll("#zoom" + d ).selectAll("text").transition()
    .duration(500)
    .style("font-size","14px");*/
    var name = d3.select(this.parentNode).attr('id');
    name = name.replace("zoom", "");

    svg.selectAll("#zoom" + name).selectAll("text").style("font-size", "14px");
    svg.selectAll("#zoom" + name).selectAll("line").style("stroke", "blue");
  }

  function mouseovertxt(d) {

    d3.select(this).style("font-size", "18px");
    // svg.selectAll("#zoom"+ name).selectAll("line").style("stroke","red"); 
  }

  function mouseouttxt(d) {

    d3.select(this).style("font-size", "14px");

  }

  function mouseover(d, i) {

    var name = d3.select(this.parentNode).attr('id');
    name = name.replace("svg", "");

    d3.select(this).style("stroke", "blue");
    d3.select(this).each(moveToFront);

    function filterByRange(d, a) {
      return a > i - 6 & a < i + 6;
    };

    var pos = chrHgt / 10;

    svg.select("#svg" + name).select("#svgo" + name).selectAll("text")
      .filter(filterByRange)
      .attr("dy", function(d, m) { return pos * m; })
      .text(function(d) { return d.markerId; });

    svg.select("#svg" + name).select("#svgol" + name).selectAll("line").filter(filterByRange)
      .attr("x1", function(d) {  if ((d.y1) > 0 & (d.y1) < chrHgt) return d.x2 })
      .attr("x2", function(d) { if ((d.y1) > 0 & (d.y1) < chrHgt) return chrWdt * 1.5})
      .attr("y1", function(d) {  if ((d.y1) > 0 & (d.y1) < chrHgt) return d.y1;})
      .attr("y2", function(d, m) { if ((d.y1) > 0 & (d.y1) < chrHgt) return pos * m; });

  }

  function mouseout(d) {

    var name = d3.select(this.parentNode).attr('id');
    name = name.replace("svg", "");

    d3.select(this).style("stroke", "gray");
    svg.selectAll("text").style("font-size", "14px");
    svg.select("#svg" + name).select("#svgo" + name).selectAll("text").attr("dy", null).text(null);

    svg.select("#svg" + name).select("#svgol" + name).selectAll("line").attr("x1", null).attr("x2", null).attr("y1", null).attr("y2", null);

  }

  function moveToFront() {

    this.parentNode.appendChild(this);
  }



  function links(data, svg, ang, chrWdt, chrHgt, radius, x1, x2, y0) {
    
    var winWidth = window.innerWidth;
    var winHeight = window.innerHeight; 

    var originX = winWidth/2,
        originY = winHeight/4;

    var dataT = preTransfLinkData(data, ang, x1, x2);
    var dataForLink = transfLinkData(dataT, ang, chrWdt, radius, x1, x2);


    svg.append("g")
      .attr("class", "link")
      .selectAll("path")
      .data(dataForLink)
      .enter().append("path")
      .attr("d", link)
      .style("opacity", 1)
      .attr("transform", " translate(" + (originX) + "," + (originY + y0) + ") ");

  
    function link(d) {
        return "M" + (d.tx+ x2) + "," + ( d.ty)
            + "C" + (d.tx+ x2) + "," +  ((d.ty + d.sy) / 2)
            + " " + (d.sx+ x1) + "," +  ((d.ty + d.sy) / 2)
            + " " + (d.sx+ x1) + "," +  (d.sy);
      };

    }

  function onclick() {
    //  zoom2.select("rect2").remove();

    var a = d3.select(this).attr('id');
    list = [];
    svg.select("#" + a).attr("fill", "#C75601");
    list.push(a.replace("rect", ""));

            document.getElementById("search_gene").submit();
            document.getElementById("input_gene")=list;

  }




