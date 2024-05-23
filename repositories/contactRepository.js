const db = require('../config/database');
const Contact = require('../models/contact');

class ContactRepository {
  static async findAllByEmailOrPhone(email, phoneNumber) {
    const [rows] = await db.query(
      `SELECT * FROM Contacts WHERE (email = ? OR phoneNumber = ?) AND deletedAt IS NULL`,
      [email, phoneNumber]
    );
    return rows.map(row => new Contact(row.id, row.phoneNumber, row.email, row.linkedId, row.linkPrecedence, row.createdAt, row.updatedAt, row.deletedAt));
  }

  static async create(contact) {
    const [result] = await db.query(
      `INSERT INTO Contacts (phoneNumber, email, linkedId, linkPrecedence) VALUES (?, ?, ?, ?)`,
      [contact.phoneNumber, contact.email, contact.linkedId, contact.linkPrecedence]
    );
    return { id: result.insertId, ...contact };
  }

  static async update(id, updates) {
    const fields = Object.keys(updates).map((field) => `${field} = ?`).join(', ');
    const values = Object.values(updates);
    values.push(id);

    await db.query(
      `UPDATE Contacts SET ${fields}, updatedAt = CURRENT_TIMESTAMP WHERE id = ?`,
      values
    );
  }
}

module.exports = ContactRepository;
