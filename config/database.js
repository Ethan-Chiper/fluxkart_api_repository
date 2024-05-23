const mysql = require('mysql2');

const pool = mysql.createPool({
  host: 3306,
  user: 'root',
  password: 'Arulmani@mysql',
  database: 'fluxkart'
});

pool.query(`
  CREATE TABLE IF NOT EXISTS Contacts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    phoneNumber VARCHAR(255),
    email VARCHAR(255),
    linkedId INT,
    linkPrecedence ENUM('primary', 'secondary'),
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deletedAt TIMESTAMP NULL
  )
`, (err, results) => {
  if (err) {
    console.error('Error creating Contacts table:', err);
  } else {
    console.log('Contacts table created or already exists.');
  }
});

module.exports = pool.promise();
