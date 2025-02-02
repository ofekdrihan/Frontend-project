// idb.js
// Defining the CostManagerDB class which handles IndexedDB operations
export class CostManagerDB {
  // Constructor to initialize database name and version
  constructor() {
    this.dbName = 'costManagerDB';  // Database name
    this.version = 1;               // Database version
  }

  // Function to initialize the IndexedDB database
  async initDB() {
    return new Promise((resolve, reject) => {
      // Opening (or creating) the IndexedDB database with the given name and version
      const request = indexedDB.open(this.dbName, this.version);
      
      // Error handling if database opening fails
      request.onerror = () => reject(request.error);
      
      // Called when the database is being upgraded (e.g., when the version changes)
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        
        // Create 'costs' object store if it doesn't exist already
        if (!db.objectStoreNames.contains('costs')) {
          const costStore = db.createObjectStore('costs', { keyPath: 'id', autoIncrement: true });
          // Create indexes for 'date' and 'category' for efficient querying
          costStore.createIndex('date', 'date');
          costStore.createIndex('category', 'category');
        }
      };
      
      // Successfully opening the database
      request.onsuccess = () => resolve(request.result);
    });
  }

  // Function to add a cost record to the 'costs' object store in the database
  async addCost(cost) {
    const db = await this.initDB();  // Initialize the database
    return new Promise((resolve, reject) => {
      // Create a transaction for reading and writing to the 'costs' store
      const transaction = db.transaction(['costs'], 'readwrite');
      const store = transaction.objectStore('costs');
      
      // Add a new cost record to the store, converting date to ISO format
      const request = store.add({
        ...cost,  // Spread the cost object (sum, category, description, date)
        date: new Date(cost.date).toISOString()  // Convert date to ISO string format
      });
      
      // Resolve the promise when the request is successful
      request.onsuccess = () => resolve(request.result);
      // Reject the promise if there is an error
      request.onerror = () => reject(request.error);
    });
  }

  // Function to get costs for a specific month and year from the database
  async getCostsByMonth(year, month) {
    const db = await this.initDB();  // Initialize the database
    return new Promise((resolve, reject) => {
      // Create a transaction for reading from the 'costs' store
      const transaction = db.transaction(['costs'], 'readonly');
      const store = transaction.objectStore('costs');
      const costs = [];  // Initialize an empty array to hold the costs
      
      // Open a cursor to iterate over all records in the 'costs' store
      const request = store.openCursor();
      
      // Called for each record fetched by the cursor
      request.onsuccess = (event) => {
        const cursor = event.target.result;
        if (cursor) {
          // Convert the 'date' to a JavaScript Date object
          const date = new Date(cursor.value.date);
          // Check if the record's year and month match the specified year and month
          if (date.getFullYear() === year && date.getMonth() === month - 1) {
            costs.push(cursor.value);  // Add the record to the costs array
          }
          cursor.continue();  // Move to the next record
        } else {
          resolve(costs);  // Resolve the promise with the collected costs
        }
      };
      
      // Reject the promise if there is an error while fetching the data
      request.onerror = () => reject(request.error);
    });
  }
}