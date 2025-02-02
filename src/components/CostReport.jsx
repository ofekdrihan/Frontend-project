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

const CostReport = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [costs, setCosts] = useState([]);

  const fetchCosts = useCallback(async () => {
    const db = new CostManagerDB();
    try {
      const year = selectedDate.getFullYear();
      const month = selectedDate.getMonth() + 1;
      const monthCosts = await db.getCostsByMonth(year, month);
      setCosts(monthCosts);
    } catch (error) {
      console.error('Error fetching costs:', error);
    }
  },[selectedDate]);

  useEffect(() => {
    fetchCosts();
  }, [fetchCosts]);

  const handleDelete = async (id) => {
    const db = new CostManagerDB();
    try {
      await db.deleteCost(id);
      fetchCosts();
    } catch (error) {
      console.error('Error deleting cost:', error);
    }
  };

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Monthly Cost Report
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
            {costs.map((cost) => (
              <TableRow key={cost.id}>
                <TableCell>{new Date(cost.date).toLocaleDateString()}</TableCell>
                <TableCell>{cost.category}</TableCell>
                <TableCell>{cost.description}</TableCell>
                <TableCell align="right">${cost.sum}</TableCell>
                <TableCell align="center">
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