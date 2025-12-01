// Helper functions untuk localStorage
export const storage = {
    // Get data dari localStorage
    get(key, defaultValue = null) {
      try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
      } catch (error) {
        console.error(`Error reading localStorage key "${key}":`, error);
        return defaultValue;
      }
    },
  
    // Set data ke localStorage
    set(key, value) {
      try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
      } catch (error) {
        console.error(`Error setting localStorage key "${key}":`, error);
        return false;
      }
    },
  
    // Hapus data dari localStorage
    remove(key) {
      try {
        localStorage.removeItem(key);
        return true;
      } catch (error) {
        console.error(`Error removing localStorage key "${key}":`, error);
        return false;
      }
    }
  };
  
  // Data default untuk aplikasi
  export const defaultData = {
    categories: [
      { id: 1, name: 'Pekerjaan', color: '#3498db' },
      { id: 2, name: 'Pribadi', color: '#2ecc71' },
      { id: 3, name: 'Belajar', color: '#9b59b6' },
      { id: 4, name: 'Olahraga', color: '#e67e22' }
    ],
    tasks: []
  };