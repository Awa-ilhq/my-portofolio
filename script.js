// Muncul halus saat di-scroll
const io = new IntersectionObserver((es) => es.forEach((e) => {
  if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
}), { threshold: 0.15 });
document.querySelectorAll('.reveal').forEach((el) => io.observe(el));

// Tandai menu aktif sesuai section
const links = [...document.querySelectorAll('.top nav .bx')];
const secs = links.map((a) => document.querySelector(a.getAttribute('href')));
addEventListener('scroll', () => {
  const y = scrollY + 140;
  secs.forEach((s, i) => links[i].classList.toggle('on', s.offsetTop <= y && y < s.offsetTop + s.offsetHeight));
  // Parallax tipis pada judul hero
  const t = document.querySelector('.shadow');
  if (t && !matchMedia('(prefers-reduced-motion: reduce)').matches) t.style.transform = `translateY(${scrollY * 0.12}px)`;
}, { passive: true });

// ===== DATA PROJEK: tambah atau ubah projek di sini =====
const projects = [
  { title: 'Temukan Kopi', desc: 'Projek TemukanKopi adalah aplikasi web untuk mencari, menampilkan, dan mengelola data kedai kopi guna mengatasi masalah informasi tempat kopi yang tersebar serta memudahkan pemilihannya. Platform ini menyediakan katalog dan detail kedai kopi bagi pengunjung, sekaligus fitur dashboard admin untuk membantu pengelola mencatat data produk dan transaksi secara terpusat.', tags: ['Website','Larevel', 'php'], image: 'images/p1.jpg', demo: 'https://temukankopi.com', repo: 'https://github.com/Awa-ilhq' },
  { title: 'Servic', desc: 'Projek Servic adalah aplikasi Android berbasis **Kotlin** yang dibuat untuk memenuhi tugas akhir/UAS perkuliahan. Aplikasi ini berfokus pada fitur modul edukasi, pengelolaan data aplikasi, serta pengintegrasian logika antarmuka pengguna (UI) Android. ', tags: ['aplication', 'kotlin'], image: 'images/p2.jpg', demo: '#', repo: 'https://github.com/breliandwioktaviani/cobauas.git' },
  { title: 'Find-Up', desc: 'Projek Find-Up adalah aplikasi Android berbasis Kotlin yang dikembangkan sebagai projek Tugas Akhir/UAS. Aplikasi ini berfungsi untuk mendukung pengunggahan dan penayangan gambar, yang dilengkapi dengan fitur otentikasi pengguna (login dan registrasi) serta integrasi **Firebase** untuk penyimpanan data dan foto.', tags: ['application', 'firebase','kotlin'], image: 'images/p3.jpg', demo: '#', repo: 'https://github.com/AmeliaCandra21/findup.git' },
  { title: 'SastraCode', desc: 'Projek Sastracode adalah aplikasi web portofolio/profil interaktif yang dibangun menggunakan **React** dan **Vite** dengan JavaScript, CSS, serta HTML untuk menampilkan informasi, karya, atau identitas dari Sastracode.', tags: ['javascript', 'css','[website]'], image: 'images/p4.jpg', demo: 'https://profil-sastracode.vercel.app/', repo: 'https://github.com/Awa-ilhq/profil-sastracode.git' },
{ title: 'Flodify', desc: 'Floodify adalah proyek sistem deteksi dan peringatan dini banjir berbasis IoT yang menggunakan ESP32 dan tiga sensor (Ultrasonic, Raindrop, dan DHT11) untuk memantau ketinggian air, curah hujan, suhu, serta kelembapan secara real-time. Data dikirim ke Firebase dan ditampilkan melalui aplikasi web dan mobile. Sistem juga menggunakan LED dan buzzer sebagai peringatan ketika kondisi mencapai status siaga atau bahaya.', tags: ['IOT', 'Sensor'], image: 'images/p5.jpg'},

];

// ===== Kartu projek + tombol lihat semua =====
const LIMIT = 6;
const $ = (id) => document.getElementById(id);
const grid = $('projectGrid'), toggleBtn = $('toggleBtn');
let showAll = false;

function renderProjects() {
  const list = showAll ? projects : projects.slice(0, LIMIT);
  grid.innerHTML = list.map((p, i) => `
    <article class="card" data-i="${i}" tabindex="0" role="button" aria-label="Lihat detail ${p.title}">
      <div class="ph g${i % 4}" style="--img:url('${p.image}')"></div>
      <h3>${p.title}</h3>
      <p>${p.desc.length > 90 ? p.desc.slice(0, 90) + '…' : p.desc}</p>
      <div class="tags">${p.tags.map((t) => `<span>${t}</span>`).join('')}</div>
    </article>`).join('');
  toggleBtn.textContent = showAll ? 'Tampilkan lebih sedikit' : `Lihat semua (${projects.length})`;
  toggleBtn.style.display = projects.length > LIMIT ? '' : 'none';
}

toggleBtn.addEventListener('click', () => {
  showAll = !showAll;
  renderProjects();
  if (!showAll) $('projek').scrollIntoView({ behavior: 'smooth' });
});

// ===== Pop up detail projek =====
const modal = $('modal');
let lastFocus = null;

function openModal(i) {
  const p = projects[i];
  lastFocus = document.activeElement;
  $('mImg').className = `modal-img g${i % 4}`;
  $('mImg').style.setProperty('--img', `url('${p.image}')`);
  $('mTitle').textContent = p.title;
  $('mDesc').textContent = p.desc;
  $('mTags').innerHTML = p.tags.map((t) => `<span>${t}</span>`).join('');
  $('mLinks').innerHTML =
    (p.demo && p.demo !== '#' ? `<a class="bx" href="${p.demo}" target="_blank" rel="noopener">Demo</a>` : '') +
    (p.repo && p.repo !== '#' ? `<a class="bx" href="${p.repo}" target="_blank" rel="noopener">GitHub</a>` : '');
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  $('modalClose').focus();
}

function closeModal() {
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  if (lastFocus) lastFocus.focus();
}

grid.addEventListener('click', (e) => {
  const c = e.target.closest('.card');
  if (c) openModal(+c.dataset.i);
});
grid.addEventListener('keydown', (e) => {
  const c = e.target.closest('.card');
  if (c && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); openModal(+c.dataset.i); }
});
modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
$('modalClose').addEventListener('click', closeModal);
addEventListener('keydown', (e) => { if (e.key === 'Escape' && modal.classList.contains('open')) closeModal(); });

renderProjects();


// ===== SKILLS: kategori, panel, dan 2 baris tools berjalan =====
const skillGroups = [
  { tab: 'Frontend', title: 'Frontend Development', desc: 'Saya membangun antarmuka web yang rapi, responsif, dan nyaman dipakai, mulai dari HTML, CSS, dan JavaScript hingga React serta Tailwind CSS untuk mempercepat pengerjaan tampilan. Saya juga mengerjakan aplikasi web interaktif dengan Flutter Web, termasuk saat magang di PT Thunder Labs Indonesia, di mana saya menerapkan pengujian antarmuka dan pengembangan berbasis spesifikasi. Saya juga pernah mengintegrasikan aplikasi dengan RESTful API dan memastikan halaman tetap enak dibuka di layar besar maupun HP.', items: ['HTML5', 'CSS3', 'JavaScript', 'React', 'Tailwind CSS', 'Flutter Web', 'Responsive Design'], image: 'images/s2.jpg' },
  { tab: 'Backend', title: 'Backend & Database', desc: 'Di sisi server, saya mengerjakan logika aplikasi dan pengelolaan data dengan PHP dan Laravel, serta mengenal Node.js, Python, dan Java untuk kebutuhan yang berbeda. Saya memakai MySQL untuk merancang dan mengelola database, dan membiasakan diri menulis kode yang terstruktur supaya mudah dikembangkan bersama tim. Pemahaman backend ini membantu saya membangun antarmuka yang benar-benar nyambung dengan alur data di baliknya, bukan hanya tampilannya.', items: ['PHP', 'Laravel', 'Node.js', 'Python', 'Java', 'MySQL'], image: 'images/s1.jpg' },
  { tab: 'Cloud & Data', title: 'Cloud, AI & Data', desc: 'Saya aktif menjelajahi dunia cloud, data, dan AI. Lewat pelatihan Digital Talent Academy, Microsoft, dan AWS, saya mempelajari dasar data science, Microsoft Fabric, layanan Microsoft Azure untuk generative AI, serta konsep cloud di AWS. Saya juga tertarik pada Retrieval-Augmented Generation (RAG) dan integrasi generative AI ke dalam aplikasi, supaya fitur cerdas bisa dibangun dengan data yang relevan.', items: ['Microsoft Azure', 'AWS', 'Microsoft Fabric', 'Data Science', 'RAG', 'Generative AI'], image: 'images/s3.jpg' },
  { tab: 'Prinsip', title: 'Prinsip Rekayasa', desc: 'Bagi saya, kode yang baik bukan hanya yang jalan, tapi juga mudah dibaca, diuji, dan dirawat. Karena itu saya mempelajari OOP, prinsip SOLID, dan arsitektur software, lalu menerapkannya dalam struktur proyek. Saya juga membiasakan pengujian otomatis dan pengecekan kualitas, serta memakai pendekatan spec-driven development dengan Kiro AI IDE agar tiap fitur dikerjakan berdasarkan spesifikasi yang jelas.', items: ['OOP', 'SOLID', 'Software Architecture', 'Automated Testing', 'Spec-Driven Development'], image: 'images/s4.jpg' },
];
let skIdx = 0;

function renderSkills() {
  $('skTabs').innerHTML = skillGroups.map((g, i) =>
    `<button type="button" class="sk-tab${i === skIdx ? ' on' : ''}" data-i="${i}">${g.tab}</button>`).join('');
  const g = skillGroups[skIdx];
  $('skTitle').textContent = g.title;
  $('skDesc').textContent = g.desc;
  $('skChips').innerHTML = g.items.map((t) => `<span>${t}</span>`).join('');
  $('skImg').className = `sk-img g${skIdx % 4}`;
  $('skImg').style.setProperty('--img', `url('${g.image}')`);
  const p = $('skPanel');
  p.classList.remove('swap'); void p.offsetWidth; p.classList.add('swap');
}

$('skTabs').addEventListener('click', (e) => {
  const b = e.target.closest('.sk-tab');
  if (b) { skIdx = +b.dataset.i; renderSkills(); }
});
renderSkills();

// Baris tools: [nama, kode ikon]. Kosongkan kode ikon kalau tidak ada logonya.
const rowA = [['Laravel', 'laravel'], ['Flutter', 'flutter'], ['PHP', 'php'], ['JavaScript', 'javascript'], ['React', 'react'], ['Node.js', 'nodedotjs'], ['Python', 'python'], ['Java', 'openjdk'], ['Generative AI', ''], ['RAG', ''], ['Data Science', '']];
const rowB = [['Software Architecture', ''], ['OOP', ''], ['Microsoft Azure', 'microsoftazure'], ['AWS', 'amazonaws'], ['Microsoft Fabric', ''], ['Cloud Computing', ''], ['HTML5', 'html5'], ['CSS3', 'css'], ['MySQL', 'mysql'], ['Git', 'git'], ['VS Code', 'visualstudiocode']];

function fillTrack(id, row, offset) {
  const one = row.map(([n, s], i) =>
    `<span class="badge c${(i + offset) % 4}">${s ? `<img src="https://cdn.simpleicons.org/${s}/000" alt="" onerror="this.remove()">` : ''}${n}</span>`).join('');
  $(id).innerHTML = one.repeat(4);
}
fillTrack('trackA', rowA, 0);
fillTrack('trackB', rowB, 2);