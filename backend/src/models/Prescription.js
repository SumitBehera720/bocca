import db from '../config/database.js';

export const Prescription = {
  create: ({ userId, orderId, patientName, doctorName, prescriptionFile, status = 'Pending Verification', notes = '' }) => {
    const stmt = db.prepare(`
      INSERT INTO prescriptions (user_id, order_id, patient_name, doctor_name, prescription_file, status, pharmacist_notes)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    const info = stmt.run(userId || null, orderId || null, patientName, doctorName || '', prescriptionFile, status, notes);
    return Prescription.findById(info.lastInsertRowid);
  },

  findById: (id) => {
    const stmt = db.prepare(`
      SELECT 
        pr.id,
        pr.user_id AS userId,
        pr.order_id AS orderId,
        pr.patient_name AS patientName,
        pr.doctor_name AS doctorName,
        pr.prescription_file AS prescriptionFile,
        pr.status,
        pr.pharmacist_notes AS pharmacistNotes,
        pr.created_at AS createdAt,
        u.username AS userName,
        u.email AS userEmail
      FROM prescriptions pr
      LEFT JOIN users u ON pr.user_id = u.id
      WHERE pr.id = ?
    `);
    return stmt.get(id);
  },

  findAll: () => {
    const stmt = db.prepare(`
      SELECT 
        pr.id,
        pr.user_id AS userId,
        pr.order_id AS orderId,
        pr.patient_name AS patientName,
        pr.doctor_name AS doctorName,
        pr.prescription_file AS prescriptionFile,
        pr.status,
        pr.pharmacist_notes AS pharmacistNotes,
        pr.created_at AS createdAt,
        u.username AS userName,
        u.email AS userEmail
      FROM prescriptions pr
      LEFT JOIN users u ON pr.user_id = u.id
      ORDER BY pr.created_at DESC
    `);
    return stmt.all();
  },

  findByUserId: (userId) => {
    const stmt = db.prepare(`
      SELECT 
        pr.id,
        pr.user_id AS userId,
        pr.order_id AS orderId,
        pr.patient_name AS patientName,
        pr.doctor_name AS doctorName,
        pr.prescription_file AS prescriptionFile,
        pr.status,
        pr.pharmacist_notes AS pharmacistNotes,
        pr.created_at AS createdAt
      FROM prescriptions pr
      WHERE pr.user_id = ?
      ORDER BY pr.created_at DESC
    `);
    return stmt.all(userId);
  },

  updateStatus: (id, status, notes = '') => {
    const stmt = db.prepare(`
      UPDATE prescriptions 
      SET status = ?, pharmacist_notes = ?
      WHERE id = ?
    `);
    stmt.run(status, notes, id);

    // If linked to an order, update order prescription_status as well
    const rx = Prescription.findById(id);
    if (rx && rx.orderId) {
      db.prepare(`UPDATE orders SET prescription_status = ? WHERE id = ?`).run(status, rx.orderId);
    }

    return Prescription.findById(id);
  }
};

export default Prescription;
