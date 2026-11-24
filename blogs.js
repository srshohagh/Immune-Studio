(function(){
  var CATS = ['All', 'Cameras', 'Drones', 'Audio and Light', 'Marketing', 'Tech and AI'];
  var PROMO = [
    ['Turn trends into content', 'Seen a new camera or drone? We turn ideas like these into reels and ads for your brand.', 'Get a free reel', 'index.html#contact'],
    ['Need ads that perform?', 'Meta and Google campaigns with creative, targeting and tracking built in.', 'See our services', 'index.html#services'],
    ['Real estate or factory?', 'Cinematic films and aerial shots that help your project stand out.', 'See our work', 'index.html#work']
  ];
  var grid = document.getElementById('ngrid'), fl = document.getElementById('fl'), more = document.getElementById('more'), upd = document.getElementById('upd');
  var items = [], cat = 'All', shown = 12;
  function esc(s){ return String(s || '').replace(/[&<>"']/g, function(c){ return {'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[c]; }); }
  function ago(iso){
    var m = Math.max(1, Math.round((Date.now() - new Date(iso)) / 60000));
    if (m < 60) return m + ' min ago'; var h = Math.round(m / 60);
    return h < 24 ? h + ' h ago' : Math.round(h / 24) + ' d ago';
  }
  function card(i){
    return '<a class="nc g" href="' + esc(i.link) + '" target="_blank" rel="noopener noreferrer"><div class="th"><img class="ph" src="assets/immune-symbol-chrome.png" alt="">' +
      (i.img ? '<img class="pic" src="' + esc(i.img) + '" alt="" loading="lazy" referrerpolicy="no-referrer" onerror="this.remove()">' : '') +
      '<b>' + esc(i.cat) + '</b></div><div class="bd"><small>' + esc(i.source) + ' · ' + ago(i.date) + '</small><h3>' + esc(i.title) + '</h3><p>' + esc(i.summary) +
      '</p><span class="go">Read on ' + esc(i.source) + '</span></div></a>';
  }
  function promo(k){ var p = PROMO[k % PROMO.length];
    return '<div class="nc g promo"><h3>' + p[0] + '</h3><p>' + p[1] + '</p><a class="btn solid" href="' + p[3] + '">' + p[2] + '</a></div>'; }
  function render(){
    var list = items.filter(function(i){ return cat === 'All' || i.cat === cat; });
    if (!list.length) { grid.innerHTML = '<div class="empty g">' + (items.length ? 'No stories in this category right now. Try another one.' : 'Fresh stories are being gathered. Please check back in a little while.') + '</div>'; more.hidden = true; return; }
    var out = '', vis = list.slice(0, shown);
    vis.forEach(function(i, k){ out += card(i); if ((k + 1) % 6 === 0 && k + 1 < vis.length) out += promo((k + 1) / 6 - 1); });
    grid.innerHTML = out; more.hidden = list.length <= shown;
  }
  CATS.forEach(function(c){
    var b = document.createElement('button'); b.type = 'button'; b.textContent = c; if (c === 'All') b.className = 'on';
    b.addEventListener('click', function(){ cat = c; shown = 12; Array.prototype.forEach.call(fl.children, function(x){ x.classList.toggle('on', x === b); }); render(); });
    fl.appendChild(b);
  });
  more.addEventListener('click', function(){ shown += 12; render(); });
  fetch('data/news.json?v=' + Math.floor(Date.now() / 3600000)).then(function(r){ return r.json(); }).then(function(d){
    items = d.items || []; upd.innerHTML = '<i></i>' + (d.updated ? 'Updated ' + ago(d.updated) : 'News feed starting soon'); render();
  }).catch(function(){ upd.innerHTML = '<i></i>News feed unavailable'; render(); });
})();
