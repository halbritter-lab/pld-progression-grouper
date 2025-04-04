<template>
  <!-- Main application container -->
  <div
    id="app"
    class="container"
  >
    <!-- Note: disclaimerSections prop is provided by the disclaimerMixin -->
    <!-- Use the DisclaimerModal component -->
    <DisclaimerModal
      :show-modal="showModal"
      :disclaimer-acknowledged="disclaimerAcknowledged"
      :acknowledgment-time="acknowledgmentTime"
      :disclaimer-sections="disclaimerSections"
      @close-modal="closeModal"
      @reopen-modal="reopenModal"
    />

    <!-- Use the AppHeader component -->
    <AppHeader
      :version="version"
      :last-commit-hash="lastCommitHash"
      :fetch-error="fetchError"
    />

    <!-- Main content area -->
    <div class="content">
      <!-- Use the InputControls component -->
      <InputControls
        v-if="showControls"
        v-model:patientId="patientId"
        v-model:age="age"
        v-model:totalLiverVolume="totalLiverVolume"
        v-model:group="group"
        v-model:groupColor="groupColor"
        :enable-grouping="enableGrouping"
        :id-warning-message="idWarningMessage"
        :age-validation-message="ageValidationMessage"
        :tlv-validation-message="tlvValidationMessage"
        :formatted-normalized-t-l-v="formattedNormalizedTLV"
        :progression-group="progressionGroup"
        :liver-growth-rate="liverGrowthRate"
        :is-invalid-input="isInvalidInput"
        :data-points-length="dataPoints.length"
        @toggle-grouping="toggleGrouping"
        @add-data-point="addDataPoint"
        @print-page="printPage"
        @download-chart="downloadChart"
        @save-data-as-json="saveDataAsJson"
        @trigger-load="triggerFileInput" 
        @download-data-as-excel="downloadDataAsExcel"
      />

      <!-- Hidden file input remains in App.vue to handle file loading logic -->
      <input
        ref="fileInput"
        type="file"
        style="display: none;"
        accept=".json"
        @change="handleFileUpload"
      >

      <!-- Container for the chart visualization -->
      <ChartDisplay 
        ref="chartDisplayRef" 
        :data-points="dataPoints"
        :enable-grouping="enableGrouping"
        :group="group"
        :group-color="groupColor"
      />

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

      <!-- Use the CitationSection component -->
      <CitationSection :show-citation="showCitation" />
      <!-- Use the DocumentationSection component -->
      <DocumentationSection :show-documentation="showDocumentation" />
    </div>
    <!-- Use the AppFooter component -->
    <!-- Note: footerLinks prop is provided by the footerMixin -->
    <AppFooter
      :show-footer="showFooter"
      :footer-links="footerLinks"
    />
  </div>
</template>

<script>
// Import necessary Vue APIs and libraries
import { ref, computed, watch, nextTick, onMounted, onUnmounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import packageInfo from '../package.json';
import { CONFIG } from '@/config/config';
import disclaimerMixin from './mixins/disclaimerMixin';
import footerMixin from './mixins/footerMixin';
import { formulas } from '@/config/formulasConfig';
import DisclaimerModal from './components/DisclaimerModal.vue'; // Import the component
import AppHeader from './components/AppHeader.vue'; // Import the AppHeader component
import DocumentationSection from './components/DocumentationSection.vue'; // Import the DocumentationSection component
import CitationSection from './components/CitationSection.vue'; // Import the CitationSection component
import AppFooter from './components/AppFooter.vue'; // Import the AppFooter component
import InputControls from './components/InputControls.vue'; // Import the InputControls component
import ChartDisplay from './components/ChartDisplay.vue'; // Import the ChartDisplay component
import '@/styles/app.css'; // Import the global/app styles

export default {
  components: {
    DisclaimerModal,
    AppHeader,
    DocumentationSection,
    CitationSection,
    AppFooter,
    InputControls,
    ChartDisplay
  },
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
    const chartDisplayRef = ref(null); // Ref for the ChartDisplay component instance
    const fileInput = ref(null); // Keep ref for file input

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
    };

    const printPage = () => {
      window.print();
    };

    const downloadChart = () => {
      chartDisplayRef.value?.downloadChart();
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
          });
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
          });
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

    const triggerFileInput = () => {
      if (fileInput.value) fileInput.value.click();
    };

    // Called when a group or groupColor is modified inline in the table.
    const updateChartPoint = (index) => {
      const sample = dataPoints.value[index];
      // Update the corresponding chart point backgroundColor based on groupColor.
      chartDisplayRef.value?.updatePointStyle(index, sample.groupColor ? sample.groupColor : null, sample.group);
    };

    // Toggle grouping mode
    const toggleGrouping = () => {
      enableGrouping.value = !enableGrouping.value;
    };

    onMounted(() => {
      getUrlQueryParams(); // Parse URL params first
      document.documentElement.style.setProperty('--modal-max-width', CONFIG.MODAL_MAX_WIDTH);
      document.documentElement.style.setProperty('--modal-max-height', CONFIG.MODAL_MAX_HEIGHT);
      fetchLastCommit(); // Call fetchLastCommit here
      document.title = 'PLD-Progression Grouper';
      updateMetaTag('description', 'PLD-Progression Grouper is a Vue.js web application, based on extensive research, offering insights into Polycystic Liver Disease (PLD) progression. Developed by Bernt Popp, Ria Schönauer, Dana Sierks, and Jan Halbritter, this tool facilitates understanding of PLD for both educational and research purposes.');
      updateMetaTag('keywords', 'PLD, Polycystic Liver Disease, Liver Health, Medical Research, Data Visualization, Vue.js, Web Application, Liver Disease Progression, Medical Education, Healthcare Technology');
      updateMetaTag('author', 'Bernt Popp, Ria Schönauer, Dana Sierks, Jan Halbritter');
      updateMetaTag('creator', 'Bernt Popp, Ria Schönauer, Dana Sierks, Jan Halbritter');
    });

    onUnmounted(() => {
      // No longer need to remove resize listener here
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
