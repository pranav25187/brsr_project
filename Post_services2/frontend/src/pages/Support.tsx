import React, { useState } from "react";
import Header from "../components/Header";
import Navigation from "../components/Navigation";
import { LifeBuoy, Mail, Phone } from "lucide-react";

const Support: React.FC = () => {
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
              <LifeBuoy size={24} /> Help & Support
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginTop: '30px' }}>
              <div style={{ border: '1px solid #eee', padding: '30px', borderRadius: '10px', textAlign: 'center' }}>
                <Mail size={40} color="#C3202E" style={{ marginBottom: '15px' }} />
                <h4 style={{ margin: '0 0 10px 0' }}>Email Support</h4>
                <p style={{ color: '#666', fontSize: '14px', margin: 0 }}>support.esg@indiapost.gov.in</p>
              </div>
              <div style={{ border: '1px solid #eee', padding: '30px', borderRadius: '10px', textAlign: 'center' }}>
                <Phone size={40} color="#C3202E" style={{ marginBottom: '15px' }} />
                <h4 style={{ margin: '0 0 10px 0' }}>Helpdesk</h4>
                <p style={{ color: '#666', fontSize: '14px', margin: 0 }}>Toll Free: 1800-425-XXXX</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Support;