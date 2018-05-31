
 function selectCompMap(data,map,data1,map1,nChr1,nChr2,y0,originX,originY) {

  if (nChr1>1){  document.getElementById('before').innerHTML = "< Chr " + (+nChr1-1); } else { document.getElementById('before').innerHTML = ""; }
  if (nChr1<12){  document.getElementById('after').innerHTML = "Chr " + (+nChr1+1) + " >"; } else { document.getElementById('after').innerHTML = ""; }
  if (nChr2>1){  document.getElementById('before2').innerHTML = "< Chr " + (+nChr2-1); } else { document.getElementById('before2').innerHTML = ""; }
  if (nChr2<12){  document.getElementById('after2').innerHTML = "Chr " + (+nChr2+1) + " >"; } else { document.getElementById('after2').innerHTML = ""; }

        svg.selectAll("*").remove();

        var list = [nChr1,nChr2];
        window["source"] = map + "_" + list[0];
        window["target"] = map1 + "_" + list[1];

        axisSide = 1;

        // Draw each chr 
        chromosome(data, svg, chrWdt, chrHgt, 0, radius * 0.25 , y0,map, list[0], 1,isLinear,1,originX,originY,axisSide, 1,-1); 
        chromosome(data1, svg, chrWdt, chrHgt, 0, radius, y0,map1, list[1], 0,isLinear,1,originX,originY,axisSide2, chrZSide2,-1);

        //for links
        var s,t;
        var IdMarkers = getCommonColumn(data,data1,"markerDbId"); 
        var datal = [];
	var maxs = d3.max(data, function(d) { return +d.position;  });
        var maxt = d3.max(data1, function(d) { return +d.position;  });

        for (var i = 0; i < IdMarkers.length; i++) {  
          s = data.filter( function(char) { if (char.markerDbId===IdMarkers[i])  return char; });
          t = data1.filter( function(char) { if (char.markerDbId===IdMarkers[i])  return char; });

             datal.push({
                    "chrs": s[0].linkageGroup, 
                    "s": (+s[0].position),  
                    "chrt": t[0].linkageGroup, 
                    "t": (+t[0].position), 
                    "markerDbId": IdMarkers[i]});
        }

        var ang = 0;
        var dataForLink = transfLinkData_by2(datal, ang, chrWdt, radius, 0 , 0, maxs, maxt); 
        
        links(dataForLink, svg, 0, chrWdt, chrHgt, 0, radius * 0.25, 0, 0 , y0, originX,originY,0);

 };


  function links(data, svg, ang, chrWdt, chrHgt, radius, x1, x2,x0, y0,originX,originY,zoom2chr ) {

   // if (zoom2chr == 1 ) zoom2chr = chrWdt;  //It add height depending if the link is between chromosomes or zoom to chr 
    //console.log(x1 +" - "+x2);
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
        .on('mouseover', function(d) {
           d3.select(this).attr("stroke", "#C75601");
         //  alert("marker:"+d.markerDbId);
    }); //.text(function(d) { alert ("er") ; return "--->" + d.markerDbId ; });


 
    svg.selectAll("text")
            .data(data)
            .enter()
        .append("text")
            .attr("x", 8)
            .attr("dy", 28)
           .append("textPath")
        .attr("xlink:href", function (d) { return "#lpmk" + (d.markerDbId); })
        .text(function (d) { return "hola-lpmk" + (d.markerDbId); });




    function link(d) { 
  /*    var text = svg.append("text")
    .attr("x", d.tx +x2)
    .attr("dy",  d.ty);

        text.append("textPath")
    .attr("xlink:href","lpmk" + (d.markerDbId))
          .attr("transform", " translate(" + (originX) + "," + (originY +y0) + ") ") 

    .text("My counter text");*/

      if (zoom2chr == 1 ) {
       return "M" + (d.tx +x2 ) + " " + ( d.ty)
              + "1"
              + " " + (d.sx+ x1 ) + " " +  (d.sy);
      } else { 
        return "M" + (d.tx+ x2 -x0 ) + "," + ( d.ty)
            + "C" + (d.tx+ x2 -x0 ) + "," +  ((d.ty + d.sy) / 2)
            + " " + (d.sx+ x1+x0) + "," +  ((d.ty + d.sy) / 2)
            + " " + (d.sx+ x1+x0) + "," +  (d.sy); 

      }
    } 
  } 

  function onclicklink(d) {

    //function to redirect each chr itself web page
   // d3.select(this).attr("stroke", "#C75601");
        alert("marker:"+d.markerDbId);
  }

  function getMatrixLinks(chrS,chrT,valueToJoin,chrdistZoom){ //Sirve para el grande tambien
    
    var links=[];
    var chr1, chr2; 

    for (var i = 0; i < valueToJoin.length ; i++) { 

       chr1 = chrS.filter(function(d) { return d.markerDbId == valueToJoin[i] }); 
       chr2 = chrT.filter(function(d) { return d.markerDbId == valueToJoin[i] }); 

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

        links(dataLinks, svg, 0, chrWdt, chrHgt, 0, radius *0.25 + chrWdt , 0, x0, y0, originX+x , originY,1);

   }



