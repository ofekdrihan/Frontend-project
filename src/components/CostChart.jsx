import React, { useState, useEffect } from 'react';
import { Paper, Box, Typography } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { CostManagerDB } from '../idb';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const CostChart = ({ costsUpdated }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchChartData = async () => {
      const db = new CostManagerDB();
      try {
        const year = selectedDate.getFullYear();
        const month = selectedDate.getMonth() + 1;
        const costs = await db.getCostsByMonth(year, month);

        const categoryTotals = costs.reduce((acc, cost) => {
          acc[cost.category] = (acc[cost.category] || 0) + Number(cost.sum);
          return acc;
        }, {});

        const data = Object.entries(categoryTotals).map(([category, value]) => ({
          name: category,
          value,
        }));

        setChartData(data);
      } catch (error) {
        console.error('Error fetching chart data:', error);
      }
    };

    fetchChartData();
  }, [costsUpdated, selectedDate]); // יש להפעיל מחדש גם כאשר costsUpdated משתנה

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Monthly Costs by Category
      </Typography>

      <Box sx={{ mb: 3 }}>
        <DatePicker
          label="Select Month"
          value={selectedDate}
          onChange={setSelectedDate}
          views={['year', 'month']}
          sx={{ width: '100%' }}
        />
      </Box>

      <Box sx={{ height: 400 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={150}
              label
            >
              {chartData.map((entry, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Legend />
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
};

export default CostChart;
