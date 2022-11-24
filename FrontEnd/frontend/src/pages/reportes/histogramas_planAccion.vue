  <template>
    <div class="example q-pa-md">
      <p>
        <label><b>Cumplimiento de medidas(%):</b> </label> &nbsp;
        <q-btn @click="changeCorto" class="bg-secondary q-ma-xs">Corto</q-btn>
        <q-btn @click="changeMediano" class="bg-secondary q-ma-xs">Mediano</q-btn>
        <q-btn @click="changeLargo" class="bg-secondary q-ma-xs">Largo</q-btn>
        <q-btn @click="changeTotal" class="bg-secondary q-ma-xs">Total</q-btn>
      </p>
      <apexcharts
        width="100%"
        height="350"
        type="bar"
        :options="data.chartOptions"
        :series="data.series"
      ></apexcharts>
    </div>
  </template>

<script setup>
import { reactive,onMounted } from "vue";
import apexcharts from "vue3-apexcharts";
  
  let temp=console.log.bind(console);
  const props=defineProps(["dataHistogram"])
  onMounted(() => {
    temp(props.dataHistogram)
  })
  let data=reactive({

    chartOptions: {
      chart: {
        id: "basic-bar",
        animations: {
          speed: 500
        }
      },
      dataLabels: {
        enabled: false
      },
      colors:['#C10015', '#0022ff'],
      xaxis: {
        categories: []
      },
      yaxis: {
        maxValue:100,
        decimalsInFloat:2
      }
    },
    series: [
      {
        name: "año-1",
        data: [],
      },
      {
        name: "año-2",
        data: [],
      },
    ]
  })
  
    
    function changeCorto(e) {
      let category=[]
      let data1=[],data2=[]
      for (let index = 0; index < props.dataHistogram.year1[0].length; index++) {
        category.push(props.dataHistogram.year1[0][index].entidad);
        data1.push(props.dataHistogram.year1[0][index].porcientoCorto)
        data2.push(props.dataHistogram.year2[0][index].porcientoCorto)
      }
      data.chartOptions = {
        xaxis: {
          categories: category
        }
      };
      data.series=[
        {
          name: props.dataHistogram.year1[0][0].year,
          data: data1,
        },
        {
          name: props.dataHistogram.year2[0][0].year,
          data: data2,
        }
      ]
    }

    function changeMediano(e) {
      let category=[]
      let data1=[],data2=[]
      for (let index = 0; index < props.dataHistogram.year1[0].length; index++) {
        category.push(props.dataHistogram.year1[0][index].entidad);
        data1.push(props.dataHistogram.year1[0][index].porcientoMedio)
        data2.push(props.dataHistogram.year2[0][index].porcientoMedio)
      }
      data.chartOptions = {
        xaxis: {
          categories: category
        },
      };
      data.series=[
        {
          name: props.dataHistogram.year1[0][0].year,
          data: data1,
        },
        {
          name: props.dataHistogram.year2[0][0].year,
          data: data2,
        }
      ]
    }
    function changeLargo(e) {
      let category=[]
      let data1=[],data2=[]
      for (let index = 0; index < props.dataHistogram.year1[0].length; index++) {
        category.push(props.dataHistogram.year1[0][index].entidad);
        data1.push(props.dataHistogram.year1[0][index].porcientoLargo)
        data2.push(props.dataHistogram.year2[0][index].porcientoLargo)
      }
      data.chartOptions = {
        xaxis: {
          categories: category
        }
      };
      data.series=[
        {
          name: props.dataHistogram.year1[0][0].year,
          data: data1,
        },
        {
          name: props.dataHistogram.year2[0][0].year,
          data: data2,
        }
      ]
    }

    function changeTotal(e) {
      let category=[]
      let data1=[],data2=[]
      for (let index = 0; index < props.dataHistogram.year1[0].length; index++) {
        category.push(props.dataHistogram.year1[0][index].entidad);
        data1.push(props.dataHistogram.year1[0][index].porcientoTotal)
        data2.push(props.dataHistogram.year2[0][index].porcientoTotal)
      }
      data.chartOptions = {
        xaxis: {
          categories: category
        }
      };
      data.series=[
        {
          name: props.dataHistogram.year1[0][0].year,
          data: data1,
        },
        {
          name: props.dataHistogram.year2[0][0].year,
          data: data2,
        }
      ]
    }
  

</script>