
  function chromosome(data, svg0, width, height, ang0, x, y, mapId, chrId, forZoom, isLinear,nChr,originX,originY,zSide,axisSide,comp, unit,list) {

    //isLinear
    if (isLinear == 0 ) { var va = 2;   }
    else var va = nChr + forZoom + 1;

    var i = mapId + "_" + chrId; 
    var heightZoom = height + width*2;
    var distZoom = distToZoom(); 

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
      .attr("dy", -(height + width * 2)/2 -1) 
      .text("Chr " + i.split("_")[1])
      .attr("font-size",12) // 
      .attr("fill", "#B75CA1");

    svg.append("text")
       .attr("dx", -width*1.5)
       .attr("dy", -(height + width )/2 -1 ) 
       .text(unit)
       .attr("font-size",10);    

    svg.append("rect")
        .attr("id", "rect" + i)
        .attr("x", -width / 2)
       .attr("y", -(height + width * 2)/2 ) 
        .attr("rx", width/2)
        .attr("ry", width/2)
        .attr("width", width)
        .attr("height", height + width * 2)
        .attr("fill", 'transparent')
        .attr("stroke", "black")
        .style("stroke-width", 1)
        .on('click', onclick)
        .on("mouseover", function(d) {    
          if (window['side'+i]==1) { var st ='s' }
          else {var st ='t' };
          d3.select("svg").selectAll("[id*='_" +st + chrId + "_']").attr("stroke", "navy");
          tooltip.select('.label').html("hi"); })
        .on("mouseout", function(d) {  
          if (window['side'+i]==1) { var st ='s' }
          else {var st ='t' };  
          d3.select("svg").selectAll("[id*='_"+st + chrId + "_']").attr("stroke", "lightgray");
          });
    var  markerColor;
    if (comp ==true && forZoom ==0) markerColor=randomColor(); 
    else markerColor=randomColor;


    svg.selectAll("line.horizontal")
        .attr("id", "lines" + i)
        .data(dataT)
      .enter().append("svg:line")
        .attr("id", function(d) {  return "lmk" + i + "-" + (d.markerDbId); })
        .attr("x1", function(d) { return d.x1;  })
        .attr("y1", function(d) { return d.y1;  })
        .attr("x2", function(d) { return d.x2;  })
        .attr("y2", function(d) { return d.y2;  })
        .style("stroke", markerColor) 
        .style("stroke-width", 2)
        .on("mouseover", mouseover)
        .on("mouseout", mouseout)
        .attr("transform", "rotate(" + -ang0 + ") ");

    svg.append("text")
       .attr("id", "mksearched")
       .attr("dx", width*2)
       .attr("dy", null ) 
       .style("fill", "red");
       // .attr("font-size",16);   


    /* Draw objects when require a zoom in chromosome */

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
        .attr("transform", " translate(" + ( width / 2 * axisSide) + ","+ (0)  + ")")
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
        .attr("x", width*(zoomSide-1)/2+distZoom*zoomSide)
        .attr("y", -width-height/2)
        .attr("width", width)
        .attr("height", heightZoom)
        .attr("fill", 'transparent')
        .attr("stroke", "black");

      zoom.append("g").attr("id", "text" + i).selectAll("text")
        .data(dataZoom)
        .enter().append("text")        
        .attr("class", "label-bg")
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

      /* cM for axes */
      // zoom.append("text")
      //   .attr("dx", distZoom-20)
      //   .attr("dy", -width-3-height/2)
      //   .text("cM");
        // .attr("font-size",16);  

      /* Symbol close [X] */
      zoom.append("text")
        .attr("id", "close" + i)
        .attr("dx", distZoom*zoomSide) // width*(zoomSide-1)/2+distZoom*zoomSide/2) 
        .attr("dy", -width*1.5-height/2-5)
        .text("[x] Close")
        .style("stroke", "red")
        .on('click', function() {
            zoom.attr("visibility", "hidden");
            zoom.selectAll("path.pointer").style("stroke", "lightgray");

       svg.selectAll("#lmk" +s+'-' +id).style("stroke", "red").style("stroke-width", 4);
    });

      zoom.attr("visibility", "hidden");

    } else {

      /* Draw chromosomes for index, not zoom */  

      svg.append("g")
        .attr("id", "yaxis" + i)
        .attr("class", "axis")
        .attr("width", 10)
        .attr("height", 10)
        .attr("y", -35)
        .style("stroke-width", 0)
        .attr("transform", " translate(" + ( width / 2 * axisSide) + ","+ (0)  + ")")
        .call(yAxisSide(axisSide));

      if (window['comp'] == false){

          svg.append("g").attr("id", "svgog" + i).selectAll("text.horizontal")
            .attr("id", "textxg" + i)
            .data(dataT)
            .enter().append("text")
              .attr("class", "label-bg")
              .attr("dx", width * 1.5)
              .attr("height", 0);

          svg.append("g").attr("id", "svgo" + i).selectAll("text.horizontal")
            .attr("id", "textx" + i)
            .data(dataT)
            .enter().append("text")
              .attr("class", "label")
              .attr("dx", width * 1.5)
              .attr("height", 0)
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

    svg.selectAll("#zoom" + name).selectAll("text"); //.style("font-size", "18px");
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
        this.parentNode.appendChild(this);
      });
    };


  /* Mouseover and mouseout for markers in all maps - index */

  function mouseover(d, i) {

    var name = d3.select(this.parentNode).attr('id');
    name = name.replace("svg", "");

    d3.select("svg").selectAll("*:not(#svg"+name +")").selectAll("[id^=svgog]").selectAll("text").attr("dy", null).text(null);
    d3.select("svg").selectAll("*:not(#svg"+name +")").selectAll("[id^=svgo]").selectAll("text").attr("dy", null).text(null);
    d3.select("svg").selectAll("*:not(#svg"+name +")").selectAll("[id^=svgol]").selectAll("line").attr("x1", null).attr("x2", null).attr("y1", null).attr("y2", null);

    svg.select("#svg" + name).select("#svgog" + name).selectAll("text").attr("dy", null).text(null);
    svg.select("#svg" + name).select("#svgo" + name).selectAll("text").attr("dy", null).text(null);
    svg.select("#svg" + name).select("#svgol" + name).selectAll("line").attr("x1", null).attr("x2", null).attr("y1", null).attr("y2", null);

    d3.select(this).style("stroke", "blue");
    d3.select(this).each(moveToFront);

    function filterByRange(d, a) {
      return a > i - 6 & a < i + 6;
    };

    var pos = chrHgt / 10 ;

    svg.select("#svg" + name).select("#svgog" + name).selectAll("text")
      .filter(filterByRange)
      .attr("dy", function(d, m) { return pos * m - chrHgt/2; })
      .text(function(d) { return " " + d.markerName; });//.moveToFront();  

    svg.select("#svg" + name).select("#svgo" + name).selectAll("text")
      .filter(filterByRange)
      .attr("dy", function(d, m) { return pos * m - chrHgt/2; })
      .text(function(d) { return d.markerName; }).style("font-size", "10px");//.moveToFront();  

    svg.select("#svg" + name).select("#svgol" + name).selectAll("line").filter(filterByRange)
      .attr("x1", function(d) {  if ((d.y1) > - chrHgt/2 -1 & (d.y1) < chrHgt) return d.x2 })
      .attr("x2", function(d) { if ((d.y1) > - chrHgt/2 -1 & (d.y1) < chrHgt) return chrWdt * 1.5})
      .attr("y1", function(d) {  if ((d.y1) > - chrHgt/2 -1 & (d.y1) < chrHgt) return d.y1 ;})
      .attr("y2", function(d, m) { if ((d.y1) > - chrHgt/2 -1 & (d.y1) < chrHgt) { return pos * m - chrHgt/2; } });
  }


  /* Mouseout for markers in all maps - index */

  function mouseout(d) {

    var name = d3.select(this.parentNode).attr('id');
    name = name.replace("svg", ""); 

    var map = name.split("_")[0];  
    var nChr = name.split("_")[1];

    d3.select(this).style("stroke", randomColor);

    svg.select("#svg" + name).select("#svgog" + name).selectAll("text").transition().delay(5000).attr("dy", null).text(null);
    svg.select("#svg" + name).select("#svgo" + name).selectAll("text").transition().delay(5000).attr("dy", null).text(null);
    svg.select("#svg" + name).select("#svgol" + name).selectAll("line").transition().delay(5000).attr("x1", null).attr("x2", null).attr("y1", null).attr("y2", null);
  }

  function moveToFront() {

    this.parentNode.appendChild(this);
  }


  function onclick() {

    //function to redirect each chr itself web page
    var a = d3.select(this).attr('id');
    listA = []; 
    listA.push(a.replace("rect", "")); 
    var res = a.replace("rect", "").split("_");     
    
    if (window['comp'] != true){
      window.location='/Map/view_chr?map='+res[0]+'&chr=' + res[1]; // + '&list=' + list;
    }
  }

  function getPosition(labels){
      //function to get marker labels position in order to not overlapping each other
      var u, label1 =[], label2=[], meanL = []; 
      
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
          u = (label1[label1.length-i-1] + label2[label1.length-i-1]) /2;
          meanL.push({y: u, t: labels[i].t, x: labels[i].x, id: labels[i].id, markerDbId: labels[i].markerDbId} ); 
      }
      return meanL;
  }

  escapeSpecialChars = function(string) {
        return string.replace(/[-\/\\^$*+?:.()|[\]{}]/g, '\\$&')
      };

  function hightlightMarkers(labels){
      
      var name;

      for (var i = 1; i < labels.length; i++) { 
        labels[i].markerDbId=labels[i].markerDbId.replace(/\./g,''); 
        name =escapeSpecialChars(labels[i].markerDbId) ;
        svg.selectAll("#lpmk"+ name).style("stroke", "red").moveToFront();
      }
   }


  Number.prototype.between = function ([min, max]) {
      return this >= min && this <= max;
  };


  function searchmarker(idx,nchr){
      var id=null, position;
      id=idx;

      if (id == null){
          alert("Marker not found");
      } 
      else{
        var s=nMap() + "_" + nchr; 
        svg.selectAll("line").style("stroke", "lightgray").style("stroke-width", 2);
        svg.selectAll("#lmk" +s+'-' +id).style("stroke", "red").style("stroke-width", function (d){  position = d.y1; return 4}).moveToFront(); //marker in main
        svg.selectAll("#lamk"+id).style("fill", "red").moveToFront();
        var visible   = svg.select("#zoom"+s).attr("visibility");
        
        if (visible == 'unhidden'){
          svg.select("#zoom"+s).selectAll("path.pointer").style("stroke-width", "2");
          svg.select("#zoom"+s).selectAll("#pmk"+id).style("stroke", "red").moveToFront();  ///marker in zoom
          svg.selectAll("#lamk"+id).style("fill", "red").moveToFront(); //label in zoom
        } else {
          svg.selectAll("#lmk" +s+'-' +id)
              .style("stroke", "red")
              .style("stroke-width", function(d){ 
                    svg.select("#mksearched").attr("dy", d.y1).text(d.markerName); 
                    return 4 })
              .attr("x2", svg.select("#mksearched").attr("dx")).moveToFront();
        }
        document.getElementById('minrange').value=y1.invert(position)-5; 
        document.getElementById('maxrange').value=y1.invert(position)+5;
        brush(); 
      }
  }
  

  function searchmarkerid(name){
     
      var id=null, position; 
      var t=window['target'], s=window['source'];
      svg.selectAll("line").style("stroke-width", function(d){ if (d.markerName == name) { id = d.markerDbId; }; return "2"}); // que busque en el target tambien

      if (id == null){
          alert("Marker not found");
      } 
      else{
        svg.selectAll("line").style("stroke", "lightgray").style("stroke-width", 2);
        svg.select("#zoom"+s).selectAll("path.pointer").style("stroke", "lightgray");
        svg.select("#zoom"+s).selectAll("path.pointer").style("stroke-width", "2"); //function(d){ if (d.n == name) id= d.markerDbId;  return "2"});
        svg.selectAll("#lmk" +s+'-' +id).style("stroke", "red").style("stroke-width", function(d){ if (d.markerName == name) { position = d.y1;}; return  4}).moveToFront();
        svg.selectAll("#lmk" + t + '-' + id).style("stroke", "red").style("stroke-width", 4).moveToFront();
        svg.select("#zoom"+s).selectAll("#pmk"+id).style("stroke", "red").moveToFront();
        svg.select("#zoom"+s).selectAll("#lamk"+id).style("background-color", "red").moveToFront();
        svg.selectAll("#lamk"+id).style("fill", "red").moveToFront();
        svg.selectAll("#lpmk"+id).style("stroke", "red").moveToFront();
        document.getElementById('minrange').value=y1.invert(position)-5; 
        document.getElementById('maxrange').value=y1.invert(position)+5;
        brush();
      } 
  }
  function getId(array,name){
  /*    var a = array.indexOf("TG183"); console.log(a);
      return a;*/
  }


  function getIdColumnJSON(array,column){
    var element=[]; 

    for(x in array){
       element.push({
        id: array[x]["id"],
        col: array[x][column]
     });
    }
    return element;
  }

