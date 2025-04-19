// In your AuthContext.js or new DataContext.js
import { createContext, useContext, useState } from 'react';

const DataContext = createContext();

export function DataProvider({ children }) {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [notifications, setNotifications] = useState([]);
  
  return (
    <DataContext.Provider value={{ books, setBooks, filteredBooks, setFilteredBooks, notifications, setNotifications }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  return useContext(DataContext);
}