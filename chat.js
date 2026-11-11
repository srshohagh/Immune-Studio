(function(){
  var WA = '8801942319600', FB = 'https://www.facebook.com/share/1UAmAy9J2i/', LOGO = 'assets/immune-symbol-chrome.png';
  var MAIN = ['Tell me about the services', 'I want a quote', 'I want to schedule a short meeting'];
  var hr = new Date().getHours(), GREET = hr < 12 ? 'Good Morning' : hr < 17 ? 'Good Afternoon' : 'Good Evening';
  var ARW = '<svg viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
  var root = document.createElement('div'); root.className = 'cb';
  root.innerHTML =
    '<button class="cb-fab" type="button" aria-label="Chat with Immune Studio" aria-expanded="false"><canvas class="cb-orb" width="148" height="148"></canvas><img src="' + LOGO + '" alt=""></button>' +
    '<section class="cb-panel" role="dialog" aria-label="Immune Studio assistant" aria-hidden="true"><div class="cb-bg"></div><div class="cb-dots"></div>' +
    '<header class="cb-head"><div class="cb-id"><span class="cb-av"><img src="' + LOGO + '" alt=""></span><div><b>Immune Assistant</b><small><i></i>Online · instant answers</small></div></div>' +
    '<div class="cb-hb"><button type="button" class="cb-new" aria-label="New chat"><svg viewBox="0 0 24 24"><path d="M4 12a8 8 0 1 0 3-6.2M4 4v4h4"/></svg></button><button type="button" class="cb-x" aria-label="Close"><svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6 6 18"/></svg></button></div></header>' +
    '<div class="cb-body"><div class="cb-hero"><img class="cb-hl" src="' + LOGO + '" alt=""><h2>' + GREET + '</h2><p>How can I help you today?</p><div class="cb-pres">' +
    MAIN.map(function(q, i){ return '<button type="button" class="cb-pre" style="--i:' + i + '"><span>' + q + '</span>' + ARW + '</button>'; }).join('') +
    '</div></div><div class="cb-thread"></div></div><div class="cb-qr"></div>' +
    '<form class="cb-input" autocomplete="off"><input type="text" placeholder="How can I help you today?" aria-label="Type your message"><div class="cb-row"><button type="button" class="cb-plus" aria-label="More options">+</button>' +
    '<div class="cb-menu"><a href="https://wa.me/' + WA + '" target="_blank" rel="noopener">Chat on WhatsApp</a><a href="tel:+' + WA + '">Call us</a><a href="' + FB + '" target="_blank" rel="noopener">Facebook page</a></div>' +
    '<span class="cb-tag">Instant answers</span><button class="cb-send" type="submit" aria-label="Send">' + ARW + '</button></div></form>' +
    '<p class="cb-note">Guided assistant. For anything custom, our team replies on WhatsApp.</p></section>';
  document.body.appendChild(root);
  var $ = function(s){ return root.querySelector(s); };
  var fab = $('.cb-fab'), panel = $('.cb-panel'), body = $('.cb-body'), thread = $('.cb-thread'), qr = $('.cb-qr'), inp = $('.cb-input input'), menu = $('.cb-menu');
  var S = {flow: null, step: 0, d: {}}, busy = false;

  function toEnd(){ body.scrollTo({top: body.scrollHeight, behavior: 'smooth'}); }
  function setQR(list){ qr.innerHTML = ''; (list || []).forEach(function(q){ var b = document.createElement('button'); b.type = 'button'; b.textContent = q; qr.appendChild(b); }); }
  function user(t){ var d = document.createElement('div'); d.className = 'm u'; d.textContent = t; thread.appendChild(d); toEnd(); }
  function bot(text, o){
    o = o || {}; busy = true; setQR([]);
    var m = document.createElement('div'); m.className = 'm b tp'; m.innerHTML = '<span></span><span></span><span></span>'; thread.appendChild(m); toEnd();
    setTimeout(function(){
      m.className = 'm b'; m.textContent = text;
      if (o.links) { var a = document.createElement('div'); a.className = 'acts';
        o.links.forEach(function(l){ var x = document.createElement('a'); x.textContent = l[0]; x.href = l[1]; if (/^http/.test(l[1])) { x.target = '_blank'; x.rel = 'noopener'; } a.appendChild(x); }); m.appendChild(a); }
      busy = false; setQR(o.chips); toEnd();
    }, 550 + Math.min(text.length * 7, 700));
  }
  var WAL = ['Chat on WhatsApp', 'https://wa.me/' + WA];
  function services(){ bot('Here is what Immune Studio does:\n• Reels and storytelling videos\n• Real estate ad marketing\n• Meta and Google ads\n• Brand promotion and design\n• Social media management\n• Websites, apps and AI automation\n\nWe work with real estate, showrooms, restaurants, factories, fashion brands and startups.', {chips: ['I want a quote', 'See pricing', 'I want to schedule a short meeting']}); }
  function pricing(){ bot('Starting prices (remote work is quoted in GBP):\n• Social media management: £40–60 per month\n• Meta Ads service charge: from £100\n• Promo video: from £150\n• Websites: from £150, mobile apps: from £220\n\nLocal BDT pricing is available on request. Final prices depend on the project.', {chips: ['I want a quote', 'I want to schedule a short meeting']}); }
  function freeReel(){ bot('Yes, we create your first 1–1.5 minute reel for free. If you like it, we continue project by project, and every delivery includes 10 days of free support.', {chips: ['I want a quote', 'Tell me about the services']}); }
  function contact(){ bot('You can reach the team here:\n• WhatsApp and phone: +880 1942-319600', {links: [WAL, ['Facebook page', FB]]}); }
  function founder(){ bot('Immune Studio is led by founder Muhammad Rakib.', {links: [['Meet the team', 'team.html']], chips: MAIN}); }
  function fallback(){ bot('I am not sure about that one, but our team can help directly. Message them on WhatsApp, or pick one of these.', {links: [WAL], chips: MAIN}); }
  function quoteStart(){ S = {flow: 'quote', step: 0, d: {}}; bot('Happy to prepare a quote. First, what is your name?'); }
  function meetStart(){ S = {flow: 'meet', step: 0, d: {}}; bot('Let us set up a short meeting. What is your name?'); }
  function end(title, lines){
    S = {flow: null, step: 0, d: {}};
    var msg = ['Hello Immune Studio, I would like to request: ' + title].concat(lines).join('\n');
    bot('Thanks! Here is your request:\n' + lines.map(function(l){ return '• ' + l; }).join('\n') + '\n\nTap below to send it on WhatsApp and our team will confirm the details.',
      {links: [['Send on WhatsApp', 'https://wa.me/' + WA + '?text=' + encodeURIComponent(msg)]], chips: ['Tell me about the services']});
  }
  function flow(q){
    var d = S.d, s = S.step;
    if (S.flow === 'quote') {
      if (s === 0) { d.name = q; S.step = 1; return bot('Nice to meet you, ' + q + '. What is your business name or page link?'); }
      if (s === 1) { d.biz = q; S.step = 2; return bot('What do you need?', {chips: ['Reels and videos', 'Ads (Meta and Google)', 'Branding and design', 'Website or app', 'Something else']}); }
      if (s === 2) { d.need = q; S.step = 3; return bot('Any budget or deadline in mind? You can skip this.', {chips: ['Skip']}); }
      return end('a quote', ['Name: ' + d.name, 'Business: ' + d.biz, 'Needs: ' + d.need, 'Budget or deadline: ' + (/^skip$/i.test(q) ? 'Not specified' : q)]);
    }
    if (s === 0) { d.name = q; S.step = 1; return bot('Thanks, ' + q + '. Which day suits you?', {chips: ['Today', 'Tomorrow', 'This week']}); }
    if (s === 1) { d.day = q; S.step = 2; return bot('What time works best? (Dhaka time)', {chips: ['Morning', 'Afternoon', 'Evening']}); }
    end('a short meeting', ['Name: ' + d.name, 'Preferred day: ' + d.day, 'Preferred time (Dhaka): ' + q]);
  }
  function route(q){
    var t = q.toLowerCase();
    if (S.flow) return flow(q);
    if (/quote/.test(t)) return quoteStart();
    if (/meet|schedule|appointment|book|call/.test(t)) return meetStart();
    if (/service|offer|what do you|what can/.test(t)) return services();
    if (/price|pricing|cost|how much|rate|budget|package/.test(t)) return pricing();
    if (/reel|free|sample/.test(t)) return freeReel();
    if (/contact|whatsapp|phone|number|reach|facebook|email/.test(t)) return contact();
    if (/team|founder|owner|who/.test(t)) return founder();
    if (/^(hi|hello|hey|salam|assalam)/.test(t)) return bot('Hello! I am the Immune Studio assistant. What would you like to know?', {chips: MAIN});
    fallback();
  }
  function ask(q){ q = (q || '').trim(); if (!q || busy) return; root.classList.add('chatting'); user(q); inp.value = ''; route(q); }
  function open(o){ root.classList.toggle('open', o); fab.setAttribute('aria-expanded', o); panel.setAttribute('aria-hidden', !o); menu.classList.remove('show'); if (o) setTimeout(function(){ inp.focus({preventScroll: true}); }, 420); }


  // ---- particle sphere around the logo (wavy dotted globe) ----
  var oc = $('.cb-orb'), ox = oc.getContext('2d'), P = [], N = 300, still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  for (var i = 0; i < N; i++) { var yy = 1 - (i / (N - 1)) * 2, rr = Math.sqrt(1 - yy * yy), th = i * 2.399963; P.push([Math.cos(th) * rr, yy, Math.sin(th) * rr]); }
  function orb(t){
    var s = oc.width, c = s / 2, R = s * .39, a = t * .0004, ca = Math.cos(a), sa = Math.sin(a), ct = Math.cos(.55), st = Math.sin(.55);
    ox.clearRect(0, 0, s, s);
    for (var k = 0; k < N; k++) {
      var p = P[k], x = p[0], y = p[1], z = p[2];
      var w = 1 + .13 * Math.sin(3 * x + t * .0012) * Math.cos(2 * y + t * .001) + .06 * Math.sin(5 * z - t * .0015);
      x *= w; y *= w; z *= w;
      var x1 = x * ca + z * sa, z1 = -x * sa + z * ca, y2 = y * ct - z1 * st, z2 = y * st + z1 * ct;
      var rim = Math.max(0, 1 - Math.abs(z2) / 1.15), al = .1 + .9 * Math.pow(rim, 2.2);
      ox.fillStyle = 'rgba(255,255,255,' + al.toFixed(2) + ')';
      ox.beginPath(); ox.arc(c + x1 * R, c + y2 * R, (.55 + 1.1 * rim) * (s / 74), 0, 6.283); ox.fill();
    }
    if (!still) requestAnimationFrame(orb);
  }
  requestAnimationFrame(orb);
  fab.addEventListener('click', function(){ open(!root.classList.contains('open')); });
  $('.cb-x').addEventListener('click', function(){ open(false); });
  $('.cb-new').addEventListener('click', function(){ thread.innerHTML = ''; setQR([]); S = {flow: null, step: 0, d: {}}; busy = false; root.classList.remove('chatting'); });
  $('.cb-input').addEventListener('submit', function(e){ e.preventDefault(); ask(inp.value); });
  root.addEventListener('click', function(e){
    var b = e.target.closest('.cb-pre, .cb-qr button'); if (b) ask(b.textContent);
    if (e.target.closest('.cb-plus')) menu.classList.toggle('show'); else if (!e.target.closest('.cb-menu')) menu.classList.remove('show');
  });
  addEventListener('keydown', function(e){ if (e.key === 'Escape') open(false); });
})();
