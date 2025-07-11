
export default async function handler(req, res) { if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

const { name, ram, disk, cpu, egg } = req.body;

const panelUrl = "https://lenzzofficial.serverku.biz.id"; // Ganti dengan domain panel kamu const apikey = "PTLA_APIKEY_KAMU"; // Ganti dengan API key kamu

const username = name.toLowerCase().replace(/[^a-z0-9]/g, ""); const email = ${username}@gmail.com; const password = Math.random().toString(36).slice(-10);

try { // 1. Buat User Baru const userRes = await fetch(${panelUrl}/api/application/users, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': Bearer ${apikey}, 'Accept': 'Application/vnd.pterodactyl.v1+json' }, body: JSON.stringify({ username: username, email: email, first_name: name, last_name: 'User', password: password }) });

const userData = await userRes.json();
if (userRes.status !== 201) return res.status(500).json({ error: 'Gagal buat user', detail: userData });

const userId = userData.attributes.id;

// 2. Buat Server
const serverRes = await fetch(`${panelUrl}/api/application/servers`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${apikey}`,
    'Accept': 'Application/vnd.pterodactyl.v1+json'
  },
  body: JSON.stringify({
    name,
    user: userId,
    egg: parseInt(egg),
    docker_image: "ghcr.io/parkervcp/yolks:nodejs_18",
    startup: "npm start",
    environment: {
      CMD_RUN: "npm start",
      AUTO_UPDATE: "1"
    },
    limits: { memory: ram, swap: 0, disk, io: 500, cpu },
    feature_limits: { databases: 0, allocations: 1, backups: 0 },
    deploy: { locations: [1], dedicated_ip: false, port_range: [] },
    start_on_completion: true
  })
});

const serverData = await serverRes.json();
if (serverRes.status !== 201) return res.status(500).json({ error: 'Gagal buat server', detail: serverData });

return res.status(200).json({
  message: '✅ Server berhasil dibuat!',
  user: { email, username, password },
  server: {
    id: serverData.attributes.id,
    name: serverData.attributes.name,
    panel: panelUrl,
    specs: { ram, disk, cpu }
  }
});

} catch (err) { return res.status(500).json({ error: 'Internal error', detail: err.message }); } }

