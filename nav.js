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
})();
