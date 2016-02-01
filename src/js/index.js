import Sprite from './Sprite';
import Animator from './Animator';

const canvas = document.getElementById('canvas');
canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;

const bob = new Sprite({x: 100, y: 100, width: 10, height: 10, dx: 10, color: '#4a0'});

new Animator(canvas, Sprite.objects).start();