import React, { useState, useEffect } from 'react';
import { Paper, Stack, Typography, Box } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { CostManagerDB } from '../idb';

// Array to define color scheme for chart segments
const colors = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

/**
 * CostChart component displays a pie chart representing monthly costs by category.
 * It also allows the user to select a specific month and view the distribution of costs.
 * 
 * @param {Object} props - The props object passed to the component.
 * @param {boolean} props.costsUpdated - A flag indicating whether costs data has been updated.
 * 
 * @returns {JSX.Element} The rendered pie chart component.
 */
const CostChart = ({ costsUpdated }) => {
  // State to manage the selected date (month/year)
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  // State to hold the processed chart data (categories and their total costs)
  const [chartData, setChartData] = useState([]);

  /**
   * Effect hook that runs when either the selectedDate or costsUpdated props change.
   * It fetches the costs for the selected month and processes them to display in the chart.
   */
  useEffect(() => {
    const fetchChartData = async () => {
      // Initialize IndexedDB utility to retrieve cost data
      const db = new CostManagerDB();

      try {
        // Get the year and month from the selected date
        const year = selectedDate.getFullYear();
        const month = selectedDate.getMonth() + 1; // Months are zero-based in JavaScript

        // Fetch the costs for the selected month from IndexedDB
        const costs = await db.getCostsByMonth(year, month);

        // Calculate the total costs per category by reducing the fetched costs array
        const categoryTotals = costs.reduce((acc, cost) => {
          acc[cost.category] = (acc[cost.category] || 0) + Number(cost.sum); // Sum the costs by category
          return acc;
        }, {});

        // Prepare data for the chart by transforming category totals into an array of objects
        const data = Object.entries(categoryTotals).map(([category, value]) => ({
          name: category,
          value: Number(value.toFixed(2)), // Round to two decimal places
        }));

        // Set the chart data to trigger a re-render
        setChartData(data);
      } catch (error) {
        // Log any errors that occur during data fetching
        console.error('Error fetching chart data:', error);
      }
    };

    // Call the function to fetch the chart data whenever the date or costs are updated
    fetchChartData();
  }, [costsUpdated, selectedDate]);

  return (
    <Paper sx={{ p: 3 }}>
      <Stack spacing={3}>
        {/* Title of the chart */}
        <Typography variant="h6">
          Monthly Costs by Category
        </Typography>

        {/* DatePicker component to select the month */}
        <DatePicker
          label="Select Month"
          value={selectedDate}
          onChange={setSelectedDate} // Update the selected date
          views={['year', 'month']} // Allow selection of year and month
          slotProps={{
            textField: {
              fullWidth: true // Make the text field full width
            }
          }}
        />

        {/* Container for the pie chart */}
        <Box sx={{ height: 400, width: '100%' }}>
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={chartData} // Data for the pie chart
                dataKey="value" // The value field to determine the size of each segment
                nameKey="name" // The name field to label each segment
                cx="50%" // Center the chart horizontally
                cy="50%" // Center the chart vertically
                outerRadius={150} // Set the outer radius of the pie chart
                label={({ name, percent }) => 
                  `${name} ${(percent * 100).toFixed(0)}%` // Format label to show category name and percentage
                }
              >
                {/* Map through chartData to render a Cell (pie slice) for each category */}
                {chartData.map((entry, index) => (
                  <Cell key={index} fill={colors[index % colors.length]} /> // Use colors for the segments
                ))}
              </Pie>
              {/* Add legend on the right side */}
              <Legend layout="vertical" align="right" verticalAlign="middle" />
              {/* Tooltip to format the value displayed when hovering over segments */}
              <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
            </PieChart>
          </ResponsiveContainer>
        </Box>
      </Stack>
    </Paper>
  );
};

// Export the component for use in other parts of the app
export default CostChart;