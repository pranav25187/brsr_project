import React, { useEffect, useState } from "react";
import { 
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid 
} from "recharts";
import { useSelector } from "react-redux";
import axios from "axios";

// 1. Define the data shape for Branch trends
interface BranchDataPoint {
  reporting_month: string;
  value: number;
}

interface BranchGraphResponse {
  data: BranchDataPoint[];
  message?: string;
}

const BranchGraph: React.FC = () => {
  // Use a proper RootState type here if available
  const token = useSelector((state: any) => state.auth.token);
  
  const [metric, setMetric] = useState<string>("energy_kwh");
  const [data, setData] = useState<BranchDataPoint[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchBranchData = async () => {
      if (!token) return;

      try {
        setLoading(true);
        // 2. Apply the interface to the axios call
        const response = await axios.get<BranchGraphResponse>(
          `http://localhost:5000/api/branch_esg/branch_graph?column=${metric}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        // TypeScript now knows response.data.data is BranchDataPoint[]
        setData(response.data.data || []);
      } catch (err) {
        console.error("Error fetching Branch ESG data:", err);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBranchData();
  }, [metric, token]);

  return (
    <div style={{ padding: "20px", background: "#fff", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
      <h3 style={{ marginBottom: "15px" }}>Branch ESG Trend</h3>

      <div style={{ marginBottom: "20px" }}>
        <select 
          value={metric} 
          onChange={(e) => setMetric(e.target.value)}
          style={{ padding: "6px 10px", borderRadius: "4px", border: "1px solid #ddd" }}
        >
          <option value="energy_kwh">Energy (kWh)</option>
          <option value="water_litres">Water (Liters)</option>
          <option value="fuel_litres">Fuel (Liters)</option>
          <option value="waste_kg">Waste (kg)</option>
        </select>
      </div>

      {loading ? (
        <div style={{ height: "300px", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <p>Loading branch data...</p>
        </div>
      ) : data.length === 0 ? (
        <div style={{ height: "300px", display: "flex", alignItems: "center", justifyContent: "center", border: "1px dashed #ccc" }}>
          <p>No data available</p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis 
              dataKey="reporting_month" 
              tick={{ fontSize: 12 }} 
              dy={10} 
            />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke="#ff7300" 
              strokeWidth={3} 
              dot={{ r: 4, fill: "#ff7300" }}
              activeDot={{ r: 7 }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default BranchGraph;