const fs = require('fs');
const path = require('path');

exports.handler = async () => {
  try {
    const dataPath = path.join(__dirname, '../database.json');
    const raw = fs.readFileSync(dataPath);
    const database = JSON.parse(raw);

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, guests: database.guests }),
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ success: false, message: 'Gagal memuat data tamu.' }) };
  }
};