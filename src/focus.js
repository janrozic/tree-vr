import * as AFRAME from 'aframe';

AFRAME.registerSystem('focus', {
	schema: {
		target: {default: false},
	},
	clear: function () {
		this.set(false);
	},
	set: function(target) {
		this.data.target = target;
	},
	target: function () {
		return this.data.target;
	},
});

AFRAME.registerComponent('focustarget', {
	schema: {},
	init: function () {
		var el = this.el;
		this.el.addEventListener('raycaster-intersected', function () {
			el.sceneEl.systems.focus.set(el);
		});
		this.el.addEventListener('raycaster-intersected-cleared', function () {
			el.sceneEl.systems.focus.clear();
		});
	},
});