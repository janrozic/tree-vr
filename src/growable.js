AFRAME.registerComponent('growable', {
	init: function () {
		var el = this.el;
		var tree = this.el.tree;
		/*var interval = false;
		var timeout = false;
		var stop = function () {
			if (interval) {
				window.cancelAnimationFrame(interval);
			}
			if (timeout) {
				window.clearTimeout(timeout);
			}
		};*/
		el.addEventListener('click', function () {
      tree.grow(0.2).render();
		});
		el.addEventListener('mouseenter', function () {
      el.setAttribute('material', 'visible', true);
			/*stop();
			timeout = window.setTimeout(function () {
				stop();
				var previous = false;
				function grow (timestamp) {
					if (!previous) {
						previous = timestamp;
					}
					var elapsed = (timestamp - previous) * 0.001;	//in seconds
					if (elapsed > 1) {//1 fps is enough for now
						//0.1 m / s, but max 0.3m (to avoid surprises)
						tree.grow(Math.min(0.3,
							elapsed * 0.1	// distance = speed * time
						)).render();
						previous = timestamp;
					}
					interval = window.requestAnimationFrame(grow);
				};
				interval = window.requestAnimationFrame(grow);
			}, 3000);*/
		});
		el.addEventListener('mouseleave', function () {
			el.setAttribute('material', 'visible', false);
			//stop();
		});
	},
});