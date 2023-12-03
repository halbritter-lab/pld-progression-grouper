// formulasConfig.js
export const formulas = {
  calculatePG3Threshold: (age) => 0.2671 * Math.exp(0.066 * age),
  calculatePG2Threshold: (age) => 0.5169 * Math.exp(0.033 * age),
  generateLineData1: (length, startAge) => Array.from({ length }, (_, i) => {
    const age = startAge + i;
    return { x: age, y: formulas.calculatePG3Threshold(age) };
  }),
  generateLineData2: (length, startAge) => Array.from({ length }, (_, i) => {
    const age = startAge + i;
    return { x: age, y: formulas.calculatePG2Threshold(age) };
  }),
  // Add more formulas as needed
};
