<template>
    <div id="app">
        <div id="map">
            <div id="popup"></div>
        </div>
        <!-- <form>
            <label for="type">Geometry type &nbsp;</label>
            <select id="type">
                <option value="Point">Point</option>
            </select>
        </form> -->
        <div class="row justify-start q-pa-md">
            <q-input v-model="data.longitud" label="Longitud" class="q-pa-md" readonly />
            <q-input v-model="data.latitud" label="Latitud" class="q-pa-md" readonly />
            <q-btn @click="mostrar" dense flat class="q-mt-md q-mb-md bg-primary text-secondary">Confirmar</q-btn>
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

const emit = defineEmits(["addLatLon"])
const props = defineProps(["LatLon"])

let data = reactive({
    longitud: 0,
    latitud: 0,
    mostrar: false
})

onMounted(() => {
    data.longitud = props.LatLon[0]
    data.latitud = props.LatLon[1]
    useGeographic();
    mostrar()
})

function mostrar(params) {
    let elements = document.getElementsByClassName("ol-viewport")
    while (elements.length > 0) {
        elements[0].parentNode.removeChild(elements[0])
    }

    let place = [data.longitud, data.latitud];

    let point = new Point(place);

    let source = new VectorSource({
        features: [new Feature(point)],
    });

    let map = new Map({
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
                source: source,
                style: {
                    'circle-radius': 9,
                    'circle-fill-color': 'red',
                },
            }),
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
    map.addOverlay(popup);

    function formatCoordinate(coordinate) {
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

    emit('addLatLon',[data.longitud,data.latitud])

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