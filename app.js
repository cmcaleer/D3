// @TODO: YOUR CODE HERE!
// console.log("hello");
// d3.csv("data.csv", function(error,DATA){
   
//     console.log("hi");
//     if (error) throw error;
//     console.log(DATA);
//     DATA.forEach(function(error, data){
        
//         var state = data.abbr
//         var poverty =  +data.poverty
//         var smokes = +data.smokes
//         console.log(data)
        
//     });
// })

// d3.csv("data.csv").then(function(Newsdata) {
//     Newsdata.forEach(function(d) {
//       d.poverty = +d.poverty;
//       d.abbr = +d.abbr;
//     });
//     console.log(data)
// });
var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var X = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);
  
  d3.csv("data.csv").then(function(Newsdata) {
    Newsdata.forEach(function(d) {
      d.poverty = +d.poverty;
      d.smokes = +d.smokes;
    });
    console.log(Newsdata);

  d3.selectAll("p").remove()
  d3.select(".article")
  .append("p")
  .text("This is a graphical description of the correlation between the poverty rate and the smoking rate by state." +
   "There does appear to be a correlation between the two, Albeit mild")
  
  var xLinearScale = d3.scaleLinear()
      .domain([6, d3.max(Newsdata, d => d.poverty)])
      .range([0, width]);

    var yLinearScale = d3.scaleLinear()
      .domain([0, d3.max(Newsdata, d => d.smokes)])
      .range([height, 0]);

    // Step 3: Create axis functions
    // ==============================
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // Step 4: Append Axes to the chart
    // ==============================
    X.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

    X.append("g")
      .call(leftAxis);
    
      var circlesGroup = X.selectAll("circle")
      .data(Newsdata)
      .enter()
      .append("circle")
      .attr("cx", d => xLinearScale(d.poverty))
      .attr("cy", d => yLinearScale(d.smokes))
      .attr("r", "15")
      .attr("fill", "lightblue")
      .attr("opacity", ".5");
  
    X.selectAll("tspan")
        .data(Newsdata)
        .enter()
        .append("text")
        .attr("x", d => xLinearScale(d.poverty)-10)
        .attr("y", d => yLinearScale(d.smokes)+3)
        .text(function(d) {return d.abbr})
        .attr({"font-size":35});
     
      // Step 6: Initialize tool tip
      // ==============================
      var toolTip = d3.tip()
        .attr("class", "tooltip")
        .offset([80, -60])
        .html(function(d) {
          return (`${d.abbr}<br>poverty: ${d.poverty}<br>Smokes: ${d.smokes}`);
        });
  
      // Step 7: Create tooltip in the chart
      // ==============================
      X.call(toolTip);
  
      // Step 8: Create event listeners to display and hide the tooltip
      // ==============================
      circlesGroup.on("click", function(d) {
        toolTip.show(d, this);
      })
        // onmouseout event
        .on("mouseout", function(d, index) {
          toolTip.hide(d);
        });
  
      // Create axes labels
      X.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left + 40)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .attr("class", "axisText")
        .text("Smoking Rate");
  
      X.append("text")
        .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
        .attr("class", "axisText")
        .text("Poverty Rate");
    });