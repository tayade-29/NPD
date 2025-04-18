import React from 'react';
import {
  Card, CardContent, Typography, Grid, Box
} from '@mui/material';
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
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement
} from 'chart.js';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  ChartDataLabels,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement
);

// Custom plugin for drawing arrows
const connectorsPlugin = {
  id: 'connectors',
  afterDraw: (chart) => {
    const ctx = chart.ctx;
    const meta = chart.getDatasetMeta(0);
    
    // Get chart dimensions
    const { chartArea } = chart;
    const centerX = (chartArea.left + chartArea.right) / 2;
    const centerY = (chartArea.top + chartArea.bottom) / 2;
    const radius = Math.min(chartArea.right - chartArea.left, chartArea.bottom - chartArea.top) / 2;
    
    meta.data.forEach((arc, i) => {
      // Calculate the angle in the middle of the arc
      const startAngle = arc.startAngle;
      const endAngle = arc.endAngle;
      const angle = startAngle + (endAngle - startAngle) / 2;
      
      // Calculate points for the connector line
      const arcPoint = {
        x: centerX + Math.cos(angle) * radius * 0.7,
        y: centerY + Math.sin(angle) * radius * 0.7
      };
      
      const labelRadius = radius * 1.3;
      const labelPoint = {
        x: centerX + Math.cos(angle) * labelRadius,
        y: centerY + Math.sin(angle) * labelRadius
      };
      
      // Draw connector line
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(arcPoint.x, arcPoint.y);
      ctx.lineTo(labelPoint.x, labelPoint.y);
      ctx.strokeStyle = chart.data.datasets[0].backgroundColor[i];
      ctx.lineWidth = 2;
      ctx.stroke();
      
      // Draw arrow head
      const headLength = 10;
      const angle2 = Math.atan2(labelPoint.y - arcPoint.y, labelPoint.x - arcPoint.x);
      
      ctx.beginPath();
      ctx.moveTo(labelPoint.x, labelPoint.y);
      ctx.lineTo(
        labelPoint.x - headLength * Math.cos(angle2 - Math.PI / 6),
        labelPoint.y - headLength * Math.sin(angle2 - Math.PI / 6)
      );
      ctx.lineTo(
        labelPoint.x - headLength * Math.cos(angle2 + Math.PI / 6),
        labelPoint.y - headLength * Math.sin(angle2 + Math.PI / 6)
      );
      ctx.closePath();
      ctx.fillStyle = chart.data.datasets[0].backgroundColor[i];
      ctx.fill();
      ctx.restore();
    });
  }
};

const Dashboard = () => {
  const cards = [
    { title: 'Total enquiry', value: 97, color: '#4A90E2' },
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
    labels: ['T0', 'T1', 'T2', 'T3'],
    datasets: [
      {
        label: 'Rejected',
        data: [3, 4, 0, 0],
        backgroundColor: (ctx) => {
          const gradient = ctx.chart.ctx.createLinearGradient(0, 0, 0, 300);
          gradient.addColorStop(0, '#ff6b6b');
          gradient.addColorStop(1, '#c53030');
          return gradient;
        },
        borderColor: '#96281B',
        borderWidth: 1,
        barThickness: 30,
        borderRadius: 6,
        borderSkipped: false,
        datalabels: {
          anchor: 'end',
          align: 'start',
          color: '#ff6b6b',
          font: { weight: 'bold', size: 10 }
        }
      },
      {
        label: 'Produced',
        data: [14, 10, 144, 152],
        backgroundColor: (ctx) => {
          const gradient = ctx.chart.ctx.createLinearGradient(0, 0, 0, 300);
          gradient.addColorStop(0, '#a3e635');
          gradient.addColorStop(1, '#65a30d');
          return gradient;
        },
        borderColor: '#4d7c0f',
        borderWidth: 1,
        barThickness: 30,
        borderRadius: 6,
        borderSkipped: false,
        datalabels: {
          anchor: 'end',
          align: 'start',
          color: '#4d7c0f',
          font: { weight: 'bold', size: 10 }
        }
      },
      {
        label: 'Target',
        data: [200, 200, 200, 200],
        type: 'line',
        borderColor: '#2563eb',
        borderWidth: 3,
        pointRadius: 5,
        pointBackgroundColor: '#2563eb',
        tension: 0.3,
        fill: false
      }
    ]
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12,
            weight: 'bold'
          }
        }
      },
      tooltip: {
        callbacks: {
          label: (context) => `${context.dataset.label}: ${context.raw}`
        },
        backgroundColor: 'rgba(0,0,0,0.8)',
        titleFont: { size: 14, weight: 'bold' },
        bodyFont: { size: 12 }
      },
      datalabels: { display: true }
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: {
          color: '#666',
          font: { weight: 'bold', size: 12 }
        }
      },
      y: {
        beginAtZero: true,
        max: 250,
        ticks: {
          stepSize: 50,
          color: '#666',
          font: { weight: 'bold', size: 12 }
        },
        grid: {
          color: '#E0E0E0',
          drawBorder: true,
          borderColor: '#E0E0E0',
          lineWidth: 1
        }
      }
    },
    elements: {
      bar: {
        borderSkipped: false
      }
    }
  };

  const doughnutData = {
    labels: ['Tool A', 'Tool B', 'Tool D', 'Tool C', 'Tool E'],
    datasets: [
      {
        data: [25, 24, 20, 18, 13],
        backgroundColor: ['#22c55e', '#0ea5e9', '#f97316', '#eab308', '#1f2937'],
        borderWidth: 5,
        borderColor: '#fff',
        hoverOffset: 6
      }
    ]
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '60%',
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          usePointStyle: true,
          padding: 50,
          font: { size: 14 }
        }
      },
      tooltip: {
        callbacks: {
          label: (context) => `${context.label}: ${context.raw}%`
        }
      },
      datalabels: {
        color: '#000',
        font: {
          weight: 'bold',
          size: 12
        },
        anchor: 'end',
        align: 'end',
        offset: 20,
        formatter: (value, context) => {
          const total = context.chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
          const percentage = ((value / total) * 100).toFixed(1);
          return `${percentage}%`;
        },
        borderColor: '#666',
        borderWidth: 2,
        borderRadius: 4,
        backgroundColor: '#fff',
        padding: 6,
        drawTime: 'afterDatasetsDraw'
      }
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
    const dateString = date.toISOString().split('T')[0];
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
        {cards.map((card, i) => (
          <Grid item xs={12} sm={6} md={3} key={i}>
            <Card sx={{ backgroundColor: card.color, color: 'white', height: 120, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 2, boxShadow: 3 }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>{card.title}</Typography>
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>{card.value}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3} sx={{ mt: 4 }}>
        <Grid item xs={12} md={4}>
          <Box sx={{ p: 2, backgroundColor: 'white', borderRadius: 2, boxShadow: 3, height: '100%' }}>
            <Calendar tileContent={tileContent} value={new Date(2025, 2, 27)} />
          </Box>
        </Grid>

        <Grid item xs={12} md={8}>
          <Box sx={{ p: 2, backgroundColor: 'white', borderRadius: 2, boxShadow: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>Ongoing Enquiries</Typography>
            <Box sx={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead style={{ backgroundColor: '#f5f5f5' }}>
                  <tr>
                    <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold' }}>Enquiries</th>
                    <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold' }}>Supplier/ToolMaker</th>
                    <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold' }}>Status</th>
                    <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold' }}>Details</th>
                    <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold' }}>Deadline</th>
                    <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {tableData.map((row, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid #ddd' }}>
                      <td style={{ padding: '12px' }}>{row.project}</td>
                      <td style={{ padding: '12px' }}>{row.supplier}</td>
                      <td style={{ padding: '12px', color: getStatusColor(row.status), fontWeight: 'bold' }}>{row.status}</td>
                      <td style={{ padding: '12px' }}>{row.details}</td>
                      <td style={{ padding: '12px', fontWeight: 'bold' }}>{row.deadline}</td>
                      <td style={{ padding: '12px' }}>
                        <button style={{ backgroundColor: '#4A90E2', color: 'white', border: 'none', padding: '8px 16px', cursor: 'pointer', borderRadius: 4, fontWeight: 'bold', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>View</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Box>
          </Box>
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mt: 4 }}>
        <Grid item xs={12} md={7}>
          <Box sx={{ p: 3, backgroundColor: 'white', borderRadius: 2, boxShadow: 3, position: 'relative' }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>Production Tools Report</Typography>
            <Box sx={{ position: 'relative', height: '400px' }}>
              <Bar data={barData} options={barOptions} plugins={[ChartDataLabels]} />
            </Box>
          </Box>
        </Grid>

        <Grid item xs={12} md={5}>
          <Box sx={{ p: 3, backgroundColor: 'white', borderRadius: 2, boxShadow: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', textAlign: 'center' }}>
              Revenue per Tool
            </Typography>
            <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', height: '' }}>
              <Doughnut data={doughnutData} options={doughnutOptions} plugins={[ChartDataLabels, connectorsPlugin]} />
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;