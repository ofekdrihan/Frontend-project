// Importing the necessary functions from the React Testing Library
import { render, screen } from '@testing-library/react';
// Importing the App component that we are testing
import App from './App';

// Defining a test case with the name 'renders learn react link'
test('renders learn react link', () => {
  // Rendering the App component to the virtual DOM
  render(<App />);
  
  // Finding an element in the screen that contains the text 'learn react'
  const linkElement = screen.getByText(/learn react/i);
  
  // Asserting that the element is present in the document
  expect(linkElement).toBeInTheDocument();
});
