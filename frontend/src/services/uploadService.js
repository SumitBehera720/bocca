import api from './api';

export const uploadDeviceImage = async (file) => {
  const formData = new FormData();
  formData.append('image', file);

  const res = await api.post('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return res.url || res.data?.url || res;
};

const uploadService = { uploadDeviceImage };
export default uploadService;
