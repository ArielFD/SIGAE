<template>
    <div id="app">
        <div id="map">
            <div id="popup"></div>
        </div>
        <div id="info"></div>
    </div>

</template>
 
<script setup>

import "ol/ol.css";
import { Feature, Map, Overlay, View } from 'ol/index';
import { OSM, Vector as VectorSource } from 'ol/source';
import { Point } from 'ol/geom';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';
import { useGeographic } from 'ol/proj';
import { onMounted } from "vue"

onMounted(() => {
    useGeographic();

    const place = [-82.374751, 23.117113];

    const point = new Point(place);

    const map = new Map({
        target: 'map',
        view: new View({
            projection: "EPSG:4326",
            center: place,
            zoom: 16,
        }),
        layers: [
            new TileLayer({
                source: new OSM(),
            }),
            new VectorLayer({
                source: new VectorSource({
                    features: [new Feature(point)],
                }),
                style: {
                    'circle-radius': 9,
                    'circle-fill-color': 'red',
                },
            }),
        ],
    });

    const element = document.getElementById('popup');

    const popup = new Overlay({
        element: element,
        stopEvent: false,
    });
    map.addOverlay(popup);

    function formatCoordinate(coordinate) {
        return `
        <table>
          <tbody>
            <tr><th>lon</th><td>${coordinate[0].toFixed(2)}</td></tr>
            <tr><th>lat</th><td>${coordinate[1].toFixed(2)}</td></tr>
          </tbody>
        </table>`;
    }

    const info = document.getElementById('info');
    map.on('moveend', function () {
        const view = map.getView();
        const center = view.getCenter();
        info.innerHTML = formatCoordinate(center);
    });

    let popover;
    map.on('click', function (event) {
        if (popover) {
            popover.dispose();
            popover = undefined;
        }
        const feature = map.getFeaturesAtPixel(event.pixel)[0];
        if (!feature) {
            return;
        }
        const coordinate = feature.getGeometry().getCoordinates();
        popup.setPosition([
            coordinate[0] + Math.round(event.coordinate[0] / 360) * 360,
            coordinate[1],
        ]);

        popover = new bootstrap.Popover(element, {
            container: element.parentElement,
            content: formatCoordinate(coordinate),
            html: true,
            offset: [0, 20],
            placement: 'top',
            sanitize: false,
        });
        popover.show();
    });

    map.on('pointermove', function (event) {
        const type = map.hasFeatureAtPixel(event.pixel) ? 'pointer' : 'inherit';
        map.getViewport().style.cursor = type;
    });

    // map.on('singleclick', function (e) {
    //     let url = wmsLayer.getSource().getFeatureInfoUrl(
    //         e.coordinate,
    //         map.getView().getResolution(),
    //         'EPSG:3857',
    //         {
    //             'INFO_FORMAT': 'application/json',
    //             'propertyName': 'sovereignt,scalerank,labelrank,type'
    //         }
    //     );
    //     fetch(url)
    //         .then((response) => response.text())
    //         .then((json) => {
    //             map.getOverlays().clear();

    //             let popup = new Overlay(map).overlay;
    //             popup.setPosition(e.coordinate);

    //             let feature = JSON.parse(json).features;
    //             if (feature.length) {
    //                 let properties = feature[0].properties;
    //                 let table = document.createElement('table');

    //                 Object.entries(properties).forEach((value) => {
    //                     let tr = document.createElement('tr');

    //                     let td1 = document.createElement('th')
    //                     td1.style.textAlign = "left";

    //                     let td2 = document.createElement('td')
    //                     td2.style.textAlign = "left";

    //                     td1.innerHTML = value[0];
    //                     td2.innerHTML = value[1];

    //                     tr.append(td1);
    //                     tr.append(td2);
    //                     table.append(tr);
    //                 });
    //                 popup.element.append(table);
    //             } else {
    //                 map.getOverlays().clear();
    //             }
    //         });
    // });

})


</script>

<style>
#map {
    position: absolute;
    margin: 0;
    padding: 0;
    height: 500px;
    width: 99%;
}

#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
}

#nav {
    padding: 30px;
}

#nav a {
    font-weight: bold;
    color: #2c3e50;
}

#nav a.router-link-exact-active {
    color: #42b983;
}
</style>