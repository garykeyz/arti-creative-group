from pathlib import Path
import re
root=Path('dist/demo')
def edit(name,fn):
 p=root/name;old=p.read_text();new=fn(old);p.write_text(new)
def swap(s,a,b):
 if a not in s:raise ValueError('Missing expected source: '+a[:100])
 return s.replace(a,b)
def app(s):
 s=swap(s,"'<div class=\"brand\"><span class=\"brand-mark\">a</span><span class=\"brand-name\">ARTI</span></div>'", "'<div class=\"brand\"><img class=\"demo-logo-light\" src=\"arti-logo-light.svg\" width=\"680\" height=\"220\" alt=\"arti\"><img class=\"demo-logo-dark\" src=\"arti-logo-dark.svg\" width=\"680\" height=\"220\" alt=\"arti\"></div>'")
 s=swap(s,'async function switchView(view) {','async function switchView(view) {\n  if (!artiRoles.some(([id]) => id === view)) { toast("Esta perspectiva no está disponible en la demo pública."); return; }')
 s=swap(s,'["cliente", "musico", "lider", "empresa", "agencia", "admin"].includes(', '["cliente", "musico", "lider", "empresa", "agencia"].includes(')
 s=swap(s,'if (state.user) await startSession();','if (state.user && ArtiDomain.role(state.user) === "ADMIN") { await api("/api/auth/logout", {}); state.user = null; }\n    if (state.user) await startSession();')
 return re.sub(r'(?<![A-Za-z0-9_])ARTIVO(?![A-Za-z0-9_])','ARTI',s)
def ui(s):
 s=swap(s,'  ["admin", "Admin"],\n','')
 s=swap(s,'.filter((u) => !u.suspended)','.filter((u) => !u.suspended && ArtiDomain.role(u) !== "ADMIN")')
 s=swap(s,'await switchView("admin");\n      artiUI.tab', 'await switchView("cliente");\n      artiUI.tab')
 s=s.replace(' Admin tiene un botón especial para avanzar el evento sin esperar el reloj.','')
 s=s.replace(' Usa Admin para avanzar libremente.','')
 return s
def demo(s):
 s=swap(s,'async function request(path, data) {','async function request(path, data) {\n    if (path.startsWith("/api/admin") || (path === "/api/auth/login" && String(data?.email || "").toLowerCase().startsWith("admin@"))) throw Error("Esta opción no está disponible en la demo pública.");')
 return s
def feed(s):
 s=s.replace('Descubre, contrata, coordina y paga talento para eventos.<br>Una demo funcional desde seis perspectivas.','Explora cómo conectar talento y oportunidades.<br>Cinco perspectivas con datos y operaciones simuladas.')
 s=s.replace('ARTIVO · Talento activo. Bajo demanda.','ARTI · Talento activo. Bajo demanda.')
 s=s.replace('href="${esc(window.ARTIVO_SOURCE_URL || "https://github.com/garykeyz/artivo")}" target="_blank" rel="noopener">Ver proyecto ↗','href="../#futuro">Volver a ARTI ↗')
 s=s.replace('Cliente, Artista, Líder, Empresa, Agencia y Admin.','Cliente, Artista, Líder, Empresa y Agencia.').replace('las seis perspectivas demo','las cinco perspectivas demo')
 return s
def payments(s):
 s=swap(s,'<button class="btn" id="money-scenario">Abrir controles de cancelación</button>','')
 s=swap(s,'  $("#money-scenario").onclick = async () => {\n    await switchView("admin");\n    $("#tutorial-root").innerHTML = "";\n    await navigate("settings");\n  };\n','')
 return s
edit('app.js',app);edit('arti-ui.js',ui);edit('demo.js',demo);edit('feed.js',feed);edit('arti-payments-ui.js',payments)
p=root/'index.html';s=p.read_text().replace('demo funcional de artistas, líderes, empresas, agencias y administración.','demo funcional de artistas, líderes, empresas y agencias.').replace('Demo funcional de artistas, líderes, empresas, agencias y administración.','Demo funcional de artistas, líderes, empresas y agencias.').replace('content="#143c34"','content="#FFF8F2"').replace('href="favicon.svg" type="image/svg+xml"','href="favicon.ico"').replace('<link rel="stylesheet" href="style.css" />','<script>try{const t=localStorage.getItem("arti-theme");document.documentElement.dataset.theme=t==="dark"||t==="light"?t:matchMedia("(prefers-color-scheme:dark)").matches?"dark":"light"}catch{}</script>\n    <link rel="stylesheet" href="style.css" /><link rel="stylesheet" href="brand.css" />').replace('  <body>','  <body>\n    <div class="demo-toolbar"><a href="../#futuro" class="back-site">← <span>Volver a ARTI</span></a><span class="demo-label">DEMO · DATOS SIMULADOS</span><button id="demo-theme" type="button" aria-label="Cambiar tema">◐</button></div>').replace('ARTIVO<span>Cargando tu próxima experiencia…','ARTI<span>Cargando tu próxima experiencia…').replace('    <script src="app.js" defer></script>','    <script src="theme.js" defer></script>\n    <script src="app.js" defer></script>');p.write_text(s)
