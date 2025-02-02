// idb.js - vanilla JS version for testing

// Creating an object `idb` to manage IndexedDB operations
const idb = {
    // Method to open the database with a given name and version
    openCostsDB: function(dbName, version) {
        return new Promise((resolve, reject) => {
            // Attempt to open (or create) the IndexedDB database
            const request = indexedDB.open(dbName, version);
            
            // Handle errors during database opening
            request.onerror = () => reject(request.error);
            
            // Event triggered when the database needs to be upgraded
            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                
                // Check if the 'costs' object store already exists
                if (!db.objectStoreNames.contains('costs')) {
                    // Create an object store named 'costs' with auto-incrementing keys
                    const costsStore = db.createObjectStore('costs', { 
                        keyPath: 'id', // Primary key for each entry
                        autoIncrement: true // Automatically generate unique IDs
                    });
                    
                    // Create an index for querying by 'date'
                    costsStore.createIndex('date', 'date');
                    // Create an index for querying by 'category'
                    costsStore.createIndex('category', 'category');
                }
            };
            
            // Event triggered when the database opens successfully
            request.onsuccess = () => {
                const db = request.result; // Reference to the opened database
                
                // Resolve the promise with an object containing methods to interact with the database
                resolve({
                    // Method to add a new cost entry to the database
                    addCost: (cost) => {
                        return new Promise((resolve, reject) => {
                            // Open a transaction to the 'costs' object store in 'readwrite' mode
                            const transaction = db.transaction(['costs'], 'readwrite');
                            const store = transaction.objectStore('costs');
                            
                            // Add the cost entry to the store
                            const request = store.add({
                                ...cost, // Spread the cost object to include all its properties
                                date: new Date(cost.date || Date.now()) // Use provided date or default to current date
                            });
                            
                            // Resolve the promise when the entry is successfully added
                            request.onsuccess = () => resolve(true);
                            // Reject the promise if an error occurs
                            request.onerror = () => reject(request.error);
                        });
                    },
                    
                    // Method to retrieve cost entries for a specific month and year
                    getCosts: (month, year) => {
                        return new Promise((resolve, reject) => {
                            // Open a transaction to the 'costs' object store in 'readonly' mode
                            const transaction = db.transaction(['costs'], 'readonly');
                            const store = transaction.objectStore('costs');
                            const costs = []; // Array to collect matching cost entries
                            
                            // Open a cursor to iterate through all entries in the store
                            const request = store.openCursor();
                            
                            // Event triggered for each entry retrieved by the cursor
                            request.onsuccess = (event) => {
                                const cursor = event.target.result;
                                if (cursor) {
                                    const cost = cursor.value; // Current cost entry
                                    const costDate = new Date(cost.date); // Convert 'date' to a Date object
                                    // Check if the entry matches the specified month and year
                                    if (costDate.getMonth() + 1 === month && 
                                        costDate.getFullYear() === year) {
                                        costs.push(cost); // Add the matching entry to the array
                                    }
                                    cursor.continue(); // Move to the next entry
                                } else {
                                    // Resolve the promise when all entries have been processed
                                    resolve(costs);
                                }
                            };
                            
                            // Reject the promise if an error occurs
                            request.onerror = () => reject(request.error);
                        });
                    }
                });
            };
        });
    }
};

// Make the `idb` object available globally for vanilla JS usage
if (typeof window !== 'undefined') {
    window.idb = idb;
}
