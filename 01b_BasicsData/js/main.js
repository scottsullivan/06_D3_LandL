//D3 L&L 01b, the Basics, with JSON!

d3.json("data/learn.json").then(data => {

    d3.select('#chart-area')
        .selectAll('p')
        .data(data)
        .enter()
        .append('p')
        .text(d => d.lLabel);

})