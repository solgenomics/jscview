
 function selectCompMap(data,map,data1,map1,nChr1,nChr2,y0) {

  if (nChr1>1){  document.getElementById('before').innerHTML = "< Chr " + (+nChr1-1); } else { document.getElementById('before').innerHTML = ""; }
  if (nChr1<12){  document.getElementById('after').innerHTML = "Chr " + (+nChr1+1) + " >"; } else { document.getElementById('after').innerHTML = ""; }
  if (nChr2>1){  document.getElementById('before2').innerHTML = "< Chr " + (+nChr2-1); } else { document.getElementById('before2').innerHTML = ""; }
  if (nChr2<12){  document.getElementById('after2').innerHTML = "Chr " + (+nChr2+1) + " >"; } else { document.getElementById('after2').innerHTML = ""; }

        svg.selectAll("*").remove();

        var list = [nChr1,nChr2];
              window["source"] = map + "_" + list[0];
              window["target"] = map1 + "_" + list[1];

        var originX = 150, originY = 100;

        axisSide = 1;// Math.pow(-1,(1));

        // Draw each chr 
        chromosome(data, svg, chrWdt, chrHgt, 0, radius * 0 , y0,map, list[0], 1,isLinear,5,originX,originY,axisSide, 1,-1);
        chromosome(data1, svg, chrWdt, chrHgt, 0, radius, y0,map1, list[1], 1,isLinear,5,originX,originY,axisSide2, chrZSide2,-1);

     //   links(dataLinks, svg, 0, chrWdt, chrHgt, 0, chrWdt, radius, y0, originX,originY);
      //    links(data, svg, 0, chrWdt, chrHgt, 0, chrWdt, radius, y0, originX,originY);

 };


  function links(data, svg, ang, chrWdt, chrHgt, radius, x1, x2,x0, y0,originX,originY,zoom2chr ) {

    if (zoom2chr == 1 ) zoom2chr = chrWdt;  //It add height depending if the link is between chromosomes or zoom to chr 

    svg.append("g")
      .attr("id", "path-multi")
      .attr("class", "link")
      .selectAll("path")
      .data(data)
      .enter().append("path")
      .attr("id", function(d) {  return "lpmk" + (d.markerDbId); })
      .attr("d", link)
      .style("opacity", 1)
      .style("stroke-width", 1)
      .attr("transform", " translate(" + (originX) + "," + (originY +y0) + ") ")
       .on('click', onclicklink);

    function link(d) {
    /*
      if (zoom2chr == 1 ) {
       return "M" + (d.tx+ x2) + " " + ( d.ty)
              + "1"
              + " " + (d.sx+ x1) + " " +  (d.sy);
   /*   } else { 
      */  return "M" + (d.tx+ x2 -x0 ) + "," + ( d.ty)
            + "C" + (d.tx+ x2 -x0 ) + "," +  ((d.ty + d.sy) / 2)
            + " " + (d.sx+ x1+x0) + "," +  ((d.ty + d.sy) / 2)
            + " " + (d.sx+ x1+x0) + "," +  (d.sy); 

     // }
    }
  }

  function onclicklink() {

    //function to redirect each chr itself web page
    d3.select(this).attr("stroke", "#C75601");
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
  function drawCompLine(labels,chrT,x,chrdistZoom,y0){

        var IdMarkers = getCommonColumn(labels,chrT,"markerDbId"); 
        var targetChr = []; 
        var t=window['target'];
        var x0 = 0;
         //Filter chrT with markers selected

        for (var i = 0; i < IdMarkers.length; i++) {  

          targetChr.push({
                          x: document.getElementById('lmk'+ t +'-'+ IdMarkers[i]).getAttribute('x1'),
                          d: document.getElementById('lmk'+ t +'-'+ IdMarkers[i]).getAttribute('y1'), 
                          markerDbId: IdMarkers[i] });
        }

        //Pass data to construct links
        var dataLinks = getMatrixLinks(labels,targetChr,IdMarkers,chrdistZoom);

        links(dataLinks, svg, 0, chrWdt, chrHgt, 0, chrWdt, 0, x0, y0, 150 + x, 100,1);

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
      svg.selectAll("#lmk" +s+'-' +id).style("stroke", "red").style("stroke-width", 4);
      svg.selectAll("#lmk" + t + '-' + id).style("stroke", "red").style("stroke-width", 4);
      svg.select("#zoom"+s).selectAll("#pmk"+id).style("stroke", "red");
      svg.select("#zoom"+s).selectAll("#lamk"+id).style("background-color", "red");
      svg.selectAll("#lamk"+id).style("fill", "red"); 
      svg.selectAll("#lpmk"+id).style("stroke", "red"); 
  }
  function getId(array,name){
  /*    var a = array.indexOf("TG183"); console.log(a);
      return a;*/
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

