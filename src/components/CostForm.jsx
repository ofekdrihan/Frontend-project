import React, { useState } from 'react';
import { Paper, TextField, Button, Select, MenuItem, FormControl, InputLabel, FormHelperText, Stack, Typography } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { CostManagerDB } from '../idb';

// Array of available categories for costs
const categories = ['Food','Transportation','Housing','Entertainment','Healthcare','Other',];

/**
 * CostForm component allows users to add a new cost entry, including sum, category, description, and date.
 * It validates the form before submission and saves the cost data to IndexedDB.
 * 
 * @param {Object} props - The props object passed to the component.
 * @param {Function} props.onCostAdded - Callback function to notify when a cost is successfully added.
 * 
 * @returns {JSX.Element} The rendered cost form component.
 */
const CostForm = ({ onCostAdded }) => {
  // State to manage form data, including sum, category, description, and date
  const [formData, setFormData] = useState({
    sum: '',
    category: '',
    description: '',
    date: new Date(),
  });

  // State to track validation errors for each form field
  const [errors, setErrors] = useState({
    sum: false,
    category: false,
    description: false,
    date: false
  });

  /**
   * Handles form submission, validates the input, and saves the cost data to the database.
   * 
   * @param {Object} e - The form submission event.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form data and set errors if any field is empty
    const newErrors = {
      sum: !formData.sum,
      category: !formData.category,
      description: !formData.description,
      date: !formData.date
    };

    setErrors(newErrors);

    // If any errors are found, prevent form submission
    if (Object.values(newErrors).some(error => error)) {
      return;
    }

    // Initialize IndexedDB utility to save the new cost entry
    const db = new CostManagerDB();
    try {
      // Add the cost entry to IndexedDB
      await db.addCost(formData);

      // Notify the parent component that a new cost has been added
      onCostAdded();
      
      // Reset form fields after successful submission
      setFormData({
        sum: '',
        category: '',
        description: '',
        date: new Date(),
      });
    } catch (error) {
      // Log any errors that occur while adding the cost
      console.error('Error adding cost:', error);
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      {/* Form title */}
      <Typography variant="h6" gutterBottom>
        Add New Cost
      </Typography>
      
      {/* Form for adding a new cost entry */}
      <form onSubmit={handleSubmit}>
        <Stack spacing={2}>
          {/* Sum input field */}
          <TextField
            label="Sum"
            value={formData.sum}
            onChange={(e) => {
              // Update the sum value and reset error state
              setFormData({ ...formData, sum: e.target.value });
              setErrors({ ...errors, sum: false });
            }}
            fullWidth
            required
            error={errors.sum} // Display error if sum is not provided
            helperText={errors.sum ? "Sum is required" : ""}
            type="number" // Input type for numeric values
          />
          
          {/* Category select dropdown */}
          <FormControl fullWidth required error={errors.category}>
            <InputLabel>Category</InputLabel>
            <Select
              value={formData.category}
              onChange={(e) => {
                // Update the category and reset error state
                setFormData({ ...formData, category: e.target.value });
                setErrors({ ...errors, category: false });
              }}
            >
              {/* Generate menu items for each category */}
              {categories.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </Select>
            {errors.category && (
              <FormHelperText>Category is required</FormHelperText> // Display error if category is not selected
            )}
          </FormControl>

          {/* Description input field */}
          <TextField
            label="Description"
            value={formData.description}
            onChange={(e) => {
              // Update the description and reset error state
              setFormData({ ...formData, description: e.target.value });
              setErrors({ ...errors, description: false });
            }}
            fullWidth
            required
            error={errors.description} // Display error if description is not provided
            helperText={errors.description ? "Description is required" : ""}
          />

          {/* Date picker for selecting the date */}
          <DatePicker
            label="Date"
            value={formData.date}
            onChange={(newDate) => {
              // Update the date and reset error state
              setFormData({ ...formData, date: newDate });
              setErrors({ ...errors, date: false });
            }}
            slotProps={{
              textField: {
                required: true, // Make the date field required
                error: errors.date, // Display error if date is not provided
                helperText: errors.date ? "Date is required" : "",
                fullWidth: true // Make the text field full width
              }
            }}
          />

          {/* Submit button */}
          <Button 
            type="submit" 
            variant="contained" 
            color="primary"
            size="large"
            sx={{ mt: 2 }}
          >
            Add Cost
          </Button>
        </Stack>
      </form>
    </Paper>
  );
};

// Export the component for use in other parts of the app
export default CostForm;