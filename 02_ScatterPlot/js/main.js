//D3 L&L 01b, the Basics, with JSON!

d3.json("data/learn.json").then(data => {

const svg = d3.select('#chart-area')
    .append('svg')
        
svg.selectAll('circle')
    .data(data)
    .enter()
    .append('circle')
    .attr( 'r', 2 )
    .attr( 'fill', 'red' )
    .attr( 'cx', d => d.lDecrease )
    .attr( 'cy', d => d.lBuild ); 

})