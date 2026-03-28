import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Header from "../components/Header";
import CircleSidebar from "../components/CircleSidebar";
import Circletable from "../pages/Circletable";
import CircleGraph from "../components/CircleGraph";
import { dashboardApi } from "../api";
import "../style/circledashboard.css";

interface CircleDashboardData {
  year: number;
  circle_id: number;
}

const CircleDashboard: React.FC = () => {
  const [data, setData] = useState<CircleDashboardData | null>(null);
  const token = useSelector((state: any) => state.auth.token);
  const user = useSelector((state: any) => state.auth.user);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await dashboardApi.getCircleDashboard(token);
        setData(result as CircleDashboardData);
      } catch (error) {
        console.error("Error loading circle dashboard:", error);
      }
    };
    fetchData();
  }, [token, user]);

  if (!data) return (
    <div className="dashboard-wrapper">
       <Header />
       <div className="loader-container">
          <div className="loader"></div>
          <p>Loading Circle Intelligence...</p>
       </div>
    </div>
  );

  return (
    <div className="dashboard-wrapper">
      <Header />
      
      <div className="main-container">
        <aside className="sidebar-area">
          <CircleSidebar />
        </aside>

        <main className="content-area">
          {/* Top Banner */}
          <header className="content-header">
            <div className="welcome-box">
              <h1>Circle Analytics: {user?.manager_name}</h1>
              <p>Performance Overview • {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
            </div>
          </header>

          <section className="dashboard-grid">
            {/* Graph Card */}
            <div className="card graph-card">
              <div className="card-header">
                <h3>ESG Consumption Trends</h3>
              </div>
              <div className="card-body">
                <CircleGraph />
              </div>
            </div>

            {/* Table Card */}
            <div className="card table-card">
              <div className="card-header">
                <h3>Detailed Branch Reports</h3>
              </div>
              <div className="card-body">
                <Circletable />
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default CircleDashboard;