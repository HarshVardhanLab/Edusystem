import api from './api';

export const qrService = {
  generateQRCode: (date) => api.post('/api/v1/student-portal/qr-codes/generate/', { date }),
  
  scanQRCode: (code) => api.post('/api/v1/student-portal/qr-codes/scan/', { code }),
  
  getQRCodes: () => api.get('/api/v1/student-portal/qr-codes/'),
};
