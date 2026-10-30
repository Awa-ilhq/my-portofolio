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
  { title: 'Temukan Kopi', desc: 'Projek TemukanKopi adalah aplikasi web untuk mencari, menampilkan, dan mengelola data kedai kopi guna mengatasi masalah informasi tempat kopi yang tersebar serta memudahkan pemilihannya. Platform ini menyediakan katalog dan detail kedai kopi bagi pengunjung, sekaligus fitur dashboard admin untuk membantu pengelola mencatat data produk dan transaksi secara terpusat.', tags: ['Website','Larevel', '[php]'], image: 'images/p1.jpg', demo: 'https://temukankopi.com', repo: 'https://github.com/Awa-ilhq' },
  { title: 'Servic', desc: 'Projek Servic adalah aplikasi Android berbasis **Kotlin** yang dibuat untuk memenuhi tugas akhir/UAS perkuliahan. Aplikasi ini berfokus pada fitur modul edukasi, pengelolaan data aplikasi, serta pengintegrasian logika antarmuka pengguna (UI) Android. ', tags: ['aplication', '[kotlin]'], image: 'images/p2.jpg', demo: '#', repo: 'https://github.com/breliandwioktaviani/cobauas.git' },
  { title: 'Find-Up', desc: 'Projek Find-Up adalah aplikasi Android berbasis Kotlin yang dikembangkan sebagai projek Tugas Akhir/UAS. Aplikasi ini berfungsi untuk mendukung pengunggahan dan penayangan gambar, yang dilengkapi dengan fitur otentikasi pengguna (login dan registrasi) serta integrasi **Firebase** untuk penyimpanan data dan foto.', tags: ['application', 'firebase','[kotlin]'], image: 'images/p3.jpg', demo: '#', repo: 'https://github.com/AmeliaCandra21/findup.git' },
  { title: 'SastraCode', desc: 'Projek Sastracode adalah aplikasi web portofolio/profil interaktif yang dibangun menggunakan **React** dan **Vite** dengan JavaScript, CSS, serta HTML untuk menampilkan informasi, karya, atau identitas dari Sastracode.', tags: ['javascript', 'css','[website]'], image: 'images/p4.jpg', demo: 'https://profil-sastracode.vercel.app/', repo: 'https://github.com/Awa-ilhq/profil-sastracode.git' },
  { title: 'Projek 5', desc: '[deskripsi lengkap projek 5]', tags: ['[tech]'], image: 'images/p5.jpg', demo: '#', repo: '#' },
  { title: 'Projek 6', desc: '[deskripsi lengkap projek 6]', tags: ['[tech]'], image: 'images/p6.jpg', demo: '#', repo: '#' },

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