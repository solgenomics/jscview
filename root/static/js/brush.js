
function brush() {

  if (!d3.event.sourceEvent) return; // Only transition after input.
  if (!d3.event.selection) return; // Ignore empty selections.

    var chrHgtZoom = chrHgt + chrWdt*2,
        chrdistZoom = distToZoom(); //chrWdt * 3 + isLinear*200;

    var name = d3.select(this).attr('id');
    var maxpos = name.replace("brushid", "max");
    var s = d3.event.selection || y2.range(); 
    var labels = [], dataL = [], links = [],  margin = 0;
    var pos = chrHgt / 10;
    var t = svg.transition().duration(1000).call(slide);
    l = d3.line();  

    name = name.replace("brushid", "");

    svg.select("#zoom" + name).select("#text" + name).selectAll("text").remove();
    svg.select("#zoom" + name).select("#path" + name).selectAll("path.pointer").remove();
    
    y1.domain([0, eval(maxpos)]);
    y2.domain(s.map(y1.invert, y1));

    svg.selectAll("#zoom" + name).append("text")
      .attr("dx", 0)
      .attr("dy", width)
      .text(y2.domain()[0])
      .attr("fill", "#B75CA1");

    svg.selectAll("#zoom" + name).attr("visibility", "unhidden");

    brushRange = y2.domain()[1] - y2.domain()[0]/10;

    svg.selectAll("#zoom" + name).selectAll("line").attr("x1",0) .attr("x2",0);

    var zoomSide=window['side'+name];

    svg.selectAll("#zoom" + name).selectAll("line")
      .filter(function(d) { return y2(d.y) > -chrWdt -1  & y2(d.y) < chrHgtZoom - chrWdt + 1 }).transition(t)
      .attr("x1", function(d) {  return zoomSide*chrdistZoom; })
      .attr("x2", function(d) {  return zoomSide*(chrdistZoom + chrWdt); })
      .attr("y1", function(d,i) {  
         var n = {x: 100, y: y2(d.y), t: d.markerName, id: d.markerDbId }; 
                labels.push(n); 
         var m = {x: 100, d: d.y, n: d.markerName}; 
                dataL.push(m); 
         if(i > 0) links.push({source: labels[i-1], target: n});
        return y2(d.y); })
      .attr("y2", function(d) {  return y2(d.y); })
      .attr('opacity', 0.125);

    svg.selectAll("#zoom" + name).selectAll(".yaxis").call(yAxisZoomSide(zoomSide));

    svg.selectAll("#zoom" + name).selectAll("polygon")
      .attr("points", zoomSide*chrWdt/2 + "," + d3.brushSelection(this)[0] + " " 
        + zoomSide*chrWdt/2 + " ," + d3.brushSelection(this)[1]  + " " 
        + (zoomSide*chrdistZoom) + "," + (chrHgt + chrWdt)  + " " 
        + (zoomSide*chrdistZoom) + "," + -chrWdt);

    var labels2=(getPosition(labels)); 

    svg.selectAll("#zoom" + name).select("#text" + name).selectAll("text.label")  //print names
      .data(labels2).enter()
      .append("svg:text")
      .classed("label", true)
      .attr("direction", function(d) { if (zoomSide == -1) {return "rtl";} else return "ltr"; }) 
      .attr("x", function(d) { d.x = chrdistZoom + chrWdt * 2;  return zoomSide*d.x; })
      .attr("y", function(d) { return d.y }) 
      .text(function(d) { return d.t }) 
      .on("mouseover", function(d, i) {     
              d3.selectAll(".active").classed("active", false);
              d3.select(d3.event.target).classed("active", true);
          })
      .on("click",function(d, i) { window.open("https://solgenomics.net/search/markers/markerinfo.pl?marker_id=" + d.id , '_blank'); });

      svg.select("#zoom" + name).select("#path" + name).selectAll("path.pointer") //  links
        .data(dataL).enter()
        .append("svg:path")
        .classed("pointer", true)
        .attr("fill", "none")
        .style("stroke", randomColor)
        .style("stroke-width", 2)
        .attr("d", function(d, i) { 
          if (i < labels2.length) { 
               var s = [zoomSide*chrdistZoom, y2(d.d )],
                    m = [zoomSide*(chrdistZoom+chrWdt), y2(d.d)],
                    e = [zoomSide*labels2[i].x - 5, labels2[i].y ]; 
              return l([s, m, e]);
            }
            });

   function slide(){
    svg.selectAll("#zoom" + name).selectAll("line")
    .attr("y1",100);  
  }
  }
