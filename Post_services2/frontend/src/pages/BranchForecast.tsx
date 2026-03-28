import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { forecastApi } from "../api";
import { RootState } from "../store";
import Header from "../components/Header";
import Navigation from "../components/Navigation";
import { 
  ComposedChart, Line, Area, XAxis, YAxis, Tooltip, 
  CartesianGrid, ResponsiveContainer, Legend 
} from "recharts";
import { Zap, Droplets, Fuel, FileText, Trash2 } from "lucide-react";
import "../style/forecast.css";

const BranchForecast: React.FC = () => {
  const token = useSelector((state: RootState) => state.auth.token);
  const user = useSelector((state: RootState) => state.auth.user);
  
  const [data, setData] = useState<any[]>([]);
  const [metric, setMetric] = useState<string>("energy_kwh");
  const [loading, setLoading] = useState<boolean>(false);

  const metrics = [
    { id: "energy_kwh", label: "Energy", icon: <Zap size={16} /> },
    { id: "water_litres", label: "Water", icon: <Droplets size={16} /> },
    { id: "fuel_litres", label: "Fuel", icon: <Fuel size={16} /> },
    { id: "paper_reams", label: "Paper", icon: <FileText size={16} /> },
    { id: "waste_kg", label: "Waste", icon: <Trash2 size={16} /> }
  ];

  useEffect(() => {
    const fetchForecast = async () => {
      if (!token) return;
      try {
        setLoading(true);
        const res = await forecastApi.getBranchForecast(token, metric, 12) as any;
        
        const formattedData = res.forecast.map((item: any) => ({
          ...item,
          month: new Date(item.month).toLocaleString('default', { month: 'short', year: 'numeric' }),
        }));
        setData(formattedData);
      } catch (error) {
        console.error("Forecast Error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchForecast();
  }, [token, metric]);

  return (
    <div className="dashboard-page">
      <Header />
      <div className="layout-container">
        <aside className="sidebar-section">
          <Navigation isOpen={true} onClose={() => {}} />
        </aside>

        <main className="forecast-content-area">
          <div className="content-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h2 style={{ color: '#003366', margin: 0 }}>BRANCH ESG FORECAST</h2>
                <p style={{ color: '#666', fontSize: '14px', marginTop: '5px' }}>
                  2026 Predictive Analytics for <span style={{ color: '#C3202E', fontWeight: 'bold' }}>{user?.branch_name || "Branch A1"}</span>
                </p>
              </div>
              <div style={{ padding: '8px 15px', background: '#f8f9fa', borderRadius: '5px', border: '1px solid #ddd', fontWeight: 'bold' }}>
                YEAR: 2026
              </div>
            </div>

            <div className="metric-tabs" style={{ display: 'flex', gap: '10px', marginTop: '20px', borderBottom: '1px solid #eee', paddingBottom: '15px' }}>
              {metrics.map(m => (
                <button 
                  key={m.id} 
                  className={`tab-link ${metric === m.id ? 'active' : ''}`}
                  onClick={() => setMetric(m.id)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px',
                    borderRadius: '25px', border: '1px solid #ddd', cursor: 'pointer',
                    background: metric === m.id ? '#C3202E' : 'white',
                    color: metric === m.id ? 'white' : '#555',
                  }}
                >
                  {m.icon} {m.label}
                </button>
              ))}
            </div>

            <div style={{ marginTop: '30px', height: '450px', position: 'relative' }}>
              {loading ? (
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                  <div className="spinner" style={{ width: '40px', height: '40px', border: '4px solid #f3f3f3', borderTop: '4px solid #C3202E', borderRadius: '50%' }}></div>
                  <h4 style={{ marginTop: '20px', color: '#003366' }}>Generating Predictive Model...</h4>
                  <p style={{ color: '#888', fontSize: '12px' }}>This will be much faster on the next visit thanks to model caching.</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} dy={10} />
                    <YAxis axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 5px 15px rgba(0,0,0,0.1)' }} />
                    <Legend verticalAlign="top" align="right" height={40} />
                    <Area type="monotone" dataKey="upper" fill="#C3202E" fillOpacity={0.05} stroke="none" />
                    <Area type="monotone" dataKey="lower" fill="#C3202E" fillOpacity={0.05} stroke="none" />
                    <Line name="Predicted" type="monotone" dataKey="predicted" stroke="#C3202E" strokeWidth={4} dot={{ r: 6, fill: '#C3202E', strokeWidth: 2, stroke: '#fff' }} />
                  </ComposedChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default BranchForecast;