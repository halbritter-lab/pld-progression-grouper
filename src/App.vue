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
          <!-- eslint-disable-next-line vue/no-v-html -->
          <p v-html="section.content" />
        </section>
        <button @click="closeModal">
          I Acknowledge
        </button>
      </div>
    </div>

    <!-- Header section with logo and application title -->
    <div class="header">
      <img
        src="./assets/logo.webp"
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
      <div
        v-if="showControls"
        class="controls"
      >
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
          <label for="ageInput">Age [y]:</label>
          <input
            id="ageInput"
            v-model="age"
            type="number"
            placeholder="20-80"
          >
        </div>
        <div
          v-if="ageValidationMessage"
          class="validation-message"
        >
          {{ ageValidationMessage }}
        </div>
        <div class="input-group">
          <label for="liverInput">Total Liver Volume (TLV) [ml] :</label>
          <input
            id="liverInput"
            v-model="totalLiverVolume"
            type="number"
            placeholder="0-20000"
          >
        </div>
        <div
          v-if="tlvValidationMessage"
          class="validation-message"
        >
          {{ tlvValidationMessage }}
        </div>

        <!-- Extra grouping controls -->
        <button @click="toggleGrouping">
          {{ enableGrouping ? 'Disable Grouping' : 'Enable Grouping' }}
        </button>
        <div
          v-if="enableGrouping"
          class="input-group"
        >
          <label for="groupInput">Group:</label>
          <input
            id="groupInput"
            v-model="group"
            type="text"
            placeholder="Enter group name"
          >
        </div>
        <div
          v-if="enableGrouping"
          class="input-group"
        >
          <label for="groupColorInput">Group Color:</label>
          <input
            id="groupColorInput"
            v-model="groupColor"
            type="text"
            placeholder="e.g. #000000"
          >
        </div>

        <div class="input-group output-group">
          <label for="normalizedTLV">Normalized Total Liver Volume (nTLV):</label>
          <div class="output-fields">
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
        <button
          class="plot-point"
          :class="{ 'button-disabled': isInvalidInput }" 
          :disabled="isInvalidInput"
          @click="addDataPoint"
        >
          Plot Data
        </button>
        <button @click="printPage">
          Print Page
        </button>
        <button
          :disabled="dataPoints.length === 0"
          @click="downloadChart"
        >
          Download Plot
        </button>
        <button
          :disabled="dataPoints.length === 0"
          @click="saveDataAsJson"
        >
          Save
        </button>
        <!-- invisible file input element -->
        <input
          ref="fileInput"
          type="file"
          style="display: none;"
          @change="handleFileUpload"
        >
        <!-- Button for triggering the file input -->
        <button @click="triggerFileInput">
          Load
        </button>
        <button
          :disabled="dataPoints.length === 0"
          @click="downloadDataAsExcel"
        >
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
              <th v-if="enableGrouping">
                Group
              </th>
              <th v-if="enableGrouping">
                Color
              </th>
              <th>Remove</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(point, index) in dataPoints"
              :key="point.id"
            >
              <td>{{ point.id }}</td>
              <td>{{ point.age }}</td>
              <td>{{ point.tlv }}</td>
              <td>{{ point.ntlv }}</td>
              <td>{{ point.pg }}</td>
              <td>{{ point.lgr }}</td>
              <td v-if="enableGrouping">
                <input
                  v-model="point.group"
                  placeholder="Group"
                  @change="updateChartPoint(index)"
                >
              </td>
              <td v-if="enableGrouping">
                <input
                  v-model="point.groupColor"
                  placeholder="Color"
                  @change="updateChartPoint(index)"
                >
              </td>
              <td>
                <button @click="removeDataPoint(index)">
                  -
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Documentation sentence with link -->
      <div v-if="showDocumentation">
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
      </div>

      <!-- Citation policy sentences with links -->
      <div v-if="showCitation">
        <p>
          Please cite the following publication for this tool: <br>
          For ADPKD: 
          <a
            href="https://pubmed.ncbi.nlm.nih.gov/36246085/"
            target="_blank"
          >
            Sierks D, et al. Modelling polycystic liver disease progression using age-adjusted liver volumes and targeted mutational analysis. JHEP Rep. 2022.
          </a> <br>
          For ADPLD:
          <a
            href="https://www.gastrojournal.org/article/S0016-5085(23)05603-2/fulltext"
            target="_blank"
          >
            Schönauer R. &amp; Sierks D, et al. Sex, genotype, and liver volume progression as risk of hospitalization determinants in autosomal dominant polycystic liver disease. Gastroenterology. 2023.
          </a>
        </p>
      </div>
    </div>

    <!-- Footer section with institution and funder logos -->
    <footer
      v-if="showFooter"
      class="footer"
    >
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
// Import necessary Vue APIs and libraries
import { ref, onMounted, onUnmounted, computed, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { Chart, registerables } from 'chart.js';
import * as XLSX from 'xlsx';
import packageInfo from '../package.json';
import { CONFIG } from '@/config/config';
import disclaimerMixin from './mixins/disclaimerMixin';
import footerMixin from './mixins/footerMixin';
import { formulas } from '@/config/formulasConfig';

// Register Chart.js components
Chart.register(...registerables);

export default {
  mixins: [disclaimerMixin, footerMixin],
  setup() {
    // Router and route references
    const router = useRouter();
    const route = useRoute();

    const version = packageInfo.version;
    const lastCommitHash = ref('loading...');
    const fetchError = ref(false);
    const showFooter = ref(true);
    const showCitation = ref(true);
    const showDocumentation = ref(true);
    const showControls = ref(true);

    const getUrlQueryParams = async () => {
      await router.isReady();
      if (route.query.acknowledgeBanner === "true") {
        showModal.value = false;
      }
      if (route.query.patientId) patientId.value = route.query.patientId;
      if (route.query.age) age.value = route.query.age;
      if (route.query.tlv) totalLiverVolume.value = route.query.tlv;
      if (route.query.patientId && route.query.age && route.query.tlv) {
        addDataPoint();
      }
      showFooter.value = route.query.showFooter !== 'false';
      showCitation.value = route.query.showCitation !== 'false';
      showDocumentation.value = route.query.showDocumentation !== 'false';
      showControls.value = route.query.showControls !== 'false';
    };

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
        lastCommitHash.value = 'offline';
      }
    };

    const idWarningMessage = ref('');
    const ageValidationMessage = ref('');
    const tlvValidationMessage = ref('');

    const disclaimerAcknowledged = ref(localStorage.getItem('disclaimerAcknowledged') === 'true');
    const acknowledgmentTime = ref(localStorage.getItem('acknowledgmentTime'));
    const showModal = ref(!disclaimerAcknowledged.value);

    const closeModal = () => {
      const currentTime = new Date().toLocaleString();
      showModal.value = false;
      disclaimerAcknowledged.value = true;
      acknowledgmentTime.value = currentTime;
      localStorage.setItem('disclaimerAcknowledged', 'true');
      localStorage.setItem('acknowledgmentTime', currentTime);
    };

    const reopenModal = () => {
      showModal.value = true;
    };

    const patientId = ref('');
    const age = ref(CONFIG.AGE_MIN);
    const totalLiverVolume = ref(CONFIG.TLV_MIN);
    const chartCanvas = ref(null);
    let chart = null;

    // New reactive properties for grouping
    const enableGrouping = ref(false);
    const group = ref('');
    const groupColor = ref('');

    // Computed properties for normalized values
    const normalizedTLV = computed(() => totalLiverVolume.value / CONFIG.NORMALIZATION_FACTOR);
    const formattedNormalizedTLV = computed(() => {
      if (
        age.value < CONFIG.AGE_MIN || age.value > CONFIG.AGE_MAX ||
        totalLiverVolume.value < CONFIG.TLV_MIN || totalLiverVolume.value > CONFIG.TLV_MAX
      ) {
        return null;
      }
      return (totalLiverVolume.value / CONFIG.NORMALIZATION_FACTOR).toFixed(3);
    });
    const progressionGroup = computed(() => {
      if (
        age.value < CONFIG.AGE_MIN || age.value > CONFIG.AGE_MAX ||
        totalLiverVolume.value < CONFIG.TLV_MIN || totalLiverVolume.value > CONFIG.TLV_MAX
      ) {
        return null;
      }
      const nTLV = normalizedTLV.value;
      const patientAge = age.value;
      if (nTLV > formulas.calculatePG3Threshold(patientAge)) return 'PG3';
      if (nTLV > formulas.calculatePG2Threshold(patientAge) && nTLV <= formulas.calculatePG3Threshold(patientAge)) return 'PG2';
      return 'PG1';
    });
    const liverGrowthRate = computed(() => {
      if (
        age.value < CONFIG.AGE_MIN || age.value > CONFIG.AGE_MAX ||
        totalLiverVolume.value < CONFIG.TLV_MIN || totalLiverVolume.value > CONFIG.TLV_MAX
      ) {
        return null;
      }
      return formulas.calculateLiverGrowthRate(age.value, normalizedTLV.value);
    });

    // Data points array now supports group and groupColor properties.
    const dataPoints = ref([]);

    const addDataPoint = () => {
      if (isInvalidInput.value) {
        idWarningMessage.value = 'Please correct the errors before plotting.';
        return;
      }
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
        lgr: liverGrowthRate.value !== null ? liverGrowthRate.value.toFixed(2) : 'N/A',
        group: enableGrouping.value ? group.value : '',
        groupColor: enableGrouping.value ? groupColor.value : null
      };
      if (enableGrouping.value && groupColor.value) {
        newData.backgroundColor = groupColor.value;
      }
      dataPoints.value.push(newData);
      chart.data.datasets[0].data.push({
        x: newData.age,
        y: normalizedTLV.value,
        id: newData.id,
        group: newData.group,
        groupColor: newData.groupColor,
        backgroundColor: newData.backgroundColor
      });
      chart.update();
      idWarningMessage.value = '';
    };

    const validateInput = () => {
      ageValidationMessage.value = '';
      tlvValidationMessage.value = '';
      if (age.value < CONFIG.AGE_MIN || age.value > CONFIG.AGE_MAX) {
        ageValidationMessage.value = `Age must be between ${CONFIG.AGE_MIN} and ${CONFIG.AGE_MAX} years.`;
      }
      if (totalLiverVolume.value < CONFIG.TLV_MIN || totalLiverVolume.value > CONFIG.TLV_MAX) {
        tlvValidationMessage.value = `Total Liver Volume must be between 0 and ${CONFIG.TLV_MAX} ml.`;
      }
    };

    const isInvalidInput = computed(() => ageValidationMessage.value !== '' || tlvValidationMessage.value !== '');

    watch(age, validateInput);
    watch(totalLiverVolume, validateInput);

    const removeDataPoint = (index) => {
      dataPoints.value.splice(index, 1);
      if (chart && chart.data.datasets.length > 0) {
        chart.data.datasets[0].data.splice(index, 1);
        chart.update();
      }
    };

    const handleResize = () => {
      if (chart) {
        chart.resize();
      }
    };

    const setupChart = () => {
      const ctx = chartCanvas.value.getContext('2d');
      const lineData1 = formulas.generateLineData1(61, 20);
      const lineData2 = formulas.generateLineData2(61, 20);
      chart = new Chart(ctx, {
        type: 'scatter',
        data: {
          datasets: [
            {
              label: 'Age vs Normalized Liver Volume',
              data: [],
              // Default colors – will be overridden per point if groupColor is defined
              backgroundColor: '#180C0C',
              borderColor: '#180C0C',
              borderWidth: 1,
              pointRadius: 5,
              // Use pointBackgroundColor callback to allow per-point color override
              pointBackgroundColor: function(context) {
                const dataPoint = context.raw;
                return dataPoint && dataPoint.backgroundColor ? dataPoint.backgroundColor : '#180C0C';
              }
            },
            {
              label: 'Ceiling',
              data: Array.from({ length: 61 }, (_, i) => ({ x: 20 + i, y: 25 })),
              borderColor: 'transparent',
              borderWidth: 0,
              showLine: true,
              pointRadius: 0,
              fill: '+1',
              backgroundColor: '#B2241C33'
            },
            {
              label: 'Trend Line 1',
              data: lineData1,
              borderColor: '#B2241C',
              borderWidth: 3,
              showLine: true,
              pointRadius: 0,
              fill: '+1',
              backgroundColor: '#F64C4633'
            },
            {
              label: 'Trend Line 2',
              data: lineData2,
              borderColor: '#F64C46',
              borderWidth: 2,
              showLine: true,
              pointRadius: 0,
              fill: 'origin',
              backgroundColor: '#FDA3A133'
            }
          ]
        },
        options: {
          scales: {
            x: {
              title: { display: true, text: 'Age (years)' },
              type: 'linear',
              min: CONFIG.CHART_X_AXIS_MIN,
              max: CONFIG.CHART_X_AXIS_MAX
            },
            y: {
              title: { display: true, text: 'nTLV' },
              beginAtZero: true,
              max: CONFIG.CHART_Y_AXIS_MAX
            }
          },
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: function(context) {
                  let label = context.dataset.label || '';
                  if (label) label += ': ';
                  if (context.parsed.x !== null) label += context.parsed.x;
                  if (context.parsed.y !== null) label += ', ' + context.parsed.y.toFixed(2);
                  const dataPoint = context.raw;
                  if (dataPoint && dataPoint.id) label += `; ID: ${dataPoint.id}`;
                  return label;
                }
              }
            }
          }
        }
      });
    };

    const printPage = () => {
      window.print();
    };

    const downloadChart = () => {
      const link = document.createElement('a');
      link.href = chartCanvas.value.toDataURL('image/png');
      link.download = 'plot.png';
      link.click();
    };

    const saveDataAsJson = () => {
      const dataStr = JSON.stringify(dataPoints.value);
      const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
      const exportFileDefaultName = `data_${new Date().toISOString()}.json`;
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
    };

    // Unified file upload handler that determines file type and calls appropriate loader
    const handleFileUpload = async (event) => {
      const file = event.target.files[0];
      if (!file) return;
      const fileName = file.name.toLowerCase();
      if (file.type === 'application/json' || fileName.endsWith('.json')) {
        loadDataFromJson(event);
      } else if (
        file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
        file.type === 'application/vnd.ms-excel' ||
        fileName.endsWith('.xlsx') ||
        fileName.endsWith('.xls')
      ) {
        loadDataFromExcel(event);
      } else {
        console.error('Unsupported file type.');
      }
    };

    // Load data from a JSON file and compute missing values (including group fields)
    const loadDataFromJson = async (event) => {
      const file = event.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const fileData = JSON.parse(e.target.result);
          fileData.forEach((sample) => {
            const computedNTLV = (sample.tlv / CONFIG.NORMALIZATION_FACTOR).toFixed(3);
            let computedPG = null;
            if (computedNTLV > formulas.calculatePG3Threshold(sample.age)) {
              computedPG = 'PG3';
            } else if (computedNTLV > formulas.calculatePG2Threshold(sample.age) &&
                       computedNTLV <= formulas.calculatePG3Threshold(sample.age)) {
              computedPG = 'PG2';
            } else {
              computedPG = 'PG1';
            }
            const computedLGR = sample.age > 20 ? formulas.calculateLiverGrowthRate(sample.age, computedNTLV) : null;
            // Preserve group information if provided
            const newData = {
              id: sample.id,
              age: sample.age,
              tlv: sample.tlv,
              ntlv: computedNTLV,
              pg: computedPG,
              lgr: computedLGR !== null ? computedLGR.toFixed(2) : 'N/A',
              group: sample.group || '',
              groupColor: sample.groupColor || null
            };
            if (newData.groupColor) {
              newData.backgroundColor = newData.groupColor;
            }
            dataPoints.value.push(newData);
            chart.data.datasets[0].data.push({
              x: newData.age,
              y: parseFloat(computedNTLV),
              id: newData.id,
              group: newData.group,
              groupColor: newData.groupColor,
              backgroundColor: newData.backgroundColor
            });
          });
          chart.update();
        } catch (err) {
          console.error('Error loading JSON data:', err);
        }
      };
      reader.readAsText(file);
    };

    // Load data from an Excel file and compute missing values (including group fields)
    const loadDataFromExcel = async (event) => {
      const file = event.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: '' });
          jsonData.forEach((row) => {
            if (!row.id || !row.age || !row.tlv) return;
            const ageValue = Number(row.age);
            const tlvValue = Number(row.tlv);
            if (isNaN(ageValue) || isNaN(tlvValue)) return;
            const computedNTLV = (tlvValue / CONFIG.NORMALIZATION_FACTOR).toFixed(3);
            let computedPG = null;
            if (computedNTLV > formulas.calculatePG3Threshold(ageValue)) {
              computedPG = 'PG3';
            } else if (computedNTLV > formulas.calculatePG2Threshold(ageValue) &&
                       computedNTLV <= formulas.calculatePG3Threshold(ageValue)) {
              computedPG = 'PG2';
            } else {
              computedPG = 'PG1';
            }
            const computedLGR = ageValue > 20 ? formulas.calculateLiverGrowthRate(ageValue, computedNTLV) : null;
            const newData = {
              id: row.id,
              age: ageValue,
              tlv: tlvValue,
              ntlv: computedNTLV,
              pg: computedPG,
              lgr: computedLGR !== null ? computedLGR.toFixed(2) : 'N/A',
              group: row.group || '',
              groupColor: row.groupColor || null
            };
            if (newData.groupColor) {
              newData.backgroundColor = newData.groupColor;
            }
            dataPoints.value.push(newData);
            chart.data.datasets[0].data.push({
              x: newData.age,
              y: parseFloat(computedNTLV),
              id: newData.id,
              group: newData.group,
              groupColor: newData.groupColor,
              backgroundColor: newData.backgroundColor
            });
          });
          chart.update();
        } catch (err) {
          console.error('Error reading Excel data:', err);
        }
      };
      reader.readAsArrayBuffer(file);
    };

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

    const downloadDataAsExcel = () => {
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(dataPoints.value);
      XLSX.utils.book_append_sheet(wb, ws, "Data");
      const fileName = `Data_${new Date().toISOString()}.xlsx`;
      XLSX.writeFile(wb, fileName);
    };

    const fileInput = ref(null);
    const triggerFileInput = () => {
      if (fileInput.value) fileInput.value.click();
    };

    // Called when a group or groupColor is modified inline in the table.
    const updateChartPoint = (index) => {
      const sample = dataPoints.value[index];
      // Update the corresponding chart point backgroundColor based on groupColor.
      const chartPoint = chart.data.datasets[0].data[index];
      chartPoint.backgroundColor = sample.groupColor ? sample.groupColor : '#180C0C';
      chartPoint.group = sample.group;
      chartPoint.groupColor = sample.groupColor;
      chart.update();
    };

    // Toggle grouping mode
    const toggleGrouping = () => {
      enableGrouping.value = !enableGrouping.value;
    };

    onMounted(() => {
      getUrlQueryParams();
      document.documentElement.style.setProperty('--modal-max-width', CONFIG.MODAL_MAX_WIDTH);
      document.documentElement.style.setProperty('--modal-max-height', CONFIG.MODAL_MAX_HEIGHT);
      fetchLastCommit();
      document.title = 'PLD-Progression Grouper';
      updateMetaTag('description', 'PLD-Progression Grouper is a Vue.js web application, based on extensive research, offering insights into Polycystic Liver Disease (PLD) progression. Developed by Bernt Popp, Ria Schönauer, Dana Sierks, and Jan Halbritter, this tool facilitates understanding of PLD for both educational and research purposes.');
      updateMetaTag('keywords', 'PLD, Polycystic Liver Disease, Liver Health, Medical Research, Data Visualization, Vue.js, Web Application, Liver Disease Progression, Medical Education, Healthcare Technology');
      updateMetaTag('author', 'Bernt Popp, Ria Schönauer, Dana Sierks, Jan Halbritter');
      updateMetaTag('creator', 'Bernt Popp, Ria Schönauer, Dana Sierks, Jan Halbritter');
      setupChart();
      window.addEventListener('resize', handleResize);
    });

    onUnmounted(() => {
      window.removeEventListener('resize', handleResize);
    });

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
      handleFileUpload,
      downloadDataAsExcel,
      fetchError,
      showFooter,
      showCitation,
      showDocumentation,
      showControls,
      // New grouping reactive variables and methods
      enableGrouping,
      group,
      groupColor,
      toggleGrouping,
      updateChartPoint
    };
  }
};
</script>

<style>
/* Global font style for the entire application */
* {
  font-family: Arial, sans-serif;
}
body {
  margin: 0;
  padding: 0;
}
.app-version {
  font-size: 0.8em;
  color: #666;
  font-weight: normal;
  padding-left: 10px;
}
.app-commit {
  font-size: 0.8em;
  color: #666;
  font-weight: normal;
  padding-left: 0px;
}
.modal {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}
@media (max-width: 600px) {
  .modal-content {
    max-width: var(--modal-max-width);
    max-height: var(--modal-max-height);
    padding: 10px;
  }
}
.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 5px;
  max-width: 500px;
  width: 90%;
  text-align: left;
  overflow-y: auto;
  max-height: 90%;
}
.header {
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  width: 100%;
}
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}
.app-logo {
  max-width: 92px;
  margin-right: 20px;
  animation: fadeIn 2s ease-out forwards;
}
.app-logo:hover {
  animation: pulse 2s infinite;
}
.app-title {
  font-size: 24px;
  font-weight: bold;
  margin: 0;
}
.container {
  text-align: center;
  max-width: 800px;
  margin: auto;
  padding-bottom: 50px;
}
.progression-groups {
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin: 20px 0;
}
.progression-group {
  border: 3px solid #FFA3A3;
  border-radius: 0px;
  padding: 10px;
  text-align: center;
  margin-bottom: 5px;
  min-width: 80px;
}
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
.input-group {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 10px 0;
}
.input-group input {
  padding: 5px;
  border: 2px solid #ddd;
  border-radius: 0px;
  font-size: 14px;
  margin-bottom: 10px;
  width: 80%;
}
.output-group {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}
.output-fields {
  display: flex;
  flex-grow: 1;
}
.output-field, .progression-group-output {
  flex-grow: 1;
  border: 1px solid;
  padding: 5px;
  border-radius: 0px;
  text-align: center;
  margin-left: 5px;
  width: 100px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
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
.controls button {
  background-color: #00bf7d;
  color: black;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  padding: 10px 15px;
  margin: 5px;
}
.controls button:hover {
  background-color: #45a049;
}
.controls button.plot-point {
  background-color: #89ce00;
  border: 2px solid #0056b3;
}
.controls button.plot-point.button-disabled {
  background-color: #ccc;
  color: #666;
  cursor: not-allowed;
}
.controls button.plot-point:active {
  background-color: #0056b3;
  border-color: #004085;
}
.controls button.plot-point:hover {
  background-color: #0062cc;
  border-color: #0056b3;
}
.footer {
  padding: 10px 0;
  background-color: #f5f5f5;
  display: flex;
  justify-content: center;
  align-items: center;
}
.institution-logo, .funder-logo {
  max-width: 120px;
  margin: 0 20px;
}
.data-points-table-container {
  margin-top: 20px;
}
.data-points-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
}
.data-points-table th,
.data-points-table td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}
.data-points-table th {
  background-color: #f5f5f5;
  font-weight: bold;
}
.data-points-table td {
  background-color: #fff;
}
.data-points-table button {
  background-color: #ff4d4d;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  padding: 5px 10px;
}
.data-points-table button:hover {
  background-color: #ff3333;
}
.id-warning-message {
  color: red;
  margin: 10px 0;
  font-weight: bold;
}
.validation-message {
  color: #a94442;
  background-color: #f2dede;
  border-color: #ebccd1;
  padding: .75rem 1.25rem;
  margin-bottom: 1rem;
  border: 1px solid transparent;
  border-radius: .25rem;
  min-height: 20px;
}
.button-disabled {
  background-color: #ccc;
  color: #666;
  cursor: not-allowed;
}
.offline-indicator {
  color: red;
  background-color: lightgray;
  border: 3px;
  padding-left: 0px;
  text-align: center;
  border-radius: 3px;
  font-size: 16px;
}
.acknowledgment-message {
  font-size: 12px;
  background-color: orange;
  color: black;
  text-align: center;
  padding: 0px;
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
}
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
button:disabled {
  background-color: #ccc;
  color: #666;
  cursor: not-allowed;
}
</style>
