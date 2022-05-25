//D3 L&L 01b, the Basics, with JSON!
const MARGIN = { LEFT: 100, RIGHT: 10, TOP: 10, BOTTOM: 100 }
const WIDTH = 800 - MARGIN.LEFT - MARGIN.RIGHT
const HEIGHT = 600 - MARGIN.TOP - MARGIN.BOTTOM

d3.json("data/learn.json").then(data => {

const svg = d3.select('#chart-area')
    .append('svg')
    .attr("viewBox", [0, 0, WIDTH + MARGIN.LEFT + MARGIN.RIGHT, HEIGHT + MARGIN.TOP + MARGIN.BOTTOM]);

const x = d3.scaleLinear()
    .domain(d3.extent(data, d => d.lDecrease ))
    .range([ 0, WIDTH ])
svg.append("g")
    .attr("transform", `translate(0, ${ HEIGHT })`)
    .call(d3.axisBottom(x));
    
const y = d3.scaleLinear()
    .domain(d3.extent(data, d => d.lBuild ))
    .range([ HEIGHT, 0 ])
svg.append("g")
    .call(d3.axisLeft(y));
        
svg.selectAll('circle')
    .data(data)
    .enter()
    .append('circle')
    .attr( 'r', d => d.lDiameter )
    .attr( 'fill', 'red' )
    .attr( 'cx', d => x(d.lDecrease ))
    .attr( 'cy', d => y(d.lBuild )); 

})