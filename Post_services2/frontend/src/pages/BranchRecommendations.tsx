import React, { useState } from "react";
import Header from "../components/Header";
import Navigation from "../components/Navigation";
import "../style/recommendations.css";

interface Recommendation {
  id: number;
  icon: string;
  title: string;
  description: string;
  category: "Environmental" | "Social" | "Governance";
  impact: "High" | "Medium" | "Low";
}

const recommendations: Recommendation[] = [
  { id: 1, icon: "🔌", title: "LED Transition", description: "Reduce energy by switching all branch office lighting to LED bulbs.", category: "Environmental", impact: "High" },
  { id: 2, icon: "🚰", title: "Leakage Audit", description: "Perform weekly inspections of water fixtures to prevent wastage.", category: "Environmental", impact: "Medium" },
  { id: 3, icon: "📄", title: "Paperless Workflows", description: "Digitize customer records and internal memos to minimize paper usage.", category: "Environmental", impact: "High" },
  { id: 4, icon: "🛢", title: "Route Optimization", description: "Use AI-driven route planning for delivery vehicles to reduce fuel consumption.", category: "Environmental", impact: "High" },
  { id: 5, icon: "🤝", title: "Community Outreach", description: "Organize quarterly local environmental awareness programs.", category: "Social", impact: "Medium" },
];

export default function BranchRecommendations() {
  const [isNavOpen, setIsNavOpen] = useState(false);

  return (
    <div className="recommendations-layout">
      <Header />
      <nav className="main-navigation">
        <button className="hamburger-menu" onClick={() => setIsNavOpen(!isNavOpen)}>☰</button>
      </nav>

      <div className="fixed-sidebar">
        <Navigation isOpen={isNavOpen} onClose={() => setIsNavOpen(false)} />
      </div>

      <main className="recommendations-content">
        <header className="content-header">
          <div className="header-text">
            <h2>💡 Strategic Recommendations</h2>
            <p>Tailored actions to improve your branch's <span>ESG Score</span></p>
          </div>
        </header>

        <div className="recommendations-grid">
          {recommendations.map((rec) => (
            <div key={rec.id} className={`rec-card ${rec.category.toLowerCase()}`}>
              <div className="rec-icon">{rec.icon}</div>
              <div className="rec-details">
                <div className="rec-meta">
                  <span className={`badge category`}>{rec.category}</span>
                  <span className={`badge impact ${rec.impact.toLowerCase()}`}>
                    {rec.impact} Impact
                  </span>
                </div>
                <h3>{rec.title}</h3>
                <p>{rec.description}</p>
                <button className="action-btn">Mark as Planned</button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}