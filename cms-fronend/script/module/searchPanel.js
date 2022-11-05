import {getData} from './fetchRequest.js';
import {renderGoods} from './render.js';

const searchPanel = document.querySelector('.panel__input');

let time;

searchPanel.addEventListener('input', e => {
  clearTimeout(time);
  time = setTimeout(() => {
    getData(`goods?search=${e.target.value}`, renderGoods);
  }, 300);
});
