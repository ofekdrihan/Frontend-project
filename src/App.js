// Importing React and necessary components from Material UI and date pickers
import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles'; // For Material UI theme configuration
import { Container, CssBaseline } from '@mui/material'; // For layout and global styling reset
import { LocalizationProvider } from '@mui/x-date-pickers'; // To provide date picker context
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'; // Date adapter for date-fns library
import CostForm from './components/CostForm'; // Importing the CostForm component
import CostReport from './components/CostReport'; // Importing the CostReport component
import CostChart from './components/CostChart'; // Importing the CostChart component

// Defining a custom theme using Material UI's createTheme function
const theme = createTheme({
  palette: {
    mode: 'light', // Light mode for the theme
    primary: {
      main: '#1976d2', // Primary color of the theme (blue)
    },
  },
});

// The main App component
function App() {
  return (
    // Wrapping the application in the ThemeProvider to apply the custom theme
    <ThemeProvider theme={theme}>
      {/* Providing localization context for date pickers with date-fns adapter */}
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        {/* CssBaseline is used to reset styles globally */}
        <CssBaseline />
        {/* Container component for a responsive layout with some padding */}
        <Container maxWidth="lg" sx={{ py: 4 }}>
          {/* Rendering the form to add costs */}
          <CostForm />
          {/* Rendering the cost report table */}
          <CostReport />
          {/* Rendering the pie chart for cost breakdown */}
          <CostChart />
        </Container>
      </LocalizationProvider>
    </ThemeProvider>
  );
}

// Exporting the App component for use in other parts of the application
export default App;
