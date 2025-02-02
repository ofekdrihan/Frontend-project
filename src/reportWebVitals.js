// Function to report web vitals performance metrics
const reportWebVitals = (onPerfEntry) => {
  // Check if onPerfEntry is provided and is a function
  if (onPerfEntry && onPerfEntry instanceof Function) {
    // Dynamically import the 'web-vitals' library to measure performance metrics
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      // Measure Cumulative Layout Shift (CLS) and pass the results to the provided callback
      getCLS(onPerfEntry);
      // Measure First Input Delay (FID) and pass the results to the provided callback
      getFID(onPerfEntry);
      // Measure First Contentful Paint (FCP) and pass the results to the provided callback
      getFCP(onPerfEntry);
      // Measure Largest Contentful Paint (LCP) and pass the results to the provided callback
      getLCP(onPerfEntry);
      // Measure Time to First Byte (TTFB) and pass the results to the provided callback
      getTTFB(onPerfEntry);
    });
  }
};

// Export the function as the default export
export default reportWebVitals;
