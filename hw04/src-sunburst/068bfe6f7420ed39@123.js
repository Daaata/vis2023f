function _1(md){return(
md`# HW04`
)}

function _artist(FileAttachment){return(
FileAttachment("data.csv").csv()
)}

function _data1(__query,FileAttachment,invalidation){return(
__query(FileAttachment("data.csv"),{from:{table:"data"},sort:[],slice:{to:null,from:null},filter:[],select:{columns:null}},invalidation)
)}

function _innerCircleQuestion(artist){return(
Object.keys(artist[0])[1]
)}

function _outerCircleQuestion(artist){return(
Object.keys(artist[0])[16]
)}

function _data(artist,innerCircleQuestion,outerCircleQuestion,buildHierarchy)
{
  // 提取內外圈問題的答案
  var innerCircleAnswer = artist.map(row => row[innerCircleQuestion]);
  var outerCircleAnswer = artist.map(row => row[outerCircleQuestion]);

  // 將內外圈答案結合，形成新的答案陣列
  var combinedAnswers = innerCircleAnswer.map((innerAns, index) => innerAns + '-' + outerCircleAnswer[index]);

  // 重新格式化答案，將其轉換為符合特定模式的陣列
  var reformattedAnswers = combinedAnswers.map(item => {
    const [prefix, values] = item.split('-');
    const splitValues = values.split(';').map(value => value.trim());
    return splitValues.map(value => `${prefix}-${value}`);
  }).reduce((acc, curr) => acc.concat(curr), []);

  // 計算每個重新格式化答案的出現次數
  var answerCounts = {};
  reformattedAnswers.forEach(reformattedAns => {
    answerCounts[reformattedAns] = (answerCounts[reformattedAns] || 0) + 1;
  });

  // 轉換為CSV格式的數據
  var csvData = Object.entries(answerCounts).map(([answer, count]) => [answer, String(count)]);
  
  // 建立包含層次結構的數據
  return buildHierarchy(csvData);
}


function _sunburst(partition,data,d3,radius,innerCircleQuestion,outerCircleQuestion,width,color,arc,mousearc)
{
  const root = partition(data);
  const svg = d3.create("svg");
  // Make this into a view, so that the currently hovered sequence is available to the breadcrumb
  const element = svg.node();
  element.value = { sequence: [], percentage: 0.0 };

  // 使用foreignObject插入HTML
  const fo = svg
    .append("foreignObject")
    .attr("x", `${radius+50}px`)
    .attr("y", -10)
    .attr("width", radius*2)
    .attr("height", 350);
  
  const div = fo
    .append("xhtml:div")
    .style("color","#555")
    .style("font-size", "25px")
    .style("font-family", "Arial");

  d3.selectAll("div.tooltip").remove(); // clear tooltips from before
  const tooltip = d3
    .select("body")
    .append("div")
    .attr("class", `tooltip`)
    .style("position", "absolute")
    .style("opacity", 0)

  const label = svg
    .append("text")
    .attr("text-anchor", "middle");
    //.style("visibility", "hidden");

  label//內圈問題
    .append("tspan")
    .attr("class", "question1")
    .attr("x", 0)
    .attr("y", 0)
    .attr("dx", `${radius*2+50}px`)
    .attr("dy", "-6em")
    .attr("font-size", "2.5em")
    .attr("fill", "#BBB")
    .text(innerCircleQuestion);

  label//外圈問題
    .append("tspan")
    .attr("class", "question2")
    .attr("x", 0)
    .attr("y", 0)
    .attr("dx", `${radius*2+50}px`)
    .attr("dy", "-4em")
    .attr("font-size", "2.5em")
    .attr("fill", "#BBB")
    .text(outerCircleQuestion);

  label//答案
    .append("tspan")
    .attr("class", "sequence")
    .attr("x", 0)
    .attr("y", 0)
    .attr("dx", `${radius*2+50}px`)
    .attr("dy", "-1em")
    .attr("font-size", "2.5em")
    .text("");

  label//占比%數
    .append("tspan")
    .attr("class", "percentage")
    .attr("x", 0)
    .attr("y", 0)
    .attr("dx", 0)
    .attr("dy", "0em")
    .attr("font-size", "5em")
    .attr("fill", "#555")
    .text("");

  label//數量
    .append("tspan")
    .attr("class", "dataValue")
    .attr("x", 0)
    .attr("y", 0)
    .attr("dx", 0)
    .attr("dy", "2em")
    .attr("font-size", "2em")
    .attr("fill", "#555")
    .text("");

  svg
    .attr("viewBox", `${-radius} ${-radius} ${width*2.2} ${width}`)
    .style("max-width", `${width*2}px`)
    .style("font", "12px sans-serif");

  const path = svg
    .append("g")
    .selectAll("path")
    .data(
      root.descendants().filter(d => {
        // Don't draw the root node, and for efficiency, filter out nodes that would be too small to see
        return d.depth && d.x1 - d.x0 > 0.001;
      })
    )
    .join("path")
    .attr("fill", d => color(d.data.name))
    .attr("d", arc);

  svg
    .append("g")
    .attr("fill", "none")
    .attr("pointer-events", "all")
    .on("mouseleave", () => {
      path.attr("fill-opacity", 1);
      //tooltip.text("");
      //label.style("visibility", null);
      // Update the value of this view
      element.value = { sequence: [], percentage: 0.0 };
      element.dispatchEvent(new CustomEvent("input"));
    })
    .selectAll("path")
    .data(
      root.descendants().filter(d => {
        // Don't draw the root node, and for efficiency, filter out nodes that would be too small to see
        return d.depth && d.x1 - d.x0 > 0.001;
      })
    )
    .join("path")
    .attr("d", mousearc)
    .on("mouseover", (_evt, d) => {
      if(d.data.name === "減少包裝材及文宣印製") {
        tooltip
        .style("opacity", 1)
        .html(`減少包裝<br><svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" 
	 viewBox="0 0 436.1 436.1" xml:space="preserve">
<ellipse style="opacity:0.5;fill:#B8CBCD;enable-background:new    ;" cx="221.338" cy="388.8" rx="190.7" ry="47.3"/>
<path style="fill:#F7BB83;" d="M16.038,96v264c0,8.8,7.2,16,16,16h372c8.8,0,16-7.2,16-16V92"/>
<g>
	<path style="fill:#6E4123;" d="M404.038,388h-372c-15.4,0-28-12.6-28-28V96c0-6.6,5.4-12,12-12s12,5.4,12,12v264c0,2.2,1.8,4,4,4
		h372c2.2,0,4-1.8,4-4V92c0-6.6,5.4-12,12-12s12,5.4,12,12v268C432.038,375.4,419.438,388,404.038,388z"/>
	<path style="fill:#6E4123;" d="M368.038,300h-52c-4.4,0-8-3.6-8-8s3.6-8,8-8h52c4.4,0,8,3.6,8,8S372.438,300,368.038,300z"/>
	<path style="fill:#6E4123;" d="M368.038,268h-52c-4.4,0-8-3.6-8-8s3.6-8,8-8h52c4.4,0,8,3.6,8,8S372.438,268,368.038,268z"/>
	<path style="fill:#6E4123;" d="M284.038,268h-32c-4.4,0-8-3.6-8-8s3.6-8,8-8h32c4.4,0,8,3.6,8,8S288.438,268,284.038,268z"/>
	<path style="fill:#6E4123;" d="M368.038,332h-92c-4.4,0-8-3.6-8-8s3.6-8,8-8h92c4.4,0,8,3.6,8,8S372.438,332,368.038,332z"/>
</g>
<rect x="68.038" y="260" style="fill:#FFFFFF;" width="64" height="64"/>
<path style="fill:#6E4123;" d="M176.038,332h-108c-4.4,0-8-3.6-8-8v-64c0-4.4,3.6-8,8-8h108c4.4,0,8,3.6,8,8v64
	C184.038,328.4,180.438,332,176.038,332z M76.038,316h92v-48h-92V316z"/>
<path style="fill:#F7BB83;" d="M420.038,92l-27.1-72.5c-1.5-4.1-6.4-7.5-10.8-7.5h-327.9c-4.4,0-9.2,3.4-10.7,7.5L16.038,96"/>
<g>
	<path style="fill:#6E4123;" d="M16.038,108c-1.3,0-2.7-0.2-4.1-0.7c-6.2-2.2-9.5-9.1-7.2-15.4l27.5-76.5c3.3-9,12.5-15.4,22-15.4
		h327.9c9.4,0,18.9,6.6,22.1,15.4l27.1,72.4c2.3,6.2-0.8,13.1-7,15.4c-6.2,2.3-13.1-0.8-15.4-7l-26.9-72.1c-0.1,0-0.1-0.1-0.2-0.1
		h-327.1c0,0-0.1,0-0.1,0.1l-27.3,76C25.538,105,20.938,108,16.038,108z"/>
	<rect x="12.038" y="88" style="fill:#6E4123;" width="64" height="64"/>
</g>
<path style="fill:#FFFFFF;" d="M204.038,184c-8.8,0-16-7.2-16-16V24c0-4.4,3.6-8,8-8h40c4.4,0,8,3.6,8,8v144c0,8.8-7.2,16-16,16
	H204.038z"/>
<path style="fill:#6E4123;" d="M236.038,24v144c0,4.4-3.6,8-8,8h-24c-4.4,0-8-3.6-8-8V24H236.038 M236.038,8h-40
	c-8.8,0-16,7.2-16,16v144c0,13.2,10.8,24,24,24h24c13.2,0,24-10.8,24-24V24C252.038,15.2,244.838,8,236.038,8L236.038,8z"/>
</svg>`)
        .style("border-color", color(d.data.name));
      }
      else if(d.data.name === "使用無毒媒材、再生材料、廢物利用素材等") {
        tooltip
        .style("opacity", 1)
        .html(`再生材料<br><svg height="64px" width="64px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" 
	 viewBox="0 0 512 512" xml:space="preserve">
<path style="fill:#489B6D;" d="M440.425,68.993l-4.521,4.884C387.68,26.236,323.802,0,256,0C193.842,0,133.905,22.553,87.231,63.503
	C31.795,112.145,0,182.307,0,256c0,9.864,7.997,17.86,17.86,17.86s17.86-7.997,17.86-17.86c0-63.411,27.361-123.786,75.069-165.645
	C150.945,55.123,202.515,35.721,256,35.721c58.419,0,113.453,22.633,154.967,63.727c0.223,0.22,0.461,0.413,0.692,0.619
	l-5.301,5.727c-6.694,7.232-1.116,18.93,8.717,18.278l32.894-2.177c5.586-0.369,9.984-4.912,10.173-10.506l1.173-34.627
	C459.658,66.675,447.283,61.584,440.425,68.993z"/>
<path style="fill:#A2CE86;" d="M17.86,273.86C7.997,273.86,0,265.864,0,256c0-73.693,31.795-143.855,87.231-192.497
	C133.905,22.553,193.842,0,256,0v35.721c-53.485,0-105.055,19.402-145.21,54.634C63.082,132.214,35.721,192.589,35.721,256
	C35.721,265.864,27.724,273.86,17.86,273.86z"/>
<path style="fill:#489B6D;" d="M256,512c-62.153,0-122.087-22.549-168.759-63.495c-7.416-6.505-8.153-17.789-1.648-25.205
	c6.506-7.416,17.789-8.153,25.205-1.648c40.154,35.227,91.721,54.627,145.202,54.627c62.833,0,122.841-26.945,164.638-73.929
	c35.88-40.333,55.641-92.306,55.641-146.35c0-9.864,7.997-17.86,17.86-17.86S512,246.136,512,256
	c0,62.807-22.969,123.212-64.674,170.094C398.758,480.688,329.022,512,256,512z"/>
<path style="fill:#A2CE86;" d="M110.798,421.652c-0.652-0.572-1.343-1.068-2.049-1.529l4.52-4.883
	c6.694-7.232,1.116-18.93-8.718-18.278l-32.894,2.177c-5.586,0.369-9.984,4.912-10.173,10.506l-1.173,34.627
	c-0.342,10.09,12.033,15.181,18.89,7.773l5.646-6.1c0.701,0.912,1.497,1.773,2.394,2.56C133.913,489.451,193.847,512,256,512
	v-35.721C202.519,476.279,150.952,456.879,110.798,421.652z"/>
<circle style="fill:#91C0F1;" cx="256" cy="256" r="161.351"/>
<path style="fill:#D7EDF3;" d="M256,417.349c-89.111,0-161.349-72.238-161.349-161.349S166.889,94.651,256,94.651V417.349z"/>
<path style="fill:#A2CE86;" d="M184.672,312.127l2.372-2.624c8.094-8.958,7.938-22.633-0.357-31.405l-1.267-1.341
	c-5.434-5.746-7.556-13.87-5.626-21.541c2.531-10.058-1.942-20.572-10.944-25.724l-61.404-36.559
	C99.21,212.307,94.651,233.621,94.651,256c0,63.517,36.708,118.452,90.061,144.775l-5.677-69.236
	C177.838,324.546,179.916,317.391,184.672,312.127z"/>
<g>
	<path style="fill:#007AB7;" d="M369.959,141.781l-10.661,11.651c-4.64,5.071-11.118,8.075-17.987,8.342l-48.217,1.872
		c-8.547,0.332-16.37,4.888-20.875,12.158l-12.359,19.944c-5.588,9.018-5.07,20.541,1.306,29.02l7.676,10.208
		c5.826,7.749,8.954,17.192,8.904,26.887l-0.163,31.643c-0.086,16.666,14.905,29.364,31.33,26.537l35.149-6.049
		c9.66-1.662,18.497-6.477,25.132-13.693l0,0c11.802-12.838,29.386-17.106,45.029-12.571c2.047-10.26,3.127-20.868,3.127-31.731
		C417.349,211.379,399.234,170.989,369.959,141.781z"/>
	<path style="fill:#007AB7;" d="M265.099,378.549L265.099,378.549c-10.741,4.762-16.91,16.177-15.011,27.772l1.799,10.977
		c1.367,0.035,2.737,0.052,4.113,0.052c26.081,0,50.712-6.196,72.513-17.184l-2.748-4.095
		C312.478,376.276,286.894,368.886,265.099,378.549z"/>
</g>
<path style="fill:#A2CE86;" d="M186.349,158.508l32.729-18.42c5.147-2.897,8.878-7.781,10.32-13.508l7.757-30.827
	c-36.776,4.279-69.778,20.918-94.739,45.662l20.342,15.468C169.593,162.081,178.864,162.72,186.349,158.508z"/>
</svg>`)
        .style("border-color", color(d.data.name));
      }
      else if(d.data.name === "工作場所、活動展場的節約能源") {
        tooltip
        .style("opacity", 1)
        .html(`節約能源<br><svg height="64px" width="64px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" 
	 viewBox="0 0 512 512" xml:space="preserve">
<path style="fill:#FFE477;" d="M439.668,183.652c0,55.541-24.821,107.52-68.118,142.581c-16.14,13.023-28.27,31.499-32.056,52.202
	H172.537c-3.674-20.703-15.804-39.068-31.833-51.979C88.167,283.938,63.569,218.49,75.146,151.263
	C87.946,76.355,146.825,16.807,221.4,3.117C232.974,1.002,244.551,0,256.015,0c42.852,0.111,84.37,14.915,117.538,42.518
	C415.514,77.579,439.668,129.002,439.668,183.652z"/>
<path style="fill:#FFB655;" d="M439.668,183.652c0,55.541-24.821,107.52-68.118,142.581c-16.14,13.023-28.27,31.499-32.056,52.202
	h-83.478V0c42.852,0.111,84.37,14.915,117.538,42.518C415.514,77.579,439.668,129.002,439.668,183.652z"/>
<path style="fill:#79695A;" d="M256.015,512c-9.217,0-16.696-7.473-16.696-16.696v-33.391c0-9.223,7.479-16.696,16.696-16.696
	c9.217,0,16.696,7.473,16.696,16.696v33.391C272.711,504.527,265.232,512,256.015,512z"/>
<path style="fill:#6C5B52;" d="M272.711,495.304v-33.391c0-9.223-7.479-16.696-16.696-16.696V512
	C265.232,512,272.711,504.527,272.711,495.304z"/>
<path style="fill:#DDDD47;" d="M256.015,411.826c-9.217,0-16.696-7.473-16.696-16.696V250.435c0-9.223,7.479-16.696,16.696-16.696
	c9.217,0,16.696,7.473,16.696,16.696V395.13C272.711,404.353,265.232,411.826,256.015,411.826z"/>
<path style="fill:#C7D100;" d="M272.711,395.13V250.435c0-9.223-7.479-16.696-16.696-16.696v178.087
	C265.232,411.826,272.711,404.353,272.711,395.13z"/>
<path style="fill:#DBE1F1;" d="M289.407,478.609h-66.783c-27.662,0-50.087-22.424-50.087-50.087v-50.087h166.956v50.087
	C339.494,456.184,317.068,478.609,289.407,478.609z"/>
<path style="fill:#D0D5E5;" d="M256.015,478.609h33.391c27.664,0,50.087-22.424,50.087-50.087v-50.087h-83.478V478.609z"/>
<path style="fill:#7CCC92;" d="M356.189,133.565h-33.391c-27.27,0-51.534,13.245-66.783,33.614
	c-15.249-20.369-39.513-33.614-66.783-33.614h-33.391c-9.239,0-16.696,7.457-16.696,16.696v33.391
	c0,46.08,37.398,83.478,83.478,83.478h66.783c46.08,0,83.478-37.398,83.478-83.478v-33.391
	C372.885,141.023,365.427,133.565,356.189,133.565z"/>
<path style="fill:#34B772;" d="M372.885,150.261v33.391c0,46.08-37.398,83.478-83.478,83.478h-33.391v-99.951
	c15.249-20.369,39.513-33.614,66.783-33.614h33.391C365.427,133.565,372.885,141.023,372.885,150.261z"/>
</svg>`)
        .style("border-color", color(d.data.name));
      }
      else
      {
        tooltip
        .style("opacity", 1)
        .html(`${d.data.name}`)
        .style("border-color", color(d.data.name));
      }
    })
    .on("mousemove", (evt, d) => {
      tooltip
        .style("top", evt.pageY - 10 + "px")
        .style("left", evt.pageX + 10 + "px");
    })
    .on("mouseout", () => {
      tooltip.style("opacity", 0);
    })
    .on("mouseenter", (event, d) => {
      // Get the ancestors of the current segment, minus the root

      //introduce
      if(d.data.name === "工作室")
      {
        div
          .html("<ul><li>定義：藝術家創作藝術品的私人空間。它可以是一個房間、一棟建築或任何專為藝術製作而設的場所。</li><li>功能：用於藝術家進行創作，例如繪畫、雕塑或任何其他形式的藝術。</li><li>特色：它是一個私密的空間，藝術家可以在這裡自由地實驗、嘗試並發展他們的技巧和創意。</li></ul>");
      }
      else if(d.data.name === "替代空間")
      {
        div
          .html("<ul><li>定義：非傳統和非商業的展示空間。可以是臨時或長期的存在，但不同於傳統的美術館和畫廊。</li><li>功能：提供一個展示非主流、實驗性或邊緣藝術的場所。這些空間通常更加開放、靈活，能夠接受更多風格和形式的藝術品。</li><li>特色：是藝術家、策展人或社群自組、自發的，對於藝術家來說，這樣的空間提供了更多的自由和可能性。</li></ul>");
      }
      else if(d.data.name === "美術館")
      {
        div
          .html("<ul><li>定義：為了展示、保護和研究藝術品而設立的公共或私人機構。</li><li>功能：除了展示藝術品，美術館也負責藝術品的保護、修復、研究和教育等功能。</li><li>特色：通常有較為正式和嚴謹的運作模式。它們可能有長期或特定主題的展覽，且會對藝術品有一定的選擇和評價標準。</li></ul>");
      }
      else
      {
        div.html("");
      }
      
      //dataValue
      label
        .style("visibility", null)
        .select(".dataValue")
        .text("計數："+d.value);
      
      //question
      if(d.depth-1 === 0)
      {
        label
          .style("visibility", null)
          .select(".question1")
          .attr("fill", "#000");
        label
          .style("visibility", null)
          .select(".question2")
          .attr("fill", "#BBB");
      }
      else if(d.depth-1 === 1)
      {
        label
          .style("visibility", null)
          .select(".question1")
          .attr("fill", "#BBB");
        label
          .style("visibility", null)
          .select(".question2")
          .attr("fill", "#000");
      }
      
      const sequence = d
        .ancestors()
        .reverse()
        .slice(1);
      // Highlight the ancestors
      path.attr("fill-opacity", node =>
        sequence.indexOf(node) >= 0 ? 1.0 : 0.3
      );
      label
        .style("visibility", null)
        .select(".sequence")
        //.style("visibility", "visible")
        .attr("fill", sequence => color(d.data.name))
        .text(d.data.name);
      const percentage = ((100 * d.value) / root.value).toPrecision(3);
      label
        .style("visibility", null)
        .select(".percentage")
        .text(percentage + "%");

      /*tooltip
        .text(d.data.name);*/
      
      // Update the value of this view with the currently hovered sequence and percentage
      element.value = { sequence, percentage };
      element.dispatchEvent(new CustomEvent("input"));
    });     

  return element;
}


function _breadcrumb(d3,breadcrumbWidth,breadcrumbHeight,sunburst,breadcrumbPoints,color)
{
  const svg = d3
    .create("svg")
    .attr("viewBox", `0 0 ${breadcrumbWidth * 10} ${breadcrumbHeight}`)
    .style("font", "12px sans-serif")
    .style("margin", "5px");

  const g = svg
    .selectAll("g")
    .data(sunburst.sequence)
    .join("g")
    .attr("transform", (d, i) => `translate(${i * breadcrumbWidth}, 0)`);

    g.append("polygon")
      .attr("points", breadcrumbPoints)
      .attr("fill", d => color(d.data.name))
      .attr("stroke", "white");

    g.append("text")
      .attr("x", (breadcrumbWidth + 10) / 2)
      .attr("y", 15)
      .attr("dy", "0.35em")
      .attr("text-anchor", "middle")
      .attr("fill", "white")
      .text(d => {
        if(d.data.name === "減少包裝材及文宣印製") {
          return "減少包裝";
        }
        else if(d.data.name === "使用無毒媒材、再生材料、廢物利用素材等") {
          return "使用再生材料";
        }
        else if(d.data.name === "工作場所、活動展場的節約能源") {
          return "節約能源";
        }
        else if(d.data.name.length > 6)
        {
          return "其他答案";
        }
        return d.data.name;
      });

  svg
    .append("text")
    .text(sunburst.percentage > 0 ? sunburst.percentage + "%" : "")
    .attr("x", (sunburst.sequence.length + 0.5) * breadcrumbWidth)
    .attr("y", breadcrumbHeight / 2)
    .attr("dy", "0.35em")
    .attr("text-anchor", "middle");

  return svg.node();
}


function _9(htl){return(
htl.html`<h2>結論</h2>
<h3>從旭日圖中，我們可以看出：
  <ul>
    <li>本問卷的藝術工作者工作地點類型大多是工作室</li>
    <li>本問卷的藝術工作者大多採取減少「包裝材及文宣印製」來減少碳排放量</li>
    <li>在美術館或藝術園區的藝術工作者主要以「工作場所、活動展場的節約能源」來減少碳排放量</li>
  </ul>
</h3>`
)}

function _buildHierarchy(){return(
function buildHierarchy(csv) {
  // Helper function that transforms the given CSV into a hierarchical format.
  const root = { name: "root", children: [] };
  for (let i = 0; i < csv.length; i++) {
    const sequence = csv[i][0];
    const size = +csv[i][1];
    if (isNaN(size)) {
      // e.g. if this is a header row
      continue;
    }
    const parts = sequence.split("-");
    let currentNode = root;
    for (let j = 0; j < parts.length; j++) {
      const children = currentNode["children"];
      const nodeName = parts[j];
      let childNode = null;
      if (j + 1 < parts.length) {
        // Not yet at the end of the sequence; move down the tree.
        let foundChild = false;
        for (let k = 0; k < children.length; k++) {
          if (children[k]["name"] == nodeName) {
            childNode = children[k];
            foundChild = true;
            break;
          }
        }
        // If we don't already have a child node for this branch, create it.
        if (!foundChild) {
          childNode = { name: nodeName, children: [] };
          children.push(childNode);
        }
        currentNode = childNode;
      } else {
        // Reached the end of the sequence; create a leaf node.
        childNode = { name: nodeName, value: size };
        children.push(childNode);
      }
    }
  }
  return root;
}
)}

function _width(){return(
640
)}

function _radius(width){return(
width / 2
)}

function _partition(d3,radius){return(
data =>
  d3.partition().size([2 * Math.PI, radius * radius])(
    d3
      .hierarchy(data)
      .sum(d => d.value)
      .sort((a, b) => b.value - a.value)
  )
)}

function _mousearc(d3,radius){return(
d3
  .arc()
  .startAngle(d => d.x0)
  .endAngle(d => d.x1)
  .innerRadius(d => Math.sqrt(d.y0))
  .outerRadius(radius)
)}

function _color(d3){return(
d3
  .scaleOrdinal()
  .domain(["工作室", "替代空間", "美術館", "減少包裝材及文宣印製", "使用無毒媒材、再生材料、廢物利用素材等", "工作場所、活動展場的節約能源"])
  //.range(d3.schemePaired)
  .range(["#2C92DB","#2EC9E6","#34CFBE","#518C60","#BAD9C3","#2CDB64"])
  .unknown("#E3FAF7")
)}

function _arc(d3,radius){return(
d3
  .arc()
  .startAngle(d => d.x0)
  .endAngle(d => d.x1)
  .padAngle(1 / radius)
  .padRadius(radius)
  .innerRadius(d => Math.sqrt(d.y0))
  .outerRadius(d => Math.sqrt(d.y1) - 1)
)}

function _breadcrumbWidth(){return(
75
)}

function _breadcrumbHeight(){return(
30
)}

function _breadcrumbPoints(breadcrumbWidth,breadcrumbHeight){return(
function breadcrumbPoints(d, i) {
  const tipWidth = 10;
  const points = [];
  points.push("0,0");
  points.push(`${breadcrumbWidth},0`);
  points.push(`${breadcrumbWidth + tipWidth},${breadcrumbHeight / 2}`);
  points.push(`${breadcrumbWidth},${breadcrumbHeight}`);
  points.push(`0,${breadcrumbHeight}`);
  if (i > 0) {
    // Leftmost breadcrumb; don't include 6th vertex.
    points.push(`${tipWidth},${breadcrumbHeight / 2}`);
  }
  return points.join(" ");
}
)}

function _20(htl){return(
htl.html`<style>
.tooltip {
  padding: 8px 12px;
  color: white;
  border-radius: 6px;
  border: 2px solid rgba(255,255,255,0.5);
  box-shadow: 0 1px 4px 0 rgba(0,0,0,0.2);
  pointer-events: none;
  transform: translate(-50%, -100%);
  font-family: "Helvetica", sans-serif;
  background: rgba(20,10,30,0.6);
  transition: 0.2s opacity ease-out, 0.1s border-color ease-out;
}
</style>`
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  function toString() { return this.url; }
  const fileAttachments = new Map([
    ["data.csv", {url: new URL("../data.csv", import.meta.url), mimeType: "text/csv", toString}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer("artist")).define("artist", ["FileAttachment"], _artist);
  main.variable(observer("data1")).define("data1", ["__query","FileAttachment","invalidation"], _data1);
  main.variable(observer("innerCircleQuestion")).define("innerCircleQuestion", ["artist"], _innerCircleQuestion);
  main.variable(observer("outerCircleQuestion")).define("outerCircleQuestion", ["artist"], _outerCircleQuestion);
  main.variable(observer("data")).define("data", ["artist","innerCircleQuestion","outerCircleQuestion","buildHierarchy"], _data);
  main.variable(observer("viewof sunburst")).define("viewof sunburst", ["partition","data","d3","radius","innerCircleQuestion","outerCircleQuestion","width","color","arc","mousearc"], _sunburst);
  main.variable(observer("sunburst")).define("sunburst", ["Generators", "viewof sunburst"], (G, _) => G.input(_));
  main.variable(observer("breadcrumb")).define("breadcrumb", ["d3","breadcrumbWidth","breadcrumbHeight","sunburst","breadcrumbPoints","color"], _breadcrumb);
  main.variable(observer()).define(["htl"], _9);
  main.variable(observer("buildHierarchy")).define("buildHierarchy", _buildHierarchy);
  main.variable(observer("width")).define("width", _width);
  main.variable(observer("radius")).define("radius", ["width"], _radius);
  main.variable(observer("partition")).define("partition", ["d3","radius"], _partition);
  main.variable(observer("mousearc")).define("mousearc", ["d3","radius"], _mousearc);
  main.variable(observer("color")).define("color", ["d3"], _color);
  main.variable(observer("arc")).define("arc", ["d3","radius"], _arc);
  main.variable(observer("breadcrumbWidth")).define("breadcrumbWidth", _breadcrumbWidth);
  main.variable(observer("breadcrumbHeight")).define("breadcrumbHeight", _breadcrumbHeight);
  main.variable(observer("breadcrumbPoints")).define("breadcrumbPoints", ["breadcrumbWidth","breadcrumbHeight"], _breadcrumbPoints);
  main.variable(observer()).define(["htl"], _20);
  return main;
}
