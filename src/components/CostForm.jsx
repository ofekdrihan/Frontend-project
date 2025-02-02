import React, { useState } from 'react';
import {
  Paper,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  FormHelperText
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { CostManagerDB } from '../idb';

const categories = [
  'Food',
  'Transportation',
  'Housing',
  'Entertainment',
  'Healthcare',
  'Other',
];

const CostForm = () => {
  const [formData, setFormData] = useState({
    sum: '',
    category: '',
    description: '',
    date: new Date(),
  });

  const [errors, setErrors] = useState({
    sum: false,
    category: false,
    description: false,
    date: false
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = {
      sum: !formData.sum,
      category: !formData.category,
      description: !formData.description,
      date: !formData.date
    };

    setErrors(newErrors);

    if (Object.values(newErrors).some(error => error)) {
      return;
    }

    const db = new CostManagerDB();
    try {
      await db.addCost(formData);
      setFormData({
        sum: '',
        category: '',
        description: '',
        date: new Date(),
      });
    } catch (error) {
      console.error('Error adding cost:', error);
    }
  };

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Box component="form" onSubmit={handleSubmit}>
        <TextField
          required
          error={errors.sum}
          helperText={errors.sum ? "Sum is required" : ""}
          fullWidth
          label="Sum"
          type="number"
          value={formData.sum}
          onChange={(e) => {
            setFormData({ ...formData, sum: e.target.value });
            setErrors({ ...errors, sum: false });
          }}
          sx={{ mb: 2 }}
        />
        
        <FormControl 
          required 
          fullWidth 
          error={errors.category}
          sx={{ mb: 2 }}
        >
          <InputLabel>Category</InputLabel>
          <Select
            value={formData.category}
            onChange={(e) => {
              setFormData({ ...formData, category: e.target.value });
              setErrors({ ...errors, category: false });
            }}
          >
            {categories.map((category) => (
              <MenuItem key={category} value={category}>
                {category}
              </MenuItem>
            ))}
          </Select>
          {errors.category && (
            <FormHelperText>Category is required</FormHelperText>
          )}
        </FormControl>

        <TextField
          required
          error={errors.description}
          helperText={errors.description ? "Description is required" : ""}
          fullWidth
          label="Description"
          value={formData.description}
          onChange={(e) => {
            setFormData({ ...formData, description: e.target.value });
            setErrors({ ...errors, description: false });
          }}
          sx={{ mb: 2 }}
        />
        
        <DatePicker
          required
          label="Date"
          value={formData.date}
          onChange={(newDate) => {
            setFormData({ ...formData, date: newDate });
            setErrors({ ...errors, date: false });
          }}
          sx={{ mb: 2, width: '100%' }}
          slotProps={{
            textField: {
              required: true,
              error: errors.date,
              helperText: errors.date ? "Date is required" : ""
            }
          }}
        />

        <Button
          type="submit"
          variant="contained"
          fullWidth
        >
          Add Cost
        </Button>
      </Box>
    </Paper>
  );
};

export default CostForm;