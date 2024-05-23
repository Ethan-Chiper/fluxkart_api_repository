const ContactRepository = require('../repositories/contactRepository');

class ContactController {
  static async identify(req, res) {
    const { email, phoneNumber } = req.body;

    let primaryContact = null;
    let secondaryContacts = [];
    let contactIds = new Set();
    let emails = new Set();
    let phoneNumbers = new Set();

    const existingContacts = await ContactRepository.findAllByEmailOrPhone(email, phoneNumber);

    for (const contact of existingContacts) {
      if (!primaryContact) {
        primaryContact = contact;
      } else {
        if (new Date(contact.createdAt) < new Date(primaryContact.createdAt)) {
          await ContactRepository.update(primaryContact.id, { linkPrecedence: 'secondary' });
          await ContactRepository.update(contact.id, { linkPrecedence: 'primary' });
          primaryContact = contact;
        } else {
          await ContactRepository.update(contact.id, { linkPrecedence: 'secondary' });
        }
      }

      contactIds.add(contact.id);
      if (contact.email) emails.add(contact.email);
      if (contact.phoneNumber) phoneNumbers.add(contact.phoneNumber);
    }

    if (!primaryContact) {
      primaryContact = await ContactRepository.create({
        email,
        phoneNumber,
        linkPrecedence: 'primary',
      });
      if (email) emails.add(email);
      if (phoneNumber) phoneNumbers.add(phoneNumber);
    }

    if (primaryContact.email !== email || primaryContact.phoneNumber !== phoneNumber) {
      const newContact = await ContactRepository.create({
        email,
        phoneNumber,
        linkedId: primaryContact.id,
        linkPrecedence: 'secondary',
      });
      secondaryContacts.push(newContact);
      contactIds.add(newContact.id);
      if (email) emails.add(email);
      if (phoneNumber) phoneNumbers.add(phoneNumber);
    }

    res.status(200).json({
      contact: {
        primaryContactId: primaryContact.id,
        emails: Array.from(emails),
        phoneNumbers: Array.from(phoneNumbers),
        secondaryContactIds: Array.from(contactIds).filter(id => id !== primaryContact.id),
      },
    });
  }
}

module.exports = ContactController;
