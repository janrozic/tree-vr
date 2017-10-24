import 'aframe';
import 'aframe-extras/dist/aframe-extras.controls';
import Tree from './Tree';
import Vector from './Vector';

AFRAME.registerComponent('plantable', {
	init: function () {
    var scene = this.el.sceneEl;
		var controls = document.querySelector('[universal-controls]');
    var disk = document.createElement('a-entity');
    var basis = new Vector().setFromObject(this.el.getAttribute('position'));
    disk.setAttribute('geometry', {
      primitive: 'cylinder',
      radius: 1,
      height: 0.02,
      segmentsHeight: 1,
    });
    //disk.setAttribute('rotation', '90 0 0');
    disk.setAttribute('material', {
      shader: 'flat',
      color: 'blue',
      transparent: true,
      opacity: 0.25,
      visible: false,
    });
    disk.addEventListener('click', function (event) {
      var point = event.detail.intersection.point;
      point.y = basis.y;
      new Tree().place(scene, new Vector().setFromObject(point)).render();
    });
    scene.appendChild(disk);
		disk.addEventListener('mouseleave', function () {
      disk.setAttribute('material', 'visible', false);
			//controls.setAttribute('universal-controls', 'movementControls', ['gamepad', 'keyboard', 'touch', 'hmd']);
			controls.setAttribute('universal-controls', 'movementEnabled', true);
		});
		disk.addEventListener('mouseenter', function () {
			disk.setAttribute('material', 'visible', true);
			//controls.setAttribute('movementControls', ['gamepad', 'keyboard', 'hmd']);
			controls.setAttribute('universal-controls', 'movementEnabled', false);
		});
		this.el.addEventListener('raycaster-intersected', function (evt) {
      if (evt.detail.intersection.distance > 5) {
        disk.setAttribute('material', 'visible', false);
      } else {
        var p = new Vector().setFromObject(evt.detail.intersection.point);
        disk.setAttribute('position', {
          x: p.x,
          y: p.y,
          z: p.z,
        });
				if (!disk.getAttribute('material').visible) {
					disk.emit('mouseenter');
				}
      }
		});
  }
});