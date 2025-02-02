// Importing necessary modules from React and MUI (Material UI)
import React, { useState } from 'react'; // Importing React and useState hook for state management
import {
  Paper, // MUI Paper component to wrap content
  TextField, // MUI TextField component for input fields
  Button, // MUI Button component for the submit button
  Select, // MUI Select component for dropdown menu
  MenuItem, // MUI MenuItem for items inside the Select dropdown
  FormControl, // MUI FormControl for wrapping select input
  InputLabel, // MUI InputLabel for label inside the Select
  Box, // MUI Box component for layout
} from '@mui/material'; // Importing various Material UI components
import { DatePicker } from '@mui/x-date-pickers'; // Importing DatePicker component for date selection
import { CostManagerDB } from '../idb'; // Importing CostManagerDB to interact with IndexedDB

// Defining the categories for cost selection
const categories = [
  'Food', // Food category
  'Transportation', // Transportation category
  'Housing', // Housing category
  'Entertainment', // Entertainment category
  'Healthcare', // Healthcare category
  'Other', // Other category
];

// CostForm functional component
const CostForm = () => {
  // State for storing the form data (sum, category, description, date)
  const [formData, setFormData] = useState({
    sum: '', // Initial sum is empty
    category: '', // Initial category is empty
    description: '', // Initial description is empty
    date: new Date(), // Initial date is set to the current date
  });

  // handleSubmit function is called when the form is submitted
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior
    const db = new CostManagerDB(); // Create an instance of CostManagerDB to interact with IndexedDB
    try {
      // Attempt to add the form data to the IndexedDB
      await db.addCost(formData);
      // Reset the form data to initial state after successful submission
      setFormData({
        sum: '', // Reset sum to empty
        category: '', // Reset category to empty
        description: '', // Reset description to empty
        date: new Date(), // Reset date to current date
      });
    } catch (error) {
      // Handle any error that occurs while adding data
      console.error('Error adding cost:', error);
    }
  };

  return (
    <Paper sx={{ p: 3, mb: 3 }}> {/* MUI Paper component to wrap the form with padding and margin-bottom */}
      <Box component="form" onSubmit={handleSubmit}> {/* MUI Box component to wrap the form elements */}
        
        {/* Sum input field */}
        <TextField
          fullWidth // Making the input field full width
          label="Sum" // Label for the input field
          type="number" // Input type is number
          value={formData.sum} // Binding the value to formData state
          onChange={(e) => setFormData({ ...formData, sum: e.target.value })} // Update formData on input change
          sx={{ mb: 2 }} // Styling the margin-bottom of the input field
        />
        
        {/* Category dropdown selection */}
        <FormControl fullWidth sx={{ mb: 2 }}> {/* MUI FormControl for the Select component */}
          <InputLabel>Category</InputLabel> {/* Label for the select dropdown */}
          <Select
            value={formData.category} // Binding the selected category to formData state
            onChange={(e) => setFormData({ ...formData, category: e.target.value })} // Update formData on category change
          >
            {/* Looping through categories and creating MenuItem for each */}
            {categories.map((category) => (
              <MenuItem key={category} value={category}>
                {category} {/* Displaying category name inside the dropdown */}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Description input field */}
        <TextField
          fullWidth // Making the input field full width
          label="Description" // Label for the input field
          value={formData.description} // Binding the value to formData state
          onChange={(e) => setFormData({ ...formData, description: e.target.value })} // Update formData on input change
          sx={{ mb: 2 }} // Styling the margin-bottom of the input field
        />
        
        {/* Date picker for selecting date */}
        <DatePicker
          label="Date" // Label for the date picker
          value={formData.date} // Binding the selected date to formData state
          onChange={(newDate) => setFormData({ ...formData, date: newDate })} // Update formData on date change
          sx={{ mb: 2, width: '100%' }} // Styling the margin-bottom and width of the date picker
        />

        {/* Submit button to add the cost */}
        <Button
          type="submit" // Button type is submit
          variant="contained" // Button variant is contained (filled button)
          fullWidth // Making the button full width
        >
          Add Cost {/* Button text */}
        </Button>
      </Box>
    </Paper>
  );
};

// Exporting the CostForm component for use in other parts of the application
export default CostForm;
