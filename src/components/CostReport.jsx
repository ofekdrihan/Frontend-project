import React, { useState, useEffect, useCallback } from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  Typography,
  IconButton
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { DatePicker } from '@mui/x-date-pickers';
import { CostManagerDB } from '../idb';

/**
 * CostReport Component
 * Displays a report of monthly costs and allows the user to delete entries.
 *
 * @param {boolean} costsUpdated - A flag to trigger data re-fetching.
 * @param {Function} onCostAdded - Callback function triggered when a cost is added or removed.
 */
const CostReport = ({ costsUpdated, onCostAdded }) => {
  // State to track the selected date (month and year)
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  // State to store the list of costs for the selected month
  const [costs, setCosts] = useState([]);

  /**
   * Fetches costs from the database for the selected month.
   * Uses useCallback to memoize the function, preventing unnecessary re-creations.
   */
  const fetchCosts = useCallback(async () => {
    const db = new CostManagerDB();
    try {
      const year = selectedDate.getFullYear(); // Extract year from selected date
      const month = selectedDate.getMonth() + 1; // Extract month (1-based index)
      const monthCosts = await db.getCostsByMonth(year, month); // Fetch costs from DB
      setCosts(monthCosts); // Update state with fetched costs
    } catch (error) {
      console.error('Error fetching costs:', error); // Log errors in case of failure
    }
  }, [selectedDate]);

  // useEffect to fetch costs whenever selectedDate or costsUpdated changes
  useEffect(() => {
    fetchCosts();
  }, [fetchCosts, costsUpdated]);

  /**
   * Handles deletion of a cost entry.
   * Calls the database delete function and refreshes the cost list.
   *
   * @param {number} id - The unique identifier of the cost entry to be deleted.
   */
  const handleDelete = async (id) => {
    const db = new CostManagerDB();
    try {
      await db.deleteCost(id); // Delete cost from DB
      fetchCosts(); // Refresh cost list
      onCostAdded(); // Notify parent component
    } catch (error) {
      console.error('Error deleting cost:', error); // Log errors if deletion fails
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      {/* Header Title */}
      <Typography variant="h6" gutterBottom>
        Monthly Cost Report
      </Typography>

      {/* Date Picker for selecting the month */}
      <Box sx={{ mb: 3 }}>
        <DatePicker
          label="Select Month"
          value={selectedDate}
          onChange={setSelectedDate}
          views={['year', 'month']}
          sx={{ width: '100%' }}
        />
      </Box>

      {/* Table containing the list of costs */}
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Sum</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {/* Map over costs and create a row for each entry */}
            {costs.map((cost) => (
              <TableRow key={cost.id}>
                {/* Display formatted date */}
                <TableCell>{new Date(cost.date).toLocaleDateString()}</TableCell>
                {/* Display category name */}
                <TableCell>{cost.category}</TableCell>
                {/* Display cost description */}
                <TableCell>{cost.description}</TableCell>
                {/* Display cost sum with a dollar sign */}
                <TableCell>${cost.sum}</TableCell>
                {/* Delete button with an event handler */}
                <TableCell>
                  <IconButton
                    onClick={() => handleDelete(cost.id)}
                    color="error"
                    size="small"
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default CostReport;
