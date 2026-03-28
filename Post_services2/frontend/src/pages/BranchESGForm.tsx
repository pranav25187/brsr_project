import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { dashboardApi } from "../api";
import Header from "../components/Header";
import "../style/branchESGForm.css";

/** * 1. Define Interfaces clearly at the top 
 */
interface ESGFormData {
  reporting_month: string;
  energy_bill: number | "";
  energy_kwh: number | "";
  fuel_litres: number | "";
  paper_reams: number | "";
  waste_kg: number | "";
  water_litres: number | "";
  training_hours: number | "";
  complaints_count: number | "";
}

interface ESGErrors {
  reporting_month?: string;
  energy_bill?: string;
  energy_kwh?: string;
  fuel_litres?: string;
  paper_reams?: string;
  waste_kg?: string;
  water_litres?: string;
  training_hours?: string;
  complaints_count?: string;
}

const BranchESGForm: React.FC = () => {
  const navigate = useNavigate();
  const token = useSelector((state: any) => state.auth.token);
  
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const month = searchParams.get("month"); 

  const [formData, setFormData] = useState<ESGFormData>({
    reporting_month: month || new Date().toISOString().slice(0, 7),
    energy_bill: "",
    energy_kwh: "",
    fuel_litres: "",
    paper_reams: "",
    waste_kg: "",
    water_litres: "",
    training_hours: "",
    complaints_count: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<ESGErrors>({});
  
  // 🆕 STATE: Tracks if the user has already seen the anomaly warning
  const [hasWarned, setHasWarned] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Reset warning state if the user changes any value
    setHasWarned(false);

    setFormData((prev: ESGFormData) => ({
      ...prev,
      [name]: name === "reporting_month" ? value : value === "" ? "" : parseFloat(value),
    }));

    if (errors[name as keyof ESGErrors]) {
      setErrors((prev: ESGErrors) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: ESGErrors = {};
    const requiredFields: (keyof ESGFormData)[] = [
      "energy_bill", "energy_kwh", "fuel_litres", "paper_reams", 
      "waste_kg", "water_litres", "training_hours", "complaints_count"
    ];

    if (!formData.reporting_month) {
      newErrors.reporting_month = "Reporting month is required";
    }

    requiredFields.forEach((field) => {
      if (formData[field] === "" || (formData[field] as number) < 0) {
        newErrors[field] = `Valid ${field.replace("_", " ")} is required`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // Logic: Send the force flag if the user is clicking submit for the 2nd time
      const response = await dashboardApi.submitBranchESG(token, {
        ...formData,
        force_submit: hasWarned 
      });

      /**
       * 🚨 CASE 1: Abnormal values detected for the FIRST time
       */
      if (response.warning && !hasWarned) {
        alert(`⚠️ ATTENTION: ${response.message || "Abnormal values detected."}\n\nIf this data is correct, click 'Submit' again to override.`);
        setHasWarned(true); // "Arm" the submit button for the second attempt
        setIsSubmitting(false);
        return; 
      }

      /**
       * ✅ CASE 2: Success (Normal values OR Second attempt)
       */
      alert("ESG Report submitted successfully!");
      navigate("/branch-dashboard");

    } catch (error) {
      console.error("Error submitting ESG report:", error);
      alert("Error submitting ESG report. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="branch-esg-container">
      <Header />
      <div className="esg-main-content">
        <div className="esg-form-container">
          <div className="esg-card">
            <div className="esg-header">
              <h2 className="esg-title">ESG Report</h2>
              <p className="esg-subtitle">India Post Management System</p>
            </div>

            <div className="esg-body">
              <form onSubmit={handleSubmit} className="esg-form">
                
                {/* Reporting Month */}
                <div className="form-group">
                  <label className="form-label">Reporting Month</label>
                  <input
                    type="month"
                    name="reporting_month"
                    value={formData.reporting_month}
                    onChange={handleInputChange}
                    className={`form-input ${errors.reporting_month ? "error" : ""}`}
                    readOnly
                  />
                </div>

                {/* Energy Bill */}
                <div className="form-group">
                  <label className="form-label">Energy Bill (₹)</label>
                  <input
                    type="number"
                    name="energy_bill"
                    value={formData.energy_bill}
                    onChange={handleInputChange}
                    placeholder="Enter bill amount"
                    className={`form-input ${errors.energy_bill ? "error" : ""}`}
                  />
                  {errors.energy_bill && <span className="error-text">{errors.energy_bill}</span>}
                </div>

                {/* Energy kWh */}
                <div className="form-group">
                  <label className="form-label">Energy Consumption (kWh)</label>
                  <input
                    type="number"
                    name="energy_kwh"
                    value={formData.energy_kwh}
                    onChange={handleInputChange}
                    className={`form-input ${errors.energy_kwh ? "error" : ""}`}
                  />
                  {errors.energy_kwh && <span className="error-text">{errors.energy_kwh}</span>}
                </div>

                {/* Fuel */}
                <div className="form-group">
                  <label className="form-label">Fuel (Litres)</label>
                  <input
                    type="number"
                    name="fuel_litres"
                    value={formData.fuel_litres}
                    onChange={handleInputChange}
                    className={`form-input ${errors.fuel_litres ? "error" : ""}`}
                  />
                </div>

                {/* Paper */}
                <div className="form-group">
                  <label className="form-label">Paper (Reams)</label>
                  <input
                    type="number"
                    name="paper_reams"
                    value={formData.paper_reams}
                    onChange={handleInputChange}
                    className={`form-input ${errors.paper_reams ? "error" : ""}`}
                  />
                </div>

                {/* Waste */}
                <div className="form-group">
                  <label className="form-label">Waste (Kg)</label>
                  <input
                    type="number"
                    name="waste_kg"
                    value={formData.waste_kg}
                    onChange={handleInputChange}
                    className={`form-input ${errors.waste_kg ? "error" : ""}`}
                  />
                </div>

                {/* Water */}
                <div className="form-group">
                  <label className="form-label">Water (Litres)</label>
                  <input
                    type="number"
                    name="water_litres"
                    value={formData.water_litres}
                    onChange={handleInputChange}
                    className={`form-input ${errors.water_litres ? "error" : ""}`}
                  />
                </div>

                {/* Training */}
                <div className="form-group">
                  <label className="form-label">Training Hours</label>
                  <input
                    type="number"
                    name="training_hours"
                    value={formData.training_hours}
                    onChange={handleInputChange}
                    className={`form-input ${errors.training_hours ? "error" : ""}`}
                  />
                </div>

                {/* Complaints */}
                <div className="form-group">
                  <label className="form-label">Complaints</label>
                  <input
                    type="number"
                    name="complaints_count"
                    value={formData.complaints_count}
                    onChange={handleInputChange}
                    className={`form-input ${errors.complaints_count ? "error" : ""}`}
                  />
                </div>

                <div className="form-actions">
                  <button
                    type="button"
                    onClick={() => navigate("/branch-dashboard")}
                    className="btn btn-secondary"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`btn btn-primary ${hasWarned ? "btn-warned" : ""}`}
                  >
                    {isSubmitting ? "Submitting..." : hasWarned ? "Confirm & Submit" : "Submit Report"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BranchESGForm;