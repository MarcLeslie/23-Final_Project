////////////////////////////////////////////////////
// Define  layer groups to be used by mapping
var dispensaries = L.layerGroup();
var crime = L.layerGroup();
var crimemedian = L.layerGroup();

init();

////////////////////////////////////////////////////
// Define map layers
var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "streets-v11",
    accessToken: API_KEY
});

var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "dark-v10",
    accessToken: API_KEY
});

var grayscalemap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/light-v10",
    accessToken: API_KEY
});


////////////////////////////////////////////////////
// Define a baseMaps object to hold our base layers
var baseMaps = {
    "Grayscale": grayscalemap,
    "Street": streetmap,
    "Dark": darkmap
};


////////////////////////////////////////////////////
// Create overlay object to hold our overlay layer
var overlayMaps = {
    Dispensaries: dispensaries,
    Crime: crime,
    GeoMedian: crimemedian
};


////////////////////////////////////////////////////
// Create Map
var myMap = L.map("map", {
    center: [34.0522, -118.357],
    zoom: 9.5,
    layers: [grayscalemap, dispensaries, crime] //ORDERING THIS SO THAT THE TOOLTIPS WORK
});


////////////////////////////////////////////////////
// Create a layer control
// Pass in our baseMaps and overlayMaps
// Add the layer control to the map
L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
}).addTo(myMap);


////////////////////////////////////////////////////
// Map disp data
function createDisp(yearVal) {

    d3.json(dispQuery).then(function (data) {
        // console.log(data.features)

        // Clear layer on val change
        dispensaries.clearLayers();

        // Define a function we want to run once for each feature in the features array
        function onEachFeature(feature, layer) {
            layer.bindPopup("<h4>" + feature.properties.business_name +
                "</h4><p>" + feature.properties.street_address + "</p>");
        }

        // Create filter for year
        function yearFilter(feature) {
            if (feature.properties.location_start_year <= yearVal) return true
        }

        // replace Leaflet's default blue marker with a custom icon
        function createCustomIcon(feature, latlng) {
            let myIcon = L.icon(icon)
            return L.marker(latlng, { icon: myIcon })
        };

        // Create a GeoJSON layer containing the features array on the dispensary object
        // Add GeoJSON to the dispensaries layergroup
        L.geoJSON(data.features, {
            onEachFeature: onEachFeature,
            filter: yearFilter,
            pointToLayer: createCustomIcon
        }).addTo(dispensaries);
    });

};


//////////////////////////////////////////////////
// Map crime data
function createCrimeChoropleth(yearVal) {
    d3.json(crimesQuery).then(function (data) {
        // Clear layer on val change
        crime.clearLayers();

        // Creating style for the choropleth
        function style(feature) {
            return {
                fillColor: getColor(feature.properties.crime_counts),
                weight: choroWeight,
                opacity: choroOpacity,
                color: choroColor,
                dashArray: choroDashArray,
                fillOpacity: choroFillOpacity
            }
        }

        function filter(feature) {
            if (feature.properties.year == yearVal) return true
        }

        // Add crimes GeoJSON to the techtonics layergroup
        L.geoJSON(data.features, {
            style: style,
            filter: filter
        }).addTo(crime)

    });
}


//////////////////////////////////////////////////
// Map crime data
function createCrimeMedian(yearVal) {
    d3.json(geoMedianQuery).then(function (data) {
        //Clear layer on val change
        crimemedian.clearLayers();

        function filter(feature) {
            if (feature.properties.year == yearVal) return true
        }

        // Define a function we want to run once for each feature in the features array
        function onEachFeature(feature, layer) {
            layer.bindPopup("<h3>" + feature.properties.business_name +
                "</p><p>" + feature.properties.street_address + "</p>");
        };

        // replace Leaflet's default blue marker with a custom icon
        function createCustomIcon(feature, latlng) {
            let myIcon = L.icon(iconMedian)
            return L.marker(latlng, { icon: myIcon })
        };

        // Add crimes GeoJSON to the techtonics layergroup
        L.geoJSON(data.features, {
            // style: style,
            filter: filter,
            pointToLayer: createCustomIcon
        }).addTo(crimemedian)

    });
}


//////////////////////////////////////////////////
// Map crime by type data
function createCrimeGraph(yearVal) {
    // Fetch the JSON data and console log it
    var listCT = [];

    d3.json(crimeTypeQuery).then((data) => {

        // console.log(data.length);
        for (var i = 0; i < data.length; i++) {
            if (data[i].Year == yearVal) {
                listCT.push(data[i]);
            }
        }

        /////        // //Populate the barchart
        var crimeTypeRollUp = d3.nest()
            .key(function (d) { return d.Year })
            .key(function (d) { return d.Crime_Type })
            .rollup(function (v) { return d3.sum(v, function (d) { return d.Crime_Counts; }); })
            .entries(listCT)
            .map(function (d) {
                // return {d}
                return { Year: d.key, Crimes: d.values }
            });
        /////        // createBar(listCT);
        const n = 10
        var crimeCounts = [];
        var crimeType = [];
        for (var i = 0; i < crimeTypeRollUp[0].Crimes.length; i++) {
            crimeCounts.push(crimeTypeRollUp.map(rec => rec.Crimes[i].value));
            crimeType.push(crimeTypeRollUp.map(rec => rec.Crimes[i].key));
        }


        var xaxis = crimeType.flat().slice(0, n) //adding flat() since there is a nested array
        var yaxis = crimeCounts.flat().slice(0, n) //appending a literal
        var text = crimeType.flat().slice(0, n)

        var trace = {
            x: xaxis,
            y: yaxis,
            text: text,
            type: "bar",
            marker: markerColor,
            hovertemplate: '<i># Crimes</i>: %{y}<extra></extra>'
        };

        // Create the data array for the plot
        var data = [trace];

        // Define the plot layout
        const barTitle = `Crime Types For ${yearVal}`
        const layout = barLayout; //from app_config
        layout["title"]["text"] = barTitle

        // Plot the chart to a div tag with id "plot"
        Plotly.newPlot("barchart", data, layout);

        var myPlot = document.getElementById('barchart');

        myPlot.on('plotly_hover', function (data) {
            ct = data.points[0].text;
            createCrimeYearGraph(ct)
        });

        myPlot.on('plotly_unhover', function (data) {
            ct = data.points[0].text;
            createCrimeYearGraph("")
        });
    });
}


//////////////////////////////////////////////////
// Map crime by year data
function createCrimeYearGraph(crimeVal) {
    // Fetch the JSON data and console log it
    var listCTY = [];

    d3.json(crimeTypeQuery).then((data) => {

        if (crimeVal) {
            for (var i = 0; i < data.length; i++) {
                if (data[i].Crime_Type == crimeVal) {
                    listCTY.push(data[i]);
                }
            }
        }
        else { listCTY = data }

        var dataRollUp = d3.nest()
            .key(function (d) { return d.Year })
            .rollup(function (v) { return d3.sum(v, function (d) { return d.Crime_Counts; }); })
            .entries(listCTY)
            .map(function (d) {
                return { Year: d.key, Counts: d.value }
            });

        // Populate the barchart 
        createCrimeChart(dataRollUp, crimeVal);
    });
}

////////////////////////////////////////////////////
// Create time series chart
function createCrimeChart(list, name) {
    //Create the Traces
    const n = 10
    var crimeCounts = list.map(rec => rec.Counts);
    var crimeYear = list.map(rec => rec.Year);

    var xaxis = crimeYear
    var yaxis = crimeCounts
    var text = crimeYear.flat().slice(0, n)

    var trace = {
        x: xaxis,
        y: yaxis,
        text: text,
        type: "line",
        marker: markerColor
    };

    // Create the data array for the plot
    var data = [trace];

    // Define the plot layout
    var lineTitle = `${name} Year Over Year`;
    const layout = lineLayout; //from app_config
    layout["title"]["text"] = lineTitle

    // Plot the chart to a div tag with id "plot"
    Plotly.newPlot("crimechart", data, layout);
}


////////////////////////////////////////////////////
//Populates the dropdown list
function createRadioButtons(year) {
    var radioTag = document.getElementById("control");

    for (var i = 0; i < year.length; i++) {
        var newRadio = year[i];

        // Create inputs for label
        var inp = document.createElement("input")
        inp.setAttribute("class", "form-check-input");
        inp.type = "radio";
        inp.id = newRadio;
        inp.name = "year";
        inp.value = newRadio;
        inp.setAttribute("onchange", "optionChanged(this.value)");

        // Add a default checked box to the first option selected
        if (i == 0) { inp.setAttribute("checked", "checked") }

        // Add column dividers for the radio buttons
        var div = document.createElement("div");
        div.setAttribute("class", "form-check form-check-inline")
        radioTag.append(div);

        // Add new radio to control tag
        //radioTag.append(inp);
        div.append(inp);

        // Create label for the radio
        var lb = document.createElement("label");
        lb.setAttribute("class", "form-check-label");
        lb.setAttribute("for", newRadio);
        lb.textContent = newRadio;

        // Add input to the control tag
        div.append(lb);
    }

};


//////////////////////////////////////////////////
// LEGEND
// Create a legend to display information about our map
var legend = L.control({ position: "bottomright" });

// When the layer control is added, insert a div with the class of "legend"
legend.onAdd = function () {
    var div = L.DomUtil.create("div", "info legend");


    div.innerHTML += 'Crime Incidents' + '<br>';
    for (var i = 0; i < categories.length; i++) {
        // div.innerHTML += '<i style="background:'
        if (i == 0) {
            div.innerHTML += '<i style="background:' + getColor(categories[i]) + '"></i> ' +
                '<= ' + categories[i] + '<br>';

        }
        var start_level = categories[i] + 1;
        var end_level = categories[i + 1];

        div.innerHTML += '<i style="background:' + getColor(categories[i] + 1) + '"></i> ' +
            start_level + (end_level ? '&ndash;' + end_level + '<br>' : '+');

    }
    return div;
};

legend.addTo(myMap);



////////////////////////////////////////////////////
//Initializes the Dashboard
function init() {
    var val = 2019;

    var yr = year; //comes from config

    createRadioButtons(yr);
    optionChanged(val);

}


////////////////////////////////////////////////////
//Captures on change values
function optionChanged(val) {
    var crimeVal = "";
    var crimeType = "";

    if (isNaN(val) == false) {
        createDisp(val);
        createCrimeChoropleth(val);
        createCrimeGraph(val);
        createCrimeMedian(val);
    } else { autoRun() }

    createCrimeYearGraph(crimeVal, crimeType);
}
