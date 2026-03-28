import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { dashboardApi } from "../api";
import Dashboard from "../components/monthdashboard";
import BranchGraph from "../components/BranchGraph";
import Header from "../components/Header";
import Navigation from "../components/Navigation";
import { Outlet } from "react-router-dom";
import "../style/branchdashboard.css";

interface DashboardData {
  branch_id: number;
  months: { name: string; submitted: boolean; value: string }[];
  year: number;
}

const BranchDashboard: React.FC = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const token = useSelector((state: any) => state.auth.token);
  const user = useSelector((state: any) => state.auth.user);

  useEffect(() => {
    const fetchData = async () => {
      if (!token) return;
      try {
        // Cast as 'any' or 'DashboardData' to resolve the 'unknown' error
        const result = await dashboardApi.getBranchDashboard(token) as any;
        setData(result as DashboardData);
      } catch (error) {
        console.error("Error loading division dashboard:", error);
      }
    };
    fetchData();
  }, [token]);

  if (!data) return <p className="loading-text">Loading...</p>;

  return (
    <>
      <div className="branch-dashboard">
        <Header />

        <nav className="main-navigation">
          <div className="nav-container">
            <button
              className="hamburger-menu"
              onClick={() => setIsNavOpen(!isNavOpen)}
            >
              ☰
            </button>
          </div>
        </nav>

        <div className="dashboard-content">
          <div className="welcome-section">
            <h2>Welcome, {user?.manager_name}</h2>
            <p>Last logged in on {new Date().toLocaleDateString()}</p>
          </div>

          <nav className="blue_header">
            <div className="nav-text">
              <h2> Branch Dashboard for {user?.manager_name}</h2>
            </div>
          </nav>

          <div className="fixed-sidebar">
            <Navigation isOpen={isNavOpen} onClose={() => setIsNavOpen(false)} />
          </div>

          <div className="dashboard-main">
            <div className="dashboard-right">
              <Dashboard months={data.months} year={data.year} />
              
              {/* Charts moved inside the layout */}
              <div className="charts-section" style={{ marginTop: '20px' }}>
                <BranchGraph />
              </div>

              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BranchDashboard;