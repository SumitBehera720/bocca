import Prescription from '../models/Prescription.js';
import { sendSuccess, sendError } from '../utils/responseHandler.js';

export const uploadPrescription = async (req, res, next) => {
  try {
    const userId = req.user ? req.user.id : null;
    const patientName = req.body.patientName || (req.user ? req.user.name : 'Patient');
    const doctorName = req.body.doctorName || 'Dr. Unspecified';
    const notes = req.body.notes || '';
    const orderId = req.body.orderId || null;
    
    // Support file uploads, base64 data URLs, or remote image links
    const prescriptionFile = req.file ? `/uploads/${req.file.filename}` : (req.body.prescriptionFile || req.body.prescription || req.body.file || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500');

    const prescription = Prescription.create({
      userId,
      orderId: orderId || null,
      patientName,
      doctorName,
      prescriptionFile,
      status: 'pending',
      notes: notes || ''
    });

    return sendSuccess(res, prescription, 'Prescription uploaded successfully. A licensed pharmacist will review your document.', 201);
  } catch (error) {
    next(error);
  }
};

export const getPrescriptions = async (req, res, next) => {
  try {
    let prescriptions;
    if (req.user && req.user.role === 'admin') {
      prescriptions = Prescription.findAll();
    } else if (req.user) {
      prescriptions = Prescription.findByUserId(req.user.id);
    } else {
      prescriptions = Prescription.findAll(); // Allow preview for pharmacist dashboard demo
    }
    return sendSuccess(res, prescriptions, 'Prescriptions retrieved');
  } catch (error) {
    next(error);
  }
};

export const updatePrescriptionStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    if (!status) {
      return sendError(res, 'Status is required (e.g. approved, rejected, pending)', 400);
    }

    const updated = Prescription.updateStatus(Number(id), status.toLowerCase(), notes || '');
    return sendSuccess(res, updated, `Prescription status updated to ${status}`);
  } catch (error) {
    next(error);
  }
};
