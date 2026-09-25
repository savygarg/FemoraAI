const getAutomatedInsight = ({ symptoms, notes }) => {
  const reportedSymptoms = Array.isArray(symptoms) ? symptoms : [];
  const symptomText = reportedSymptoms.length
    ? `You reported ${reportedSymptoms.join(", ")} today.`
    : "You did not select any symptoms for this entry.";

  const contextText = notes?.trim()
    ? "Your notes may help you and your healthcare professional notice patterns over time."
    : "Adding notes about timing, sleep, stress, hydration, or routine changes may help you notice patterns over time.";

  return `${symptomText} These experiences can have many possible explanations, including sleep, stress, hydration, nutrition, routine changes, or other health factors. ${contextText} This is general health information, not a diagnosis. Persistent, severe, or concerning symptoms should be discussed with a healthcare professional.`;
};

module.exports = {
  getAutomatedInsight,
};
