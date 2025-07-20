const fs = require('fs');
const path = require('path');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const dataPath = path.join(__dirname, '../database.json');
    const { name, email } = JSON.parse(event.body);

    if (!name || !email) {
      return { statusCode: 400, body: JSON.stringify({ success: false, message: 'Nama dan email wajib diisi.' }) };
    }

    const raw = fs.readFileSync(dataPath);
    const database = JSON.parse(raw);

    database.guests.push({ name, email, checkedIn: false });
    fs.writeFileSync(dataPath, JSON.stringify(database, null, 2));

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, message: 'Tamu berhasil ditambahkan.' }),
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ success: false, message: 'Server error' }) };
  }
};