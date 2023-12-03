<template>
  <!-- Main application container -->
  <div
    id="app"
    class="container"
  >
    <div
      v-if="disclaimerAcknowledged && !showModal"
      class="acknowledgment-message"
    >
      <button @click="reopenModal">
        Disclaimer
      </button> acknowledged on this device at: {{ acknowledgmentTime }}.
    </div>

    <!-- Modal for displaying the disclaimer -->
    <!-- It appears conditionally based on the showModal reactive property -->
    <div
      v-if="showModal"
      class="modal"
    >
      <div class="modal-content">
        <h2>Disclaimer for PLD-Progression Grouper</h2>
        <section
          v-for="(section, index) in disclaimerSections"
          :key="index"
        >
          <h3>{{ section.title }}</h3>
          <p v-html="section.content" />
        </section>

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
        PLD-Progression Grouper <span class="app-version">v{{ version }}-</span>
        <span
          v-if="!fetchError"
          class="app-commit"
        >{{ lastCommitHash }}</span>
        <span
          v-else
          class="offline-indicator"
        >offline</span>
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

        <!-- Age input group -->
        <div class="input-group">
          <label for="ageInput">Age [y]:</label>
          <input
            id="ageInput"
            v-model="age"
            type="number"
            placeholder="20-80"
          >
        </div>
        <!-- Display age validation message -->
        <div
          v-if="ageValidationMessage"
          class="validation-message"
        >
          {{ ageValidationMessage }}
        </div>

        <!-- Total Liver Volume input group -->
        <div class="input-group">
          <label for="liverInput">Total Liver Volume (TLV) [ml] :</label>
          <input
            id="liverInput"
            v-model="totalLiverVolume"
            type="number"
            placeholder="0-20000"
          >
        </div>
        <!-- Display TLV validation message -->
        <div
          v-if="tlvValidationMessage"
          class="validation-message"
        >
          {{ tlvValidationMessage }}
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
            <output
              id="liverGrowthRateOutput"
              :class="`progression-group-output ${progressionGroup}`"
            >
              {{ liverGrowthRate !== null ? liverGrowthRate.toFixed(2) + ' %/y (LGR)' : '' }}
            </output>
          </div>
        </div>

        <!-- Buttons for user actions -->
        <!-- Button for plotting the data point -->
        <button
          class="plot-point"
          :class="{ 'button-disabled': isInvalidInput }"
          :disabled="isInvalidInput"
          @click="addDataPoint"
        >
          Plot Data
        </button>

        <!-- Button for printing the page -->
        <button @click="printPage">
          Print Page
        </button>

        <!-- Button for downloading the chart as an image -->
        <button @click="downloadChart">
          Download Plot
        </button>

        <!-- Buttons for saving and loading -->
        <button @click="saveDataAsJson">
          Save
        </button>
        <!-- invisible file input element -->
        <input
          ref="fileInput"
          type="file"
          style="display: none;"
          @change="loadDataFromJson"
        >

        <!-- Button for triggering the file input -->
        <button @click="triggerFileInput">
          Load
        </button>
        <!-- Button for downloading data as Excel -->
        <button @click="downloadDataAsExcel">
          Download (Excel)
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
              <th>Age [y]</th>
              <th>TLV [ml]</th>
              <th>nTLV</th>
              <th>PG</th>
              <th>LGR [%/y]</th>
              <th>Remove</th>
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
              <td>{{ point.lgr }}</td>
              <td>
                <button @click="removeDataPoint(index)">
                  -
                </button> <!-- Remove button -->
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Documentation sentence with link -->
      <p>
        For a detailed documentation of this tool and the methodology, please refer to the <a
          href="https://github.com/halbritter-lab/pld-progression-grouper"
          target="_blank"
        >GitHub README</a>.
        Let us know if you like this tool and how we can improve it using our <a
          href="https://docs.google.com/forms/d/1MM4g1Ukjiy73ThWUMHARDcyQg-PwOWuI46kQV5HwXmY"
          target="_blank"
        >Feedback Form</a>.
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
        v-for="link in footerLinks"
        :key="link.name"
        :href="link.url"
        target="_blank"
      >
        <img
          :src="link.img"
          :alt="link.alt"
          class="institution-logo"
        >
      </a>
    </footer>
  </div>
</template>


<script>
// import the necessary components from Vue.js
import { ref, onMounted, onUnmounted, computed, watch } from 'vue';

// Import the router
import { useRouter, useRoute } from 'vue-router';

// import the necessary components from Chart.js
import { Chart, registerables } from 'chart.js';

// Import the XLSX library
import * as XLSX from 'xlsx';

// Import the package.json file
import packageInfo from '../package.json'; // Adjust the path to your package.json file

// Importing the configuration
import { CONFIG } from '@/config/config';

// Import the disclaimer mixin
import disclaimerMixin from './mixins/disclaimerMixin';

// Import the footer mixin
import footerMixin from './mixins/footerMixin';

// Import the formulas
import { formulas } from '@/config/formulasConfig';

// Register the necessary components for Chart.js
Chart.register(...registerables);

export default {
  mixins: [disclaimerMixin, footerMixin],
  setup() {
    // Router and route references
    const router = useRouter();
    const route = useRoute();

    // Extract the version from the package.json
    const version = packageInfo.version;

    // Reference for the last commit hash
    const lastCommitHash = ref('');

    const getUrlQueryParams = async () => {
      //router is async so we wait for it to be ready
      await router.isReady();

      // Parse URL parameters and set initial data
      if (route.query.acknowledgeBanner === "true") {
        showModal.value = false;
      }

      // Set the data points from the URL query parameters
      if (route.query.patientId) {
        patientId.value = route.query.patientId;
      }

      // Set the data points from the URL query parameters
      if (route.query.age) {
        age.value = route.query.age;
      }

      // Set the data points from the URL query parameters
      if (route.query.tlv) {
        totalLiverVolume.value = route.query.tlv;
      }

      // Add the data point if all the parameters are available
      if (route.query.patientId && route.query.age && route.query.tlv) {
        addDataPoint();
      }
    };

    // Reference for the last commit hash
    const fetchError = ref(false);

    // Fetch the last commit hash
    const fetchLastCommit = async () => {
      try {
        const response = await fetch('https://api.github.com/repos/halbritter-lab/pld-progression-grouper/commits?per_page=1');
        if (!response.ok) throw new Error('Network response was not ok.');

        const commits = await response.json();
        if (commits.length) {
          lastCommitHash.value = commits[0].sha.substring(0, 7);
        }
      } catch (error) {
        console.error('Error fetching last commit:', error);
        fetchError.value = true;
      }
    };

    // Warning message for missing ID
    const idWarningMessage = ref('');

    // Refs for validation messages
    const ageValidationMessage = ref('');
    const tlvValidationMessage = ref('');

    // Modal visibility state
    const disclaimerAcknowledged = ref(localStorage.getItem('disclaimerAcknowledged') === 'true');
    const acknowledgmentTime = ref(localStorage.getItem('acknowledgmentTime'));
    const showModal = ref(!disclaimerAcknowledged.value);

    // Close the modal
    const closeModal = () => {
      const currentTime = new Date().toLocaleString();
      showModal.value = false;
      disclaimerAcknowledged.value = true;
      acknowledgmentTime.value = currentTime;
      localStorage.setItem('disclaimerAcknowledged', 'true');
      localStorage.setItem('acknowledgmentTime', currentTime);
    };

    // Reopen the modal
    const reopenModal = () => {
      showModal.value = true;
    };

    // Reactive references for form inputs and chart canvas
    const patientId = ref('');
    const age = ref(CONFIG.AGE_MIN);
    const totalLiverVolume = ref(CONFIG.TLV_MIN);
    const chartCanvas = ref(null);
    let chart = null;

    // Computed property for normalized total liver volume
    const normalizedTLV = computed(() => {
      return totalLiverVolume.value / CONFIG.NORMALIZATION_FACTOR;
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
      if (nTLV > formulas.calculatePG3Threshold(patientAge)) return 'PG3';
      if (nTLV > formulas.calculatePG2Threshold(patientAge) && nTLV <= formulas.calculatePG3Threshold(patientAge)) return 'PG2';

      // If the nTLV is less than or equal to the PG2 threshold, return PG1
      return 'PG1';
    });

    // Computed property for liver growth rate (LGR)
    const liverGrowthRate = computed(() => {
      // Check if age and normalizedTLV are defined and valid
      if (age.value && normalizedTLV.value && age.value > 20) {
        return 100 * Math.log(normalizedTLV.value) / (age.value - 20);
      }
      return null; // Return null if the calculation can't be performed
    });

    // Reactive reference for the data points array
    const dataPoints = ref([]);

    // addDataPoint method to add a new data point to the chart
    const addDataPoint = () => {
      // Validate the input
      if (isInvalidInput.value) {
        // Handle the error, perhaps by setting idWarningMessage
        idWarningMessage.value = 'Please correct the errors before plotting.';
        return;
      }

      // Check if the ID is empty
      if (!patientId.value.trim()) {
        idWarningMessage.value = "Please enter an ID before plotting a point.";
        return;
      }

      const newData = {
        id: patientId.value,
        age: age.value,
        tlv: totalLiverVolume.value,
        ntlv: formattedNormalizedTLV.value,
        pg: progressionGroup.value,
        lgr: liverGrowthRate.value !== null ? liverGrowthRate.value.toFixed(2) : 'N/A' // Handle undefined LGR
      };

      dataPoints.value.push(newData);

      chart.data.datasets[0].data.push({
        x: newData.age,
        y: normalizedTLV.value,
        id: newData.id  // Include the ID
      });

      chart.update();

      // Reset the warning message if the data point is successfully added
      idWarningMessage.value = '';
    };

    // Validation method
    const validateInput = () => {
      ageValidationMessage.value = '';
      tlvValidationMessage.value = '';

      // Validate age
      if (age.value < CONFIG.AGE_MIN || age.value > CONFIG.AGE_MAX) {
        ageValidationMessage.value = `Age must be between ${CONFIG.AGE_MIN} and ${CONFIG.AGE_MAX} years.`;
      }

      // Validate Total Liver Volume
      if (totalLiverVolume.value < CONFIG.TLV_MIN || totalLiverVolume.value > CONFIG.TLV_MAX) {
        tlvValidationMessage.value = `Total Liver Volume must be between 0 and ${CONFIG.TLV_MAX} ml.`;
      }
    };

    // Computed property to determine if input is invalid
    const isInvalidInput = computed(() => {
      return ageValidationMessage.value !== '' || tlvValidationMessage.value !== '';
    });

    // Setup watchers
    watch(age, validateInput);
    watch(totalLiverVolume, validateInput);

    const removeDataPoint = (index) => {
      // Remove from dataPoints array
      dataPoints.value.splice(index, 1);

      // Remove from chart's dataset and update the chart
      if (chart && chart.data.datasets.length > 0) {
        chart.data.datasets[0].data.splice(index, 1);
        chart.update();
      }
    };

    // Method to handle window resize
    const handleResize = () => {
      if (chart) {
        chart.resize();
      }
    };

    // Method to set up the chart
    const setupChart = () => {
      // Get the canvas element
      const ctx = chartCanvas.value.getContext('2d');

      // Using the external formulas for line data
      const lineData1 = formulas.generateLineData1(61, 20); // Assuming 61 data points starting from age 20
      const lineData2 = formulas.generateLineData2(61, 20); // Similarly for lineData2

      // Create the chart
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
              min: CONFIG.CHART_X_AXIS_MIN,
              max: CONFIG.CHART_X_AXIS_MAX
            },
            y: {
              title: {
                display: true,
                text: 'nTLV'
              },
              beginAtZero: true,
              max: CONFIG.CHART_Y_AXIS_MAX
            }
          },
          plugins: {
            legend: {
              display: false // Removes the legend
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  let label = context.dataset.label || '';
                  if (label) {
                      label += ': ';
                  }
                  if (context.parsed.x !== null) {
                      label +=context.parsed.x;
                  }
                  if (context.parsed.y !== null) {
                      label += ', ' + context.parsed.y.toFixed(2);
                  }
                  // Append the ID to the tooltip
                  const dataPoint = context.raw;
                  if (dataPoint && dataPoint.id) {
                      label += `; ID: ${dataPoint.id}`;
                  }
                  return label;
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

    // Method to save the data points as a JSON file
    const saveDataAsJson = () => {
      const dataStr = JSON.stringify(dataPoints.value);
      const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

      const exportFileDefaultName = `data_${new Date().toISOString()}.json`;
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
    };

    // Create a ref
    const fileInput = ref(null);

    const triggerFileInput = () => {
      if (fileInput.value) {
        fileInput.value.click();
      }
    };

    // Method to load data points from a JSON file
    const loadDataFromJson = async (event) => {
      const file = event.target.files[0];
      if (!file) {
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const fileData = JSON.parse(e.target.result);
        dataPoints.value.push(...fileData);
        fileData.forEach((data) => {
          chart.data.datasets[0].data.push({
            x: data.age,
            y: data.ntlv
          });
        });
        chart.update();
      };
      reader.readAsText(file);
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
    };

    // Method to download data as Excel
    const downloadDataAsExcel = () => {
      const wb = XLSX.utils.book_new(); // create a new workbook
      const ws = XLSX.utils.json_to_sheet(dataPoints.value); // convert data to worksheet
      XLSX.utils.book_append_sheet(wb, ws, "Data"); // append worksheet to workbook

      const fileName = `Data_${new Date().toISOString()}.xlsx`;
      XLSX.writeFile(wb, fileName); // write workbook and download
    };

    // Lifecycle hook to set up the chart after the component is mounted
    // Update meta tags and initialize chart on component mount
    onMounted(() => {
      // Get the URL query parameters
      getUrlQueryParams();

      // Set the CSS variables for the modal
      document.documentElement.style.setProperty('--modal-max-width', CONFIG.MODAL_MAX_WIDTH);
      document.documentElement.style.setProperty('--modal-max-height', CONFIG.MODAL_MAX_HEIGHT);
    
      // Fetch the last commit hash
      fetchLastCommit();

      // Update page title
      document.title = 'PLD-Progression Grouper';

      // Update meta description
      updateMetaTag('description', 'PLD-Progression Grouper is a Vue.js web application, based on extensive research, offering insights into Polycystic Liver Disease (PLD) progression. Developed by Bernt Popp, Ria Schönauer, Dana Sierks, and Jan Halbritter, this tool facilitates understanding of PLD for both educational and research purposes.');

      // Add keywords meta tag
      updateMetaTag('keywords', 'PLD, Polycystic Liver Disease, Liver Health, Medical Research, Data Visualization, Vue.js, Web Application, Liver Disease Progression, Medical Education, Healthcare Technology');

      // Add author meta tags
      updateMetaTag('author', 'Bernt Popp, Ria Schönauer, Dana Sierks, Jan Halbritter');
      updateMetaTag('creator', 'Bernt Popp, Ria Schönauer, Dana Sierks, Jan Halbritter');
      
      // Set up the chart
      setupChart();

      // Add event listener for window resize
      window.addEventListener('resize', handleResize);

    });

    // Lifecycle hook to remove event listeners when the component is unmounted
    onUnmounted(() => {
      // Remove event listeners for online/offline status
      window.removeEventListener('resize', handleResize);
    });

    // Exposing variables and methods to the template
    return {
      version,
      lastCommitHash,
      idWarningMessage,
      ageValidationMessage,
      tlvValidationMessage,
      isInvalidInput,
      showModal,
      closeModal,
      acknowledgmentTime,
      disclaimerAcknowledged,
      reopenModal,
      dataPoints,
      patientId,
      age,
      totalLiverVolume,
      normalizedTLV,
      formattedNormalizedTLV,
      progressionGroup,
      liverGrowthRate,
      addDataPoint,
      removeDataPoint,
      chartCanvas,
      printPage,
      downloadChart,
      fileInput,
      triggerFileInput,
      saveDataAsJson,
      loadDataFromJson,
      downloadDataAsExcel,
      fetchError,
    };
  }
};
</script>


<style>
/* Global font style for the entire application */
* {
  font-family: Arial, sans-serif;
}

/* Styles for the main application container */
body {
  margin: 0;
  padding: 0;
}

/* Styles for the version number */
.app-version {
  font-size: 0.8em; /* Smaller font size */
  color: #666; /* Lighter text color */
  font-weight: normal; /* Less emphasis compared to the title */
  padding-left: 10px; /* Space between title and version number */
}

/* Styles for the version number */
.app-commit {
  font-size: 0.8em; /* Smaller font size */
  color: #666; /* Lighter text color */
  font-weight: normal; /* Less emphasis compared to the title */
  padding-left: 0px; /* Space between title and version number */
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
    max-width: var(--modal-max-width);
    max-height: var(--modal-max-height);
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

/* Styles for input fields */
.input-group input {
  padding: 5px; /* Increased padding for better user interaction */
  border: 2px solid #ddd; /* Subtle border */
  border-radius: 0px; /* non-rounded corners */
  font-size: 14px; /* Larger font size for readability */
  margin-bottom: 10px; /* Spacing below each input field */
  width: 80%; /* 89% width */
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

/* Styles for the controls section */
.controls button {
  background-color: #00bf7d;
  color: black;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  padding: 10px 15px;
  margin: 5px;
}

/* Hover styles for the buttons */
.controls button:hover {
  background-color: #45a049;
}

/* Specific styles for the Plot Point button */
.controls button.plot-point {
  background-color: #89ce00; /* Active color */
  border: 2px solid #0056b3; /* Border color */
}

/* Styles for the Plot Point button when disabled */
.controls button.plot-point.button-disabled {
  background-color: #ccc; /* Disabled background color */
  color: #666; /* Disabled text color */
  cursor: not-allowed;
}

/* Styles for the Plot Point button in active state */
.controls button.plot-point:active {
  background-color: #0056b3; /* Active state background color */
  border-color: #004085; /* Active state border color */
}

/* Hover styles for the Plot Point button */
.controls button.plot-point:hover {
  background-color: #0062cc; /* Hover background color */
  border-color: #0056b3; /* Hover border color */
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

/* Styles for the remove button */
.data-points-table button {
  background-color: #ff4d4d; /* Red background */
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  padding: 5px 10px;
}

.data-points-table button:hover {
  background-color: #ff3333; /* Darker red on hover */
}

/* Styles for the warning message */
.id-warning-message {
  color: red; /* Choose a color that stands out */
  margin: 10px 0;
  font-weight: bold;
}

/* Styles for validation message */
.validation-message {
  color: #a94442; /* Red color for error messages */
  background-color: #f2dede; /* Light red background */
  border-color: #ebccd1; /* Red border */
  padding: .75rem 1.25rem;
  margin-bottom: 1rem;
  border: 1px solid transparent;
  border-radius: .25rem;
}

/* Styles for disabled buttons */
.button-disabled {
  background-color: #ccc; /* Example: gray background */
  color: #666; /* Example: darker text color */
  cursor: not-allowed; /* Show a disabled cursor */
}

/* Styles for the offline indicator */
.offline-indicator {
  color: red;
  background-color: lightgray;
  border: 3px;
  padding-left: 0px;
  text-align: center;
  border-radius: 3px; /* non-rounded corners */
  font-size: 16px; /* Larger font size for readability */
}

/* Styles for the acknowledgment message */
.acknowledgment-message {
  font-size: 12px; /* Larger font size for readability */
  background-color: orange;
  color: black;
  text-align: center;
  padding: 0px;
  position: sticky;
  top: 0;
  z-index: 1000;
  margin-top: 0; /* Ensure there is no margin on the top */
}

/* Styles for the acknowledgment message content */
.acknowledgment-message button {
  background-color: white;
  color: black;
  border: 1px solid black;
  padding: 1px 6px;
  font-size: 12px;
  cursor: pointer;
  margin-left: 0px;
  border-radius: 5px;
}
</style>
