//D3 L&L 01, the Basics

d3.select('#chart-area')
    .selectAll('p')
    .data(["Hello", "friends", "welcome", "to", "Lunch", "and", "Learn"])
    .enter()
    .append('p')
    .text(d => d);