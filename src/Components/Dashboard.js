import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  ArcElement,
} from "chart.js";
import { PieChart, Pie, Cell, Tooltip as RechartsTooltip, Legend } from "recharts";
 
import 'react-calendar/dist/Calendar.css'; 
import './Dashboard.css'; 


ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, ArcElement);

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const dummyData = {
  January: [10, 5, 2, 8, 15, 20, 3],
  February: [12, 6, 3, 10, 18, 25, 5],
  March: [15, 8, 5, 12, 20, 30, 7],
  April: [20, 10, 4, 15, 25, 35, 10],
  May: [25, 12, 6, 20, 30, 40, 15],
  June: [30, 15, 8, 25, 35, 45, 20],
  July: [35, 18, 10, 30, 40, 50, 25],
  August: [40, 20, 12, 35, 45, 55, 30],
  September: [45, 22, 14, 40, 50, 60, 35],
  October: [50, 25, 16, 45, 55, 65, 40],
  November: [55, 28, 18, 50, 60, 70, 45],
  December: [60, 30, 20, 55, 65, 75, 50],
};

const productionData = {
  "Tool A": { production: 400, rejection: 50 },
  "Tool B": { production: 350, rejection: 80 },
  "Tool C": { production: 500, rejection: 30 },
};

const requestDataMapping = {
  January: [
    { name: "Total Requests", value: 100 },
    { name: "New Requests", value: 40 },
    { name: "Pending Requests", value: 30 },
  ],
  February: [
    { name: "Total Requests", value: 120 },
    { name: "New Requests", value: 50 },
    { name: "Pending Requests", value: 20 },
  ],
  March: [
    { name: "Total Requests", value: 90 },
    { name: "New Requests", value: 30 },
    { name: "Pending Requests", value: 25 },
  ],

};

const COLORS = ["#0088FE", "#00C49F", "#FFBB28"];



const Dashboard = () => {
  const [currentMonthIndex, setCurrentMonthIndex] = useState(new Date().getMonth());
  const [selectedMonth, setSelectedMonth] = useState(months[currentMonthIndex]);
  const [selectedTool, setSelectedTool] = useState("Tool A");
  const [requestData, setRequestData] = useState(requestDataMapping[selectedMonth] || []);
  const [date, setDate] = useState(new Date());
  const [hoveredDate, setHoveredDate] = useState(null);

  useEffect(() => {
    setSelectedMonth(months[currentMonthIndex]);
    setRequestData(requestDataMapping[months[currentMonthIndex]] || []);
  }, [currentMonthIndex]);

  const data = dummyData[selectedMonth];

  const totalEnquiryGenerated = data.reduce((sum, value) => sum + value, 0);
  const noOfEnquiries = data[0];
  const completedEnquiries = data[1];
  const pendingEnquiries = data[2];

  const handleMonthChange = (event) => {
    const monthIndex = months.indexOf(event.target.value);
    setCurrentMonthIndex(monthIndex);
    setRequestData(requestDataMapping[event.target.value] || []);
  };

  const handleToolChange = (event) => {
    setSelectedTool(event.target.value);
  };

  const chartData = {
    labels: [
      "Enquiry Generated",
      "Feasible Enquiry",
      "Not Feasible Enquiry",
      "Quotation Received from Toolmaker",
      "Quotation Sent to Customer",
      "Under Development",
    ],
    datasets: [
      {
        label: selectedMonth,
        data: data,
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  const pieChartData = [
    { name: "Production", value: productionData[selectedTool].production },
    { name: "Rejection", value: productionData[selectedTool].rejection },
  ];


  const dualAxisData = {
    labels: ["Toolmaker 1", "Toolmaker 2", "Toolmaker 3"],
    datasets: [
      {
        label: "Total Orders",
        data: [30, 40, 20], // Example data for orders given
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        yAxisID: 'y',
      },
      {
        label: "Orders Approved",
        data: [20, 30, 10], // Example data for orders approved
        backgroundColor: "rgba(255, 206, 86, 0.6)",
        yAxisID: 'y1',
      },
      {
        label: "Invoices Raised",
        data: [10, 10, 10], // Example data for pending orders
        backgroundColor: "rgba(255, 99, 132, 0.6)",
        yAxisID: 'y1',
      },
    ],
  };

  const dualAxisOptions = {
    responsive: true,
    scales: {
      y: {
        type: 'linear',
        position: 'left',
      },
      y1: {
        type: 'linear',
        position: 'right',
        grid: {
          drawOnChartArea: false, // only want the grid lines for one axis to show up
        },
      },
    },
    plugins: {
      legend: {
        display: true,
      },
    },
  };
  const meetings = [
    { date: new Date(2025, 2, 3), name: 'Project Kick-off', time: '10:00 AM' },
    { date: new Date(2025, 2, 10), name: 'Budget Review', time: '2:00 PM' },
    { date: new Date(2025, 2, 15), name: 'Design Discussion', time: '1:00 PM' },
    { date: new Date(2025, 2, 25), name: 'Sprint Retrospective', time: '4:00 PM' },
  ];


  const currentYear = new Date().getFullYear();


  const firstDayOfMonth = new Date(currentYear, selectedMonth, 1);
  const lastDayOfMonth = new Date(currentYear, selectedMonth + 1, 0);
  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      {/* Month Selection at the Top */}
      <div style={{ textAlign: "left", marginBottom: "20px" }}>
        <h1 style={{ fontSize: "24px", marginBottom: "10px" }}>
          {months[selectedMonth]}
        </h1>
        <select
          value={months[selectedMonth]}
          onChange={handleMonthChange}
          style={{ padding: "8px", fontSize: "16px", borderRadius: "5px" }}
        >
          {months.map((month, index) => (
            <option key={index} value={month}>
              {month}
            </option>
          ))}
        </select>
      </div>

      {/* KPIs Section */}
      <div style={{ display: "flex", justifyContent: "space-around", marginBottom: "20px" }}>
        {[
          { title: "Total enquiry", value: totalEnquiryGenerated, color: "#3498db" },
          { title: "Number of enquiries Inprocess", value: noOfEnquiries, color: "#2ecc71" },
          { title: "Completed Enquiries", value: completedEnquiries, color: "#f1c40f" },
          { title: "Pending enquiries for feasibility", value: pendingEnquiries, color: "#e74c3c" },
        ].map((item, index) => (
          <div
            key={index}
            style={{
              background: item.color,
              color: "#fff",
              padding: "15px 20px",
              borderRadius: "8px",
              textAlign: "center",
              width: "200px",
              boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
            }}
          >
            <h3 style={{ margin: 0, fontSize: "16px" }}>{item.title}</h3>
            <h2 style={{ margin: "5px 0", fontSize: "22px" }}>{item.value}</h2>
          </div>
        ))}
      </div>

      {/* Main Dashboard Section */}
      <div style={{ display: "flex", gap: "20px" }}>
        {/* Bar Chart Section */}
        <div
          style={{
            padding: "20px",
            textAlign: "left",
            width: "600px",
            borderRadius: "10px",
            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
            background: "#f9f9f9",
          }}
        >
          <div
            style={{
              width: "540px",
              height: "500px",
              marginTop: "20px",
              padding: "10px",
              background: "#fff",
              borderRadius: "8px",
            }}
          >
            <Bar data={chartData} options={chartOptions} />

          </div>
        </ div>

        {/* Pie Chart Section */}
        <div
          style={{
            padding: "20px",
            width: "500px",
            borderRadius: "10px",
            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
            background: "#fff",
          }}
        >
          <h2 style={{ fontSize: "18px", textAlign: "center", marginBottom: "10px" }}>
            Production vs Rejection
          </h2>

          <select
            value={selectedTool}
            onChange={handleToolChange}
            style={{ width: "100%", padding: "5px", fontSize: "14px", marginBottom: "10px" }}
          >
            {Object.keys(productionData).map((tool) => (
              <option key={tool} value={tool}>
                {tool}
              </option>
            ))}
          </select>

          <PieChart width={400} height={300}>
            <Pie data={pieChartData} cx="50%" cy="50%" innerRadius={80} outerRadius={130} label>
              {pieChartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index]} />
              ))}
            </Pie>
            <RechartsTooltip />
            <Legend />
          </PieChart>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "20px", 
          padding: "20px",
        }}
      >
        <div
          style={{
            padding: "20px",
            textAlign: "left",
            width: "690px",
            borderRadius: "10px",
            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
            background: "#f9f9f9",
          }}
        >
          <div
            style={{
              width: "650px",
              height: "380px",
              marginTop: "20px",
              padding: "10px",
              background: "#fff",
              borderRadius: "8px",
            }}
          >
            <Bar data={dualAxisData} options={dualAxisOptions} />
            <h1 style={{ fontSize: "20px", marginBottom: "10px", textAlign: "center" }}>
              Toolmaker Process Status
            </h1>
          </div>
        </div>

        {/* <div style={{ marginBottom: "10px", flexShrink: 0 }}>
          <Calendar
            onChange={setDate}
            value={date}
            minDate={firstDayOfMonth} 
            maxDate={lastDayOfMonth}
            tileContent={({ date, view }) => {
              const meeting = meetings.find(
                (meeting) => meeting.date.toDateString() === date.toDateString()
              );

              return meeting ? (
                <div style={{ fontSize: "10px", color: "red", textAlign: "center" }}>
                  📅 {meeting.name}
                </div>
              ) : null;
            }}
            tileClassName={({ date, view }) => {
              return date.getDay() === 0 ? "sunday-black" : "";
            }}
            className="custom-calendar"
            style={{ border: "1px solid #ccc", borderRadius: "8px" }}
          />
        </div> */}

      </div>


    </div>
  );
};

export default Dashboard;