import fn1 from './fn1'
import md from '../md/webpack.md'
import img from '../img/1.jpg'

fn1();

document.body.innerHTML = md;

console.log(img)

let flag = new Image();
flag.src = img
document.body.append(flag)