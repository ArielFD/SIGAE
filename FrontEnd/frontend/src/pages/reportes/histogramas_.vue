<template>
  <div id="my-node">
    <button @click="img">Click</button>
    <Bar :chart-options="chartOptions" :chart-data="chartData" :chart-id="chartId" :dataset-id-key="datasetIdKey"
      :plugins="plugins" :css-classes="cssClasses" :styles="styles" :width="width" :height="height" />
  </div>
</template>
  
<script setup>
import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'
import { jsPDF } from "jspdf";
import { onMounted } from 'vue';
import { toPng, toJpeg, toBlob, toPixelData, toSvg } from 'html-to-image';

var htmlToImage = require('html-to-image');
const doc = new jsPDF();
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

const props = defineProps({
  chartId: {
    type: String,
    default: 'bar-chart'
  },
  datasetIdKey: {
    type: String,
    default: 'label'
  },
  width: {
    type: Number,
    default: 200
  },
  height: {
    type: Number,
    default: 200
  },
  cssClasses: {
    default: '',
    type: String
  },
  styles: {
    type: Object,
    default: () => { }
  },
  plugins: {
    type: Object,
    default: () => { }
  }
});
const height=100;
const chartData = {
  labels: ['January', 'February', 'March', "a", "b", "c", "d", "e", "f"],
  datasets: [
    {
      label: 'Data One',
      backgroundColor: 'red',
      data: [40, 20, 12, 50, 10, 22, 50, 10, 22]
    },
    {
      label: 'Data two',
      backgroundColor: 'blue',
      data: [50, 10, 22, 50, 10, 22, 50, 10, 22]
    }
  ]
};
const chartOptions = {
  responsive: true
}

onMounted(() => {

})

function img(params) {
  htmlToImage.toPng(document.getElementById('my-node'), { backgroundColor: "white", canvasWidth: 1024, canvasHeight: 720 })
    .then(function (dataUrl) {
      require("downloadjs")(dataUrl, "my-node.png", "image/png");
      // download(dataUrl, 'my-node.png');
    });
}
</script>
