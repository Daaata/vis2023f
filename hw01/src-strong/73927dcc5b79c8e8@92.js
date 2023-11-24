function _1(md){return(
md`# HW1 Strong baseline`
)}

function _2(md){return(
md`參考 https://observablehq.com/@d3/marimekko-chart?intent=fork`
)}

function _data(__query,FileAttachment,invalidation){return(
__query(FileAttachment("data.csv"),{from:{table:"data"},sort:[],slice:{to:null,from:null},filter:[],select:{columns:null}},invalidation)
)}

function _appl(FileAttachment){return(
FileAttachment("data.csv").csv({typed: true})
)}

function _chart(d3,appl)
{

  // Specify the chart’s dimensions.
  const width = 928;
  const height = width;
  const marginTop = 30;
  const marginRight = -1;
  const marginBottom = -1;
  const marginLeft = 1;

  // Create the color scale.
  const color = d3.scaleOrdinal(d3.schemeCategory10).domain(appl.map(d => d.班級));

  // Compute the layout.
  const treemap = data => d3.treemap()
      .round(true)
      .tile(d3.treemapSliceDice)
      .size([
        width - marginLeft - marginRight, 
        height - marginTop - marginBottom
      ])
    (d3.hierarchy(d3.group(data, d => d.學號, d => d.姓名)).sum(d => d.作業一, d => d.作業二, d => d.作業三, d => d.作業四, d => d.作業五, d => d.作業六, d => d.作業七, d => d.作業八, d => d.作業九, d => d.作業十))
    .each(d => {
      d.x0 += marginLeft;
      d.x1 += marginLeft;
      d.y0 += marginTop;
      d.y1 += marginTop;
    });
  const root = treemap(appl);

  // Create the SVG container.
  const svg = d3.create("svg")
      .attr("viewBox", [0, 0, width, height])
      .attr("width", width)
      .attr("height", height)
      .attr("style", "max-width: 100%; height: auto; font: 10px sans-serif;");

  // Position the nodes.
  const node = svg.selectAll("g")
    .data(root.descendants())
    .join("g")
      .attr("transform", d => `translate(${d.x0},${d.y0})`);

  const format = d => d.toLocaleString();

  // Draw column labels.
  const column = node.filter(d => d.depth === 1);

  //column.append("text")
  //    .attr("x", 3)
  //    .attr("y", "-1.7em")
  //    .style("font-weight", "bold")
  //    .text(d => d.data[0]);

  //column.append("text")
  //    .attr("x", 3)
  //    .attr("y", "-0.5em")
  //    .attr("fill-opacity", 0.7)
  //    .text(d => format(d.value));

  column.append("line")
      .attr("x1", -0.5)
      .attr("x2", -0.5)
      .attr("y1", -30)
      .attr("y2", d => d.y1 - d.y0)
      .attr("stroke", "#000")

  // Draw leaves.
  const cell = node.filter(d => d.depth === 2);

  cell.append("rect")
      .attr("fill", d => color(d.data[0]))
      .attr("fill-opacity", (d, i) => d.學號 / d.parent.班級)
      .attr("width", d => d.x1 - d.x0 - 1)
      .attr("height", d => d.y1 - d.y0 - 1);

  cell.append("text")
      .attr("x", 3)
      .attr("y", "1.1em")
      .text(d => d.data[0]);

  //cell.append("text")
   //   .attr("x", 3)
    //  .attr("y", "2.3em")
     // .attr("fill-opacity", 0.7)
      //.text(d => format(d.value));

  return svg.node();
}


export default function define(runtime, observer) {
  const main = runtime.module();
  function toString() { return this.url; }
  const fileAttachments = new Map([
    ["data.csv", {url: new URL("./data.csv", import.meta.url), mimeType: "text/csv", toString}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["md"], _2);
  main.variable(observer("data")).define("data", ["__query","FileAttachment","invalidation"], _data);
  main.variable(observer("appl")).define("appl", ["FileAttachment"], _appl);
  main.variable(observer("chart")).define("chart", ["d3","appl"], _chart);
  return main;
}
