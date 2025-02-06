import React, { useState } from 'react';
import { ThemeProvider, createTheme, responsiveFontSizes } from '@mui/material/styles';
import { Container, CssBaseline, Stack, GlobalStyles } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import CostForm from './components/CostForm';
import CostReport from './components/CostReport';
import CostChart from './components/CostChart';

// Create a theme using Material UI's theme creation utility
let theme = createTheme({
  palette: {
    mode: 'light', // Set the theme to light mode
    primary: {
      main: '#1976d2', // Primary color for the theme (blue)
    },
    background: {
      default: '#f5f5f5', // Default background color
    }
  },
  typography: {
    // Define the font family to be used across the application
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',].join(','), // Join the font family array into a single string
  },
  components: {
    // Style overrides for Material UI components
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          WebkitFontSmoothing: 'antialiased', // Improve text rendering for better readability
          MozOsxFontSmoothing: 'grayscale', // For OSX font smoothing
          margin: 0, // Remove default margin
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 8, // Set border radius for Paper component (used for Material UI Paper elements)
        },
      },
    },
  },
});

// Make typography responsive (adjust font sizes based on screen size)
theme = responsiveFontSizes(theme);

/**
 * Main App component which serves as the root of the application.
 * It provides the theme context and includes CostForm, CostReport, and CostChart components.
 * 
 * @returns {JSX.Element} The rendered app component.
 */
function App() {
  // State to trigger re-render of the cost-related components when costs are updated
  const [costsUpdated, setCostsUpdated] = useState(false);

  /**
   * Handler function to notify that a new cost has been added or updated.
   * Toggles the costsUpdated state to trigger re-fetching and updating of the cost data.
   */
  const handleCostAdded = () => {
    setCostsUpdated(prevState => !prevState); // Toggle the state to refresh components
  };

  return (
    <ThemeProvider theme={theme}> {/* Provide the created theme to all child components */}
      <CssBaseline /> {/* Normalize the CSS styles for better cross-browser compatibility */}
      <GlobalStyles
        styles={{
          body: {
            margin: 0, // Remove default margin
            WebkitFontSmoothing: 'antialiased', // Smooth the font rendering
            MozOsxFontSmoothing: 'grayscale', // For OSX font smoothing
          },
        }}
      />
      <LocalizationProvider dateAdapter={AdapterDateFns}> {/* Provide date localization for date pickers */}
        <Container sx={{ py: 4 }}> {/* Main container with some padding */}
          <Stack spacing={3}> {/* Stack components vertically with spacing between them */}
            {/* CostForm: A form to add new costs */}
            <CostForm onCostAdded={handleCostAdded} />
            {/* CostReport: Displays a table of costs for the selected month */}
            <CostReport costsUpdated={costsUpdated} onCostAdded={handleCostAdded} />
            {/* CostChart: Displays a pie chart of costs by category */}
            <CostChart costsUpdated={costsUpdated} />
          </Stack>
        </Container>
      </LocalizationProvider>
    </ThemeProvider>
  );
}

// Export the App component as the default export of this file
export default App;