import React, { useState } from "react";
import Header from "../components/Header";
import Navigation from "../components/Navigation";
import { HelpCircle, ChevronDown } from "lucide-react";

const FAQ: React.FC = () => {
  const [isNavOpen, setIsNavOpen] = useState(false);
  
  const faqs = [
    { q: "How do I edit submitted data?", a: "Data can be edited until the final submission window closes on the 5th of each month. Contact your Division head for re-opening if the deadline has passed." },
    { q: "What if my branch has zero waste?", a: "Please enter '0' in the waste_kg field. Do not leave the field blank as it affects the AI forecasting model." },
    { q: "Who can access the forecasting reports?", a: "Currently, Branch Managers can view their own forecasts, while Division and Circle heads can view aggregated data." }
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
              <HelpCircle size={24} /> Frequently Asked Questions
            </h2>
            <div style={{ marginTop: '30px' }}>
              {faqs.map((faq, i) => (
                <details key={i} style={{ marginBottom: '15px', border: '1px solid #eee', borderRadius: '8px', background: '#fff' }}>
                  <summary style={{ padding: '15px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', listStyle: 'none' }}>
                    {faq.q} <ChevronDown size={18} color="#C3202E" />
                  </summary>
                  <div style={{ padding: '15px', borderTop: '1px solid #eee', color: '#555', fontSize: '14px', lineHeight: '1.6' }}>
                    {faq.a}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default FAQ;