(function(){
  var still = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // marquee + year
  var words = ['Real estate','E-commerce','Restaurants','Showrooms','Resorts','Factories','Garments','Startups','SMEs'];
  var t = document.getElementById('track');
  t.innerHTML = words.concat(words).map(function(w){return '<span>'+w+'</span>';}).join('');
  document.getElementById('yr').textContent = new Date().getFullYear();

  // whatsapp form
  document.getElementById('cf').addEventListener('submit', function(e){
    e.preventDefault();
    var msg = 'Hello Immune Studio, I am ' + n.value + '.\nBusiness: ' + b.value + '\n' + (m.value || 'I would like my free reel.');
    window.open('https://wa.me/8801942319600?text=' + encodeURIComponent(msg), '_blank', 'noopener');
  });

  // scroll reveal
  var io = new IntersectionObserver(function(es){
    es.forEach(function(x){ if(x.isIntersecting){ x.target.classList.add('in'); io.unobserve(x.target); } });
  }, {threshold:.12});
  document.querySelectorAll('.rv').forEach(function(el){ io.observe(el); });

  // ---- page background: drifting dotted wave (reference 1) ----
  var bg = document.getElementById('bg'), bx = bg.getContext('2d'), BW, BH, mx = -999, my = -999;
  function sizeBg(){ BW = bg.width = innerWidth; BH = bg.height = innerHeight; }
  sizeBg(); addEventListener('resize', sizeBg);
  addEventListener('pointermove', function(e){ mx = e.clientX; my = e.clientY; });
  function wave(time){
    var s = 20, tt = time * 0.00022;
    bx.clearRect(0, 0, BW, BH);
    var g = bx.createLinearGradient(0, 0, BW, BH);
    g.addColorStop(0, '#0b0b0c'); g.addColorStop(.6, '#121315'); g.addColorStop(1, '#1e2023');
    bx.fillStyle = g; bx.fillRect(0, 0, BW, BH);
    for (var y = 0; y < BH + s; y += s) {
      for (var x = 0; x < BW + s; x += s) {
        var z = Math.sin(x * 0.007 + tt * 3) * Math.cos(y * 0.005 - tt * 2) + Math.sin((x + y) * 0.004 + tt);
        var k = (z + 2) / 4;                       // 0..1
        var dx = x - mx, dy = y - my, d = Math.sqrt(dx * dx + dy * dy);
        var lift = d < 150 ? (1 - d / 150) : 0;     // dots swell near the pointer
        var r = 0.5 + k * 1.5 + lift * 1.6;
        bx.fillStyle = 'rgba(210,214,222,' + (0.05 + k * k * 0.5 + lift * 0.35) + ')';
        bx.beginPath(); bx.arc(x, y + (z - 1) * 7, r, 0, 6.283); bx.fill();
      }
    }
    if (!still) requestAnimationFrame(wave);
  }
  requestAnimationFrame(wave);

  // ---- header: moving constellation network, hover creates links (reference 2) ----
  var nc = document.getElementById('net'), nx = nc.getContext('2d'), W, H, pts = [], pm = {x:-999, y:-999, on:false};
  function sizeNet(){
    var r = nc.parentElement.getBoundingClientRect();
    W = nc.width = r.width; H = nc.height = r.height;
    var n = Math.min(110, Math.floor(W * H / 14000)); pts = [];
    for (var i = 0; i < n; i++) pts.push({x:Math.random()*W, y:Math.random()*H, vx:(Math.random()-.5)*.35, vy:(Math.random()-.5)*.35, r:Math.random()*1.6+.8});
  }
  sizeNet(); addEventListener('resize', sizeNet);
  nc.addEventListener('pointermove', function(e){ var r = nc.getBoundingClientRect(); pm.x = e.clientX - r.left; pm.y = e.clientY - r.top; pm.on = true; });
  nc.addEventListener('pointerleave', function(){ pm.on = false; });
  nc.addEventListener('click', function(){ for (var i = 0; i < 4; i++) pts.push({x:pm.x, y:pm.y, vx:(Math.random()-.5)*1.6, vy:(Math.random()-.5)*1.6, r:2}); if (pts.length > 150) pts.splice(0, 4); });
  function net(){
    nx.clearRect(0, 0, W, H);
    for (var i = 0; i < pts.length; i++) {
      var p = pts[i];
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;
      var near = 0;
      if (pm.on) {
        var dx = pm.x - p.x, dy = pm.y - p.y, d = Math.sqrt(dx*dx + dy*dy);
        if (d < 190) { near = 1 - d / 190; p.x += dx * 0.004 * near; p.y += dy * 0.004 * near;
          nx.strokeStyle = 'rgba(255,255,255,' + near * .75 + ')'; nx.lineWidth = 1;
          nx.beginPath(); nx.moveTo(p.x, p.y); nx.lineTo(pm.x, pm.y); nx.stroke(); }
      }
      for (var j = i + 1; j < pts.length; j++) {
        var q = pts[j], ax = p.x - q.x, ay = p.y - q.y, dd = ax*ax + ay*ay;
        if (dd < 17000) { nx.strokeStyle = 'rgba(255,255,255,' + (1 - dd / 17000) * (.28 + near * .5) + ')'; nx.lineWidth = .7;
          nx.beginPath(); nx.moveTo(p.x, p.y); nx.lineTo(q.x, q.y); nx.stroke(); }
      }
      nx.fillStyle = 'rgba(255,255,255,' + (.55 + near * .45) + ')';
      nx.shadowColor = '#fff'; nx.shadowBlur = near ? 12 : 4;
      nx.beginPath(); nx.arc(p.x, p.y, p.r + near * 2, 0, 6.283); nx.fill();
    }
    nx.shadowBlur = 0;
    if (!still) requestAnimationFrame(net);
  }
  net();
})();
