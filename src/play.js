import 'aframe';
import 'aframe-extras/dist/aframe-extras.controls';
import './menu.js';
import './focus.js';
import './plantable.js';

(function (AFRAME) {
var controls = AFRAME.components['touch-controls'].Component.prototype;
var protoInit = controls.init;
controls.init = function () {
  protoInit.bind(this)();
  var self = this;
  this.el.addEventListener('raycaster-intersection', function (e) {
    var distance = e.detail.intersections[0].distance;
    if (distance < self.el.getAttribute('raycaster').far) {
      self.data.enabled = false;
    } else {
      self.data.enabled = true;
    }
  });
  this.el.addEventListener('raycaster-intersection-cleared', function (e) {
    self.data.enabled = true;
  });
};


})(AFRAME);