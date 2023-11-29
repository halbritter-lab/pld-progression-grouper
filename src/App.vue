<template>
  <div id="app" class="container">
    <h1 class="app-title">PLD-Progression Grouper</h1>
    <div class="content">
      <div class="controls">
        <div class="input-group">
          <label for="idInput">ID:</label>
          <input type="text" id="idInput" v-model="patientId" placeholder="Enter ID" />
        </div>
        <div class="input-group">
          <label for="ageInput">Age:</label>
          <input type="number" id="ageInput" v-model="age" placeholder="20-80" />
        </div>
        <div class="input-group">
          <label for="liverInput">Total Liver Volume (TLV) [ml] :</label>
          <input type="number" id="liverInput" v-model="totalLiverVolume" placeholder="0-100" />
        </div>
        <div class="input-group">
          <label for="normalizedTLV">Normalized Total Liver Volume (nTLV):</label>
          <output id="normalizedTLV" class="output-field">{{ formattedNormalizedTLV }}</output>
        </div>
        <button @click="addDataPoint">Plot Point</button>
        <button @click="printPage">Print Page</button>
        <button @click="downloadChart">Download Plot</button>
      </div>
      <div class="chart-container">
        <canvas ref="chartCanvas"></canvas>
      </div>
    </div>
  </div>
</template>


<script>
import { ref, onMounted, computed } from 'vue';
import { Chart, registerables } from 'chart.js';

// Register the necessary components for Chart.js
Chart.register(...registerables);

export default {
  setup() {
    // Reactive references for form inputs and chart canvas
    const patientId = ref('');
    const age = ref(20);
    const totalLiverVolume = ref(0);
    const chartCanvas = ref(null);
    let chart = null;

    // Computed property for normalized total liver volume
    const normalizedTLV = computed(() => {
      return totalLiverVolume.value / 850;
    });

    // New computed property for formatted normalizedTLV
    const formattedNormalizedTLV = computed(() => {
      return normalizedTLV.value.toFixed(3); // Rounds to 3 decimal places
    });

    // Method to add a new data point to the chart
    const addDataPoint = () => {
      const newData = {
        x: age.value,
        y: normalizedTLV.value, // Use normalized value for plotting
        id: patientId.value // Include the ID in the point data for the tooltip
      };
      chart.data.datasets[0].data.push(newData);
      chart.update();
    };

    // Method to set up the chart
    const setupChart = () => {
      const ctx = chartCanvas.value.getContext('2d');

      // Calculate line data points for the first formula
      const lineData1 = Array.from({ length: 61 }, (_, i) => {
        const age = 20 + i; // Starts from age 20 to 80
        const y = 0.2671 * Math.exp(0.066 * age);
        return { x: age, y };
      });

      // Calculate line data points for the second formula
      const lineData2 = Array.from({ length: 61 }, (_, i) => {
        const age = 20 + i; // Starts from age 20 to 80
        const y = 0.5169 * Math.exp(0.033 * age);
        return { x: age, y };
      });

      chart = new Chart(ctx, {
        type: 'scatter',
        data: {
          datasets: [
            {
              label: 'Age vs Normalized Liver Volume',
              data: [], // Scatter data will be added here
              backgroundColor: '#180C0C',
              borderColor: '#180C0C',
              borderWidth: 1,
              pointRadius: 5,
            },
            // Invisible 'Ceiling' dataset
            {
              label: 'Ceiling',
              data: Array.from({ length: 61 }, (_, i) => ({ x: 20 + i, y: 25 })), // Adjust y to the max expected value
              borderColor: 'transparent',
              borderWidth: 0,
              showLine: true,
              pointRadius: 0,
              fill: '+1',
              backgroundColor: '#B2241C33' // Color above the first line
            },
            {
              label: 'Trend Line 1',
              data: lineData1,
              borderColor: '#B2241C',
              borderWidth: 3,
              showLine: true, // Shows the first line graph
              pointRadius: 0, // No points on the line graph
              fill: '+1', // Fill the area between this line and the next dataset
              backgroundColor: '#F64C4633' // Area color between the two lines
            },
            {
              label: 'Trend Line 2',
              data: lineData2,
              borderColor: '#F64C46', // Different color for the second line
              borderWidth: 2,
              showLine: true, // Shows the second line graph
              pointRadius: 0, // No points on the line graph
              fill: 'origin',
              backgroundColor: '#FDA3A133' // Area color below the second line
            }
          ]
        },
        options: {
          scales: {
            x: {
              title: {
                display: true,
                text: 'Age (years)'
              },
              type: 'linear',
              min: 20,
              max: 80
            },
            y: {
              title: {
                display: true,
                text: 'nTLV'
              },
              beginAtZero: true,
              max: 25 // Adjusted based on the expected range of nTLV
            }
          },
          plugins: {
            legend: {
              display: false // Removes the legend
            },
            tooltip: {
              callbacks: {
                beforeBody: (context) => {
                  const id = context[0].raw.id;
                  return id ? `ID: ${id}` : '';
                }
              }
            }
          }
        }
      });
    };

    // Method to print the page
    const printPage = () => {
      window.print();
    };

    // Method to download the chart as an image
    const downloadChart = () => {
      const link = document.createElement('a');
      link.href = chartCanvas.value.toDataURL('image/png');
      link.download = 'plot.png';
      link.click();
    };

    // Lifecycle hook to set up the chart after the component is mounted
    onMounted(setupChart);

    // Exposing variables and methods to the template
    return {
      patientId,
      age,
      totalLiverVolume,
      normalizedTLV,
      formattedNormalizedTLV,
      addDataPoint,
      chartCanvas,
      printPage,
      downloadChart
    };
  }
};
</script>

<style>
* {
  font-family: Arial, sans-serif;
}

.container {
  text-align: center;
  max-width: 800px;
  margin: auto;
}

.app-title {
  margin-top: 20px;
  font-size: 24px;
  font-weight: bold;
}

.input-group {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 10px 0;
}

.input-group label {
  margin-bottom: 5px;
}

.chart-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
}

canvas {
  max-width: 100%;
  height: auto;
}

button {
  margin: 5px;
  padding: 10px 15px;
  font-size: 16px;
  cursor: pointer;
}

.output-field {
  border: 1px solid #ccc; /* Gray border */
  padding: 5px;
  border-radius: 5px; /* Rounded corners */
}
</style>
