import 'aframe';
import 'aframe-extras/dist/aframe-extras.controls';
import Tree from './Tree';
var a = new Tree();
/*document.addEventListener('click', function () {
});*/
a.place(0, -3);
for (var i = 0; i < 530; i++) {
	a.grow(0.03333);
}
window.setTimeout(function () {
	a.render();
}, 2000);
window.a = a;