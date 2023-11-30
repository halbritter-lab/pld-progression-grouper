<template>
  <!-- Main application container -->
  <div id="app" class="container">

    <!-- Modal for displaying the disclaimer -->
    <!-- It appears conditionally based on the showModal reactive property -->
    <div v-if="showModal" class="modal">
      <div class="modal-content">
        <h2>Disclaimer for PLD-Progression Grouper</h2>
        
        <!-- Sections of the disclaimer with various headings and paragraphs -->
        <h3>Important Information for All Users:</h3>
        <p>The "PLD-Progression Grouper" application is intended for informational, educational and research purposes only and should not be used as a substitute for professional medical advice or for direct diagnostic use. The tool is designed to provide insights into Polycystic Liver Disease (PLD) progression but is not meant to replace clinical decision-making or genetic consultation.</p>

        <h3>Usage Guidelines:</h3>
        <ul>
          <li>The information provided by this application is not intended for medical diagnosis or treatment decisions without the oversight of qualified healthcare professionals.</li>
          <li>Users are advised not to base any health-related decisions solely on the results obtained from this application.</li>
          <li>The data and information presented are provided without any warranty of accuracy, completeness, or usefulness. Users should exercise their own judgment in the interpretation and use of the information.</li>
        </ul>

        <h3>Liability and Risk:</h3>
        <p>The application is provided "as is," without any guarantees or obligations for support, updates, or accuracy. Under no circumstances shall the creators or affiliates of the PLD-Progression Grouper be liable for any direct, indirect, incidental, or consequential damages arising from the use of the application.</p>

        <h3>Contact and Queries:</h3>
        <p>For medical relevance of the application's content, please consult with a healthcare professional. For inquiries or feedback regarding the application, please contact <a href="mailto:info@pld-progression-grouper.org">info@pld-progression-grouper.org</a>.</p>

        <h3>Acknowledgment and Consent:</h3>
        <p>By using the PLD-Progression Grouper, you acknowledge having read, understood, and agreed to the terms stated in this disclaimer. If you do not agree to these terms, you should not use the application.</p>

        <!-- Button to close the modal -->
        <button @click="closeModal">I Acknowledge</button>
      </div>
    </div>

    <!-- Header section with logo and application title -->
    <div class="header">
      <img src="logo.webp" alt="PLD-Progression Grouper Logo" class="app-logo">
      <h1 class="app-title">PLD-Progression Grouper</h1>
    </div>

    <!-- Main content area -->
    <div class="content">
      <!-- Control section for user inputs -->
      <div class="controls">
        <!-- Individual input groups for different parameters -->
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

        <!-- Buttons for user actions -->
        <button @click="addDataPoint">Plot Point</button>
        <button @click="printPage">Print Page</button>
        <button @click="downloadChart">Download Plot</button>
      </div>

      <!-- Container for the chart visualization -->
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
    // Modal visibility state
    const showModal = ref(true);

    // Close the modal
    const closeModal = () => {
      showModal.value = false;
    };

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
    
    // Update or create meta tags dynamically
    function updateMetaTag(name, content) {
      let tag = document.querySelector(`meta[name="${name}"]`);
      if (tag) {
        tag.setAttribute('content', content);
      } else {
        tag = document.createElement('meta');
        tag.setAttribute('name', name);
        tag.setAttribute('content', content);
        document.head.appendChild(tag);
      }
    }

    // Lifecycle hook to set up the chart after the component is mounted
    // Update meta tags and initialize chart on component mount
    onMounted(() => {
      setupChart();

      document.title = 'PLD-Progression Grouper'; // Update page title

      // Update meta description
      updateMetaTag('description', 'PLD-Progression Grouper is a Vue.js web application, based on extensive research, offering insights into Polycystic Liver Disease (PLD) progression. Developed by Bernt Popp, Ria Schönauer, Dana Sierks, and Jan Halbritter, this tool facilitates understanding of PLD for both educational and research purposes.');

      // Add keywords meta tag
      updateMetaTag('keywords', 'PLD, Polycystic Liver Disease, Liver Health, Medical Research, Data Visualization, Vue.js, Web Application, Liver Disease Progression, Medical Education, Healthcare Technology');

      // Add author meta tags
      updateMetaTag('author', 'Bernt Popp, Ria Schönauer, Dana Sierks, Jan Halbritter');
      updateMetaTag('creator', 'Bernt Popp, Ria Schönauer, Dana Sierks, Jan Halbritter');

    });

    // Exposing variables and methods to the template
    return {
      showModal,
      closeModal,
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
/* Global font style for the entire application */
* {
  font-family: Arial, sans-serif;
}

/* Styles for the modal background, making it fixed and covering the entire screen */
.modal {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5); /* Semi-transparent background */
  display: flex;
  align-items: center;
  justify-content: center; /* Centering the modal content */
}

/* Responsive design adjustments for the modal on smaller screens */
@media (max-width: 600px) {
  .modal-content {
    max-width: 100%; /* Full width for small screens */
    padding: 10px; /* Reduced padding for small screens */
  }
}

/* Styles for the content within the modal */
.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 5px;
  max-width: 500px; /* Maximum width of modal */
  width: 90%; /* Responsive width */
  text-align: left;
  overflow-y: auto; /* Enable scrolling for long content */
  max-height: 90%; /* Maximum height */
}

/* Styling for the header section containing the logo and title */
.header {
  display: flex;
  align-items: center;
  justify-content: center; /* Centering content horizontally */
  text-align: center;
  width: 100%; /* Full width */
}

/* Styles for the application logo */
.app-logo {
  max-width: 92px; /* Fixed maximum width */
  margin-right: 20px; /* Spacing between logo and title */
}

/* Styling for the application title */
.app-title {
  font-size: 24px;
  font-weight: bold;
  margin: 0; /* Removing default margin */
}

/* Container for the whole application */
.container {
  text-align: center;
  max-width: 800px; /* Maximum width */
  margin: auto; /* Centering the container */
}

/* Styles for input groups */
.input-group {
  display: flex;
  flex-direction: column;
  align-items: center; /* Centering items vertically */
  margin: 10px 0; /* Spacing between groups */
}

/* Label styles within input groups */
.input-group label {
  margin-bottom: 5px; /* Spacing below each label */
}

/* Container for the chart */
.chart-container {
  display: flex;
  justify-content: center; /* Centering the chart horizontally */
  align-items: center; /* Centering the chart vertically */
  margin-top: 20px; /* Spacing above the chart */
}

/* Styles for the canvas element (used by Chart.js) */
canvas {
  max-width: 100%; /* Responsive width */
  height: auto; /* Maintain aspect ratio */
}

/* Styling for buttons */
button {
  margin: 5px; /* Spacing around buttons */
  padding: 10px 15px; /* Padding inside buttons */
  font-size: 16px; /* Font size */
  cursor: pointer; /* Pointer cursor on hover */
}

/* Styling for the output field displaying normalized TLV */
.output-field {
  border: 1px solid #ccc; /* Gray border */
  padding: 5px; /* Padding inside the field */
  border-radius: 5px; /* Rounded corners */
}
</style>
