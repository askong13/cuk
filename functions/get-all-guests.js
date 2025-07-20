import { getStore } from "@netlify/blobs";

export default async () => {
  try {
    const store = getStore("checkins");
    const { blobs } = await store.list();

    return new Response(JSON.stringify(blobs), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
};
