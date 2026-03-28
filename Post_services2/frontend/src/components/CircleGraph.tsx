import React, { useEffect, useState } from "react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from "recharts";
import { useSelector } from "react-redux";
import axios from "axios";

// 1. Defined interfaces for strict type safety
interface ESGDataPoint {
  reporting_month: string;
  avg_value: number;
}

interface CircleGraphResponse {
  data: ESGDataPoint[];
  message?: string;
}

const CircleGraph: React.FC = () => {
  // Replace 'any' with RootState if you have your store typed
  const token = useSelector((state: any) => state.auth.token);
  
  const [metric, setMetric] = useState<string>("energy_kwh");
  const [data, setData] = useState<ESGDataPoint[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    // Define the async function inside the effect
    const fetchData = async () => {
      if (!token) return;

      try {
        setLoading(true);
        
        // Using Generics <CircleGraphResponse> tells Axios what the response looks like
        const response = await axios.get<CircleGraphResponse>(
          `http://localhost:5000/api/circle_esg/circle_graph?column=${metric}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        // Accessing response.data.data is now safe and typed
        setData(response.data.data || []);
      } catch (err) {
        console.error("Error fetching Circle ESG data:", err);
        setData([]);
      } finally {
        // This block always runs, fixing the 'finally' type error
        setLoading(false);
      }
    };

    fetchData();
  }, [metric, token]);

  return (
    <div style={{ padding: "20px", background: "#fff", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
      <h3 style={{ marginBottom: "15px", color: "#333" }}>Circle ESG Trend</h3>

      <div style={{ marginBottom: "20px" }}>
        <label htmlFor="metric-select" style={{ marginRight: "10px", fontWeight: "bold" }}>Metric:</label>
        <select 
          id="metric-select"
          value={metric} 
          onChange={(e) => setMetric(e.target.value)}
          style={{ padding: "6px 12px", borderRadius: "4px", border: "1px solid #ccc" }}
        >
          <option value="energy_kwh">Energy (kWh)</option>
          <option value="water_litres">Water (Liters)</option>
          <option value="fuel_litres">Fuel (Liters)</option>
          <option value="waste_kg">Waste (kg)</option>
        </select>
      </div>

      {loading ? (
        <div style={{ height: "300px", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <p>Loading graph data...</p>
        </div>
      ) : data.length === 0 ? (
        <div style={{ height: "300px", display: "flex", alignItems: "center", justifyContent: "center", border: "1px dashed #ddd" }}>
          <p>No data available for the selected metric.</p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
            <XAxis 
              dataKey="reporting_month" 
              tick={{ fontSize: 12, fill: "#666" }} 
              dy={10}
            />
            <YAxis 
              tick={{ fontSize: 12, fill: "#666" }} 
            />
            <Tooltip 
              contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.15)" }}
            />
            <Line 
              type="monotone" 
              dataKey="avg_value" 
              stroke="#0088FE" 
              strokeWidth={3} 
              dot={{ r: 5, fill: "#0088FE", strokeWidth: 2, stroke: "#fff" }}
              activeDot={{ r: 8 }}
              animationDuration={1500}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default CircleGraph;