import api from './api';

export const uploadPrescription = async (formData) => {
  const res = await api.post('/prescriptions/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return res.data;
};

export const getAllPrescriptions = async () => {
  const res = await api.get('/prescriptions');
  return res.data;
};

export const getPrescriptions = getAllPrescriptions;

export const getPrescriptionById = async (id) => {
  const res = await api.get(`/prescriptions/${id}`);
  return res.data;
};

export const updatePrescriptionStatus = async (id, { status, pharmacistNotes } = {}) => {
  const res = await api.put(`/prescriptions/${id}/status`, { 
    status, 
    notes: pharmacistNotes 
  });
  return res.data;
};

const prescriptionService = {
  uploadPrescription,
  getAllPrescriptions,
  getPrescriptions,
  getPrescriptionById,
  updatePrescriptionStatus,
};

export default prescriptionService;
