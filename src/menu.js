import * as AFRAME from 'aframe';
import Vector from './Vector';
import './focus.js';

AFRAME.registerComponent('menu', {
	schema: {
    tools: {type: 'array', default: []},
		tool: {type: 'string', default: 'none'},
		visible: {type: 'boolean', default: false},
  },
	update: function (old) {
		this.el.setAttribute('visible', this.data.visible);
		if (!old.visible && this.data.visible) {
			var camera = this.el.sceneEl.systems.camera.activeCameraEl;
			this.el.setAttribute('rotation', camera.getAttribute('rotation'));
			this.el.setAttribute('position', camera.getAttribute('position'));
		}
		if (!old.tools || old.tools.length !== this.data.tools.length) {
			while(this.el.firstChild){
				this.el.removeChild(this.el.firstChild);
			}
			/*var els = this.el.childNodes;
			for (var i = 0; i < els.length; i++) {
				this.el.removeChild(els[i]);
			}*/
			var section = 360 / this.data.tools.length;
			for (var i = 0; i < this.data.tools.length; i++) {
				var tool = document.createElement('a-entity');
				tool.setAttribute('tool', true);
				tool.setAttribute('tool-' + this.data.tools[i], true);
				tool.setAttribute('geometry', {
					primitive: 'ring',
					radiusInner: 0.06,
					radiusOuter: 0.2,
					thetaStart: i * section + 1,
					thetaLength: section - 2,
				});
				this.el.appendChild(tool);
			}
		}
	},
	init: function () {
		var el = this.el;
		this.el.sceneEl.addEventListener('click', function (evt) {
			if (!el.sceneEl.systems.focus.target()) {
				if (el.getAttribute('active')) {
					el.removeAttribute('active');
				} else {
					el.setAttribute('active');
				}
			} else {
				el.removeAttribute('active');
			}
		});
	},
});

AFRAME.registerPrimitive('a-menu', {
	defaultComponents: {
		menu: {},
	},
	mappings: {
		tools: 'menu.tools',
		tool: 'menu.tool',
		active: 'menu.visible',
	},
});

AFRAME.registerComponent('tool', {
	init: function () {
    var el = this.el;
		this.el.setAttribute('focustarget', true);
		this.el.setAttribute('position', {
			x: 0,
			y: 0,
			z: -0.3,
		});
		this.el.setAttribute('material', {
			shader: 'flat',
			side: 'front',
			color: 'white',
      repeat: {x: 2, y: 2},
		});
    this.el.addEventListener('mouseenter', function () {
      el.setAttribute('position', 'z', -0.25);
    });
    this.el.addEventListener('mouseleave', function () {
      el.setAttribute('position', 'z', -0.3);
    });
	}
});

AFRAME.registerComponent('tool-water', {
	
});
AFRAME.registerComponent('tool-test', {});
AFRAME.registerComponent('tool-place', {
	init: function () {
		this.el.setAttribute('material', 'src', '#placeIcon');
	},
});