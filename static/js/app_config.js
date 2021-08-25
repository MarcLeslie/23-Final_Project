////////////////////////////////////////////////////
// Input files
const dispQuery = "../data/disp.geojson"
const crimesQuery = "../data/crime.geojson"
const crimeTypeQuery = "../data/crime_grouped.json"
const geoMedianQuery = "../data/crime_median.geojson"
const iconMarker = "../images/leaf.svg"
const iconMarkerMedian = '../images/crime.svg'

////////////////////////////////////////////////////
// Year list/array
var year = [2019, 2018, 2017, 2016, 2015, 2014, 2013];

////////////////////////////////////////////////////
// Chart configuration
// layout for the bar chart
const markerColor = {color: "#9a0e2a"}
const textColor = "#453b3d"
const chartBGColor = "#E7EAEE"

const barLayout = {
  title: {
    font: {
      size: 16
    }
  },
  font: {
    size: 10,
    color: textColor
  },
  margin: {
    l: 50,
    r: 50,
    b: 55,
    t: 50,
    pad: 4
  },
  height: 250,
  width: 600,
  xaxis: {
    tickangle: 45
  },
  yaxis: {
    showgrid: false,
    showline: false
  },
  plot_bgcolor: chartBGColor,
  paper_bgcolor: chartBGColor, 
  hovermode: 'closest'
};

// layout for line chart
const lineLayout = {
  title: {
    font: {
      size: 16
    }
  },
  font: {
    size: 12,
    color: "textColor"
  },
  height: 250,
  width: 600,
  margin: {
    l: 50,
    r: 50,
    b: 50,
    t: 75,
    pad: 4
  },
  plot_bgcolor: chartBGColor,
  paper_bgcolor: chartBGColor
};

////////////////////////////////////////////////////
// icon properties
const icon = {
  iconUrl: iconMarker,
  iconSize: [20, 20], // width and height of the image in pixels
  shadowSize: [35, 20], // width, height of optional shadow image
  iconAnchor: [12, 12], // point of the icon which will correspond to marker's location
  shadowAnchor: [12, 6],  // anchor point of the shadow. should be offset
  popupAnchor: [0, 0] // point from which the popup should open relative to the iconAnchor
};

////////////////////////////////////////////////////
// icon properties
const iconMedian = {
  iconUrl: iconMarkerMedian,
  iconSize: [20, 20], // width and height of the image in pixels
  shadowSize: [35, 20], // width, height of optional shadow image
  iconAnchor: [12, 12], // point of the icon which will correspond to marker's location
  shadowAnchor: [12, 6],  // anchor point of the shadow. should be offset
  popupAnchor: [0, 0] // point from which the popup should open relative to the iconAnchor
};


////////////////////////////////////////////////////
// choropleth style used in the style()
const choroWeight = 2;
const choroOpacity = 1;
const choroColor = 'white';
const choroDashArray = '3';
const choroFillOpacity = 0.7;


//////////////////////////////////////////////////
// Define colors for choropleth
let categories = [5417, 6606, 7794, 8983]

function getColor(counts) {
  var color;

  if (counts < 5418) { color = '#FECFCF' }
  else if (counts < 6606) { color = '#FD504F' }
  else if (counts < 7794) { color = '#B01030' }
  else if (counts < 8983) { color = '#840c24' }
  else { color = '#6e0a1e' } //i.e., max

  return color;
}