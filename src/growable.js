AFRAME.registerComponent('growable', {
	init: function () {
		var el = this.el;
		var tree = this.el.tree;
		el.addEventListener('click', function (evt) {
      tree.grow(0.2).render();
		});
		el.addEventListener('mouseenter', function (evt) {
      el.setAttribute('material', 'visible', true);
		});
		el.addEventListener('mouseleave', function () {
			el.setAttribute('material', 'visible', false);
		});
	},
});