// Importing necessary modules from React and MUI (Material UI)
import React, { useState, useEffect } from 'react'; // Importing React and hooks (useState, useEffect) for managing state and side effects
import {
  Paper, // MUI Paper component to wrap content
  Table, // MUI Table component for table layout
  TableBody, // MUI TableBody component for the table content
  TableCell, // MUI TableCell component for each cell inside the table
  TableContainer, // MUI TableContainer component to wrap the table
  TableHead, // MUI TableHead component to define column headers
  TableRow, // MUI TableRow component to represent each row of data
  Box, // MUI Box component for layout
  Typography, // MUI Typography component for text styling
} from '@mui/material'; // Importing various Material UI components
import { DatePicker } from '@mui/x-date-pickers'; // Importing DatePicker component for date selection
import { CostManagerDB } from '../idb'; // Importing CostManagerDB to interact with IndexedDB

// CostReport functional component
const CostReport = () => {
  // State for storing selected date (default to current date)
  const [selectedDate, setSelectedDate] = useState(new Date());
  // State for storing fetched cost data
  const [costs, setCosts] = useState([]);

  // useEffect hook to fetch cost data when selectedDate changes
  useEffect(() => {
    const fetchCosts = async () => {
      const db = new CostManagerDB(); // Create an instance of CostManagerDB to interact with IndexedDB
      try {
        // Extract the year and month from the selected date
        const year = selectedDate.getFullYear();
        const month = selectedDate.getMonth() + 1; // Months are zero-based, so add 1
        // Fetch costs from the IndexedDB for the selected month
        const monthCosts = await db.getCostsByMonth(year, month);
        // Update the costs state with the fetched data
        setCosts(monthCosts);
      } catch (error) {
        // Handle any error that occurs while fetching costs
        console.error('Error fetching costs:', error);
      }
    };

    fetchCosts(); // Call the fetchCosts function to get data when component mounts or when selectedDate changes
  }, [selectedDate]); // Dependency array, useEffect will run when selectedDate changes

  return (
    <Paper sx={{ p: 3, mb: 3 }}> {/* MUI Paper component for styling, with padding and margin-bottom */}
      <Typography variant="h6" gutterBottom> {/* MUI Typography component for title, variant 'h6' for header style */}
        Monthly Cost Report
      </Typography>
      
      <Box sx={{ mb: 3 }}> {/* MUI Box component for layout with margin-bottom */}
        <DatePicker
          label="Select Month" // Label for the DatePicker
          value={selectedDate} // Binding the value to selectedDate state
          onChange={setSelectedDate} // Update the selectedDate state when a new date is picked
          views={['year', 'month']} // Allow only year and month views in the date picker
          sx={{ width: '100%' }} // Making the date picker full width
        />
      </Box>
      
      {/* Table container to hold the table */}
      <TableContainer>
        <Table> {/* MUI Table component */}
          <TableHead> {/* MUI TableHead for the table column headers */}
            <TableRow> {/* MUI TableRow for a row of headers */}
              <TableCell>Date</TableCell> {/* MUI TableCell for the Date column */}
              <TableCell>Category</TableCell> {/* MUI TableCell for the Category column */}
              <TableCell>Description</TableCell> {/* MUI TableCell for the Description column */}
              <TableCell align="right">Sum</TableCell> {/* MUI TableCell for the Sum column, aligned to the right */}
            </TableRow>
          </TableHead>
          <TableBody> {/* MUI TableBody to hold the data rows */}
            {/* Looping over the fetched costs array and rendering each row */}
            {costs.map((cost) => (
              <TableRow key={cost.id}> {/* MUI TableRow for each cost entry */}
                <TableCell>{new Date(cost.date).toLocaleDateString()}</TableCell> {/* MUI TableCell for displaying formatted date */}
                <TableCell>{cost.category}</TableCell> {/* MUI TableCell for displaying category */}
                <TableCell>{cost.description}</TableCell> {/* MUI TableCell for displaying description */}
                <TableCell align="right">${cost.sum}</TableCell> {/* MUI TableCell for displaying sum, aligned to the right */}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

// Exporting the CostReport component for use in other parts of the application
export default CostReport;
