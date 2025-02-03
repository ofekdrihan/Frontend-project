// Importing necessary modules from React and Material-UI libraries
import React, { useState } from 'react'; // Import React and useState hook for managing state
import { ThemeProvider, createTheme } from '@mui/material/styles'; // Import ThemeProvider and createTheme for styling the app
import { Container, CssBaseline } from '@mui/material'; // Import Container for layout and CssBaseline for resetting CSS
import { LocalizationProvider } from '@mui/x-date-pickers'; // Import LocalizationProvider to manage date localization
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'; // Import AdapterDateFns for integrating date-fns library for date handling
import CostForm from './components/CostForm'; // Import CostForm component to manage cost input
import CostReport from './components/CostReport'; // Import CostReport component to display cost summary
import CostChart from './components/CostChart'; // Import CostChart component to display cost data visually in a chart

// Creating a custom theme for the app using Material-UI's createTheme function
const theme = createTheme({
  palette: {
    mode: 'light', // Set the theme mode to light
    primary: {
      main: '#1976d2', // Set the primary color for the theme
    },
  },
});

// Main App component function
function App() {
  // useState hook to manage the state of 'costsUpdated' (initially set to false)
  const [costsUpdated, setCostsUpdated] = useState(false);

  // Function to handle when a cost is added (toggles the costsUpdated state)
  const handleCostAdded = () => {
    setCostsUpdated(prevState => !prevState); // Toggle the state between true and false
  };

  // JSX structure of the App component
  return (
    // Wrapping the app with ThemeProvider to apply the custom theme
    <ThemeProvider theme={theme}>
      {/* Wrapping the entire app with LocalizationProvider to manage date localization */}
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        {/* CssBaseline is used to normalize and reset CSS across the app */}
        <CssBaseline />
        
        {/* Container component used to structure the layout with some padding */}
        <Container>
          {/* CostForm component, passing the handleCostAdded function as a prop */}
          <CostForm onCostAdded={handleCostAdded} />
          
          {/* CostReport component, passing the costsUpdated state and handleCostAdded function as props */}
          <CostReport costsUpdated={costsUpdated} onCostAdded={handleCostAdded} />
          
          {/* CostChart component, passing the costsUpdated state as a prop */}
          <CostChart costsUpdated={costsUpdated} />
        </Container>
      </LocalizationProvider>
    </ThemeProvider>
  );
}

// Exporting the App component as the default export of the file
export default App;
