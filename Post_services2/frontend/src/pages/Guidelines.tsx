import React, { useState } from "react";
import Header from "../components/Header";
import Navigation from "../components/Navigation";
import { BookOpen } from "lucide-react";
import "../style/forecast.css";

const Guidelines: React.FC = () => {
  const [isNavOpen, setIsNavOpen] = useState(false);

  const steps = [
    { title: "Data Collection", desc: "Gather energy bills, water meter readings, and waste logs for the reporting month." },
    { title: "Verification", desc: "Ensure all units are converted to standard metric (kWh, Litres, Kg) before entry." },
    { title: "Submission", desc: "Complete the ESG form by the 5th of every following month." },
  ];

  return (
    <div className="dashboard-page">
      <Header />
      <div className="layout-container">
        <aside className="sidebar-section">
          <Navigation isOpen={isNavOpen} onClose={() => setIsNavOpen(false)} />
        </aside>
        <main className="forecast-content-area">
          <div className="content-card">
            <h2 style={{ color: '#003366', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <BookOpen size={24} /> BRSR Guidelines
            </h2>
            <p style={{ color: '#666' }}>Standard Operating Procedures for India Post ESG Reporting.</p>
            
            <div style={{ marginTop: '30px' }}>
              {steps.map((step, index) => (
                <div key={index} style={{ display: 'flex', gap: '20px', marginBottom: '20px', padding: '15px', background: '#f8f9fa', borderRadius: '8px' }}>
                  <div style={{ background: '#C3202E', color: 'white', width: '30px', height: '30px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    {index + 1}
                  </div>
                  <div>
                    <h4 style={{ margin: '0 0 5px 0' }}>{step.title}</h4>
                    <p style={{ margin: 0, fontSize: '14px', color: '#555' }}>{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Guidelines;