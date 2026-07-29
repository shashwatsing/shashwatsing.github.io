(function() {
	var btn = document.getElementById('theme-toggle');
	var saved = localStorage.getItem('theme');
	var prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
	var dark = saved ? saved === 'dark' : prefersDark;

	function apply(isDark) {
		document.documentElement.classList.toggle('dark-mode', isDark);
		btn.textContent = isDark ? '☀' : '🌙';
	}

	apply(dark);

	btn.addEventListener('click', function() {
		dark = !dark;
		localStorage.setItem('theme', dark ? 'dark' : 'light');
		apply(dark);
	});
})();

(function() {
	var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
	var vids = document.querySelectorAll('.pub-thumb video');
	if (reduce || !('IntersectionObserver' in window)) return;

	var io = new IntersectionObserver(function(entries) {
		entries.forEach(function(entry) {
			var v = entry.target;
			if (entry.isIntersecting) {
				if (v.preload !== 'auto') v.preload = 'auto';
				var p = v.play();
				if (p && p.catch) p.catch(function(){});
			} else {
				v.pause();
			}
		});
	}, { threshold: 0.25 });

	vids.forEach(function(v) { io.observe(v); });
})();
