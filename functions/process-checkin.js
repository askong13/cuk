import { getStore } from "@netlify/blobs";

export default async (req) => {
  // Hanya izinkan metode POST
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ message: 'Metode tidak diizinkan.' }), { status: 405 });
  }

  try {
    const { id } = await req.json();
    if (!id) {
      return new Response(JSON.stringify({ message: 'ID tamu diperlukan.' }), { status: 400 });
    }

    // Hubungkan ke 'checkins' blob store
    const store = getStore("checkins");
    
    // Cek apakah ID tamu sudah ada di Blob Store
    const existingCheckin = await store.get(id);

    if (existingCheckin) {
      // Jika sudah ada, tamu sudah pernah check-in
      return new Response(JSON.stringify({ message: '⚠️ Tamu sudah pernah check-in!' }), {
        status: 409, // Conflict
      });
    }

    // Jika belum ada, simpan ID tamu ke Blob Store
    await store.set(id, `Checked in at ${new Date().toISOString()}`, {
      metadata: { timestamp: new Date().toISOString() }
    });
    
    // Ambil nama tamu dari database.json untuk pesan respons yang ramah
    const siteURL = new URL(req.url).origin;
    const dbResponse = await fetch(`${siteURL}/database.json`);
    const guestList = await dbResponse.json();
    const guest = guestList.find(g => String(g.id) === String(id)); // Pastikan perbandingan string
    const guestName = guest ? guest.name : 'Tamu Tak Dikenal';

    return new Response(JSON.stringify({ message: `✅ Selamat Datang, ${guestName}!` }), {
      status: 200,
    });

  } catch (error) {
    // Tangkap semua error lain
    console.error("Fungsi process-checkin gagal:", error);
    return new Response(JSON.stringify({ message: `❌ Terjadi error internal di server.` }), {
      status: 500,
    });
  }
};
