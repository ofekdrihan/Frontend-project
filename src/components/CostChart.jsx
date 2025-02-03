import React, { useState, useEffect } from 'react';
import { Paper, Box, Typography } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { CostManagerDB } from '../idb';

// Predefined colors for the pie chart segments
const colors = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

/**
 * CostChart Component
 * Displays a pie chart representing monthly expenses categorized by type.
 * Users can select a month to view relevant cost data.
 *
 * @param {boolean} costsUpdated - A dependency that triggers data refresh when costs change.
 */
const CostChart = ({ costsUpdated }) => {
  // State to manage the selected date
  const [selectedDate, setSelectedDate] = useState(new Date());
  // State to hold the processed chart data
  const [chartData, setChartData] = useState([]);

  /**
   * Fetch and process cost data from the IndexedDB database when the date or costsUpdated changes.
   */
  useEffect(() => {
    const fetchChartData = async () => {
      const db = new CostManagerDB(); // Initialize the IndexedDB connection
      try {
        const year = selectedDate.getFullYear(); // Get the selected year
        const month = selectedDate.getMonth() + 1; // Get the selected month (months are 0-based)
        const costs = await db.getCostsByMonth(year, month); // Retrieve costs for the selected month

        // Aggregate costs by category
        const categoryTotals = costs.reduce((acc, cost) => {
          acc[cost.category] = (acc[cost.category] || 0) + Number(cost.sum);
          return acc;
        }, {});

        // Transform aggregated data into recharts-compatible format
        const data = Object.entries(categoryTotals).map(([category, value]) => ({
          name: category,
          value,
        }));

        setChartData(data); // Update state with formatted data
      } catch (error) {
        console.error('Error fetching chart data:', error); // Log errors if fetching fails
      }
    };

    fetchChartData(); // Invoke the data fetching function
  }, [costsUpdated, selectedDate]); // Re-run when selectedDate or costsUpdated changes

  return (
    <Paper sx={{ p: 3 }}>
      {/* Header Title */}
      <Typography variant="h6" gutterBottom>
        Monthly Costs by Category
      </Typography>

      {/* Date Picker for Selecting Month */}
      <Box sx={{ mb: 3 }}>
        <DatePicker
          label="Select Month"
          value={selectedDate}
          onChange={setSelectedDate}
          views={['year', 'month']}
          sx={{ width: '100%' }}
        />
      </Box>

      {/* Pie Chart Display */}
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
                <Cell key={index} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            <Legend /> {/* Displays category labels */}
            <Tooltip /> {/* Shows cost details on hover */}
          </PieChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
};

export default CostChart;