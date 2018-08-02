
function brush() {
  
   /* Evaluate if it is a brush event or is postion search */ 
     if (d3.event == null){
      //evaluar si las entradas estan vacia

        var name = document.getElementsByClassName("brush")[0].id;
        var maxpos = name.replace("brushid", "max"); 

        y1.domain([0, eval(maxpos)]);
        var ymin = y1(document.getElementById('minrange').value); 
        var ymax = y1(document.getElementById('maxrange').value); 
        var s = [ymin,ymax];  console.log(y1.domain());
        svg.select("#" + name).selectAll("rect").attr("y",ymin).attr("x",0).attr("width",chrWdt).attr("height",ymax-ymin).style("display","inline");
     } else {
        if (!d3.event.sourceEvent) return; // Only transition after input.
        if (!d3.event.selection) return; // Ignore empty selections.
        var name = d3.select(this).attr('id'); 
        var ymin = d3.brushSelection(this)[0]; 
        var ymax = d3.brushSelection(this)[1]; 
        var s = d3.event.selection || y2.range(); 
     }
     
     var chrHgtZoom = chrHgt + chrWdt*2;
     
     var maxpos = name.replace("brushid", "max"); 
     var labels = [], dataL = [], dataL1 = [], links = [],  margin = 0, labelsChrSforComp = [];
     var pos = chrHgt / 10,isLinear = 1; 
     var t = svg.transition().duration(1000).call(slide);
         l = d3.line();

     name = name.replace("brushid", "");
     var zoomSide = sideName(name);
     var chrdistZoom = distToZoom(); 
     var comp = vComp();         //To evaluate if it is for comparative graph

     var force = d3.forceSimulation()
         .force("link", d3.forceLink().id(function(d) { return d.id; })) //.distance(3))
       //  .force("center", d3.forceCenter(chrWdt / 2, chrHgtZoom / 2))
       //  .force("charge", d3.forceManyBody().distanceMin(1).strength(-20));
         .force("collide", d3.forceCollide(9).iterations(100));

    y1.domain([0, eval(maxpos)]);
    y2.domain(s.map(y1.invert, y1));
  
    brushRange = y2.domain()[1] - y2.domain()[0]/10;

    svg.select("#zoom" + name).select("#text" + name).selectAll("text").remove();

    svg.selectAll("#zoom" + name).append("text")
       .attr("dx", 0)
       .attr("dy", width)
       .text(y2.domain()[0])
       .attr("fill", "#B75CA1");
  
    svg.selectAll("#zoom" + name).attr("visibility", "unhidden");
  
    svg.selectAll("#zoom" + name).selectAll("line").attr("x1",0) .attr("x2",0);
 
    svg.selectAll("#zoom" + name).selectAll("line")
        .filter(function(d) { return y2(d.y) > -chrHgtZoom/2 -1  & y2(d.y) < chrHgtZoom/2 + 1 })//.transition(t)
        .attr("x1", function(d) {  return zoomSide*chrdistZoom; })
        .attr("x2", function(d) {  return zoomSide*(chrdistZoom + chrWdt); })
        .attr("y1", function(d,i) {  
                  if (comp==-1) labelsChrSforComp.push({x:comp*zoomSide*(chrWdt/2), y: d.y, t: d.markerName, id: d.markerDbId, markerDbId: d.markerDbId });     
                      var m = {x: 0, d: d.y, n: d.markerName, markerDbId: d.markerDbId , y: y2(d.y), t: d.markerName, id: d.markerDbId }; 
                      dataL.push(m); 
                  if(i > 0) links.push({source: dataL[i-1], target: m}); //it was labels[i-1] I don't know why, verify                 
                return y2(d.y); })
        .attr("y2", function(d) {  return y2(d.y); });

    //To compute new positions
    if (dataL.length > 0){
      labels = getPosition(dataL);  
    } 

    // To search marker and highlight it
    if (comp==-1){
      svg.selectAll("path").remove();
    } 
    else{
      hightlightMarkers(dataL);
      svg.selectAll(".zoom").selectAll(".rect").style("stroke", "red");
    }


    svg.selectAll("#zoom" + name).selectAll(".yaxis").call(yAxisZoomSide(zoomSide));
    
    // To draw pink zoom
    svg.selectAll("#zoom" + name).selectAll("polygon")
      .attr("points", zoomSide*chrWdt/2 + "," + ymin + " " 
        + zoomSide*chrWdt/2 + " ," + ymax  + " " 
        + (zoomSide*chrdistZoom) + "," + (chrHgt/2 + chrWdt)  + " " 
        + (zoomSide*chrdistZoom) + "," + -(chrHgt/2 + chrWdt));

    // To draw marker labels
    svg.selectAll("#zoom" + name).select("#text" + name).selectAll("text.label")  //print marker names
       .data(labels).enter()
       .append("svg:text")
       .classed("label", true)
       .attr("direction", function(d) { if (comp == 1) { if (zoomSide == 1) { return "ltr";} else {return "rtl"; }} else return "rtl"; })  //corregir
       .text(function(d) { return d.t }) 
       .on("mouseover", function(d, i) {     
               d3.selectAll(".active").classed("active", false);
               d3.select(d3.event.target).classed("active", true);
           })
       .on("click",function(d, i) { window.open(brApiSite + "/search/markers/markerinfo.pl?marker_id=" + d.id , '_blank'); });
 
    force
       .nodes(labels)
       .on("tick",  ticked); 
  
    //To draw moving paths
    svg.select("#zoom" + name).selectAll("path.pointer")
      .data(dataL).enter()
      .append("svg:path")
      .attr("id", function(d) {  return "pmk" + (d.markerDbId); })
      .classed("pointer", true)
      .attr("fill", "none")
      .style("stroke", randomColor) 
      .style("stroke-width", 2);

    force.force("link")
      .links(links); 

    if (comp==-1){
      var dataChrT = []; 
      var y0 = vary0();    

//      svg.selectAll("#zoom" + window["target"] ).selectAll("line")
      svg.selectAll("#svg" + window["target"] ).selectAll("line")
        .attr("d", function(d){
          dataChrT.push({x:comp*zoomSide*(chrWdt/2), d: (d.y), n: d.markerName, markerDbId: d.markerDbId });
        });
      drawCompLine(labelsChrSforComp, dataChrT, zoomSide*(chrdistZoom+chrWdt/2), chrdistZoom, y0);  
    }


    function slide(){
      svg.selectAll("#zoom" + name).selectAll("line")
        .attr("y1",100);  
    }
    
    //Function to fix position after links movement
    function ticked() {
      var zoomSide = sideName(name);        //To gice direction to zoom -1 = rtl, 1=ltr
      var chrdistZoom = distToZoom();       //Distance to zoom
      var dcomp=0;                          //Helps to change direction in path.pointer 

      if (comp==-1) dcomp= -comp*chrWdt;    //comp=-1 rtl, labels between chr and zoom

      //Fit labels and path after movement, make changes here
      svg.select("#zoom" + name).select("#text" + name).selectAll("text.label") 
        .attr("id", function(d) {  return "lamk" + (d.markerDbId); })
        .attr("x", function(d) { d.x = chrdistZoom + chrWdt * 2 * comp ;  return zoomSide*d.x; })
        .attr("y", function(d,i) {
                       //    if(d.y > chrHgt + chrWdt) d.y = chrHgt + chrWdt*2;        // arrreglar aca los max y min  ... junto a donde se define la variable
                       return d.y; })
       // .attr("font-size",'20px')
        .style("fill", function(d) {
          if (d.markerDbId == getmarkerid()) return "red";
          else return "black"; });

      svg.select("#zoom" + name).selectAll("path.pointer") 
        .attr("id", function(d) {  return "pmk" + (d.markerDbId); })
        .attr("d", function(d, i) { 
          if (i < labels.length) {
           var s = [zoomSide*(chrdistZoom+dcomp), y2(d.d )],  
           m = [zoomSide*(chrdistZoom+(chrWdt*comp)+dcomp), y2(d.d)],
           e = [zoomSide*(labels[i].x - 5 ), labels[i].y ];    
           return l([s, m, e]);
         }
       });
    }
}

function sideName(name){
  return window['side'+name];
}

function vComp(){
    return window["comp"];  
}

//To get y0 global variable
function vary0(){
    return window["y0"];  
}
