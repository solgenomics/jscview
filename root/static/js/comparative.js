
 function selectCompMap(data,map,data1,map1,nChr) {

        svg.selectAll("*").remove();

        var list = [nChr,nChr];
              window["source"] = map + "_" + list[0];
              window["target"] = map1 + "_" + list[1];

        var originX = 150, originY = 100;
        var y0 = 0;

        axisSide = 1// Math.pow(-1,(1));

        // Draw each chr 
        chromosome(data, svg, chrWdt, chrHgt, 0, radius * 0, y0,map, list[0], 1,isLinear,5,originX,originY,axisSide, 1,-1);
        chromosome(data1, svg, chrWdt, chrHgt, 0, radius, y0,map1, list[1], 1,isLinear,5,originX,originY,axisSide2, chrZSide2,-1);

     //   links(dataLinks, svg, 0, chrWdt, chrHgt, 0, chrWdt, radius, y0, originX,originY);
 };


  function links(data, svg, ang, chrWdt, chrHgt, radius, x1, x2, y0,originX,originY,zoom2chr ) {
    


    if (zoom2chr == 1 ) zoom2chr =chrWdt;  //It add height depending if the link is between chromosomes or zoom to chr 

    svg.append("g")
      .attr("class", "link")
      .selectAll("path")
      .data(data)
      .enter().append("path")
      .attr("id", function(d) {  return "lpmk" + (d.markerDbId); })
      .attr("d", link)
      .style("opacity", 1)
      .attr("transform", " translate(" + (originX) + "," + (originY + y0) + ") ");

    function link(d) {
    /*
      if (zoom2chr == 1 ) {
       return "M" + (d.tx+ x2) + " " + ( d.ty)
              + "1"
              + " " + (d.sx+ x1) + " " +  (d.sy);
   /*   } else { 
      */  return "M" + (d.tx+ x2) + "," + ( d.ty)
            + "C" + (d.tx+ x2) + "," +  ((d.ty + d.sy) / 2)
            + " " + (d.sx+ x1) + "," +  ((d.ty + d.sy) / 2)
            + " " + (d.sx+ x1) + "," +  (d.sy); 

     // }
    }
  }

  function getMatrixLinks(chrS,chrT,valueToJoin,chrdistZoom){ //Sirve para el grande tambien
    
    var links=[];
    var chr1, chr2; 

    for (var i = 0; i < valueToJoin.length ; i++) { 
       chr1 = chrS.filter(function(d) { return d.markerDbId == +valueToJoin[i] }); 
       chr2 = chrT.filter(function(d) { return d.markerDbId == +valueToJoin[i] }); 

       /*links.push({ "chrs": chr1[0].linkageGroup , 
                  "s": chr1[0].position,  
                  "chrt": chr2[0].linkageGroup, 
                  "t": chr2[0].position });*/
           links.push({ "chrs": 1 , 
                  "sx": (+chr1[0].x),  
                  "sy": y2(+chr1[0].y),  
                  "chrt": 9, 
                  "tx": +radius - chrdistZoom -chrWdt, ///+chr2[0].x  //2 + chrWdt*1.1,  //(+radius/2+chrWdt*0.6), //arreglar x 
                  "ty": (+chr2[0].d), //-chrWdt*0.5),    //arreglar
                  "markerDbId": chr2[0].markerDbId});
    }

    return links;
  }

  // Called in brush
  function drawCompLine(labels,chrT,x,chrdistZoom){

        var IdMarkers = getCommonColumn(labels,chrT,"markerDbId"); 
        var targetChr = []; 
        var t=window['target'];
         //Filter chrT with markers selected

        for (var i = 0; i < IdMarkers.length; i++) {  

          targetChr.push({
                          x: document.getElementById('lmk'+ t +'-'+ IdMarkers[i]).getAttribute('x1'),
                          d: document.getElementById('lmk'+ t +'-'+ IdMarkers[i]).getAttribute('y1'), 
                          markerDbId: IdMarkers[i] });
        }

        //Pass data to construct links
        var dataLinks = getMatrixLinks(labels,targetChr,IdMarkers,chrdistZoom);

        links(dataLinks, svg, 0, chrWdt, chrHgt, 0, chrWdt, 0, 0, 150 + x, 100,1);

   }


  function searchmarker(id){

      var t=window['target'], s=window['source'];

      svg.selectAll("line").style("stroke", "lightgray").style("stroke-width", 2);
      svg.select("#zoom"+s).selectAll("path.pointer").style("stroke", "lightgray");
      svg.selectAll("#lmk" +s+'-' +id).style("stroke", "red").style("stroke-width", 4);
      svg.selectAll("#lmk" + t + '-' + id).style("stroke", "red").style("stroke-width", 4);
      svg.select("#zoom"+s).selectAll("#pmk"+id).style("stroke", "red");
      svg.selectAll("#lpmk"+id).style("stroke", "red");

  }
  function searchmarkerid(name){
     
      var id; 
      var t=window['target'], s=window['source'];

      svg.selectAll("line").style("stroke", "lightgray").style("stroke-width", 2);
      svg.select("#zoom"+s).selectAll("path.pointer").style("stroke", "lightgray");
      svg.select("#zoom"+s).selectAll("path.pointer").style("stroke-width", function(d){ if (d.n == name) id= d.markerDbId;  return "2"});
console.log(name + ":"+id);
      svg.selectAll("#lmk" +s+'-' +id).style("stroke", "red").style("stroke-width", 4);
      svg.selectAll("#lmk" + t + '-' + id).style("stroke", "red").style("stroke-width", 4);
      svg.select("#zoom"+s).selectAll("#pmk"+id).style("stroke", "red");
      svg.selectAll("#lpmk"+id).style("stroke", "red");

  }
  function getId(array,name){
      var a = array.indexOf("TG183"); console.log(a);
      return a;
  }


  function getIdColumnJSON(array,column){
    var element=[]; 

    for(x in array){
     //  for (var x = 0; x < array.length ; x++) { 

       element.push({
        id: array[x]["id"],
        col: array[x][column]
     });
    }
    return element;
  }

