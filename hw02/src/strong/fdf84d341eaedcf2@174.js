function _1(md){return(
md`# HW2 Strong basline (2pt)`
)}

function _data(FileAttachment){return(
FileAttachment("data.json").json()
)}

function _yCounts(){return(
[]
)}

function _a(){return(
['牡羊座','金牛座','雙子座','巨蟹座','獅子座','處女座','天秤座','天蠍座','射手座','摩羯座','水瓶座','雙魚座']
)}

function _constellations(data){return(
data.map(item => item.Constellation)
)}

function _6(yCounts,constellations,a,data)
{
  yCounts.length = 0; //將yCounts清空
  var minConstellation = Math.min(...constellations); //最早出生年
  var maxConstellation = Math.max(...constellations); //最晚出生年
  for (var y=minConstellation; y<=maxConstellation; y++) { 
    //所有年份都建立兩個Object，一個存放男性資料，一個存放女性資料
    yCounts.push({year:a[y], gender:"male", count:0}); 
    //Object包含：1. 出生年，2.男性，3.人數(設為0)
    yCounts.push({year:a[y], gender:"female", count:0}); 
    //Object包含：1. 出生年，2.女性，3.人數(設為0)
  }
  data.forEach (x=> {
    var i = (x.Constellation-minConstellation)*2 + (x.Gender== "男" ? 0 : 1); 
    yCounts[i].count++;
    //讀取data array，加總每個年份出生的人
  })
  return yCounts
}


function _7(Plot,yCounts){return(
Plot.plot({
  marginTop: 50,
  marginRight: 50,
  marginBottom: 50,
  marginLeft: 50,
  
  grid: true,
  y: {label: "count"},
  x: {label: "Constellation"},
  marks: [
    Plot.ruleY([0]),
    Plot.barY(yCounts, {x: "year", y: "count", tip: true , fill:"gender"}),
  ]
})
)}

function _yCounts1(){return(
[]
)}

function _constellations1(data){return(
data.map(item => item.Constellation)
)}

function _10(yCounts1,constellations1,data)
{
  yCounts1.length = 0; //將yCounts清空
  var minConstellation = Math.min(...constellations1); //最早出生年
  var maxConstellation = Math.max(...constellations1); //最晚出生年
  for (var y=minConstellation; y<=maxConstellation; y++) { 
    //所有年份都建立兩個Object，一個存放男性資料，一個存放女性資料
    yCounts1.push({year:y, gender:"male", count:0}); 
    //Object包含：1. 出生年，2.男性，3.人數(設為0)
    yCounts1.push({year:y, gender:"female", count:0}); 
    //Object包含：1. 出生年，2.女性，3.人數(設為0)
  }
  data.forEach (x=> {
    var i = (x.Constellation)*2 + (x.Gender== "男" ? 0 : 1); 
    yCounts1[i].count++;
    //讀取data array，加總每個年份出生的人
  })
  return yCounts1
}


function _11(Plot,a,data){return(
Plot.plot({
  marginTop: 50,
  marginRight: 50,
  marginBottom: 50,
  marginLeft: 50,
  
  grid: true,
  y: {label: "count"},
  x: { ticks: 12, tickFormat: dm => a[dm], domain:[0, 12]},
  marks: [
    Plot.rectY(data, Plot.binX({y: "count"}, {x: "Constellation", interval: 1, fill:"Gender",title: (d) => `${a[d.Constellation]}, ${d.Gender}`, tip:true})),
    Plot.ruleY([0]),
  ],
})
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  function toString() { return this.url; }
  const fileAttachments = new Map([
    ["data.json", {url: new URL("../data.json", import.meta.url), mimeType: "application/json", toString}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer("data")).define("data", ["FileAttachment"], _data);
  main.variable(observer("yCounts")).define("yCounts", _yCounts);
  main.variable(observer("a")).define("a", _a);
  main.variable(observer("constellations")).define("constellations", ["data"], _constellations);
  main.variable(observer()).define(["yCounts","constellations","a","data"], _6);
  main.variable(observer()).define(["Plot","yCounts"], _7);
  main.variable(observer("yCounts1")).define("yCounts1", _yCounts1);
  main.variable(observer("constellations1")).define("constellations1", ["data"], _constellations1);
  main.variable(observer()).define(["yCounts1","constellations1","data"], _10);
  main.variable(observer()).define(["Plot","a","data"], _11);
  return main;
}
