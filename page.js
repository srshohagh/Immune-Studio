(function(){
  var still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var yr = document.getElementById('yr'); if (yr) yr.textContent = new Date().getFullYear();
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

  // ---- founder card: 3D tilt + spotlight, only while the pointer is on the card ----
  var st = document.getElementById('stage'), fr = document.getElementById('frame');
  if (st && fr) {
    st.addEventListener('pointermove', function(e){
      var r = st.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
      fr.style.transform = 'rotateX(' + ((.5 - y) * 16).toFixed(1) + 'deg) rotateY(' + ((x - .5) * 20).toFixed(1) + 'deg)';
      fr.style.setProperty('--mx', (x * 100) + '%'); fr.style.setProperty('--my', (y * 100) + '%'); st.classList.add('hot');
    });
    st.addEventListener('pointerleave', function(){ fr.style.transform = ''; st.classList.remove('hot'); });
  }
})();
