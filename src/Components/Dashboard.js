import React from 'react';
import { Card, CardContent, Typography, Grid, Box } from '@mui/material';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { Bar, Doughnut } from 'react-chartjs-2';
import 'chart.js/auto';
import './CustomCalendar.css';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

const Dashboard = () => {
  const cards = [
    { title: 'Total Enquiry', value: 97, color: '#4A90E2' },
    { title: 'Number of enquiries Inprocess', value: 15, color: '#7ED321' },
    { title: 'Completed Enquiries', value: 8, color: '#F5A623' },
    { title: 'Pending enquiries for feasibility', value: 5, color: '#D0021B' },
  ];

  const cftEvents = {
    '2025-03-04': 'Project Kick-off',
    '2025-03-10': 'Budget Review',
    '2025-03-15': 'Design Discussion',
    '2025-03-17': 'CFT Meeting',
    '2025-03-24': 'Review Meeting',
    '2025-03-25': 'Sprint Retrospec',
  };

  const tableData = [
    { project: 'Website Redesign', supplier: 'ABC Agency', status: 'In Progress', details: 'UI revamp phase 1', deadline: 'May 15' },
    { project: 'Product Launch', supplier: 'XYZ Firm', status: 'Completed', details: 'Packaging finalized', deadline: 'April 30' },
    { project: 'ERP Integration', supplier: 'Tech Solutions', status: 'Delayed', details: 'Backend issues', deadline: 'May 5' },
    { project: 'Mobile App Development', supplier: 'Global Services', status: 'On Hold', details: 'Client feedback pending', deadline: 'June 10' },
  ];

  const barData = {
    labels: ['T0', 'T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8'],
    datasets: [
      {
        label: 'Rejected',
        data: [2, 3, 4, 0, 1, 0, 2, 1, 0],
        backgroundColor: '#FF4444',
        barPercentage: 0.8,
      },
      {
        label: 'Produced',
        data: [10, 14, 10, 82, 144, 152, 160, 165, 170],
        backgroundColor: '#4CAF50',
        barPercentage: 0.8,
      },
      {
        label: 'Target',
        data: [200, 200, 200, 200, 200, 200, 200, 200, 200],
        type: 'line',
        borderColor: '#2196F3',
        backgroundColor: 'rgba(33, 150, 243, 0.1)',
        borderWidth: 2,
        pointRadius: 0,
        fill: true,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    scales: {
      x: {
        stacked: false,
        grid: {
          display: false,
        },
      },
      y: {
        stacked: false,
        beginAtZero: true,
        max: 250,
        ticks: {
          stepSize: 50,
        },
        grid: {
          color: '#E0E0E0',
        },
      },
    },
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          usePointStyle: true,
          padding: 20,
        },
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      },
    },
  };

  const doughnutData = {
    labels: ['Tool A', 'Tool B', 'Tool D', 'Tool C', 'Tool E'],
    datasets: [
      {
        data: [25, 24, 20, 18, 13],
        backgroundColor: ['#22c55e', '#0ea5e9', '#f97316', '#eab308', '#1f2937'],
        borderWidth: 2,
        borderColor: '#fff',
        hoverOffset: 6,
      }
    ]
  };

  const doughnutOptions = {
    responsive: true,
    cutout: '60%',
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 14,
          },
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => `${context.label}: ${context.raw}%`
        }
      },
      datalabels: {
        color: '#fff',
        font: {
          weight: 'bold',
          size: 14,
        },
        formatter: (value) => `${value}%`,
      },
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'In Progress': return 'green';
      case 'Completed': return 'orange';
      case 'Delayed': return 'red';
      case 'On Hold': return 'blue';
      default: return 'black';
    }
  };

  const tileContent = ({ date, view }) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateString = `${year}-${month}-${day}`;

    if (view === 'month' && cftEvents[dateString]) {
      return (
        <div className="custom-event">
          <div className="calendar-icon">📅</div>
          <div className="event-name">{cftEvents[dateString]}</div>
        </div>
      );
    }
    return null;
  };

  return (
    <Box sx={{ p: 4 }}>
      <Grid container spacing={4}>
        {cards.map((card, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card sx={{ backgroundColor: card.color, color: 'white', height: 120, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="subtitle1">{card.title}</Typography>
                <Typography variant="h4">{card.value}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3} sx={{ mt: 4 }}>
        <Grid item xs={12} md={4}>
          <Calendar
            tileContent={tileContent}
            value={new Date(2025, 2, 27)}
          />
        </Grid>

        <Grid item xs={12} md={8}>
          <Typography variant="h6" gutterBottom>Ongoing Enquiries</Typography>
          <Box sx={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ backgroundColor: '#f5f5f5' }}>
                <tr>
                  <th style={{ padding: '8px', textAlign: 'left' }}>Enquiries</th>
                  <th style={{ padding: '8px', textAlign: 'left' }}>Supplier/ToolMaker</th>
                  <th style={{ padding: '8px', textAlign: 'left' }}>Status</th>
                  <th style={{ padding: '8px', textAlign: 'left' }}>Details</th>
                  <th style={{ padding: '8px', textAlign: 'left' }}>Deadline</th>
                  <th style={{ padding: '8px', textAlign: 'left' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {tableData.map((row, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #ddd' }}>
                    <td style={{ padding: '8px', textAlign: 'left' }}>{row.project}</td>
                    <td style={{ padding: '8px', textAlign: 'left' }}>{row.supplier}</td>
                    <td style={{ padding: '8px', textAlign: 'left', color: getStatusColor(row.status) }}>{row.status}</td>
                    <td style={{ padding: '8px', textAlign: 'left' }}>{row.details}</td>
                    <td style={{ padding: '8px', textAlign: 'left' }}>{row.deadline}</td>
                    <td style={{ padding: '8px', textAlign: 'left' }}>
                      <button style={{ backgroundColor: '#4A90E2', color: 'white', border: 'none', padding: '5px 10px', cursor: 'pointer' }}>View</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Box>
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mt: 4 }}>
        <Grid item xs={12} md={7}>
          <Box sx={{ p: 2, backgroundColor: 'white', borderRadius: 1, boxShadow: 1 }}>
            <Typography variant="h6" gutterBottom>Production Tools Report</Typography>
            <Bar data={barData} options={barOptions} />
          </Box>
        </Grid>

        <Grid item xs={12} md={5}>
          <Box sx={{
            p: 2,
            backgroundColor: 'white',
            borderRadius: 1,
            boxShadow: 1,
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
          }}>
            <Typography variant="h6" sx={{ mb: 2, textAlign: 'center', width: '100%' }}>
              Revenue per Tool
            </Typography>

            <Box
              sx={{
                flexGrow: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Box sx={{ width: '100%', maxWidth: 300 }}>
                <Doughnut data={doughnutData} options={doughnutOptions} />
              </Box>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
