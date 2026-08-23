/* Theme toggle */
(function() {
	var btn = document.getElementById('theme-toggle');
	var saved = localStorage.getItem('theme');
	var prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
	var dark = saved ? saved === 'dark' : prefersDark;

	function apply(isDark) {
		document.documentElement.classList.toggle('dark-mode', isDark);
		btn.textContent = isDark ? '☀' : '🌙';
		btn.setAttribute('aria-pressed', isDark ? 'true' : 'false');
		btn.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
	}

	apply(dark);

	btn.addEventListener('click', function() {
		dark = !dark;
		localStorage.setItem('theme', dark ? 'dark' : 'light');
		apply(dark);
	});
})();

/* Drop the preload class so CSS transitions can run */
window.addEventListener('load', function() {
	setTimeout(function() {
		document.body.classList.remove('is-preload');
	}, 100);
});

/* Play publication videos only while they are on screen */
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

/* News: expand the collapsed list */
(function() {
	var wrap = document.querySelector('.news-scroll');
	var btn = document.getElementById('news-toggle');
	if (!wrap || !btn) return;

	// Nothing hidden? Drop the control entirely.
	if (wrap.scrollHeight <= wrap.clientHeight + 4) {
		wrap.classList.add('is-expanded');
		btn.remove();
		return;
	}

	btn.hidden = false;
	btn.addEventListener('click', function() {
		var expanded = wrap.classList.toggle('is-expanded');
		btn.setAttribute('aria-expanded', expanded ? 'true' : 'false');
		btn.textContent = expanded ? 'Show less' : 'Show all news';
	});
})();

/* Header parallax — desktop only, and only the photo layer moves */
(function() {
	var header = document.getElementById('header');
	if (!header) return;

	var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
	var coarse = window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
	if (reduce || coarse) return;

	var ticking = false;

	function update() {
		ticking = false;
		if (window.innerWidth <= 980) {
			header.style.backgroundPosition = '';
			return;
		}
		var offset = window.scrollY / 20;
		// Layer order must match custom.css: gradient, overlay, photo.
		header.style.backgroundPosition = 'center, top left, center calc(50% + ' + offset.toFixed(1) + 'px)';
	}

	window.addEventListener('scroll', function() {
		if (!ticking) {
			ticking = true;
			window.requestAnimationFrame(update);
		}
	}, { passive: true });

	window.addEventListener('resize', update);
	update();
})();
