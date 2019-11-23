function buildMetadata(artist) {

  // Use `d3.json` to fetch the metadata for an artist
  // Use d3 to select the panel with id of `#artist-metadata`
  var metadataURL = `/artists/${artist}`;
  d3.json(metadataURL).then(function(data){
	console.log(data);
	var table = d3.select("tbody")
	.selectAll("tr")
	.data(data)
	.enter()
	.append("tr")
	.html(function(d) {
		return `<td>${d.pub_year}</td><td>${d.title}</td><td>${d.score}</td><td>${d.url}</td>`;
	});
	table.html("");
    // var table = d3.select("#artist-metadata");

    // // Use `.html("") to clear any existing metadata
    // table.html("");

    // // Use `Object.entries` to add each key and value pair to the panel
    // // Hint: Inside the loop, you will need to use d3 to append new
    // // tags for each key-value in the metadata.
    // Object.entries(data).forEach(function([key,value]){
    //   table.append("h6").text(`${key}:${value}`);
    })
  };

function buildCharts(artist) {

  // @TODO: Use `d3.json` to fetch the artist data for the plots
    // @TODO: Build a Bubble Chart using the artist data
    var plotdataURL = `/reviews/${artist}`;
    d3.json(plotdataURL).then(function(data){
      console.log(data);
      var albums = data.album;
      var years = data.year;
      var scores = data.score;
      var genres = data.genre;

      var bubble_plot = {
        x: years,
        y: scores,
        text: albums,
        mode: `markers`,
        marker: {
          size: scores,
          color: albums
        }
      };
      var bubble_layout = {
        title: "Album Scores By Year",
        xaxis: {title: "Year"},
        yaxis: {title: "Review Score"}
      };
      plotly.Plot("bubble", bubble_plot, bubble_layout);

    // @TODO: Build a Pie Chart
    d3.json(plotdataURL).then(function(data){
      console.log(data);
      var pie_plot = [{
        "labels": genres,
        "values": scores,
        "hovertext": albums,
        "type": "pie"
      }];
      var pie_layout = {
        margin: {t: 0, l: 0}
      };
    plotly.Plot("pie", pie_plot, pie_layout);
    });
  });
};

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of artist names to populate the select options
  d3.json("/artist_names").then((artistNames) => {
    artistNames.forEach((artist) => {
      selector
        .append("option")
        .text(artist)
        .property("value", artist);
    });

    // Use the first artist from the list to build the initial plots
    const firstArtist = artistNames[0];
    buildCharts(firstArtist);
    buildMetadata(firstArtist);
  });
}

function optionChanged(newArtist) {
  // Fetch new data each time a new artist is selected
  buildCharts(newArtist);
  buildMetadata(newArtist);
}

// Initialize the dashboard
init();


// // Plot the default route once the page loads
// var defaultURL = "/title";
// d3.json(defaultURL).then(function(data) {
//   var data = [data];
//   var layout = { margin: { t: 30, b: 100 } };
//   Plotly.plot("bar", data, layout);
// });

// // Update the plot with new data
// function updatePlotly(newdata) {
//   Plotly.restyle("bar", "x", [newdata.x]);
//   Plotly.restyle("bar", "y", [newdata.y]);
// }

// // Get new data whenever the dropdown selection changes
// function getData(route) {
//   console.log(route);
//   d3.json(`/${route}`).then(function(data) {
//     console.log("newdata", data);
//     updatePlotly(data);
//   });
// }
