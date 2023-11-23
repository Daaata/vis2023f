function _1(md){return(
md`# HW4 Strong basline`
)}

function _data(__query,FileAttachment,invalidation){return(
__query(FileAttachment("data.csv"),{from:{table:"data"},sort:[],slice:{to:null,from:null},filter:[],select:{columns:null}},invalidation)
)}

function _artist(FileAttachment){return(
FileAttachment("data.csv").csv()
)}

function _artist_columnKey(artist){return(
Object.keys(artist[0])[3]
)}

function _artist_Column(artist,artist_columnKey){return(
artist.map(row => row[artist_columnKey])
)}

function _artistver_uniqueValues(artist_Column){return(
[...new Set(artist_Column)].sort()
)}

function _artist_counts(artistver_uniqueValues,artist_Column){return(
artistver_uniqueValues.map(val => ({
  value: val,
  count: artist_Column.filter(v => v === val).length
}))
)}

function _artistpublic_columnKey(artist){return(
Object.keys(artist[0])[9]
)}

function _artistpublic_Column(artist,artistpublic_columnKey){return(
artist.map(row => String(row[artistpublic_columnKey]))
)}

function _artistpublic_uniqueValues(artistpublic_Column){return(
[...new Set(artistpublic_Column)].sort()
)}

function _artistpublic_counts(artistpublic_uniqueValues,artistpublic_Column){return(
artistpublic_uniqueValues.map(val => ({
  value: val,
  count: artistpublic_Column.filter(v => v === String(val)).length
}))
)}

function _data1(artist_counts,artistpublic_counts){return(
artist_counts.flatMap((item, index) => ([
  {
    value: item.value,
    count: item.count,
    series: '碳排放量相對位置'
  },
  {
    value: item.value,
    count: artistpublic_counts[index].count,
    series: '「台灣 2050 淨零排放」政策的瞭解相對位置'
  }
]))
)}

function _13(Plot,artist_columnKey,artistpublic_columnKey,data1){return(
Plot.plot({
  height: 600,
  title: artist_columnKey+'、'+artistpublic_columnKey+'兩問題之圖表',
  x: {
    label: 'Value',
    domain: data1.map(d => d.value),
    padding: 0.1
  },
  y: {
    label: 'Count',
    grid: true
  },
  color: {
    domain: ['碳排放量相對位置', '「台灣 2050 淨零排放」政策的瞭解相對位置'],
    range: ['#F2DB94', '#D9CDBF'],  // 你可以根據需要更改顏色
    legend: true
  },
  marks: [
    Plot.barY(data1.filter(d => (d.series)), Plot.stackY({ 
      x: "value",
      y: "count",
      fill: "series",
      title: d => `${d.series}\nvalue: ${d.value}\ncount: ${d.count}`
    }))
  ]
})
)}

function _14(htl){return(
htl.html`<h2>結論</h2>
<h3>從圖表中，我們可以看出：
  <ul>
    <li>本問卷多數對「台灣 2050 淨零排放」政策瞭解度偏低</li>
    <li>本問卷多數認為藝術產業的碳排放量偏高</li>
  </ul>
</h3>`
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  function toString() { return this.url; }
  const fileAttachments = new Map([
    ["data.csv", {url: new URL("../data.csv", import.meta.url), mimeType: "text/csv", toString}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer("data")).define("data", ["__query","FileAttachment","invalidation"], _data);
  main.variable(observer("artist")).define("artist", ["FileAttachment"], _artist);
  main.variable(observer("artist_columnKey")).define("artist_columnKey", ["artist"], _artist_columnKey);
  main.variable(observer("artist_Column")).define("artist_Column", ["artist","artist_columnKey"], _artist_Column);
  main.variable(observer("artistver_uniqueValues")).define("artistver_uniqueValues", ["artist_Column"], _artistver_uniqueValues);
  main.variable(observer("artist_counts")).define("artist_counts", ["artistver_uniqueValues","artist_Column"], _artist_counts);
  main.variable(observer("artistpublic_columnKey")).define("artistpublic_columnKey", ["artist"], _artistpublic_columnKey);
  main.variable(observer("artistpublic_Column")).define("artistpublic_Column", ["artist","artistpublic_columnKey"], _artistpublic_Column);
  main.variable(observer("artistpublic_uniqueValues")).define("artistpublic_uniqueValues", ["artistpublic_Column"], _artistpublic_uniqueValues);
  main.variable(observer("artistpublic_counts")).define("artistpublic_counts", ["artistpublic_uniqueValues","artistpublic_Column"], _artistpublic_counts);
  main.variable(observer("data1")).define("data1", ["artist_counts","artistpublic_counts"], _data1);
  main.variable(observer()).define(["Plot","artist_columnKey","artistpublic_columnKey","data1"], _13);
  main.variable(observer()).define(["htl"], _14);
  return main;
}
