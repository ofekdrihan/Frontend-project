// Importing necessary modules from React and MUI (Material UI)
import React, { useState, useEffect } from 'react'; // Importing React and hooks (useState, useEffect)
import { Paper, Box, Typography } from '@mui/material'; // Importing MUI components for layout and styling
import { DatePicker } from '@mui/x-date-pickers'; // Importing DatePicker component for selecting a date
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'; // Importing recharts components for chart rendering
import { CostManagerDB } from '../idb'; // Importing the CostManagerDB class to interact with IndexedDB

// Defining the color palette for the pie chart segments
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

// CostChart functional component
const CostChart = () => {
  // State for storing the selected date for the chart (defaults to the current date)
  const [selectedDate, setSelectedDate] = useState(new Date());
  // State for storing the chart data that will be rendered
  const [chartData, setChartData] = useState([]);

  // useEffect hook to fetch chart data when the selectedDate changes
  useEffect(() => {
    // Asynchronous function to fetch data and process it for the chart
    const fetchChartData = async () => {
      // Create a new instance of CostManagerDB to interact with the database
      const db = new CostManagerDB();
      try {
        // Extract the year and month from the selectedDate
        const year = selectedDate.getFullYear();
        const month = selectedDate.getMonth() + 1; // Month is 0-indexed, so adding 1
        // Fetch the costs for the selected month from the database
        const costs = await db.getCostsByMonth(year, month);

        // Process the costs to group them by category and sum the costs
        const categoryTotals = costs.reduce((acc, cost) => {
          acc[cost.category] = (acc[cost.category] || 0) + Number(cost.sum);
          return acc; // Accumulating the totals for each category
        }, {});

        // Format the data for the pie chart
        const data = Object.entries(categoryTotals).map(([category, value]) => ({
          name: category, // Category name (label for the pie slice)
          value, // Total cost for the category (value for the pie slice)
        }));

        // Set the processed data to the chartData state
        setChartData(data);
      } catch (error) {
        // Handle errors if the data fetch fails
        console.error('Error fetching chart data:', error);
      }
    };

    // Call the fetchChartData function whenever the selectedDate changes
    fetchChartData();
  }, [selectedDate]); // Dependency array to run the effect when selectedDate changes

  return (
    <Paper sx={{ p: 3 }}> {/* MUI Paper component to wrap the content with padding */}
      <Typography variant="h6" gutterBottom> {/* Title of the chart */}
        Monthly Costs by Category
      </Typography>

      {/* Box component to wrap the DatePicker with some margin-bottom */}
      <Box sx={{ mb: 3 }}>
        <DatePicker
          label="Select Month" // Label for the date picker
          value={selectedDate} // Binding the selected date to state
          onChange={setSelectedDate} // Updating the selected date when it changes
          views={['year', 'month']} // Allowing selection of year and month
          sx={{ width: '100%' }} // Styling the date picker to take full width
        />
      </Box>

      {/* Box to contain the pie chart */}
      <Box sx={{ height: 400 }}>
        <ResponsiveContainer width="100%" height="100%"> {/* Responsive container for the chart */}
          <PieChart> {/* Pie chart component */}
            <Pie
              data={chartData} // Data for the pie chart
              dataKey="value" // Key for the data's value (used for chart size)
              nameKey="name" // Key for the data's name (used for chart labels)
              cx="50%" // Centering the pie chart horizontally
              cy="50%" // Centering the pie chart vertically
              outerRadius={150} // Setting the outer radius of the pie chart
              label // Enabling labels for pie slices
            >
              {/* Iterating over chartData to color each slice of the pie */}
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} /> /* Assigning a color to each slice */
              ))}
            </Pie>
            <Tooltip /> {/* Tooltip to show on hover */}
            <Legend /> {/* Legend to show the category names */}
          </PieChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
};

// Exporting the CostChart component for use in other parts of the application
export default CostChart;
