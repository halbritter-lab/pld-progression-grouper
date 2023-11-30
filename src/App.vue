<template>
  <!-- Main application container -->
  <div
    id="app"
    class="container"
  >
    <!-- Modal for displaying the disclaimer -->
    <!-- It appears conditionally based on the showModal reactive property -->
    <div
      v-if="showModal"
      class="modal"
    >
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
        <button @click="closeModal">
          I Acknowledge
        </button>
      </div>
    </div>

    <!-- Header section with logo and application title -->
    <div class="header">
      <img
        src="logo.webp"
        alt="PLD-Progression Grouper Logo"
        class="app-logo"
      >
      <h1 class="app-title">
        PLD-Progression Grouper <span class="app-version">v{{ version }}</span>
      </h1>
    </div>

    <!-- Main content area -->
    <div class="content">
      <!-- Warning message for ID -->
      <div
        v-if="idWarningMessage"
        class="id-warning-message"
      >
        {{ idWarningMessage }}
      </div>

      <!-- Control section for user inputs -->
      <div class="controls">
        <!-- Individual input groups for different parameters -->
        <div class="input-group">
          <label for="idInput">ID:</label>
          <input
            id="idInput"
            v-model="patientId"
            type="text"
            placeholder="Enter ID"
          >
        </div>
        <div class="input-group">
          <label for="ageInput">Age:</label>
          <input
            id="ageInput"
            v-model="age"
            type="number"
            placeholder="20-80"
          >
        </div>
        <div class="input-group">
          <label for="liverInput">Total Liver Volume (TLV) [ml] :</label>
          <input
            id="liverInput"
            v-model="totalLiverVolume"
            type="number"
            placeholder="0-100"
          >
        </div>

        <!-- Output field for displaying the nTLV and progression group -->
        <div class="input-group output-group">
          <!-- Notice the new class added for specific styling -->
          <label for="normalizedTLV">Normalized Total Liver Volume (nTLV):</label>
          <div class="output-fields">
            <!-- New div to wrap output fields -->
            <output
              id="normalizedTLV"
              class="output-field"
            >
              {{ formattedNormalizedTLV }}
            </output>
            <output
              id="progressionGroupOutput"
              :class="`progression-group-output ${progressionGroup}`"
            >
              {{ progressionGroup }}
            </output>
          </div>
        </div>

        <!-- Buttons for user actions -->
        <button @click="addDataPoint">
          Plot Point
        </button>
        <button @click="printPage">
          Print Page
        </button>
        <button @click="downloadChart">
          Download Plot
        </button>
      </div>

      <!-- Container for the chart visualization -->
      <div class="chart-container">
        <canvas ref="chartCanvas" />
      </div>

      <!-- Progression Group Squares -->
      <div class="progression-groups">
        <div class="progression-group PG3">
          <strong>PG3</strong><br>&gt;6.6%/y
        </div>
        <div class="progression-group PG2">
          <strong>PG2</strong><br>3.3-6.6%/y
        </div>
        <div class="progression-group PG1">
          <strong>PG1</strong><br>&lt;3.3%/y
        </div>
      </div>
  
      <!-- Table to display the data points -->
      <div
        v-if="dataPoints.length > 0"
        class="data-points-table-container"
      >
        <table class="data-points-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Age</th>
              <th>TLV [ml]</th>
              <th>nTLV</th>
              <th>PG</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="point in dataPoints"
              :key="point.id"
            >
              <td>{{ point.id }}</td>
              <td>{{ point.age }}</td>
              <td>{{ point.tlv }}</td>
              <td>{{ point.ntlv }}</td>
              <td>{{ point.pg }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Documentation sentence with link -->
      <p>
        For a detailed documentation of this tools and the methodology, please refer to the <a
          href="https://github.com/halbritter-lab/pld-progression-grouper"
          target="_blank"
        >GitHub README</a>.
      </p>

      <!-- Citation policy sentences with links -->
      <p>
        Please cite the following publication for this tool: 
        <a
          href="https://pubmed.ncbi.nlm.nih.gov/36246085/"
          target="_blank"
        >
          Sierks D, et al. Modelling polycystic liver disease progression using age-adjusted liver volumes and targeted mutational analysis. JHEP Rep. 2022.
        </a> <br>
        A new manuscript reporting the application of this method in autosomal dominant polycystic liver disease is currently under review. A link will be provided here upon publication.
      </p>
    </div>

    <!-- Footer section with institution and funder logos -->
    <footer class="footer">
      <a
        href="https://nephrologie-intensivmedizin.charite.de/fuer_patienten/cerkid//"
        target="_blank"
      >
        <img
          src="CeRKiD_175x130.jpg"
          alt="CeRKiD Logo"
          class="institution-logo"
        >
      </a>
      <a
        href="https://www.dfg.de/en/"
        target="_blank"
      >
        <img
          src="dfg_logo_schriftzug_schwarz_foerderung_en.gif"
          alt="DFG Logo"
          class="funder-logo"
        >
      </a>
    </footer>
  </div>
</template>


<script>
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { Chart, registerables } from 'chart.js';

// Import the package.json file
import packageInfo from '../package.json'; // Adjust the path to your package.json file

// Register the necessary components for Chart.js
Chart.register(...registerables);

export default {
  setup() {
    // Extract the version from the package.json
    const version = packageInfo.version;

    // Warning message for missing ID
    const idWarningMessage = ref('');

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

    // Computed property for progression group based on age and normalizedTLV
    const progressionGroup = computed(() => {
      // Assuming normalizedTLV and age are available here
      // and are reactive properties
      const nTLV = normalizedTLV.value;
      const patientAge = age.value;
      
      // Use the given formulas to determine the progression group
      const pg3Threshold = 0.2671 * Math.exp(0.066 * patientAge);
      const pg2Threshold = 0.5169 * Math.exp(0.033 * patientAge);

      if (nTLV > pg3Threshold) return 'PG3';
      if (nTLV > pg2Threshold && nTLV <= pg3Threshold) return 'PG2';
      return 'PG1';
    });

    // At the top of your setup() function, add a new reactive reference for the data points array
    const dataPoints = ref([]);

    // Modify the addDataPoint method
    const addDataPoint = () => {
      if (!patientId.value.trim()) {
        idWarningMessage.value = "Please enter an ID before plotting a point.";
        return;
      }

      const newData = {
        id: patientId.value,
        age: age.value,
        tlv: totalLiverVolume.value,
        ntlv: formattedNormalizedTLV.value,
        pg: progressionGroup.value
      };
      dataPoints.value.push(newData);
      chart.data.datasets[0].data.push({
        x: newData.age,
        y: normalizedTLV.value,
      });
      chart.update();

      // Reset the warning message if the data point is successfully added
      idWarningMessage.value = '';
    };

    // Method to handle window resize
    const handleResize = () => {
      if (chart) {
        chart.resize();
      }
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
      // Initialize the chart
      setupChart();
      window.addEventListener('resize', handleResize);

      // Update page title
      document.title = 'PLD-Progression Grouper';

      // Update meta description
      updateMetaTag('description', 'PLD-Progression Grouper is a Vue.js web application, based on extensive research, offering insights into Polycystic Liver Disease (PLD) progression. Developed by Bernt Popp, Ria Schönauer, Dana Sierks, and Jan Halbritter, this tool facilitates understanding of PLD for both educational and research purposes.');

      // Add keywords meta tag
      updateMetaTag('keywords', 'PLD, Polycystic Liver Disease, Liver Health, Medical Research, Data Visualization, Vue.js, Web Application, Liver Disease Progression, Medical Education, Healthcare Technology');

      // Add author meta tags
      updateMetaTag('author', 'Bernt Popp, Ria Schönauer, Dana Sierks, Jan Halbritter');
      updateMetaTag('creator', 'Bernt Popp, Ria Schönauer, Dana Sierks, Jan Halbritter');

    });

    // Lifecycle hook to remove event listeners when the component is unmounted
    onUnmounted(() => {
      window.removeEventListener('resize', handleResize);
    });

    // Exposing variables and methods to the template
    return {
      version,
      idWarningMessage,
      showModal,
      closeModal,
      dataPoints,
      patientId,
      age,
      totalLiverVolume,
      normalizedTLV,
      formattedNormalizedTLV,
      progressionGroup,
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

/* Styles for the version number */
.app-version {
  font-size: 0.8em; /* Smaller font size */
  color: #666; /* Lighter text color */
  font-weight: normal; /* Less emphasis compared to the title */
  padding-left: 10px; /* Space between title and version number */
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

/* Style for the progression groups container */
.progression-groups {
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin: 20px 0; /* Adjust as needed for spacing */
}

/* Base style for each progression group box */
.progression-group {
  border: 3px solid #FFA3A3; /* Light red border */
  border-radius: 0px; /* non-rounded corners */
  padding: 10px;
  text-align: center;
  margin-bottom: 5px;
  min-width: 80px; /* Minimum width set here */
}

/* Individual background colors for each progression group */
.PG3 {
  background-color: #B2241C33;
  border-color: #B2241C;
}
.PG2 {
  background-color: #F64C4633;
  border-color: #F64C46;
}
.PG1 {
  background-color: #FDA3A133;
  border-color: #FDA3A1;
}

/* Styles for input groups */
.input-group {
  display: flex;
  flex-direction: column;
  align-items: center; /* Centering items vertically */
  margin: 10px 0; /* Spacing between groups */
}

/* Styling for input groups with output fields */
.output-group {
  display: flex;
  flex-direction: row;
  align-items: center; /* Align items vertically */
  justify-content: space-between; /* Space between label and outputs */
}

/* Container for output fields */
.output-fields {
  display: flex;
  flex-grow: 1; /* Allow fields to grow equally */
}

/* Styling for the output fields displaying normalized TLV and progression group */
.output-field, .progression-group-output {
  flex-grow: 1; /* Grow equally */
  border: 1px solid;
  padding: 5px;
  border-radius: 0px;
  text-align: center; /* Center text */
  margin-left: 5px; /* Space between outputs */
}

/* Specific styling for progression group output */
.progression-group-output {
  /* Add specific styles or overrides for the progression group output here if needed */
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

/* Styles for the footer */
.footer {
  padding: 10px 0;
  background-color: #f5f5f5; /* Light grey background */
  display: flex;
  justify-content: center; /* Center logos horizontally */
  align-items: center; /* Center logos vertically */
}

/* Styles for the institution and funder logos */
.institution-logo, .funder-logo {
  max-width: 120px; /* Maximum width for logos */
  margin: 0 20px; /* Spacing between logos */
}

/* Styles for the data points table */
.data-points-table-container {
  margin-top: 20px; /* Space from the chart */
}

.data-points-table {
  width: 100%;
  border-collapse: collapse; /* Remove space between borders */
  margin-bottom: 20px; /* Space before the footer or next content */
}

.data-points-table th,
.data-points-table td {
  border: 1px solid #ddd; /* Light grey border */
  padding: 8px; /* Padding within cells */
  text-align: left; /* Align text to the left */
}

.data-points-table th {
  background-color: #f5f5f5; /* Light grey background for header */
  font-weight: bold; /* Make header text bold */
}

.data-points-table td {
  background-color: #fff; /* White background for cells */
}

/* Styles for the warning message */
.id-warning-message {
  color: red; /* Choose a color that stands out */
  margin: 10px 0;
  font-weight: bold;
}
</style>
