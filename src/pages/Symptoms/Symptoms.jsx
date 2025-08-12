import React, { useState } from "react";
import "./Symptoms.css";
import LogoHeader from "../../components/LogoHeader/LogoHeader";

const Symptoms = () => {
  const [formData, setFormData] = useState({
    primarySymptoms: "",
    severityLevel: "low",
    affectedBodyParts: "",
    sleepHours: "",
    travelHistory: "",
    exposure: "",
  });

  const [result, setResult] = useState({ topPredictions: [], recommendation: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!["Yes", "No"].includes(formData.travelHistory) || !["Yes", "No"].includes(formData.exposure)) {
      alert("Travel History and Exposure must be 'Yes' or 'No'.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setResult({
          topPredictions: data.topPredictions || [],
          recommendation: data.recommendation || "",
        });
      } else {
        console.error("Prediction error:", data.error);
        setResult({
          topPredictions: [],
          recommendation: "Could not fetch prediction.",
        });
      }
    } catch (error) {
      console.error("Fetch error:", error);
      setResult({
        topPredictions: [],
        recommendation: "Server is unavailable.",
      });
    }
    setLoading(false);
  };

  return (
    <>
      <LogoHeader />
      <div className="symptoms-container">
        <div className="form-section">
          <h2>Symptom Checker</h2>

          <form onSubmit={handleSubmit} className="symptoms-form">
            {/* --- Inputs (same as your old code) --- */}
            <div className="symptom-field">
              <label>Primary Symptoms*</label>
              <input
                type="text"
                name="primarySymptoms"
                placeholder="(Fever, cough, headache, etc.)"
                value={formData.primarySymptoms}
                onChange={handleChange}
                className="symptom-input"
                required
              />
            </div>

            <div className="symptom-field">
              <label>Severity Level*</label>
              <select
                name="severityLevel"
                value={formData.severityLevel}
                onChange={handleChange}
                className="symptom-select"
                required
              >
                <option value="low">low</option>
                <option value="medium">medium</option>
                <option value="high">high</option>
              </select>
            </div>

            <div className="symptom-field">
              <label>Affected Body Parts*</label>
              <input
                type="text"
                name="affectedBodyParts"
                placeholder="(Head, Chest, Abdomen, etc.)"
                value={formData.affectedBodyParts}
                onChange={handleChange}
                className="symptom-input"
                required
              />
            </div>

            <div className="symptom-field">
              <label>Sleep Hours</label>
              <input
                type="number"
                name="sleepHours"
                placeholder="(In Hours)"
                value={formData.sleepHours}
                onChange={handleChange}
                className="symptom-input"
              />
            </div>

            <div className="symptom-field">
              <label>Recent Travel History</label>
              <input
                type="text"
                name="travelHistory"
                placeholder="(Yes or No)"
                value={formData.travelHistory}
                onChange={handleChange}
                className="symptom-input"
              />
            </div>

            <div className="symptom-field">
              <label>Exposure to Sick People</label>
              <input
                type="text"
                name="exposure"
                placeholder="(Yes or No)"
                value={formData.exposure}
                onChange={handleChange}
                className="symptom-input"
              />
            </div>

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? "Submitting..." : "Submit"}
            </button>
          </form>
        </div>

        <div className="output-box">
          <h3>Top 3 Predicted Diseases:</h3>
          {result.topPredictions.length > 0 ? (
            <ul>
              {result.topPredictions.map((prediction, index) => (
                <li key={index}>
                  {prediction.disease} - {prediction.probability}%
                </li>
              ))}
            </ul>
          ) : (
            <p>No prediction yet.</p>
          )}

          <h3>Recommendation:</h3>
          <p>{result.recommendation}</p>
        </div>
      </div>
    </>
  );
};

export default Symptoms;