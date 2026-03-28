import React, { useEffect, useState } from "react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from "recharts";
// Import the Branch type directly from your API file
import { divisionDashboard, branchApi, Branch } from "../api"; 
import { useSelector } from "react-redux";

interface GraphDataPoint {
  month: string;
  value: number;
}

const DivisionGraph: React.FC = () => {
  const token = useSelector((state: any) => state.auth.token);

  const [metric, setMetric] = useState<string>("water_litres");
  // Change this to string | number to handle "all" vs numeric IDs
  const [branchId, setBranchId] = useState<string | number>("all");
  const [branches, setBranches] = useState<Branch[]>([]);
  const [data, setData] = useState<GraphDataPoint[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!token) return;

    branchApi.getBranchesList(token)
      .then(res => {
        // Use the imported Branch type from the API
        setBranches(res.branches || []);
      })
      .catch(err => console.error("Error fetching branches:", err));
  }, [token]);

  useEffect(() => {
    if (!token) return;

    setLoading(true);
    // Note: branchId will be stringified in the template literal anyway
    divisionDashboard.getGraph(token, `${metric}&branch_id=${branchId}`)
      .then((res: any) => {
        setData(Array.isArray(res) ? res : []);
      })
      .catch(() => setData([]))
      .finally(() => setLoading(false));
  }, [metric, branchId, token]);

  return (
    <div style={{ padding: "20px", background: "#fff", borderRadius: "8px" }}>
      <h3>Division ESG Trend</h3>

      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <select value={metric} onChange={e => setMetric(e.target.value)}>
          <option value="water_litres">Water</option>
          <option value="energy_kwh">Energy</option>
          <option value="fuel_litres">Fuel</option>
          <option value="waste_kg">Waste</option>
        </select>

        <select 
          value={branchId} 
          onChange={e => setBranchId(e.target.value)}
        >
          <option value="all">All Branches</option>
          {branches.map(b => (
            <option key={b.branch_id} value={b.branch_id}>
              {b.branch_code}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : data.length === 0 ? (
        <p>No data available</p>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="value" stroke="#00c49f" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default DivisionGraph;