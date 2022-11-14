<!-- <template>
  <div id="my-node">
    <button @click="img">Click</button>
    <Bar :chart-options="chartOptions" :chart-data="chartData" :chart-id="chartId" :dataset-id-key="datasetIdKey"
      :plugins="plugins" :css-classes="cssClasses" :styles="styles" :width="width" :height="height" />

  </div>
</template>
  
<script>
import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'
import { jsPDF } from "jspdf";
import { onMounted } from 'vue';
import { toPng, toJpeg, toBlob, toPixelData, toSvg } from 'html-to-image';

var htmlToImage = require('html-to-image');
const doc = new jsPDF();
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

export default {
  name: 'BarChart',
  components: { Bar },
  props: {
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
  },
  data() {
    onMounted(() => {
      
    })
    function img(params) {
      htmlToImage.toPng(document.getElementById('my-node'),{ backgroundColor: "white", canvasWidth:1024, canvasHeight:720 })
  .then(function (dataUrl) {
    require("downloadjs")(dataUrl, "my-node.png", "image/png");
    // download(dataUrl, 'my-node.png');
  });
    }
    return {
      img,
      chartData: {
        labels: ['January', 'February', 'March',"a","b","c","d","e","f"],
        datasets: [
          {
            label: 'Data One',
            backgroundColor: 'red',
            data: [40, 20, 12, 50, 10, 22,50, 10, 22]
          },
          {
            label: 'Data two',
            backgroundColor: 'blue',
            data: [50, 10, 22, 50, 10, 22,50, 10, 22]
          }
        ]
      },
      chartOptions: {
        responsive: true
      }
    }
  }


}
</script> -->

<template>
  <div id="app" ref="document">
    <div id="element-to-convert">
      <center>
        <img width="400" src="../../../src/assets/quasar-logo-vertical.svg" />
      </center>
    </div>
    <button @click="exportToPDF">Export to PDF</button>
  </div>
</template>

<script>
import html2pdf from "html2pdf.js";

export default {
  name: "app",
  methods: {
    exportToPDF() {
      html2pdf(document.getElementById("element-to-convert"), {
				margin: 1,
  			filename: "i-was-html.pdf",
			});
    },
  },
};
</script>

<style>
#app {
  margin-top: 60px;
  text-align: center;
}
</style>