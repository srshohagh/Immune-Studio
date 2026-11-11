(function(){
  var dds = document.querySelectorAll('.dd');
  function closeAll(){ dds.forEach(function(d){ d.classList.remove('open'); d.querySelector('.ddbtn').setAttribute('aria-expanded', 'false'); }); }
  dds.forEach(function(d){
    d.querySelector('.ddbtn').addEventListener('click', function(e){
      e.stopPropagation(); var o = !d.classList.contains('open'); closeAll();
      if (o) { d.classList.add('open'); this.setAttribute('aria-expanded', 'true'); }
    });
  });
  document.addEventListener('click', closeAll);
  addEventListener('keydown', function(e){ if (e.key === 'Escape') closeAll(); });
  var nav = document.querySelector('.nav'), last = scrollY;
  if (nav) addEventListener('scroll', function(){
    var y = scrollY, open = nav.querySelector('.dd.open');
    if (y > last + 6 && y > 90 && !open) nav.classList.add('hide');
    else if (y < last - 6 || y < 60) nav.classList.remove('hide');
    nav.classList.toggle('solid', y > 40); last = y;
  }, {passive: true});
})();
