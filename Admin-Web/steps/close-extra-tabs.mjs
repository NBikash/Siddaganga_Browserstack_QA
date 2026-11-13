// Closes every page tab except the first via Chrome's DevTools HTTP endpoint (works even when CDP websocket attach is slow).
const PORT = process.env.ADMIN_WEB_CDP_PORT || 9333;
const pages = (await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json()).filter(t => t.type === 'page');
const keep = pages.find(p => p.url.includes('/dashboard')) || pages[0];
let n = 0;
for (const p of pages) if (p.id !== keep?.id) { await fetch(`http://127.0.0.1:${PORT}/json/close/${p.id}`); n++; }
console.log(`closed ${n} extra tab(s)`);
