
// var pathColours = ["#000", "#f00"];
// var colourIndex = 0;

// our paths
const vector = new ol.layer.Vector({
    source: new ol.source.Vector({
        // CORS is a dick if you try to do this from a local file, so set it to what it will be when deployed
        url: 'https://imlostinpukeiti.vercel.app/data/traildataRaw.gpx',
        format: new ol.format.GPX(),
    }),
    style: function (feature) {
        //var theType = feature.getGeometry().getType();
        // var colourToUse = pathColours[colourIndex];
        // colourIndex++;
        // if(colourIndex== pathColours.length) {
        //     colourIndex = 0;
        // }

        var myStyle = new ol.style.Style({
            stroke: new ol.style.Stroke({
                color: "#000",
                width: 3,
            }),
        })
        return myStyle;
    },
});

// our nice picture
const tile = new ol.layer.Tile({
    source: new ol.source.OSM()
});

// set up the map, giving it the picture layer and the paths layer and centering on pukeiti
map = new ol.Map({
    target: 'map',
    layers: [tile,vector],
    view: new ol.View({
        center: ol.proj.fromLonLat([173.988,-39.193]),
        zoom: 15
    })
});


const displayFeatureInfo = function (pixel) {
    const features = [];
    map.forEachFeatureAtPixel(pixel, function (feature) {
        features.push(feature);
    });
    if (features.length > 0) {
        const info = [];
        let i, ii;
        for (i = 0, ii = features.length; i < ii; ++i) {
        //info.push(features[i].get('desc'));
        info.push(features[i].A.name);
        }
        document.getElementById('info').innerHTML = info.join(', ') || '(unknown)';
        map.getTargetElement().style.cursor = 'pointer';
        $("#info").show();
    } else {
        document.getElementById('info').innerHTML = '&nbsp;';
        map.getTargetElement().style.cursor = '';
        $("#info").hide();
    }
};

map.on('pointermove', function (evt) {
    if (evt.dragging) {
        return;
    }
    $("#info").css({ top: (evt.originalEvent.offsetY + 20) + "px", left: evt.originalEvent.offsetX + "px" });
    const pixel = map.getEventPixel(evt.originalEvent);
    displayFeatureInfo(pixel);
});