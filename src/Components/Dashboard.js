import React, { useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  ArcElement,
  Legend as ChartLegend,
} from "chart.js";
import { PieChart, Pie, Cell, Tooltip as RechartsTooltip, Legend } from "recharts";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, ArcElement, ChartLegend);

const COLORS = ["#3b82f6", "#60a5fa", "#93c5fd"];

const meetings = [
  { date: new Date(2025, 3, 20), name: "Design Review" },
  { date: new Date(2025, 3, 25), name: "Final Approval" },
];

const Dashboard = () => {
  const [date, setDate] = useState(new Date());

  return (
    <div className="p-6 font-sans bg-gray-50 min-h-screen">
      
      {/* === Master Cards === */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 my-6">
        {[
          { title: "Total Enquiries", value: 120, color: "bg-blue-500" },
          { title: "In Process", value: 45, color: "bg-blue-400" },
          { title: "Completed", value: 50, color: "bg-blue-300" },
          { title: "Pending Feasibility", value: 25, color: "bg-blue-200" },
        ].map((card, i) => (
          <div key={i} className={`${card.color} text-white p-6 rounded-xl shadow-md`}>
            <h3 className="text-sm font-medium">{card.title}</h3>
            <p className="text-2xl font-bold mt-1">{card.value}</p>
          </div>
        ))}
      </div>

      {/* === Calendar + Ongoing Enquiries === */}
      <div className="flex flex-col md:flex-row gap-6 my-6">
        
        {/* Calendar */}
        <div className="md:w-1/3 bg-white p-4 rounded-xl shadow">
          <h2 className="text-lg font-semibold mb-4 text-center text-blue-700">CFT Meetings</h2>
          <Calendar
            onChange={setDate}
            value={date}
            tileContent={({ date }) => {
              const meeting = meetings.find(
                (m) => m.date.toDateString() === date.toDateString()
              );
              return meeting ? (
                <div className="text-[10px] text-red-600 text-center">📅 {meeting.name}</div>
              ) : null;
            }}
          />
        </div>

        {/* Ongoing Enquiries Table */}
        <div className="md:w-2/3 bg-white p-4 rounded-xl shadow overflow-x-auto">
          <h2 className="text-lg font-semibold mb-4 text-blue-700">Ongoing Enquiries</h2>
          <div className="max-h-80 overflow-y-auto custom-scrollbar">
            <table className="w-full text-sm border border-gray-200">
              <thead className="bg-blue-100 text-blue-800 sticky top-0">
                <tr>
                  <th className="p-2 border">Enquiry</th>
                  <th className="p-2 border">Supplier/Toolmaker</th>
                  <th className="p-2 border">Status</th>
                  <th className="p-2 border">Deadline</th>
                  <th className="p-2 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { id: "ENQ001", tool: "Toolmaker A", status: "In Process", deadline: "2025-04-20" },
                  { id: "ENQ002", tool: "Toolmaker B", status: "Pending", deadline: "2025-04-25" },
                  { id: "ENQ003", tool: "Toolmaker C", status: "Review", deadline: "2025-04-30" },
                  { id: "ENQ004", tool: "Toolmaker D", status: "Feasibility", deadline: "2025-05-05 "                },
                ].map((row, i) => (
                  <tr key={i} className="hover:bg-blue-50">
                    <td className="p-2 border">{row.id}</td>
                    <td className="p-2 border">{row.tool}</td>
                    <td className="p-2 border">{row.status}</td>
                    <td className="p-2 border">{row.deadline}</td>
                    <td className="p-2 border text-blue-600 cursor-pointer">View</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* === Testing Stages + Revenue Charts === */}
      <div className="flex flex-col md:flex-row gap-6 my-6">
        
        {/* Bar Chart - Testing Stages */}
        <div className="md:w-2/3 bg-white p-4 rounded-xl shadow">
          <h2 className="text-lg font-semibold text-center text-blue-700 mb-2">Testing Stage Distribution</h2>
          <Bar
            data={{
              labels: ["T0", "T1", "T2", "TFinal"],
              datasets: [
                {
                  label: "No. of Enquiries",
                  data: [5, 10, 7, 3],
                  backgroundColor: [
                    "rgba(59,130,246,0.8)",
                    "rgba(96,165,250,0.8)",
                    "rgba(147,197,253,0.8)",
                    "rgba(191,219,254,0.8)"
                  ],
                  borderRadius: 6,
                  barThickness: 30,
                }
              ],
            }}
            options={{
              responsive: true,
              plugins: { legend: { display: false } },
              scales: { y: { beginAtZero: true } },
            }}
          />
        </div>

        {/* Pie Chart - Revenue */}
        <div className="md:w-1/3 bg-white p-4 rounded-xl shadow">
          <h2 className="text-lg font-semibold text-center text-blue-700 mb-2">Revenue per Tool</h2>
          <PieChart width={300} height={250}>
            <Pie
              data={[
                { name: "Tool A", value: 200000 },
                { name: "Tool B", value: 150000 },
                { name: "Tool C", value: 180000 },
              ]}
              cx="50%"
              cy="50%"
              outerRadius={90}
              label
            >
              {COLORS.map((color, index) => (
                <Cell key={index} fill={color} />
              ))}
            </Pie>
            <RechartsTooltip />
            <Legend />
          </PieChart>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;