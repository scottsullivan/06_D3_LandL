const margin = {top: 10, right: 30, bottom: 30, left: 40},
    width = 1000 - margin.left - margin.right,
    height = 700 - margin.top - margin.bottom,
    radius = 20,
    binNum = 15;
    
 let pitchSelect = "All Pitches";
 var dSet, hexbin, centers;


//--------------------------- MOUSE INTERACTIONS
function mover(d) {
  var el = d3.select(this)
		.transition()
		.duration(10)		  
		.style("fill-opacity", 0.3)
    ;
}

function mout(d) { 
	var el = d3.select(this)
	   .transition()
	   .duration(1000)
	   .style("fill-opacity", 1)
	   ;
};

//make pitch groups to match DL
//--------------------------- DROPDOWN
const pitches = ["All Pitches", "Fastball", "Slider", "Curveball", "Changeup"]

//makes dropdown
const select = d3.select('#selectButton')
  .selectAll('option')
	.data(pitches).enter()
	.append('option')
	.text(function (d) { return d; })
  .attr("value", function (d) { return d; });


//--------------------------- SVG
const svg = d3.select("#chart-area")
  .append("svg")
    .attr("viewBox", [0, 0, width + margin.left + margin.right, height + margin.top + margin.bottom])
  
const g = svg.append("g")
    .attr('id', 'the-hexagons')
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

const grids = svg.append("g")
    .attr('id', 'the-0lines')
    .attr("transform", `translate(${margin.left}, ${margin.top})`);


//--------------------------- AXES
const xAxisGroup = g.append('g')
  .attr("class", "x axis")
  .attr("transform", `translate(0, ${height})`)

const yAxisGroup = g.append("g")
  .attr("class", "x axis")
    
//--------------------------- DATA
d3.csv("data/pitches.csv").then(data => {
  filterPitch(data)
  update(data) //run update on load
  console.log(pitchSelect)

  d3.select("#selectButton")
  .on("change", function(event,d) {
    const selectedOption = d3.select(this).property('value')
    console.log(selectedOption)
    pitchSelect = selectedOption

  filterPitch(data)
  update(data)
  })

});//end data



//////////// UPDATE //////////// UPDATE //////////// UPDATE //////////// UPDATE //////////// UPDATE 
function update(data){
  
  // Add X axis & 0-lines
  const x = d3.scaleLinear()
    .domain([d3.min(data, d => d.pitchx), d3.max(data, d => d.pitchx)])
    .range([ 0 , width ]);
    xAxisGroup.call(d3.axisBottom(x));
  
    function make_x_gridlines() {		
      return d3.axisBottom(x)
          .ticks(1)
    }

  //Add Y axis
  const y = d3.scaleLinear()
    .domain([d3.min(data, d => d.pitchy), d3.max(data, d => d.pitchy)])
    .range([ height, 0 ]);
    yAxisGroup.call(d3.axisLeft(y));

    function make_y_gridlines() {		
      return d3.axisLeft(y)
          .ticks(1)
    }
  
  // hexbin parameters
  const hexbin = d3.hexbin()
    .radius(`${radius}`) // size of the bin in px
    .extent([ [0, 0], [width, height] ])
    .x(d => x(d.pitchx))
    .y(d => y(d.pitchy))

  dSet = hexbin(data).sort((a,b) => b.length - a.length)
  centers = hexbin.centers(data)

  console.log(centers)

  secondSet = dSet.filter(d => d.length>1)
    .forEach(d => {
    d.median_stuff = d3.mean(d, d => d.stuff)
    d.median_x = d3.mean(d, d => d.pitchx)
    d.median_y = d3.mean(d, d => d.pitchy)
  })

  console.log(dSet)


  
  const stuffRange = d3.extent(dSet, d => d.median_stuff)
  console.log(stuffRange)

  const color = d3.scaleSequential(d3.interpolateRdBu)
    .domain([135, 65.5])


//make the hexagons
  const hexagons = g.selectAll("path")
  .data( dSet )
  
//make the hexagons
  const hovers = g.selectAll("rect")
  .data( centers )

  // EXIT old elements not present in new data
  hexagons.exit().remove()
  
  grids.selectAll('g').remove()

  hexagons
  .join("path").filter(d => d.length>1)
    .attr("d", hexbin.hexagon())
    .attr("transform", d => `translate(${d.x},${d.y})`)
    .attr("fill", d => color(d.median_stuff))
      .attr("stroke", "white")
      .attr("stroke-width", "0.2")
      .attr('id', d => "len: " + d.length + " x: " + d.median_x + " y: " + d.median_y + " stuff: " + d.median_stuff)
      .on("mouseover", mover).on("mouseout", mout)

  hovers
  .append("rect")
        //.attr("d", hexbin.rect())
        .attr("transform", d => `translate(${d.x},${d.y})`)
        .attr('width', 50)
        .attr('height', 50)
        .attr("fill", d => color(d.median_stuff))
          .attr("stroke", "white")
          .attr("stroke-width", "0.2")
          .attr('id', d => "len: " + d.length + " x: " + d.median_x + " y: " + d.median_y + " stuff: " + d.median_stuff)
          .on("mouseover", mover).on("mouseout", mout)

  // hexagons
  //   .append('text')
  //     .text(d => d.median_stuff)
  //     .attr('x', 0)
  //     .attr('y', 3.5)
  //     .attr('fill', '#000')
  //     .attr('font-size', 9)
  //     .attr('font-weight', 'bold')
  //     .attr('text-anchor', 'middle')
  //     .attr('pointer-events', 'none')
      
  grids.append('g')
      .attr('id', 'grid')
      .attr('transform', 'translate(0,' + height + ')')
        .call(make_x_gridlines()
          .tickSize(-height)
          .tickFormat("")
        )
  grids.append('g')
      .attr('id', 'grid')
        .call(make_y_gridlines()
          .tickSize(-width)
          .tickFormat("")
        )
  
} //end update

function filterPitch(data){
  data.forEach(d => {
    d.pitchx = null;
    d.pitchy = null;
    d.stuff = null;
  })
  data.forEach(d => {
    if(`${pitchSelect}` == 'All Pitches'){
      d.pitchx = Number(d.HorzBrk)
      d.pitchy = Number(d.IndVertBrk)
      d.stuff = Number(d.StuffPlus)
    }
    else if(d.type == `${pitchSelect}`){ //select pitch type
    d.pitchx = Number(d.HorzBrk)
    d.pitchy = Number(d.IndVertBrk)
    d.stuff = Number(d.StuffPlus)
    }
  })
}
