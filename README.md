
<p align="center">
    <img src="public/logo.png" alt="PLD-Progression Grouper logo" width="192" height="192">
</p>

# PLD-Progression Grouper

Please explore the [PLD-Progression Grouper](https://halbritter-lab.github.io/pld-progression-grouper/) app hosted on GitHub pages.

## Introduction

"Polycystic Liver Disease (PLD) - Progression Grouper" is an interactive web application designed to assist in the prognostic assessment of Autosomal Dominant Polycystic Liver Disease (ADPLD) and PLD within the context of Autosomal Dominant Polycystic Kidney Disease (ADPKD). Based on two recents studies titled "Sex, genotype, and liver volume progression as risk of hospitalization determinants in autosomal dominant polycystic liver disease" and "Modelling polycystic liver disease progression using age-adjusted liver volumes and targeted mutational analysis" (PMID: 36246085), this tool aims to facilitate the visualization of disease progression and estimates the future risk of liver-related hospitalization in individuals with PLD.

PLD, characterized by numerous fluid-filled cysts arising from intrahepatic biliary epithelia, is a mostly genetic cholangiopathy with significant clinical heterogeneity. The application leverages data from a single-center and a multicenter study to introduce novel clinical endpoints, such as normalized age-adjusted total liver volume (nTLV) and PLD-related hospitalization, for prognostic risk stratification.


## References

The pronciple of the "PLD-Progression Grouper" tool has been first published in 2022, highlighting its application in the study of PLD within the context of both Autosomal Dominant Polycystic Kidney Disease (ADPKD) and Autosomal Dominant Polycystic Liver Disease (ADPLD). This underscores the tool's relevance and adaptability for assessing PLD progression not only in isolated cases but also when it occurs in conjunction with ADPKD. For more details on the publication, see [PMID:36246085](https://pubmed.ncbi.nlm.nih.gov/36246085/).


## Features

- **Data Input and Visualization:** Users can input individual-specific data, including age and total liver volume, to visualize the normalized total liver volume (nTLV) on a chart.
- **Trend Analysis:** The app plots two key trend lines based on the formulas derived from the study, offering visual insight into the progression groups as defined in the research.
- **Dynamic Interaction:** Users can interactively plot new data points on the chart, assisting in the analysis of individual individual trajectories.
- **Download and Print Options:** The application allows for downloading the plotted chart and printing the page for offline analysis and record-keeping.

## Technical Overview

The application is built using Vue.js and Chart.js, ensuring a responsive and interactive user experience. The layout is designed with controls and input fields on the left and the chart on the right, facilitating ease of use and clear data presentation.

## Usage

1. **ID Input:** Enter the individual's ID for reference.
2. **Age Input:** Input the individual's age.
3. **Total Liver Volume Input:** Enter the total liver volume (TLV) in ml.
4. **Normalized Total Liver Volume:** The app automatically calculates and displays the nTLV.
5. **Plot Point:** Click to add the data point to the chart.
6. **Print and Download:** Use these options to print the page or download the chart.


## Limitations and Relevance

While the tool is based on a large cohort study, it's important to acknowledge the limitations in generalizability due to the cohort size. The tool serves a research purpose, offering a new approach to understanding the progression of ADPLD and assisting in decision-making for individuals with PLD.


## Contributions

This tool is an open-source project, and contributions are welcome. Whether it's feature enhancement, bug fixing, or improvements in the algorithm, your input is valuable.


## Copyright and license

- All code from this project is licensed under the "MIT No Attribution" (MIT-0) License.  For more information, please refer to the [License](LICENSE.md) file.


## Creators and contributors

**Bernt Popp**

- <https://twitter.com/berntpopp>
- <https://github.com/berntpopp>
- <https://orcid.org/0000-0002-3679-1081>
- <https://scholar.google.com/citations?user=Uvhu3t0AAAAJ>

**Ria Schönauer**

- <https://orcid.org/0000-0001-7609-3061>

**Jan Halbritter**

- <https://github.com/halbrijp>
- <https://orcid.org/0000-0002-1377-9880>
- <https://scholar.google.com/citations?user=Jt1S5fkAAAAJ>

## Contact

If you have any questions, suggestions, or feedback, please feel free to [contact us](contact.md).
