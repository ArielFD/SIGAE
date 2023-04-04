<template>
    <div id="app">
        <div id="map">
            <div id="popup"></div>
        </div>
    </div>
</template>
 
<script setup>

import "ol/ol.css";
import { Feature, Map, Overlay, View } from 'ol/index';
import { OSM, Vector as VectorSource } from 'ol/source';
import { Point } from 'ol/geom';
import { Layer, Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';
import { useGeographic } from 'ol/proj';
import { onMounted, reactive } from "vue"
import { Draw, Modify, Snap } from 'ol/interaction';
import { api } from "boot/axios.js";

let data = reactive({
    longitud: -82.337749,
    latitud: 23.120906,
    directa: [],
    indirecta: []
    // mostrar: false
})

onMounted(() => {
    entidadesActivas()
    useGeographic();
})

function entidadesActivas() {
    api
        .get(`/entidads?filters[activo][$eq]=s`).then(function (response) {
            console.log(response);
            for (let index = 0; index < response.data.data.length; index++) {
                let spot = [response.data.data[index].attributes.longitud, response.data.data[index].attributes.latitud]
                if (response.data.data[index].attributes.tipo_fuente == "Directa") data.directa.push(new Feature(new Point(spot)))
                if (response.data.data[index].attributes.tipo_fuente == "Indirecta") data.indirecta.push(new Feature(new Point(spot)))
            }
            mostrar()
        }).catch(function (error) {
            console.log(error);
        });
}

function mostrar(params) {
    let elements = document.getElementsByClassName("ol-viewport")
    while (elements.length > 0) {
        elements[0].parentNode.removeChild(elements[0])
    }

    let place = [data.longitud, data.latitud];

    let source = new VectorSource({
        features: data.directa,
    });

    let source1 = new VectorSource({
        features: data.indirecta,
    });

    let map = new Map({
        target: 'map',
        view: new View({
            projection: "EPSG:4326",
            center: place,
            zoom: 13,
        }),
        layers: [
            new TileLayer({
                source: new OSM(),
            }),
            new VectorLayer({
                source: source,
                style: {
                    'circle-radius': 3,
                    'circle-fill-color': 'red',
                },
            }),
            new VectorLayer({
                source: source1,
                style: {
                    'circle-radius': 3,
                    'circle-fill-color': 'blue',
                },
            })
        ],
    });

    let modify = new Modify({ source: source });
    map.addInteraction(modify);

    let draw, snap; // global so we can remove them later
    // let typeSelect = document.getElementById('type');;

    function addInteractions() {
        // draw = new Draw({
        //     source: source,
        //     type: typeSelect.value,
        // });
        //map.addInteraction(draw);
        snap = new Snap({ source: source });
        map.addInteraction(snap);
    }

    // typeSelect.onchange = function () {
    //     //map.removeInteraction(draw);
    //     map.removeInteraction(snap);
    //     addInteractions();
    // };
    addInteractions();

    let element = document.getElementById('popup');

    let popup = new Overlay({
        element: element,
        stopEvent: false,
    });

    function formatCoordinate(coordinate) {
        console.log(coordinate);
        return `
        <table>
          <tbody>
            <tr><th>lon</th><td>${coordinate[0]}</td></tr>
            <tr><th>lat</th><td>${coordinate[1]}</td></tr>
          </tbody>
        </table>`;
    }

    let info = document.getElementById('info');
    map.on('moveend', function () {
        let view = map.getView();
        let center = view.getCenter();
        //info.innerHTML = formatCoordinate(center);
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

        data.longitud = event.coordinate[0]
        data.latitud = event.coordinate[1]

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

}





</script>

<style>
#map {
    position: relative;
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