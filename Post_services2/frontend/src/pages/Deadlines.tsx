import React, { useState } from "react";
import Header from "../components/Header";
import Navigation from "../components/Navigation";
import { Clock, AlertCircle } from "lucide-react";

const Deadlines: React.FC = () => {
  const [isNavOpen, setIsNavOpen] = useState(false);

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
              <Clock size={24} /> Reporting Deadlines
            </h2>
            
            <div style={{ background: '#fff4f4', border: '1px solid #ffcccc', padding: '15px', borderRadius: '8px', display: 'flex', gap: '15px', marginTop: '20px', alignItems: 'center' }}>
              <AlertCircle color="#C3202E" size={20} />
              <p style={{ margin: 0, fontSize: '14px', color: '#C3202E' }}>
                <b>Current Cycle:</b> January 2026 data must be submitted by <b>February 5th, 2026</b>.
              </p>
            </div>

            <table style={{ width: '100%', marginTop: '30px', borderCollapse: 'collapse' }}>
              <thead style={{ background: '#f1f3f5' }}>
                <tr>
                  <th style={{ textAlign: 'left', padding: '12px' }}>Month</th>
                  <th style={{ textAlign: 'left', padding: '12px' }}>Reporting Window</th>
                  <th style={{ textAlign: 'left', padding: '12px' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '12px' }}>January</td>
                  <td style={{ padding: '12px' }}>Feb 1 - Feb 5</td>
                  <td><span style={{ color: 'orange', fontWeight: 'bold' }}>Upcoming</span></td>
                </tr>
                <tr style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '12px' }}>February</td>
                  <td style={{ padding: '12px' }}>Mar 1 - Mar 5</td>
                  <td><span style={{ color: '#999' }}>Future</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Deadlines;