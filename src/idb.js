// idb.js
export class CostManagerDB {
  constructor() {
    this.dbName = 'costManagerDB';
    this.version = 1;
  }

  async initDB() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);
      
      request.onerror = () => reject(request.error);
      
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        
        if (!db.objectStoreNames.contains('costs')) {
          const costStore = db.createObjectStore('costs', { keyPath: 'id', autoIncrement: true });
          costStore.createIndex('date', 'date');
          costStore.createIndex('category', 'category');
        }
      };
      
      request.onsuccess = () => resolve(request.result);
    });
  }

  async addCost(cost) {
    const db = await this.initDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['costs'], 'readwrite');
      const store = transaction.objectStore('costs');
      
      const request = store.add({
        ...cost,
        date: new Date(cost.date).toISOString()
      });
      
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async getCostsByMonth(year, month) {
    const db = await this.initDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['costs'], 'readonly');
      const store = transaction.objectStore('costs');
      const costs = [];
      
      const request = store.openCursor();
      
      request.onsuccess = (event) => {
        const cursor = event.target.result;
        if (cursor) {
          const date = new Date(cursor.value.date);
          if (date.getFullYear() === year && date.getMonth() === month - 1) {
            costs.push(cursor.value);
          }
          cursor.continue();
        } else {
          resolve(costs);
        }
      };
      
      request.onerror = () => reject(request.error);
    });
  }

  async deleteCost(id) {
    const db = await this.initDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['costs'], 'readwrite');
      const store = transaction.objectStore('costs');
      
      const request = store.delete(id);
      
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }
}