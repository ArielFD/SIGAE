<template>
    <div id="app">
        <div id="map">
            <div id="popup"></div>
        </div>
    </div>
</template>
 
<script setup>

import "ol/ol.css";
import GeoJSON from 'ol/format/GeoJSON';
import BingMaps from 'ol/source/BingMaps.js';
import { Feature, Map, Overlay, View } from 'ol/index';
import { OSM, Vector as VectorSource } from 'ol/source';
import { Point } from 'ol/geom';
import { Layer, Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';
import { useGeographic } from 'ol/proj';
import { onMounted, reactive } from "vue"
import { Draw, Modify, Snap } from 'ol/interaction';
import { api } from "boot/axios.js";
import cuenca_bahia from "../../public/cuenca"

const geojsonFormat = new GeoJSON();
const geojsonSource = new VectorSource({
    features: geojsonFormat.readFeatures(cuenca_bahia)
});

// const vectorLayer = new VectorLayer({
//     source: geojsonSource
// });

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
                if (response.data.data[index].attributes.tipo_fuente == "Directa") data.directa.push(new Feature({geometry:new Point(spot),id:response.data.data[index].attributes.entidad}))
                if (response.data.data[index].attributes.tipo_fuente == "Indirecta") data.indirecta.push(new Feature({geometry:new Point(spot),id:response.data.data[index].attributes.entidad}))
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
            // new TileLayer({
            //     source: new OSM(),
            // }),
            new TileLayer({
                // visible: false,
                // preload: Infinity,
                source: new BingMaps({
                    key: 'Ap7tyqRHQsO5Stf47WmhtNXHeXqofmTlHKTTJ-2iA6-GhtvCXYJ43XCwWSTOt-oi',
                    imagerySet: "Aerial",
                    // use maxZoom 19 to see stretched tiles instead of the BingMaps
                    // "no photos at this zoom level" tiles
                    // maxZoom: 19
                    //         const styles = [
                    //   'RoadOnDemand',
                    //   'Aerial',
                    //   'AerialWithLabelsOnDemand',
                    //   'CanvasDark',
                    //   'OrdnanceSurvey',
                    // ];

                }),
            }),
            new VectorLayer({
                source: geojsonSource
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
                    'circle-fill-color': 'yellow',
                },
                draggable: false
            })
        ],
    });

    // map.addLayer(vectorLayer);

    // let modify = new Modify({ source: source });
    // let modify1 = new Modify({ source: source1 });

    // map.addInteraction(modify);
    // map.addInteraction(modify1);

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

    function formatCoordinate(coordinate,id) {
        if(coordinate.length==2){
            return `
            <table>
              <tbody>
                <tr><th>Entidad:</th><td><b>${id}</b></td></tr>
              </tbody>
            </table>`;
        }
        else{
            return `
            <table>
              <tbody>
                
              </tbody>
            </table>`;
        }
    }

    let info = document.getElementById('info');
    map.on('moveend', function () {
        let view = map.getView();
        let center = view.getCenter();
        // info.innerHTML = formatCoordinate(center);
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
        const id=feature.values_.id
        
        popup.setPosition([
            coordinate[0] + Math.round(event.coordinate[0] / 360) * 360,
            coordinate[1],
        ]);

        data.longitud = event.coordinate[0]
        data.latitud = event.coordinate[1]

        popover = new bootstrap.Popover(element, {
            container: element.parentElement,
            content: formatCoordinate(coordinate,id),
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
    height: 600px;
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