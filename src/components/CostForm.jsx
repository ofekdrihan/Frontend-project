import React, { useState } from 'react';
import { Paper, TextField, Button, Select, MenuItem, FormControl, InputLabel, FormHelperText } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { CostManagerDB } from '../idb';

// Predefined expense categories
const categories = [
  'Food',
  'Transportation',
  'Housing',
  'Entertainment',
  'Healthcare',
  'Other',
];

/**
 * CostForm Component
 * A form to add a new cost entry with validation.
 *
 * @param {Function} onCostAdded - Callback function triggered when a new cost is added.
 */
const CostForm = ({ onCostAdded }) => {
  // State to manage form inputs
  const [formData, setFormData] = useState({
    sum: '',
    category: '',
    description: '',
    date: new Date(),
  });

  // State to manage validation errors
  const [errors, setErrors] = useState({
    sum: false,
    category: false,
    description: false,
    date: false
  });

  /**
   * Handles form submission, validates input fields, and adds the cost entry to the database.
   *
   * @param {Event} e - The form submit event.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate inputs
    const newErrors = {
      sum: !formData.sum,
      category: !formData.category,
      description: !formData.description,
      date: !formData.date
    };

    setErrors(newErrors);

    // If any errors exist, prevent submission
    if (Object.values(newErrors).some(error => error)) {
      return;
    }

    const db = new CostManagerDB(); // Initialize database connection
    try {
      await db.addCost(formData); // Add cost entry to IndexedDB
      onCostAdded(); // Trigger callback function
      
      // Reset form fields
      setFormData({
        sum: '',
        category: '',
        description: '',
        date: new Date(),
      });
    } catch (error) {
      console.error('Error adding cost:', error); // Log errors
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      <form onSubmit={handleSubmit}>
        {/* Input field for sum */}
        <TextField
          label="Sum"
          value={formData.sum}
          onChange={(e) => {
            setFormData({ ...formData, sum: e.target.value });
            setErrors({ ...errors, sum: false });
          }}
          fullWidth
          required
          error={errors.sum}
          helperText={errors.sum ? "Sum is required" : ""}
          sx={{ mb: 2 }}
        />
        
        {/* Dropdown for category selection */}
        <FormControl fullWidth required error={errors.category} sx={{ mb: 2 }}>
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

        {/* Input field for description */}
        <TextField
          label="Description"
          value={formData.description}
          onChange={(e) => {
            setFormData({ ...formData, description: e.target.value });
            setErrors({ ...errors, description: false });
          }}
          fullWidth
          required
          error={errors.description}
          helperText={errors.description ? "Description is required" : ""}
          sx={{ mb: 2 }}
        />

        {/* Date picker for selecting expense date */}
        <DatePicker
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

        {/* Submit button */}
        <Button type="submit" variant="contained" color="primary">
          Add Cost
        </Button>
      </form>
    </Paper>
  );
};

export default CostForm;
