
  function chromosome(data, svg0, width, height, ang0, x, y, mapId, chrId, forZoom, isLinear,nChr,originX,originY,zSide,axisSide,comp) {

    //isLinear
    if (isLinear == 0 ) { var va = 2;   }
    else var va = nChr + forZoom + 1;

    var i = mapId + "_" + chrId; console.log(i);
    var heightZoom = height + width*2;
    var distZoom = distToZoom(); //width * 3 + isLinear*200;

    var svg = svg0.append("g").attr("id", "svg" + i)
              .attr("transform", " translate(" + (originX + x) + "," + (originY + y) + ") rotate(" + ang0 + ") ");
    var ang = radians(ang0 + 90);
    var max = d3.max(data.map(function(d) {
               return +d.position; }));

    window["side" + i] = zSide;
    window["max" + i] = max;
    window["comp"] = comp;

    var tooltip = svg.append("div") 
                  .attr("class", "tooltip")       
                  .style("opacity", 0.5); /// cambiar tool tip

    tooltip.append('div')                       
           .attr('class', 'label'); 

    var dataT = toMarker(data, ang, width, originX, '', '', height);
    var dataZoom = toMarkerZoom(data, ang, width, originX, '', '', heightZoom);
    

    // Define  domains for axis

    y1.domain([0, d3.max(data.map(function(d) { return +d.position; }))]);
    y2.domain(y1.domain());

    // Start drawing objects

    svg.append("text")
      .attr("dx", -width/2)
      .attr("dy", -width*1.5)
      .text("Chr " +  i.split("_")[1])
      .attr("fill", "#B75CA1");

    svg.append("text")
       .attr("dx", -width)
       .attr("dy", -width/2)
       .text("cM")
       .attr("font-size",12);    

    svg.append("rect")
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
        .on('click', onclick)
        .on("mouseover", function(d) {    
                tooltip.select('.label').html("hi"); });

    svg.selectAll("line.horizontal")
        .attr("id", "lines" + i)
        .data(dataT)
      .enter().append("svg:line")
        .attr("id", function(d) {  return "lmk" + i + "-" + (d.markerDbId); })
        .attr("x1", function(d) { return d.x1;  })
        .attr("y1", function(d) { return d.y1;  })
        .attr("x2", function(d) { return d.x2;  })
        .attr("y2", function(d) { return d.y2;  })
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

      svg.append("g")
        .attr("id", "yaxis")
        .attr("class", "y axis")
        .attr("width", 10)
        .attr("height", 10)
        .attr("transform", " translate(" + ( width / 2 * axisSide) + ",0)")
        .call(yAxisSide(axisSide));

      svg.append("polygon")
        .data(dataT)
        .attr("fill", "lightcoral")
        .attr('opacity', 0.125)
        .style("stroke-width", 2);

      var zoom = svg0.append("g").attr("id", "zoom" + i).attr("transform", " translate(" + (originX + x ) + "," + (originY + y) + ")  rotate(" + (ang0) + ") ");

      var zoomSide = window['side'+i];

      zoom.append("rect")
        .attr("id", "rectx" + i)
        .attr("x", width*(zoomSide-1)/2+distZoom*zoomSide) //distZoom*zoomSide) //
        .attr("y", -width)
        .attr("width", width)
        .attr("height", heightZoom)
        .attr("fill", 'transparent')
     //  .attr("fill", "#FDDDDC")
      //  .attr('opacity', 0.625)
        .attr("stroke", "black");

      zoom.append("g").attr("id", "text" + i).selectAll("text")
        .data(dataZoom)
        .enter().append("text")
        .attr("dx", width * 4  + isLinear * 200);

      zoom.append("g").attr("id", "path" + i);

      zoom.selectAll("line")
        .attr("id", "line" + i)
        .data(dataZoom)
       .enter().append("line")
        .attr("id", function(d) {  return "lbmk" + (d.markerDbId); })
        .attr("y2", function(d) {  return y1(d.y); })
        .attr("y1", function(d) {  return y1(d.y); })
        .attr("class", "line")
        .style("stroke", '#000')
        .style("stroke-width", 1)
        .attr('opacity', 1)
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
        .attr("transform", " translate(" + (distZoom * zoomSide) + ",0)")
        .call(yAxisZoomSide(zoomSide));

      zoom.append("text")
        .attr("dx", distZoom-20)
        .attr("dy", -width-3)
        .text("cM")
        .attr("font-size",12);   

      zoom.attr("visibility", "hidden");

    } else {

      svg.append("g")
        .attr("id", "yaxis" + i)
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

  function mouseoverZ(d) {

    var name = d3.select(this.parentNode).attr('id');
    name = name.replace("zoom", "");

    d3.select(this).style("stroke", "red");

   // svg.selectAll("#zoom" + name).selectAll("text").style("font-size", "18px");
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

   // d3.select(this).style("font-size", "18px");
    // svg.selectAll("#zoom"+ name).selectAll("line").style("stroke","red"); 
  }

  function mouseouttxt(d) {

   // d3.select(this).style("font-size", "14px");

  }

  d3.selection.prototype.moveToFront = function() {
    return this.each(function(){
      svg0.appendChild(this);
    });
  };

  function mouseover(d, i) {

    var name = d3.select(this.parentNode).attr('id');
    name = name.replace("svg", "");
        var map = name.split("_")[0];  
    var nChr = name.split("_")[1];

    svg.select("#svg" + name).select("#svgo" + name).selectAll("text").attr("dy", null).text(null);
    svg.select("#svg" + name).select("#svgol" + name).selectAll("line").attr("x1", null).attr("x2", null).attr("y1", null).attr("y2", null);

    d3.select(this).style("stroke", "blue");
    d3.select(this).each(moveToFront);

    function filterByRange(d, a) {
      return a > i - 6 & a < i + 6;
    };

    var pos = chrHgt / 10;

    svg.select("#svg"  + map + "_" +(Number(nChr)+1)).style("opacity", 0);
    svg.select("#svg"  + map + "_" +(Number(nChr)+2)).style("opacity", 0);

    svg.select("#svg" + name).select("#svgo" + name).selectAll("text")
      .filter(filterByRange)
      .attr("dy", function(d, m) { return pos * m; })
      .text(function(d) { return d.markerName; });  

    /*
    svg.select("#svg" + name).select("#svgo" + name).append("rect")
    //.attr("x", width * 1.5)
    //.attr("y", 0)
    .attr("width",chrWdt*3)
    .attr("height", chrHgt)
    .style("fill","yellow")
    .style("fill-opacity","1").moveToFront(); */

    svg.select("#svg" + name).select("#svgol" + name).selectAll("line").filter(filterByRange)
      .attr("x1", function(d) {  if ((d.y1) > 0 & (d.y1) < chrHgt) return d.x2 })
      .attr("x2", function(d) { if ((d.y1) > 0 & (d.y1) < chrHgt) return chrWdt * 1.5})
      .attr("y1", function(d) {  if ((d.y1) > 0 & (d.y1) < chrHgt) return d.y1;})
      .attr("y2", function(d, m) { if ((d.y1) > 0 & (d.y1) < chrHgt) return pos * m; });

  }


  d3.selection.prototype.moveToFront = function() {  
      return this.each(function(){
        this.parentNode.appendChild(this);
      });
    };

  function mouseout(d) {

    var name = d3.select(this.parentNode).attr('id');
    name = name.replace("svg", ""); 
        var map = name.split("_")[0];  
    var nChr = name.split("_")[1];
//svg.select("#svg" + name).select("#svgo" + name).selectAll("rect").style("fill-opacity","0");
    d3.select(this).style("stroke", "gray");
   // svg.selectAll("text").style("font-size", "14px");
    svg.select("#svg" + name).select("#svgo" + name).selectAll("text").transition().delay(1000).attr("dy", null).text(null);
    svg.select("#svg" + name).select("#svgol" + name).selectAll("line").attr("x1", null).transition().delay(1000).attr("x2", null).attr("y1", null).attr("y2", null);
    svg.select("#svg"  + map + "_" + (Number(nChr)+1)).transition().delay(1000).style("opacity", 1);
    svg.select("#svg" + map + "_" + (Number(nChr)+2)).transition().delay(1000).style("opacity", 1);
  }

  function moveToFront() {

    this.parentNode.appendChild(this);
  }


  function onclick() {

    //function to redirect each chr itself web page
    var a = d3.select(this).attr('id');
    list = [];
    svg.select("#" + a).attr("fill", "#C75601");
    list.push(a.replace("rect", "")); 

    document.getElementById("input_chr").value=list;
    document.getElementById("input_map").value=nMap();
    document.getElementById("search_chr").submit();
  }

  function getPosition(labels){
      
      //function to get marker labels position in order to not overlapping each other
      var label1 =[], label2=[], meanL = []; 
      
      label1.push(labels[0].y) ;
      for (var i = 1; i < labels.length; i++) {  
        if (i>0 && labels[i].y-label1[i-1]<8){  label1.push(label1[i-1]+16 ); } 
        else {  label1.push(labels[i].y) ;   }
      }

      var labelsa = labels.reverse();
      
      label2.push(labelsa[0].y);
      for (var i = 1; i < labelsa.length; i++) { 
        if (i>0 &&  label2[i-1]-labelsa[i].y<8){ label2.push(label2[i-1]-16); } 
        else {  label2.push(labelsa[i].y) ;   }
      } 

      label2= label2.reverse();
      for (var i = 0; i < label1.length; i++) { 
           meanL.push({y: (label1[i] + label2[i]) /2, t: labels[i].t, x: labels[i].x, id: labels[i].id, markerDbId: labels[i].markerDbId} );
      } 
      return meanL;
  }


