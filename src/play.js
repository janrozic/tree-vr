import 'aframe';
import 'aframe-extras/dist/aframe-extras.controls';
import Tree from './Tree';
import Vector from './Vector';

AFRAME.registerComponent('plantable', {
	init: function () {
    var scene = this.el.sceneEl;
    this.el.addEventListener('click', function (event) {
      var point = event.detail.intersection.point;
      console.log(
        new Tree().place(scene, new Vector(point.x, point.y, point.z)).render()
      );
		});
  }
});