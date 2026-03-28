import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

interface ESGLineChartProps {
  data: any[];
  yKey: string;
  title: string;
}

const ESGLineChart: React.FC<ESGLineChartProps> = ({ data, yKey, title }) => {
  return (
    <div style={{ width: "100%", height: 350 }}>
      <h3 style={{ marginBottom: 10 }}>{title}</h3>

      <ResponsiveContainer>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="reporting_month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey={yKey}
            stroke="#00ffd4"
            strokeWidth={3}
            dot={{ r: 3 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ESGLineChart;
