import * as AFRAME from 'aframe';
import Tree from './Tree';

AFRAME.registerComponent('growable', {
	init: function () {
		var el:Element = this.el;
		var tree:Tree = Object(this.el).tree;
		console.log('event');
		el.addEventListener('click', function () {
			tree.grow(0.2).render();
		});
	},
});