// Set up dimensions and margins for the tree map
const width = 960;
const height = 600;

// Set up color scale
const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

// Set up tooltip
const tooltip = d3.select("#tooltip");

// Set up the SVG canvas
const svg = d3.select("#tree-map")
  .attr("width", width)
  .attr("height", height);

// Load the movie sales data
d3.json("https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json").then(data => {
  
  // Create a hierarchical structure for the data using d3.hierarchy
  const root = d3.hierarchy(data)
    .sum(d => d.value)
    .sort((a, b) => b.value - a.value);

  // Create the treemap layout
  const treemap = d3.treemap()
    .size([width, height])
    .padding(1);

  treemap(root);

  // Create the tiles (rectangles) for the tree map
  svg.selectAll(".tile")
    .data(root.leaves())
    .enter()
    .append("rect")
    .attr("class", "tile")
    .attr("x", d => d.x0)
    .attr("y", d => d.y0)
    .attr("width", d => d.x1 - d.x0)
    .attr("height", d => d.y1 - d.y0)
    .style("fill", d => colorScale(d.data.category))
    .attr("data-name", d => d.data.name)
    .attr("data-category", d => d.data.category)
    .attr("data-value", d => d.data.value)
    .on("mouseover", (event, d) => {
      tooltip.transition().duration(200).style("display", "block");
      tooltip.html(`${d.data.name}: $${d.data.value} million`)
        .attr("data-value", d.data.value)
        .style("left", (event.pageX + 5) + "px")
        .style("top", (event.pageY + 5) + "px");
    })
    .on("mouseout", () => {
      tooltip.transition().duration(200).style("display", "none");
    });

  // Create the legend
  const legend = d3.select("#legend");

  // Get unique categories from the data
  const categories = Array.from(new Set(root.leaves().map(d => d.data.category)));

  // Create a legend for each category
  categories.forEach(category => {
    const legendItem = legend.append("div")
      .attr("class", "legend-item");

    legendItem.append("div")
      .attr("class", "legend-color")
      .style("background-color", colorScale(category));

    legendItem.append("span").text(category);
  });
});