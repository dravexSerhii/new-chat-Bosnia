const chat = document.getElementById('chat');
const splash = document.getElementById('splash');
setTimeout(() => {
  splash.classList.add('hide');
}, 1800);
const AV = '<img src="img/doc.jpg" alt="Doktorica" class="doctor-avatar">';
const TICK = '<svg viewBox="0 0 16 10"><path d="M1 5.5l3 3L10 1.5M7 6.5l1.5 1.5L15 1.5"/></svg>';
const sleep = ms => new Promise(r => setTimeout(r, ms));
const now = () => { const d = new Date(); return String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0') };
const down = () => { chat.scrollTop = chat.scrollHeight };
let last = 'me';

function row(html, { me = false, card = false, review = false } = {}) {
  const r = document.createElement('div');
  const cont = last === (me ? 'me' : 'bot');
  r.className = 'row' + (me ? ' me' : '') + (cont ? ' cont' : '');
  r.innerHTML = (me ? '' : `<div class="mini ${cont ? 'h' : ''}">${AV}</div>`) + `<div class="b ${card ? 'card' : ''} ${review ? 'review-bubble' : ''}">${html}</div>`;
  chat.appendChild(r); last = me ? 'me' : 'bot'; down(); return r;
}
const stamp = (me) => `<span class="t">${now()}${me ? TICK : ''}</span>`;
async function bot(html, opts = {}) {
  const st = document.getElementById('st'); st.textContent = 'kuca…';
  const prev = last;
  const ty = row('<div class="typing"><i></i><i></i><i></i></div>');
  const plain = html.replace(/<[^>]+>/g, '').length;
  await sleep((opts.fast ? 1500 : Math.min(1800 + plain * 45, 4500)) + 900);
  ty.remove(); last = prev;
  const r = row(html + (opts.card ? '' : stamp(false)), opts);
  st.textContent = 'online'; return r;
}
function user(text) { row(text + stamp(true), { me: true }); }
function choose(opts) {
  return new Promise(res => {
    const q = document.createElement('div'); q.className = 'qr';
    opts.forEach(o => {
      const b = document.createElement('button'); b.textContent = o;
      b.onclick = () => { q.remove(); user(o); res(o) }; q.appendChild(b)
    });
    chat.appendChild(q); down();
  });
}

const product = `
<div class="img"><span class="badge">−50%</span>
<img src="images/prod.png" alt="BoneControl" width="170"></div>
<div class="tx"><b>Krema „BoneControl“</b>
<div style="font-size:14px;color:#6b6880">Ublažava bol i vraća pokretljivost zglobova</div>
<div class="price"><s>60 BAM</s><strong>30 BAM</strong></div>${stamp(false)}</div>`;

function wave() { let h = '';[8, 14, 10, 20, 12, 22, 16, 9, 18, 24, 12, 8, 16, 20, 10, 14, 18, 8, 12, 16].forEach((v, i) => h += `<i class="${i < 7 ? 'on' : ''}" style="height:${v}px"></i>`); return h }
function review(name, age, image, rating, text) {
  const stars = rating === 4.5 ? '★★★★½' : '★★★★★';
  return `<div class="review-card"><div class="review-head"><img class="ava2" src="img/${image}" alt="Slika ${name}"><div class="review-author"><b>${name}, ${age} god.</b><span>Recenzija krema</span></div><span class="review-check" aria-label="Recenzija">✓</span></div><div class="review-rating"><span class="stars">${stars}</span><b>${String(rating).replace('.', ',')}</b><span class="out-of">/ 5</span></div><p>${text}</p></div>`;
}

async function run() {
  await sleep(2000);
  await bot('Zdravlje! 👋');
  await bot('Ja se zovem doktorica Amra, specijalista sam reumatologije.');
  await bot('Recite mi, da li vas muče bolovi u zglobovima?');
  const a1 = await choose(['Da, bole i krckaju', 'Ukočenost ujutro', 'Samo me zanima']);

  await bot(a1 === 'Samo me zanima' ? 'U redu, onda ću vam reći kako su drugi ljudi riješili ovaj problem 🙂' : 'Razumijem vas. Ovo je veoma čest problem, i što prije počnete sa liječenjem – to je bolji rezultat.');
  await bot('Koliko dugo ovo traje?');
  await choose(['Manje od mjesec dana', 'Od 1 do 6 mjeseci', 'Duže od pola godine']);

  await bot('Koliko imate godina?');
  await choose(['Do 35 godina', '35–50 godina', 'Stariji od 50 godina']);

  await bot('Hvala vam na odgovorima! Analizirala sam ih i odabrala rješenje za vas 👇');
  await bot('Ovo je krema „BoneControl“. Njen sastav uključuje ekstrakt bosvelije, hondroitin i glukozamin – oni hrane hrskavicu i smanjuju upalu.');
  await bot(product, { card: true });
  await bot('A ovo je naša reumatološkа – doktorica Amra. Ona će vam objasniti kako krema djeluje:');
  await bot(`<div class="doctor-card"><img src="img/doc.jpg" alt="Doktorica zdravstvenog centra"><div class="doctor-caption"><b>Doktorica Amra</b><span>Reumatolog · Zdravstveni centar</span></div></div>`, { card: true });
  await bot('Poslušajte kratku poruku ljekara:');
  const v = await bot(`<div class="voice"><div class="play"><svg viewBox="0 0 14 14"><path d="M3 1l10 6-10 6z"/></svg></div><div class="wave">${wave()}</div></div><div class="dur">0:42</div>${stamp(false)}`, { fast: true, card: true });
  v.querySelector('.b').classList.remove('card');
  await bot(review('Fatima', 58, 'galina.avif', 5, 'Nakon sedmicu dana prestala sam se buditi od bolova u koljenima. Otišla sam u šetnju sa unucima, prvi put nakon par godina!'), { review: true });
  await bot(review('Amina', 62, 'irina.jpg', 4.5, 'Koljena su me mučila svaki dan. Posle kursa mi je postalo lakše hodati i penjati se uz stepenice.'), { review: true });
  await bot(review('Zilha', 55, 'inesa.jpg', 5, 'Svidjelo mi se što se krema lako nanosi. Jutarnja ukočenost je postala manja, ponovo šetam svaki dan.'), { review: true });
  await bot('Danas važi popust od <b>50%</b> — krema košta <b>30 BAM</b> umjesto 60 BAM. Plaćanje prilikom preuzimanja 📦');
  await bot('Da biste naručili, ostavite ime i broj telefona. Rezervisaću vam jedno pakovanje.');
  showForm();
}

// Forma se otvara iz chata kao prozor; zatvaranje prebacuje je u feed.
const modal = document.getElementById('orderModal');
const orderForm = document.getElementById('orderForm');
let inlineForm = null;
function showForm() {
  if (inlineForm) {
    modal.appendChild(orderForm);
    orderForm.classList.remove('inline-form');
    inlineForm.remove();
    inlineForm = null;
  }
  modal.classList.add('open');
}
function closeForm() {
  modal.classList.remove('open');
  if (inlineForm) return;
  inlineForm = document.createElement('div');
  inlineForm.className = 'form-message';
  inlineForm.innerHTML = `<div class="mini">${AV}</div>`;
  inlineForm.appendChild(orderForm);
  orderForm.classList.add('inline-form');
  chat.appendChild(inlineForm);
  down();
}
orderForm.querySelector('.form-close').addEventListener('click', closeForm);
modal.addEventListener('click', e => { if (e.target === modal) closeForm() });
document.addEventListener('keydown', e => { if (e.key === 'Escape' && modal.classList.contains('open')) closeForm() });
(function initForm() {
  const f = orderForm;
  let s = 599; const tm = f.querySelector('#tm');
  setInterval(() => { if (s > 0) s--; tm.textContent = String(Math.floor(s / 60)).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0') }, 1000);
  const fp = f.querySelector('#fp'), fn = f.querySelector('#fn');
  fp.addEventListener('input', () => {
    let d = fp.value.replace(/\D/g, ''); if (d.startsWith('387')) d = d.slice(3); d = d.slice(0, 8);
    let o = '+387'; if (d.length) o += ' ' + d.slice(0, 2); if (d.length >= 2) o += ' ' + d.slice(2, 5); if (d.length >= 5) o += ' ' + d.slice(5, 8);
    fp.value = d.length ? o : '';
  });
  f.addEventListener('submit', async e => {
    e.preventDefault();
    const n = fn.value.trim(), p = fp.value, okP = p.replace(/\D/g, '').length >= 11;
    fn.classList.toggle('err', !n); fp.classList.toggle('err', !okP);
    if (!n || !okP) return;
    const btn = f.querySelector('.go'); btn.disabled = true;
    try {
      const r = await fetch(f.action, { method: 'POST', body: new FormData(f) });
      if (!r.ok) throw 0;
    } catch (_) { btn.disabled = false; alert('Slanje narudžbe nije uspjelo, pokušajte ponovo'); return }
    modal.classList.remove('open');
    if (inlineForm) { inlineForm.remove(); inlineForm = null }
    f.classList.remove('inline-form');
    modal.appendChild(f);
    last = 'bot'; user(`${n}<br>${p}`);
    await bot(`Hvala, ${n}! ✅ Vaša narudžba je prihvaćena.`);
    await bot('Operator će vas pozvati u roku od 10 minuta radi potvrde narudžbe. Molimo vas da držite telefon pri ruci 📞');
    await bot('Želimo vam ugodan dan i dobro zdravlje! 🌿');
  });
})();

// Obavještenja „neko je kupio“
const BUYERS = [['Emir', 'Sarajevo'], ['Lejla', 'Banja Luka'], ['Haris', 'Tuzla'], ['Ajla', 'Zenica'], ['Dino', 'Mostar'], ['Maja', 'Bihać'], ['Adnan', 'Doboj'], ['Sanela', 'Bijeljina'], ['Tarik', 'Trebinje'], ['Merima', 'Brčko']];
const toast = document.getElementById('toast');
let ti = 0;
function showToast() {
  const k = ti++ % BUYERS.length, [n, c] = BUYERS[k];
  toast.innerHTML = `<img class="toast-avatar" src="images/clients/${k + 1}.jpg" alt="" onerror="this.outerHTML='<div class=&quot;ph toast-avatar&quot;>${n[0]}</div>'"><div class="toast-copy"><span class="toast-label">Nedavno naručili</span><div><b>${n}</b> iz ${c}</div><span class="toast-product-name">Krema „BoneControl“</span><small>${1 + Math.floor(Math.random() * 9)} min. prije</small></div><img class="pr" src="images/prod.png" alt="BoneControl">`;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 4500);
}
setTimeout(function loop() { showToast(); setTimeout(loop, 14000 + Math.random() * 8000) }, 9000);

run();