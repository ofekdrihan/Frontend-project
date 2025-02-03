import React, { useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Container, CssBaseline } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import CostForm from './components/CostForm';
import CostReport from './components/CostReport';
import CostChart from './components/CostChart';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
  },
});

function App() {
  const [costsUpdated, setCostsUpdated] = useState(false);

  const handleCostAdded = () => {
    setCostsUpdated(prevState => !prevState); // שינוי ה-state כדי לעדכן את כל הרכיבים
  };

  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <CssBaseline />
        <Container>
          <CostForm onCostAdded={handleCostAdded} />
          <CostReport costsUpdated={costsUpdated} onCostAdded={handleCostAdded} />
          <CostChart costsUpdated={costsUpdated} />
        </Container>
      </LocalizationProvider>
    </ThemeProvider>
  );
}

export default App;
