document.querySelectorAll('.nav-btn').forEach(function(btn) {
  btn.addEventListener('click', function() {
    document.querySelectorAll('.nav-btn').forEach(function(b) { b.classList.remove('active'); });
    document.querySelectorAll('.page').forEach(function(p) { p.classList.remove('active'); });

    btn.classList.add('active');
    document.getElementById(btn.dataset.target).classList.add('active');
  });
});
