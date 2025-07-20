const fs = require('fs');
const path = require('path');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const dataPath = path.join(__dirname, '../database.json');
    const { code } = JSON.parse(event.body); // 'code' biasanya email atau nama unik

    const raw = fs.readFileSync(dataPath);
    const database = JSON.parse(raw);

    const guest = database.guests.find(g => g.email === code || g.name === code);

    if (!guest) {
      return {
        statusCode: 404,
        body: JSON.stringify({ success: false, message: 'Tamu tidak ditemukan.' }),
      };
    }

    guest.checkedIn = true;
    fs.writeFileSync(dataPath, JSON.stringify(database, null, 2));

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, message: 'Check-in berhasil.' }),
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ success: false, message: 'Terjadi kesalahan server.' }) };
  }
};