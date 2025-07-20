import { getStore } from "@netlify/blobs";

export default async (req) => {
  try {
    const { id } = await req.json();
    if (!id) {
      return new Response(JSON.stringify({ message: 'ID tamu diperlukan.' }), { status: 400 });
    }

    const store = getStore("checkins");
    
    // Cek apakah ID tamu sudah ada di Blob Store
    const existingCheckin = await store.get(id);

    if (existingCheckin) {
      // Jika sudah ada, tamu sudah pernah check-in
      return new Response(JSON.stringify({ message: 'Tamu sudah pernah check-in!' }), {
        status: 409, // Conflict
      });
    }

    // Jika belum ada, simpan ID tamu ke Blob Store dengan metadata waktu
    await store.set(id, `Checked in at ${new Date().toISOString()}`, {
      metadata: { timestamp: new Date().toISOString() }
    });
    
    // Ambil nama tamu dari database.json untuk pesan respons yang lebih ramah
    // Ini adalah langkah opsional tapi sangat direkomendasikan
    const siteURL = new URL(req.url).origin;
    const dbResponse = await fetch(`${siteURL}/database.json`);
    const guestList = await dbResponse.json();
    const guest = guestList.find(g => g.id == id);
    const guestName = guest ? guest.name : 'Tamu';

    return new Response(JSON.stringify({ message: `Selamat Datang, ${guestName}!` }), {
      status: 200,
    });

  } catch (error) {
    return new Response(JSON.stringify({ message: `Error: ${error.message}` }), {
      status: 500,
    });
  }
};
