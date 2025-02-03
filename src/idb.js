// idb.js

/** 
 * CostManagerDB class to manage operations with IndexedDB for storing and retrieving costs.
 */
export class CostManagerDB {
  constructor() {
    /** 
     * The name of the IndexedDB database.
     */
    this.dbName = 'costManagerDB';
    /** 
     * The version of the IndexedDB database.
     */
    this.version = 1;
  }

  /** 
   * Initializes the IndexedDB database and creates the object store if it doesn't exist.
   * @returns {Promise} Resolves with the database instance or rejects with an error.
   */
  async initDB() {
    return new Promise((resolve, reject) => {
      // Open the IndexedDB database with the specified name and version
      const request = indexedDB.open(this.dbName, this.version);
      
      // Handle error in opening the database
      request.onerror = () => reject(request.error);
      
      // Handle database creation or upgrade (called when a new version is detected)
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        
        // If 'costs' object store does not exist, create it with an autoIncrement id
        if (!db.objectStoreNames.contains('costs')) {
          const costStore = db.createObjectStore('costs', { keyPath: 'id', autoIncrement: true });
          // Create indexes for 'date' and 'category' to enable efficient querying
          costStore.createIndex('date', 'date');
          costStore.createIndex('category', 'category');
        }
      };
      
      // When the database is successfully opened, resolve the promise with the database instance
      request.onsuccess = () => resolve(request.result);
    });
  }

  /** 
   * Adds a new cost entry to the 'costs' object store in IndexedDB.
   * @param {Object} cost The cost object to be added.
   * @returns {Promise} Resolves with the result of the add operation or rejects with an error.
   */
  async addCost(cost) {
    const db = await this.initDB(); // Initialize the database by opening it
    return new Promise((resolve, reject) => {
      // Create a read-write transaction for the 'costs' object store
      const transaction = db.transaction(['costs'], 'readwrite');
      const store = transaction.objectStore('costs');
      
      // Add the new cost entry, converting the date to ISO string format
      const request = store.add({
        ...cost,
        date: new Date(cost.date).toISOString() // Convert the date to ISO format
      });
      
      // Handle successful addition of the cost record
      request.onsuccess = () => resolve(request.result);
      // Handle errors while adding the cost record
      request.onerror = () => reject(request.error);
    });
  }

  /** 
   * Retrieves all costs that occurred in a specific month of a specific year.
   * @param {number} year The year to filter by.
   * @param {number} month The month (1-12) to filter by.
   * @returns {Promise} Resolves with an array of costs or rejects with an error.
   */
  async getCostsByMonth(year, month) {
    const db = await this.initDB(); // Initialize the database by opening it
    return new Promise((resolve, reject) => {
      // Create a read-only transaction for the 'costs' object store
      const transaction = db.transaction(['costs'], 'readonly');
      const store = transaction.objectStore('costs');
      const costs = []; // Array to store the costs for the specified month
      
      // Open a cursor to iterate over all records in the 'costs' object store
      const request = store.openCursor();
      
      // Handle each cursor iteration
      request.onsuccess = (event) => {
        const cursor = event.target.result;
        if (cursor) {
          // Convert the stored date to a Date object and check if it matches the year and month
          const date = new Date(cursor.value.date);
          if (date.getFullYear() === year && date.getMonth() === month - 1) {
            costs.push(cursor.value); // Add matching costs to the array
          }
          cursor.continue(); // Move to the next record in the object store
        } else {
          // Once all records are processed, resolve the promise with the costs array
          resolve(costs);
        }
      };
      
      // Handle errors while querying the database
      request.onerror = () => reject(request.error);
    });
  }

  /** 
   * Deletes a specific cost entry from the 'costs' object store by its id.
   * @param {number} id The id of the cost entry to be deleted.
   * @returns {Promise} Resolves when the cost is deleted or rejects with an error.
   */
  async deleteCost(id) {
    const db = await this.initDB(); // Initialize the database by opening it
    return new Promise((resolve, reject) => {
      // Create a read-write transaction for the 'costs' object store
      const transaction = db.transaction(['costs'], 'readwrite');
      const store = transaction.objectStore('costs');
      
      // Delete the cost record by its id
      const request = store.delete(id);
      
      // Handle successful deletion
      request.onsuccess = () => resolve();
      // Handle errors while deleting the cost record
      request.onerror = () => reject(request.error);
    });
  }
}