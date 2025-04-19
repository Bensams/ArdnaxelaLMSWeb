// src/api/auth.js
import { publicAxios, authAxios } from './axiosInstances';

const guestAPI = {
  searchActiveBorrowings: (credentials) => {
    console.log(credentials);
    return publicAxios.get(`/api/guest/search?${credentials}`); // const response = await publicAxios.get(`/api/guest/search?${params.toString()}`);

  },

  borrowBook: (credentials) => {
    return publicAxios.post('/api/guest/borrow', credentials);
  },


};

export default guestAPI;