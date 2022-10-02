
// var pathColours = ["#000", "#f00"];
// var colourIndex = 0;

// our paths
const vector = new ol.layer.Vector({
    source: new ol.source.Vector({
        // CORS is a dick if you try to do this from a local file, so set it to what it will be when deployed
        url: 'https://imlostinpukeiti.vercel.app/data/traildataRaw2.gpx',
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
const vectorWaypoints = new ol.layer.Vector({
    source: new ol.source.Vector({
        // CORS is a dick if you try to do this from a local file, so set it to what it will be when deployed
        url: 'https://imlostinpukeiti.vercel.app/data/kiwiScanWaypoints.gpx',
        format: new ol.format.GPX(),
    }),
    style: function (feature) {
        const fill = new ol.style.Fill({
            color: 'rgba(255,255,255,0.4)',
          });
          const stroke = new ol.style.Stroke({
            color: '#ff0000', //'#3399CC'
            width: 3,
          });
        var myStyle = new ol.style.Style({
            image: new ol.style.Circle({
                fill: fill,
                stroke: stroke,
                radius: 8,
            }),
            fill: fill,
            stroke: stroke,
        })
        return myStyle;
    },
});

const vectorTopo = new ol.layer.Vector({
    source: new ol.source.Vector({
        // CORS is a dick if you try to do this from a local file, so set it to what it will be when deployed
        format: new ol.format.TopoJSON(),
    })
});

// var waterVectorSource = new ol.source.Tile({
//     format: new ol.format.TopoJSON(),
//     projection: 'EPSG:3857',
//     tileGrid: new ol.tilegrid.XYZ({
//         maxZoom: 19
//     }),
// })

// var imageVectorSource = new ol.source.Image({
//     source:waterVectorSource
// });

// var imageLayer = new ol.layer.Image({
//     source:imageVectorSource
// });


// our nice picture
const tile = new ol.layer.Tile({
    source: new ol.source.OSM()
});

// set up the map, giving it the picture layer and the paths layer and centering on pukeiti
map = new ol.Map({
    target: 'map',
    layers: [tile,vector,vectorWaypoints],  
    view: new ol.View({
        center: ol.proj.fromLonLat([173.988,-39.193]),
        zoom: 15
    })
});


const displayFeatureInfo = function (pixel) {
    const features = [];
    map.forEachFeatureAtPixel(pixel, function (feature) {
        features.push(feature);
    }, { hitTolerance: 5, });
    console.log(features)
    if (features.length > 0) {
        const info = [];
        let i, ii;
        for (i = 0, ii = features.length; i < ii; ++i) {
            //var props = features[i].getGeometry().getProperties();

            var theType = features[i].getGeometry().getType();
            // either Point or MultiLineString
            let hover = features[i].A.name;
            if(theType === "Point") {
                var coordinates = features[i].getGeometry().getCoordinates();
                var properShit = ol.proj.transform(coordinates, 'EPSG:3857', 'EPSG:4326');
                //console.log(properShit)
                hover += "<br/>@ " + properShit[0] + "," + properShit[1];
            }
            //info.push(features[i].get('desc'));
            info.push(hover);
        }
        document.getElementById('info').innerHTML = info.join('<br/>') || '(unknown)';
        map.getTargetElement().style.cursor = 'pointer';
        $("#info").show();
    } else {
        document.getElementById('info').innerHTML = '&nbsp;';
        map.getTargetElement().style.cursor = '';
        $("#info").hide();
    }
};

map.on('click', function(evt) {
    console.log("that's a click")
    $("#info").css({ top: (evt.originalEvent.screenY) + "px", left: evt.originalEvent.screenX + "px" });
    const pixel = map.getEventPixel(evt.originalEvent);
    displayFeatureInfo(pixel);
});

// map.on('pointermove', function (evt) {
//     if (evt.dragging) {
//         return;
//     }
//     $("#info").css({ top: (evt.originalEvent.offsetY + 20) + "px", left: evt.originalEvent.offsetX + "px" });
//     // console.log("*****************************")
//     // console.log(evt)

//     // console.log(ol.proj.transform(evt.coordinate, 'EPSG:3857', 'EPSG:4326'));

//     const pixel = map.getEventPixel(evt.originalEvent);
//     displayFeatureInfo(pixel);
// });