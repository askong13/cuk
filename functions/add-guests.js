const faunadb = require('faunadb');
const q = faunadb.query;

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const client = new faunadb.Client({
    secret: process.env.FAUNADB_SECRET_KEY,
    domain: 'db.fauna.com',
    scheme: 'https',
  });

  try {
    const { name } = JSON.parse(event.body);
    if (!name) {
      return { statusCode: 400, body: 'Nama tamu diperlukan.' };
    }

    const result = await client.query(
      q.Create(q.Collection('guests'), {
        data: {
          name: name,
          isCheckedIn: false,
          checkInTimestamp: null,
          createdAt: q.Now(),
        },
      })
    );

    return {
      statusCode: 200,
      body: JSON.stringify({ guest: result }),
    };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};
