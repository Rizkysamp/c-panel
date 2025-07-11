export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  const API_KEY = "ptla_kKep5NCdEHYv5qaF0ff1i2zg1Bo7VXJLzuaPubwMPzx"; // GANTI dengan API Key Pterodactyl kamu
  const PANEL_URL = "https://lenzzofficial.serverku.biz.id"; // GANTI dengan domain panel kamu

  try {
    const response = await fetch(`${PANEL_URL}/api/application/servers`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEY}`,
        "Accept": "Application/vnd.pterodactyl.v1+json"
      },
      body: JSON.stringify(req.body)
    });

    const result = await response.json();
    res.status(response.status).json(result);
  } catch (err) {
    res.status(500).json({ error: 'Gagal menghubungi panel', detail: err.message });
  }
}
