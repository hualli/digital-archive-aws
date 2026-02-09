import axios from 'axios';

const apiClient = axios.create({
  // Tu Invoke URL de Ohio
  baseURL: 'https://kdxui4wxri.execute-api.us-east-2.amazonaws.com/prod',
  headers: {
    'Content-Type': 'application/json'
  }
});

export default {
  // Login de usuario
  login(username, password) {
    return apiClient.post('/login', { username, password });
  },

  // Búsqueda con filtros (nombre, cuenta, factura)
  search(params) {
    return apiClient.get('/search', { params });
  },

  // Generación de Presigned URL y registro en access_logs
  getDocUrl(id, type, userId) {
    return apiClient.get('/get-url', { 
      params: { id, type, user_id: userId } 
    });
  },

  // Resumen para el dashboard del SuperAdmin
  getStats() {
    return apiClient.get('/stats');
  }
};