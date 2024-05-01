import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import jsonData from "./Data/gooey_inferences.json";

// Define the interface for your JSON data
interface Inference {
  user_id: string;
  timestamp: string;
}

const RetentionChart: React.FC = () => {
  const [retentionData, setRetentionData] = useState<
    { month: string; retention: number }[]
  >([]);

  useEffect(() => {
    // Parse JSON data and calculate retention
    const parsedData: Inference[] = JSON.parse(JSON.stringify(jsonData)); // Parse JSON data
    const retentionByMonth = calculateRetention(parsedData);
    setRetentionData(retentionByMonth);
  }, []);

  const calculateRetention = (
    data: Inference[]
  ): { month: string; retention: number }[] => {
    // Group usage by month and user
    const groupedByMonth: { [key: string]: Set<string> } = {};
    data.forEach((inference) => {
      const month = inference.timestamp.substring(0, 7); // Extract month from timestamp
      if (!groupedByMonth[month]) {
        groupedByMonth[month] = new Set();
      }
      groupedByMonth[month].add(inference.user_id);
    });

    // Calculate retention for each month
    const months = Object.keys(groupedByMonth).sort();
    const retentionRates = months.map((month, index) => {
      const currentMonthUsers = groupedByMonth[month];
      const previousMonth = index > 0 ? months[index - 1] : null;
      const previousMonthUsers = previousMonth
        ? groupedByMonth[previousMonth]
        : new Set();

      const retainedUsers = Array.from(previousMonthUsers).filter((user) =>
        currentMonthUsers.has(user)
      );
      const retentionRate =
        (retainedUsers.length / previousMonthUsers.size) * 100 || 0;

      return { month, retention: retentionRate };
    });

    return retentionRates;
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        height: "100vh",
        width: "100%",
      }}
    >
      <h2>Retention Chart</h2>
      <LineChart width={1000} height={400} data={retentionData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line dataKey="retention" stroke="#8884d8" />
      </LineChart>
    </div>
  );
};

export default RetentionChart;
