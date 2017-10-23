import 'aframe';
import 'aframe-extras/dist/aframe-extras.controls';
import Tree from './Tree';
var a = new Tree();
var b = new Tree();
var c = new Tree();
/*document.addEventListener('click', function () {
});*/
a.place(0, -3);
b.place(-3, -4);
c.place(3, -3);
for (var i = 0; i < 10; i++) {
	a.grow(0.1);
	b.grow(0.1);
	c.grow(0.1);
}
window.setTimeout(function () {
	a.render();
	b.render();
	c.render();
}, 2000);