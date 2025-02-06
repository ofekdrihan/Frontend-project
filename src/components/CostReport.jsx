import React, { useState, useEffect, useCallback } from 'react';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, IconButton, Stack } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { DatePicker } from '@mui/x-date-pickers';
import { CostManagerDB } from '../idb';

/**
 * CostReport component displays a table of costs for a selected month.
 * It allows users to delete a cost record and view details like date, category, description, and sum.
 * 
 * @param {Object} props - The props object passed to the component.
 * @param {boolean} props.costsUpdated - Flag that triggers a re-fetch of costs when updated.
 * @param {Function} props.onCostAdded - Callback function to notify when a cost is added or deleted.
 * 
 * @returns {JSX.Element} The rendered cost report component.
 */
const CostReport = ({ costsUpdated, onCostAdded }) => {
  // State to manage the selected month for the cost report
  const [selectedDate, setSelectedDate] = useState(new Date());

  // State to hold the list of costs fetched from the database
  const [costs, setCosts] = useState([]);

  /**
   * Fetch costs for the selected month from IndexedDB.
   * This function is memoized using `useCallback` to prevent unnecessary re-renders.
   */
  const fetchCosts = useCallback(async () => {
    const db = new CostManagerDB();
    try {
      const year = selectedDate.getFullYear(); // Get the year from the selected date
      const month = selectedDate.getMonth() + 1; // Get the month (1-based)
      const monthCosts = await db.getCostsByMonth(year, month); // Fetch costs for the month from IndexedDB
      setCosts(monthCosts); // Update the costs state with the fetched data
    } catch (error) {
      console.error('Error fetching costs:', error); // Log any errors that occur while fetching
    }
  }, [selectedDate]);

  // Fetch costs whenever the component mounts or when costsUpdated changes
  useEffect(() => {
    fetchCosts();
  }, [fetchCosts, costsUpdated]);

  /**
   * Handle the deletion of a cost entry.
   * 
   * @param {string} id - The ID of the cost entry to be deleted.
   */
  const handleDelete = async (id) => {
    const db = new CostManagerDB();
    try {
      await db.deleteCost(id); // Delete the cost from IndexedDB
      fetchCosts(); // Re-fetch the costs after deletion
      onCostAdded(); // Notify parent component that the cost has been updated
    } catch (error) {
      console.error('Error deleting cost:', error); // Log any errors that occur during deletion
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Stack spacing={3}>
        {/* Title of the cost report */}
        <Typography variant="h6">
          Monthly Cost Report
        </Typography>

        {/* Date picker to select the month for the cost report */}
        <DatePicker
          label="Select Month"
          value={selectedDate}
          onChange={setSelectedDate} // Update the selectedDate state when a new month is chosen
          views={['year', 'month']} // Allow the user to select only the year and month
          slotProps={{
            textField: {
              fullWidth: true
            }
          }}
        />

        {/* Table displaying the list of costs */}
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Description</TableCell>
                <TableCell align="right">Sum</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {/* Iterate over the list of costs and render a row for each cost */}
              {costs.map((cost) => (
                <TableRow key={cost.id} hover>
                  <TableCell>{new Date(cost.date).toLocaleDateString()}</TableCell> {/* Format and display the cost date */}
                  <TableCell>{cost.category}</TableCell> {/* Display the cost category */}
                  <TableCell>{cost.description}</TableCell> {/* Display the description of the cost */}
                  <TableCell align="right">${Number(cost.sum).toFixed(2)}</TableCell> {/* Display the cost sum with 2 decimal places */}
                  <TableCell align="center">
                    {/* Delete button to remove the cost entry */}
                    <IconButton
                      onClick={() => handleDelete(cost.id)} // Trigger the delete handler when clicked
                      color="error"
                      size="small"
                    >
                      <DeleteIcon /> {/* Display the delete icon */}
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Stack>
    </Paper>
  );
};

// Export the component for use in other parts of the app
export default CostReport;