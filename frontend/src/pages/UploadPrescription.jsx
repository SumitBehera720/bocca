import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  FaUpload, 
  FaFilePrescription, 
  FaCheckCircle, 
  FaUserMd, 
  FaShieldAlt, 
  FaClock, 
  FaPhoneAlt,
  FaArrowRight
} from 'react-icons/fa';
import prescriptionService from '../services/prescriptionService';

const UploadPrescription = () => {
  const navigate = useNavigate();
  const [patientName, setPatientName] = useState('');
  const [doctorName, setDoctorName] = useState('');
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      if (selectedFile.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setFilePreview(reader.result);
        };
        reader.readAsDataURL(selectedFile);
      } else {
        setFilePreview(null);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please upload an image or PDF of your doctor prescription.');
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('patientName', patientName);
    formData.append('doctorName', doctorName);
    formData.append('prescription', file);
    if (notes) formData.append('notes', notes);

    try {
      const res = await prescriptionService.uploadPrescription(formData);
      setSuccess(res.data);
    } catch (err) {
      console.error('Prescription upload failed:', err);
      setError(err.response?.data?.message || 'Failed to upload prescription. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-bgColor min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header Breadcrumb */}
        <div className="mb-6 flex items-center gap-2 text-xs text-text font-medium">
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <span>/</span>
          <span className="text-heading font-semibold">Upload Prescription</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Form Box */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-8 border border-border shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-primaryLight text-primary rounded-2xl flex items-center justify-center text-2xl">
                <FaFilePrescription />
              </div>
              <div>
                <h1 className="text-2xl font-extrabold text-heading">Upload Doctor Prescription</h1>
                <p className="text-xs text-text">Fast 15-minute pharmacist review & medicine dispatch</p>
              </div>
            </div>

            {success ? (
              <div className="bg-primaryLight/40 border border-primary/20 rounded-2xl p-6 text-center space-y-4 animate-in fade-in zoom-in-95 duration-200">
                <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center text-3xl mx-auto shadow-lg shadow-primary/20">
                  <FaCheckCircle />
                </div>
                <h2 className="text-xl font-bold text-heading">Prescription Uploaded Successfully!</h2>
                <p className="text-xs text-text max-w-sm mx-auto">
                  Your prescription reference is <strong className="font-mono font-bold text-heading">#RX-{success.id}</strong>. Our licensed pharmacists are reviewing it and will prepare your medicines shortly.
                </p>
                <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <Link
                    to="/shop"
                    className="w-full sm:w-auto px-6 py-2.5 bg-primary hover:bg-primaryDark text-white text-xs font-bold rounded-xl shadow-sm transition-all"
                  >
                    Continue Shopping
                  </Link>
                  <Link
                    to="/shop"
                    className="w-full sm:w-auto px-6 py-2.5 bg-white border border-border text-heading text-xs font-semibold rounded-xl hover:bg-primaryLight transition-all"
                  >
                    Browse OTC Medicines
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 text-coral text-xs rounded-xl font-medium">
                    {error}
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-heading mb-1.5">Patient Full Name *</label>
                  <input
                    type="text"
                    required
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    placeholder="e.g. John Doe"
                    className="w-full text-xs p-3.5 bg-bgColor border border-border rounded-xl focus:bg-white focus:ring-2 focus:ring-primary outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-heading mb-1.5">Doctor / Clinic Name *</label>
                  <input
                    type="text"
                    required
                    value={doctorName}
                    onChange={(e) => setDoctorName(e.target.value)}
                    placeholder="e.g. Dr. Sarah Jenkins (City Care Clinic)"
                    className="w-full text-xs p-3.5 bg-bgColor border border-border rounded-xl focus:bg-white focus:ring-2 focus:ring-primary outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-heading mb-1.5">Prescription Document (Image or PDF) *</label>
                  <div className="border-2 border-dashed border-border hover:border-primary bg-bgColor hover:bg-primaryLight/30 transition-all rounded-2xl p-6 text-center cursor-pointer relative">
                    <input
                      type="file"
                      required
                      accept="image/*,.pdf"
                      onChange={handleFileChange}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    />
                    <FaUpload className="text-3xl text-primary mx-auto mb-2" />
                    <p className="text-xs font-bold text-heading">
                      {file ? file.name : 'Click or drag & drop prescription here'}
                    </p>
                    <p className="text-[11px] text-text mt-1">Supports JPG, PNG, WEBP, PDF (Max 10MB)</p>
                  </div>

                  {filePreview && (
                    <div className="mt-3 p-2 bg-bgColor rounded-xl max-w-xs mx-auto text-center border border-border">
                      <img src={filePreview} alt="Rx Preview" className="max-h-36 rounded-lg mx-auto object-contain" />
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-heading mb-1.5">Special Instructions / Required Dosage (Optional)</label>
                  <textarea
                    rows="3"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Provide any specific dosage requirement, days of supply, or allergy information..."
                    className="w-full text-xs p-3 bg-bgColor border border-border rounded-xl focus:bg-white focus:ring-2 focus:ring-primary outline-none transition-all"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-primary hover:bg-primaryDark text-white font-bold text-sm rounded-xl shadow-lg shadow-primary/20 flex items-center justify-center gap-2 transition-all"
                >
                  {loading ? 'Submitting to Pharmacist...' : (
                    <>
                      <FaUpload /> Submit Prescription for Verification <FaArrowRight />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Guidelines & Safety Checklist */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-border shadow-sm space-y-4">
              <h3 className="text-base font-bold text-heading flex items-center gap-2">
                <FaShieldAlt className="text-primary" /> Prescription Guidelines
              </h3>
              
              <ul className="space-y-3 text-xs text-text">
                <li className="flex items-start gap-2.5">
                  <FaCheckCircle className="text-primary mt-0.5 shrink-0" />
                  <span>Doctor's name, degree, and registration number must be clearly visible.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <FaCheckCircle className="text-primary mt-0.5 shrink-0" />
                  <span>Patient's name and prescription date must not be older than 6 months.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <FaCheckCircle className="text-primary mt-0.5 shrink-0" />
                  <span>Medicine names, strength, and dosage frequency should be legible.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <FaCheckCircle className="text-primary mt-0.5 shrink-0" />
                  <span>Doctor's signature and clinic stamp must be included on the document.</span>
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-primary to-primaryDark text-white rounded-3xl p-6 shadow-md space-y-3">
              <div className="flex items-center gap-2 font-bold text-sm">
                <FaClock /> Rapid 15-Min Pharmacist Check
              </div>
              <p className="text-xs text-primaryLight/90 leading-relaxed">
                Our in-house registered pharmacists inspect every prescription to ensure clinical safety, drug interaction checks, and accurate dosage dispensing.
              </p>
              <div className="pt-2 flex items-center gap-2 text-xs font-semibold text-primaryLight">
                <FaPhoneAlt /> Need help? Call Toll-Free 1-800-PHARMART
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadPrescription;
