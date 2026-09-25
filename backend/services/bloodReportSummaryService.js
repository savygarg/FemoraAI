const MARKER_CONTEXT = {
  "Hemoglobin": "oxygen-carrying capacity and red blood cell health",
  "WBC Count": "immune system activity",
  "Platelet Count": "blood clotting and bleeding control",
  "Glucose": "blood sugar regulation",
  "Vitamin B12": "nerve function and red blood cell production",
  "Vitamin D": "bone health and several body processes",
};

const DISCUSSION_AREAS = {
  "Hemoglobin": "anemia-related concerns or other causes of an altered blood count",
  "WBC Count": "infection, inflammation, medication effects, or other immune-related factors",
  "Platelet Count": "clotting, bleeding, inflammation, or medication-related factors",
  "Glucose": "blood sugar regulation, recent food intake, or metabolic health",
  "Vitamin B12": "nutrition, absorption, or nerve-related concerns",
  "Vitamin D": "dietary intake, sun exposure, absorption, or bone health",
};

const getExtractedMarkers = (extractedResults) =>
  (Array.isArray(extractedResults) ? extractedResults : []).filter(
    (marker) =>
      marker &&
      marker.name &&
      marker.value &&
      marker.value !== "Not found" &&
      marker.status &&
      marker.status !== "Not found"
  );

const createBloodReportSummary = (extractedResults) => {
  const markers = getExtractedMarkers(extractedResults);
  const withinRange = markers
    .filter((marker) => marker.status === "Normal")
    .map((marker) => `${marker.name} (${marker.value} ${marker.unit})`);
  const outsideRange = markers
    .filter((marker) => marker.status === "Low" || marker.status === "High")
    .map((marker) => `${marker.name} (${marker.value} ${marker.unit}; ${marker.status}, reference ${marker.range})`);
  const markerContext = markers.map((marker) => ({
    marker: marker.name,
    relatesTo: MARKER_CONTEXT[marker.name] || "a general health measurement",
  }));
  const discussionPoints = markers
    .filter((marker) => marker.status === "Low" || marker.status === "High")
    .map((marker) => `${marker.name} may be associated with ${DISCUSSION_AREAS[marker.name] || "several possible health factors"}.`);

  return {
    withinRange,
    outsideRange,
    markerContext,
    discussionPoints,
    message: markers.length
      ? "These observations describe reported laboratory values and possible areas to discuss; they do not establish a diagnosis."
      : "No extracted laboratory values were available for interpretation.",
    disclaimer: "Reference ranges can vary by laboratory and personal context. Persistent, severe, or concerning findings are worth discussing with a healthcare professional.",
  };
};

module.exports = {
  createBloodReportSummary,
};
